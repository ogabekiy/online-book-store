import Joi from "joi";
export const addCategoryVal = Joi.object({
  name: Joi.string().required(),
});
