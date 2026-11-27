# Planificador Ruta Paisa

Planificador y índice de las estaciones de Ruta Paisa construido con estructuras de datos en JavaScript.

## Ejecutar

Desde la carpeta del proyecto:

```bash
node src/indice.js
```

El reporte muestra búsquedas por código, el mínimo y máximo, el rango de la zona norte y el listado completo de estaciones.

También pueden ejecutarse individualmente:

```bash
node src/ArbolBusqueda.js
node src/NodoArbol.js
node src/indice.js
node src/red.js
```

## Consultas soportadas por el índice

- `buscar(codigo)`: encuentra una estación y devuelve la cantidad de comparaciones.
- `minimo()`: devuelve la estación con el código menor.
- `maximo()`: devuelve la estación con el código mayor.
- `rango(desde, hasta)`: devuelve en orden las estaciones dentro del intervalo.
- `inorden(callback)`: listado ascendente por código.
- `preorden(callback)`: exportación del índice para reconstrucción.
- `postorden(callback)`: procesamiento seguro de abajo hacia arriba.
- `altura()`: altura del árbol en aristas.
- `contarHojas()`: cantidad de hojas.
- `contarNodos()`: cantidad de nodos.

## Recorridos y cierres de estaciones

Ejecuta `node src/red.js` para ver el DFS recursivo e iterativo, las componentes
conectadas y el análisis de estaciones críticas. En `Grafo`:

- `dfs(inicio, cerradas)`: conjunto alcanzable con DFS recursivo.
- `dfsIterativo(inicio, cerradas)`: mismo recorrido usando una pila explícita.
- `componentes(cerradas)`: grupos conectados, omitiendo estaciones cerradas.
- `rutaMasCorta(origen, destino, cerradas)`: camino más corto en número de
  conexiones, calculado con BFS y reconstruido mediante el mapa de padres.

Los cierres se pasan como `Set` de códigos. Cada recorrido y la obtención de
componentes tienen complejidad `O(V + E)`. `rutaMasCorta` devuelve `[origen]`
si origen y destino coinciden, y `null` si una estación no existe, está cerrada
o no hay camino.

## Grafo de conexiones

`Grafo` representa la red con una lista de adyacencia basada en `Map` y `Set`.

- `agregarEstacion(codigo)`: registra un vértice.
- `conectar(a, b)`: agrega una arista no dirigida sin duplicados.
- `vecinos(codigo)`: devuelve las estaciones conectadas.
- `grado(codigo)`: devuelve la cantidad de conexiones directas.
- `contarEstaciones()` y `contarConexiones()`: resumen de la red.
- `transbordos()`: devuelve vértices con grado mayor que 2.
