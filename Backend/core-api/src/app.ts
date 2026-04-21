import express from "express"
import type { Express, Request, Response } from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import internalRouter from "./routes/internal.routes.js"
import itemRouter from "./routes/item.routes.js"
import userRouter from "./routes/user.routes.js"

dotenv.config()

export const app:Express = express()

const corsOptions = {
    origin:process.env.CORS_ORIGIN,
    credentials:true
}

const logRequest = (req: Request, res: Response, next:Function)=>{
    console.log(`Time:${new Date(Date.now())} ,Request made to ${req.url}`)
    next()
}

app.use(logRequest)
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/internal",internalRouter)
app.use("/api/v1/inventory",itemRouter)
app.use("/api/v1/users",userRouter)
