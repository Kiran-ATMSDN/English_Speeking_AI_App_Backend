const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const onboardingRoutes = require("./routes/onboarding.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/onboarding", onboardingRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);

module.exports = app;
