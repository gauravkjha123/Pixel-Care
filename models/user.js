'use strict';
const {
  Model
} = require('sequelize');

const STATUS_ACTIVE = 1;
const STATUS_INACTIVE = 0;
const STATUS_PENDING = 2;

const USER_ROLE = 0;
const ADMIN_ROLE = 1;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

  }
  User.init({
    role:{
      type:DataTypes.TINYINT
    },
    first_name: {
      type: DataTypes.STRING
    },
    user_name: {
      type: DataTypes.STRING,
      unique:true
    },
    last_name:{
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    phone_number:{
      type:DataTypes.STRING
    },
    department:{ 
      type:DataTypes.STRING
    },
    status:{
      type:DataTypes.TINYINT
    },
    image:{
      type:DataTypes.STRING,
      get(){
        const value = this.getDataValue('image');
        if(value != null){
          return '/storage/images/users/'+value;
        }else{
          return '/images/userNotFound.jpg';
        }
      }
    },
    
  }, {
    scopes: {
      removePassword: {
        attributes:{
          exclude:['password']
        }
      },
    },
    sequelize,
    modelName: 'User',
    createdAt:"created_at",
    updatedAt:"updated_at"
  });
  return User;
};
module.exports.STATUS = {STATUS_ACTIVE,STATUS_INACTIVE,STATUS_PENDING};
module.exports.ROLES = {USER_ROLE,ADMIN_ROLE};