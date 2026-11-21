const TITULOS = [
  "Caminos",
  "Sombras",
  "Memoria",
  "Viento",
  "Historia",
  "Silencio",
  "Frontera",
  "Jardín",
  "Ciudad",
  "Horizonte"
];

const COMPLEMENTOS = [
  "del sur",
  "en la lluvia",
  "sin nombre",
  "de papel",
  "eterna",
  "bajo las estrellas",
  "olvidada",
  "de invierno"
];

const NOMBRES = [
  "Ana",
  "Luis",
  "María",
  "Camilo",
  "Laura",
  "Andrés",
  "Sofia",
  "Mateo"
];

const APELLIDOS = [
  "García",
  "Rodríguez",
  "Martínez",
  "Torres",
  "Ramírez",
  "Vargas",
  "Castro",
  "Rojas"
];

function enteroAleatorio(maximo) {
  return Math.floor(Math.random() * maximo);
}

function generarCatalogo(n, opciones = {}) {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError("n debe ser un entero mayor o igual a 0");
  }

  const copiasRepetidas = opciones.copiasRepetidas === undefined
    ? 0
    : opciones.copiasRepetidas;

  if (!Number.isInteger(copiasRepetidas) || copiasRepetidas < 0) {
    throw new RangeError("copiasRepetidas debe ser un entero mayor o igual a 0");
  }

  const catalogo = [];
  const isbnsUsados = new Set();

  for (let i = 0; i < n; i += 1) {
    let isbn;

    do {
      const codigo = String(enteroAleatorio(10000000000)).padStart(10, "0");
      isbn = `978${codigo}`;
    } while (isbnsUsados.has(isbn));

    isbnsUsados.add(isbn);

    const titulo = `${TITULOS[enteroAleatorio(TITULOS.length)]} ${COMPLEMENTOS[enteroAleatorio(COMPLEMENTOS.length)]}`;
    const autor = `${NOMBRES[enteroAleatorio(NOMBRES.length)]} ${APELLIDOS[enteroAleatorio(APELLIDOS.length)]}`;

    catalogo.push({
      isbn,
      titulo,
      autor,
      año: 1900 + enteroAleatorio(127),
      prestamos: enteroAleatorio(501)
    });
  }

  if (copiasRepetidas > 0) {
    const copiasPermitidas = Math.min(copiasRepetidas, n);
    for (let i = 0; i < copiasPermitidas; i += 1) {
      const copia = catalogo[n - copiasPermitidas + i];
      copia.isbn = catalogo[i].isbn;
    }
  }

  return catalogo;
}

module.exports = { generarCatalogo };
