const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Subscription = sequelize.define("Subscription", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  serviceName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cost: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  billingCycle: {
    type: DataTypes.ENUM("MONTHLY", "YEARLY"),
    allowNull: false
  },
  nextBillingDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: "subscriptions",
  timestamps: true
});

module.exports = Subscription;