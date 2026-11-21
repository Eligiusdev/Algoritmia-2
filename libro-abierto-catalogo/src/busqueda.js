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

function ordenarPorIsbn(libros) {
  return libros.slice().sort((a, b) => a.isbn.localeCompare(b.isbn));
}

function buscarPorIsbn(librosOrdenados, isbn) {
  const isbnBuscado = typeof isbn === "string" ? isbn.trim() : "";
  let inicio = 0;
  let fin = librosOrdenados.length - 1;
  let comparaciones = 0;

  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);
    comparaciones += 1;
    const comparacion = isbnBuscado.localeCompare(librosOrdenados[medio].isbn);

    if (comparacion === 0) {
      return {
        libro: librosOrdenados[medio],
        comparaciones
      };
    }

    if (comparacion < 0) {
      fin = medio - 1;
    } else {
      inicio = medio + 1;
    }
  }

  return {
    libro: null,
    comparaciones
  };
}

function buscarPorIsbnRecursivo(librosOrdenados, isbn, inicio, fin) {
  const inicioBuscado = inicio === undefined ? 0 : inicio;
  const finBuscado = fin === undefined ? librosOrdenados.length - 1 : fin;
  const isbnBuscado = typeof isbn === "string" ? isbn.trim() : "";

  if (inicioBuscado > finBuscado) {
    return {
      libro: null,
      comparaciones: 0
    };
  }

  const medio = Math.floor((inicioBuscado + finBuscado) / 2);
  const comparacion = isbnBuscado.localeCompare(librosOrdenados[medio].isbn);

  if (comparacion === 0) {
    return {
      libro: librosOrdenados[medio],
      comparaciones: 1
    };
  }

  if (comparacion < 0) {
    const resultado = buscarPorIsbnRecursivo(
      librosOrdenados,
      isbnBuscado,
      inicioBuscado,
      medio - 1
    );
    return {
      libro: resultado.libro,
      comparaciones: 1 + resultado.comparaciones
    };
  }

  const resultado = buscarPorIsbnRecursivo(
    librosOrdenados,
    isbnBuscado,
    medio + 1,
    finBuscado
  );
  return {
    libro: resultado.libro,
    comparaciones: 1 + resultado.comparaciones
  };
}

function primeraPosicionIsbn(librosOrdenados, isbn, contador) {
  const isbnBuscado = typeof isbn === "string" ? isbn.trim() : "";
  let inicio = 0;
  let fin = librosOrdenados.length - 1;
  let primera = -1;

  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);
    if (contador) contador.comparaciones += 1;
    const comparacion = isbnBuscado.localeCompare(librosOrdenados[medio].isbn);

    if (comparacion === 0) {
      primera = medio;
      fin = medio - 1;
    } else if (comparacion < 0) {
      fin = medio - 1;
    } else {
      inicio = medio + 1;
    }
  }

  return primera;
}

module.exports = {
  normalizarTexto,
  buscarPorTitulo,
  buscarPorAutor,
  buscarPorPalabra,
  ordenarPorIsbn,
  buscarPorIsbn,
  buscarPorIsbnRecursivo,
  primeraPosicionIsbn
};
