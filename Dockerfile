# 1️⃣ Usa la imagen oficial de Node.js como base para construir
FROM node:18.16.0 AS builder

# 2️⃣ Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# 3️⃣ Copiar los archivos necesarios para instalar dependencias
COPY package*.json ./

# 4️⃣ Instalar las dependencias
RUN npm install

# 5️⃣ Copiar todo el código fuente
COPY . .

# 6️⃣ Construir la aplicación para producción
RUN npm run build

# 7️⃣ Usa una imagen base más ligera para servir la app
FROM node:18.16.0

# 8️⃣ Establecer el directorio de trabajo en el nuevo contenedor
WORKDIR /app

# 9️⃣ Instalar un servidor ligero para servir la app
RUN npm install -g serve

# 🔟 Copiar los archivos construidos desde el contenedor anterior
COPY --from=builder /app/dist /app/dist

# 1️⃣1️⃣ Exponer el puerto que usará el servidor (3000)
EXPOSE 3000

# 1️⃣2️⃣ Servir la app en modo producción
CMD ["serve", "-s", "dist", "-l", "3000"]
