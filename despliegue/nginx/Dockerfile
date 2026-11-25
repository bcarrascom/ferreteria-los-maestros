# Etapa 1: compila el front con Node (el contexto es la raíz del repo del front)
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: nginx sirve el build y hace de proxy hacia los microservicios (sin Node ni código fuente)
FROM nginx:1.27-alpine
COPY despliegue/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
