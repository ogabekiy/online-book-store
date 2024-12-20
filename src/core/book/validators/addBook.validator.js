import Joi from "joi";
export const addBookVal = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  publisher_id: Joi.number().required(),
  category_id: Joi.number().required(),
  price: Joi.number().required(),
});
