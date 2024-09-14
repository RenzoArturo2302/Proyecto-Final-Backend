import {
  RegistrarSucursalSerializer,
  SucursalSerializer,
} from "../serializers/sucursal.serializador.js";
import { conexion } from "../client.js";

// agregar sucursal
export const registrarSucursal = async (req, res) => {
  const { error, value } = RegistrarSucursalSerializer.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Error al registrar la sucursal",
      content: error.details,
    });
  }

  const sucursalCreada = await conexion.sucursal.create({
    data: {
      ...value,
    },
  });

  return res.status(201).json({
    message: "Usuario creado exitosamente",
    content: sucursalCreada,
  });
};

// Ver sucursales
export const sucursalList = async (req, res) => {
  const resultado = await conexion.sucursal.findMany({
    select: {
      nombre: true,
      direccion: true,
      telefono: true,
      tipoSucursal: true,
    },
  });

  return res.status(201).json({
    message: "Sucursales: ",
    content: resultado,
  });
};

// Ver sucursal por nombre
export const sucursalWithName = async (req, res) => {
  const { nombre } = req.params;

  const sucursal = await conexion.sucursal.findFirst({
    where: {
      nombre: nombre,
    },
  });

  if (!sucursal) {
    return res.status(400).json({
      message: "Se ha ingresado el nombre incorrecto",
    });
  }

  return res.json({
    message: "La sucursal es",
    content: sucursal,
  });
};

// editar sucursal por nombre
export const updateSucursalWithName = async (req, res) => {
  const { nombre } = req.params;

  const { error, value } = SucursalSerializer.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Error al actualizar la sucursal",
      content: error.details,
    });
  }

  const foundSucursal = await conexion.sucursal.findFirst({
    where: { nombre: nombre },
    select: { id: true },
  });

  if (!foundSucursal) {
    return res.status(400).json({
      message: "Se ha ingresado un nombre incorrecto",
    });
  }

  const updatedSucursal = await conexion.sucursal.update({
    where: { id: foundSucursal.id },
    data: {
      ...value,
    },
  });

  return res.json({
    message: "Los datos de la sucursal han sido actualizados",
    content: updatedSucursal,
  });
};

// eliminar sucursal por nombre
export const deleteSucursalWithId = async (req, res) => {
  const { id } = req.params;

  const deleteSucursal = await conexion.sucursal.delete({
    where: { id: id },
  });

  return res.json({
    message: "Sucursal eliminada",
    content: deleteSucursal,
  });
};
