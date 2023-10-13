const Joi = require('joi');

const adminValidation = (data)=>{
    
    const schema = Joi.object().keys({
        id:Joi.string().required(),
        first_name:Joi.string().min(2).pattern(/\D+/).max(100).required(),
        user_name:Joi.string().min(4).max(100).required().messages(),
        password:Joi.string().min(4).max(50)
        .when('id', {is: Joi.equal('',null), then: Joi.required() , otherwise: Joi.optional().allow('')}),
        password_confirmation:Joi.string().min(4).max(50)
        .when('id', {is: Joi.equal('',null), then:  Joi.required(), otherwise: Joi.optional().allow('')})
        .equal(Joi.ref('password')),
        image:Joi.string().optional().allow(''),
    }).unknown();
    const result = schema.validate(data);
    return result;    
}
module.exports = {adminValidation}