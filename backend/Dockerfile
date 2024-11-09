# Usar una imagen base de Ubuntu
FROM ubuntu:20.04

# Evitar interactividad durante las instalaciones
ENV DEBIAN_FRONTEND=noninteractive

# Actualizar los repositorios e instalar las dependencias necesarias
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    gnupg2 \
    lsb-release \
    coinor-cbc \
    && apt-get clean

# Descargar MiniZinc solo si no está disponible
RUN wget https://github.com/MiniZinc/MiniZincIDE/releases/download/2.8.7/MiniZincIDE-2.8.7-bundle-linux-x86_64.tgz -O /tmp/MiniZincIDE-2.8.7-bundle-linux-x86_64.tgz \
    && tar -xvzf /tmp/MiniZincIDE-2.8.7-bundle-linux-x86_64.tgz -C /usr/local/ \
    && rm /tmp/MiniZincIDE-2.8.7-bundle-linux-x86_64.tgz

# Añadir MiniZinc IDE y MiniZinc ejecutable al PATH para que estén disponibles en cualquier momento
ENV PATH="/usr/local/MiniZincIDE-2.8.7-bundle-linux-x86_64/bin:$PATH"

# Verificar la versión de MiniZinc instalada
RUN minizinc --version

# Verificar si el solver CBC está en la ruta correcta
RUN which cbc && cbc --version

# Instalar Node.js desde el repositorio oficial de NodeSource (versión 20.x)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && apt-get clean

# Verificar las versiones de Node.js y npm
RUN node -v && npm -v

# Crear un directorio para los solvers de MiniZinc
RUN mkdir -p /usr/share/minizinc/solvers

# Crear un enlace simbólico en caso de que cbc esté en /usr/bin
RUN ln -s /usr/bin/cbc /usr/local/bin/cbc

# Crear un usuario para la aplicación (por razones de seguridad)
RUN useradd -m appuser
USER appuser

# Establecer el directorio de trabajo y copiar los archivos de la aplicación
WORKDIR /usr/src/app
COPY --chown=appuser:appuser . .

# Instalar las dependencias de la aplicación
RUN npm install

# Exponer el puerto en el que corre tu servidor
EXPOSE 10000   

# Comando para arrancar la aplicación
CMD ["npm", "start"]
