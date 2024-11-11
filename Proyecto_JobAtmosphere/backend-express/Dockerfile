# Usa la imagen base de Node.js
FROM node:20

# Crea el directorio de trabajo y asigna permisos
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Copia solo los archivos de dependencias y cambia el propietario
COPY ./package*.json ./
RUN chown -R node:node /home/node/app

# Cambia al usuario "node" para mayor seguridad
USER node

# Instala las dependencias y usa la caché de Docker si package.json no ha cambiado
RUN npm install 

# Copia el resto de los archivos del backend
COPY --chown=node:node . .

# Expone el puerto en el que el servidor escuchará
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "app/api/index.js"]
