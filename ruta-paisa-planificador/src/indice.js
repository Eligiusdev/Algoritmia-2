const {
  ArbolBusqueda,
  codigosEstaciones,
  codigosEstaciones20
} = require("./ArbolBusqueda");

const indice = new ArbolBusqueda();
for (const [codigo, estacion] of codigosEstaciones) {
  indice.insertar(codigo, estacion);
}

const listadoCompleto = [];
indice.inorden((nodo) => {
  listadoCompleto.push({ codigo: nodo.codigo, estacion: nodo.estacion });
});

console.log("Reporte del índice Ruta Paisa");
console.log("");
console.log("Búsquedas por código:");
for (const codigo of [50, 59, 10, 33]) {
  const resultado = indice.buscar(codigo);
  console.log(
    `${codigo}:`,
    resultado
      ? `${resultado.estacion} (${resultado.comparaciones} comparaciones)`
      : "No existe"
  );
}

console.log("");
console.log("Estación mínima:", indice.minimo());
console.log("Estación máxima:", indice.maximo());
console.log("Zona norte (10 a 30):", indice.rango(10, 30).join(", "));

console.log("");
console.log("Listado completo por código:");
for (const registro of listadoCompleto) {
  console.log(`${registro.codigo} - ${registro.estacion}`);
}

const indiceAscendente = new ArbolBusqueda();
const estaciones20Ascendentes = [...codigosEstaciones20].sort(
  (a, b) => a[0] - b[0]
);

for (const [codigo, estacion] of estaciones20Ascendentes) {
  indiceAscendente.insertar(codigo, estacion);
}

console.log("");
console.log("Análisis con las 20 estaciones en orden ascendente:");
console.log("Altura:", indiceAscendente.altura());
console.log("Niveles:", indiceAscendente.altura() + 1);
console.log("Mínimo de las 20:", indiceAscendente.minimo());
console.log("Máximo de las 20:", indiceAscendente.maximo());
console.log(
  "Zona norte de las 20:",
  indiceAscendente.rango(10, 30).join(", ")
);
console.log(
  "Buscar San Javier:",
  indiceAscendente.buscar(59)?.comparaciones,
  "comparaciones"
);
console.log(
  "Buscar La Estrella:",
  indiceAscendente.buscar(90)?.comparaciones,
  "comparaciones"
);
