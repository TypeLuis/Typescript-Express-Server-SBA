import express from "express"
import apiKeysCheck from "../middleware/apiKeys.js"
import requireBody from "../middleware/requireBody.js"
import userController from "../controllers/userController.js"

const router = express.Router()

router
    .route('/')

    .get(userController.getUsers)

    .post(requireBody(["name", "username"]), userController.createUser);

router
    .route('/:id')

    .get(userController.getUser)

    .put(requireBody(['username']), userController.updateUser)

    .delete(apiKeysCheck, userController.deleteUser)

export default router