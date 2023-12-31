'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Restaurant,Category}) {
      // define association here
      this.belongsTo(Restaurant,{foreignKey:"restaurantId",onDelete:"CASCADE",as:'restaurant'})
      this.belongsTo(Category,{foreignKey:"categoryId",as:'category',onDelete:"SET NULL"})
    }
  }
  Dish.init({
    uuid:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      allowNull:false
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    description:{
      type: DataTypes.TEXT,
      allowNull:false
    },
    image:{
      type: DataTypes.STRING,
      allowNull:false
    },
    price:{
      type:DataTypes.FLOAT,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Dish',
  });
  return Dish;
};