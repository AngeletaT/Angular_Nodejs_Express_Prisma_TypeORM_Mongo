# Usa la imagen base de Node.js
FROM node:20

# Crea los directorios y asigna el propietario
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Copia solo package.json y tsconfig.json y cambia el propietario
COPY package.json tsconfig.json ./
RUN chown -R node:node /home/node/app

# Cambia al usuario "node" para mayor seguridad
USER node

# Ejecuta npm install solo si no existen node_modules o requieren actualización
RUN npm install

# Copia el resto de los archivos de la aplicación y asigna el propietario
COPY --chown=node:node . .

# Genera los metadatos necesarios para TypeORM (como los decoradores)
RUN npx tsc

# Expone el puerto en el que el servidor escuchará
EXPOSE 3002

# Comando para iniciar la aplicación usando wait-for-it.sh
CMD ["npx", "ts-node-dev", "src/index.ts"]
