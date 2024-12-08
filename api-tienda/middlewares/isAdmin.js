const isAdmin = (req, res, next) => {
    try {

        if (req.params.rol !== 'administrador') {
            const rol = req.params.rol
            return res.status(403).json({
                message: `No tiene permisos para acceder a esta ruta, su rol es: ${rol}`,
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor',
        });
    }
};

export default isAdmin;