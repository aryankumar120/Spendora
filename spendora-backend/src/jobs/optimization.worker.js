const { Worker } = require("bullmq");
const redisConnection = require("../config/redis");
const optimizationService = require("../services/optimization.service");

const optimizationWorker = new Worker(
  "optimization-jobs",
  async (job) => {
    const { userId } = job.data;

    console.log(`Starting optimization for user ${userId}`);

    const report = await optimizationService.generateAndStoreReport(userId);

    console.log(`Optimization completed for user ${userId}`);

    return report;
  },
  { connection: redisConnection }
);

optimizationWorker.on("completed", (job) => {
  console.log(`Optimization job ${job.id} completed`);
});

optimizationWorker.on("failed", (job, err) => {
  console.error(`Optimization job ${job.id} failed`, err);
});