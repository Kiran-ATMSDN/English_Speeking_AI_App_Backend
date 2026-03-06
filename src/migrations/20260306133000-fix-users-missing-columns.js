"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("users");

    if (!table.full_name) {
      await queryInterface.addColumn("users", "full_name", {
        type: Sequelize.STRING(120),
        allowNull: true,
      });

      await queryInterface.sequelize.query(`
        UPDATE users
        SET full_name = COALESCE(full_name, 'User')
        WHERE full_name IS NULL;
      `);

      await queryInterface.changeColumn("users", "full_name", {
        type: Sequelize.STRING(120),
        allowNull: false,
      });
    }

    if (!table.email) {
      await queryInterface.addColumn("users", "email", {
        type: Sequelize.STRING(120),
        allowNull: true,
        unique: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("users");

    if (table.email) {
      await queryInterface.removeColumn("users", "email");
    }

    if (table.full_name) {
      await queryInterface.removeColumn("users", "full_name");
    }
  },
};
