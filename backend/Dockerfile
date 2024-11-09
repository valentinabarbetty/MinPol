# Usar una imagen base de Ubuntu
FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# Actualizar los repositorios e instalar las dependencias necesarias
RUN apt-get update && apt-get install -y \
    wget \
    nano \
    tar \
    build-essential \
    curl \
    gnupg2 \
    lsb-release \
    coinor-cbc \
    && apt-get clean

# Descargar MiniZinc 2.8.7 desde GitHub
RUN wget https://github.com/MiniZinc/MiniZincIDE/releases/download/2.8.7/MiniZincIDE-2.8.7-bundle-linux-x86_64.tgz -O /tmp/MiniZincIDE-2.8.7-bundle-linux-x86_64.tgz

# Descomprimir el archivo descargado
RUN tar -xvzf /tmp/MiniZincIDE-2.8.7-bundle-linux-x86_64.tgz -C /usr/local/

# Añadir MiniZinc IDE y MiniZinc ejecutable al PATH para que estén disponibles en cualquier momento
ENV PATH="/usr/local/MiniZincIDE-2.8.7-bundle-linux-x86_64/bin:$PATH"

# Verificar la versión de MiniZinc instalada
RUN minizinc --version

# Instalar Node.js desde el repositorio oficial de NodeSource (versión 20.x)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Verificar las versiones de Node.js y npm
RUN node -v && npm -v

# Crear un directorio para los solvers de MiniZinc
RUN mkdir -p /usr/share/minizinc/solvers

# Crear un enlace simbólico en caso de que cbc esté en /usr/bin
RUN ln -s /usr/bin/cbc /usr/local/bin/cbc

# Definir el directorio de trabajo y copiar los archivos de la aplicación
WORKDIR /usr/src/app
COPY . .

# Instalar las dependencias de la aplicación
RUN npm install

# Exponer el puerto en el que corre tu servidor
EXPOSE 3000

# Comando para arrancar la aplicación
CMD ["npm", "start"]
