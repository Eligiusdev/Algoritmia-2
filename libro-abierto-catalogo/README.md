# Libro Abierto - Catálogo

Libro Abierto es un proyecto didáctico para modelar un catálogo de libros y practicar búsqueda lineal y binaria. Cada libro contiene `isbn`, `titulo`, `autor`, `año` y `prestamos`.

## Ejecución

Desde la carpeta `libro-abierto-catalogo`:

```bash
node src/catalogo.js
```

También puede explorarse el catálogo base con:

```bash
node src/explorar.js
```

## Consultas disponibles

- Por título exacto: búsqueda lineal con retorno temprano.
- Por autor: búsqueda lineal que devuelve todas las coincidencias.
- Por palabra dentro del título: búsqueda lineal.
- Por ISBN: búsqueda binaria iterativa.
- Por ISBN en forma recursiva: búsqueda binaria recursiva.
- Primera posición y todas las copias de un ISBN: búsqueda binaria de primera ocurrencia más recorrido hacia la derecha.
- Catálogo por año: Bubble Sort de más antiguo a más reciente, con salida temprana.

El reporte integrado genera 10.000 libros, prepara una copia ordenada por ISBN y muestra el algoritmo, el resultado y las comparaciones de cada consulta. La opción `copiasRepetidas` del generador permite insertar ISBN repetidos para probar copias de distintas sedes.

## Ordenamiento por año

La muestra puede ordenarse sin modificar el arreglo original:

```bash
node -e "const m=require('./src/muestra'); const {bubbleSort,porAnio}=require('./src/ordenamiento'); console.log(bubbleSort(m,porAnio));"
```

## Algoritmos de ordenamiento

El módulo `ordenamiento.js` incluye Bubble Sort optimizado, Selection Sort, Insertion Sort, Merge Sort y las dos versiones de Quick Sort. Todos reciben una función `comparar` y devuelven una copia ordenada con sus contadores:

```js
selectionSort(arreglo, porAnio)
insertionSort(arreglo, porAnio)
mergeSort(arreglo, porAnio)
quickSort(arreglo, porAnio)
quickSortMedianaTres(arreglo, porAnio)
```

Los comparadores compuestos pueden combinar varios campos:

```js
porAutorYTitulo
invertir(porAnio)
porPrestamosDesc
```

## Laboratorio de rendimiento

Ejecuta el comparativo de Bubble Sort, Selection Sort, Insertion Sort, Merge Sort y `sort`:

```bash
node src/laboratorio.js
```

El laboratorio prueba arreglos de 500, 1.000, 2.000 y 4.000 libros en estados aleatorio, ordenado, invertido y casi ordenado. Para cada ejecución muestra comparaciones, intercambios, tiempo y una verificación automática; una salida incorrecta se identifica como `FALLA`. También compara Quick Sort con pivote fijo y con mediana de tres.
