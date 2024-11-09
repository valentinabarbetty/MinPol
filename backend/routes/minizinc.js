const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.post("/minPol", (req, res) => {
  // ... Código anterior ...
  
  console.log("Ruta del archivo minpol.mzn: ", minpolPath);
  console.log("Contenido del archivo data.dzn:", dataContent);
  console.log("Ejecutando el comando de MiniZinc: ", command);

  const execProcess = exec(command, (error, stdout, stderr) => {
    clearTimeout(timeout);
    clearInterval(monitorInterval);
    fs.unlinkSync("data.dzn");

    if (error) {
      console.error(`Error al ejecutar MiniZinc: ${error.message}`);
      return res.status(500).send("Error al ejecutar MiniZinc");
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send("Error en la ejecución de MiniZinc");
    }

    console.log("Salida de MiniZinc (stdout): ", stdout);

    // Parsing del stdout
    const polarizacionInicial2 = stdout.match(/Polarización inicial: ([\d.]+)/);
    const polarizacionFinal2 = stdout.match(/Polarización final: ([\d.]+)/);
    const movimientosMatch2 = stdout.match(/Movimientos Totales: ([\d.]+)/);
    const costoTotal2 = stdout.match(/Costo total: ([\d.]+)/);
    const matrizMov2 = stdout.match(/Distribución final de personas por opinión: \[(.*)\]/);
    const xMatch = stdout.match(/Movimientos realizados: \[(.*)\]/);

    if (
      polarizacionInicial2 &&
      polarizacionFinal2 &&
      movimientosMatch2 &&
      matrizMov2 &&
      costoTotal2 &&
      xMatch
    ) {
      const polarizacionInicial = parseFloat(polarizacionInicial2[1]).toFixed(3);
      const polarizacionFinal = parseFloat(polarizacionFinal2[1]).toFixed(3);
      const costoTotal = parseFloat(costoTotal2[1]).toFixed(1);
      const movimientosTotales = parseFloat(movimientosMatch2[1]).toFixed(1);
      const distribucionFinal = matrizMov2[1].split(",").map(Number);

      const movimientosList = xMatch[1].split(", ").map(Number);
      const movimientosRealizados = [];
      for (let i = 0; i < numOpiniones; i++) {
        movimientosRealizados.push(movimientosList.slice(i * numOpiniones, (i + 1) * numOpiniones));
      }

      console.log("Resultado final a enviar: ", {
        polarizacion_inicial: polarizacionInicial,
        polarizacion_final: polarizacionFinal,
        costo_total: costoTotal,
        movimientos_totales: movimientosTotales,
        distribucion_final: distribucionFinal,
        movimientos_realizados: movimientosRealizados,
      });

      res.json({
        polarizacion_inicial: polarizacionInicial,
        polarizacion_final: polarizacionFinal,
        costo_total: costoTotal,
        movimientos_totales: movimientosTotales,
        distribucion_final: distribucionFinal,
        movimientos_realizados: movimientosRealizados,
      });
    } else {
      res.status(500).send("No se pudo encontrar el resultado en la salida de MiniZinc");
    }
  });

  // Monitoreo y timeout
  const monitorInterval = setInterval(() => {
    console.log("Esperando respuesta de MiniZinc...");
  }, 10000);

  const timeout = setTimeout(() => {
    execProcess.kill();
    clearInterval(monitorInterval);
    res.status(408).send(`Tiempo de espera excedido (${timeoutDuration / 1000} segundos).`);
  }, timeoutDuration);
});


module.exports = router;
