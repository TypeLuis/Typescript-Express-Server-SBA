import express from "express"
import apiKeysCheck from "../middleware/apiKeys.js"
import requireBody from "../middleware/requireBody.js"
import likeController from "../controllers/likeController.js"

const router = express.Router()

router
    .route("/:postId/likes")

    .post(requireBody(["userId"]), likeController.createLike)


    .delete(apiKeysCheck, likeController.deleteLike)


export default router