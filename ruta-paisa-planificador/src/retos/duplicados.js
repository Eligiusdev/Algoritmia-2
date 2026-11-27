function validacionesDuplicadas(validaciones) {
  const clavesVistas = new Set();
  const duplicadas = [];

  for (const validacion of validaciones) {
    const clave = `${validacion.tarjeta}|${validacion.estacion}|${validacion.hora}`;
    if (clavesVistas.has(clave)) {
      duplicadas.push(validacion);
    } else {
      clavesVistas.add(clave);
    }
  }

  return duplicadas;
}

function montoACorregir(validaciones) {
  return validacionesDuplicadas(validaciones).reduce(
    (total, validacion) => total + validacion.valor,
    0
  );
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { validacionesDuplicadas, montoACorregir };
}
