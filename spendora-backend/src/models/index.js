const sequelize = require("../config/database");
const User = require("./User");
const Subscription = require("./Subscription");
const OptimizationReport = require("./OptimizationReport");


User.hasMany(Subscription, { foreignKey: "userId" });
Subscription.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Subscription,
  OptimizationReport
};

