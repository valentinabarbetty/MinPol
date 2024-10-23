const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:4200', // Restringe a este origen
    optionsSuccessStatus: 200 // Para navegadores antiguos
};

module.exports = cors(corsOptions);
