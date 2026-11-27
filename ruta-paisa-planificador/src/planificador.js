const { arbol20 } = require("./ArbolBusqueda");
const { red } = require("./red");

const uso =
  "Uso: node src/planificador.js <origen> <destino> [--cerradas <código> ...]";

const leerCodigo = (valor) => {
  if (!/^\d+$/.test(valor)) return null;
  const codigo = Number(valor);
  return Number.isSafeInteger(codigo) ? codigo : null;
};

function interpretarArgumentos(argumentos) {
  const estaciones = [];
  const cerradas = new Set();

  for (let indice = 0; indice < argumentos.length; indice++) {
    const argumento = argumentos[indice];

    if (argumento === "--cerradas") {
      let cantidad = 0;
      while (
        indice + 1 < argumentos.length &&
        !argumentos[indice + 1].startsWith("--")
      ) {
        const codigo = leerCodigo(argumentos[++indice]);
        if (codigo === null) {
          return { error: `Código de estación cerrada no válido: ${argumentos[indice]}.` };
        }
        cerradas.add(codigo);
        cantidad++;
      }
      if (cantidad === 0) {
        return { error: "Indica al menos un código después de --cerradas." };
      }
      continue;
    }

    if (argumento.startsWith("--")) {
      return { error: `Opción desconocida: ${argumento}.` };
    }

    const codigo = leerCodigo(argumento);
    if (codigo === null) {
      return { error: `Código de estación no válido: ${argumento}.` };
    }
    estaciones.push(codigo);
  }

  if (estaciones.length !== 2) {
    return { error: uso };
  }

  return { origen: estaciones[0], destino: estaciones[1], cerradas };
}

function ejecutar(argumentos, imprimir = console.log) {
  const consulta = interpretarArgumentos(argumentos);
  if (consulta.error) {
    imprimir(`Error: ${consulta.error}`);
    return 1;
  }

  const { origen, destino, cerradas } = consulta;
  const estacionOrigen = arbol20.buscar(origen);
  const estacionDestino = arbol20.buscar(destino);

  if (!estacionOrigen) {
    imprimir(`Error: no existe una estación con el código ${origen}.`);
    return 1;
  }
  if (!estacionDestino) {
    imprimir(`Error: no existe una estación con el código ${destino}.`);
    return 1;
  }

  for (const codigo of cerradas) {
    if (!arbol20.buscar(codigo)) {
      imprimir(`Error: no existe una estación cerrada con el código ${codigo}.`);
      return 1;
    }
  }

  imprimir("Planificador Ruta Paisa v0.2");
  imprimir(`Origen: ${estacionOrigen.estacion} (${origen})`);
  imprimir(`Destino: ${estacionDestino.estacion} (${destino})`);
  if (cerradas.size > 0) {
    const nombresCerradas = [...cerradas]
      .map((codigo) => `${arbol20.buscar(codigo).estacion} (${codigo})`)
      .join(", ");
    imprimir(`Estaciones cerradas: ${nombresCerradas}`);
  }

  const camino = red.rutaMasCorta(origen, destino, cerradas);
  if (!camino) {
    imprimir(
      `No hay una ruta disponible entre ${estacionOrigen.estacion} y ` +
      `${estacionDestino.estacion} con las estaciones cerradas indicadas.`
    );
    return 0;
  }

  if (camino.length === 1) {
    imprimir("El origen y el destino son la misma estación; no hay paradas.");
    return 0;
  }

  const tramos = [];
  const transbordos = [];
  for (let indice = 0; indice < camino.length - 1; indice++) {
    const desde = camino[indice];
    const hasta = camino[indice + 1];
    const lineas = red.lineasDeConexion(desde, hasta);
    if (lineas.length === 0) {
      imprimir(
        `Error: no hay una línea registrada para la conexión ${desde}–${hasta}.`
      );
      return 1;
    }

    const linea = lineas[0];
    if (tramos.length > 0 && tramos[tramos.length - 1].linea !== linea) {
      transbordos.push({
        estacion: desde,
        desde: tramos[tramos.length - 1].linea,
        hacia: linea
      });
    }
    tramos.push({ desde, hasta, linea });
  }

  const prefijo = cerradas.size > 0 ? "Ruta alternativa" : "Ruta más corta";
  imprimir(`${prefijo}: ${camino.length - 1} paradas`);
  for (const { desde, hasta, linea } of tramos) {
    const nombreDesde = arbol20.buscar(desde).estacion;
    const nombreHasta = arbol20.buscar(hasta).estacion;
    imprimir(
      `  ${nombreDesde} (${desde}) -- ${linea} --> ${nombreHasta} (${hasta})`
    );
  }

  if (transbordos.length === 0) {
    imprimir("Transbordos: ninguno.");
  } else {
    imprimir(`Transbordos: ${transbordos.length}`);
    for (const transbordo of transbordos) {
      const nombre = arbol20.buscar(transbordo.estacion).estacion;
      imprimir(
        `  ${nombre} (${transbordo.estacion}): ${transbordo.desde} → ${transbordo.hacia}`
      );
    }
  }

  return 0;
}

if (require.main === module) {
  process.exitCode = ejecutar(process.argv.slice(2));
}

module.exports = { interpretarArgumentos, ejecutar };
