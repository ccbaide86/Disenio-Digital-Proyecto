import { validateRestockData } from '../schemas/inventory.schemas.js';
import connection from '../config/db.js';

export class inventoryController {
    static addNewStock(req, res) {
        const validation = validateRestockData(req.body);

        if (!validation.success) {
            return res.status(400).json({
                message: 'Datos inválidos',
                errors: validation.error.errors,
            });
        }

        const { product_id, cantidad } = req.body;

        const queryGetStock = 'SELECT stock FROM productos WHERE id = ?';

        try {
            connection.query(queryGetStock, [product_id], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrió un error al obtener los datos: " + error,
                    });
                }
    
                if (results.length === 0) {
                    return res.status(404).json({
                        message: "Producto no encontrado",
                    });
                }
    
                const { stock } = results[0];
                const newStock = stock + cantidad;
    
                const queryUpdate = 'UPDATE productos SET stock = ? WHERE id = ?';
    
                connection.query(queryUpdate, [newStock, product_id], (error, results) => {
                    if (error) {
                        return res.status(400).json({
                            error: true,
                            message: "Ocurrió un error al actualizar el stock: " + error,
                        });
                    }
    
                    return res
                        .header('Content-Type', 'application/json')
                        .status(200)
                        .json({
                            message: `Stock actualizado para el producto con ID ${product_id}`,
                        });
                });
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: "Ocurrió un error interno al procesar la solicitud: " + error.message,
            });
        }
    }

    static getStockById(req, res) {
        const product_id = req.params.id; 
        const query = 'SELECT stock FROM productos WHERE id = ?';

        try {
            connection.query(query, [product_id], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrió un error al obtener los datos: " + error,
                    });
                }
    
                if (results.length === 0) {
                    return res.status(404).json({
                        message: "Producto no encontrado",
                    });
                }
    
                return res
                    .header('Content-Type', 'application/json')
                    .status(200)
                    .json(results); 
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: "Ocurrió un error interno al procesar la solicitud: " + error.message,
            });
        }
    }
}
