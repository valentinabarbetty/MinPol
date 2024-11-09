FROM node:22

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y minizinc \
    wget \
    build-essential \
    coinor-cbc \
    curl \
    unzip && \
    rm -rf /var/lib/apt/lists/*

# Verifica si minizinc se instaló correctamente en el sistema
RUN echo "Verificando si minizinc está instalado:" && which minizinc

# Descargar e instalar MiniZinc IDE
RUN wget https://github.com/MiniZinc/MiniZincIDE/archive/refs/tags/2.8.7.tar.gz \
    && tar -xvzf 2.8.7.tar.gz \
    && mv MiniZincIDE-2.8.7 /opt/minizinc \
    # Verifica el contenido del directorio para asegurar que MiniZinc se haya descargado correctamente
    && echo "Contenido del directorio /opt/minizinc después de la extracción:" \
    && ls -R /opt/minizinc/ \
    && echo "MiniZinc IDE descargado e instalado en /opt/minizinc"

# Verifica la estructura de directorios y si el binario minizinc está dentro de /opt/minizinc
RUN echo "Verificando la estructura completa de /opt/minizinc..." \
    && find /opt/minizinc/ -name "minizinc" \
    && echo "Estructura de directorios de MiniZinc completada"

# Asegúrate de que minizinc esté accesible desde cualquier lugar
RUN echo "Creando enlace simbólico para minizinc..." \
    && ln -s /opt/minizinc/bin/minizinc /usr/local/bin/minizinc \
    && echo "Enlace simbólico creado, verificando minizinc --version..." \
    && minizinc --version

# Buscar y eliminar cualquier archivo llamado count.mzn si existe
RUN echo "Buscando y eliminando archivos count.mzn si existen..." \
    && find / -name "count.mzn" -exec rm {} \; \
    && echo "Búsqueda y eliminación de count.mzn completada."

# Configuración de tu aplicación
WORKDIR /app
COPY . /app

# Instala las dependencias de Node.js
RUN npm install

EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
