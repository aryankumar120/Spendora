const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

const billingQueue = new Queue("billing-reminders", {
  connection: redisConnection
});

module.exports = billingQueue;