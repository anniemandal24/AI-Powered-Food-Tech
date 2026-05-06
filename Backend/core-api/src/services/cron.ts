import cron from "node-cron";
import { item } from "../models/item.model.js";
import { user } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js"; // Import your new model
import {
    expiryNotificationQueue,
    autoWastedQueue
} from "../utils/queues.js";

export async function inventoryExpirationCorn(io: any) {
    cron.schedule("0 0 * * *", async () => {
        console.log(`Checking for expiration of items in inventory....`);

        const now = new Date();
        const twoDaysFromNow = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000));

        try {
            // --- 1. HANDLING EXPIRING SOON ---
            const expiringSoon = await item.aggregate([
                {
                    $match: {
                        expiryDate: { $lte: twoDaysFromNow, $gt: now },
                        status: { $nin: ["CONSUMED", "WASTED"] }
                    }
                },
                {
                    $group: {
                        _id: "$user",
                        items: { $push: "$name" }
                    }
                }
            ]);

            for (const groupedItem of expiringSoon) {
                const userId = groupedItem._id.toString();

                // A. Socket.io (Real-time)
                io.to(userId).emit('inventory_warning', {
                    message: `Heads up! Your ${groupedItem.items.join(', ')} will expire soon.`,
                    items: groupedItem.items
                });

                // B. Database Notification (For the Top Bar/Bell icon)
                await Notification.create({
                    userId,
                    title: "Expiry Alert",
                    message: `${groupedItem.items.length} items are expiring in less than 2 days.`,
                    type: 'expiry'
                });

                // C. Email Queue (Nodemailer via BullMQ)
                const foundUser = await user.findById(userId).select("email name");
                if (foundUser) {
                    const itemDetails = await item.find({
                        user: groupedItem._id,
                        expiryDate: { $lte: twoDaysFromNow, $gt: now },
                        status: { $nin: ["CONSUMED", "WASTED"] }
                    }).select("name category expiryDate quantity");

                    await expiryNotificationQueue.add("sendExpiryNotification", {
                        email: foundUser.email,
                        name: foundUser.name,
                        items: itemDetails
                    }, { attempts: 3, backoff: { type: "exponential", delay: 5000 } });
                }
            }

            // --- 2. HANDLING EXPIRED (AUTO-WASTED) ---
            const expiredItems = await item.aggregate([
                {
                    $match: {
                        expiryDate: { $lt: now },
                        status: { $nin: ['CONSUMED', 'WASTED'] }
                    }
                },
                {
                    $group: {
                        _id: "$user",
                        items: { $push: "$name" }
                    }
                }
            ]);

            if (expiredItems.length > 0) {
                // Update statuses in DB
                await item.updateMany(
                    { expiryDate: { $lt: now }, status: { $nin: ['CONSUMED', 'WASTED'] } },
                    { $set: { status: 'WASTED' } }
                );

                for (const groupedItem of expiredItems) {
                    const userId = groupedItem._id.toString();

                    // A. Socket.io
                    io.to(userId).emit('inventory_alert', {
                        message: `Alert: ${groupedItem.items.join(', ')} just expired!`,
                        items: groupedItem.items
                    });

                    // B. Database Notification (For the Top Bar/Bell icon)
                    await Notification.create({
                        userId,
                        title: "Items Wasted",
                        message: `${groupedItem.items.length} items were automatically marked as wasted.`,
                        type: 'wasted'
                    });

                    // C. Email Queue
                    const foundUser = await user.findById(userId).select("email name");
                    if (foundUser) {
                        const itemDetails = await item.find({
                            user: groupedItem._id,
                            expiryDate: { $lt: now },
                            status: "WASTED"
                        }).select("name category expiryDate quantity");

                        await autoWastedQueue.add("sendAutoWastedNotification", {
                            email: foundUser.email,
                            name: foundUser.name,
                            items: itemDetails
                        }, { attempts: 3, backoff: { type: "exponential", delay: 5000 } });
                    }
                }
            }
        } catch (err) {
            console.error(`Error occurred in inventoryExpirationCron function:`, err);
        }
    });
}