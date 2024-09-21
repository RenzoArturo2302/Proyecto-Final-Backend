import Joi from "joi";

export const RegistrarProductoSerializer = Joi.object({
  stock: Joi.number().required(),
  precio: Joi.number().required(),
  descripcion: Joi.string().optional(),
  imagenUrl: Joi.string().optional(),
  tipoProductoId: Joi.string().required(),
  marcaId: Joi.string().required(),
  sucursalId: Joi.string().required(),
});

export const ProductoSerializer = Joi.object({
  stock: Joi.number().optional(),
  precio: Joi.number().optional(),
  descripcion: Joi.string().optional(),

  tipoProductoId: Joi.string().optional(),
  marcaId: Joi.string().optional(),
  sucursalId: Joi.string().optional(),
  imagenUrl: Joi.string().optional(),
});
