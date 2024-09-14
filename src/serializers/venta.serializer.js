import { METODO_PAGO } from "@prisma/client";
import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

export const RegistrarVentaSerializer = Joi.object({
  // fechaVenta: Joi.date().format("YYYY-MM-DD").optional(),
  metodoPago: Joi.optional().allow(
    METODO_PAGO.EFECTIVO,
    METODO_PAGO.NO_PAGADO,
    METODO_PAGO.VISA,
    METODO_PAGO.YAPE
  ),
});
