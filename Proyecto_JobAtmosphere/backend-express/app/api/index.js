const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");

// Crear app de express
const app = express();
dotenv.config();

// Habilita CORS para todas las rutas
var corsOptions = {
   origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// Parse peticiones de tipo application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// Parse peticiones de tipo application/json
app.use(bodyParser.json())

// Configuracion de la base de datos
const dbConfig = require('../config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Conectar a la base de datos
mongoose.connect(dbConfig.url, {
   useNewUrlParser: true
}).then(() => {
   // console.log("Successfully connected to the database");
}).catch(err => {
   // console.log('Could not connect to the database. Exiting now...', err);
   process.exit();
});

// #region Ruta de prueba
app.get('/', (req, res) => {
   //Navegador ---> http://localhost:3000 para ver el mensaje
   res.send('Hola Mundo');
});

// Importar rutas
require('../routes/category.routes.js')(app);
require('../routes/job.routes.js')(app);
require('../routes/carousel.routes.js')(app);
require('../routes/user.routes.js')(app);
require('../routes/comment.routes.js')(app);

// Encender el servidor
app.listen(process.env.PORT, () => {
   console.log(`El Servidor Express en el puerto ${process.env.PORT}`);
});