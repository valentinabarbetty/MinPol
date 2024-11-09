FROM node:22

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    wget \
    build-essential \
    coinor-cbc

# Descargar e instalar MiniZinc desde el repositorio oficial
RUN wget https://github.com/MiniZinc/minizinc/releases/download/v2.7.3/minizinc-2.7.3-x86_64-linux.tar.gz \
    && tar -xvzf minizinc-2.7.3-x86_64-linux.tar.gz \
    && mv minizinc-2.7.3-x86_64-linux /opt/minizinc \
    && ln -s /opt/minizinc/bin/minizinc /usr/local/bin/minizinc

# Verificar que el solver CoinBC (CBC) esté instalado
RUN minizinc --solvers

# Configuración de tu aplicación
WORKDIR /app
COPY . /app

# Instala las dependencias de Node.js
RUN npm install

EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
