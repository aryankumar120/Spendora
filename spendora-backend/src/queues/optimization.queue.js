const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

const optimizationQueue = new Queue("optimization-jobs", {
  connection: redisConnection
});

module.exports = optimizationQueue;