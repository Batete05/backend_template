const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const validateEmployee = (data) => {
  const schema = joi.object({
    firstName: joi.string().required().label("First Name"),
    lastName: joi.string().required().label("Last Name"),
    nationalId: joi.string().required().max(16).min(16).label("National Id"),
    email: joi.string().email().required().label("Email"),
    phone: joi.number().required().label("Phone"),
    department: joi.string().required().label("Department"),
    position: joi.string().required().label("Position"),
    laptopManufacture: joi.string().required().label("Laptop Manufacture"),
    model: joi.string().required().label("Model"),
    serialNumber: joi.string().required().label("Serial Number"),
  });
  return schema.validate(data);
};

module.exports = {
  validateEmployee,
};
