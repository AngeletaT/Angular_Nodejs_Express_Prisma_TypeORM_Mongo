import "reflect-metadata";
import express from 'express';
import { createConnection } from 'typeorm';
import { User } from './user/user.entity';  // Asegúrate de que este modelo esté bien definido
import userRoutes from './user/user.routes';  // Importa las rutas de usuario

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware para el parsing de JSON
app.use(express.json());

// Conexión a la base de datos con TypeORM
createConnection({
    type: "mongodb",
    url: "mongodb://localhost:27017/InfoJobs",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [User],  // Aquí cargamos nuestras entidades de TypeORM
    synchronize: true,  // Solo en desarrollo, sincroniza automáticamente los cambios de las entidades en la base de datos
}).then(() => {
    console.log("Connected to MongoDB with TypeORM");

    // Iniciar servidor
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(error => console.log(error));

// Agregar las rutas de usuario
app.use('/users', userRoutes);  // Aquí asignamos las rutas

app.use('/recruiter', userRoutes);