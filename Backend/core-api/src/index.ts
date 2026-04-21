import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import { authRouter } from "./routes/auth.routes.js";

const port = process.env.PORT as string

connectDB().then(()=>{
    app.on("error" as "mount",(err)=>{
        console.log(err)
        throw err
    })

    app.listen(port,()=>{
        console.log(`Server is listening on port ${port}`)
    })
}).catch((err)=>{
    console.log(`Error for connectDB execution, Error:${err}`)
})

app.get('/health-check',(req,res)=>{
    res.send(`core-api server is running`)
})

app.use("/api/v1/auth", authRouter)