const express = require("express");
const router = express.Router();
const optimizationController = require("../../controllers/optimization.controller");

router.post(
  "/user/:userId/generate",
  optimizationController.generateReport
);

router.get(
  "/user/:userId/reports",
  optimizationController.getReports
);

module.exports = router;