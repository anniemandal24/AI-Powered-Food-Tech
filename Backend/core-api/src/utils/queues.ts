import { Queue } from "bullmq";
import redis from "./redis.js";

export const expiryNotificationQueue=new Queue("expiryNotification",{connection:redis})

export const autoWastedQueue=new Queue("autoWasted",{connection:redis})