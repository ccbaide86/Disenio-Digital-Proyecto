import { z } from 'zod';

const restockSchema = z.object({
    product_id: z.number({
        invalid_type_error: "El ID del producto debe ser un número",
    }).positive({
        message: "El ID del producto debe ser un número positivo",
    }),
    cantidad: z.number({
        invalid_type_error: "La cantidad debe ser un número",
    }).int({
        message: "La cantidad debe ser un número entero",
    }).positive({
        message: "La cantidad debe ser mayor a 0",
    }),
}).strict({
    message: "No se permiten campos adicionales",
});

// Función para validar los datos
export const validateRestockData = (data) => restockSchema.safeParse(data);
