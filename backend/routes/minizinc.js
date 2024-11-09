const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.post("/minPol", (req, res) => {
  const {
    numPersonas,
    numOpiniones,
    distribucionOpiniones,
    valoresOpiniones,
    costosExtras,
    costosDesplazamiento,
    costoTotalMax,
    maxMovimientos,
  } = req.body;

  const dataContent = `
        n = ${numPersonas};
        m = ${numOpiniones};
        p = [${distribucionOpiniones.join(", ")}];
        v = [${valoresOpiniones.join(", ")}];
        ce = [${costosExtras.join(", ")}];
        c = array2d(1..${numOpiniones}, 1..${numOpiniones}, [${costosDesplazamiento
    .flat()
    .join(", ")}]);
        ct = ${costoTotalMax};
        maxM = ${maxMovimientos};
    `;
  fs.writeFileSync("data.dzn", dataContent);

  const minpolPath = path.join(__dirname, "..", "minizinc", "minpol.mzn");
  // Verifica si el archivo existe
if (!fs.existsSync(minpolPath)) {
  console.error("El archivo minpol.mzn no existe en la ruta especificada:", minpolPath);
  return res.status(500).send("Archivo minpol.mzn no encontrado");
}

  const timeoutDuration = 420000;
  const timeLimit = Math.floor(timeoutDuration / 1000);
  //const command = `minizinc --solver CoinBC --time-limit ${timeLimit} "${minpolPath}" data.dzn`;
  const command = `minizinc --solver Gecode --time-limit ${timeLimit} "${minpolPath}" data.dzn`;

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

      // Procesar la matriz de movimientos `x`
      const movimientosList = xMatch[1]
      .split(", ")
      .map(Number);

    const movimientosRealizados = [];
    for (let i = 0; i < numOpiniones; i++) {
      movimientosRealizados.push(movimientosList.slice(i * numOpiniones, (i + 1) * numOpiniones));
    }
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
