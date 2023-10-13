'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contact.init({
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    phone_number: {
      type: DataTypes.STRING
    },
    description:{
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'Contact',
    createdAt:"created_at",
    updatedAt:"updated_at"
  });
  return Contact;
};