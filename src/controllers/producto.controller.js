import { conexion } from "../client.js";
import {
  ProductoSerializer,
  RegistrarProductoSerializer,
} from "../serializers/producto.serializer.js";

// agregar producto
export const agregarProducto = async (req, res) => {
  const { error, value } = RegistrarProductoSerializer.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Error al generar el producto",
      content: error.details,
    });
  }

  const productoCreado = await conexion.producto.create({
    data: { ...value },
  });

  return res.status(201).json({
    message: "Producto creado exitosamente",
    content: productoCreado,
  });
};

// eliminar productoo
export const deleteProductWithId = async (req, res) => {
  const { id } = req.params;

  const foundProduct = await conexion.producto.findFirst({
    where: { id: id },
    select: { id: true },
  });

  if (!foundProduct) {
    return res.status(400).json({
      message: "Se ha ingresado un id incorrecto",
    });
  }

  const deletedProduct = await conexion.producto.delete({
    where: { id: foundProduct.id },
  });

  return res.json({
    message: "Producto eliminado",
    content: deletedProduct,
  });
};

// editar producto
export const editProductWithId = async (req, res) => {
  const { id } = req.params;
  const { error, value } = ProductoSerializer.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Error al actualizar el producto",
      content: error.details,
    });
  }

  const foundProduct = await conexion.producto.findFirst({
    where: { id: id },
    select: { id: true },
  });

  if (!foundProduct) {
    return res.status(400).json({
      message: "Se ha ingresado un id incorrecto",
    });
  }

  const updatedProducto = await conexion.producto.update({
    where: { id: foundProduct.id },
    data: {
      ...value,
    },
  });

  return res.json({
    message: "Los datos del producto han sido actualizados",
    content: updatedProducto,
  });
};

// Ver productos
export const productList = async (req, res) => {
  const resultado = await conexion.producto.findMany({
    select: {
      id: true,
      stock: true,
      precio: true,
      descripcion: true,
      createdAt: true,
      updatedAt: true,
      imagenUrl: true,
      tipoProducto: { select: { nombre: true } },
      marca: { select: { nombre: true } },
      sucursal: { select: { nombre: true, tipoSucursal: true } },
    },
  });
  return res.status(200).json({
    message: "Productos: ",
    content: resultado,
  });
};

// Ver producto con id
export const productWithId = async (req, res) => {
  const { id } = req.params;

  const resultado = await conexion.producto.findFirst({
    where: { id: id },
    select: {
      id: true,
      stock: true,
      precio: true,
      descripcion: true,
      imagenUrl: true,
      createdAt: true,
      updatedAt: true,
      tipoProducto: { select: { nombre: true } },
      marca: { select: { nombre: true } },
      sucursal: { select: { nombre: true, tipoSucursal: true } },
    },
  });

  if (!resultado) {
    return res.status(400).json({
      message: "Se ha ingresado un id incorrecto",
    });
  }

  return res.status(200).json({
    message: "Producto: ",
    content: resultado,
  });
};
