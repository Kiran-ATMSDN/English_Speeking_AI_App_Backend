const { SubscriptionPlan, User } = require("../models");

async function getSubscriptionPlans(_req, res) {
  try {
    const plans = await SubscriptionPlan.findAll({
      order: [
        ["isHighlighted", "DESC"],
        ["priceInr", "ASC"],
      ],
    });

    return res.status(200).json({
      message: "Subscription plans fetched successfully.",
      data: plans,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch subscription plans.",
      error: error.message,
    });
  }
}

async function selectSubscriptionPlan(req, res) {
  try {
    const { planName, planId } = req.body;

    if (!planName && !planId) {
      return res.status(400).json({
        message: "Provide either planName or planId.",
      });
    }

    const where = planId ? { id: planId } : { name: planName };
    const plan = await SubscriptionPlan.findOne({ where });

    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found." });
    }

    await User.update(
      { subscriptionPlanId: plan.id },
      { where: { id: req.user.userId } }
    );

    return res.status(200).json({
      message: "Subscription plan selected successfully.",
      data: {
        id: plan.id,
        name: plan.name,
        priceInr: plan.priceInr,
        billingCycle: plan.billingCycle,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to select subscription plan.",
      error: error.message,
    });
  }
}

async function getCurrentSubscription(req, res) {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [
        {
          model: SubscriptionPlan,
          as: "subscriptionPlan",
          attributes: [
            "id",
            "name",
            "priceInr",
            "billingCycle",
            "benefitSummary",
            "featureList",
            "isHighlighted",
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Current subscription fetched successfully.",
      data: user.subscriptionPlan,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch current subscription.",
      error: error.message,
    });
  }
}

module.exports = {
  getSubscriptionPlans,
  selectSubscriptionPlan,
  getCurrentSubscription,
};
