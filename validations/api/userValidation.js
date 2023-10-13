const Joi = require('joi');

const userValidation = (data)=>{
    
    try {
        const schema = Joi.object().keys({
            first_name:Joi.string().min(3).max(20).required().messages({
                "string.base":`Please give data in json!`,
                "string.min":`First name should have atleast 3 characters!`,
                "string.max":`First name cannot exceed more than 20 characters!`,
                "string.empty":`Please enter first name!`
            }),
            // last_name:Joi.string().min(3).max(20).optional().messages({
            //     "string.base":`Please give data in json!`,
            //     "string.min":`last name should have atleast 3 characters!`,
            //     "string.max":`last name cannot exceed more than 20 characters!`,
            //     "string.empty":`Please enter last name!`
            // }),
            phone_number:Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
                "string.base":`Please give data in json!`,
                "string.length":`Phone number length should be 10 digits only!`,
                "string.pattern":`Please enter phone number in numbers only!`,
                "string.empty":`Please enter phone number!`
            }),
            // department:Joi.string().min(3).max(20).optional().messages({
            //     "string.base":`Please give data in json!`,
            //     "string.min":`Department should have atleast 3 characters!`,
            //     "string.max":`Department cannot exceed more than 20 characters!`,
            //     "string.empty":`Please enter department!`
            // }),
            image:Joi.string().required().messages({
                "string.base":`Please give data in json!`,
                "string.empty":`Please upload your image!`
            })
        }).unknown(true);
        
        const result = schema.validate(data);
        // console.log(result.error.details);
        return result;
    } catch (error) {
        return result.status(400).json({error:error.message});
    }
    
    
}
module.exports = {userValidation}