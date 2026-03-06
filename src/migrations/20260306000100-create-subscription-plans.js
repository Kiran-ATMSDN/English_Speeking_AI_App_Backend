"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("subscription_plans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      price_inr: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      billing_cycle: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "monthly",
      },
      benefit_summary: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      feature_list: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      is_highlighted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("subscription_plans");
  },
};
