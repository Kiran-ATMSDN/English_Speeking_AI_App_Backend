const express = require("express");
const {
  getSubscriptionPlans,
  selectSubscriptionPlan,
  getCurrentSubscription,
} = require("../controllers/subscription.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/plans", getSubscriptionPlans);
router.get("/current", authenticate, getCurrentSubscription);
router.post("/select", authenticate, selectSubscriptionPlan);

module.exports = router;
