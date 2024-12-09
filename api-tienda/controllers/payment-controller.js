import connection from "../config/db.js";
import { PaymentSchema, GetPaymentHistorySchema } from "../schemas/payments.schema.js";
import { z } from "zod";
import axios from "axios";

export class PaymentController {
    static async processPayment(req, res) {
        try {
            const data = PaymentSchema.parse(req.body);

            const { user_id, cart_items, payment_method, pixelpay_details } = data;

            // Validar el total del carrito y verificar que el usuario exista
            const cartQuery = `
        SELECT c.producto_id, c.cantidad, p.precio, p.stock
        FROM carrito c
        JOIN productos p ON c.producto_id = p.id
        WHERE c.usuario_id = ?;
    `;
            const [cartResults] = await connection
                .promise()
                .query(cartQuery, [user_id]);

            if (cartResults.length === 0) {
                return res.status(400).json({
                    error: true,
                    message: "El carrito está vacío o no se encontró el usuario.",
                });
            }

            let total = 0;
            const stockUpdates = [];
            for (const item of cartResults) {
                if (item.stock < item.cantidad) {
                    return res.status(400).json({
                        error: true,
                        message: `Stock insuficiente para el producto con ID ${item.producto_id}.`,
                    });
                }
                total += item.precio * item.cantidad;
                stockUpdates.push({
                    producto_id: item.producto_id,
                    cantidad: item.cantidad,
                });
            }

            // Procesar el pago con PixelPay
            const pixelPayResponse = await axios.post(
                "https://sandbox.pixelpay.app/api/v1/payment",
                {
                    amount: total.toFixed(2),
                    method: payment_method,
                    ...pixelpay_details,
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PIXELPAY_API_KEY}`,
                    },
                }
            );

            if (pixelPayResponse.data.status !== "success") {
                return res.status(400).json({
                    error: true,
                    message: `La transacción fue rechazada: ${pixelPayResponse.data.message || "Error desconocido"
                        }.`,
                });
            }

            const transactionId = pixelPayResponse.data.transaction_id;

            // Registrar la orden en la base de datos
            const createOrderQuery = `
        INSERT INTO ordenes (usuario_id, total, estado, transaction_id) 
        VALUES (?, ?, 'pagado', ?);
    `;
            const [orderResult] = await connection
                .promise()
                .query(createOrderQuery, [user_id, total, transactionId]);

            const orderId = orderResult.insertId;

            const orderDetailsQuery = `
        INSERT INTO detalle_orden (orden_id, producto_id, cantidad, precio)
        VALUES (?, ?, ?, ?);
    `;
            for (const item of cartResults) {
                await connection
                    .promise()
                    .query(orderDetailsQuery, [
                        orderId,
                        item.producto_id,
                        item.cantidad,
                        item.precio,
                    ]);
            }

            // Actualizar inventario y limpiar el carrito
            const updateStockQuery = `
        UPDATE productos SET stock = stock - ? WHERE id = ?;
    `;
            for (const update of stockUpdates) {
                await connection
                    .promise()
                    .query(updateStockQuery, [update.cantidad, update.producto_id]);
            }

            const clearCartQuery = `DELETE FROM carrito WHERE usuario_id = ?;`;
            await connection.promise().query(clearCartQuery, [user_id]);

            return res.status(200).json({
                message: "Pago procesado exitosamente.",
                orderId: orderId,
                total: total,
                transactionId: transactionId,
            });
        } catch (error) {
            console.error("Error procesando el pago:", error);

            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: true,
                    message: "Datos de entrada inválidos.",
                    details: error.errors,
                });
            }

            if (error.response && error.response.data) {
                return res.status(400).json({
                    error: true,
                    message: "Error al procesar el pago con PixelPay.",
                    details: error.response.data,
                });
            }

            return res.status(500).json({
                error: true,
                message: "Ocurrió un error interno al procesar el pago.",
                details: error.message,
            });
        }
    }

    static async getPaymentHistory(req, res) {
        if (!req.params || !req.params.id) {
            return res.status(400).json({
                error: true,
                message: "El parámetro `id` es obligatorio.",
            });
        }
        try {
            const { id: usuarioID } = GetPaymentHistorySchema.parse(req.params);
            const query = "SELECT * FROM ordenes WHERE usuario_id = ?";
            connection.query(query, [usuarioID], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrió un error al obtener el historial de pagos.",
                        details: error.message,
                    });
                }

                return res.status(200).json(results);
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: true,
                    message: "Parámetro inválido.",
                    details: error.errors,
                });
            }

            return res.status(500).json({
                error: true,
                message: "Ocurrió un error interno al obtener el historial de pagos.",
                details: error.message,
            });
        }
    }
}
