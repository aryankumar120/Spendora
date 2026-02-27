const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/v1/user.routes");
const subscriptionRoutes = require("./routes/v1/subscription.routes");
const optimizationRoutes = require("./routes/v1/optimization.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/optimize", optimizationRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "Subscription Cost Optimizer Backend" });
});

module.exports = app;