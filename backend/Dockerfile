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
    && ls /opt/minizinc/bin/ \
    && ln -s /opt/minizinc/bin/minizinc /usr/local/bin/minizinc

# Verificar que el solver CoinBC (CBC) esté instalado
RUN which minizinc

# Configuración de tu aplicación
WORKDIR /app
COPY . /app

# Instala las dependencias de Node.js
RUN npm install

EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
