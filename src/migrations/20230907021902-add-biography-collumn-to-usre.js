"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "biography", {
      type: Sequelize.STRING,
      defaultValue: "",
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the 'feature' column
    await queryInterface.removeColumn("Users", "biography");
  },
};
