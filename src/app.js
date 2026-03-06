const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth.routes");
const onboardingRoutes = require("./routes/onboarding.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const userRoutes = require("./routes/user.routes");
const aiRoutes = require("./routes/ai.routes");
const speechRoutes = require("./routes/speech.routes");
const conversationRoutes = require("./routes/conversation.routes");
const { responseFormatter } = require("./middlewares/response.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(responseFormatter);
app.use("/public", express.static(path.join(process.cwd(), "public")));

app.get("/health", (_req, res) => {
  return res.success("Service is healthy.", { status: "ok" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/onboarding", onboardingRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/speech", speechRoutes);
app.use("/api/v1/conversations", conversationRoutes);

module.exports = app;
