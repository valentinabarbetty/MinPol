const express = require('express');
const { exec } = require('child_process');
const fs = require('fs'); 
const path = require('path');
const router = express.Router();

// Endpoint para ejecutar MiniZinc
router.post('/suma', (req, res) => {
    // Recibir los valores desde el frontend
    const { x, y } = req.body;

    // Crear un archivo de datos temporal
    const dataContent = `x = ${x};\ny = ${y};`;
    fs.writeFileSync('data.dzn', dataContent); // Escribir el archivo de datos

    // Obtener la ruta correcta del archivo minpol.mzn
    const minpolPath = path.join(__dirname, '..', 'minizinc', 'minpol.mzn');

    // Crear un comando para ejecutar MiniZinc, asegurando que las rutas estén entre comillas
    const command = `minizinc --solver Gecode "${minpolPath}" data.dzn`;

    // Ejecutar el comando en el sistema
    exec(command, (error, stdout, stderr) => {
        // Eliminar el archivo de datos después de su uso
        fs.unlinkSync('data.dzn');

        if (error) {
            console.error(`Error al ejecutar MiniZinc: ${error.message}`);
            return res.status(500).send('Error al ejecutar MiniZinc');
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Error en la ejecución de MiniZinc');
        }

        console.log(`stdout: ${stdout}`);

        // Limpiar la salida para que solo devuelva el resultado
        const resultadoLimpiado = stdout.split('\n')[0].trim(); // Obtener solo la primera línea y eliminar espacios
        res.send({ resultado: resultadoLimpiado }); // Enviar solo el resultado limpio
    });
});

module.exports = router;
