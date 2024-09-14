import { ROL } from "@prisma/client";
import { conexion } from "../client.js";
import { RegistrarDetallesVentaSerializer } from "../serializers/detalleVenta.serializar.js";

// Agregar productos a detalleCompra (Agregar productos a detalles Venta)
export const agregarProductoDetalleVenta = async (req, res) => {
  const user = req.usuario;
  const { error, value } = RegistrarDetallesVentaSerializer.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Error al generar el detalle de la venta",
      content: error.details,
    });
  }

  const foundProducto = await conexion.producto.findFirst({
    where: { id: value.productoId },
    select: { precio: true, stock: true },
  });

  if (foundProducto.stock < value.cantidad) {
    return res.status(400).json({
      message: "No hay suficiente stock",
    });
  }

  const foundVenta = await conexion.venta.findFirst({
    where: { id: value.ventaId },
    select: { usuarioId: true, id: true },
  });

  if (user.rol === ROL.ADMIN || foundVenta.usuarioId === user.id) {
    const detalleVentaCreado = conexion.detallesVenta.create({
      data: { ...value },
    });

    const sumarTotal = conexion.venta.update({
      where: { id: value.ventaId },
      data: { total: { increment: foundProducto.precio * value.cantidad } },
    });

    const restarStock = conexion.producto.update({
      where: { id: value.productoId },
      data: { stock: { decrement: value.cantidad } },
    });

    const transaction = await conexion.$transaction([
      detalleVentaCreado,
      sumarTotal,
      restarStock,
    ]);

    return res.status(201).json({
      message: "Detalle de la venta agregado correctamente",
      content: [transaction[0], transaction[1]],
    });
  } else {
    return res.status(400).json({
      message: "No puede agregar un detalle a una venta que no le pertenece",
    });
  }
};

// Eliminar un detalleVenta
export const deleteDetalleVentaWithId = async (req, res) => {
  const user = req.usuario;
  console.log(user);
  const { id } = req.params;

  const detalleAEliminar = await conexion.detallesVenta.findFirst({
    where: { id: id },
    select: {
      cantidad: true,
      id: true,
      venta: {
        select: {
          id: true,
          usuarioId: true,
        },
      },
      producto: {
        select: {
          id: true,
          precio: true,
        },
      },
    },
  });

  if (user.rol === ROL.ADMIN || detalleAEliminar.venta.usuarioId === user.id) {
    const deletedDetalleVenta = conexion.detallesVenta.delete({
      where: { id: id },
    });

    const retornarStock = conexion.producto.update({
      where: { id: detalleAEliminar.producto.id },
      data: { stock: { increment: detalleAEliminar.cantidad } },
    });

    const disminuirTotal = conexion.venta.update({
      where: { id: detalleAEliminar.venta.id },
      data: {
        total: {
          decrement:
            detalleAEliminar.producto.precio * detalleAEliminar.cantidad,
        },
      },
    });

    const transaction = await conexion.$transaction([
      deletedDetalleVenta,
      retornarStock,
      disminuirTotal,
    ]);

    return res.json({
      message: "Detalle venta eliminado",
      content: transaction[0],
    });
  } else {
    return res.status(400).json({
      message: "No puede eliminar un detalle a una venta que no le pertenece",
    });
  }
};

// No usados
export const detalleVentaList = async (req, res) => {
  const resultado = await conexion.detallesVenta.findMany();

  return res.status(200).json({
    message: "Detalles",
    content: resultado,
  });
};

export const borrarLista = async (req, res) => {
  const resultado = await conexion.detallesVenta.deleteMany();
  return res.status(200).json({
    message: "Detalles",
    content: resultado,
  });
};
