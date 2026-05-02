import { Worker } from "bullmq";
import redis from "./redis.js";
import {
  sendExpiryNotification,
  sendAutoWastedNotification
} from "./mailer.js";


export const expiryNotificationWorker = new Worker(
  "expiryNotification",
  async (job) => {
    const { email, name, items } = job.data;
    await sendExpiryNotification(email, name, items);
    console.log(`Expiry notification sent to ${email}`);
  },
  { connection: redis }
);

expiryNotificationWorker.on("completed", (job) => {
  console.log(`Expiry notification job ${job.id} completed`);
});

expiryNotificationWorker.on("failed", (job, err) => {
  console.error(`Expiry notification job ${job?.id} failed:`, err);
});


export const autoWastedWorker = new Worker(
  "autoWasted",
  async (job) => {
    const { email, name, items } = job.data;
    await sendAutoWastedNotification(email, name, items);
    console.log(`Auto wasted notification sent to ${email}`);
  },
  { connection: redis }
);

autoWastedWorker.on("completed", (job) => {
  console.log(`Auto wasted job ${job.id} completed`);
});

autoWastedWorker.on("failed", (job, err) => {
  console.error(`Auto wasted job ${job?.id} failed:`, err);
});