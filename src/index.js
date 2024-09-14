import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import { rutas } from "./router.js";
import { returnMessageError } from "./utils.js";
import AWS from "aws-sdk";

// Para poder reconocer las variables externas - Installar dotev npm install dotenv --save
config();

// Iniciar aplicación de express
const servidor = express();

AWS.config.update({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const errorHandler = (error, req, res, next) => {
  const message = returnMessageError(error);

  res.status(400).json({
    message: "Error al realizar la operación",
    content: message,
  });
};

servidor.use(morgan("common"));
const PUERTO = process.env.PORT;

servidor.use(express.json());
servidor.use(rutas);
servidor.use(errorHandler);

servidor.listen(PUERTO, () => {
  console.log(`Servidor corriendo exitosamente en el puerto ${PUERTO}`);
});
