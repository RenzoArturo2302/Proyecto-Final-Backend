import jsonwebtoken from "jsonwebtoken";
import { conexion } from "./client.js";
import { ROL } from "@prisma/client";

export const returnMessageError = (e) => {
  let message;

  if (e.name === "PrismaClientKnownRequestError") {
    // The .code property can be accessed in a type-safe manner
    if (e.code === "P2002") {
      message = `Este ${e.meta.target} ya esta en uso`;
    }
  } else if (e.message.includes("Invalid value for argument")) {
    const msg = e.message.split("Invalid value for argument ");
    message = `Argumento inválido para el campo ${msg[1].split(".")[0]}`;
  } else {
    return e.message;
  }

  return message;
};

export const validarToken = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(403).json({
      message: "Se necesita un token para esta petición",
    });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      message: "Debe enviar su token",
    });
  }

  try {
    const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await conexion.usuario.findFirstOrThrow({
      where: { id: payload.usuarioId },
    });

    req.usuario = user;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Error al verificar la token",
      content: error.message,
    });
  }
};

export const validarCliente = async (req, res, next) => {
  const { rol } = req.usuario;
  if (rol == ROL.CLIENTE) {
    next();
  } else {
    return res.status(403).json({
      message: "Usuario con permisos insuficientes",
    });
  }
};

export const validarAdmin = async (req, res, next) => {
  const { rol } = req.usuario;
  if (rol == ROL.ADMIN) {
    next();
  } else {
    return res.status(403).json({
      message: "Usuario con permisos insuficientes",
    });
  }
};
