'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'profilePicture', {
        type: Sequelize.TEXT,
        allowNull: true,
    }) 
  },

  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'profilePicture', {
      type: Sequelize.STRING(1234),
      allowNull: true,
    }) 
  },
};
