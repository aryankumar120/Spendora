const { Subscription, OptimizationReport } = require("../models");
const { calculateYearlyCost, isHighCost } = require("../utils/cost.util");

exports.generateAndStoreReport = async (userId) => {
  const subscriptions = await Subscription.findAll({
    where: { userId }
  });

  if (!subscriptions.length) {
    throw new Error("No subscriptions found");
  }

  let totalMonthlyCost = 0;
  let totalYearlyCost = 0;
  let highCostCount = 0;

  const reportData = subscriptions.map((sub) => {
    const yearlyCost = calculateYearlyCost(sub);
    const monthlyCost =
      sub.billingCycle === "MONTHLY" ? sub.cost : sub.cost / 12;

    totalMonthlyCost += monthlyCost;
    totalYearlyCost += yearlyCost;

    const highCost = isHighCost(sub);
    if (highCost) highCostCount++;

    return {
      serviceName: sub.serviceName,
      billingCycle: sub.billingCycle,
      monthlyCost,
      yearlyCost,
      isHighCost: highCost,
      suggestion: highCost
        ? "Consider downgrading or cancelling"
        : "Cost is within normal range"
    };
  });

  const report = await OptimizationReport.create({
    userId,
    totalMonthlyCost,
    totalYearlyCost,
    highCostCount,
    reportData
  });

  return report;
};

exports.getUserReports = async (userId) => {
  return OptimizationReport.findAll({
    where: { userId },
    order: [["generatedAt", "DESC"]]
  });
};