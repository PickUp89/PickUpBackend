"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "biography", {
      type: Sequelize.TEXT,
      defaultValue: "",
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the 'feature' column
    await queryInterface.changeColumn("Users", "biography", {
      type: Sequelize.STRING,
      defaultValue: "",
      allowNull: true,
    });
  },
};
