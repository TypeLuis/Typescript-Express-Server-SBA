import msgError from "../utilities/msgError.js";
import type { RequestHandler } from "express";
import db from "../server/database.js"

const likeController = {
    createLike: (async (req, res, next) => {
        try {
            const postId = Number(req.params.postId)
            const userId = Number(req.body.userId)

            if (Number.isNaN(postId)) return next(msgError(400, "Invalid post id"));
            if (Number.isNaN(userId)) return next(msgError(400, "Invalid user id"));

            const database = await db.readDB()

            const postExists = database.userPosts.some(p => p.id === postId)
            if (!postExists) return next(msgError(404, "Post not found"));

            const userExists = database.users.some(u => u.id === userId)
            if (!userExists) return next(msgError(404, "User not found"));

            const alreadyLiked = database.userLikes.some(l => l.userId === userId && l.postId === postId)
            if (alreadyLiked) return next(msgError(409, "Already liked"));

            const like = { id: db.nextId(database.userLikes), userId, postId }
            database.userLikes.push(like)

            await db.writeDB(database)
            res.status(201).json(like)
        } catch (e) {
            if (e instanceof Error) return next(msgError(500, e.message))
            return next(msgError(500, "Unknown error occurred"))
        }
    }) as RequestHandler,

    deleteLike: (async (req, res, next) => {
        try {
            const postId = Number(req.params.postId)
            const userId = Number(req.query.userId)

            if (Number.isNaN(postId)) return next(msgError(400, "Invalid post id"))
            if (Number.isNaN(userId)) return next(msgError(400, "Invalid user id"))

            const database = await db.readDB()

            const before = database.userLikes.length
            // This filter is getting the opposite of what it's looking for hence the "!"
            database.userLikes = database.userLikes.filter(l => !(l.userId === userId && l.postId === postId))

            if (database.userLikes.length === before) return next(msgError(404, "Like not found"))

            await db.writeDB(database)
            res.sendStatus(204)
        } catch (e) {
            if (e instanceof Error) return next(msgError(500, e.message))
            return next(msgError(500, "Unknown error occurred"))
        }
    }) as RequestHandler
}

export default likeController