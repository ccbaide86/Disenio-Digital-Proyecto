import { z } from 'zod';

const addToCartSchema = z.object({
    usuario_id: z.number({
        invalid_type_error: "El ID del usuario debe ser un número"
    }).positive({
        message: "El ID del usuario debe ser un número positivo"
    }),
    
    producto_id: z.number({
        invalid_type_error: "El ID del producto debe ser un número"
    }).positive({
        message: "El ID del producto debe ser un número positivo"
    }), 

    cantidad: z.number({
        invalid_type_error: "La cantidad debe ser un número"
    }).int({
        message: "La cantidad debe ser un número entero"
    }).positive({
        message: "La cantidad debe ser mayor a 0"
    }).max(100, {
        message: "La cantidad no puede exceder 100 unidades"
    }).optional(), 

    detalle_id: z.number({
        invalid_type_error: "El ID del detalle debe ser un número"
    }).positive({
        message: "El ID del detalle debe ser un número positivo"
    }).nullable().optional(), 
}).strict({
    message: "No incluya campos adicionales"});

export const ValidateAddToCart = (data) => addToCartSchema.safeParse(data);

const deleteFromCartSchema = z.object({
    "producto_id": z.number({
        invalid_type_error: "El ID del producto debe ser un número"
    }).positive({
        message: "El ID del producto debe ser un número positivo"
    }),
}).strict({
    message: "No incluya campos adicionales"
});

export const validateDeleteFromCartSchema = (data) => deleteFromCartSchema.safeParse(data);



