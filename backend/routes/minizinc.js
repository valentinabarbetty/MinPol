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
        n = ${numPersonas};
        m = ${numOpiniones};
        p = [${distribucionOpiniones.join(', ')}];
        v = [${valoresOpiniones.join(', ')}];
        ce = [${costosExtras.join(', ')}];
        c = array2d(1..${numOpiniones}, 1..${numOpiniones}, [${costosDesplazamiento.flat().join(', ')}]);
        ct = ${costoTotalMax};
        maxM = ${maxMovimientos};
    `;
    // Escribir archivo data.dzn
    fs.writeFileSync('data.dzn', dataContent);

    // Ruta al archivo .mzn de MiniZinc
    const minpolPath = path.join(__dirname, '..', 'minizinc', 'minpol.mzn');
    const command = `minizinc --solver COIN-BC "${minpolPath}" data.dzn`;

    exec(command, (error, stdout, stderr) => {
        fs.unlinkSync('data.dzn'); // Eliminar el archivo de datos una vez ejecutado
        if (error) {
            console.error(`Error al ejecutar MiniZinc: ${error.message}`);
            return res.status(500).send('Error al ejecutar MiniZinc');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Error en la ejecución de MiniZinc');
        }

        // Extraer los valores de la polarización mínima y movimientos entre opiniones
        const polarizacionMatch = stdout.match(/Polarizacion minima = ([\d.]+)/);
        const movimientosMatch = stdout.match(/Movimientos entre opiniones = \[(.*)\]/);
        console.log(stdout);
        if (polarizacionMatch && movimientosMatch) {
            const polarizacion = parseFloat(polarizacionMatch[1]);

            // Convertir la matriz de movimientos a formato JSON
            const movimientosString = movimientosMatch[1].trim();
            const movimientosArray = movimientosString
                .split('], [').map(row => 
                    row.replace(/[\[\]]/g, '').split(', ').map(Number)
                );

            res.send({
                polarizacion,
                movimientos: movimientosArray
            });
        } else {
            res.status(500).send('No se pudo encontrar el resultado en la salida de MiniZinc');
        }
    });
});

module.exports = router;
