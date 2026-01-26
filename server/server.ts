import express from "express"
import * as rowdy from "rowdy-logger"
import morgan from "morgan";
import type { Request, Response, NextFunction } from "express";
// import 
// import globalerror from "./middleware/globalerror.js";
// import apiKeysCheck from "./middleware/apikeys.js";
// import error from './utilities/error.js'



// Setup
const port = 3015
const app = express()
const routesReport = rowdy.begin(app)


// Middleware
app.use(express.json()) // allows to use json like getting req.body
app.use(morgan('tiny')) // logs the method used when calling request
// app.use("/api", apiKeysCheck); // makes sure the apikey is set to all /api routes



// Routes
// app.use('/api/users', userRoutes)
// app.use('/api/posts', postRoutes)


// make sure to have api keys for this specific route
// app.put('/', apiKeysCheck, (req, res) => {
//     console.log(req.body)
//     res.send("testing around")
// })


// Error Middleware
app.use((req, res) => {
    res.status(404).json({error: "Resource not found"})
})

// app.use(globalerror)


// Listener
app.listen(port, ()=> {
    console.log(`server is running on PORT: ${port}`)
    routesReport.print()
})