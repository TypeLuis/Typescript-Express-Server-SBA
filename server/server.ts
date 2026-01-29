import express from "express"
import * as rowdy from "rowdy-logger"
import globalerror from "../middleware/globalError.js";
import notFound from "../middleware/notFound.js";
import logReq from "../middleware/logReq.js";
import userRoutes from "../routes/userRoutes.js";
import postRoutes from "../routes/postRoutes.js";
import likeRoutes from "../routes/likeRoutes.js";
import dotenv from "dotenv";
import fs from "fs"


// Setup
dotenv.config() // loads the env file
const port = process.env.PORT || 3015
const app = express()
app.use(express.json()) // allows to use json like getting req.body
const routesReport = rowdy.begin(app)


type pageOptions = {
    hostname?: string;
};

// View Engine Setup - creates a view engine, 
// uses .html extention files and replaces #title# and #content# values
// html parameter is basically the variable to render
app.engine("html", (filepath, options: pageOptions, callback)=> {
    fs.readFile(filepath,"utf-8", (err, content)=>{
        if(err) return callback(err)


        const rendered = content
        .replace("#HOSTNAME#", options.hostname ?? "");

        return callback(null, rendered)
    })
})

// View engine setup
// views to use the "./views" folder to search
app.set("views", "./views")
// view engine to also search the cat parameter that we used in app.engine, to use the callback
app.set("view engine", "html")
 // serve up a static folder to css basically you can call the css relative to where server.ts is at. so index.cat can call styles.css relative to server.ts
app.use(express.static("./styles"))




// Middleware

app.use(logReq);



// Routes
app.get('/home', (_req, res) => {
    const options:Object = {
        hostname: `${process.env.MAINHOST}` || "http://localhost:3015"
    } 

    res.render("index", options)
})

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/likes', likeRoutes)



// Error Middleware
app.use(notFound)

app.use(globalerror)


// Listener
app.listen(port, ()=> {
    console.log(`server is running on PORT: ${port}`)
    routesReport.print()
})