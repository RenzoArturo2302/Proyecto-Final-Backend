import { TIPO_SUCURSAL } from "@prisma/client";
import Joi from "joi";

export const RegistrarSucursalSerializer = Joi.object({
  nombre: Joi.string().required(),
  direccion: Joi.string().optional(),
  telefono: Joi.string().optional(),
  tipoSucursal: Joi.required().allow(
    TIPO_SUCURSAL.ARTICULOS_PARA_EL_HOGAR,
    TIPO_SUCURSAL.MOTOS_Y_REPUESTOS
  ),
});

export const SucursalSerializer = Joi.object({
  nombre: Joi.string().optional(),
  direccion: Joi.string().optional(),
  telefono: Joi.string().optional(),
  tipoSucursal: Joi.optional().allow(
    TIPO_SUCURSAL.ARTICULOS_PARA_EL_HOGAR,
    TIPO_SUCURSAL.MOTOS_Y_REPUESTOS
  ),
});
