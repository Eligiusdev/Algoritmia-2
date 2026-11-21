const { casiOrdenado } = require("./generador");
const {
  bubbleSort,
  selectionSort,
  insertionSort,
  porAnio
} = require("./ordenamiento");

const tamanios = [500, 1000, 2000, 4000];

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
  const milisegundos = Number(fin - inicio) / 1000000;

  const estado = estaOrdenado(resultado.arreglo, porAnio) ? "OK" : "FALLA";

  return {
    comparaciones: resultado.comparaciones,
    intercambios: resultado.intercambios,
    tiempoMs: milisegundos,
    estado
  };
}

function medirSort(libros) {
  const copia = [...libros];
  const inicio = process.hrtime.bigint();
  copia.sort((a, b) => porAnio(a, b));
  const fin = process.hrtime.bigint();

  return {
    comparaciones: "-",
    intercambios: "-",
    tiempoMs: Number(fin - inicio) / 1000000,
    estado: estaOrdenado(copia, porAnio) ? "OK" : "FALLA"
  };
}

console.log("=== LABORATORIO DE ORDENAMIENTO LIBRO ABIERTO v0.2 ===");

for (const n of tamanios) {
  const filas = [];
  const estados = crearEstados(n);

  for (const [estadoDatos, libros] of estados) {
    const bubble = medir(bubbleSort, libros);
    const selection = medir(selectionSort, libros);
    const insertion = medir(insertionSort, libros);
    const sortNativo = medirSort(libros);

    filas.push({
      Estado: estadoDatos,
      n,
      Algoritmo: "Bubble Sort",
      Comparaciones: bubble.comparaciones,
      Intercambios: bubble.intercambios,
      "Tiempo (ms)": bubble.tiempoMs.toFixed(3),
      Verificacion: bubble.estado
    });
    filas.push({
      Estado: estadoDatos,
      n,
      Algoritmo: "Selection Sort",
      Comparaciones: selection.comparaciones,
      Intercambios: selection.intercambios,
      "Tiempo (ms)": selection.tiempoMs.toFixed(3),
      Verificacion: selection.estado
    });
    filas.push({
      Estado: estadoDatos,
      n,
      Algoritmo: "Insertion Sort",
      Comparaciones: insertion.comparaciones,
      Intercambios: insertion.intercambios,
      "Tiempo (ms)": insertion.tiempoMs.toFixed(3),
      Verificacion: insertion.estado
    });
    filas.push({
      Estado: estadoDatos,
      n,
      Algoritmo: "sort",
      Comparaciones: sortNativo.comparaciones,
      Intercambios: sortNativo.intercambios,
      "Tiempo (ms)": sortNativo.tiempoMs.toFixed(3),
      Verificacion: sortNativo.estado
    });
  }

  console.log(`\nTamaño n = ${n}`);
  console.table(filas);
}
