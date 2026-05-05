import { Router } from "express"
import { jwtAuthMiddleware } from "../middlewares/jwt.middleware.js"
import { validate } from "../middlewares/validator.middleware.js"
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    changePassword,
    getCurrentUser
} from "../controllers/auth.controller.js"

import { 
    changePasswordSchema, 
    loginUserSchema, 
    registerUserSchema 
} from "../validators/schema.js"

export const authRouter = Router()

authRouter.post('/signup',validate(registerUserSchema), registerUser)
authRouter.post('/login',validate(loginUserSchema), loginUser)
authRouter.post('/refresh-token', refreshAccessToken)
authRouter.post('/logout',jwtAuthMiddleware, logoutUser)
authRouter.post('/change-password',jwtAuthMiddleware, validate(changePasswordSchema), changePassword)
authRouter.get('/me',jwtAuthMiddleware,getCurrentUser)


