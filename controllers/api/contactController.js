const Contact = require('../../models').Contact;
const {contactValidation} = require('../../validations/api/contactValidation');

const store = async(req,res)=>{
    
    try {
        const result = contactValidation(req.body);
        if(result.error){
            return res.status(422).json({status:false,message:result.error.message});
        }
        
        const {
            name,
            email,
            phone_number,
            description
        }=req.body
        
        const data = {
            name,
            email,
            phone_number,
            description
        }
        
        const createData = await Contact.create(data);
        return res.status(201).json({status:true,
            message:'Thank you for connecting with us! We will contact you soon.',
        });
    } catch (error) {
        return res.status(400).json({status:false,message:error});        
    }
    
}

module.exports = {store};