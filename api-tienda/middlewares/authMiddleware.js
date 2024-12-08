import jwt from "jsonwebtoken";
import "dotenv/config";

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']; // obtenemos el token del header

    if (!token) {
        return res.status(401).json({
            error: true,
            message: "Debe iniciar secion"
        });
    } // si no hay token, retornamos un error

    const cleanToken = token.replace('Bearer ', ''); // limpiamos el token

    try {
        const decoded = jwt.verify(cleanToken, process.env.SECRET_KEY); // verificamos el token
        req.params.rol = decoded.role; // obtenemos el rol del usuario
        next(); // continuamos
    }
    catch (error) {
        return res.status(401).json({
            error: true,
            message: "Token inválido",
            /*details: {
                receivedToken: cleanToken,  // Incluye el token recibido
                errorMessage: error.message // Muestra el mensaje de error de la librería
            }*/
        }); // si el token es inválido, retornamos un error
    }

}

export default authMiddleware;