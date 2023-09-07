"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "sports", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
      allowNull: false,
    });

    await queryInterface.bulkUpdate("Users", { sports: [""] }, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "sports");
  },
};
