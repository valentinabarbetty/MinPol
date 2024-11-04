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
    fs.writeFileSync('data.dzn', dataContent);

    const minpolPath = path.join(__dirname, '..', 'minizinc', 'minpol.mzn');
    const timeoutDuration = 420000; // 7 minutos en milisegundos
    const timeLimit = Math.floor(timeoutDuration / 1000); // Convertir a segundos para --time-limit
    const command = `minizinc --solver CoinBC --time-limit ${timeLimit} "${minpolPath}" data.dzn`;


    const execProcess = exec(command, (error, stdout, stderr) => {
        clearTimeout(timeout); // Limpiar timeout si el proceso termina
        clearInterval(monitorInterval); // Limpiar el intervalo de monitoreo
        fs.unlinkSync('data.dzn'); // Eliminar el archivo data.dzn

        if (error) {
            console.error(`Error al ejecutar MiniZinc: ${error.message}`);
            return res.status(500).send('Error al ejecutar MiniZinc');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Error en la ejecución de MiniZinc');
        }

        // Procesar y enviar la respuesta al cliente
        const polarizacionMatch = stdout.match(/Polarización total: ([\d.]+)/);
        const movimientosMatch = stdout.match(/Movimientos Totales: ([\d.]+)/);
        const matrizMov = stdout.match(/Distribución final de personas por opinión: \[(.*)\]/);

        if (polarizacionMatch && movimientosMatch && matrizMov) {
            const polarizacionTotal = parseFloat(polarizacionMatch[1]).toFixed(3);
            const movimientosTotales = parseFloat(movimientosMatch[1]).toFixed(1);
            const distribucionFinal = matrizMov[1].split(',').map(Number);
            res.json({
                polarizacion: polarizacionTotal,
                movimientos: movimientosTotales,
                distribucion: distribucionFinal
            });
        } else {
            res.status(500).send('No se pudo encontrar el resultado en la salida de MiniZinc');
        }
    });

    // Intervalo de monitoreo: muestra un mensaje cada 10 segundos
    const monitorInterval = setInterval(() => {
        console.log('Esperando respuesta de MiniZinc...');
    }, 10000);

    // Si el proceso supera el tiempo, se mata y se notifica al cliente
    const timeout = setTimeout(() => {
        execProcess.kill(); // Matar el proceso si se demora demasiado
        clearInterval(monitorInterval); // Limpiar el intervalo de monitoreo
        res.status(408).send(`Tiempo de espera excedido (${timeoutDuration / 1000} segundos).`);
    }, timeoutDuration);
});

module.exports = router;
