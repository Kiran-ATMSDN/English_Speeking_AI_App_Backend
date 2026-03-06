"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert("subscription_plans", [
      {
        name: "general",
        price_inr: 0,
        billing_cycle: "monthly",
        benefit_summary: "Basic plan for everyday spoken English practice.",
        feature_list: JSON.stringify([
          "Daily basic conversation practice",
          "Limited grammar correction",
          "Community support",
        ]),
        is_highlighted: false,
        created_at: now,
        updated_at: now,
      },
      {
        name: "premium",
        price_inr: 499,
        billing_cycle: "monthly",
        benefit_summary: "Advanced plan with guided improvement and full access.",
        feature_list: JSON.stringify([
          "Unlimited AI speaking sessions",
          "Advanced pronunciation feedback",
          "Personalized learning roadmap",
          "Priority support",
        ]),
        is_highlighted: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("subscription_plans", {
      name: ["general", "premium"],
    });
  },
};
