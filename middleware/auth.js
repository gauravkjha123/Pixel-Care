const jwt = require('jsonwebtoken');
const {ROLES} = require('../models/user');
const User = require('../models').User;

async function auth(req,res,next){

    const token = req.cookies.session;      
    if(!token) return res.redirect('/');
    let verified
    try {
        verified  = jwt.verify(token,'SECRET');
    } catch (error) {
        res.clearCookie('session');
        return res.redirect('/')
    }
    if(verified){
        const userRole = await User.findOne({where:{
            id:verified.id,
            role:ROLES.ADMIN_ROLE
        }});
        
        if(userRole){
            req.user_id = verified.id
            next();
        }
        else{
            res.clearCookie('session');
            return res.redirect('/')
        }
    }else{
       return res.redirect('/');
    }
}

module.exports = auth;