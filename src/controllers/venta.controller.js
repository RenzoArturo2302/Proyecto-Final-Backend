import { Prisma, ROL } from "@prisma/client";
import { conexion } from "../client.js";
import { RegistrarVentaSerializer } from "../serializers/venta.serializer.js";

// Generar compra (como un carrito)
export const generarVenta = async (req, res) => {
  const { error, value } = RegistrarVentaSerializer.validate(req.body);
  const { id } = req.usuario;

  if (error) {
    return res.status(400).json({
      message: "Error al generar la venta",
      content: error.details,
    });
  }

  const ventaCreada = await conexion.venta.create({
    data: {
      usuarioId: id,
      ...value,
    },
  });

  return res.status(201).json({
    message: "Venta creado exitosamente",
    content: ventaCreada,
  });
};

// Ver todas las compras por usuario
export const ventasList = async (req, res) => {
  const resultado = await conexion.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      Venta: true,
    },
  });

  return res.json({
    message: "Ventas: ",
    content: resultado,
  });
};

// Ver compras del usuario
export const ventasListUser = async (req, res) => {
  const { id } = req.usuario;

  const resultado = await conexion.venta.findMany({ where: { usuarioId: id } });
  return res.json({
    message: "Historial de compras: ",
    content: resultado,
  });
};

// Ver ventas con sus detalles
export const ventasListWithId = async (req, res) => {
  const { id } = req.params;
  const user = req.usuario;

  const venta = await conexion.venta.findFirst({
    where: { id: id },
    select: {
      id: true,
      total: true,
      metodoPago: true,
      usuarioId: true,
      createdAt: true,
      updatedAt: true,
      DetallesVenta: {
        select: {
          id: true,
          cantidad: true,
          producto: {
            select: {
              descripcion: true,
              marca: { select: { nombre: true } },
              tipoProducto: { select: { nombre: true } },
              precio: true,
            },
          },
        },
      },
    },
    // include: { DetallesVenta: { include: { producto: true } } },
  });

  if (!venta) {
    return res.status(400).json({
      message: "Se ha ingresado un id incorrecto",
    });
  }

  if (user.rol === ROL.ADMIN || venta.usuarioId === user.id) {
    return res.json({
      message: "La venta y sus detalles son:",
      content: venta,
    });
  } else {
    return res.status(400).json({
      message: "No puede acceder a una venta que no le pertenece",
    });
  }
};

// Eliminar venta
export const eliminarVentaWithId = async (req, res) => {
  const { id } = req.params;
  const user = req.usuario;

  // console.log(user);

  const foundVenta = await conexion.venta.findFirst({
    where: { id: id },
    select: { usuarioId: true, id: true },
  });

  const detallesAEliminar = await conexion.detallesVenta.findMany({
    where: { ventaId: foundVenta.id },
  });

  if (user.rol === ROL.ADMIN || foundVenta.usuarioId === user.id) {
    const deletedDetallesVentas = conexion.detallesVenta.deleteMany({
      where: { ventaId: foundVenta.id },
    });

    const deletedVenta = conexion.venta.delete({
      where: { id: foundVenta.id },
    });

    const transaction = await conexion.$transaction([
      deletedDetallesVentas,
      deletedVenta,
    ]);

    for (const detalle of detallesAEliminar) {
      await conexion.producto.update({
        where: { id: detalle.productoId },
        data: { stock: { increment: detalle.cantidad } },
      });
    }

    return res.json({
      message: "Venta elimada",
      content: transaction,
    });
  } else {
    return res.status(400).json({
      message: "No puede eliminar una venta que no le pertenece",
    });
  }
};

// Proceder compra (Update Metodo de pago)

// Cancelar compra (Borrar venta)

// Ver compras generales (solo admin)
