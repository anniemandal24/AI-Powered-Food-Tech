import type { NextFunction, Request, Response } from "express"
import { ApiError } from "../utils/ApiError.js"
import { user } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import type { IAccessDecodedPayload } from "../types/interfaces.js"

export const jwtAuthMiddleware = async (req:Request, res:Response, next:NextFunction)=>{
    try{    
        const auth = req.headers.authorization || req.cookies?.accessToken
        if(!auth) return res.status(401).json(
            new ApiError(401,"Unauthorized Request")
        )

        const token = auth.startsWith("Bearer ")
        ? auth.split(" ")[1]
        : auth;
        if (!process.env.ACCESS_TOKEN_SECRET_KEY) {
            throw new Error("ACCESS_TOKEN_SECRET_KEY not defined");
        }
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY as string) as IAccessDecodedPayload
        

        /*if(!decoded.isActive){
            return res.status(403).json(
                new ApiError(403,"Inactive User!")
            )
        }*/
        
        const User = await user.findById(decoded._id).select(
            '-refreshToken -passwordHash'
        )

        if(!User) return res.status(404).json(
            new ApiError(404,"User not found!")
        )
        else (req as any).user = User;

        next()

    }catch (err) {
    console.log(`Error in jwt middleware, Error: ${err}`);
    return res.status(401).json(
        new ApiError(401, "Invalid or expired token")
    );
    }
}