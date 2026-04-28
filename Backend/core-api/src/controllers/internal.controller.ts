import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {item} from "../models/item.model.js";
import {user} from "../models/user.model.js";
import mongoose from "mongoose";
import { updateItemStatus } from "./item.controller.js";

export const getAvailableInventory=asyncHandler(async(req,res)=>{
    const user_id=req.params.user_id as string
    if(!user_id){
        throw new ApiError(400,"user_id is required")
    }
    if(!mongoose.Types.ObjectId.isValid(user_id)){
        throw new ApiError(400,"Invalid user_id");
    }
    const userObjectId=new mongoose.Types.ObjectId(user_id);
    const items=await item.aggregate([
        {
            $match:{
                user:userObjectId,
                status:"AVAILABLE"
            }
        },
        {
            $project:{
                _id:0,
                item_name:"$name",
                cost:1,
                isEstimatedExpiry:1,
                category:1,
                quantity:1
            }
        }
    ])
    if(!items.length){
        const userExists=await user.exists({_id:userObjectId})
        if(!userExists){
            throw new ApiError(404,"User not found")
        }
    }
    res.status(200).json(new ApiResponse(200,items,"Available Inventory fetched successfully!"))
})
export const getItemByStatus=asyncHandler(async(req,res)=>{
    const {status}=req.params;
    const statustr=status as string;
    const {user_id}=req.body;
    if(!user_id){
        throw new ApiError(400,"user_id is required")
    }
    if(!mongoose.Types.ObjectId.isValid(user_id)){
        throw new ApiError(400,"Invalid user_id")
    }
    const foundUser=await user.findById(user_id);
    if(!foundUser){
        throw new ApiError(404,"User not found")
    }
    if(!["AVAILABLE","CONSUMED","WASTED"].includes(statustr.toUpperCase())){
        throw new ApiError(400,"status must be AVAILABLE,CONSUMED or WASTED")
    }
    const items=await item.find({user:new mongoose.Types.ObjectId(user_id),status:statustr.toUpperCase()}).select("name ExpiryDate quantity status")
    res.status(200).json(new ApiResponse(200,{
        items,status:statustr.toUpperCase(),totalCount:items.length
    },"Items fetched successfully"))
})

export const getToBeExpiredItems=asyncHandler(async(req,res)=>{
    const{user_id}=req.body
    if(!user_id){
        throw new ApiError(400,"user_id is required")
    }
    if(!mongoose.Types.ObjectId.isValid(user_id)){
        throw new ApiError(400,"Invalid user_id")
    }
    const foundUser=await user.findById(user_id)
    if(!foundUser){
        throw new ApiError(404,"user not found")
    }
    const today=new Date();
    const threeDaysLater=new Date();
    threeDaysLater.setDate(today.getDate()+3);

    const items=await item.find({user:new mongoose.Types.ObjectId(user_id),status:"AVAILABLE",expiryDate:{$lte:threeDaysLater}}).select("name expiryDate quantity status")
    res.status(200).json(new ApiResponse(200,{
        items,
        totalCount:items.length
    },"To be expired fetched successfully"))
})

export const getItemByStatusAndCategory=asyncHandler(async(req,res)=>{
    const status=req.params.status as string
    const category=req.params.category as string
    const {user_id}=req.body

    if(!user_id){
        throw new ApiError(400,"user_id is required")
    }
    if(!mongoose.Types.ObjectId.isValid(user_id)){
        throw new ApiError(400,"Invalid user_id")
    }
    const foundUser=await user.findById(user_id)
    if(!foundUser){
        throw new ApiError(404,"user not found")
    }
    if(!["AVAILABLE","CONSUMED","WASTED"].includes(status.toUpperCase())){
        throw new ApiError(400,"status must be AVAILABLE,CONSUMED or WASTED")
    }
    if(!category){
        throw new ApiError(400,"category is required")
    }
    
    const items=await item.find({
        user:new mongoose.Types.ObjectId(user_id),
        status:status.toUpperCase(),
        category: { $regex: new RegExp(`^${category}$`, "i")}
    }).select("name expiryDate quantity status category")
    res.status(200).json(new ApiResponse(200,{
        items,
        status:status.toUpperCase(),
        totalCount:items.length
    },"Items fetched successfully"))
})