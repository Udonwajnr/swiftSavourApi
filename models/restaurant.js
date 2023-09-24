'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Dish,Category}) {
      // define association here
      this.hasMany(Dish,{foreignKey:"restaurantId",as:"dish"})
      this.hasMany(Category,{foreignKey:"categoryRestaurantId",as:"restaurant"})
    }
  }
  Restaurant.init({
    uuid:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      allowNull:false
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    address: {
    type:DataTypes.STRING,
    allowNull:false
    },
    latitude:{
      type:DataTypes.FLOAT,
      allowNull:false
    },
    longitude:{
      type:DataTypes.FLOAT,
      allowNull:false
    },
    rating:{
      type:DataTypes.FLOAT,
      allowNull:false
    },
    phoneNumber: {
      type:DataTypes.STRING,
      allowNull:false
    },
    deliveryTime: {
      type:DataTypes.STRING,
      allowNull:false
    },
    logo: {
      type:DataTypes.STRING,
      allowNull:false

    },
    image:{
      type:DataTypes.STRING,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};