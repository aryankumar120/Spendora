const optimizationQueue = require("../queues/optimization.queue");
const optimizationService = require("../services/optimization.service");

exports.generateReport = async (req, res) => {
  try {
    const { userId } = req.params;

    await optimizationQueue.add("generate-optimization-report", {
      userId
    });

    res.status(202).json({
      message: "Optimization report generation started",
      userId
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await optimizationService.getUserReports(req.params.userId);
    res.status(200).json(reports);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};