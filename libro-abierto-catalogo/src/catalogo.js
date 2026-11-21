const { generarCatalogo } = require("./generador");
const {
  buscarPorTitulo,
  buscarPorAutor,
  buscarPorPalabra,
  ordenarPorIsbn,
  buscarPorIsbn,
  buscarPorIsbnRecursivo,
  primeraPosicionIsbn
} = require("./busqueda");

const catalogo = generarCatalogo(10000, { copiasRepetidas: 5 });
const catalogoOrdenado = ordenarPorIsbn(catalogo);

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

console.log("=== CATÁLOGO LIBRO ABIERTO v0.1 ===");
console.log(`Libros generados: ${catalogo.length}`);
console.log(`Libros ordenados por ISBN: ${catalogoOrdenado.length}\n`);

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

const consultaIsbn = catalogoOrdenado[Math.floor(catalogoOrdenado.length / 2)].isbn;
const resultadoIsbn = buscarPorIsbn(catalogoOrdenado, consultaIsbn);
console.log(`Consulta por ISBN: "${consultaIsbn}"`);
console.log("Algoritmo: búsqueda binaria iterativa");
console.log(`Resultado: ${resultadoIsbn.libro ? resultadoIsbn.libro.isbn : "null"}`);
console.log(`Comparaciones: ${resultadoIsbn.comparaciones}\n`);

const resultadoRecursivo = buscarPorIsbnRecursivo(catalogoOrdenado, consultaIsbn);
console.log(`Consulta recursiva por ISBN: "${consultaIsbn}"`);
console.log("Algoritmo: búsqueda binaria recursiva");
console.log(`Resultado: ${resultadoRecursivo.libro ? resultadoRecursivo.libro.isbn : "null"}`);
console.log(`Comparaciones: ${resultadoRecursivo.comparaciones}\n`);

let isbnRepetido = null;

for (let i = 0; i < catalogoOrdenado.length - 1; i += 1) {
  if (catalogoOrdenado[i].isbn === catalogoOrdenado[i + 1].isbn) {
    isbnRepetido = catalogoOrdenado[i];
    break;
  }
}

if (isbnRepetido) {
  const contador = { comparaciones: 0 };
  const posicion = primeraPosicionIsbn(catalogoOrdenado, isbnRepetido.isbn, contador);
  let copias = 0;

  if (posicion >= 0) {
    for (let i = posicion; i < catalogoOrdenado.length; i += 1) {
      if (catalogoOrdenado[i].isbn === isbnRepetido.isbn) {
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
