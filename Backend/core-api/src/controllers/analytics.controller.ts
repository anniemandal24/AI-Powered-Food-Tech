import { analyticsReport } from "../models/analytics.model.js"
import { item } from "../models/item.model.js"
import type { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler.js"


export const getAnalyticsReport = asyncHandler(async (req:Request, res:Response)=>{
    const { user_id } = req.params
    const { startDate, endDate } = req.body
    const now = new Date()

    if(!startDate || !endDate){
        return res.status(400).json("Start date and end date is required")
    }

    const report = await item.aggregate([
        {
            $match:{
                _id: user_id,
                status:{$ne:'AVAILABLE'},
                actionDate:{$lt:endDate, $gte:startDate}
            }
        },
        {
            $project:{
                user:1,
                name:1,
                category:1,
                cost:1
            }
        },
        {
            $group:{
                _id: "$category",
                items:{
                    $push:{
                        name:"$name",
                        cost:"$cost"
                    }
                }
            }
        }
    ])
})

