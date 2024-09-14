import Joi from "joi";

export const TipoProductoSerializer = Joi.object({
  nombre: Joi.string().required(),
});
