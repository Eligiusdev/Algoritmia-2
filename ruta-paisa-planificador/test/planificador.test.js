const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const test = require("node:test");

const archivoPlanificador = path.join(__dirname, "../src/planificador.js");

const consultar = (...argumentos) =>
  spawnSync(process.execPath, [archivoPlanificador, ...argumentos], {
    encoding: "utf8"
  });

test("muestra la ruta mínima con líneas y transbordos", () => {
  const resultado = consultar("10", "59");

  assert.equal(resultado.status, 0);
  assert.match(resultado.stdout, /Ruta más corta: 7 paradas/);
  assert.match(resultado.stdout, /Niquía \(10\) -- Línea A --> Bello \(20\)/);
  assert.match(resultado.stdout, /Hospital \(40\): Línea A → Línea T/);
  assert.match(resultado.stdout, /Estadio \(56\): Línea T → Línea B/);
});

test("busca una alternativa con cierres o informa si no hay ruta", () => {
  const rutaAlternativa = consultar("29", "70", "--cerradas", "56");
  assert.equal(rutaAlternativa.status, 0);
  assert.match(rutaAlternativa.stdout, /Ruta alternativa: 10 paradas/);

  const sinRuta = consultar("10", "59", "--cerradas", "56");
  assert.equal(sinRuta.status, 0);
  assert.match(sinRuta.stdout, /No hay una ruta disponible/);
});

test("valida estaciones y maneja origen igual al destino", () => {
  const desconocida = consultar("999", "59");
  assert.equal(desconocida.status, 1);
  assert.match(desconocida.stdout, /no existe una estación con el código 999/);

  const mismaEstacion = consultar("10", "10");
  assert.equal(mismaEstacion.status, 0);
  assert.match(mismaEstacion.stdout, /misma estación; no hay paradas/);
});
