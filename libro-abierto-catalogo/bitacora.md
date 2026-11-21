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

## Búsqueda lineal

`buscarPorTitulo` normaliza el título buscado y el título de cada libro con `trim()` y `toLowerCase()`. Así, mayúsculas sobrantes y espacios al inicio o al final no afectan la coincidencia exacta. Para cada elemento revisado incrementa el contador de comparaciones y usa retorno temprano al encontrar el primer libro.

`buscarPorAutor` compara en una sola pasada y guarda todas las coincidencias. Siempre recorre el catálogo completo: no puede saber si aparecerán más coincidencias después del primer autor encontrado. Por eso el mejor caso en cantidad de recorridos sigue siendo lineal, O(n), y no tiene retorno temprano.

`buscarPorPalabra` normaliza ambos textos y aplica `includes` únicamente sobre la cadena del título. Comprueba cada libro con un ciclo `for` y conserva aquellos cuyo título contiene la palabra.

La búsqueda lineal solo es la única opción práctica cuando no existe una estructura de indexación o ordenamiento previo para el campo consultado. Si el arreglo estuviera ordenado por título y se pudiera aplicar búsqueda binaria, o si existiera un índice adicional, se podrían reducir las comparaciones. En este catálogo el campo no está indexado ni ordenado, por lo que recorrerlo es necesario.

### Mediciones de comparaciones por título

La medición usa catálogos generados con `generarCatalogo(n)`. El caso promedio corresponde al índice central sin distinguir si el elemento coincide: para una búsqueda uniforme en arreglos no encontrados ni extraordinariamente sesgados, se espera revisar aproximadamente `(n + 1) / 2` elementos.

| Tamaño n | Primer libro | Libro del medio | Último libro | Libro inexistente |
|---:|---:|---:|---:|---:|
| 100 | 1 | 51 | 100 | 100 |
| 1.000 | 1 | 501 | 1.000 | 1.000 |
| 10.000 | 1 | 5.001 | 10.000 | 10.000 |

- Mejor caso: **O(1)**, cuando el título coincide en la primera posición.
- Caso promedio: **O(n)**, cuando el elemento se encuentra cerca del centro: aproximadamente `n / 2` comparaciones.
- Peor caso: **O(n)**, cuando coincide al final o no existe: `n` comparaciones.

### Traza para `Delirio` en la muestra de 8 libros

La búsqueda normaliza “Delirio” y compara secuencialmente por índice:

1. `"Cien años de soledad"`: no coincide.
2. `"La vorágine"`: no coincide.
3. `"El olvido que seremos"`: no coincide.
4. `"Delirio"`: coincide; se devuelve el libro y finaliza.

Total: **4 comparaciones**. Se puede comprobar con:

```bash
node -e "const muestra=require('./src/muestra'); const {buscarPorTitulo}=require('./src/busqueda'); console.log(buscarPorTitulo(muestra,'  DELIRIO  '));"
```
