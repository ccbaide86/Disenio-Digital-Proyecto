import { z } from 'zod'

const userSchema = z.object(
    {
        "nombre": z.string({
            invalid_type_error: "El nombre debe ser un string"
        }).trim().min(3, {
            message: "El nombre debe tener al menos 3 caracteres"
        }),
        "correo": z.string().email({
            message: "El email no es válido"
        }),
        "contrasena": z.string().trim(),
        "rol": z.enum(['administrador', 'cliente'])

    },
).strict()

export const validateUserSchema = (user) => userSchema.safeParse(user)