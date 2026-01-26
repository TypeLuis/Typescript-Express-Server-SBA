import express from "express"
import * as rowdy from "rowdy-logger"
import type { Request, Response, NextFunction } from "express";
import globalerror from "../middleware/globalError.js";
import notFound from "../middleware/notFound.js";
import logReq from "../middleware/logReq.js";



// Setup
const port = 3015
const app = express()
const routesReport = rowdy.begin(app)


// Middleware
app.use(express.json()) // allows to use json like getting req.body

app.use(logReq);



// Routes
// app.use('/api/users', userRoutes)
// app.use('/api/posts', postRoutes)



// Error Middleware
app.use(notFound)

app.use(globalerror)


// Listener
app.listen(port, ()=> {
    console.log(`server is running on PORT: ${port}`)
    routesReport.print()
})