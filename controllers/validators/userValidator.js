const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const validateUser = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label('First Name'),
        lastName: Joi.string().required().label('Last Name'),
        email: Joi.string().email().required().label('Email'),
        phone: Joi.number().required().label('Phone Number'),
        password: passwordComplexity().required().label('Password'),
        image: Joi.string().allow(null).label('Image'),
        // role:Joi.string().default("NORMAL").label("Role ")
    });
    return schema.validate(data);
};

const validatePasswordComplexity = (data) => {
    const schema = Joi.object({
        password: passwordComplexity().required().label('Password'),
    });
    return schema.validate(data);
};

const validateOnLogin = (data) => {
    const schema = Joi.object({
        email_phone: Joi.string().required().label('Email/Phone'),
        password: Joi.string().required().label('Password'),
    });
    return schema.validate(data);
};

module.exports = {
    validateUser,
    validatePasswordComplexity,
    validateOnLogin
};