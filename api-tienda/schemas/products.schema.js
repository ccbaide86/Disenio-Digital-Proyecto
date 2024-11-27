import { z } from 'zod';

const productSchema = z.object({
    "nombre": z.string({
        invalid_type_error: "El nombre debe ser un string"
    }).trim().min(3, {
        message: "El nombre debe tener al menos 3 caracteres"
    }).max(100, {
        message: "El nombre debe tener menos de 100 caracteres"
    }), // varchar(100) NOT NULL
    "descripcion": z.string().trim().optional(), // text,
    "precio": z.number({
        invalid_type_error: "El precio debe ser un número"
    }).positive({
        message: "El precio debe ser un número positivo"
    }), // decimal(10,2) NOT NULL,
    "stock": z.number().int({
        message: "El stock debe ser un número entero"
    }).nonnegative({
        message: "El stock no puede ser negativo"
    }), // int(11) NOT NULL DEFAULT '0',
    "categoria": z.string().trim().max(50).nullable().optional()
});

export const ValidateProductSchema = (product) => {
    try {
        productSchema.parse(product);
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
};
