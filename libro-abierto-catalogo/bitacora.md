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

## Merge Sort

`mezclar(izquierda, derecha, comparar)` combina dos arreglos ya ordenados. Conserva el elemento izquierdo antes del derecho cuando el comparador devuelve 0 o negativo. Por eso no invierte elementos equivalentes y la operación es estable. Devuelve `{ arreglo, comparaciones }`.

`mergeSort(arreglo, comparar)` recibe una copia implícita a través de las divisiones con `slice`, aplica el caso base para arreglos de cero o un elemento y divide hasta formar hojas.

```js
const izquierda = mergeSort([1924, 1967], porAnio).arreglo;
const derecha = mergeSort([2006, 2004], porAnio).arreglo;
mezclar(izquierda, derecha, porAnio);
```

### Árbol de divisiones y mezclas

Años iniciales: `[2006, 1967, 2004, 1924, 1999, 2007, 1988, 2002]`

```text
Divisiones:
[2006,1967,2004,1924,1999,2007,1988,2002]
├─ [2006,1967,2004,1924]
│  ├─ [2006,1967]
│  │  ├─ [2006]
│  │  └─ [1967]
│  └─ [2004,1924]
│     ├─ [2004]
│     └─ [1924]
└─ [1999,2007,1988,2002]
   ├─ [1999,2007]
   │  ├─ [1999]
   │  └─ [2007]
   └─ [1988,2002]
      ├─ [1988]
      └─ [2002]

Mezclas:
[2006],[1967] -> [1967,2006]
[2004],[1924] -> [1924,2004]
[1967,2006],[1924,2004] -> [1924,1967,2004,2006]
[1999],[2007] -> [1999,2007]
[1988],[2002] -> [1988,2002]
[1999,2007],[1988,2002] -> [1988,1999,2002,2007]
[1924,1967,2004,2006],[1988,1999,2002,2007]
-> [1924,1967,1988,1999,2002,2004,2006,2007]
```

### Comparaciones medibles

| Tamaño n | Comparaciones Merge Sort | n · log₂(n) | Resultado |
|---:|---:|---:|---|
| 1.000 | 8.720 | 9.965,78 | Por debajo |
| 10.000 | 120.476 | 132.877,12 | Por debajo |
| 100.000 | 1.536.754 | 1.660.964,05 | Por debajo |

Las mediciones se hicieron con arreglos aleatorios deterministas. Para los tres tamaños las comparaciones están por debajo de `n * log2(n)`. Merge Sort tiene complejidad temporal O(n log n) en el mejor y el peor caso, y memoria adicional O(n) por las copias y arreglos de mezcla.

### Estabilidad de Merge Sort

Se repitió el experimento del MiniReto 7: ordenar primero por título y después por autor. Merge Sort conservó:

```text
Laura Restrepo/Delirio
Laura Restrepo/Dulce compañía
Laura Restrepo/La novia oscura
Mario Mendoza/Buda Blues
Mario Mendoza/Cobro de sangre
```

Es estable porque, al mezclar dos libros equivalentes para el comparador, siempre toma primero el elemento de la mitad izquierda. Las divisiones preservan el orden relativo entre ocurrencias equivalentes.

### Laboratorio con 4.000 libros

En una medición aleatoria con 4.000 libros, Merge Sort utilizó 42.913 comparaciones y estuvo por debajo de los tres algoritmos básicos:

| Algoritmo | Tiempo aproximado |
|---|---:|
| Bubble Sort | 106,500 ms |
| Selection Sort | 39,169 ms |
| Insertion Sort | 28,979 ms |
| Merge Sort | 8,798 ms |

La medición de tiempo depende de la máquina y de la ejecución; el costo contable es estable: O(n log n) frente al crecimiento cuadrático de los tres algoritmos básicos.

## Quick Sort

`particion(arreglo, inicio, fin, comparar)` implementa el esquema de Lomuto tomando el último elemento como pivote. Devuelve el índice final del pivote. `quickSort(arreglo, comparar)` trabaja sobre una copia y divide recursivamente. `quickSortMedianaTres` reemplaza el último pivote por la mediana del primero, el centro y el último antes de particionar.

### Primera partición con Lomuto

Años iniciales:

```text
[2006, 1967, 2004, 1924, 1999, 2007, 1988, 2002]
Pivote = 2002
```

La partición recorre `j = 0` a `j = 6`:

1. `2006 > 2002`: no intercambia.
2. `1967 <= 2002`: coloca `1967` al inicio.
3. `2004 <= 2002`: coloca `2004` en la región menor.
4. `1924 <= 2002`: coloca `1924` en la región menor.
5. `1999 <= 2002`: coloca `1999` en la región menor.
6. `2007 > 2002`: no intercambia.
7. `1988 <= 2002`: coloca `1988` en la región menor.
8. Intercambia el pivote `2002` por el siguiente elemento mayor.

Resultado de la primera partición:

```text
[1967, 1924, 1999, 1988, 2002, 2007, 2006, 2004]
Índice del pivote: 4
Comparaciones: 7
Intercambios: 6
```

### Peor caso con datos ordenados

Con el último elemento como pivote y datos ya ordenados, cada partición deja casi todos los elementos en el lado izquierdo y ninguno o muy pocos en el derecho. El arreglo se descompone como `n + (n - 1) + (n - 2) + ... + 1`, por eso Quick Sort hace aproximadamente `n(n - 1)/2` comparaciones y alcanza O(n²).

| Estado, n = 10.000 | Versión | Comparaciones | Intercambios | Tiempo |
|---|---|---:|---:|---:|
| Aleatorio | Pivote final | 151.741 | 63.155 | 14,932 ms |
| Aleatorio | Mediana de tres | 159.005 | 69.192 | 6,826 ms |
| Ordenado | Pivote final | 49.995.000 | 0 | 178,895 ms |
| Ordenado | Mediana de tres | 131.343 | 11.808 | 2,702 ms |

La mediana de tres corrige el arreglo ordenado porque el valor central evita que el pivote sea siempre el mayor.

### Estabilidad

Se repitió el experimento de dos pasos sobre autor y título. Las dos versiones de Quick Sort devolvieron títulos de Mario Mendoza invertidos o fuera del orden alfabético:

```text
Laura Restrepo/Delirio
Laura Restrepo/Dulce compañía
Laura Restrepo/La novia oscura
Mario Mendoza/Cobro de sangre
Mario Mendoza/Buda Blues
```

Quick Sort no es estable: particiona y puede cruzar elementos equivalentes para el segundo comparador, cambiando su orden relativo. Merge Sort sí conserva esos elementos.

### Merge Sort frente a Quick Sort

| Aspecto | Merge Sort | Quick Sort pivote fijo | Quick Sort mediana/aleatorio |
|---|---|---|---|
| Mejor caso | O(n log n) | O(n log n) con particiones balanceadas | O(n log n) |
| Caso promedio | O(n log n) | O(n log n) | O(n log n) |
| Peor caso | O(n log n) | O(n²) con datos adversos u ordenados | O(n log n) esperado o probabilístico |
| Memoria adicional | O(n) | O(log n) en pila esperada | O(log n) en pila esperada |
| Estabilidad | Estable | Inestable | Inestable |
| Uso recomendado | Garantía uniforme y estabilidad | Datos pequeños o práctica didáctica | Reordenamiento rápido con datos adversos |

Quick Sort mediana de tres conserva un rendimiento cercano a O(n log n) y ordena en el lugar. Merge Sort ofrece garantías deterministas y estabilidad, a cambio de memoria adicional.

## Ranking Top-K

`topPrestados(libros, k)` usa `mergeSort` con `porPrestadosDesc` sobre una copia y toma los primeros `k`. La copia evita modificar el catálogo original. Su costo es O(n log n) para ordenar y O(k) para extraer.

`topPrestadosSeleccion(libros, k)` conserva una copia y realiza `k` pasadas buscando el máximo desde la región restante. En cada pasada recorre a lo sumo `n - i` elementos, por lo que hace O(k·n) comparaciones y intercambia elementos en el lugar de su copia.

Con 10.000 libros y mediciones deterministas:

| k | Merge Sort completo | Selección parcial |
|---:|---:|---:|
| 10 | 8.885 ms | 6.136 ms |
| 5.000 | 6.689 ms | 81.862 ms |

Para `k = 10`, la selección parcial evita ordenar los 9.990 elementos restantes y es más conveniente. Para `k = 5000`, ordenar los datos completos tiene mejor costo relativo y es más apropiado. De forma general, selección parcial conviene cuando `k << n`; Merge Sort conviene cuando `k` es grande o se necesitan varios rankings reutilizables.

## Autocompletar por prefijo

Primero se usa `mergeSort` sobre una copia por título con comparación que ignora mayúsculas y tildes. `primeraPosicionPrefijo(titulosOrdenados, prefijo)` implementa límite inferior: encuentra el primer título cuyo texto normalizado es mayor o igual que el prefijo.

`autocompletar(librosOrdenadosPorTitulo, prefijo, max)` comienza en esa posición y usa `startsWith` sobre cadenas normalizadas. Se detiene al salir del prefijo o al alcanzar `max`, por lo que no recorre el catálogo completo.

Complejidad: O(log n) para hallar la primera posición y O(k) para devolver `k` coincidencias como máximo. En total, O(log n + k).

Casos probados:

| Prefijo | Comportamiento esperado |
|---|---|
| `"la ca"` | Devuelve los títulos que empiezan por esa cadena, como `La casa de las dos palmas` |
| Prefijo de un resultado | Devuelve exactamente ese título y termina |
| Prefijo inexistente | Devuelve `[]` |
| Cadena vacía | Devuelve `[]` para evitar sugerencias sin escribir |
