import { analyticsReport } from "../models/analytics.model.js"
import { item } from "../models/item.model.js"
import type { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"


export const getAnalyticsReport = asyncHandler(async (req:Request, res:Response)=>{
    const  user_id = req.params.user_id as string
    const { startDate, endDate } = req.body

    if(!startDate || !endDate){
        throw new ApiError(400,"startDate and endDate required!")
    }

    if(!mongoose.Types.ObjectId.isValid(user_id)){
        throw new ApiError(400,"Invalid user_id")
    }
    const start=new Date(startDate)
    const end=new Date(endDate)
    if(isNaN(start.getTime())||isNaN(end.getTime())){
        throw new ApiError(400,"Invalid date format use YYYY-MM-DD")
    }
    const report = await item.aggregate([
        {
            $match:{
                user: new mongoose.Types.ObjectId(user_id),
                status:{$ne:'AVAILABLE'},
                actionDate:{$gte:start,$lt:end}
            }
        },
        {
            $project:{
                user:1,
                name:1,
                category:1,
                cost:1,
                status:1
            }
        },
        {
            $group:{
                _id: "$category",
                items:{
                    $push:{
                        name:"$name",
                        cost:{$ifNull:["$cost",0]}
                    }
                },
                categoryTotal:{$sum:{$ifNull:["$cost",0]}},
                categoryWasted:{$sum:{
                    $cond:[
                        {$eq:["$status","WASTED"]},
                        {$ifNull:["$cost",0]},0
                    ]}
                }
            }
        },
        {
            $project:{
                _id:0,
                category:"$_id",
                items:1,
                categoryTotal:1,
                categoryWasted:1
            }
        },
        {
            $group:{
                _id:null,
                wastedCategory:{
                    $push:{
                        category:"$category",
                        items:"$items"
                    }
                },
                totalCost:{$sum:"$categoryTotal"},
                costWasted:{$sum:"$categoryWasted"}
            }
        },
        {
            $project:{
                _id:0,
                wastedCategory:1,
                totalCost:1,
                costWasted:1
            }
        }
    ] as any[])
    res.status(200).json(new ApiResponse(200,report[0]||{wastedCategory:[],totalCost:0,costWasted:0},"Analytics report fetched successfully"))

})

export const saveAnalyticsReport=asyncHandler(async(req,res)=>{
    const user_id=req.params.user_id as string
    const {startDate,endDate,description}=req.body
    if(!startDate||!endDate){
        throw new ApiError(400,"startDate and endDate are required!");
    }
    if(!mongoose.Types.ObjectId.isValid(user_id)){
        throw new ApiError(400,"Invalid user_id")
    }
    const start=new Date(startDate)
    const end=new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new ApiError(400, "Invalid date format")
    }
    const existing=await analyticsReport.findOne({
        user:new mongoose.Types.ObjectId(user_id),
        "timeline.startDate":start,
        "timeline.endDate":end
    })
    if(existing){
        throw new ApiError(409,"Analytics already saved for this interval")
    }
    const report=await item.aggregate([
        {
            $match:{
                user:new mongoose.Types.ObjectId(user_id),
                status:{$ne:"AVAILABLE"},
                actionDate:{$gte:start,$lt:end}
            }
        },{
            $project:{
                name:1,
                category:1,
                cost:1,
                status:1
            }
        },
        {
            $group:{
                _id:"$category",
                items:{
                    $push:{
                        name:"$name",
                        cost:{$ifNull:["$cost",0]}
                    }
                },
                categoryTotal:{$sum:{$ifNull:["$cost",0]}},
                categoryWasted:{
                    $sum:{
                        $cond:[
                            {$eq:["$status","WASTED"]},
                            {$ifNull:["$cost",0]},0
                        ]
                    }
                }
            }
        },
        {
            $group:{
                _id:null,
                wastedCategory:{
                    $push:{
                        category:"$_id",
                        items:"$items"
                    }
                },
                totalCost:{$sum:"$categoryTotal"},
                costWasted:{$sum:"$categoryWasted"}
            }
        }
    ])
    const data=report[0]||{wastedCategory:[],totalCost:0,costWasted:0}
    const saved=await analyticsReport.create({
        user:new mongoose.Types.ObjectId(user_id),
        description:description||"",
        timeline:{startDate:start,endDate:end},
        metrices:{
            totalCost:data.totalCost,
            costWasted:data.costWasted
        },
        wastedCategory:data.wastedCategory
    })
    res.status(201).json(new ApiResponse(201,saved,"Analytics saved successfully"))

})

export const deleteAnalyticsReport=asyncHandler(async(req,res)=>{
    const analytics_id=req.params.analytics_id as string

    if(!mongoose.Types.ObjectId.isValid(analytics_id)){
        throw new ApiError(400,"Invalid analytics_id")
    }
    const deleted=await analyticsReport.findByIdAndDelete(new mongoose.Types.ObjectId(analytics_id))
    if(!deleted){
        throw new ApiError(404,"Analytics report not found")
    }
    res.status(200).json(new ApiResponse(200,null,"Analytics report deleted successfully"))
})

export const editAnalyticsReport=asyncHandler(async(req,res)=>{
    const analytics_id=req.params.analytics_id as string
    const {description}=req.body
    if(!mongoose.Types.ObjectId.isValid(analytics_id)){
        throw new ApiError(400,"Invalid analytics_id")
    }
    if(!description){
        throw new ApiError(400,"description is required")
    }
    const updated=await analyticsReport.findByIdAndUpdate(
        analytics_id,
        {$set:{description}},
        {new:true}
    )
    if(!updated){
        throw new ApiError(404,"Analytics report not found")
    }
    res.status(200).json(new ApiResponse(200,updated,"Description updated successfully"))
})