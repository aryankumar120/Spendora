exports.calculateYearlyCost = (subscription) => {
  if (subscription.billingCycle === "MONTHLY") {
    return subscription.cost * 12;
  }
  return subscription.cost;
};

exports.isHighCost = (subscription, threshold = 5000) => {
  const yearlyCost = exports.calculateYearlyCost(subscription);
  return yearlyCost >= threshold;
};