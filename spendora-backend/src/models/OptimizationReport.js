const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OptimizationReport = sequelize.define(
  "OptimizationReport",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    totalMonthlyCost: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    totalYearlyCost: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    highCostCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reportData: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    generatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "optimization_reports",
    timestamps: false
  }
);

module.exports = OptimizationReport;