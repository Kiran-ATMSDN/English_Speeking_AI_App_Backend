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
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Profile fetched successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch profile.",
      error: error.message,
    });
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
      return res.status(400).json({
        message: "Provide at least one field: fullName, email, learningPurpose.",
      });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.update(updates);

    return res.status(200).json({
      message: "Profile updated successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update profile.",
      error: error.message,
    });
  }
}

module.exports = {
  getMyProfile,
  updateMyProfile,
};
