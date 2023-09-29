'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Restaurants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
      allowNull:false
      },
      address: {
        type: Sequelize.STRING,
        allowNull:false
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull:false
      },
      longitude: {
        type: Sequelize.FLOAT,
      allowNull:false
      },
      country:{
        type:Sequelize.STRING,
        allowNull:false
      },
      state: {
        type:Sequelize.STRING,
        allowNull:false
      },
      city: {
        type:Sequelize.STRING,
        allowNull:false
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull:false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull:false
      },
      deliveryTime: {
        type: Sequelize.STRING,
        allowNull:false
      }, 
      logo: {
        type:Sequelize.STRING,
        allowNull:false
      },
      image:{
        type:Sequelize.STRING,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Restaurants');
  }
};