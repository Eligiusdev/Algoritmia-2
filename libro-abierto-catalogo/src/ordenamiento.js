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

module.exports = {
  bubbleSort,
  bubbleSortOriginal,
  porAnio,
  porTitulo,
  porAutor,
  porAutorYTitulo,
  porPrestamosDesc,
  invertir,
  selectionSort,
  insertionSort,
  mezclar,
  mergeSort
};
