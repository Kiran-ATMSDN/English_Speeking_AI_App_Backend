"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pronunciation_tips", {
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
      title: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      guide: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      example: {
        type: Sequelize.TEXT,
        allowNull: false,
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

    await queryInterface.addIndex("pronunciation_tips", ["level"]);
    await queryInterface.addIndex("pronunciation_tips", ["level", "sort_order"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("pronunciation_tips");
  },
};
