const { generarCatalogo } = require("./generador");
const {
  buscarPorTitulo,
  buscarPorAutor,
  buscarPorPalabra,
  buscarPorIsbn,
  buscarPorIsbnRecursivo,
  primeraPosicionIsbn,
  autocompletar,
  normalizarTexto
} = require("./busqueda");
const {
  mergeSort,
  porIsbn,
  porTitulo,
  porAnio,
  porPrestamosDesc,
  bubbleSort,
  topPrestados
} = require("./ordenamiento");

const catalogo = generarCatalogo(10000, { copiasRepetidas: 5 });
const catalogoOrdenadoPorIsbn = mergeSort(catalogo, porIsbn).arreglo;
const catalogoOrdenadoPorTitulo = mergeSort(catalogo, porTitulo).arreglo;

function tituloDisponible() {
  return catalogo[0].titulo;
}

function autorDisponible() {
  return catalogo[0].autor;
}

function palabraDisponible() {
  const titulo = catalogo[0].titulo;
  const palabras = titulo.split(" ");
  return palabras[Math.floor(palabras.length / 2)];
}

console.log("=== CATÁLOGO LIBRO ABIERTO v1.0 ===");
console.log(`Libros generados: ${catalogo.length}`);
console.log(`Libros ordenados por ISBN: ${catalogoOrdenadoPorIsbn.length}`);
console.log(`Libros ordenados por título: ${catalogoOrdenadoPorTitulo.length}\n`);

const consultaTitulo = tituloDisponible();
const resultadoTitulo = buscarPorTitulo(catalogo, consultaTitulo);
console.log(`Consulta por título: "${consultaTitulo}"`);
console.log("Algoritmo: búsqueda lineal");
console.log(`Resultado: ${resultadoTitulo.libro ? resultadoTitulo.libro.titulo : "null"}`);
console.log(`Comparaciones: ${resultadoTitulo.comparaciones}\n`);

const consultaAutor = autorDisponible();
const resultadoAutor = buscarPorAutor(catalogo, consultaAutor);
console.log(`Consulta por autor: "${consultaAutor}"`);
console.log("Algoritmo: búsqueda lineal (recorrido completo)");
console.log(`Resultado: ${resultadoAutor.length} libro(s)`);
console.log(`Comparaciones: ${catalogo.length}\n`);

const consultaPalabra = palabraDisponible();
const resultadoPalabra = buscarPorPalabra(catalogo, consultaPalabra);
console.log(`Consulta por palabra: "${consultaPalabra}"`);
console.log("Algoritmo: búsqueda lineal");
console.log(`Resultado: ${resultadoPalabra.length} libro(s)`);
console.log(`Comparaciones: ${catalogo.length}\n`);

const consultaIsbn = catalogoOrdenadoPorIsbn[Math.floor(catalogoOrdenadoPorIsbn.length / 2)].isbn;
const resultadoIsbn = buscarPorIsbn(catalogoOrdenadoPorIsbn, consultaIsbn);
console.log(`Consulta por ISBN: "${consultaIsbn}"`);
console.log("Algoritmo: búsqueda binaria iterativa");
console.log(`Resultado: ${resultadoIsbn.libro ? resultadoIsbn.libro.isbn : "null"}`);
console.log(`Comparaciones: ${resultadoIsbn.comparaciones}\n`);

const resultadoRecursivo = buscarPorIsbnRecursivo(catalogoOrdenadoPorIsbn, consultaIsbn);
console.log(`Consulta recursiva por ISBN: "${consultaIsbn}"`);
console.log("Algoritmo: búsqueda binaria recursiva");
console.log(`Resultado: ${resultadoRecursivo.libro ? resultadoRecursivo.libro.isbn : "null"}`);
console.log(`Comparaciones: ${resultadoRecursivo.comparaciones}\n`);

let isbnRepetido = null;

for (let i = 0; i < catalogoOrdenadoPorIsbn.length - 1; i += 1) {
  if (catalogoOrdenadoPorIsbn[i].isbn === catalogoOrdenadoPorIsbn[i + 1].isbn) {
    isbnRepetido = catalogoOrdenadoPorIsbn[i];
    break;
  }
}

if (isbnRepetido) {
  const contador = { comparaciones: 0 };
  const posicion = primeraPosicionIsbn(catalogoOrdenadoPorIsbn, isbnRepetido.isbn, contador);
  let copias = 0;

  if (posicion >= 0) {
    for (let i = posicion; i < catalogoOrdenadoPorIsbn.length; i += 1) {
      if (catalogoOrdenadoPorIsbn[i].isbn === isbnRepetido.isbn) {
        copias += 1;
      } else {
        break;
      }
    }
  }

  console.log(`Consulta por ISBN repetido: "${isbnRepetido.isbn}"`);
  console.log("Algoritmo: búsqueda binaria de primera ocurrencia");
  console.log(`Primera posición: ${posicion}`);
  console.log(`Copias encontradas: ${copias}`);
  console.log(`Comparaciones: ${contador.comparaciones}\n`);
} else {
  console.log("Consulta por ISBN repetido: no se generaron copias");
  console.log("Comparaciones: 0\n");
}

const ranking = topPrestados(catalogo, 10);
console.log("Top 10 de libros más prestados:");
for (let i = 0; i < ranking.length; i += 1) {
  console.log(`${i + 1}. ${ranking[i].titulo} — ${ranking[i].prestamos} préstamos`);
}
console.log("Algoritmo: Merge Sort por préstamos descendentes\n");

const frecuenciasPrefijo = {};
for (let i = 0; i < catalogoOrdenadoPorTitulo.length; i += 1) {
  const titulo = normalizarTexto(catalogoOrdenadoPorTitulo[i].titulo);
  if (titulo.length < 2) continue;
  const prefijo = titulo.slice(0, 2);
  frecuenciasPrefijo[prefijo] = (frecuenciasPrefijo[prefijo] || 0) + 1;
}

let prefijoFrecuente = "";
let mayorFrecuencia = 0;
for (const prefijo in frecuenciasPrefijo) {
  if (frecuenciasPrefijo[prefijo] > mayorFrecuencia) {
    mayorFrecuencia = frecuenciasPrefijo[prefijo];
    prefijoFrecuente = prefijo;
  }
}

let prefijoUnico = "";
const tituloUnico = catalogoOrdenadoPorTitulo[0].titulo;
const tituloUnicoNormalizado = normalizarTexto(tituloUnico);
for (let i = 2; i <= tituloUnicoNormalizado.length; i += 1) {
  const candidato = tituloUnicoNormalizado.slice(0, i);
  const titulosDistintos = new Set();

  for (let j = 0; j < catalogoOrdenadoPorTitulo.length; j += 1) {
    const titulo = normalizarTexto(catalogoOrdenadoPorTitulo[j].titulo);
    if (titulo.startsWith(candidato)) titulosDistintos.add(titulo);
  }

  if (titulosDistintos.size === 1) {
    prefijoUnico = candidato;
    break;
  }
}
if (prefijoUnico === "") prefijoUnico = tituloUnicoNormalizado;

const prefijos = [prefijoFrecuente, prefijoUnico, "zzzzzz"];
console.log("Autocompletar:");
for (let i = 0; i < prefijos.length; i += 1) {
  const sugerencias = autocompletar(catalogoOrdenadoPorTitulo, prefijos[i], 5);
  console.log(`"${prefijos[i]}": ${sugerencias.length} resultado(s)`);
  for (let j = 0; j < sugerencias.length; j += 1) {
    console.log(`  - ${sugerencias[j].titulo}`);
  }
}
console.log("Algoritmo: búsqueda binaria de prefijo + recorrido acotado\n");

const exhibicion = bubbleSort(catalogoOrdenadoPorTitulo, porAnio).arreglo;
console.log("Exhibición “Un siglo de literatura colombiana”:");
for (let i = 0; i < Math.min(10, exhibicion.length); i += 1) {
  console.log(`${exhibicion[i].año} — ${exhibicion[i].titulo}`);
}
console.log("Algoritmo: Bubble Sort por año\n");
