const { codigosEstaciones20 } = require("../ArbolBusqueda");

const porMinutoEjemplo = [
  120, 135, 150, 180, 210, 260, 310, 340, 330, 300,
  280, 250, 240, 260, 290, 320, 350, 360, 310, 270
];

const codigosRed = [...codigosEstaciones20.keys()];

function formatearMinuto(indice) {
  const hora = 6 + Math.floor(indice / 60);
  const minuto = String(indice % 60).padStart(2, "0");
  return `${hora}:${minuto}`;
}

function horaPico(porMinuto, k) {
  if (!Array.isArray(porMinuto)) {
    throw new TypeError("porMinuto debe ser un arreglo de validaciones.");
  }
  if (!Number.isInteger(k) || k <= 0) {
    throw new RangeError("k debe ser un entero positivo.");
  }
  if (k > porMinuto.length) return null;

  let sumaActual = 0;
  for (let indice = 0; indice < k; indice++) {
    sumaActual += porMinuto[indice];
  }

  let mejorTotal = sumaActual;
  let mejorInicio = 0;
  for (let indice = k; indice < porMinuto.length; indice++) {
    sumaActual += porMinuto[indice] - porMinuto[indice - k];
    if (sumaActual > mejorTotal) {
      mejorTotal = sumaActual;
      mejorInicio = indice - k + 1;
    }
  }

  return {
    minutoInicio: formatearMinuto(mejorInicio),
    total: mejorTotal
  };
}

function estacionesMasUsadas(validaciones, k) {
  if (!Number.isInteger(k) || k < 0) {
    throw new RangeError("k debe ser un entero no negativo.");
  }

  const conteos = new Map();
  for (const validacion of validaciones) {
    const estacion = validacion.estacion;
    conteos.set(estacion, (conteos.get(estacion) || 0) + 1);
  }

  return [...conteos.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([estacion, cantidad]) => ({ estacion, cantidad }));
}

function generarValidacionesAleatorias(cantidad = 50000) {
  if (!Number.isSafeInteger(cantidad) || cantidad < 0) {
    throw new RangeError("La cantidad de validaciones debe ser un entero no negativo.");
  }

  return Array.from({ length: cantidad }, () => {
    const tarjeta = `T-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
    const estacion = codigosRed[Math.floor(Math.random() * codigosRed.length)];
    const minutoDelDia = Math.floor(Math.random() * 1440);
    const hora =
      `${String(Math.floor(minutoDelDia / 60)).padStart(2, "0")}:` +
      `${String(minutoDelDia % 60).padStart(2, "0")}`;
    return { tarjeta, estacion, hora, valor: 3000 };
  });
}

if (require.main === module) {
  const pico = horaPico(porMinutoEjemplo, 5);
  console.log(
    `Hora pico: ${pico.minutoInicio}, ${pico.total} validaciones en 5 minutos.`
  );

  const validaciones = generarValidacionesAleatorias(50000);
  const masUsadas = estacionesMasUsadas(validaciones, 3);
  console.log("Tres estaciones más usadas en 50.000 validaciones aleatorias:");
  for (const { estacion, cantidad } of masUsadas) {
    console.log(
      `  ${codigosEstaciones20.get(estacion)} (${estacion}): ${cantidad}`
    );
  }
}

module.exports = {
  porMinutoEjemplo,
  horaPico,
  estacionesMasUsadas,
  generarValidacionesAleatorias
};
