const assert = require("node:assert/strict");
const test = require("node:test");
const {
  montoACorregir,
  validacionesDuplicadas
} = require("../src/retos/duplicados");

const validaciones = [
  { tarjeta: "T-101", estacion: 50, hora: "07:02", valor: 3000 },
  { tarjeta: "T-205", estacion: 30, hora: "07:02", valor: 3000 },
  { tarjeta: "T-101", estacion: 50, hora: "07:02", valor: 3000 },
  { tarjeta: "T-330", estacion: 56, hora: "07:05", valor: 3000 },
  { tarjeta: "T-205", estacion: 30, hora: "07:09", valor: 3000 },
  { tarjeta: "T-412", estacion: 10, hora: "07:10", valor: 3000 },
  { tarjeta: "T-330", estacion: 56, hora: "07:05", valor: 3000 },
  { tarjeta: "T-101", estacion: 60, hora: "07:31", valor: 3000 }
];

test("detecta solo las validaciones repetidas y calcula el monto a corregir", () => {
  const duplicadas = validacionesDuplicadas(validaciones);

  assert.deepEqual(
    duplicadas.map(({ tarjeta, estacion, hora }) => [tarjeta, estacion, hora]),
    [
      ["T-101", 50, "07:02"],
      ["T-330", 56, "07:05"]
    ]
  );
  assert.equal(montoACorregir(validaciones), 6000);
});

test("no marca una validación de la misma tarjeta y estación en otro minuto", () => {
  const resultado = validacionesDuplicadas([
    validaciones[1],
    validaciones[4]
  ]);

  assert.deepEqual(resultado, []);
  assert.equal(montoACorregir([validaciones[1], validaciones[4]]), 0);
});

test("acepta una lista vacía y considera duplicadas las apariciones posteriores", () => {
  assert.deepEqual(validacionesDuplicadas([]), []);
  assert.equal(montoACorregir([]), 0);
  assert.equal(montoACorregir([validaciones[0]]), 0);
  assert.equal(
    montoACorregir([validaciones[0], validaciones[0], validaciones[0]]),
    6000
  );
});
