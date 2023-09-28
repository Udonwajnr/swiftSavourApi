'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Dish,Restaurant}) {
      // define association here
      this.belongsTo(Restaurant,{foreignKey:"categoryRestaurantId",as:"restaurant",onDelete:"CASCADE"})
      this.hasMany(Dish,{foreignKey:"categoryId",as:"dish"})
    }
  }
  Category.init({
    uuid:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      allowNull:false
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};