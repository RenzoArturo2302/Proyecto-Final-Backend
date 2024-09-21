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
  updateVenta,
  ventasList,
  ventasListUser,
  ventasListWithId,
} from "./controllers/venta.controller.js";
import {
  agregarProductoDetalleVenta,
  deleteDetalleVentaWithId,
} from "./controllers/detallesVenta.controller.js";
import { generarUrlFirmada } from "./controllers/imagen.controller.js";

export const rutas = Router();

// registrarse
/**
 *@swagger
 *components:
 *  schemas:
 *    DetalleVenta:
 *       type: object
 *       properties:
 *            cantidad:
 *                type: number
 *                description: cantidad del producto comprado
 *            ventaId:
 *                type: string
 *                description: relación con la venta.
 *            productoId:
 *                type: string
 *                description: relación con el producto.
 *       required:
 *            - cantidad
 *            - ventaId
 *            - productoId
 *    Venta:
 *       type: object
 *       properties:
 *            metodoPago:
 *                type: string
 *                enum: [NO_PAGADO, EFECTIVO, VISA, YAPE]
 *                descripcion: método de pago usado para cancelar el monto de la venta
 *    Producto:
 *       type: object
 *       properties:
 *            stock:
 *                type: number
 *                description: stock del producto
 *            precio:
 *                type: number
 *                format: float
 *                description: precio por unidad de producto
 *            descripcion:
 *                type: string
 *                description: descripcion del producto
 *            imagenUrl:
 *                type: string
 *                descripcion: URL de la imagen relacionada al producto
 *            tipoProductoId:
 *                type: string
 *                description: Relación con el tipo de producto
 *            marcaId:
 *                type: string
 *                description: Relación con la marca
 *            sucursalId:
 *                type: string
 *                description: Relación con una sucursal
 *       required:
 *            - stock
 *            - precio
 *            - tipoProductoId
 *            - marcaId
 *            - sucursalId
 *    TipoProducto:
 *       type: object
 *       properties:
 *            nombre:
 *                type: string
 *                description: nombre del tipo de producto
 *       required:
 *            - nombre
 *    Marca:
 *       type: object
 *       properties:
 *            nombre:
 *                type: string
 *                description: nombre de la marca
 *       required:
 *            - nombre
 *    Sucursal:
 *       type: object
 *       properties:
 *            nombre:
 *                type: string
 *                description: nombres
 *            direccion:
 *                type: string
 *                descripcion: dirección de la sucursal
 *            telefono:
 *                type: string
 *                descripcion: telefono de contacto de la sucursal
 *            tipoSucursal:
 *                type: string
 *                enum: [ARTICULOS_PARA_EL_HOGAR, MOTOS_Y_REPUESTOS]
 *                descripcion: tipo de sucursal
 *       required:
 *            - nombre
 *            - tipoSucursal
 *    Usuario:
 *       type: object
 *       properties:
 *            nombre:
 *                type: string
 *                description: nombres
 *            apellido:
 *                type: string
 *                descripcion: apellidos
 *            email:
 *                type: string
 *                format: email
 *                descripcion: e-mail del usuario
 *            password:
 *                type: string
 *                descripcion: La contraseña debe contener un dígito del 1 al 9. Una letra minúscula, una letra mayúscula. Un carácter especial. Ningún espacio. Debe tener entre 8 y 16 caracteres.
 *            rol:
 *                type: string
 *                enum: [CLIENTE, ADMIN]
 *                descripcion: rol del usuario
 *       required:
 *            - email
 *            - password
 * */

/**
 * @swagger
 * /registro:
 *    post:
 *      summary: Crear o registrar un nuevo usuario.
 *      tags: [Usuario]
 *      requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                 schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Usuario'
 *      responses:
 *        201:
 *           description: Nuevo usuario registrado!.
 *        400:
 *           description: Error al registrar el usuario.
 */
rutas.route("/registro").post(asyncHandler(registroUser));

/**
 * @swagger
 * /login:
 *    post:
 *      summary: Logearte o generar bearer token.
 *      tags: [Usuario]
 *      requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                 schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                             type: string
 *                          password:
 *                             type: string
 *      responses:
 *        200:
 *          description: Usuario logeado!.
 *        400:
 *          description: Error al intenar logearse.
 */
rutas.route("/login").post(asyncHandler(loginUser));

/**
 * @swagger
 * /perfil:
 *    get:
 *      summary: Obtener perfil del usuario logeado.
 *      tags: [Usuario]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Se obtevo el perfil del usuario.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *        400:
 *          description: Error al intenar conseguir el perfil del usuario.
 */
rutas
  .route("/perfil")
  .get(asyncHandler(validarToken), asyncHandler(perfilUser));

/**
 * @swagger
 * /user:
 *    get:
 *      summary: Obtenener la información de todos los usuarios. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Usuario]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Los usuarios son
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *        400:
 *          description: Error al intenar obtener los usuario.
 *    put:
 *      summary: Modificar información del usuario logeado.
 *      tags: [Usuario]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *
 *      responses:
 *        200:
 *            description: Usuario modificado
 *        400:
 *            description: Error al modificar el usuario
 *
 */
rutas
  .route("/user")
  .get(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(userClientList)
  )
  .put(asyncHandler(validarToken), asyncHandler(updateUser));

/**
 * @swagger
 * /user/{email}:
 *    get:
 *      summary: Obtenener la información de un usuario a través de su correo. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Usuario]
 *      parameters:
 *        - in: path
 *          name: email
 *          schema:
 *             type: string
 *          required: true
 *          description: email del usuario
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: La información del usuario es
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        400:
 *          description: Error al intenar obtener los datos del usuario.
 *
 *    put:
 *      summary: Modificar información de un usuario identificado por su correo. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Usuario]
 *      parameters:
 *        - in: path
 *          name: email
 *          schema:
 *             type: string
 *          required: true
 *          description: email del usuario
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *
 *      responses:
 *        200:
 *            description: Usuario modificado
 *        400:
 *            description: Error al modificar el usuario
 */
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
/**
 * @swagger
 * /sucursal:
 *    post:
 *      summary: Crear o registrar una nueva sucursal. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Sucursal]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                 schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Sucursal'
 *      responses:
 *        201:
 *           description: Nueva sucursal registrada!.
 *        400:
 *           description: Error al registrar la sucursal.
 *    get:
 *      summary: Obtenener la información de todos las sucursales.
 *      tags: [Sucursal]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Las sucursales son
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *        400:
 *          description: Error al intenar obtener la información de las sucursales.
 */
rutas
  .route("/sucursal")
  .post(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(registrarSucursal)
  )
  .get(asyncHandler(validarToken), asyncHandler(sucursalList));

/**
 * @swagger
 * /sucursal/{nombre}:
 *    get:
 *      summary: Obtenener la información de una sucursal a través de su nombre. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Sucursal]
 *      parameters:
 *        - in: path
 *          name: nombre
 *          schema:
 *             type: string
 *          required: true
 *          description: nombre de la sucursal
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: La información de la sucursal es
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        400:
 *          description: Error al intenar obtener los datos de la sucursal.
 *
 *    put:
 *      summary: Modificar información de una sucursal identificada por su nombre. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Sucursal]
 *      parameters:
 *        - in: path
 *          name: nombre
 *          schema:
 *             type: string
 *          required: true
 *          description: nombre de la sucursal
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *
 *      responses:
 *        200:
 *            description: Sucursal modificada
 *        400:
 *            description: Error al modificar la sucursal
 */
rutas
  .route("/sucursal/:nombre")
  .get(asyncHandler(validarToken), asyncHandler(sucursalWithName))
  .put(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(updateSucursalWithName)
  );

/**
 * @swagger
 * /sucursal/{id}:
 *    delete:
 *      summary: Eliminar una sucursal a través de su id. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Sucursal]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: id de la sucursal
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Sucursal eliminada
 *        400:
 *          description: Error al intenar eliminar la sucursal.
 */
rutas
  .route("/sucursal/:id")
  .delete(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(deleteSucursalWithId)
  );

/**
 * @swagger
 * /marca:
 *    post:
 *      summary: Crear o registrar una nueva marca. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Marca]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                 schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Marca'
 *      responses:
 *        201:
 *           description: Nueva marca registrada!.
 *        400:
 *           description: Error al registrar la marca.
 *    get:
 *      summary: Obtenener la información de todos las marcas. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Marca]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Las marcas son
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *        400:
 *          description: Error al intenar obtener la información de las marcas.
 */
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

/**
 * @swagger
 * /marca/{nombre}:
 *    get:
 *      summary: Obtenener la información de una marca a través de su nombre. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Marca]
 *      parameters:
 *        - in: path
 *          name: nombre
 *          schema:
 *             type: string
 *          required: true
 *          description: nombre de la marca
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: La información de la marca es
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        400:
 *          description: Error al intenar obtener los datos de la marca.
 */
rutas
  .route("/marca/:nombre")
  .get(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(marcaWithName)
  );

/**
 * @swagger
 * /marca/{id}:
 *    delete:
 *      summary: Eliminar una marca a través de su id. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Marca]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: id de la marca
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: marca eliminada
 *        400:
 *          description: Error al intenar eliminar la marca.
 */
rutas
  .route("/marca/:id")
  .delete(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(deleteMarcaWithId)
  );

/**
 * @swagger
 * /tipoProducto:
 *    post:
 *      summary: Crear o registrar un nuevo tipo de producto. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [TipoProducto]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                 schema:
 *                      type: object
 *                      $ref: '#/components/schemas/TipoProducto'
 *      responses:
 *        201:
 *           description: Nuevo tipo de producto registrado!.
 *        400:
 *           description: Error al registrar el tipo de producto.
 *    get:
 *      summary: Obtenener la información de todos los tipos de productos. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [TipoProducto]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Los tipos de productos son
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *        400:
 *          description: Error al intenar obtener la información de los tipos de productos.
 */
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

/**
 * @swagger
 * /tipoProducto/{nombre}:
 *    get:
 *      summary: Obtenener la información de un tipo de producto a través de su nombre. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [TipoProducto]
 *      parameters:
 *        - in: path
 *          name: nombre
 *          schema:
 *             type: string
 *          required: true
 *          description: nombre del tipo de producto
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: La información del tipo de producto es
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        400:
 *          description: Error al intenar obtener los datos del tipo de producto.
 */
rutas
  .route("/tipoProducto/:nombre")
  .get(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(tipoProductoWithName)
  );

/**
 * @swagger
 * /tipoProducto/{id}:
 *    delete:
 *      summary: Eliminar una tipo de producto a través de su id. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [TipoProducto]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: id del tipo de producto
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: tipo de producto eliminada
 *        400:
 *          description: Error al intenar eliminar el tipo de producto.
 */
rutas
  .route("/tipoProducto/:id")
  .delete(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(deletetipoProductoWithId)
  );

/**
 * @swagger
 * /producto:
 *    post:
 *      summary: Crear o registrar un nuevo producto. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Producto]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                 schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Producto'
 *      responses:
 *        201:
 *           description: Nuevo producto registrado!.
 *        400:
 *           description: Error al registrar el producto.
 *    get:
 *      summary: Obtenener la información de todos los productos.
 *      tags: [Producto]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Los productos son
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *        400:
 *          description: Error al intenar obtener la información de los productos.
 */
rutas
  .route("/producto")
  .post(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(agregarProducto)
  )
  .get(asyncHandler(validarToken), asyncHandler(productList));

/**
 * @swagger
 * /producto/{id}:
 *    get:
 *      summary: Obtenener la información de un producto a través de su id. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Producto]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: id de un producto
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: La información del producto es
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        400:
 *          description: Error al intenar obtener los datos del producto.
 *    put:
 *      summary: Modificar la información de un producto identificada por su id. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Producto]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: id del producto
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      responses:
 *        200:
 *            description: Producto modificado
 *        400:
 *            description: Error al modificar el producto
 *    delete:
 *      summary: Eliminar un producto a través de su id. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Producto]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: id del producto
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: producto eliminado
 *        400:
 *          description: Error al intenar eliminar el producto.
 */
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

/**
 * @swagger
 * /venta:
 *    post:
 *      summary: Crear o registrar una nueva venta relacionada al usuario logeada.
 *      tags: [Venta]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: false
 *        content:
 *            application/json:
 *                 schema:
 *                      type: object
 *      responses:
 *        201:
 *           description: Nueva venta registrado!.
 *        400:
 *           description: Error al registrar la venta.
 *    get:
 *      summary: Obtenener la información de todas las ventas del usuario logeado.
 *      tags: [Venta]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Los ventas del usuario son
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *        400:
 *          description: Error al intenar obtener la información de las ventas.
 */
rutas
  .route("/venta")
  .post(asyncHandler(validarToken), asyncHandler(generarVenta))
  .get(asyncHandler(validarToken), asyncHandler(ventasListUser));

/**
 * @swagger
 * /venta/{id}:
 *    get:
 *      summary: Obtenener la información de una venta relacionada al usuario logeada a través de su id.
 *      tags: [Venta]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: id de una venta
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: La información de la venta es
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        400:
 *          description: Error al intenar obtener los datos de la venta.
 *    put:
 *      summary: Modificar la información de una venta relacionada al usuario logeada identificada por su id.
 *      tags: [Venta]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: id de la venta
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      responses:
 *        200:
 *            description: venta modificada
 *        400:
 *            description: Error al modificar la venta
 *    delete:
 *      summary: Eliminar una venta relacionada al usuario logeada a través de su id.
 *      tags: [Venta]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: id de la venta
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: venta eliminada
 *        400:
 *          description: Error al intenar eliminar la venta.
 */
rutas
  .route("/venta/:id")
  .delete(asyncHandler(validarToken), asyncHandler(eliminarVentaWithId))
  .get(asyncHandler(validarToken), asyncHandler(ventasListWithId))
  .put(asyncHandler(validarToken), asyncHandler(updateVenta));

/**
 * @swagger
 * /ventas:
 *    get:
 *      summary: Obtenener la información de todas las ventas de todos los usuarios. EXCLUSIVO DE ADMINISTRADORES
 *      tags: [Venta]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Los ventas son
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *        400:
 *          description: Error al intenar obtener la información de las ventas.
 */
rutas
  .route("/ventas")
  .get(
    asyncHandler(validarToken),
    asyncHandler(validarAdmin),
    asyncHandler(ventasList)
  );

/**
 * @swagger
 * /detalleVenta:
 *    post:
 *      summary: Crear o registrar uno nuevo detalle de venta relacionada a una venta del usuario logeada.
 *      tags: [DetalleVenta]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                 schema:
 *                      type: object
 *                      $ref: '#/components/schemas/DetalleVenta'
 *      responses:
 *        201:
 *           description: Nuevo detalle de venta registrado!.
 *        400:
 *           description: Error al registrar el detalle de venta.
 */
rutas
  .route("/detalleVenta")
  .post(asyncHandler(validarToken), asyncHandler(agregarProductoDetalleVenta));
// .get(asyncHandler(detalleVentaList))
// .delete(asyncHandler(borrarLista));

/**
 * @swagger
 * /detalleVenta/{id}:
 *    delete:
 *      summary: Eliminar, a través del id, un detalle de venta relacionada a una venta de un usuario logeado.
 *      tags: [DetalleVenta]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: id del detalle de venta
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: detalle de venta eliminado
 *        400:
 *          description: Error al intenar eliminar el detalle de venta.
 */
rutas
  .route("/detalleVenta/:id")
  .delete(asyncHandler(validarToken), asyncHandler(deleteDetalleVentaWithId));

/**
 * @swagger
 * /generar-url:
 *    post:
 *      summary: Crear o registrar una nueva venta relacionada al usuario logeada.
 *      tags: [Venta]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: false
 *        content:
 *            application/json:
 *                 schema:
 *                      type: object
 *      responses:
 *        201:
 *           description: Nueva venta registrado!.
 *        400:
 *           description: Error al registrar la venta.
 */
rutas.route("/generar-url").post(asyncHandler(generarUrlFirmada));
