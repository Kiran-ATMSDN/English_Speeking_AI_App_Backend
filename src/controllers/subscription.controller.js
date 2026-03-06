const { SubscriptionPlan, User } = require("../models");

async function getSubscriptionPlans(_req, res) {
  try {
    const plans = await SubscriptionPlan.findAll({
      order: [
        ["isHighlighted", "DESC"],
        ["priceInr", "ASC"],
      ],
    });

    return res.success("Subscription plans fetched successfully.", plans);
  } catch (error) {
    return res.error("Failed to fetch subscription plans.", 500, error.message);
  }
}

async function selectSubscriptionPlan(req, res) {
  try {
    const { planName, planId } = req.body;

    if (!planName && !planId) {
      return res.error("Provide either planName or planId.", 400);
    }

    const where = planId ? { id: planId } : { name: planName };
    const plan = await SubscriptionPlan.findOne({ where });

    if (!plan) {
      return res.error("Subscription plan not found.", 404);
    }

    await User.update(
      { subscriptionPlanId: plan.id },
      { where: { id: req.user.userId } }
    );

    return res.success("Subscription plan selected successfully.", {
      id: plan.id,
      name: plan.name,
      priceInr: plan.priceInr,
      billingCycle: plan.billingCycle,
    });
  } catch (error) {
    return res.error("Failed to select subscription plan.", 500, error.message);
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
      return res.error("User not found.", 404);
    }

    return res.success("Current subscription fetched successfully.", user.subscriptionPlan);
  } catch (error) {
    return res.error("Failed to fetch current subscription.", 500, error.message);
  }
}

module.exports = {
  getSubscriptionPlans,
  selectSubscriptionPlan,
  getCurrentSubscription,
};
