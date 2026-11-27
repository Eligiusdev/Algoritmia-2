const Grafo = require("./Grafo");
const { codigosEstaciones20 } = require("./ArbolBusqueda");

const lineas = [
  [
    10, 20, 30, 35, 40, 45, 50,
    60, 65, 70, 80, 90
  ],
  [50, 52, 54, 56, 58, 59],
  [30, 25, 27, 29],
  [40, 56, 65]
];

const red = new Grafo();

for (const linea of lineas) {
  for (const codigo of linea) {
    red.agregarEstacion(codigo);
  }

  for (let i = 0; i < linea.length - 1; i++) {
    red.conectar(linea[i], linea[i + 1]);
  }
}

const nombreEstacion = (codigo) =>
  codigosEstaciones20.get(codigo) || `Código ${codigo}`;

console.log("Red Ruta Paisa");
console.log("Estaciones:", red.contarEstaciones());
console.log("Conexiones:", red.contarConexiones());

console.log("Estaciones de transbordo:");
for (const codigo of red.transbordos()) {
  console.log(`${nombreEstacion(codigo)} (${codigo}) - grado ${red.grado(codigo)}`);
}

const formatearEstaciones = (componente) =>
  [...componente]
    .sort((a, b) => a - b)
    .map((codigo) => `${nombreEstacion(codigo)} (${codigo})`)
    .join(", ");

const traza = [];
red.dfs(29, new Set(), (_codigo, pila) => {
  if (traza.length < 6) {
    traza.push(pila.map(nombreEstacion).join(" -> "));
  }
});

console.log("\nDFS recursivo desde Santo Domingo:");
traza.forEach((paso, indice) => console.log(`${indice + 1}. ${paso}`));

const alcanzablesRecursivo = red.dfs(29);
const alcanzablesIterativo = red.dfsIterativo(29);
const mismosAlcanzables = [...red.adyacencia.keys()].every((inicio) => {
  const recursivo = red.dfs(inicio);
  const iterativo = red.dfsIterativo(inicio);
  return (
    recursivo.size === iterativo.size &&
    [...recursivo].every((codigo) => iterativo.has(codigo))
  );
});
const desdeTodasLasEstaciones = [...red.adyacencia.keys()].every(
  (inicio) =>
    red.dfs(inicio).size === red.contarEstaciones() &&
    red.dfsIterativo(inicio).size === red.contarEstaciones()
);
console.log(
  `Alcanzables: ${alcanzablesRecursivo.size}/${red.contarEstaciones()}; ` +
  `DFS iterativo coincide: ${mismosAlcanzables}`
);
console.log(`Desde todas las estaciones se alcanzan las 20: ${desdeTodasLasEstaciones}`);

const cerradasEstadio = new Set([56]);
const componentesEstadio = red.componentes(cerradasEstadio);
const componentePrincipalEstadio = componentesEstadio.reduce((mayor, actual) =>
  actual.size > mayor.size ? actual : mayor
);
const aisladasEstadio = componentesEstadio
  .filter((componente) => componente !== componentePrincipalEstadio)
  .flatMap((componente) => [...componente]);

console.log("\nCierre de Estadio (56):");
componentesEstadio.forEach((componente, indice) => {
  console.log(`Componente ${indice + 1}: ${formatearEstaciones(componente)}`);
});
console.log(
  "Estaciones aisladas del componente principal:",
  aisladasEstadio.map(nombreEstacion).join(", ")
);

const estacionesCriticas = [];
for (const codigo of red.adyacencia.keys()) {
  const componentes = red.componentes(new Set([codigo]));
  if (componentes.length >= 2) {
    estacionesCriticas.push({ codigo, componentes });
  }
}

console.log("\nEstaciones críticas (componentes al cerrar cada estación):");
for (const { codigo, componentes } of estacionesCriticas) {
  console.log(`${nombreEstacion(codigo)} (${codigo}):`);
  componentes.forEach((componente, indice) => {
    console.log(`  ${indice + 1}. ${formatearEstaciones(componente)}`);
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    red,
    lineas,
    nombreEstacion,
    formatearEstaciones,
    estacionesCriticas,
    aisladasEstadio,
    componentesEstadio,
    mismosAlcanzables,
    desdeTodasLasEstaciones
  };
}
