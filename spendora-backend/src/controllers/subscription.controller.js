const subscriptionService = require("../services/subscription.service");

exports.createSubscription = async (req, res) => {
  try {
    const subscription = await subscriptionService.createSubscription(req.body);
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionService.getSubscriptionsByUser(req.params.userId);
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};