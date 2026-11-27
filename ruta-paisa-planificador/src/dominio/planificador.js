const { arbol20 } = require("../estructuras/ArbolBusqueda");
const { red, estacionesCriticas, formatearEstaciones } = require("./red");

const uso =
  "Uso: node src/planificador.js <origen> <destino> [--cerradas <código> ...]";

function mostrarAyuda(imprimir) {
  imprimir("Planificador Ruta Paisa v1.0");
  imprimir("  <origen> <destino> [--cerradas <código> ...]  Consultar una ruta");
  imprimir("  --listar                                      Listar estaciones por código");
  imprimir("  --rango <desde> <hasta>                       Consultar rango de códigos");
  imprimir("  --criticas                                    Analizar cierres críticos");
  imprimir("  --mantenimiento                               Validar dependencias de obras");
  return 0;
}

function listarEstaciones(argumentos, imprimir) {
  if (argumentos.length !== 0) {
    imprimir("Error: --listar no acepta argumentos.");
    return 1;
  }

  imprimir("Estaciones ordenadas por código:");
  arbol20.inorden((nodo) => imprimir(`  ${nodo.codigo} - ${nodo.estacion}`));
  return 0;
}

function consultarRango(argumentos, imprimir) {
  if (argumentos.length !== 2) {
    imprimir("Error: uso de --rango <desde> <hasta>.");
    return 1;
  }

  const desde = leerCodigo(argumentos[0]);
  const hasta = leerCodigo(argumentos[1]);
  if (desde === null || hasta === null) {
    imprimir("Error: los límites del rango deben ser códigos enteros.");
    return 1;
  }

  const estaciones = arbol20.rango(desde, hasta);
  if (estaciones.length === 0) {
    imprimir(`No hay estaciones en el rango ${desde}–${hasta}.`);
    return 0;
  }

  imprimir(`Estaciones en el rango ${desde}–${hasta}:`);
  estaciones.forEach((estacion) => imprimir(`  ${estacion}`));
  return 0;
}

function analizarCriticas(argumentos, imprimir) {
  if (argumentos.length !== 0) {
    imprimir("Error: --criticas no acepta argumentos.");
    return 1;
  }

  imprimir(`Estaciones críticas: ${estacionesCriticas.length}`);
  for (const { codigo, componentes } of estacionesCriticas) {
    const nombre = arbol20.buscar(codigo).estacion;
    imprimir(`  ${nombre} (${codigo})`);
    componentes.forEach((componente, indice) => {
      imprimir(`    Componente ${indice + 1}: ${formatearEstaciones(componente)}`);
    });
  }
  return 0;
}

function validarMantenimiento(argumentos, imprimir) {
  if (argumentos.length !== 0) {
    imprimir("Error: --mantenimiento no acepta argumentos.");
    return 1;
  }
  const { ejecutarMantenimiento } = require("../retos/mantenimiento");
  return ejecutarMantenimiento(imprimir);
}

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
  if (argumentos.length === 0 || argumentos[0] === "--ayuda") {
    return mostrarAyuda(imprimir);
  }
  if (argumentos[0] === "--listar") {
    return listarEstaciones(argumentos.slice(1), imprimir);
  }
  if (argumentos[0] === "--rango") {
    return consultarRango(argumentos.slice(1), imprimir);
  }
  if (argumentos[0] === "--criticas") {
    return analizarCriticas(argumentos.slice(1), imprimir);
  }
  if (argumentos[0] === "--mantenimiento") {
    return validarMantenimiento(argumentos.slice(1), imprimir);
  }

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

  imprimir("Planificador Ruta Paisa v1.0");
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

module.exports = {
  interpretarArgumentos,
  listarEstaciones,
  consultarRango,
  analizarCriticas,
  ejecutar
};
