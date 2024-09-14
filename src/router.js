import { Router } from "express";
import {
  loginUser,
  perfilUser,
  perfilUserWithEmail,
  registroUser,
  updateUser,
  updateUserWithEmail,
  userClientList,
} from "./controllers/usuario.controller.js";
import asyncHandler from "express-async-handler";
import { validarToken, validarAdmin, validarCliente } from "./utils.js";
import {
  deleteSucursalWithId,
  registrarSucursal,
  sucursalList,
  sucursalWithName,
  updateSucursalWithName,
} from "./controllers/sucursal.controller.js";
import {
  deleteMarcaWithId,
  marcaList,
  marcaWithName,
  registrarMarca,
} from "./controllers/marca.controller.js";
import {
  deletetipoProductoWithId,
  registrarTipoProducto,
  tipoProductoList,
  tipoProductoWithName,
} from "./controllers/tipoProducto.controller.js";
import {
  agregarProducto,
  deleteProductWithId,
  editProductWithId,
  productList,
  productWithId,
} from "./controllers/producto.controller.js";
import {
  eliminarVentaWithId,
  generarVenta,
  ventasList,
  ventasListUser,
  ventasListWithId,
} from "./controllers/venta.controller.js";
import {
  agregarProductoDetalleVenta,
  borrarLista,
  deleteDetalleVentaWithId,
  detalleVentaList,
} from "./controllers/detallesVenta.controller.js";
import {
  generarUrlFirmada,
  subirImagen,
} from "./controllers/imagen.controller.js";

export const rutas = Router();

rutas.route("/registro").post(asyncHandler(registroUser));

rutas.route("/login").post(asyncHandler(loginUser));

rutas
  .route("/perfil")
  .get(asyncHandler(validarToken), asyncHandler(perfilUser));

rutas
  .route("/user")
  .get(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(userClientList)
  )
  .put(asyncHandler(validarToken), asyncHandler(updateUser));

rutas
  .route("/user/:email")
  .get(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(perfilUserWithEmail)
  )
  .put(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(updateUserWithEmail)
  );

// Sucursal
rutas
  .route("/sucursal")
  .post(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(registrarSucursal)
  )
  .get(asyncHandler(validarToken), asyncHandler(sucursalList));

rutas
  .route("/sucursal/:nombre")
  .get(asyncHandler(validarToken), asyncHandler(sucursalWithName))
  .put(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(updateSucursalWithName)
  );

rutas
  .route("/sucursal/:id")
  .delete(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(deleteSucursalWithId)
  );

rutas
  .route("/marca")
  .post(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(registrarMarca)
  )
  .get(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(marcaList)
  );

rutas
  .route("/marca/:nombre")
  .get(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(marcaWithName)
  );

rutas
  .route("/marca/:id")
  .delete(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(deleteMarcaWithId)
  );

rutas
  .route("/tipoProducto")
  .post(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(registrarTipoProducto)
  )
  .get(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(tipoProductoList)
  );

rutas
  .route("/tipoProducto/:nombre")
  .get(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(tipoProductoWithName)
  );

rutas
  .route("/tipoProducto/:id")
  .delete(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(deletetipoProductoWithId)
  );

rutas
  .route("/producto")
  .post(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(agregarProducto)
  )
  .get(asyncHandler(validarToken), asyncHandler(productList));

rutas
  .route("/producto/:id")
  .put(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(editProductWithId)
  )
  .delete(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(deleteProductWithId)
  )
  .get(asyncHandler(validarToken), asyncHandler(productWithId));

rutas
  .route("/venta")
  .post(asyncHandler(validarToken), asyncHandler(generarVenta))
  .get(asyncHandler(validarToken), asyncHandler(ventasListUser));

rutas
  .route("/venta/:id")
  .delete(asyncHandler(validarToken), asyncHandler(eliminarVentaWithId))
  .get(asyncHandler(validarToken), asyncHandler(ventasListWithId));

rutas
  .route("/ventas")
  .get(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(ventasList)
  );

rutas
  .route("/detalleVenta")
  .post(asyncHandler(validarToken), asyncHandler(agregarProductoDetalleVenta));
// .get(asyncHandler(detalleVentaList))
// .delete(asyncHandler(borrarLista));

rutas
  .route("/detalleVenta/:id")
  .delete(asyncHandler(validarToken), asyncHandler(deleteDetalleVentaWithId));

rutas.route("/generar-url").post(asyncHandler(generarUrlFirmada));
