const { Subscription, User } = require("../models");
const billingQueue = require("../queues/billing.queue");
const { getCache, setCache, deleteCache } = require("../utils/cache.util");


exports.createSubscription = async (data) => {
  const { userId, serviceName, cost, billingCycle, nextBillingDate } = data;

  if (!userId || !serviceName || !cost || !billingCycle || !nextBillingDate) {
    throw new Error("All fields are required");
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const subscription = await Subscription.create({
    userId,
    serviceName,
    cost,
    billingCycle,
    nextBillingDate
  });

  await deleteCache(`user:${userId}:subscriptions`);

  await billingQueue.add("billing-reminder", {
    userId,
    serviceName,
    nextBillingDate
  });

  return subscription;
};

exports.getSubscriptionsByUser = async (userId) => {
  const cacheKey = `user:${userId}:subscriptions`;

  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const subscriptions = await Subscription.findAll({
    where: { userId }
  });

  await setCache(cacheKey, subscriptions, 300);

  return subscriptions;
};