# Usa una imagen base de Node.js
FROM node:22

# Instalar MiniZinc y el solver CoinBC
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:mhier/libboost-dev && \
    apt-get update && \
    apt-get install -y minizinc

# Ajustar el PATH si es necesario
ENV PATH="/usr/local/bin/coinbc:${PATH}"

# Crea el directorio de la aplicación y configura el entorno
WORKDIR /app
COPY . /app

# Instala las dependencias de Node.js
RUN npm install

# Expone el puerto en el que la app va a correr
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
