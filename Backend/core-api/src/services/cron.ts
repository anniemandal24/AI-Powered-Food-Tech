import cron from "node-cron"
import { item } from "../models/item.model.js"

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
                        }
                    }
                },
                {
                    $group:{
                        _id:"$_id",
                        items:{
                            $push:"$name"
                        }
                    }
                }
            ])
            
            if(expiringSoon.length>0){
                await item.updateMany(
                    { 
                        expiryDate: { $gt: now, $lte: twoDaysFromNow }, 
                        status: { $ne: 'CONSUMED' },
                        estimatedExpiry: { $ne: true }
                    },
                    { $set: { estimatedExpiry: true } }
                )

                for (const item of expiringSoon) {
                    const userId = item._id.toString()

                    io.to(userId).emit('inventory_warning', {
                        message: `Heads up! Your ${item.items.join(', ')} will expire in less than 2 days.`,
                        items: item.items
                    });
                }
            }

            const expiredItems = await item.aggregate([
                {
                    $match:{
                        expiryDate:{ $lt:now },
                        status:{ $ne: ['CONSUMED', 'WASTED']}
                    }
                },
                {
                    $group:{
                        _id:"$_id",
                        items:{
                            $push:"$name"
                        }
                    }
                }
            ])

            if(expiredItems.length>0){

                const updateResult = await item.updateMany(
                    { expiryDate: { $lt: now }, status: { $ne: ['CONSUMED', 'WASTED'] } },
                    { $set: { status: 'WASTED' } }
                )

                for(const item of expiredItems){
                    const userId = item._id.toString()

                    io.to(userId).emit('inventory_alert', {
                        message: ` Alert: ${item.items.join(', ')} just expired in your inventory!`,
                        items: item.items
                    });

                    console.log(`Alert message sent to user`)
                }
            }

        }catch(err){
            console.log(`Error occured in inventoryExpirationCorn function`)
        }
    })
} 