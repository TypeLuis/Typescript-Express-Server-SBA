import express from "express"
import db from "../server/database.js"
import msgError from "../utilities/msgError.js"
import apiKeysCheck from "../middleware/apiKeys.js"

const router = express.Router()

router
    .route('/')

    .get((req,res) => {
        res.json(db)
    })

    