import { Router } from "express"
import { jwtAuthMiddleware } from "../middlewares/jwt.middleware.js"
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    changePassword
} from "../controllers/auth.controller.js"


export const authRouter = Router()

authRouter.post('/signup', registerUser)
authRouter.post('/login', loginUser)
authRouter.post('/refresh-token', refreshAccessToken)
authRouter.post('/logout',jwtAuthMiddleware, logoutUser)
authRouter.post('/change-password',jwtAuthMiddleware, changePassword)



