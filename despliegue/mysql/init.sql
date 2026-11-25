-- Se ejecuta una sola vez, cuando el volumen de MySQL está vacío.
-- El usuario de la aplicación (DB_USER) lo crea la imagen de MySQL con MYSQL_USER y MYSQL_PASSWORD.
-- Aquí se crean los 3 schemas (uno por microservicio) y ese usuario recibe permisos solo sobre ellos.
-- Debe llamarse 'ferreteria', igual que DB_USER en el .env.

CREATE DATABASE IF NOT EXISTS db_usuarios CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS db_catalogo CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS db_ventas   CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

GRANT ALL PRIVILEGES ON db_usuarios.* TO 'ferreteria'@'%';
GRANT ALL PRIVILEGES ON db_catalogo.* TO 'ferreteria'@'%';
GRANT ALL PRIVILEGES ON db_ventas.*   TO 'ferreteria'@'%';
FLUSH PRIVILEGES;
