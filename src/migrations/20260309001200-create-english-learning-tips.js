"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("english_learning_tips", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      level: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      action_step: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("english_learning_tips");
  },
};
