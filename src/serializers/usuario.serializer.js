import { ROL } from "@prisma/client";
import Joi from "joi";

export const RegistrarUsuarioSerializer = Joi.object({
  nombre: Joi.string().required(),
  apellido: Joi.string().required(),
  habilitado: Joi.boolean().optional().default(true),
  email: Joi.string().required().email(),
  //  - La contraseña debe contener un dígito del 1 al 9
  //  - Una letra minúscula, una letra mayúscula
  //  - Un carácter especial
  //  - Ningún espacio
  //  - Debe tener entre 8 y 16 caracteres.
  password: Joi.string()
    .required()
    .regex(
      new RegExp(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      )
    ),
  rol: Joi.string().required().allow(ROL.ADMIN, ROL.CLIENTE),
});

export const LoginSerializer = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const UsuarioSerializer = Joi.object({
  nombre: Joi.string().optional(),
  apellido: Joi.string().optional(),
  habilitado: Joi.boolean().optional(),
  email: Joi.string().optional().email(),
  password: Joi.string()
    .optional()
    .regex(
      new RegExp(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      )
    ),
});
