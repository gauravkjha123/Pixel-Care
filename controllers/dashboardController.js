const User = require('../models').User;
const { Op } = require("sequelize");
const { ROLES } = require("../models/user");
const index = async(req,res)=>{

    const users = await User.count({where:{
        role: {
            [Op.not]: ROLES.ADMIN_ROLE,
          }
    }});
    const array = [
        {
            title:'Users',
            count:users,
            route:"/admin/users",
            class:'bg-warning',
            icon:'fas fa-solid fas fa-users'
        }
    ];

    res.render('dashboard',{data:req,title:'Dashboard',array});
}

module.exports = {index}