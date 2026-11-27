const assert = require("node:assert/strict");
const test = require("node:test");
const { codigosEstaciones20 } = require("../src/ArbolBusqueda");
const {
  estacionesMasUsadas,
  generarValidacionesAleatorias,
  horaPico,
  porMinutoEjemplo
} = require("../src/retos/demanda");

test("encuentra la ventana de cinco minutos con más validaciones", () => {
  assert.deepEqual(horaPico(porMinutoEjemplo, 5), {
    minutoInicio: "6:14",
    total: 1630
  });
});

test("devuelve null si no cabe una ventana y rechaza tamaños inválidos", () => {
  assert.equal(horaPico([3, 5], 3), null);
  assert.throws(() => horaPico([3, 5], 0), RangeError);
});

test("cuenta estaciones y ordena por frecuencia descendente", () => {
  const validaciones = [
    { estacion: 50 },
    { estacion: 30 },
    { estacion: 50 },
    { estacion: 56 },
    { estacion: 30 },
    { estacion: 50 }
  ];

  assert.deepEqual(estacionesMasUsadas(validaciones, 3), [
    { estacion: 50, cantidad: 3 },
    { estacion: 30, cantidad: 2 },
    { estacion: 56, cantidad: 1 }
  ]);
  assert.deepEqual(estacionesMasUsadas(validaciones, 0), []);
});

test("genera 50.000 validaciones en estaciones existentes de la red", () => {
  const validaciones = generarValidacionesAleatorias(50000);
  const estaciones = new Set(validaciones.map(({ estacion }) => estacion));

  assert.equal(validaciones.length, 50000);
  assert.ok(estaciones.size > 0);
  assert.ok([...estaciones].every((codigo) => codigosEstaciones20.has(codigo)));
  assert.equal(estacionesMasUsadas(validaciones, 3).length, 3);
});
