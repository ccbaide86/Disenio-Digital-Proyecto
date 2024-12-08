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

- **URL**: [https://disenio-digital-proyecto.onrender.com/]

-**Ejemplo de Uso**:
1. Inicio de sesión
https://disenio-digital-proyecto.onrender.com/auth/login

```json
{
    "nombre": "Admin de Prueba",
    "contrasena": "hashed_password1"
}
```

2. Consultar el stock de un producto específico (Las rutas de inventario, estarán disponibles solo para usuarios administradores)

https://disenio-digital-proyecto.onrender.com/inventory/1

```json
{
    "product_id": 1,
    "cantidad": 9
}
```