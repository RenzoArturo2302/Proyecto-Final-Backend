import { conexion } from "../client.js";
import { TipoProductoSerializer } from "../serializers/tipoProducto.serializer.js";

// agregar tipoProducto

export const registrarTipoProducto = async (req, res) => {
  const { error, value } = TipoProductoSerializer.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Error al registrar la marca",
      content: error.details,
    });
  }

  const tipoProductoCreado = await conexion.tipoProducto.create({
    data: {
      ...value,
    },
  });

  return res.status(201).json({
    message: "tipo de producto creado exitosamente",
    content: tipoProductoCreado,
  });
};

// ver tipoProductos
export const tipoProductoList = async (req, res) => {
  const resultado = await conexion.tipoProducto.findMany();
  return res.json({
    message: "tipoProductos: ",
    content: resultado,
  });
};

// eliminar tipoProducto
export const deletetipoProductoWithId = async (req, res) => {
  const { id } = req.params;
  const deletedtipoProducto = await conexion.tipoProducto.delete({
    where: { id: id },
  });

  return res.json({
    message: "tipoProducto elimada",
    content: deletedtipoProducto,
  });
};

// buscar el tipoProducto
export const tipoProductoWithName = async (req, res) => {
  const { nombre } = req.params;
  const tipoProducto = await conexion.tipoProducto.findFirst({
    where: { nombre: nombre },
  });

  if (!tipoProducto) {
    return res.status(400).json({
      message: "No exite esa tipo de producto",
    });
  }

  return res.json({
    message: "La tipoProducto es",
    content: tipoProducto,
  });
};
