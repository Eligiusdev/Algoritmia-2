const { casiOrdenado } = require("./generador");
const {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSortMedianaTres,
  porAnio
} = require("./ordenamiento");

const tamaniosBasicos = [1000, 10000];
const tamaniosAvanzados = [1000, 10000, 100000];

function crearAleatorio(n) {
  let seed = 123456789;
  const libros = [];

  for (let i = 0; i < n; i += 1) {
    seed = (1103515245 * seed + 12345) % 2147483648;
    libros.push({
      isbn: `978${String(i).padStart(10, "0")}`,
      titulo: `Libro ${i}`,
      autor: "Autor",
      año: seed % 100000,
      prestamos: seed % 501
    });
  }

  return libros;
}

function crearEstados(n) {
  const ordenado = casiOrdenado(n, 0);
  const invertido = [...ordenado];

  for (let i = 0, j = invertido.length - 1; i < j; i += 1, j -= 1) {
    [invertido[i], invertido[j]] = [invertido[j], invertido[i]];
  }

  const cambios = Math.max(10, Math.floor(n / 100));
  return [
    ["Aleatorio", crearAleatorio(n)],
    ["Ordenado", ordenado],
    ["Invertido", invertido],
    ["Casi ordenado", casiOrdenado(n, cambios)]
  ];
}

function estaOrdenado(arreglo, comparar) {
  for (let i = 1; i < arreglo.length; i += 1) {
    if (comparar(arreglo[i - 1], arreglo[i]) > 0) return false;
  }
  return true;
}

function medir(fn, libros) {
  const inicio = process.hrtime.bigint();
  const resultado = fn([...libros], porAnio);
  const fin = process.hrtime.bigint();

  return {
    comparaciones: resultado.comparaciones,
    intercambios: resultado.intercambios,
    tiempoMs: Number(fin - inicio) / 1000000,
    estado: estaOrdenado(resultado.arreglo, porAnio) ? "OK" : "FALLA"
  };
}

console.log("=== LABORATORIO DE ORDENAMIENTO LIBRO ABIERTO v1.0 ===");

for (const n of tamaniosBasicos) {
  const filas = [];

  for (const [estadoDatos, libros] of crearEstados(n)) {
    const algoritmos = [
      ["Bubble Sort", bubbleSort],
      ["Selection Sort", selectionSort],
      ["Insertion Sort", insertionSort],
      ["Merge Sort", mergeSort],
      ["Quick Sort mediana de tres", quickSortMedianaTres]
    ];

    for (const [nombre, algoritmo] of algoritmos) {
      const resultado = medir(algoritmo, libros);
      filas.push({
        Estado: estadoDatos,
        n,
        Algoritmo: nombre,
        Comparaciones: resultado.comparaciones,
        Intercambios: resultado.intercambios,
        "Tiempo (ms)": resultado.tiempoMs.toFixed(3),
        Verificacion: resultado.estado
      });
    }
  }

  console.log(`\nTamaño básico n = ${n}`);
  console.table(filas);
}

for (const n of tamaniosAvanzados) {
  const filas = [];

  for (const [estadoDatos, libros] of crearEstados(n)) {
    for (const [nombre, algoritmo] of [
      ["Merge Sort", mergeSort],
      ["Quick Sort mediana de tres", quickSortMedianaTres]
    ]) {
      const resultado = medir(algoritmo, libros);
      filas.push({
        Estado: estadoDatos,
        n,
        Algoritmo: nombre,
        Comparaciones: resultado.comparaciones,
        Intercambios: resultado.intercambios,
        "Tiempo (ms)": resultado.tiempoMs.toFixed(3),
        Verificacion: resultado.estado
      });
    }
  }

  console.log(`\nTamaño avanzado n = ${n}`);
  console.table(filas);
}
