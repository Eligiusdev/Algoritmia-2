const assert = require("node:assert/strict");
const { ejecutar } = require("../src/dominio/planificador");
const Cola = require("../src/estructuras/Cola");
const Grafo = require("../src/estructuras/Grafo");
const GrafoDirigido = require("../src/estructuras/GrafoDirigido");
const {
  construirGrafo,
  tareasCorregidas,
  tareasOriginales
} = require("../src/retos/mantenimiento");

let fallas = 0;

function verificar(nombre, prueba) {
  try {
    prueba();
    console.log(`OK - ${nombre}`);
  } catch (error) {
    fallas++;
    console.log(`FALLA - ${nombre}: ${error.message}`);
  }
}

function consultar(argumentos) {
  const lineas = [];
  const codigoSalida = ejecutar(argumentos, (linea) => lineas.push(linea));
  return { codigoSalida, salida: lineas.join("\n") };
}

verificar("ruta con BFS, nombres y transbordos", () => {
  const { salida } = consultar(["10", "59"]);
  assert.match(salida, /Ruta más corta: 7 paradas/);
  assert.match(salida, /Niquía/);
  assert.match(salida, /Hospital \(40\): Línea A → Línea T/);
});

verificar("ruta imposible cuando Estadio está cerrado", () => {
  const { salida } = consultar(["10", "59", "--cerradas", "56"]);
  assert.match(salida, /No hay una ruta disponible/);
});

verificar("listado de estaciones ordenado por código", () => {
  const { salida } = consultar(["--listar"]);
  assert.ok(salida.indexOf("10 - Niquía") < salida.indexOf("90 - La Estrella"));
});

verificar("borde de listado: rechaza argumentos extra", () => {
  assert.equal(consultar(["--listar", "10"]).codigoSalida, 1);
});

verificar("rango válido de códigos", () => {
  const { salida } = consultar(["--rango", "10", "30"]);
  assert.match(salida, /Bello/);
  assert.match(salida, /Caribe/);
});

verificar("borde de rango sin estaciones", () => {
  const { salida } = consultar(["--rango", "999", "1000"]);
  assert.match(salida, /No hay estaciones en el rango/);
});

verificar("análisis de estaciones críticas", () => {
  const { salida } = consultar(["--criticas"]);
  assert.match(salida, /Estadio \(56\)/);
  assert.match(salida, /Componente 2/);
});

verificar("borde de análisis crítico: rechaza argumentos extra", () => {
  assert.equal(consultar(["--criticas", "56"]).codigoSalida, 1);
});

verificar("borde de análisis crítico: red con una estación no tiene articulaciones", () => {
  const grafo = new Grafo();
  grafo.agregarEstacion(1);
  assert.deepEqual(grafo.estacionesCriticas(), []);
});

verificar("diagnóstico y orden topológico de mantenimiento", () => {
  const { salida } = consultar(["--mantenimiento"]);
  assert.match(salida, /T3 → T4 → T5 → T3/);
  assert.match(salida, /T1: Cerrar/);
  assert.ok(salida.indexOf("T5: Instalar") < salida.indexOf("T3: Actualizar"));
});

verificar("borde de mantenimiento: grafo vacío", () => {
  const grafo = new GrafoDirigido();
  assert.equal(grafo.tieneCiclo(), null);
  assert.deepEqual(grafo.ordenDeEjecucion(), []);
});

verificar("grafo de mantenimiento corregido respeta dependencias", () => {
  const grafo = construirGrafo(tareasCorregidas);
  const orden = grafo.ordenDeEjecucion();
  const posicion = new Map(orden.map((tarea, indice) => [tarea, indice]));
  for (const { codigo, requiere } of tareasCorregidas) {
    for (const requisito of requiere) {
      assert.ok(posicion.get(requisito) < posicion.get(codigo));
    }
  }
});

verificar("detección del ciclo en el plan original", () => {
  assert.deepEqual(
    construirGrafo(tareasOriginales).tieneCiclo(),
    ["T3", "T4", "T5", "T3"]
  );
});

verificar("cola FIFO y borde vacía", () => {
  const cola = new Cola();
  assert.equal(cola.desencolar(), null);
  cola.encolar("T1");
  cola.encolar("T2");
  assert.equal(cola.desencolar(), "T1");
  assert.equal(cola.verFrente(), "T2");
});

console.log(`\n${fallas === 0 ? "OK" : "FALLA"} - ${fallas} fallas`);
process.exitCode = fallas === 0 ? 0 : 1;
