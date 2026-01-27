import msgError from "../utilities/msgError.js";
import type { RequestHandler } from "express";
import db from "../server/database.js"


const postController = {
    createPost : (async (req, res, next) => {
        try {
            const userId = Number(req.params.id)
            if (Number.isNaN(userId)) return next(msgError(400, "Invalid user id"));
            const {title, content} = req.body
          
            const database = await db.readDB()
            const post = { id: db.nextId(database.userPosts), userId, title, content }

            database.userPosts.push(post)
          
            await db.writeDB(database)
            res.status(201).json(post)
        } catch (error) {
            if (error instanceof Error) return next(msgError(500, error.message));
            return next(msgError(500, "Unknown error occurred"))
        }
    }) as RequestHandler,

    getPost : (async (req,res,next) => {
        try {
            const postId = Number(req.params.id)
            if (Number.isNaN(postId)) return next(msgError(400, "Invalid post id"));
            const database = await db.readDB()
            const post = database.userPosts.find(p => p.id === postId)

            if (!post) return next(msgError(404, "Post not found"))

            res.json(post)
        } catch (error) {
            if (error instanceof Error) return next(msgError(500, error.message));
            return next(msgError(500, "Unknown error occurred"))
        }

    }) as RequestHandler,

    updatePost : (async (req, res, next) => {
        try {
            const postId = Number(req.params.id)
            if (Number.isNaN(postId)) return next(msgError(400, "Invalid post id"));

            const title = typeof req.body.title === "string" ? req.body.title.trim() : undefined
            const content = typeof req.body.content === "string" ? req.body.content.trim() : undefined

            if (!title && !content) return next(msgError(400, "title or content is required"));

          
            const database = await db.readDB()
            const post = database.userPosts.find(p => p.id === postId)

            if (!post) return next(msgError(404,"Post not found"));

            if(title) post.title = title;
            if(content) post.content = content;

            await db.writeDB(database)
            res.json(post)
        } catch (error) {
            if (error instanceof Error) return next(msgError(500, error.message));
            return next(msgError(500, "Unknown error occurred"))
        }
    }) as RequestHandler,

    deletePost : (async (req, res, next) => {
        try {
            const postId = Number(req.params.id)
            if (Number.isNaN(postId)) return next(msgError(400, "Invalid post id"));
        
            const database = await db.readDB()
      
            // verify post exists
            const postExists = database.userPosts.some(p => p.id === postId)
            if (!postExists) return next(msgError(404, "Post not found"))

            // delete the post
            database.userPosts = database.userPosts.filter(p => p.id !== postId)

            // delete likes attached to this post
            database.userLikes = database.userLikes.filter(like => like.postId !== postId)

            await db.writeDB(database)
      
            res.sendStatus(204)
        } catch (error) {
            if (error instanceof Error) return next(msgError(500, error.message));
            return next(msgError(500, "Unknown error occurred"))
        }
    }) as RequestHandler
}

export default postController