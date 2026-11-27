const GrafoDirigido = require("../GrafoDirigido");

const tareasOriginales = [
  { codigo: "T1", descripcion: "Cerrar el tramo Caribe–Universidad", requiere: [] },
  { codigo: "T2", descripcion: "Cambiar rieles del tramo", requiere: ["T1"] },
  { codigo: "T3", descripcion: "Actualizar el software de señalización", requiere: ["T5"] },
  { codigo: "T4", descripcion: "Probar la señalización", requiere: ["T2", "T3"] },
  { codigo: "T5", descripcion: "Instalar sensores nuevos", requiere: ["T4"] },
  { codigo: "T6", descripcion: "Reabrir el tramo", requiere: ["T4"] }
];

const tareasCorregidas = tareasOriginales.map((tarea) =>
  tarea.codigo === "T5"
    ? { ...tarea, requiere: ["T2"] }
    : tarea
);

function construirGrafo(tareas) {
  const grafo = new GrafoDirigido();
  for (const { codigo } of tareas) {
    grafo.agregarTarea(codigo);
  }
  for (const { codigo, requiere } of tareas) {
    for (const requisito of requiere) {
      grafo.conectar(requisito, codigo);
    }
  }
  return grafo;
}

function ejecutarMantenimiento(imprimir = console.log) {
  const grafoOriginal = construirGrafo(tareasOriginales);
  const ciclo = grafoOriginal.tieneCiclo();
  imprimir("Plan de mantenimiento original:");
  if (ciclo) {
    imprimir(`Ciclo detectado: ${ciclo.join(" → ")}`);
  } else {
    imprimir("No se detectaron ciclos.");
  }

  imprimir("Corrección: instalar sensores después de cambiar los rieles (T2).");
  const grafoCorregido = construirGrafo(tareasCorregidas);
  const cicloCorregido = grafoCorregido.tieneCiclo();
  if (cicloCorregido) {
    imprimir(`El plan corregido aún tiene un ciclo: ${cicloCorregido.join(" → ")}`);
    return 1;
  }

  imprimir("Plan corregido: sin ciclos.");
  imprimir("Orden válido de ejecución:");
  const porCodigo = new Map(tareasCorregidas.map((tarea) => [tarea.codigo, tarea]));
  const orden = grafoCorregido.ordenDeEjecucion();
  for (const codigo of orden) {
    imprimir(`  ${codigo}: ${porCodigo.get(codigo).descripcion}`);
  }
  return 0;
}

module.exports = {
  tareasOriginales,
  tareasCorregidas,
  construirGrafo,
  ejecutarMantenimiento
};
