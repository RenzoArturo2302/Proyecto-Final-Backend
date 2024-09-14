import AWS from "aws-sdk";
import { ImagenSerializer } from "../serializers/imagen.serializer.js";
import { v4 } from "uuid";

export const generarUrlFirmada = async (req, res) => {
  const { error, value } = ImagenSerializer.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Error al generar la imagen",
      content: error.details,
    });
  }

  //   Modificar path

  const { key, path, contentType, extension } = value;
  const nuevaKey = `${v4()}-${key}`;
  const s3 = new AWS.S3();
  const url = s3.getSignedUrl("putObject", {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${path ? `${path}/` : ""}${nuevaKey}.${extension}`,
    Expires: 360,
    ContentType: contentType,
  });

  return res.json({
    content: { url, key: nuevaKey },
  });
};

export const subirImagen = async (req, res) => {
  console.log(req.files);

  return res.json({
    content: "uwu",
  });
};
