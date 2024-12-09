import { z } from "zod";

export const PaymentSchema = z.object({
    user_id: z.number().int().positive(),
    cart_items: z
        .array(
            z.object({
                producto_id: z.number().int().positive(),
                cantidad: z.number().int().positive(),
            })
        )
        .min(1, "El carrito no puede estar vacío."),
    payment_method: z.string().nonempty("El método de pago es obligatorio."),
    pixelpay_details: z.object({
        customer_name: z.string().nonempty("El nombre del cliente es obligatorio."),
        email: z.string().email("El correo electrónico no es válido."),
        phone: z.string().optional(),
        card_token: z.string().optional(),
    }),
});

export const GetPaymentHistorySchema = z.object({
    id: z
        .string()
        .regex(/^\d+$/, "El ID debe ser un número válido.")
        .transform(Number),
});