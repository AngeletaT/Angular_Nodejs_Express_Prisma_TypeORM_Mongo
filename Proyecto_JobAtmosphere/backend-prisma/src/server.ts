import app from './app';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.listen(port, function () {
    console.log("funcionando por el puerto: " + port);
});

// Pendiente de la señal del sistema operativo
process.on("SIGTERM", function () {
    console.log(`SIGTERM signal received: closing HTTP server.`);
    process.exit();
});

// Pendiente de la terminal para interrumpir la ejecución del servidor
process.on("SIGINT", function () {
    console.log(`SIGINT signal received: closing HTTP server.`);
    process.exit();
});