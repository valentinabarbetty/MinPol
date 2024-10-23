const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa cors
const minizincRoutes = require('./routes/minizinc'); // Importa las rutas de MiniZinc
const app = express();
const port = 3000;
const corsMiddleware = require('./middlewares/cors');
app.use(corsMiddleware);

// Habilita CORS para permitir solicitudes desde el frontend
app.use(cors()); // Esto permite solicitudes desde cualquier origen.
app.use(bodyParser.json());

// Usar las rutas de MiniZinc
app.use('/api', minizincRoutes);

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
