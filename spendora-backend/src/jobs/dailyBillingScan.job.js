const { Subscription } = require("../models");
const billingQueue = require("../queues/billing.queue");
const { Op } = require("sequelize");
const { getFutureDate } = require("../utils/date.util");

const UPCOMING_DAYS = 3;

exports.runDailyBillingScan = async () => {
  const upcomingDate = getFutureDate(UPCOMING_DAYS);

  const subscriptions = await Subscription.findAll({
    where: {
      nextBillingDate: {
        [Op.lte]: upcomingDate
      }
    }
  });

  for (const sub of subscriptions) {
    await billingQueue.add("billing-reminder", {
      userId: sub.userId,
      serviceName: sub.serviceName,
      nextBillingDate: sub.nextBillingDate
    });
  }

  console.log(`Daily scan completed. Jobs queued: ${subscriptions.length}`);
};