// routes/minizinc.js
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs'); 
const path = require('path');
const router = express.Router();

router.post('/minPol', (req, res) => {
    const { numPersonas, numOpiniones, distribucionOpiniones, valoresOpiniones, costosExtras, costosDesplazamiento, costoTotalMax, maxMovimientos } = req.body;

    // Crear contenido para el archivo de datos MiniZinc
    const dataContent = `
        numPersonas = ${numPersonas};
        numOpiniones = ${numOpiniones};
        distribucionOpiniones = [${distribucionOpiniones.join(', ')}];
        valoresOpiniones = [${valoresOpiniones.join(', ')}];
        costosExtras = [${costosExtras.join(', ')}];
        costosDesplazamiento = array2d(1..${numOpiniones}, 1..${numOpiniones}, [${costosDesplazamiento.flat().join(', ')}]);
        costoTotalMax = ${costoTotalMax};
        maxMovimientos = ${maxMovimientos};
    `;

    // Escribir archivo data.dzn
    fs.writeFileSync('data.dzn', dataContent);

    // Ruta al archivo .mzn de MiniZinc
    const minpolPath = path.join(__dirname, '..', 'minizinc', 'minpol.mzn');
    const command = `minizinc --solver Gecode "${minpolPath}" data.dzn`;

    exec(command, (error, stdout, stderr) => {
        fs.unlinkSync('data.dzn');
        if (error) {
            console.error(`Error al ejecutar MiniZinc: ${error.message}`);
            return res.status(500).send('Error al ejecutar MiniZinc');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Error en la ejecución de MiniZinc');
        }

        const resultadoLimpiado = stdout.split('\n')[0].trim();
        res.send({ resultado: resultadoLimpiado });
    });
});

module.exports = router;
