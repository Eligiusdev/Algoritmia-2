const { generarCatalogo } = require("./generador");

const catalogo = generarCatalogo(10000);

console.log("=== EXPLORACIÓN DEL CATÁLOGO GENERADO ===\n");
console.log("Primeros 5 libros:");
console.table(catalogo.slice(0, 5));

const añoMasAntiguo = Math.min(...catalogo.map((libro) => libro.año));
const añoMasReciente = Math.max(...catalogo.map((libro) => libro.año));
const totalPrestamos = catalogo.reduce((total, libro) => total + libro.prestamos, 0);

console.log("\nAño más antiguo:", añoMasAntiguo);
console.log("Año más reciente:", añoMasReciente);
console.log("Total de préstamos:", totalPrestamos);
