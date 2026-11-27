# Planificador Ruta Paisa v1.0

Planificador y índice de las estaciones de Ruta Paisa construido con estructuras de datos en JavaScript.

## Ejecutar

Desde la carpeta del proyecto:

```bash
node src/planificador.js 10 59
node src/planificador.js 29 70 --cerradas 56
node src/planificador.js --listar
node src/planificador.js --rango 10 30
node src/planificador.js --criticas
node src/planificador.js --mantenimiento
node src/retos/demanda.js
node src/dominio/indice.js
node pruebas/todo.js
node --test test/*.test.js
```

El planificador v1.0 recibe el código de origen y destino, valida ambos en el
árbol binario de búsqueda y calcula la ruta con menos paradas usando BFS.
Presenta los nombres de estaciones, la línea de cada tramo y los transbordos.
`--cerradas` acepta uno o más códigos separados por espacios; si no existe una
ruta con esos cierres, muestra un aviso claro.

```text
node src/planificador.js <origen> <destino> [--cerradas <código> ...]
```

Las funcionalidades del CLI son:

- `--listar`: estaciones en orden ascendente de código.
- `--rango <desde> <hasta>`: estaciones cuyos códigos están en el intervalo.
- `--criticas`: componentes que produce el cierre individual de cada estación crítica.
- `--mantenimiento`: ciclo del plan original, corrección y orden topológico.

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
node src/estructuras/ArbolBusqueda.js
node src/estructuras/NodoArbol.js
node src/dominio/indice.js
node src/dominio/red.js
```

## Organización

```text
src/
├── estructuras/  Árboles, grafos dirigidos/no dirigidos y cola FIFO
├── dominio/      Índice, construcción de la red y CLI del planificador
├── retos/        Duplicados, demanda y dependencias de mantenimiento
└── planificador.js  Entrada estable del CLI
pruebas/todo.js     Verificación funcional con resultados OK/FALLA
test/               Pruebas automatizadas con node:test
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

Ejecuta `node src/dominio/red.js` para ver el DFS recursivo e iterativo, las componentes
conectadas y el análisis de estaciones críticas. En `Grafo`:

- `dfs(inicio, cerradas)`: conjunto alcanzable con DFS recursivo.
- `dfsIterativo(inicio, cerradas)`: mismo recorrido usando una pila explícita.
- `componentes(cerradas)`: grupos conectados, omitiendo estaciones cerradas.
- `estacionesCriticas()`: vértices cuyo cierre deja dos o más componentes.
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

## Decisiones técnicas y complejidad

`V` representa vértices/estaciones, `E` conexiones, `n` validaciones, `u` estaciones únicas y `r` resultados de un rango.

| Problema | Estructura o algoritmo elegido | Alternativa descartada | Complejidad | Justificación |
|---|---|---|---|---|
| Representar modos, líneas, estaciones y servicios | Árbol general | Duplicar jerarquía en una tabla plana | Construcción `O(V)`; búsqueda `O(V)` | Expresa la relación padre-hijo y permite recorrer recursivamente. Las estaciones compartidas se modelan mejor como grafo. |
| Buscar una estación por código | Árbol binario de búsqueda | Búsqueda lineal `O(V)` | `O(h)` por búsqueda; `O(log V)` balanceado, peor caso `O(V)` | Mantiene los códigos ordenados y soporta consultas por rango. |
| Listar estaciones / consultar rangos | Inorden / poda del BST | Ordenar todos los códigos en cada petición | Listado `O(V)`; rango `O(h+r)`, peor caso `O(V)` | Inorden entrega orden ascendente; el rango visita solo ramas relevantes cuando el árbol está equilibrado. |
| Modelar estaciones y conexiones compartidas | Lista de adyacencia con `Map` y `Set` | Matriz de adyacencia `O(V²)` | Espacio `O(V+E)`; vecinos `O(grado(v))` | La red es dispersa y una estación puede conectar varias líneas. |
| Hallar ruta con menos paradas | BFS, cola y mapa de padres | DFS, que no garantiza el camino mínimo | `O(V+E)` tiempo y `O(V)` espacio | En un grafo sin pesos, BFS visita por niveles y reconstruye una ruta mínima. |
| Encontrar estaciones alcanzables / componentes | DFS recursivo e iterativo con `Set` | Revisar cada par de estaciones | `O(V+E)` por recorrido; barrido de criticidad `O(V(V+E))` | El conjunto evita revisitas; la búsqueda de articulaciones compara componentes tras cerrar cada vértice. |
| Detectar validaciones repetidas | Clave compuesta y `Set` | Comparación por pares | `O(n)` tiempo esperado; `O(u+d)` total | Una consulta de conjunto identifica la repetición sin recorrer las validaciones anteriores. |
| Encontrar hora pico | Ventana deslizante | Recalcular cada ventana | `O(n)` tiempo; `O(1)` espacio | Al avanzar solo se agrega el dato entrante y se resta el saliente. |
| Ranking de estaciones usadas | `Map` de conteos y ordenamiento | Buscar/recontar cada estación | `O(n + u log u)` tiempo; `O(u)` espacio | Cuenta una vez por validación y ordena las frecuencias. Para top `k`, un min-heap reduce el ordenamiento a `O(u log k)`. |
| Verificar dependencias y programar obras | DFS con estados / orden topológico | Probar permutaciones de tareas | `O(V+E)` tiempo; `O(V)` espacio | Detecta una arista hacia una tarea en proceso y usa el postorden invertido para respetar dependencias. |

## Sustentación de cinco minutos

Guion sugerido para presentar al equipo (el cronómetro y la demostración real se ejecutan en la sesión):

| Tiempo | Guion y demostración |
|---|---|
| 0:00–0:40 | “Ruta Paisa necesita responder rutas por código, reconocer cierres y explicar el resultado. También debe ayudar a operaciones a analizar demanda y mantenimiento.” |
| 0:40–1:35 | Primera consulta en vivo: `node src/planificador.js 10 59`. Mostrar las 7 paradas y los cambios de línea en Hospital y Estadio. |
| 1:35–2:20 | Segunda consulta en vivo: `node src/planificador.js --mantenimiento`. Mostrar el ciclo original, la corrección y el orden válido. |
| 2:20–3:20 | Justificar BFS: la lista de adyacencia ocupa `O(V+E)` y BFS recorre vértices y aristas en `O(V+E)`. En red no ponderada devuelve el mínimo número de paradas; DFS solo promete encontrar un camino. |
| 3:20–4:15 | Demostrar `--rango`, `--criticas` y `--cerradas`; enseñar que `node pruebas/todo.js` imprime `OK` para los casos integrados. |
| 4:15–5:00 | Mejora futura: usar datos de servicio en tiempo real y un algoritmo de costo múltiple (tiempo, accesibilidad y cierres) sin perder el modo de mínimo número de paradas. Cerrar resumiendo la elección de estructuras por operación. |

### Rúbrica de la sustentación

La presentación grupal no se puede realizar ni evaluar desde este repositorio. Registrar la evaluación real al terminar la sesión; no se inventan puntajes ni comentarios.

| Criterio | Puntaje (1–4) | Comentario del evaluador |
|---|---:|---|
| Explica el problema y las necesidades del pasajero/equipo | ____ | __________________ |
| Demuestra las consultas correctamente | ____ | __________________ |
| Justifica estructuras y complejidad | ____ | __________________ |
| Comunica decisiones, límites y casos borde | ____ | __________________ |
| Responde preguntas y propone mejoras | ____ | __________________ |

**Fortaleza recibida:** pendiente de la presentación real.

**Oportunidad de mejora:** pendiente de la evaluación del grupo.
