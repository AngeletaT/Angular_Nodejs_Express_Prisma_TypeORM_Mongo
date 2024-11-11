# Usa la imagen base de Node.js
FROM node:20

# Crea los directorios y asigna el propietario
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /home/node/app

# Copia solo package.json y package-lock.json y cambia el propietario
COPY package*.json ./
RUN chown -R node:node /home/node/app

# Cambia al usuario "node" para mayor seguridad
USER node

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación y asigna el propietario
COPY --chown=node:node . .

# Expone el puerto en el que Angular se servirá
EXPOSE 4200

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]

