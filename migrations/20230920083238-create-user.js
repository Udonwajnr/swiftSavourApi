'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      uuid:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull:false
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull:false
      },
      userName:{
        type:DataTypes.STRING(50),
        allowNull:false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
          isEmail:true
        }
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull:false,
        unique:true
      },
      password: {
        type: DataTypes.STRING,
        allowNull:false
      },
      verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verifiedAt: {
      type: DataTypes.DATE,
    },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('Users');
  }
};