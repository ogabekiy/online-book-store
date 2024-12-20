import Joi from "joi";
export const addPublisherVal = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
});
