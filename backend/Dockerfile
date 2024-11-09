FROM node:22

# Instalar MiniZinc y los solvers adicionales
RUN apt-get update && apt-get install -y \
    minizinc minizinc-compiler \
    coinor-cbc

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
