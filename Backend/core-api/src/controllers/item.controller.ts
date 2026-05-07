import { asyncHandler } from "../utils/asyncHandler.js";
import { item } from "../models/item.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { uploadOnCloudinary,deleteFromCloudinary } from "../services/cloudinary.js";
import { Upload } from "../models/upload.model.js"; 

export const addItem = asyncHandler(async(req,res)=>{
    const{name,category,quantity,expiryDate,isEstimatedExpiry,source,cost}=req.body
    if(!name||!expiryDate||!source){
        return new ApiError(400,"name,expirydate and source required")
    }
    if(!["MANUAL","IMAGE","PDF"].includes(source)){
        return new ApiError(400,"source should be manual,image and pdf")
    }
    const newItem = await item.create({
        user:req.user._id,
        name,
        category,
        quantity,
        expiryDate,
        isEstimatedExpiry:isEstimatedExpiry||false,
        source,
        status:"AVAILABLE",
        cost:cost||0,

    })
    res.status(201).json(new ApiResponse(201,newItem,"Item added"))
})

export const getAllItem = asyncHandler(async(req,res)=>{
    const items=await item.find({user:req.user._id})
    res.status(200).json(new ApiResponse(200,items,"Items fetched"))
})

export const getItembyStatus = asyncHandler(async(req,res)=>{
    const {status}=req.params
    const statustr = status as String
    if(!status){
        return new ApiError(404,"status not found")
    }
    if(!["AVAILABLE","CONSUMED","WASTED"].includes(statustr.toUpperCase())){
        return new ApiError(404,"status must be available,consumed or wasted")
    }

    const items = await item.find({
        user:req.user._id,
        status:statustr.toUpperCase()
    })

    res.status(200).json(new ApiResponse(200,items,`${status} items fetched successfully`))
})

export const getItemById=asyncHandler(async(req,res)=>{
    const id=req.params.id as string
    if(!mongoose.Types.ObjectId.isValid(id)){
        return new ApiError(400,"Invalid item")
    }
    const foodItem=await item.findOne({_id:new mongoose.Types.ObjectId(id),user:req.user._id})
    if(!foodItem){
        return new ApiError(404,"Item not found")
    }
    res.status(200).json(new ApiResponse(200,foodItem,"Item fetched"))
})

export const editItem=asyncHandler(async(req,res)=>{
    const {name,category,quantity,expiryDate,isEstimatedExpiry,cost}=req.body
    const id=req.params.id as string
    if(!mongoose.Types.ObjectId.isValid(id)){
        return new ApiError(400,"Invalid item")
    }
    const foodItem=await item.findOneAndUpdate({_id:new mongoose.Types.ObjectId(id),user:req.user._id},
    {
        $set:{name,category,quantity,expiryDate,isEstimatedExpiry,cost}
    },{new:true})
    if(!foodItem){
        return new ApiError(404,"Item not found")
    }
    res.status(200).json(new ApiResponse(200,foodItem,"Item Updated successfully"))
})

export const updateItemStatus=asyncHandler(async(req,res)=>{
    const {status}=req.body;
    const statustr=status as string
    const id=req.params.id as string
    if(!mongoose.Types.ObjectId.isValid(id)){
        return new ApiError(400,"Invalid item")
    }
    if(!["AVAILABLE","CONSUMED","WASTED"].includes(statustr.toUpperCase())){
        return new ApiError(400,"status must be AVAILABLE,CONSUMED or WASTED")
    }
    const foodItem=await item.findOneAndUpdate({_id:new mongoose.Types.ObjectId(id),user:req.user._id},
    {
        $set:{status,actionDate:new Date()}
    },{new:true})
    if(!foodItem){
        return new ApiError(404,"Item not found")
    }
    res.status(200).json(new ApiResponse(200,foodItem,"Item marked as ${status}"))
    
})

export const deleteItem=asyncHandler(async(req,res)=>{
    const id=req.params.id as string
    const foodItem=await item.findOneAndDelete({_id:new mongoose.Types.ObjectId(id),user:req.user.id})
    if(!foodItem){
        return new ApiError(404,"Item not found")
    }
    res.status(200).json(new ApiResponse(200,null,"Item deleted"))
})

export const getExpiredItems = asyncHandler(async(req,res)=>{
    const expiredItems = await item.find({
        user:req.user._id,
        expiryDate:{ $lt:new Date() },
        status:"AVAILABLE"
    })

    res.status(200).json(new ApiResponse(200,expiredItems,"Expired Items fetched"))
})

export const uploadFile = asyncHandler(async (req, res) => {
    const localFilePath = req.file?.path;
    if (!localFilePath) return new ApiError(400, "No file provided");

    const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
    if (!cloudinaryResponse) return new ApiError(500, "Failed to upload file");

    await Upload.create({
        user: req.user._id,
        public_id: cloudinaryResponse.public_id,
        resource_type: cloudinaryResponse.resource_type,
        url: cloudinaryResponse.url,
    });

    res.status(200).json(new ApiResponse(200, {
        url: cloudinaryResponse.url,
        public_id: cloudinaryResponse.public_id,
        resource_type: cloudinaryResponse.resource_type,
    }, "File uploaded successfully"));
});

export const deleteFile = asyncHandler(async (req, res) => {
    const public_id = req.params.public_id as string;
    if (!public_id) return new ApiError(400, "public_id is required");

    const uploadRecord = await Upload.findOne({
        public_id,
        user: req.user._id
    });

    if (!uploadRecord) return new ApiError(404, "File not found");

    const response = await deleteFromCloudinary(public_id, uploadRecord.resource_type);
    if (!response) return new ApiError(500, "Failed to delete file from cloudinary");

    await Upload.findByIdAndDelete(uploadRecord._id);

    res.status(200).json(new ApiResponse(200, null, "Deleted successfully"));
});