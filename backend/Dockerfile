# Usar una imagen base de Ubuntu
FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# Actualizar los repositorios e instalar las dependencias necesarias
RUN apt-get update && apt-get install -y \
    wget \
    tar \
    build-essential \
    minizinc \
    curl \
    gnupg2 \
    lsb-release \
    coinor-cbc \
    && apt-get clean

ENV PATH="/usr/local/MiniZincIDE-2.8.7-bundle-linux-x86_64/bin:$PATH"

# Instalar Node.js desde el repositorio oficial de NodeSource (versión 16.x)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean  # Limpiar caché de apt después de instalar Node.js

# Verificar las versiones de Node.js y npm
RUN node -v && npm -v

RUN ln -s /usr/bin/cbc /usr/local/bin/cbc


# Copiar tu aplicación o archivos necesarios al contenedor
WORKDIR /usr/src/app
COPY . .

# Instalar las dependencias de la aplicación
RUN npm install

# Exponer el puerto en el que corre tu servidor (en este caso el 3000)
EXPOSE 3000

# Comando para arrancar tu aplicación
CMD ["npm", "start"]