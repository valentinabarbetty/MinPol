# Usa una imagen base de Node.js
FROM node:22

# Instalar MiniZinc
RUN apt-get update && apt-get install -y minizinc

# Crea el directorio de la aplicación y configura el entorno
WORKDIR /app
COPY . /app

# Instala las dependencias
RUN npm install

# Expone el puerto en el que la app va a correr
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
