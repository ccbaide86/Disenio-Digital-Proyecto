import { ValidateProductSchema } from '../schemas/products.schema.js';
import connection from '../config/db.js';

export class ProductController {
    static getAllProducts(req, res) {
        const consulta = 'SELECT id, nombre, descripcion, precio, stock, categoria, fecha_creacion FROM productos';

        try {
            connection.query(consulta, (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrio un error al obtener los productos" + error,
                    });
                }
                res
                    .header("Content-Type", "application/json")
                    .status(200)
                    .json(results);
            });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: "Ocurrio un error al obtener los productos" + error
            });
        }
    }

    static getProductById(req, res) {
        const id = req.params.id;
        const consulta = 'SELECT id, nombre, descripcion, precio, stock, categoria, fecha_creacion FROM productos WHERE id = ?';

        try {
            connection.query(consulta, [id], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrio un error al obtener el producto" + error,
                    });
                }
                res
                    .header("Content-Type", "application/json")
                    .status(200)
                    .json(results);
            });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: "Ocurrio un error al obtener el producto" + error
            });
        }
    }

    static createProduct(req, res) {
        const query = `INSERT INTO productos (nombre, descripcion, precio, stock, categoria) VALUES (?, ?, ?, ?, ?)`;
        const data = req.body;

        const { success, error } = ValidateProductSchema(data);
        if (!success) {
            return res.status(400).json({
                message: JSON.parse(error.message)
            });
        }

        try {

            const { nombre, descripcion, precio, stock, categoria } = data;

            connection.query(query, [nombre, descripcion || null, precio, stock, categoria || null], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrió un error al crear el producto: " + error,
                    });
                }
                res
                    .header("Content-Type", "application/json")
                    .status(201)
                    .json({
                        message: "Producto creado exitosamente",
                        productId: results.insertId // Devuelve el ID generado
                    });
            }
            );
        } catch (error) {
            res.status(500).json({
                error: true,
                message: "Ocurrio un error inesperado: " + error.message
            });
        }
    }


    static updateProduct(req, res) {
        const query = `UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ? WHERE id = ?`;
        const data = req.body;
        const { id } = req.params;

        const { success, error } = ValidateProductSchema(data);
        if (!success) {
            return res.status(400).json({
                message: JSON.parse(error.message)
            });
        }

        try {

            const { nombre, descripcion, precio, stock, categoria } = data;

            connection.query(query, [nombre, descripcion || null, precio, stock, categoria || null, id], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrió un error al actualizar el producto: " + error,
                    });
                }
                res
                    .header("Content-Type", "application/json")
                    .status(200)
                    .json({
                        message: "Producto actualizado exitosamente"
                    });
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: "Ocurrio un error inesperado: " + error.message
            });
        }
    }

    static deleteProduct(req, res) {
        const id = req.params.id;
        const query = 'DELETE FROM productos WHERE id = ?';

        try {
            connection.query(query, [id], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrio un error al eliminar el producto" + error,
                    });
                }
                res
                    .header("Content-Type", "application/json")
                    .status(200)
                    .json({ message: "Producto eliminado exitosamente" });
            });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: "Ocurrio un error al eliminar el producto" + error
            });
        }
    }

}
