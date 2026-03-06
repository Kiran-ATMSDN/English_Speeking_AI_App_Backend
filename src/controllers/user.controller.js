const { User, SubscriptionPlan } = require("../models");

async function getMyProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [
        {
          model: SubscriptionPlan,
          as: "subscriptionPlan",
          attributes: ["id", "name", "priceInr", "billingCycle"],
        },
      ],
    });

    if (!user) {
      return res.error("User not found.", 404);
    }

    return res.success("Profile fetched successfully.", user);
  } catch (error) {
    return res.error("Failed to fetch profile.", 500, error.message);
  }
}

async function updateMyProfile(req, res) {
  try {
    const { fullName, email, learningPurpose } = req.body;
    const updates = {};

    if (typeof fullName === "string" && fullName.trim()) {
      updates.fullName = fullName.trim();
    }

    if (typeof email === "string" && email.trim()) {
      updates.email = email.trim().toLowerCase();
    }

    if (typeof learningPurpose === "string" && learningPurpose.trim()) {
      updates.learningPurpose = learningPurpose.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.error("Provide at least one field: fullName, email, learningPurpose.", 400);
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.error("User not found.", 404);
    }

    await user.update(updates);

    return res.success("Profile updated successfully.", user);
  } catch (error) {
    return res.error("Failed to update profile.", 500, error.message);
  }
}

module.exports = {
  getMyProfile,
  updateMyProfile,
};
