# Despliegue · Ferretería Los Maestros

Levanta el sistema completo con Docker Compose: MySQL, los 3 microservicios y nginx.

```
Navegador ──> nginx :80 ──┬── /                                     → front (build de Vite)
                          ├── /api/v1/auth, /api/v1/usuarios        → ms-usuarios :8081
                          ├── /api/v1/productos, /api/v1/categorias → ms-catalogo :8082
                          └── /api/v1/boletas                       → ms-ventas   :8083
ms-ventas ──(red interna, X-API-KEY)──> ms-catalogo /api/v1/interno
Cada servicio ──> MySQL (su schema: db_usuarios, db_catalogo, db_ventas)
```

| Archivo | Qué hace |
|---|---|
| `docker-compose.yml` | Define los 5 contenedores, sus variables y el volumen de MySQL |
| `mysql/init.sql` | Crea los 3 schemas y da permisos al usuario `ferreteria` solo sobre ellos (se ejecuta una vez) |
| `nginx/Dockerfile` | Compila el front con Node y lo copia a una imagen de nginx |
| `nginx/default.conf` | Sirve el front y reenvía cada `/api/v1/...` a su microservicio |
| `.env.example` | Nombres de las variables. El `.env` real no se sube al repo |

## Decisiones

- **Un solo origen**: front y API salen de nginx en el puerto 80, por eso no hay CORS.
- **MySQL sin puerto publicado**: solo lo alcanzan los servicios dentro de la red de Docker.
- **`/api/v1/interno` no se publica**: nginx responde 404. Solo ms-ventas llega a esa ruta, por la red interna y con `X-API-KEY`.
- **Los puertos 8081 a 8083 se publican** solo para mostrar el Swagger de cada servicio.
- **nginx busca cada servicio en cada petición** (`resolver` de Docker): arranca aunque un servicio no exista todavía, y ese servicio responde 502 hasta que esté.

## En el EC2

### 1. Instancia

- Ubuntu 24.04. **`t3.medium`** (4 GB). Con `t3.small` (2 GB) agregar 2 GB de swap: los 3 servicios Java y MySQL usan cerca de 2 GB. `t2.micro` y `t3.micro` no alcanzan.
- Security Group: 80 (sitio) y 8081 a 8083 (Swagger) desde cualquier lugar; 22 solo desde tu IP. **Nunca 3306.**
- Si la cuenta lo permite, asociar una Elastic IP: en AWS Academy la IP pública cambia cada vez que se reinicia la instancia.

### 2. Docker y swap

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER      # cerrar la sesión SSH y volver a entrar

# Solo si la instancia tiene 2 GB
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 3. Repos, uno al lado del otro

```bash
mkdir ~/ferreteria && cd ~/ferreteria
git clone https://github.com/bcarrascom/ferreteria-los-maestros.git
git clone https://github.com/<usuario>/ferreteria-ms-usuarios.git
git clone https://github.com/bcarrascom/ferreteria-ms-catalogo.git
git clone https://github.com/<usuario>/ferreteria-ms-ventas.git
```

### 4. Variables

```bash
cd ferreteria-los-maestros/despliegue
cp .env.example .env
nano .env
```

Completar `MYSQL_ROOT_PASSWORD`, `DB_PASSWORD`, `JWT_SECRET` e `INTERNAL_API_KEY`. `JWT_SECRET` e `INTERNAL_API_KEY` son los valores reales que compartió el equipo; se generan con `openssl rand -base64 32`.

### 5. Levantar

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f ms-catalogo      # Ctrl+C para salir de los logs
```

Si un servicio todavía no está listo, se levantan solo los que existen. Por ejemplo, sin ms-ventas:

```bash
docker compose up -d --build mysql ms-usuarios ms-catalogo nginx
```

### 6. Probar

| URL | Debe responder |
|---|---|
| `http://<ip>/` | La tienda |
| `http://<ip>/api/v1/productos` | Los 85 productos en JSON |
| `http://<ip>:8081/swagger-ui.html` | Swagger de ms-usuarios |
| `http://<ip>:8082/swagger-ui.html` | Swagger de ms-catalogo |
| `http://<ip>:8083/swagger-ui.html` | Swagger de ms-ventas |
| `http://<ip>/api/v1/interno/stock/descuento` | 404 (no se publica) |

Después, los flujos de CLAUDE.md §12.2: login con los 3 roles, compra de invitado y de cliente, stock que baja y anulación de una orden.

### Actualizar después de un cambio

```bash
cd ~/ferreteria/ferreteria-ms-catalogo && git pull      # o el repo que cambió
cd ~/ferreteria/ferreteria-los-maestros/despliegue
docker compose up -d --build
```

Los datos de MySQL quedan en el volumen `mysql-datos`. `docker compose down` los conserva; **`docker compose down -v` los borra** y al volver a levantar se cargan de nuevo los datos iniciales.

## En local (para probar antes de subir)

Igual que en el EC2, desde esta carpeta, con Docker Desktop abierto. Si tu carpeta de un servicio no se llama como en el contrato, se indica en el `.env`, por ejemplo `CATALOGO_DIR=../..`. Si el puerto 80 está ocupado, cambiar `"80:80"` por `"8080:80"` y entrar a `http://localhost:8080`.
