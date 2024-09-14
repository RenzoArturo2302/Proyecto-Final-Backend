import { conexion } from "../client.js";
import { MarcaSerializer } from "../serializers/marca.serializer.js";

// agregar marca

export const registrarMarca = async (req, res) => {
  const { error, value } = MarcaSerializer.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Error al registrar la marca",
      content: error.details,
    });
  }

  const marcaCreada = await conexion.marca.create({
    data: {
      ...value,
    },
  });

  return res.status(201).json({
    message: "Marca creada exitosamente",
    content: marcaCreada,
  });
};

// ver marcas
export const marcaList = async (req, res) => {
  const resultado = await conexion.marca.findMany();
  return res.json({
    message: "Marcas: ",
    content: resultado,
  });
};

// eliminar marca
export const deleteMarcaWithId = async (req, res) => {
  const { id } = req.params;
  const deletedMarca = await conexion.marca.delete({
    where: { id: id },
  });

  return res.json({
    message: "Marca elimada",
    content: deletedMarca,
  });
};

export const marcaWithName = async (req, res) => {
  const { nombre } = req.params;
  const marca = await conexion.marca.findFirst({
    where: { nombre: nombre },
  });

  if (!marca) {
    return res.status(400).json({
      message: "No exite esa marca",
    });
  }

  return res.json({
    message: "La marca es",
    content: marca,
  });
};
