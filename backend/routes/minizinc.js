const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.post("/minPol", (req, res) => {
  console.log("Petición recibida para /minPol");

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

  // Verificar que los datos estén completos y sean válidos
  if (
    !numPersonas || !numOpiniones || !Array.isArray(distribucionOpiniones) || 
    !Array.isArray(valoresOpiniones) || !Array.isArray(costosExtras) || 
    !Array.isArray(costosDesplazamiento) || !costoTotalMax || !maxMovimientos
  ) {
    return res.status(400).send("Datos incompletos o inválidos.");
  }

  // Generar contenido para el archivo .dzn
  const dataContent = `
    n = ${numPersonas};
    m = ${numOpiniones};
    p = [${distribucionOpiniones.join(", ")}];
    v = [${valoresOpiniones.join(", ")}];
    ce = [${costosExtras.join(", ")}];
    c = array2d(1..${numOpiniones}, 1..${numOpiniones}, [${costosDesplazamiento.flat().join(", ")}]);
    ct = ${costoTotalMax};
    maxM = ${maxMovimientos};
  `;
  
  // Escribir los datos en un archivo 'data.dzn'
  try {
    fs.writeFileSync("data.dzn", dataContent);
    console.log("Archivo de datos 'data.dzn' generado.");
  } catch (err) {
    console.error("Error al generar el archivo de datos:", err);
    return res.status(500).send("Error al generar el archivo de datos.");
  }

  const minpolPath = path.join(__dirname, "..", "minizinc", "minpol.mzn");

  // Verificar si el archivo minpol.mzn existe
  if (!fs.existsSync(minpolPath)) {
    console.error("El archivo minpol.mzn no existe en la ruta especificada:", minpolPath);
    fs.unlinkSync("data.dzn");  // Limpiar el archivo de datos
    return res.status(500).send("Archivo minpol.mzn no encontrado");
  }

  // Mostrar mensaje antes de ejecutar MiniZinc
  console.log("Ejecutando el comando MiniZinc con solver CoinBC...");

  const timeoutDuration = 420000;
  const timeLimit = Math.floor(timeoutDuration / 1000);
  const command = `minizinc --solver CoinBC --time-limit ${timeLimit} "${minpolPath}" data.dzn`;

  // Ejecutar el comando MiniZinc
  const execProcess = exec(command, (error, stdout, stderr) => {
    // Limpiar los recursos después de la ejecución
    fs.unlinkSync("data.dzn");

    if (error) {
      console.error(`Error al ejecutar MiniZinc: ${error.message}`);
      return res.status(500).send("Error al ejecutar MiniZinc");
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send("Error en la ejecución de MiniZinc");
    }

    // Procesar la salida de MiniZinc
    console.log("Comando ejecutado correctamente, procesando salida...");

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
      const movimientosList = xMatch[1].split(", ").map(Number);

      const movimientosRealizados = [];
      for (let i = 0; i < numOpiniones; i++) {
        movimientosRealizados.push(movimientosList.slice(i * numOpiniones, (i + 1) * numOpiniones));
      }

      // Enviar la respuesta con los resultados procesados
      console.log("Resultado procesado, enviando respuesta al cliente...");
      return res.json({
        polarizacion_inicial: polarizacionInicial,
        polarizacion_final: polarizacionFinal,
        costo_total: costoTotal,
        movimientos_totales: movimientosTotales,
        distribucion_final: distribucionFinal,
        movimientos_realizados: movimientosRealizados,
      });
    } else {
      console.error("No se pudo encontrar el resultado en la salida de MiniZinc.");
      return res.status(500).send("No se pudo encontrar el resultado en la salida de MiniZinc");
    }
  });

  // Monitorear el progreso de la ejecución de MiniZinc
  const monitorInterval = setInterval(() => {
    console.log("Esperando respuesta de MiniZinc...");
  }, 10000);

  // Establecer un límite de tiempo para la ejecución
  const timeout = setTimeout(() => {
    execProcess.kill();
    clearInterval(monitorInterval);
    console.error(`Tiempo de espera excedido (${timeoutDuration / 1000} segundos).`);
    return res.status(408).send(`Tiempo de espera excedido (${timeoutDuration / 1000} segundos).`);
  }, timeoutDuration);
});

module.exports = router;
