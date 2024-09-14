import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { ROL } from "@prisma/client";

import {
  RegistrarUsuarioSerializer,
  LoginSerializer,
  UsuarioSerializer,
} from "../serializers/usuario.serializer.js";
import { conexion } from "../client.js";

// Se registra un usuario
export const registroUser = async (req, res) => {
  const { error, value } = RegistrarUsuarioSerializer.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Error al registrar el usuario",
      content: error.details,
    });
  }

  const encryptedPassword = bcrypt.hashSync(value.password, 12);

  const { password, ...values } = value;
  const usuarioCreado = await conexion.usuario.create({
    data: {
      password: encryptedPassword,
      ...values,
    },
    // select: {},
  });

  // console.log(value);

  return res.status(201).json({
    message: "Usuario creado exitosamente",
    content: usuarioCreado,
  });
};

// El usuario inicia sesión
export const loginUser = async (req, res) => {
  const { error, value } = LoginSerializer.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Error al hacer el login",
      content: error.details,
    });
  }

  const user = await conexion.usuario.findFirstOrThrow({
    where: { email: value.email },
  });

  const isPassword = bcrypt.compareSync(value.password, user.password);

  if (isPassword == false) {
    return res.status(400).json({
      message: "La contraseña es incorrecta",
    });
  }

  const token = jsonwebtoken.sign(
    { usuarioId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "10h" }
  );

  return res.json({
    content: token,
  });
};

// El usuario mira su perfil
export const perfilUser = async (req, res) => {
  const { id, password, ...data } = req.usuario;

  return res.json({
    message: "El perfil es",
    content: data,
  });
};

// Ver la lista de clientes ( Usuarios con rol cliente)
export const userClientList = async (req, res) => {
  const resultado = await conexion.usuario.findMany({
    where: { rol: ROL.CLIENTE },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      habilitado: true,
      email: true,
      rol: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({
    message: "Clientes: ",
    content: resultado,
  });
};

// El usuario modifica su propio ususario
export const updateUser = async (req, res) => {
  const { id } = req.usuario;

  const { error, value } = UsuarioSerializer.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Error al actualizar el usuario",
      content: error.details,
    });
  }

  const updatedUser = await conexion.usuario.update({
    where: { id: id },
    data: {
      nombre: value.nombre,
      apellido: value.apellido,
      habilitado: value.habilitado,
      email: value.email,
      ...(value.password && { password: bcrypt.hashSync(value.password, 12) }),
    },
  });

  return res.json({
    message: "Sus datos han sido actualizados",
    content: updatedUser,
  });
};

// Funciones del administrador
export const perfilUserWithEmail = async (req, res) => {
  const { email } = req.params;

  const user = await conexion.usuario.findFirst({
    where: { email: email },
  });

  if (!user) {
    return res.status(400).json({
      message: "Se ha ingresado un correo incorrecto",
    });
  }

  return res.json({
    message: "El perfil es",
    content: user,
  });
};

export const updateUserWithEmail = async (req, res) => {
  const { email } = req.params;
  const { error, value } = UsuarioSerializer.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Error al actualizar el usuario",
      content: error.details,
    });
  }

  const foundUser = await conexion.usuario.findFirst({
    where: { email: email },
    select: { id: true },
  });

  if (!foundUser) {
    return res.status(400).json({
      message: "Se ha ingresado un correo incorrecto",
    });
  }

  const { password, ...data } = value;

  const updatedUser = await conexion.usuario.update({
    where: { id: foundUser.id },
    data: {
      ...data,
      ...(password && { password: bcrypt.hashSync(password, 12) }),
    },
  });

  return res.json({
    message: "Sus datos han sido actualizados",
    content: updatedUser,
  });
};

// Las cuentas de usuario no se borran, solo se deshabilitan
