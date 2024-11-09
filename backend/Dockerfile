FROM node:22

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    wget \
    build-essential \
    coinor-cbc \
    # Instalar dependencias adicionales para MiniZinc si son necesarias
    curl \
    unzip

# Descargar e instalar MiniZinc IDE
RUN wget https://github.com/MiniZinc/MiniZincIDE/archive/refs/tags/2.8.7.tar.gz \
    && tar -xvzf 2.8.7.tar.gz \
    && mv MiniZincIDE-2.8.7 /opt/minizinc \
    # Verifica el contenido del directorio para asegurar que MiniZinc se haya descargado correctamente
    && ls -R /opt/minizinc/

# Asegúrate de que minizinc esté accesible desde cualquier lugar (por ejemplo, añadiendo a PATH)
RUN ln -s /opt/minizinc/bin/minizinc /usr/local/bin/minizinc \
    # Verifica si el binario de minizinc está correctamente enlazado
    && minizinc --version

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
