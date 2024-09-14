import Joi from "joi";

export const RegistrarDetallesVentaSerializer = Joi.object({
  cantidad: Joi.number().required(),
  ventaId: Joi.string().required(),
  productoId: Joi.string().required(),
});
