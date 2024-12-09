
create database tienda
use tienda
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for carrito
-- ----------------------------
DROP TABLE IF EXISTS `carrito`;
CREATE TABLE `carrito` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `detalle_id` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL DEFAULT '1',
  `fecha_agregado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `producto_id` (`producto_id`),
  KEY `detalle_id` (`detalle_id`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `carrito_ibfk_3` FOREIGN KEY (`detalle_id`) REFERENCES `detalles_producto` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of carrito
-- ----------------------------
BEGIN;
INSERT INTO `carrito` (`id`, `usuario_id`, `producto_id`, `detalle_id`, `cantidad`, `fecha_agregado`) VALUES (1, 1, 1, 1, 2, '2024-11-09 11:27:27');
INSERT INTO `carrito` (`id`, `usuario_id`, `producto_id`, `detalle_id`, `cantidad`, `fecha_agregado`) VALUES (2, 1, 3, NULL, 1, '2024-11-09 11:27:27');
INSERT INTO `carrito` (`id`, `usuario_id`, `producto_id`, `detalle_id`, `cantidad`, `fecha_agregado`) VALUES (3, 2, 4, NULL, 3, '2024-11-09 11:27:27');
COMMIT;

-- ----------------------------
-- Table structure for detalle_orden
-- ----------------------------
DROP TABLE IF EXISTS `detalle_orden`;
CREATE TABLE `detalle_orden` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orden_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orden_id` (`orden_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `detalle_orden_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalle_orden_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of detalle_orden
-- ----------------------------
BEGIN;
INSERT INTO `detalle_orden` (`id`, `orden_id`, `producto_id`, `cantidad`, `precio`) VALUES (1, 1, 1, 2, 12.99);
INSERT INTO `detalle_orden` (`id`, `orden_id`, `producto_id`, `cantidad`, `precio`) VALUES (2, 1, 3, 1, 65.00);
INSERT INTO `detalle_orden` (`id`, `orden_id`, `producto_id`, `cantidad`, `precio`) VALUES (3, 2, 4, 3, 10.99);
COMMIT;

-- ----------------------------
-- Table structure for detalles_producto
-- ----------------------------
DROP TABLE IF EXISTS `detalles_producto`;
CREATE TABLE `detalles_producto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `talla` varchar(10) DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `dimensiones` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `detalles_producto_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of detalles_producto
-- ----------------------------
BEGIN;
INSERT INTO `detalles_producto` (`id`, `producto_id`, `color`, `talla`, `peso`, `dimensiones`) VALUES (1, 1, 'Blanco', 'M', NULL, NULL);
INSERT INTO `detalles_producto` (`id`, `producto_id`, `color`, `talla`, `peso`, `dimensiones`) VALUES (2, 1, 'Negro', 'L', NULL, NULL);
INSERT INTO `detalles_producto` (`id`, `producto_id`, `color`, `talla`, `peso`, `dimensiones`) VALUES (3, 2, 'Azul', '32', NULL, NULL);
INSERT INTO `detalles_producto` (`id`, `producto_id`, `color`, `talla`, `peso`, `dimensiones`) VALUES (4, 3, 'Negro', '42', 0.80, '30x20x10 cm');
INSERT INTO `detalles_producto` (`id`, `producto_id`, `color`, `talla`, `peso`, `dimensiones`) VALUES (5, 4, 'Rojo', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for ordenes
-- ----------------------------
DROP TABLE IF EXISTS `ordenes`;
CREATE TABLE `ordenes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('pendiente','pagado','cancelado') DEFAULT 'pendiente',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ordenes
-- ----------------------------
BEGIN;
INSERT INTO `ordenes` (`id`, `usuario_id`, `total`, `fecha_creacion`, `estado`) VALUES (1, 1, 78.98, '2024-11-09 11:27:27', 'pagado');
INSERT INTO `ordenes` (`id`, `usuario_id`, `total`, `fecha_creacion`, `estado`) VALUES (2, 2, 32.97, '2024-11-09 11:27:27', 'pendiente');
COMMIT;

-- ----------------------------
-- Table structure for productos
-- ----------------------------
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT '0',
  `categoria` varchar(50) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of productos
-- ----------------------------
BEGIN;
INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `categoria`, `fecha_creacion`) VALUES (1, 'Camiseta Básica', 'Camiseta de algodón 100% en varios colores', 12.99, 100, 'Ropa', '2024-11-09 11:27:27');
INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `categoria`, `fecha_creacion`) VALUES (2, 'Pantalón Jeans', 'Pantalón de mezclilla, corte recto', 34.50, 50, 'Ropa', '2024-11-09 11:27:27');
INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `categoria`, `fecha_creacion`) VALUES (3, 'Zapatos Deportivos', 'Zapatos cómodos para correr', 65.00, 30, 'Calzado', '2024-11-09 11:27:27');
INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `categoria`, `fecha_creacion`) VALUES (4, 'Gorra', 'Gorra unisex ajustable', 10.99, 200, 'Accesorios', '2024-11-09 11:27:27');
COMMIT;

-- ----------------------------
-- Table structure for usuarios
-- ----------------------------
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of usuarios
-- ----------------------------
BEGIN;
INSERT INTO `usuarios` (`id`, `nombre`, `correo`, `contrasena`, `fecha_registro`) VALUES (1, 'Juan Pérez', 'juan.perez@example.com', 'hashed_password1', '2024-11-09 11:27:27');
INSERT INTO `usuarios` (`id`, `nombre`, `correo`, `contrasena`, `fecha_registro`) VALUES (2, 'Ana García', 'ana.garcia@example.com', 'hashed_password2', '2024-11-09 11:27:27');
INSERT INTO `usuarios` (`id`, `nombre`, `correo`, `contrasena`, `fecha_registro`) VALUES (3, 'Luis López', 'luis.lopez@example.com', 'hashed_password3', '2024-11-09 11:27:27');
COMMIT;



SET FOREIGN_KEY_CHECKS = 1;
 select * from carrito
 

ALTER TABLE `usuarios`
ADD COLUMN `rol` ENUM('cliente', 'administrador') NOT NULL DEFAULT 'cliente';


UPDATE `usuarios` 
SET `rol` = 'cliente' 
WHERE `id` IN (1, 3);

UPDATE `usuarios` 
SET `rol` = 'administrador' 
WHERE `id` = 2; 
DESCRIBE `usuarios`;
SELECT * FROM `usuarios`;

ALTER TABLE `ordenes`
ADD COLUMN `metodo_pago` ENUM('tarjeta', 'paypal', 'transferencia', 'efectivo', 'otro') NOT NULL DEFAULT 'otro';

UPDATE `ordenes`
SET `metodo_pago` = 'tarjeta'
WHERE `id` = 1;

UPDATE `ordenes`
SET `metodo_pago` = 'paypal'
WHERE `id` = 2;








