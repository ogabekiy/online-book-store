import Joi from "joi";
export const addOrderVal = Joi.object({
  book_id: Joi.number().required(),
  quantity: Joi.number().required(),
});
