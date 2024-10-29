import { createConnection } from 'typeorm';
import { User } from './recruiter/recruiter.entity';
import userRoutes from './recruiter/recruiter.routes';
import "reflect-metadata";
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3002;
const url_mongo = process.env.MONGODB_URL || 'mongodb://localhost:27017/InfoJobs';
const allowedOrigins = ['http://localhost:4200'];

const options: cors.CorsOptions = {
    origin: allowedOrigins
};

// Configurar CORS
app.use(cors(options));

// Middleware para el parsing de JSON
app.use(express.json());

// Conexión a la base de datos con TypeORM
createConnection({
    type: "mongodb",
    url: url_mongo,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [User],
    synchronize: true,
}).then(() => {
    console.log("Connected to MongoDB with TypeORM");

    // Iniciar servidor
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(error => console.log(error));

// Agregar las rutas de usuario
app.use('/users', userRoutes);

app.use('/', userRoutes);