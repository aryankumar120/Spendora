const { Worker } = require("bullmq");
const redisConnection = require("../config/redis");
const { runDailyBillingScan } = require("./dailyBillingScan.job");

const billingWorker = new Worker(
  "billing-reminders",
  async (job) => {
    if (job.name === "daily-billing-scan") {
      await runDailyBillingScan();
      return;
    }

    const { userId, serviceName, nextBillingDate } = job.data;

    console.log(
      `Reminder: ${serviceName} billing for user ${userId} on ${nextBillingDate}`
    );
  },
  { connection: redisConnection }
);