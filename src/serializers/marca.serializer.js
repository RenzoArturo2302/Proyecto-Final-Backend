import Joi from "joi";

export const MarcaSerializer = Joi.object({
  nombre: Joi.string().required(),
});
