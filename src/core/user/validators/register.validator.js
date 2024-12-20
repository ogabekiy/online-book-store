import Joi from "joi";

export const registerValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  role: Joi.string().valid("Admin", "User", "Seller").required(),
});

