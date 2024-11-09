const cors = require('cors');

const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200', // Permite un origen dinámico
    optionsSuccessStatus: 200
  };
  
module.exports = cors(corsOptions);
