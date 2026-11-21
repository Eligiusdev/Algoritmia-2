# Bitácora

## Modelo de datos

El catálogo representa cada libro como un arreglo de objetos. Las propiedades son `isbn`, `titulo`, `autor`, `año` y `prestamos`.

El ISBN se almacena como texto (`string`) porque es un identificador, no una cantidad. Aunque contiene números, no se usa en operaciones aritméticas. Además, conservarlo como texto evita perder ceros iniciales y permite búsquedas exactas. Por eso, por ejemplo, `"9789584295125"` nunca se convierte a número.

## Generador

El generador `generarCatalogo(n)` crea n objetos y garantiza ISBN únicos mediante un `Set`. Cada ISBN tiene el prefijo `978` y diez dígitos finales generados y completados con ceros mediante `padStart(10, "0")`, para totalizar 13 caracteres.

## Verificación de ISBN únicos

Para comprobarlo se ejecutó el generador con `n = 10.000` y se insertaron todos los ISBN en un `Set`. La cantidad de elementos del `Set` se comparó con la longitud del catálogo. Al obtener `10.000` elementos para `10.000` libros, se confirmó que no hay duplicados.

Comando de ejemplo:

```bash
node -e "const { generarCatalogo } = require('./src/generador'); const libros = generarCatalogo(10000); const isbn = new Set(libros.map(l => l.isbn)); console.log(libros.length, isbn.size);"
```

## Consultas previstas para la red

- **Por título:** puede devolver varios libros si varios títulos coinciden o comparten el mismo nombre, por lo que es una consulta de uno o varios resultados.
- **Por autor:** puede devolver varios libros, porque un autor puede haber escrito más de una obra.
- **Por ISBN:** debe devolver un solo libro, ya que el ISBN identifica de forma única cada ejemplar del catálogo generado.
