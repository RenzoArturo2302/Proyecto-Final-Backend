/*
  Warnings:

  - A unique constraint covering the columns `[venta_id,producto_id]` on the table `detallesVenta` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "detallesVenta_venta_id_producto_id_key" ON "detallesVenta"("venta_id", "producto_id");
