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

module.exports = {
  bubbleSort,
  bubbleSortOriginal,
  porAnio
};
