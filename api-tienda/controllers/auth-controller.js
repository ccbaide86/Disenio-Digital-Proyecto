import connection from "../config/db.js";
import { validateUserSchema } from "../schemas/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

export class AuthController {

    static register(req, res) {
        const consulta = 'INSERT INTO usuarios(nombre, correo, contrasena, rol) VALUES  (?, ?, ?, ?)' // consulta para insertar un nuevo usuario

        const data = req.body // obtenemos los datos del usuario
        const { success, error } = validateUserSchema(data) // validamos los datos del usuario

        if (!success) {
            return res.status(400).json({
                message: JSON.parse(error.message)
            })
        } // si los datos no son válidos, retornamos un error

        try {
            const { nombre, correo, contrasena, rol } = data // obtenemos los datos del usuario

            const passwordHash = bcrypt.hashSync(contrasena, 10) // encriptamos la contraseña del usuario

            const query = connection.query(consulta, [nombre, correo, passwordHash, rol], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrió un error al obtener los datos: " + error
                    })
                }
                return res
                    .header('Content-Type', 'application/json')
                    .status(201)
                    .json(data) // retornamos los datos del usuario
            })

        } catch (error) {
            res.status(400).json({
                error: true,
                message: "Ocurrió un error al registrar el usuario"
            })
        }
    }

    static login(req, res) {
        const { nombre, contrasena } = req.body;

        if (!nombre || !contrasena) {
            return res.status(400).json({
                error: true,
                message: "Por favor ingrese todos los campos"
            });
        } // si no se ingresaron los datos, retornamos un error

        const query = 'SELECT nombre, correo, contrasena, rol FROM usuarios WHERE nombre = ?'; // consulta para obtener un usuario por su nombre

        try {
            connection.query(query, [nombre], (error, results) => {

                // problemas con el servidor o la escturcutra de la consulta
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrio un error al obtener los usuarios",
                    })
                }

                // si el usuario ya existe
                if (results && results.length === 0) {
                    return res.status(400).json({
                        error: true,
                        message: "Usuario no encontrado"
                    });
                } // results es un array con los resultados de la consulta

                const { contrasena: passwordHash } = results[0]; // obtenemos la contraseña del usuario

                bcrypt.compare(contrasena, passwordHash, function (error, result) {
                    if (!result) {
                        return res.status(400).json({
                            error: true,
                            message: "Ocurrio un error al comparar las contraseñas",
                            /*comparacion: {
                                contrasenaIngresada: contrasena,
                                contrasenaHash: passwordHash
                            }*/
                        });
                    }  // result es un booleano que indica si las contraseñas coinciden

                    const data = results[0]; // obtenemos los datos del usuario

                    delete data.contrasena; // eliminamos la contraseña del usuario

                    const token = jwt.sign({ data }, process.env.SECRET_KEY, { expiresIn: '1h' }); // generamos el token
                    data.token = token; // agregamos el token a los datos del usuario

                    return res.status(200).json({
                        error: false,
                        message: "Usuario autenticado",
                        data: data
                    }); // retornamos los datos del usuario

                })

            })

        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Ocurrio un error al obtener los usuarios"
            });
        }
    }
}