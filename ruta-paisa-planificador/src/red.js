const Grafo = require("./Grafo");
const { codigosEstaciones20 } = require("./ArbolBusqueda");

const lineas = [
  {
    nombre: "Línea A",
    estaciones: [10, 20, 30, 35, 40, 45, 50, 60, 65, 70, 80, 90]
  },
  { nombre: "Línea B", estaciones: [50, 52, 54, 56, 58, 59] },
  { nombre: "Línea K", estaciones: [30, 25, 27, 29] },
  { nombre: "Línea T", estaciones: [40, 56, 65] }
];

const red = new Grafo();

for (const { nombre, estaciones } of lineas) {
  for (const codigo of estaciones) {
    red.agregarEstacion(codigo);
  }

  for (let i = 0; i < estaciones.length - 1; i++) {
    red.conectar(estaciones[i], estaciones[i + 1], nombre);
  }
}

const nombreEstacion = (codigo) =>
  codigosEstaciones20.get(codigo) || `Código ${codigo}`;

const reportar = (...valores) => {
  if (require.main === module) console.log(...valores);
};

reportar("Red Ruta Paisa");
reportar("Estaciones:", red.contarEstaciones());
reportar("Conexiones:", red.contarConexiones());

reportar("Estaciones de transbordo:");
for (const codigo of red.transbordos()) {
  reportar(`${nombreEstacion(codigo)} (${codigo}) - grado ${red.grado(codigo)}`);
}

const formatearEstaciones = (componente) =>
  [...componente]
    .sort((a, b) => a - b)
    .map((codigo) => `${nombreEstacion(codigo)} (${codigo})`)
    .join(", ");

const formatearRuta = (camino) =>
  camino ? camino.map(nombreEstacion).join(" -> ") : "Inalcanzable";

const imprimirRuta = (descripcion, camino) => {
  const paradas = camino ? ` (${camino.length - 1} paradas)` : "";
  reportar(`${descripcion}: ${formatearRuta(camino)}${paradas}`);
};

const traza = [];
red.dfs(29, new Set(), (_codigo, pila) => {
  if (traza.length < 6) {
    traza.push(pila.map(nombreEstacion).join(" -> "));
  }
});

reportar("\nDFS recursivo desde Santo Domingo:");
traza.forEach((paso, indice) => reportar(`${indice + 1}. ${paso}`));

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
reportar(
  `Alcanzables: ${alcanzablesRecursivo.size}/${red.contarEstaciones()}; ` +
  `DFS iterativo coincide: ${mismosAlcanzables}`
);
reportar(`Desde todas las estaciones se alcanzan las 20: ${desdeTodasLasEstaciones}`);

const cerradasEstadio = new Set([56]);
const componentesEstadio = red.componentes(cerradasEstadio);
const componentePrincipalEstadio = componentesEstadio.reduce((mayor, actual) =>
  actual.size > mayor.size ? actual : mayor
);
const aisladasEstadio = componentesEstadio
  .filter((componente) => componente !== componentePrincipalEstadio)
  .flatMap((componente) => [...componente]);

reportar("\nCierre de Estadio (56):");
componentesEstadio.forEach((componente, indice) => {
  reportar(`Componente ${indice + 1}: ${formatearEstaciones(componente)}`);
});
reportar(
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

reportar("\nEstaciones críticas (componentes al cerrar cada estación):");
for (const { codigo, componentes } of estacionesCriticas) {
  reportar(`${nombreEstacion(codigo)} (${codigo}):`);
  componentes.forEach((componente, indice) => {
    reportar(`  ${indice + 1}. ${formatearEstaciones(componente)}`);
  });
}

const trazaBfs = [];
const rutaNiquiaSanJavier = red.rutaMasCorta(10, 59, new Set(), (nivel, cola) => {
  trazaBfs.push({ nivel, cola: [...cola] });
});
const rutaSantoDomingoPoblado = red.rutaMasCorta(29, 70);
const rutaEstrellaFloresta = red.rutaMasCorta(90, 58);
let caminoDfsNiquiaSanJavier = null;
red.dfs(10, new Set(), (codigo, pila) => {
  if (codigo === 59) caminoDfsNiquiaSanJavier = [...pila];
});

reportar("\nTraza BFS desde Niquía hasta San Javier:");
for (const { nivel, cola } of trazaBfs) {
  reportar(`Nivel ${nivel}: [${cola.map(nombreEstacion).join(", ")}]`);
}

reportar("\nRutas más cortas (red completa):");
imprimirRuta("Niquía -> San Javier", rutaNiquiaSanJavier);
imprimirRuta("Santo Domingo -> Poblado", rutaSantoDomingoPoblado);
imprimirRuta("La Estrella -> Floresta", rutaEstrellaFloresta);
imprimirRuta("DFS Niquía -> San Javier", caminoDfsNiquiaSanJavier);

const rutaSantoDomingoPobladoCerrada = red.rutaMasCorta(29, 70, cerradasEstadio);
const rutaNiquiaSanJavierCerrada = red.rutaMasCorta(10, 59, cerradasEstadio);
reportar("\nRutas con Estadio cerrado:");
imprimirRuta("Santo Domingo -> Poblado", rutaSantoDomingoPobladoCerrada);
imprimirRuta("Niquía -> San Javier", rutaNiquiaSanJavierCerrada);

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
    desdeTodasLasEstaciones,
    formatearRuta,
    trazaBfs,
    rutaNiquiaSanJavier,
    rutaSantoDomingoPoblado,
    rutaEstrellaFloresta,
    caminoDfsNiquiaSanJavier,
    rutaSantoDomingoPobladoCerrada,
    rutaNiquiaSanJavierCerrada
  };
}
