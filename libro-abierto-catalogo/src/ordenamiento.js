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

module.exports = {
  bubbleSort,
  bubbleSortOriginal,
  porAnio,
  selectionSort,
  insertionSort
};
