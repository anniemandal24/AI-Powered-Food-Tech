import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { user } from "../models/user.model.js";
import { item } from "../models/item.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getUserProfile = asyncHandler(async (req:Request, res:Response)=>{
    
})

export const updateProfile = asyncHandler(async (req:Request, res:Response)=>{

})

export const getInventory = asyncHandler(async (req:Request, res:Response)=>{

})