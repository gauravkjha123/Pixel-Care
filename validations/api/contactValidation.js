const Joi = require('joi');

const contactValidation = (data)=>{
    
    const schema = Joi.object().keys({
        
        name:Joi.string().min(3).max(20).required().messages({
            "string.base":`Please give data in json!`,
            "string.min":`Name should have atleast 3 characters!`,
            "string.max":`Name cannot exceed more than 20 characters!`,
            "string.empty":`Please enter Name!`
        }),
        email:Joi.string().email().max(100).required().messages({
            "string.base":`Please give data in json!`,
            "string.email":`Please enter email in proper format!`,
            "string.max":`Email cannot exceed more than 100 characters!`,
            "string.empty":`Please enter email!`
        }),
        phone_number:Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
            "string.base":`Please give data in json!`,
            "string.length":`Phone number length should be 10 digits only!`,
            "string.pattern":`Please enter phone number in numbers only!`,
            "string.empty":`Please enter phone number!`
        }),
        description:Joi.string().pattern(/\D+/).required().messages({
            "string.base":`Please give data in json!`,
            "string.pattern":`Description cannot have numbers only!`,
            "string.empty":`Please enter description!`
        })
    });
    
    const result = schema.validate(data);
    return result;
}

module.exports = {contactValidation}