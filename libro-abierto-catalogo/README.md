# Libro Abierto - Catálogo

Proyecto base para modelar un catálogo de libros y generar datos de prueba para algoritmos de búsqueda.

## Modelo

Cada libro es un objeto con las propiedades `isbn`, `titulo`, `autor`, `año` y `prestamos`.

## Ejecución

Genera y explora un catálogo de 10.000 libros:

```bash
node src/explorar.js
```

Los datos de muestra se encuentran en `src/muestra.js` y el generador en `src/generador.js`.
