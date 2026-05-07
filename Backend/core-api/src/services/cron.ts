import cron from "node-cron"
import { item } from "../models/item.model.js"
import {user} from "../models/user.model.js"
import {
    expiryNotificationQueue,
    autoWastedQueue
} from "../utils/queues.js"
import { delay } from "bullmq"

export async function inventoryExpirationCorn(io:any) {
    cron.schedule("0 0 * * *",async ()=>{
        console.log(`Checking for expiration of items in inventory....`)

        const now = new Date()
        const twoDaysFromNow = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000))

        try{
            const expiringSoon = await item.aggregate([
                {
                    $match:{
                        expiryDate:{
                            $lte:twoDaysFromNow,
                            $gt:now
                        },
                        status:{$nin:["CONSUMED","WASTED"]}
                    }
                },
                {
                    $group:{
                        _id:"$user",
                        items:{
                            $push:"$name"
                        }
                    }
                }
            ])
            
            if(expiringSoon.length>0){
                

                for (const groupedItem of expiringSoon) {
                    const userId = groupedItem._id.toString()

                    io.to(userId).emit('inventory_warning', {
                        message: `Heads up! Your ${groupedItem.items.join(', ')} will expire in less than 2 days.`,
                        items: groupedItem.items
                    });

                    const foundUser= await user.findById(userId).select("email name")
                    if(foundUser){
                        const itemDetails=await item.find({
                            user:groupedItem._id,
                            expiryDate:{$lte:twoDaysFromNow,$gt:now},
                            status:{$nin:["CONSUMED","WASTED"]}
                        }).select("name category expiryDate quantity")

                        await expiryNotificationQueue.add("sendExpiryNotification",{
                            email:foundUser.email,
                            name:foundUser.name,
                            items:itemDetails
                        },
                        {
                            attempts:3,
                            backoff:{
                                type:"exponential",
                                delay:5000
                            }
                        }
                    )
                    console.log(`Expiry notification queued for ${foundUser.email}`)
                    }
                }
            }

            const expiredItems = await item.aggregate([
                {
                    $match:{
                        expiryDate:{ $lt:now },
                        status:{ $nin: ['CONSUMED', 'WASTED']}
                    }
                },
                {
                    $group:{
                        _id:"$user",
                        items:{
                            $push:"$name"
                        }
                    }
                }
            ])

            if(expiredItems.length>0){

                const updateResult = await item.updateMany(
                    { expiryDate: { $lt: now }, status: { $nin: ['CONSUMED', 'WASTED'] } },
                    { $set: { status: 'WASTED' } }
                )

                for(const groupedItem of expiredItems){
                    const userId = groupedItem._id.toString()

                    io.to(userId).emit('inventory_alert', {
                        message: ` Alert: ${groupedItem.items.join(', ')} just expired in your inventory!`,
                        items: groupedItem.items
                    });

                    const foundUser=await user.findById(userId).select("email name")

                    if(foundUser){
                        const itemDetails=await item.find({
                            user:groupedItem._id,
                            expiryDate:{$lt:now},
                            status:"WASTED"
                        }).select("name category expiryDate quantity")

                        await autoWastedQueue.add("sendAutoWastedNotification",{
                            email:foundUser.email,
                            name:foundUser.name,
                            items:itemDetails
                        },
                        {
                            attempts:3,
                            backoff:{
                                type:"exponential",
                                delay:5000
                            }
                        }
                    )
                    console.log(`Auto wasted notification queued for ${foundUser.email}`)
                }
            }
        }

        }catch(err){
            console.log(`Error occured in inventoryExpirationCron function`)
        }
    })
} 