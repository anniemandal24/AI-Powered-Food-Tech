import { app } from "./app.js";
import { io } from "./app.js";
import type { AuthenticatedSocket } from "./middlewares/jwt.middleware.js";
import { httpServer } from "./app.js";
import { connectDB } from "./db/index.js";
import { authRouter } from "./routes/auth.routes.js";
import { inventoryExpirationCorn } from "./services/cron.js"

const port = process.env.PORT as string

connectDB().then(()=>{
    httpServer.on("error" as "mount",(err)=>{
        console.log(err)
        throw err
    })

    httpServer.listen(port,()=>{
        console.log(`Server is listening on port ${port}`)
    })

    io.on("connect-core-api",(socket:AuthenticatedSocket)=>{
        const user_id = socket.user?._id

        if(user_id){
            socket.join(user_id);
            console.log(`User ${user_id} joined their notification room.`)
        }

        socket.on('disconnect-core-api', () => {
            console.log(`User ${user_id} disconnected.`);
        })
    })
    
    inventoryExpirationCorn(io)

}).catch((err)=>{
    console.log(`Error for connectDB execution, Error:${err}`)
})

app.get('/health-check',(req,res)=>{
    res.send(`core-api server is running`)
})

app.use("/api/v1/auth", authRouter)