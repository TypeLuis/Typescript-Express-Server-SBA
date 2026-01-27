import express from "express"
import apiKeysCheck from "../middleware/apiKeys.js"
import requireBody from "../middleware/requireBody.js"
import db from "../server/database.js"
import msgError from "../utilities/msgError.js"
import postController from "../controllers/postController.js"

const router = express.Router()

router
    .route('/:id')

    .get(postController.getPost)

    .post(requireBody(['title', 'content']), postController.createPost)

    .put(postController.updatePost)

    .delete(postController.deletePost)

export default router