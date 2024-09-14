/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `tipo_productos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tipo_productos_nombre_key" ON "tipo_productos"("nombre");
