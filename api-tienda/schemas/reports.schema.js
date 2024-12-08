import { z } from 'zod';

// Validar las fechas recibidas en la consulta
const salesReportQuerySchema = z.object({
    start_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido. Debe ser YYYY-MM-DD."),
    end_date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido. Debe ser YYYY-MM-DD."),
});


// Validar los resultados devueltos por el reporte de ventas
const salesReportResultSchema = z.array(
    z.object({
        productName: z.string(),
        totalQuantitySold: z.number().int().nonnegative(),
        totalSales: z.number(),
    })
);

// Validar los resultados devueltos por el reporte de inventario
const inventoryReportResultSchema = z.array(
    z.object({
        productName: z.string(),
        currentStock: z.number().int().nonnegative(),
        stockStatus: z.enum(['Stock Bajo', 'Suficiente']),
    })
);

export const validateSalesReportQuery = (query) => salesReportQuerySchema.safeParse(query);
export const validateSalesReportResult = (result) => salesReportResultSchema.safeParse(result);
export const validateInventoryReportResult = (result) => inventoryReportResultSchema.safeParse(result);
