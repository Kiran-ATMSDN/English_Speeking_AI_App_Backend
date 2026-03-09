"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("common_sentences", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      level: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      sentence: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      meaning_hi: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      usage_tip: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
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

    await queryInterface.addIndex("common_sentences", ["level"]);
    await queryInterface.addIndex("common_sentences", ["level", "sort_order"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("common_sentences");
  },
};
