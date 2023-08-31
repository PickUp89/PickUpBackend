"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "permissions", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: ["LOGIN"],
      allowNull: false,
    });

    // Update existing rows to set default value [Feature.LOGIN]
    await queryInterface.bulkUpdate("Users", { permissions: ["LOGIN"] }, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove the 'feature' column
    await queryInterface.removeColumn("Users", "feature");
  },
};
