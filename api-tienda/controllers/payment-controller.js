import connection from "../config/db.js";

import axios from 'axios'; // Para las solicitudes a PixelPay

export class PaymentController {
    static async processPayment(req, res) {
        const { user_id, cart_items, payment_method, pixelpay_details } = req.body;

        if (!user_id || !cart_items || cart_items.length === 0) {
            return res.status(400).json({
                error: true,
                message: "El carrito está vacío o faltan datos necesarios."
            });
        }

        try {
            // 1. Validar el total del carrito y verificar que el usuario exista
            const cartQuery = `
                SELECT c.producto_id, c.cantidad, p.precio, p.stock
                FROM carrito c
                JOIN productos p ON c.producto_id = p.id
                WHERE c.usuario_id = ?;
            `;
            const [cartResults] = await connection.promise().query(cartQuery, [user_id]);

            if (cartResults.length === 0) {
                return res.status(400).json({
                    error: true,
                    message: "El carrito está vacío o no se encontró el usuario."
                });
            }

            let total = 0;
            const stockUpdates = [];
            for (const item of cartResults) {
                if (item.stock < item.cantidad) {
                    return res.status(400).json({
                        error: true,
                        message: `Stock insuficiente para el producto con ID ${item.producto_id}.`
                    });
                }
                total += item.precio * item.cantidad;
                stockUpdates.push({
                    producto_id: item.producto_id,
                    cantidad: item.cantidad
                });
            }

            // 2. Procesar el pago con PixelPay
            const pixelPayResponse = await axios.post(
                'https://sandbox.pixelpay.app/api/v1/payment', // URL de sandbox de PixelPay
                {
                    amount: total,
                    method: payment_method,
                    ...pixelpay_details
                },
                {
                    headers: {
                        Authorization: `Bearer YOUR_PIXELPAY_API_KEY`, // Cambia por tu clave
                    }
                }
            );

            if (pixelPayResponse.data.status !== "success") {
                return res.status(400).json({
                    error: true,
                    message: "La transacción fue rechazada por PixelPay."
                });
            }

            // 3. Registrar la orden en la tabla `ordenes`
            const createOrderQuery = `
                INSERT INTO ordenes (usuario_id, total, estado) VALUES (?, ?, 'pagado');
            `;
            const [orderResult] = await connection.promise().query(createOrderQuery, [user_id, total]);

            const orderId = orderResult.insertId;

            // 4. Registrar detalles de la orden en la tabla `detalle_orden`
            const orderDetailsQuery = `
                INSERT INTO detalle_orden (orden_id, producto_id, cantidad, precio)
                VALUES (?, ?, ?, ?);
            `;
            for (const item of cartResults) {
                await connection.promise().query(orderDetailsQuery, [
                    orderId,
                    item.producto_id,
                    item.cantidad,
                    item.precio
                ]);
            }

            // 5. Actualizar inventario en la tabla `productos`
            const updateStockQuery = `
                UPDATE productos SET stock = stock - ? WHERE id = ?;
            `;
            for (const update of stockUpdates) {
                await connection.promise().query(updateStockQuery, [update.cantidad, update.producto_id]);
            }

            // 6. Vaciar el carrito
            const clearCartQuery = `DELETE FROM carrito WHERE usuario_id = ?;`;
            await connection.promise().query(clearCartQuery, [user_id]);

            // 7. Devolver la respuesta exitosa
            return res.status(200).json({
                message: "Pago procesado exitosamente.",
                orderId: orderId,
                total: total
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: true,
                message: "Ocurrió un error al procesar el pago.",
                details: error.message
            });
        }
    }
    static getPaymentHistory(req, res) {
        // Implementa la logica para obtener el historial de pagos

        const usuarioID = req.params.id;

        const query = 'select *from pagos where usuario_id = ?';
        try {
            connection.query(query, [usuarioID], (error, results) => {
                if (error) {
                    return res.status(400).json({
                        error: true,
                        message: "Ocurrio un error al obtener el historial de pagos" + error,
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
                message: "Ocurrio un error al obtener el historial de pagos" + error
            });
        }
    }
}