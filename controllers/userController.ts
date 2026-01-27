import msgError from "../utilities/msgError.js";
import type { RequestHandler } from "express";
import db from "../server/database.js"

const userController = {
    getUsers : (async (req,res,next) => {
        try {
            const database = await db.readDB()
            res.json(database.users)
          } catch (error) {
            if (error instanceof Error) return next(msgError(500, error.message));
            return next(msgError(500, "Unknown error occurred"))
          }
    } ) as RequestHandler,

    createUser : (async (req, res, next) => {
        try {
            const {name, username} = req.body
            if (!name || !username) return next(msgError(400, "name and username is required"))
          
            const database = await db.readDB()
            const user = { id: db.nextId(database.users), name, username }

            database.users.push(user)
          
            await db.writeDB(database)
            res.status(201).json(user)
        } catch (error) {
            if (error instanceof Error) return next(msgError(500, error.message));
            return next(msgError(500, "Unknown error occurred"))
        }
    }) as RequestHandler,

    getUser : (async (req,res,next) => {
        try {
            const id = Number(req.params.id)
            const database = await db.readDB()
            const user = database.users.find(u => u.id === id)

            if (!user) return next(msgError(404, "User not found"))

            const posts = database.userPosts.filter((p) => p.userId === id)
            res.json({...user, posts})
        } catch (error) {
            if (error instanceof Error) return next(msgError(500, error.message));
            return next(msgError(500, "Unknown error occurred"))
        }
    }) as RequestHandler,

    updateUser : (async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            if (Number.isNaN(id)) return next(msgError(400, "Invalid user id"));

            const username = String(req.body?.username ?? "").trim()
          
            const database = await db.readDB()
            const user = database.users.find(u => u.id === id)

            if (!user) return next(msgError(404,"User not found"))
          
            user.username = username
            await db.writeDB(database)
            res.json(user)
        } catch (error) {
            if (error instanceof Error) return next(msgError(500, error.message));
            return next(msgError(500, "Unknown error occurred"))
        }
    }) as RequestHandler,


    deleteUser : (async (req, res, next) => {
        try {
          const userId = Number(req.params.id)
          if (Number.isNaN(userId)) {
            return next(msgError(400, "Invalid user id"))
          }
      
          const database = await db.readDB()
      

          const userExists = database.users.some(u => u.id === userId)
          if (!userExists) return next(msgError(404, "User not found"));

          // collect user's post ids
          const userPostIds = database.userPosts
            .filter(post => post.userId === userId)
            .map(post => post.id)
      
          // delete user
          database.users = database.users.filter(u => u.id !== userId)
      
          // delete user's posts
          database.userPosts = database.userPosts.filter(
            post => post.userId !== userId
          )
      
          // delete likes by user OR on user's posts
          database.userLikes = database.userLikes.filter(
            like =>
              like.userId !== userId &&
              !userPostIds.includes(like.postId)
          )
      
          await db.writeDB(database)
      
          res.sendStatus(204)
        } catch (error) {
          if (error instanceof Error) return next(msgError(500, error.message));
          return next(msgError(500, "Unknown error occurred"))
        }
      }) as RequestHandler
}

export default userController