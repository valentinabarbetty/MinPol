FROM node:22

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    wget \
    build-essential \
    coinor-cbc

# Descargar e instalar MiniZinc IDE
RUN wget https://github.com/MiniZinc/MiniZincIDE/archive/refs/tags/2.8.7.tar.gz \
    && tar -xvzf 2.8.7.tar.gz \
    && mv MiniZincIDE-2.8.7 /opt/minizinc \
    && ls -R /opt/minizinc/  # Lista de forma recursiva el contenido del directorio

# Verifica si minizinc está presente y en qué ubicación
RUN find /opt/minizinc/ -name "minizinc"

# Configuración de tu aplicación
WORKDIR /app
COPY . /app

# Instala las dependencias de Node.js
RUN npm install

EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
