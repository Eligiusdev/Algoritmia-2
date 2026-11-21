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

## Búsqueda binaria por ISBN

El catálogo se ordena una sola vez por ISBN mediante una copia:

```js
const ordenados = ordenarPorIsbn(libros);
```

`sort((a, b) => a.isbn.localeCompare(b.isbn))` no modifica el arreglo original porque `ordenarPorIsbn` comienza con `libros.slice()`. Las versiones iterativa y recursiva reciben este arreglo ordenado y cuentan una comparación por cada elemento medio revisado.

### Traza de la muestra ordenada

Primero se ordenó la muestra por ISBN. El arreglo queda así:

| inicio | medio | fin | ISBN del medio |
|---:|---:|---:|---|
| 0 | 3 | 7 | 9789584295125 |
| 4 | 5 | 7 | 9789587434477 |
| 4 | 4 | 4 | 9789587047462 |

La tabla anterior corresponde a la búsqueda de `9789587047462` (“Delirio”):

1. Con `inicio = 0`, `fin = 7`, `medio = 3`; `9789587047462` es mayor que `9789584295125`, así que cambia a `inicio = 4`.
2. Con `inicio = 4`, `fin = 7`, `medio = 5`; `9789587047462` es menor que `9789587434477`, así que cambia a `fin = 4`.
3. Con `inicio = fin = 4`, `medio = 4`; coincide el ISBN y devuelve el libro.

Total: **3 comparaciones**.

Para buscar el ISBN inexistente `9789585000000`:

| Paso | inicio | fin | medio | Comparación con el medio |
|---:|---:|---:|---:|---|
| 1 | 0 | 7 | 3 | `9789585000000` es mayor que `9789584295125` |
| 2 | 4 | 7 | 5 | es menor que `9789587434477` |
| 3 | 4 | 4 | 4 | es menor que `9789587047462` |

Después del paso 3 queda `inicio = 4` y `fin = 3`; se termina y devuelve `null`. También fueron **3 comparaciones**.

Se verifican ambas implementaciones con:

```bash
node -e "const m=require('./src/muestra'); const b=require('./src/busqueda'); const o=b.ordenarPorIsbn(m); for(const i of ['9789587047462','9789585000000']) console.log(i,b.buscarPorIsbn(o,i),b.buscarPorIsbnRecursivo(o,i));"
```

### Comparación lineal frente a binaria

Los máximos teóricos de la búsqueda binaria se calculan con `Math.ceil(Math.log2(n + 1))`. Así, una búsqueda binaria sobre 1.000.000 de elementos necesita como máximo 20 comparaciones y nunca las supera.

| Tamaño n | Lineal promedio | Lineal peor | Binaria máximo teórico |
|---:|---:|---:|---:|
| 1.000 | 500 | 1.000 | 10 |
| 10.000 | 5.000 | 10.000 | 14 |
| 1.000.000 | 500.000 | 1.000.000 | 20 |

La lineal puede encontrar el primer elemento en una comparación, pero su peor caso crece proporcionalmente a `n`, por eso es O(n). La binaria divide el intervalo a la mitad en cada paso, por eso es O(log n). En el peor caso binario se mantiene muy por debajo de la lineal para los catálogos grandes.

### Por qué el catálogo debe estar ordenado

La muestra original no está ordenada por ISBN. Por ejemplo, si se busca `9789584264879` (“Rosario Tijeras”), la versión binaria compara primero el elemento del índice 3, `9789587047462`:

1. `9789584264879 < 9789587047462`, por lo que descarta los índices `4` a `7`, incluidos varios elementos.
2. En el subarreglo restante vuelve a descartar posiciones sin considerar que “Rosario Tijeras” está en el índice 4 del arreglo original.

El resultado no es fiable y puede devolver `null` aunque el ISBN exista. Por eso también se demuestra con esta búsqueda sobre la muestra original:

```bash
node -e "const m=require('./src/muestra'); const b=require('./src/busqueda'); console.log(b.buscarPorIsbn(m,'9789584264879'));"
```

## Tabla de decisión del buscador integrado

| Tipo de consulta | ¿Los datos están ordenados por ese campo? | Algoritmo elegido | Complejidad |
|---|---|---|---|
| Título exacto | No | Búsqueda lineal con retorno temprano | O(n) peor caso; O(1) mejor caso |
| Autor | No | Búsqueda lineal completa | O(n) |
| Palabra en el título | No | Búsqueda lineal completa | O(n) |
| ISBN único | Sí, por una copia ordenada | Búsqueda binaria iterativa o recursiva | O(log n) |
| Todas las copias de un ISBN | Sí, por una copia ordenada | Primera ocurrencia binaria y recorrido hacia la derecha | O(log n + k), donde k es el número de copias |

El título, el autor y la palabra no tienen índice ni arreglo ordenado en esta versión, por lo que recorrer el catálogo es la opción adecuada. El ISBN sí está preparado en una copia ordenada, por lo que se usa búsqueda binaria. La variante de primera ocurrencia es necesaria porque una coincidencia binaria normal puede devolver cualquier copia del mismo ISBN.

## Integración y copias repetidas

El generador acepta `{ copiasRepetidas: c }`. Al generar `n` libros, reemplaza hasta `c` posiciones finales por ISBN ya existentes. Así mantiene el tamaño solicitado y permite probar copias de sedes sin modificar el comportamiento predeterminado.

`src/catalogo.js` genera 10.000 libros y una copia ordenada con `sort`. Después muestra consultas por título, autor, palabra e ISBN, ambas formas binarias y la búsqueda de todas las copias. Para ISBN repetidos, `primeraPosicionIsbn` conserva el extremo izquierdo donde coincide y cuenta las copias recorriendo desde esa posición hacia la derecha hasta que cambia el ISBN.

## Bubble Sort por año

`bubbleSort(arreglo, comparar)` crea una copia mediante `[...arreglo]`, recorre pares adyacentes y usa desestructuración para intercambiar los elementos cuando `comparar(a, b) > 0`. Devuelve `{ arreglo, comparaciones, intercambios }`.

`porAnio(a, b)` devuelve `a.año - b.año`, de modo que Bubble Sort presenta los libros desde el año más antiguo hasta el más reciente. La muestra queda ordenada desde 1924 hasta 2007.

La versión optimizada registra si hubo intercambios en una pasada. Si no hubo ninguno, termina antes porque el arreglo ya está ordenado.

### Traza de las dos primeras pasadas

Años iniciales:

```text
[1967, 1924, 2006, 2004, 1999, 2007, 1988, 2002]
```

**Primera pasada:** se comparan los pares adyacentes hasta llevar el mayor elemento al final.

```text
Antes: [1967, 1924, 2006, 2004, 1999, 2007, 1988, 2002]
j=0:   [1924, 1967, 2006, 2004, 1999, 2007, 1988, 2002]
j=2:   [1924, 1967, 2004, 2006, 1999, 2007, 1988, 2002]
j=3:   [1924, 1967, 2004, 1999, 2006, 2007, 1988, 2002]
j=5:   [1924, 1967, 2004, 1999, 2006, 1988, 2007, 2002]
j=6:   [1924, 1967, 2004, 1999, 2006, 1988, 2002, 2007]
```

Realiza 7 comparaciones y 5 intercambios.

**Segunda pasada:** como `2007` ya está al final, se revisan las posiciones 0 a 6.

```text
Antes: [1924, 1967, 2004, 1999, 2006, 1988, 2002, 2007]
j=2:   [1924, 1967, 1999, 2004, 2006, 1988, 2002, 2007]
j=4:   [1924, 1967, 1999, 2004, 1988, 2006, 2002, 2007]
j=5:   [1924, 1967, 1999, 2004, 1988, 2002, 2006, 2007]
```

Realiza 6 comparaciones y 3 intercambios.

### Mediciones con 1.000 libros

Se midieron tres arreglos con objetos que tienen `año`: aleatorio determinista generado con el generador lineal congruencial `seed = (1103515245 * seed + 12345) mod 2147483648`, ya ordenado y invertido. `bubbleSortOriginal` conserva el recorrido completo de todas las pasadas; `bubbleSort` termina cuando una pasada no produce intercambios.

| Estado | Versión | Comparaciones | Intercambios |
|---|---|---:|---:|
| Aleatorio | Original | 499.500 | 257.416 |
| Aleatorio | Optimizada | 498.465 | 257.416 |
| Ya ordenado | Original | 499.500 | 0 |
| Ya ordenado | Optimizada | 999 | 0 |
| Invertido | Original | 499.500 | 499.500 |
| Invertido | Optimizada | 499.500 | 499.500 |

El mejor caso de la versión optimizada es un arreglo ya ordenado: hace `n - 1 = 999` comparaciones y ningún intercambio, por lo que es O(n). El peor caso, como el arreglo invertido, conserva ambos componentes como sumas cuadráticas: comparaciones e intercambios son O(n²). Bubble Sort completo siempre mantiene una complejidad temporal O(n²) incluso si el arreglo está ordenado, por eso la optimización solo mejora el mejor caso.

## Selection Sort e Insertion Sort

`selectionSort(arreglo, comparar)` recorre el arreglo para encontrar el menor elemento de cada sufijo y realiza como máximo un intercambio por pasada. `insertionSort(arreglo, comparar)` toma cada elemento y lo desplaza hacia la izquierda mientras el elemento anterior sea mayor.

Ambos crean una copia con `[...arreglo]`; no modifican el arreglo recibido.

### Traza de Selection Sort

Arreglo inicial:

```text
[2006, 1967, 2004, 1924, 1999]
```

1. Pasada `i = 0`: el mínimo es `1924`; intercambia con `2006`.
   Resultado: `[1924, 1967, 2004, 2006, 1999]`
2. Pasada `i = 1`: el mínimo del sufijo es `1967`; ya está en la posición correcta.
   Resultado: `[1924, 1967, 2004, 2006, 1999]`
3. Pasada `i = 2`: el mínimo es `1999`; intercambia con `2004`.
   Resultado: `[1924, 1967, 1999, 2006, 2004]`
4. Pasada `i = 3`: el mínimo del sufijo es `2004`; intercambia con `2006`.
   Resultado: `[1924, 1967, 1999, 2004, 2006]`

Después de las cuatro pasadas, no quedan elementos fuera de su posición. Esta traza usa 10 comparaciones y 3 intercambios.

### Traza de Insertion Sort

Arreglo inicial:

```text
[2006, 1967, 2004, 1924, 1999]
```

1. Inserta `1967`: `[1967, 2006, 2004, 1924, 1999]`
2. Inserta `2004`: `[1967, 2004, 2006, 1924, 1999]`
3. Inserta `1924`: `[1924, 1967, 2004, 2006, 1999]`
4. Inserta `1999`: `[1924, 1967, 1999, 2004, 2006]`

La traza tiene 9 comparaciones y 7 desplazamientos contados como intercambios.

### Datos casi ordenados

`casiOrdenado(n, cambios)` genera primero años de `1900` a `1900 + n - 1` y después intercambia pares al final. Por ejemplo, con `n = 2.000` y `cambios = 20`, los últimos 20 elementos contienen unas pocas posiciones fuera de lugar y el resto conserva el orden.

### Mediciones con 2.000 libros

| Estado | Algoritmo | Comparaciones | Intercambios |
|---|---|---:|---:|
| Aleatorio | Bubble Sort | 1.993.329 | 1.014.144 |
| Aleatorio | Selection Sort | 1.999.000 | 1.992 |
| Aleatorio | Insertion Sort | 1.016.136 | 1.014.144 |
| Ordenado | Bubble Sort optimizado | 1.999 | 0 |
| Ordenado | Selection Sort | 1.999.000 | 0 |
| Ordenado | Insertion Sort | 1.999 | 0 |
| Invertido | Bubble Sort optimizado | 1.999.000 | 1.999.000 |
| Invertido | Selection Sort | 1.999.000 | 1.000 |
| Invertido | Insertion Sort | 1.999.000 | 1.999.000 |
| Casi ordenado | Bubble Sort optimizado | 3.997 | 10 |
| Casi ordenado | Selection Sort | 1.999.000 | 10 |
| Casi ordenado | Insertion Sort | 2.009 | 10 |

**¿Cuál hace menos intercambios?** Selection Sort hace el menor número: como máximo `n - 1` intercambios, frente a los desplazamientos de Insertion Sort y los intercambios adyacentes de Bubble Sort. En los estados medidos empleó 0, 1.992 o 1.000 intercambios.

**¿Cuál aprovecha mejor los datos casi ordenados?** Insertion Sort aprovecha mejor ese estado. Con 2.000 libros hizo solo 2.009 comparaciones y 10 desplazamientos frente a 1.999.000 comparaciones de Selection Sort.

**¿Cuál hace siempre la misma cantidad de comparaciones?** Selection Sort hace siempre `n(n - 1) / 2` comparaciones en esta versión, aproximadamente 1.999.000 para `n = 2.000`, sin importar si está ordenado, invertido o casi ordenado. Bubble Sort optimizado e Insertion Sort sí reducen trabajo según el estado inicial.

Aunque las mediciones cambien mucho, los tres tienen peor caso O(n²): Bubble Sort e Insertion Sort pueden hacer aproximadamente `n²/2` comparaciones y desplazamientos en un arreglo invertido; Selection Sort hace `n(n - 1)/2` comparaciones en cualquier arreglo y hasta O(n) intercambios. El peor crecimiento sigue siendo cuadrático, aunque Selection Sort tenga menos intercambios y Insertion Sort aproveche estados casi ordenados.

## Comparadores compuestos y estabilidad

`porAutorYTitulo(a, b)` compara primero el autor con `localeCompare(..., "es", { sensitivity: "base" })`. Si ambos autores son equivalentes, usa el título con las mismas opciones. Así ignora mayúsculas y diferencias de tildes para bibliotecarios y lectores.

`porPrestamosDesc(a, b)` devuelve `b.prestamos - a.prestamos`, por lo que coloca primero los libros con más préstamos. `invertir(comparar)` recibe un comparador y devuelve otro que invierte sus signos; por ejemplo, `invertir(porAnio)` ordena del año más reciente al más antiguo.

### Tabla utilizada

| Autor | Título | Año |
|---|---|---:|
| Laura Restrepo | Delirio | 2004 |
| Mario Mendoza | Cobro de sangre | 2004 |
| Laura Restrepo | Dulce compañía | 1995 |
| Mario Mendoza | Buda Blues | 2009 |
| Laura Restrepo | La novia oscura | 1999 |

Ordenada directamente con `porAutorYTitulo`, esta tabla queda:

```text
[Laura Restrepo/Delirio,
 Laura Restrepo/Dulce compañía,
 Laura Restrepo/La novia oscura,
 Mario Mendoza/Buda Blues,
 Mario Mendoza/Cobro de sangre]
```

Los tres algoritmos producen este mismo arreglo con el comparador compuesto.

### Experimento del bibliotecario

Primero se ordena por título con `porTitulo`; después se ordena el resultado solo por autor. Ambos pasos utilizan el mismo algoritmo.

| Algoritmo | Resultado por autor y título conservado |
|---|---|
| Bubble Sort | Sí; mantiene el orden alfabético del título dentro de cada autor |
| Insertion Sort | Sí; mantiene el orden alfabético del título dentro de cada autor |
| Selection Sort | No; mezcla el orden de títulos dentro de cada autor |

La prueba produjo para Selection Sort:

```text
Laura Restrepo/Delirio
Laura Restrepo/Dulce compañía
Laura Restrepo/La novia oscura
Mario Mendoza/Cobro de sangre
Mario Mendoza/Buda Blues
```

Los títulos de Mario Mendoza quedaron en `[Cobro de sangre, Buda Blues]`, contrario al orden alfabético obtenido por el primer paso. Esto identifica la inestabilidad del conjunto completo.

Ejemplo de traza de Selection Sort después del primer orden por título:

```text
Inicial por título:
[Buda Blues (Mario),
 Cobro de sangre (Mario),
 Delirio (Laura),
 Dulce compañía (Laura),
 La novia oscura (Laura)]
```

Al ordenar solo por autor, Selection Sort busca repetidamente el mínimo autor entre los sufijos. Intercambia elementos de los extremos y puede separar o intercambiar dos elementos equivalentes para el comparador nuevo. Por ello, dentro de `Laura Restrepo` ya no aparecen necesariamente en el orden alfabético obtenido antes.

Bubble Sort e Insertion Sort no intercambian elementos equivalentes para ese comparador: Bubble Sort solo cambia pares cuando `comparar(a, b) > 0`, e Insertion Sort usa `<= 0` para detener el desplazamiento. Consecuentemente conservan el orden relativo de los elementos con el mismo autor.

### Definición de estabilidad

Un algoritmo de ordenamiento es estable si dos elementos equivalentes según el comparador conservan el mismo orden relativo que tenían antes de ordenar.

Ejemplo bibliotecario: al ordenar primero por título y luego por autor, los tres libros de Laura Restrepo deben conservar `Delirio`, `Dulce compañía` y `La novia oscura` en ese orden alfabético. Bubble Sort e Insertion Sort son adecuados para esa clasificación estable. Selection Sort no garantiza esa propiedad y puede revuelverlos. La estabilidad importa, por ejemplo, al hacer primero un informe por título y después agruparlo por autor sin perder el subtítulo alfabético.

## Laboratorio de rendimiento v0.2

`src/laboratorio.js` integra el generador, los comparadores y los tres algoritmos. Cada tamaño se prueba con datos aleatorios, ordenados, invertidos y casi ordenados. El laboratorio verifica los resultados recorriendo cada arreglo y muestra `FALLA` si encuentra dos elementos fuera de orden.

### Recomendaciones para la red

- **Reordenamiento nocturno de 10.000 libros:** usar `sort` del lenguaje o, si se exige un algoritmo didáctico, Insertion Sort solo sobre datos casi ordenados. Los algoritmos básicos tienen peor caso y crecimiento cuadrático; con 10.000 elementos pueden realizar decenas de millones de operaciones. `sort` ofrece el mejor margen operativo.
- **Inserción diaria de libros nuevos:** mantener el catálogo casi ordenado y usar Insertion Sort. Al insertar pocas entradas al final, cada desplazamiento recorre una región corta y el costo permanece cercano a lineal en ese caso.
- **Listas pequeñas de exhibición de 20 libros:** Insertion Sort o Bubble Sort son suficientes. Su baja constante, facilidad de implementación y ejecución inmediata son apropiadas para tamaños pequeños. Selection Sort puede usarse si se quiere minimizar intercambios, pero no aporta ventaja temporal frente a los demás.

### Crecimiento al duplicar n

Cuando el tamaño pasa de 500 a 1.000, de 1.000 a 2.000 y de 2.000 a 4.000, los tres algoritmos básicos muestran aproximadamente cuatro veces más comparaciones e intercambios en los estados desfavorables. Esta relación coincide con el cambio de `n` a `2n`: el costo cuadrático pasa de proporcional a `n²` a proporcional a `(2n)² = 4n²`.

En las mediciones ejecutadas, el tiempo invertido de Bubble Sort pasó de aproximadamente 1.075 ms con 500 libros a 3.393 ms con 1.000, 14.321 ms con 2.000 y 78.208 ms con 4.000. Los factores no son uniformes por la carga temporal del equipo, pero la tendencia crece cerca de cuatro veces al duplicar `n`. Selection Sort creció aproximadamente de 1.082 ms a 2.751 ms, 9.793 ms y 48.476 ms en el mismo estado. Insertion Sort pasó de 0.889 ms a 3.663 ms, 12.151 ms y 57.521 ms.

Por ejemplo, Selection Sort mantiene exactamente `n(n - 1)/2` comparaciones en los estados medidos. Bubble Sort e Insertion Sort pueden acercarse a esa cifra en datos invertidos o aleatorios. En cambio, `sort` usa implementaciones optimizadas del lenguaje y sus tiempos son órdenes menores para los tamaños de este laboratorio.
