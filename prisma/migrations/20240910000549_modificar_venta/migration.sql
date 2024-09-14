-- DropForeignKey
ALTER TABLE "ventas" DROP CONSTRAINT "ventas_usuario_id_fkey";

-- AlterTable
ALTER TABLE "ventas" ALTER COLUMN "usuario_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
