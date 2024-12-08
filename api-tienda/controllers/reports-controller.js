import {
    validateSalesReportQuery,
    validateSalesReportResult,
    validateInventoryReportResult
} from '../schemas/reports.schema.js';
import connection from '../config/db.js';

export class ReportsController {
    static getSalesReport(req, res) {
        const { start_date, end_date } = req.query;

        // Validar las fechas de entrada
        const { success, error } = validateSalesReportQuery({ start_date, end_date });
        if (!success) {
            return res.status(400).json({
                error: true,
                message: error.errors.map(err => err.message).join(", "),
            });
        }

        const salesQuery = `
            SELECT 
                p.nombre AS productName,
                CAST(SUM(d.cantidad) AS DECIMAL(10,2)) AS totalQuantitySold,
                CAST(SUM(d.cantidad * d.precio) AS DECIMAL(10,2)) AS totalSales
                FROM detalle_orden d
                INNER JOIN ordenes o ON d.orden_id = o.id
                INNER JOIN productos p ON d.producto_id = p.id
                WHERE o.fecha_creacion BETWEEN '2024-01-01' AND '2024-12-31'
                AND o.estado = 'pagado'
                GROUP BY p.nombre;

`;

        connection.query(salesQuery, [start_date, end_date], (error, results) => {
            if (error) {
                return res.status(500).json({
                    error: true,
                    message: `Error al generar el reporte de ventas: ${error.message}`
                });
            }

            const formattedResults = results.map(result => ({
                productName: result.productName,
                totalQuantitySold: parseInt(result.totalQuantitySold),
                totalSales: parseFloat(result.totalSales),
            }));

            // Validar los datos devueltos
            const { success: validResults, error: validationError } = validateSalesReportResult(formattedResults);
            if (!validResults) {
                return res.status(500).json({
                    error: true,
                    message: 'Error en los datos del reporte generados por la base de datos',
                    details: validationError.errors.map(err => err.message),
                });
            }

            res.status(200).json(formattedResults);
        });
    }

    static getInventoryReport(req, res) {
        const inventoryQuery = `
            SELECT 
                p.nombre AS productName,
                p.stock AS currentStock,
                CASE WHEN p.stock < 10 THEN 'Stock Bajo' ELSE 'Suficiente' END AS stockStatus
            FROM productos p
        `;

        connection.query(inventoryQuery, (error, results) => {
            if (error) {
                return res.status(500).json({
                    error: true,
                    message: `Error al generar el reporte del inventario: ${error.message}`
                });
            }

            // Validar los datos devueltos
            const { success: validResults, error: validationError } = validateInventoryReportResult(results);
            if (!validResults) {
                return res.status(500).json({
                    error: true,
                    message: 'Error en los datos del reporte generados por la base de datos',
                    details: validationError.errors.map(err => err.message),
                });
            }

            res.status(200).json(results);
        });
    }
}
