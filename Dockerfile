# 1️⃣ Usa una imagen base Alpine para construir
FROM node:18.16.0-alpine AS builder

# 2️⃣ Establecer directorio de trabajo
WORKDIR /app

# 3️⃣ Copiar package.json y lock
COPY package*.json ./

# 4️⃣ Instalar dependencias (usa opcionalmente --legacy-peer-deps si hay conflictos)
RUN npm install

# 5️⃣ Copiar el resto del código
COPY . .

# 6️⃣ Construir la app
RUN npm run build

# 7️⃣ Segunda etapa: una imagen Alpine limpia y liviana para producción
FROM node:18.16.0-alpine

# 8️⃣ Establecer directorio de trabajo
WORKDIR /app

# 9️⃣ Instalar `serve` de forma global
RUN npm install -g serve

# 🔟 Copiar archivos construidos desde el builder
COPY --from=builder /app/dist /app/dist

# 1️⃣1️⃣ Exponer puerto
EXPOSE 3000

# 1️⃣2️⃣ Comando para ejecutar
CMD ["serve", "-s", "dist", "-l", "3000"]
