const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const test = require("node:test");
const GrafoDirigido = require("../src/estructuras/GrafoDirigido");
const {
  construirGrafo,
  tareasCorregidas,
  tareasOriginales
} = require("../src/retos/mantenimiento");

const archivoPlanificador = path.join(__dirname, "../src/planificador.js");

test("detecta y devuelve el ciclo del plan original", () => {
  const grafo = construirGrafo(tareasOriginales);

  assert.deepEqual(grafo.tieneCiclo(), ["T3", "T4", "T5", "T3"]);
  assert.throws(() => grafo.ordenDeEjecucion(), /dependencias cíclicas/);
});

test("el plan corregido no tiene ciclos y su orden respeta requisitos", () => {
  const grafo = construirGrafo(tareasCorregidas);
  const orden = grafo.ordenDeEjecucion();
  const posicion = new Map(orden.map((tarea, indice) => [tarea, indice]));

  assert.equal(grafo.tieneCiclo(), null);
  assert.equal(orden.length, tareasCorregidas.length);
  for (const { codigo, requiere } of tareasCorregidas) {
    for (const requisito of requiere) {
      assert.ok(posicion.get(requisito) < posicion.get(codigo));
    }
  }
});

test("las conexiones del grafo dirigido no agregan aristas inversas", () => {
  const grafo = new GrafoDirigido();
  grafo.conectar("T1", "T2");

  assert.deepEqual(grafo.vecinos("T1"), ["T2"]);
  assert.deepEqual(grafo.vecinos("T2"), []);
});

test("el planificador expone el diagnóstico con --mantenimiento", () => {
  const resultado = spawnSync(
    process.execPath,
    [archivoPlanificador, "--mantenimiento"],
    { encoding: "utf8" }
  );

  assert.equal(resultado.status, 0);
  assert.match(resultado.stdout, /T3 → T4 → T5 → T3/);
  assert.match(resultado.stdout, /Plan corregido: sin ciclos/);
  assert.match(resultado.stdout, /T1: Cerrar el tramo Caribe–Universidad/);
});
