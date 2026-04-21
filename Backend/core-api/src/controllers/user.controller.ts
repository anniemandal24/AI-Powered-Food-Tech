import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { user } from "../models/user.model.js";
import { item } from "../models/item.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const addFamilyMembers = asyncHandler(async (req:Request, res:Response)=>{
    const {name, ageGroup, gender} = req.body
    const {id} = req.params

    if(!name || !ageGroup || !gender || !id){
        return res.status(400).json(
            new ApiError(400,"All fields are required")
        )
    }

    const newFamilyMember = {
        name:name,
        ageGroup:ageGroup,
        gender:gender,

        dietaryPractices: req.body.dietaryPractices || [],
        healthStatus: req.body.healthStatus || []
    }

    const addMember = await user.findByIdAndUpdate(id,{
        $addToSet:{familyMembers:newFamilyMember}
    },{new:true}).select('-passwordHash -refreshToken')

    return res.status(200).json(
        new ApiResponse(200,addMember,"Family member added successfully")
    )
})

export const getUserProfile = asyncHandler(async (req:Request, res:Response)=>{
    const foundUser=await user.findById(req.user._id).select("-passwordHash -refreshToken")
    if(!foundUser){
        throw new ApiError(404,"User not found")

    }
    res.status(200).json(new ApiResponse(200,foundUser,"Profile fetched successfully"))
})

export const updateProfile = asyncHandler(async (req:Request, res:Response)=>{
    const {name}=req.body;
    if(!name){
        throw new ApiError(400,"Name is required")
    }
    const updateUser=await user.findByIdAndUpdate(req.user._id,{$set:{name}},{new:true}).select("-passwordHash -refreshToken")
    if(!updateUser){
        throw new ApiError(404,"user not found")
    }
    res.status(200).json(new ApiResponse(200,updateUser,"Profile updated successfully"))
})

export const editFamilyMember = asyncHandler(async (req:Request, res:Response)=>{
    const {memberIndex}=req.params
    const{name,ageGroup,gender,dietaryPractices,healthStatus}=req.body
    const foundUser=await user.findById(req.user._id)
    if(!foundUser){
        throw new ApiError(404,"User not found")
    }
    const index=Number(memberIndex)
    const member=foundUser.familyMembers[index]
    if(index<0 || index>=foundUser.familyMembers.length){
        throw new ApiError(400,"Invalid Family Member Index")
    }
    if (!member) {
        throw new ApiError(400, "Family member not found at this index");
    }
    if(name){
        member.name=name
    }
    if(ageGroup){
        member.ageGroup=ageGroup
    }
    if(gender){
        member.gender=gender
    }
    if(dietaryPractices){
        member.dietaryPractices=dietaryPractices
    }
    if(healthStatus){
        member.healthStatus=healthStatus
    }
    await foundUser.save({validateBeforeSave:false})
    res.status(200).json(new ApiResponse(200,foundUser.familyMembers,"Family Member Updated Successfully"))
})
export const removeFamilyMember=asyncHandler(async(req,res)=>{
    const {memberIndex}=req.params
    const foundUser=await user.findById(req.user._id)
    if(!foundUser){
        throw new ApiError(404,"user not found")
    }
    const index=Number(memberIndex)
    if (index < 0 || index >= foundUser.familyMembers.length) {
        throw new ApiError(400, "Invalid family member index")
    }
    foundUser.familyMembers.splice(index,1);
    await foundUser.save({validateBeforeSave:false})
    res.status(200).json(new ApiResponse(200,foundUser.familyMembers,"family member removed successfully"))
})