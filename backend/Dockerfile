FROM node:22

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y minizinc \
    wget \
    build-essential \
    coinor-cbc \
    curl \
    unzip

# Verifica si minizinc se instaló correctamente en el sistema
RUN echo "Verificando si minizinc está instalado:" && which minizinc

# Descargar e instalar MiniZinc IDE
RUN wget https://github.com/MiniZinc/MiniZincIDE/archive/refs/tags/2.8.7.tar.gz \
    && tar -xvzf 2.8.7.tar.gz \
    && mv MiniZincIDE-2.8.7 /opt/minizinc \
    # Verifica el contenido del directorio para asegurar que MiniZinc se haya descargado correctamente
    && ls -R /opt/minizinc/ \
    && echo "MiniZinc IDE descargado e instalado en /opt/minizinc"

# Verifica si el binario de minizinc está en la ubicación esperada
RUN echo "Verificando archivos en /opt/minizinc/..." && ls /opt/minizinc/ \
    && echo "Comprobando la ubicación de minizinc..."

# Verifica si el binario de minizinc se encuentra en /opt/minizinc/bin/
RUN echo "Verificando si el binario minizinc existe en /opt/minizinc/bin/..." \
    && ls /opt/minizinc/bin/ \
    && echo "Archivos en /opt/minizinc/bin/ listados"

# Asegúrate de que minizinc esté accesible desde cualquier lugar
RUN echo "Creando enlace simbólico para minizinc..." \
    && ln -s /opt/minizinc/bin/minizinc /usr/local/bin/minizinc \
    && echo "Enlace simbólico creado, verificando minizinc --version..." \
    && minizinc --version

# Verifica si minizinc está presente y en qué ubicación
RUN echo "Buscando el binario minizinc..." && find /opt/minizinc/ -name "minizinc" \
    && echo "Búsqueda de minizinc completada."

# Configuración de tu aplicación
WORKDIR /app
COPY . /app

# Instala las dependencias de Node.js
RUN npm install

EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
