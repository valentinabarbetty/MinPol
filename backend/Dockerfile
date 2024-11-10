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
    && apt-get clean

# Descargar e instalar MiniZinc 2.8.7 desde el archivo .tgz
#RUN wget https://github.com/MiniZinc/MiniZincIDE/releases/download/2.8.7/MiniZincIDE-2.8.7-bundle-linux-x86_64.tgz && \
#    tar -xvzf MiniZincIDE-2.8.7-bundle-linux-x86_64.tgz && \
#    rm MiniZincIDE-2.8.7-bundle-linux-x86_64.tgz && \
#    mv MiniZincIDE-2.8.7-bundle-linux-x86_64 /usr/local/

# Establecer las rutas de MiniZinc y su solver CoinBC en el PATH global
ENV PATH="/usr/local/MiniZincIDE-2.8.7-bundle-linux-x86_64/bin:/usr/local/bin:$PATH"

#RUN chmod -R 777 /usr/local/MiniZincIDE-2.8.7-bundle-linux-x86_64/share/minizinc/solvers

# Verificar las versiones de CBC, MiniZinc y CoinBC
RUN which cbc && cbc --version && \
    minizinc --version && \
    minizinc --solver cbc --version && \
    minizinc --solvers 
#    ls -la /usr/local/MiniZincIDE-2.8.7-bundle-linux-x86_64/share/minizinc/solvers

# Instalar Node.js desde el repositorio oficial de NodeSource (versión 20.x)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && apt-get autoremove -y

# Verificar las versiones de Node.js y npm
RUN node -v && npm -v

# Crear el directorio para los solvers de MiniZinc
RUN mkdir -p /usr/share/minizinc/solvers

# Definir el directorio de trabajo y copiar los archivos de la aplicación
WORKDIR /usr/src/app
COPY . .

# Instalar las dependencias de la aplicación
RUN npm install

# Exponer el puerto en el que corre tu servidor
EXPOSE 3000

# Comando para arrancar la aplicación
CMD ["npm", "start"]
