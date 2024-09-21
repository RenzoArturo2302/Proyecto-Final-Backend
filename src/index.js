import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import { rutas } from "./router.js";
import { returnMessageError } from "./utils.js";
import AWS from "aws-sdk";
import swaggerUI from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";

const swaggerConfig = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Proyecto final API",
      description:
        "Proyecto basado en el inventario de un almácen y las ventas realizadas.",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["src/router.js"],
};

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
servidor.use(cors());
const PUERTO = process.env.PORT;

servidor.use(express.json());
servidor.use(
  rutas,
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsdoc(swaggerConfig))
);
servidor.use(errorHandler);

servidor.listen(PUERTO, () => {
  console.log(`Servidor corriendo exitosamente en el puerto ${PUERTO}`);
});
