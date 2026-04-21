import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { user } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt, { type Secret } from "jsonwebtoken"
import type { IRefreshDecodedPayload } from "../types/interfaces.js";

const cookieOptions = {
    httpOnly: true,
    secure: true,
}

export const registerUser = asyncHandler(async (req:Request, res:Response)=>{
    const {name, email, password} = req.body
    if(!email || !password || !name)return res.status(400).json({
        "Error":"User credentials are required"
    })

    if(await user.findOne({email:email})){
        return res.status(409).json(
            new ApiError(409,`User already exists`)
        )
    }

    const newUser = new user({
        name: name,
        email: email,
        passwordHash: password   // or hashed version
    });

    const saveuser = await newUser.save()
    const createdUser:any = await user.findById(saveuser._id).select(
        '-passwordHash -refreshToken'
    )

    if(!createdUser) res.status(500).json({error: 'something went wrong while creating user'})

    const accessToken = await createdUser.generateAccessToken()
    const refreshToken = createdUser.generateRefreshToken();
    createdUser.refreshToken = refreshToken;
    await createdUser.save();

    return res.status(200)
    .cookie("accessToken",accessToken,cookieOptions)
    .cookie("refreshToken",refreshToken,cookieOptions)
    .json(
        new ApiResponse(200,{
            user:createdUser,
            accessToken:accessToken
        },"User registered successfully")
    )
})

export const loginUser = asyncHandler(async (req:Request, res:Response)=>{
    const {email, password} = req.body
    if(!email || !password) return res.status(400).json(
        new ApiResponse(400,null,'email and password both are required')
    )

    const findUser:any = await user.findOne({
        email:email as string
    }).select('-refreshToken')

    if(!findUser) return res.status(404).json(
        new ApiResponse(404,null,'User not found!')
    )

    const correctPassword = await findUser.comparePassword(password)
    if(!correctPassword) return res.status(401).json(
        new ApiResponse(401,null,`Incorrect password`)
    )

    const accessToken = await findUser.generateAccessToken()
    const refreshToken = await findUser.generateRefreshToken()

    await findUser.save({
        validateBeforeSave:false
    })
    findUser.passwordHash = undefined

    return res.status(200)
    .cookie("accessToken",accessToken,cookieOptions)
    .cookie("refreshToken",refreshToken,cookieOptions)
    .json(
        new ApiResponse(200,{
            user:findUser,
            accessToken:accessToken
        },'user logged in successfully')
    )
})

export const refreshAccessToken = asyncHandler(async (req:Request, res:Response)=>{
    const auth = req.headers.authorization || req.cookies?.accessToken;
    if(!auth) return res.status(401).json({error:'Unauthorized'});

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY as Secret) as IRefreshDecodedPayload
    
    const User:any = await user.findById(decoded._id).select('-password');
    if(!User) return res.status(401).json({err:'Invalid token'});
    
    const newAccessToken = User.generateAccessToken();
    const newRefreshToken = User.generateRefreshToken();

    User.refreshToken = newRefreshToken;
    await User.save();

    res.status(200)
    .cookie('accessToken',newAccessToken,cookieOptions)
    .cookie('refreshToken',newRefreshToken,cookieOptions)
    .json({message:'Access token refreshed', newAccessToken, newRefreshToken})
})

export const changePassword = asyncHandler(async (req:Request, res:Response)=>{
    const {oldPassword, newPassword, confirmPassword} = req.body;

        if(!oldPassword || !newPassword || !confirmPassword) return res.status(400).json({error:'all fields are required'});

        const findUser:any = await user.findById(req.user?._id);
        if(!findUser) res.status(404).json({error:'user not found'});

        if(!await findUser.comparePassword(oldPassword)){
            return res.status(400).json({error:'Incorrect current password'});
        }

        if(newPassword!==confirmPassword) return res.status(400).json({error:'confirm password accurately'});

        findUser.passwordHash = newPassword;
        await findUser.save();

        res.status(200).json({message: 'password changed successfully'});
})


export const logoutUser = asyncHandler(async (req:Request, res:Response)=>{
    await user.findByIdAndUpdate(req.user?._id,{
        $unset:{
            refreshToken:1
        },
    },{new:true})

    return res.status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({message:'User logged out'})
})
