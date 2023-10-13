const express = require('express');
var expressBusboy = require('express-busboy');
const app = express();
const db = require('./models');
var  fs = require ( 'fs' );
const cookieParser = require('cookie-parser');
const path = require('path');
const expressLayout = require('express-ejs-layouts');

//WEB AUTH MIDDLEWARES
const auth = require('./middleware/auth');
const guest = require('./middleware/guest');

//API AUTH MIDDLEWARES
const authUser = require('./middleware/api/authApi');

//USE MIDDLEWARE
expressBusboy.extend(app,{
    upload:true
});

//SYNCING DB
db.sequelize.sync().then(()=>{
    console.log("All Model Syncing!");
}).catch((err)=>{
    console.log(err);
});

//WEB ROUTES
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const usersRoutes = require('./routes/users');;
const contactRoutes = require('./routes/contacts');
//API ROUTES
const authApiRoutes = require('./routes/api/auth');
const userApiRoutes = require('./routes/api/users');
const contactApiRoutes = require('./routes/api/contacts');

app.use(cookieParser());
app.set('view engine','ejs');
app.use(expressLayout);
app.set('layout',__dirname+"/views/layout");
app.set('views',__dirname+"/views/admin");

app.use(express.static(path.join(__dirname,"public")));
app.use('/storage/images/', express.static(process.cwd() + '/storage/images/'))

app.set("layout forgotPassword", false);
//CALLING WEB ROUTES
app.use('/',authRoutes);
app.use('/admin',auth,usersRoutes);
app.use('/admin',auth,dashboardRoutes);
app.use('/admin',auth,contactRoutes);

//CALLING API ROUTES
app.use('/api',authApiRoutes);
app.use('/api',contactApiRoutes);
app.use('/api',authUser,userApiRoutes);

app.set("layout login", false);

app.get('/',guest,(req,res)=>{
    res.render('login',{layout:'login'});
});

app.use((err,req,res,next)=>{
    res.status(500).json({status:false,message:err.message});
})
app.listen(4000,()=>{
    console.log('Server running on port 4000');
});