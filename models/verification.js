'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Verification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
      // UserID
      this.belongsTo(User,{foreignKey:"userId",as:"User",onDelete:"CASCADE"})
    }
  }
  Verification.init({
    token: {
    type:DataTypes.STRING,
      allowNull:false
    },
    type:{
      type:DataTypes.STRING,
      required:false
    }
  }, {
    sequelize,
    modelName: 'Verification',
  });
  return Verification;
};