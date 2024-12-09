# API Tienda

Este proyecto es una API RESTful básica para la gestión de productos y un carrito de compras, construida con Node.js y Express desplegada en Render para la API y Railway para la Base de Datos.

## Requisitos

- Node.js v18 o superior
- npm v6 o superior

## Instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/ccbaide86/Disenio-Digital-Proyecto
    ```

2. Accede al directorio del proyecto:

    ```bash
    cd api-tienda
    ```

3. Instala las dependencias necesarias:

    ```bash
    npm install express
    npm install zod
    npm install mysql
    npm install dotenv
    npm install bcrypt
    npm install jsonwebtoken
    npm install axios
    ```

## Dependencias

El proyecto utiliza las siguientes dependencias:

- **express**: Framework de Node.js para construir APIs y manejar rutas.
- **zod**: Librería de validación de esquemas para asegurar la estructura y los tipos de datos.
- **mysql**: Librería para interactuar con bases de datos MySQL.
- **dotenv**: Para gestionar variables de entorno.
- **bcrypt**: Librería para encriptar contraseñas.
- **jsonwebtoken**: Para generar y verificar tokens JWT, ideal para la autenticación.
- **axios**: Cliente HTTP para realizar peticiones a APIs externas.

## Ejecución

Para iniciar la API en modo de desarrollo:

```bash
npm start
```
## Uso del Proyecto en Render

La API está desplegada en la plataforma Render y se puede acceder a través de la siguiente URL:

- **URL Base**: [https://disenio-digital-proyecto.onrender.com/]

-**Ejemplo de Uso**:
1. POST /auth/register: Registro de nuevos usuarios.
https://disenio-digital-proyecto.onrender.com/auth/register

Request Body: "application/json"
```json
	{
		"nombre": "Admin de Prueba",
		"correo": "admin.prueba@example.com",
		"contrasena": "hashed_password1",
		"rol": "administrador"
	}
```

2. POST /auth/login: Inicio de sesión
https://disenio-digital-proyecto.onrender.com/auth/login

Request Body: "application/json"
```json
    {
        "nombre": "Admin de Prueba",
        "contrasena": "hashed_password1"
    }
```

3. GET /reports/sales: Generar un reporte de ventas por rango de fechas (recibe start_date y end_date).
https://disenio-digital-proyecto.onrender.com/reports/sales?start_date=2024-01-01&end_date=2024-12-31

Headers:
- **header**: authorization (Debe estar autorizado)
- **value**: token  (El Token de un Usuario de administrador)

4. GET /reports/inventory: Reporte de inventario actual (productos disponibles y stock bajo).
https://disenio-digital-proyecto.onrender.com/reports/inventory

Headers:
- **header**: authorization (Debe estar autorizado)
- **value**: token  (El Token de un Usuario de administrador)

5. POST /payments/checkout: Procesar un pago (recibe user_id, cart_items y payment_method, ademas de los campos solicitados por PixelPay).
https://disenio-digital-proyecto.onrender.com/payments/checkout

Headers:
- **header**: authorization (Debe estar autorizado)
- **value**: token  (El Token de un Usuario de cliente)

Request Body: "application/json"
```json
{
        "user_id": 1,
        "cart_items": [
                        {"producto_id": 1, "cantidad":2},
                        {"producto_id": 2, "cantidad":3}
                ],
        "payment_method": "tarjeta",
        "pixelpay_details": {
            "customer_name": "Juan Perez",
            "email": "juanp10@example.com",
            "phone": "95682814",
            "card_token": "eyndvkljdfkl5s1d6v16d1v5d1vkdnjfhjdhj"
        }
}
```

6. GET /payments/history/:userId: Obtener historial de pagos de un usuario.
https://disenio-digital-proyecto.onrender.com/payments/history/1

Headers:
- **header**: authorization (Debe estar autorizado)
- **value**: token  (El Token de un Usuario de cliente)

7. POST /inventory/restock: Agrega stock a un producto (recibe product_id y cantidad).
https://disenio-digital-proyecto.onrender.com/inventory/restock

Headers:
- **header**: authorization (Debe estar autorizado)
- **value**: token  (El Token de un Usuario de administrador)

Request Body: "application/json"
```json
    {
        "product_id": 1,
        "cantidad": 9
    }
```

8.  GET /inventory/:id: Consultar el stock de un producto específico.
https://disenio-digital-proyecto.onrender.com/inventory/1

Headers:
- **header**: authorization (Debe estar autorizado)
- **value**: token  (El Token de un Usuario de administrador)
