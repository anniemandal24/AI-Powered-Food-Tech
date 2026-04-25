import type { NextFunction, Request, Response } from "express"
import { ApiError } from "../utils/ApiError.js"
import { user } from "../models/user.model.js"
import jwt, { type Secret } from "jsonwebtoken"
import { Socket } from "socket.io"
import type { IAccessDecodedPayload } from "../types/interfaces.js"


export interface AuthenticatedSocket extends Socket {
    user?: {
        _id: string;
    }
}

export const jwtAuthMiddleware = async (req:Request, res:Response, next:NextFunction)=>{
    try{    
        const auth = req.headers.authorization || req.cookies?.accessToken
        if(!auth) return res.status(401).json(
            new ApiError(401,"Unauthorized Request")
        )

        const token:string = auth.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY as Secret) as IAccessDecodedPayload

        if(!decoded.isActive){
            return res.status(403).json(
                new ApiError(403,"Inactive User!")
            )
        }
        
        const User = await user.findById(decoded._id).select(
            '-refreshToken -passwordHash'
        )

        if(!User) return res.status(404).json(
            new ApiError(404,"User not found!")
        )
        else req.user = User;

        next()

    }catch(err){
        console.log(`Error in jwt middleware, Error: ${err}`)
        res.status(500).json(
            new ApiError(500,"Internal Server Error for auth middleware")
        )
    }
}

export const jwtAuthSocket = (socket:AuthenticatedSocket, next:any):void=>{
    try{

        const token = socket.handshake.auth?.token || socket.handshake.query?.token

        if (!token) {
            console.warn(`[Socket Auth] Connection rejected: No token provided.`);
            return next(new Error('Authentication error: Token missing'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as Secret) as IAccessDecodedPayload;

        socket.user = { _id: decoded._id }
        next()

    }catch(err){
        console.log(`Error in jwt middleware, Error: ${err}`)
        return next(new Error("Internal Server Error for socket auth middleware"))
    }

}