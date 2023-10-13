const { Op } = require('sequelize');

const Contact = require('../models').Contact;

const index = async(req,res)=>{
    
    if(req.xhr){
        
        var draw = parseInt(req.query.draw);
        var start = parseInt(req.query.start);
        var length = parseInt(req.query.length);
        var name = 'id';
        var dir = 'desc';
        
        if(req.query.order != undefined){
            var order = req.query.order;
            column = order[0].column;
            var name = req.query.columns[column].name;
            dir = req.query.order[0].dir;
        }
        
        var search_value = req.query.search['value'];
        
        var contactsCount = await Contact.count({
            // offset:start,
            // limit:length,
            where:{
                [Op.or]:[
                    {
                        name: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        phone_number: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        created_at: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                ]   
            },
            order:[[name,dir]]
        });
        
        var contacts = await Contact.findAll({
            offset:start,
            limit:length,
            where:{
                [Op.or]:[
                    {
                        name: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        phone_number: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        created_at: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                ]   
            },
            attributes:['id','name','email','phone_number','description','created_at'],
            order:[[name,dir]]
        });
        
        var output = {
            'draw' : draw,
            'recordsTotal' : contactsCount,
            'recordsFiltered' : contactsCount,
            'data' : contacts
        };
        
        return res.json(output);
        
    }
    res.render('contacts',{data:req,title:'Contact us inquires'})
    
}

const show = async(req,res)=>{
    
    try {
        const id = req.params.id;
        const data = await Contact.findOne({where:{id},attributes:['id','description']});
        
        return res.status(200).json({status:true,data:data.description});
    } catch (error) {
        return res.status(400).json({status:false,error:error.errors});        
    }
    
}

module.exports = {index,show}