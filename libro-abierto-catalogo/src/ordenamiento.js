function bubbleSort(arreglo, comparar) {
  const copia = [...arreglo];
  let comparaciones = 0;
  let intercambios = 0;

  for (let i = 0; i < copia.length - 1; i += 1) {
    let huboIntercambio = false;

    for (let j = 0; j < copia.length - 1 - i; j += 1) {
      comparaciones += 1;

      if (comparar(copia[j], copia[j + 1]) > 0) {
        [copia[j], copia[j + 1]] = [copia[j + 1], copia[j]];
        intercambios += 1;
        huboIntercambio = true;
      }
    }

    if (!huboIntercambio) break;
  }

  return {
    arreglo: copia,
    comparaciones,
    intercambios
  };
}

function bubbleSortOriginal(arreglo, comparar) {
  const copia = [...arreglo];
  let comparaciones = 0;
  let intercambios = 0;

  for (let i = 0; i < copia.length - 1; i += 1) {
    for (let j = 0; j < copia.length - 1 - i; j += 1) {
      comparaciones += 1;

      if (comparar(copia[j], copia[j + 1]) > 0) {
        [copia[j], copia[j + 1]] = [copia[j + 1], copia[j]];
        intercambios += 1;
      }
    }
  }

  return {
    arreglo: copia,
    comparaciones,
    intercambios
  };
}

function porAnio(a, b) {
  return a.año - b.año;
}

function porIsbn(a, b) {
  return a.isbn.localeCompare(b.isbn, "es", {
    numeric: true,
    sensitivity: "base"
  });
}

function porTitulo(a, b) {
  return a.titulo.localeCompare(b.titulo, "es", {
    sensitivity: "base"
  });
}

function porAutor(a, b) {
  return a.autor.localeCompare(b.autor, "es", {
    sensitivity: "base"
  });
}

function porAutorYTitulo(a, b) {
  const porAutor = a.autor.localeCompare(b.autor, "es", {
    sensitivity: "base"
  });

  if (porAutor !== 0) return porAutor;

  return a.titulo.localeCompare(b.titulo, "es", {
    sensitivity: "base"
  });
}

function porPrestamosDesc(a, b) {
  return b.prestamos - a.prestamos;
}

function topPrestados(libros, k) {
  if (!Number.isInteger(k) || k <= 0) return [];

  const resultado = mergeSort(libros, porPrestamosDesc);
  return resultado.arreglo.slice(0, k);
}

function topPrestadosSeleccion(libros, k) {
  if (!Number.isInteger(k) || k <= 0) return [];

  const copia = [...libros];
  const cantidad = Math.min(k, copia.length);

  for (let i = 0; i < cantidad; i += 1) {
    let indiceMaximo = i;

    for (let j = i + 1; j < copia.length; j += 1) {
      if (porPrestamosDesc(copia[j], copia[indiceMaximo]) < 0) {
        indiceMaximo = j;
      }
    }

    if (indiceMaximo !== i) {
      [copia[i], copia[indiceMaximo]] = [copia[indiceMaximo], copia[i]];
    }
  }

  return copia.slice(0, cantidad);
}

function ordenarPorTitulo(libros) {
  return mergeSort(libros, porTitulo).arreglo;
}

function invertir(comparar) {
  return (a, b) => comparar(b, a);
}

function selectionSort(arreglo, comparar) {
  const copia = [...arreglo];
  let comparaciones = 0;
  let intercambios = 0;

  for (let i = 0; i < copia.length - 1; i += 1) {
    let minimo = i;

    for (let j = i + 1; j < copia.length; j += 1) {
      comparaciones += 1;
      if (comparar(copia[j], copia[minimo]) < 0) {
        minimo = j;
      }
    }

    if (minimo !== i) {
      [copia[i], copia[minimo]] = [copia[minimo], copia[i]];
      intercambios += 1;
    }
  }

  return {
    arreglo: copia,
    comparaciones,
    intercambios
  };
}

function insertionSort(arreglo, comparar) {
  const copia = [...arreglo];
  let comparaciones = 0;
  let intercambios = 0;

  for (let i = 1; i < copia.length; i += 1) {
    const actual = copia[i];
    let j = i - 1;

    while (j >= 0) {
      comparaciones += 1;

      if (comparar(copia[j], actual) <= 0) break;

      copia[j + 1] = copia[j];
      intercambios += 1;
      j -= 1;
    }

    copia[j + 1] = actual;
  }

  return {
    arreglo: copia,
    comparaciones,
    intercambios
  };
}

function mezclar(izquierda, derecha, comparar) {
  const resultado = [];
  let i = 0;
  let j = 0;
  let comparaciones = 0;

  while (i < izquierda.length && j < derecha.length) {
    comparaciones += 1;

    if (comparar(izquierda[i], derecha[j]) <= 0) {
      resultado.push(izquierda[i]);
      i += 1;
    } else {
      resultado.push(derecha[j]);
      j += 1;
    }
  }

  while (i < izquierda.length) {
    resultado.push(izquierda[i]);
    i += 1;
  }

  while (j < derecha.length) {
    resultado.push(derecha[j]);
    j += 1;
  }

  return {
    arreglo: resultado,
    comparaciones
  };
}

function mergeSort(arreglo, comparar) {
  let comparaciones = 0;

  function dividir(elementos) {
    if (elementos.length <= 1) return [...elementos];

    const medio = Math.floor(elementos.length / 2);
    const izquierda = dividir(elementos.slice(0, medio));
    const derecha = dividir(elementos.slice(medio));
    const mezcla = mezclar(izquierda, derecha, comparar);
    comparaciones += mezcla.comparaciones;

    return mezcla.arreglo;
  }

  return {
    arreglo: dividir(arreglo),
    comparaciones,
    intercambios: 0
  };
}

function particion(arreglo, inicio, fin, comparar, contador) {
  const pivote = arreglo[fin];
  let i = inicio - 1;

  for (let j = inicio; j < fin; j += 1) {
    if (contador) contador.comparaciones += 1;

    if (comparar(arreglo[j], pivote) <= 0) {
      i += 1;
      if (i !== j) {
        [arreglo[i], arreglo[j]] = [arreglo[j], arreglo[i]];
        if (contador) contador.intercambios += 1;
      }
    }
  }

  if (i + 1 !== fin) {
    [arreglo[i + 1], arreglo[fin]] = [arreglo[fin], arreglo[i + 1]];
    if (contador) contador.intercambios += 1;
  }

  return i + 1;
}

function quickSort(arreglo, comparar) {
  const copia = [...arreglo];
  const contador = { comparaciones: 0, intercambios: 0 };

  function ordenar(inicio, fin) {
    while (inicio < fin) {
      const pivote = particion(copia, inicio, fin, comparar, contador);

      if (pivote - inicio < fin - pivote) {
        ordenar(inicio, pivote - 1);
        inicio = pivote + 1;
      } else {
        ordenar(pivote + 1, fin);
        fin = pivote - 1;
      }
    }
  }

  ordenar(0, copia.length - 1);

  return {
    arreglo: copia,
    comparaciones: contador.comparaciones,
    intercambios: contador.intercambios
  };
}

function medianaDeTres(arreglo, inicio, fin, comparar, contador) {
  const medio = Math.floor((inicio + fin) / 2);
  const valores = [inicio, medio, fin];

  if (contador) contador.comparaciones += 1;
  if (comparar(arreglo[valores[0]], arreglo[valores[1]]) > 0) {
    [valores[0], valores[1]] = [valores[1], valores[0]];
  }
  if (contador) contador.comparaciones += 1;
  if (comparar(arreglo[valores[1]], arreglo[valores[2]]) > 0) {
    [valores[1], valores[2]] = [valores[2], valores[1]];
  }
  if (contador) contador.comparaciones += 1;
  if (comparar(arreglo[valores[0]], arreglo[valores[1]]) > 0) {
    [valores[0], valores[1]] = [valores[1], valores[0]];
  }

  return valores[1];
}

function quickSortMedianaTres(arreglo, comparar) {
  const copia = [...arreglo];
  const contador = { comparaciones: 0, intercambios: 0 };

  function ordenar(inicio, fin) {
    while (inicio < fin) {
      const indiceMediana = medianaDeTres(copia, inicio, fin, comparar, contador);
      if (indiceMediana !== fin) {
        [copia[indiceMediana], copia[fin]] = [copia[fin], copia[indiceMediana]];
        contador.intercambios += 1;
      }

      const pivote = particion(copia, inicio, fin, comparar, contador);

      if (pivote - inicio < fin - pivote) {
        ordenar(inicio, pivote - 1);
        inicio = pivote + 1;
      } else {
        ordenar(pivote + 1, fin);
        fin = pivote - 1;
      }
    }
  }

  ordenar(0, copia.length - 1);

  return {
    arreglo: copia,
    comparaciones: contador.comparaciones,
    intercambios: contador.intercambios
  };
}

module.exports = {
  bubbleSort,
  bubbleSortOriginal,
  porAnio,
  porIsbn,
  porTitulo,
  porAutor,
  porAutorYTitulo,
  porPrestamosDesc,
  topPrestados,
  topPrestadosSeleccion,
  ordenarPorTitulo,
  invertir,
  selectionSort,
  insertionSort,
  mezclar,
  mergeSort,
  particion,
  quickSort,
  quickSortMedianaTres
};
