function normalizarTexto(texto) {
  if (typeof texto !== "string") return "";
  return texto.trim().toLowerCase();
}

function buscarPorTitulo(libros, titulo) {
  const tituloBuscado = normalizarTexto(titulo);
  let comparaciones = 0;

  for (let i = 0; i < libros.length; i += 1) {
    comparaciones += 1;

    if (normalizarTexto(libros[i].titulo) === tituloBuscado) {
      return {
        libro: libros[i],
        comparaciones
      };
    }
  }

  return {
    libro: null,
    comparaciones
  };
}

function buscarPorAutor(libros, autor) {
  const autorBuscado = normalizarTexto(autor);
  const coincidencias = [];

  for (let i = 0; i < libros.length; i += 1) {
    if (normalizarTexto(libros[i].autor) === autorBuscado) {
      coincidencias.push(libros[i]);
    }
  }

  return coincidencias;
}

function buscarPorPalabra(libros, palabra) {
  const palabraBuscada = normalizarTexto(palabra);
  const coincidencias = [];

  if (palabraBuscada === "") return coincidencias;

  for (let i = 0; i < libros.length; i += 1) {
    const tituloNormalizado = normalizarTexto(libros[i].titulo);

    if (tituloNormalizado.includes(palabraBuscada)) {
      coincidencias.push(libros[i]);
    }
  }

  return coincidencias;
}

module.exports = {
  normalizarTexto,
  buscarPorTitulo,
  buscarPorAutor,
  buscarPorPalabra
};
