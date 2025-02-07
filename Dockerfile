# Usar la imagen oficial de Node.js como base
FROM node:18.16.0
 
# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el package.json y package-lock.json (o yarn.lock) al contenedor
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar todo el contenido del proyecto al contenedor
COPY . .

# Construir el proyecto para producción
RUN npm run build

# Exponer el puerto en el que Vite se ejecuta
EXPOSE 3000

# Ejecutar la aplicación en el contenedor
CMD ["npm", "run", "dev"]
