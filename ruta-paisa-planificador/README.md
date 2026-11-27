# Planificador Ruta Paisa v0.2

Planificador y índice de las estaciones de Ruta Paisa construido con estructuras de datos en JavaScript.

## Ejecutar

Desde la carpeta del proyecto:

```bash
node src/planificador.js 10 59
node src/planificador.js 29 70 --cerradas 56
node src/planificador.js --mantenimiento
node src/retos/demanda.js
node src/indice.js
node --test test/*.test.js
```

El planificador v0.2 recibe el código de origen y destino, valida ambos en el
árbol binario de búsqueda y calcula la ruta con menos paradas usando BFS.
Presenta los nombres de estaciones, la línea de cada tramo y los transbordos.
`--cerradas` acepta uno o más códigos separados por espacios; si no existe una
ruta con esos cierres, muestra un aviso claro.

```text
node src/planificador.js <origen> <destino> [--cerradas <código> ...]
```

Los códigos inexistentes o argumentos inválidos producen un mensaje de error
descriptivo. Si origen y destino coinciden, informa que no hay paradas.

El modo de mantenimiento comprueba las dependencias de tareas, señala ciclos
y presenta el orden topológico del plan corregido:

```bash
node src/planificador.js --mantenimiento
```

El reporte de `indice.js` muestra búsquedas por código, el mínimo y máximo, el rango de la zona norte y el listado completo de estaciones.

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
