## Problema de las estaciones compartidas

San Antonio y Caribe aparecen en más de una línea del sistema. Esto genera un problema en un árbol: un nodo normalmente debe tener un único padre, mientras que una estación compartida tendría que pertenecer simultáneamente a varias líneas.

Si se repite la estación como nodos diferentes bajo cada línea, se duplican los datos y puede haber inconsistencias entre ambos nodos. Si se usa un único nodo como hijo de una sola línea, se pierde la pertenencia de ese nodo a las demás líneas.

Una **lista de adyacencia mediante un grafo** representaría mejor la red, porque una estación puede tener varias conexiones con distintas líneas o estaciones vecinas. Además, se podrían almacenar las líneas como vértices o propiedades y resolver recorridos sin obligar a una estación a tener un único padre.

## Representación del árbol

```text
Nivel 0 (raíz)
└── Red Ruta Paisa
    |
    Nivel 1: modos de transporte
    ├── Trenes (Metro)
    │   |
    │   Nivel 2: líneas
    │   ├── Línea A (Niquía – La Estrella)
    │   │   |
    │   │   Nivel 3: estaciones
    │   │   ├── Niquía
    │   │   │   └── [Nivel 4: servicios de Niquía]
    │   │   ├── San Antonio
    │   │   │   └── [Nivel 4: servicios de San Antonio]
    │   │   └── ...
    │   └── Línea B (San Antonio – San Javier)
    │       └── [Nivel 3: estaciones y nivel 4: servicios]
    |
    ├── Cables aéreos (Metrocable)
    │   ├── Línea K (Acevedo – Santo Domingo)
    │   ├── Línea J (San Javier – La Aurora)
    │   ├── Línea P (Acevedo – El Progreso)
    │   ├── Línea H (Oriente – Villa Sierra)
    │   ├── Línea M (Miraflores – Trece de Noviembre)
    │   └── Línea L (Santo Domingo – Arví)
    |
    ├── Tranvía
    │   └── Línea T (San Antonio – Oriente)
    |
    └── Buses (Metroplús)
        ├── Línea 1 (Parque Aranjuez – Universidad de Medellín)
        ├── Línea 2 (Parque Aranjuez – Universidad de Medellín vía Av. Oriental)
        └── Línea O (Caribe – La Palma)
```

Cada estación se coloca como hija de su línea y cada servicio como hija de su estación. Por ejemplo:

```text
Red Ruta Paisa
└── Trenes (Metro)
    └── Línea A (Niquía – La Estrella)
        └── Niquía
            ├── Punto de Atención al Cliente (PAC)
            ├── Máquinas de recarga Cívica
            ├── Parqueadero de bicicletas
            ├── Baños públicos
            ├── BiblioMetro
            ├── Elementos de accesibilidad
            └── Cajeros electrónicos y locales comerciales
```

### Identificación de los elementos

- **Raíz:** `Red Ruta Paisa`, ubicada en el nivel 0.
- **Nodos internos:** todos los nodos que tienen hijos. Incluyen la raíz, los 4 modos de transporte, las 12 líneas y los nodos de estaciones.
- **Hojas:** los nodos de servicios que no tienen hijos. En la estructura construida por `construirArbolRed`, hay 241 hojas.
- **Nivel 0:** raíz.
- **Nivel 1:** modos de transporte.
- **Nivel 2:** líneas.
- **Nivel 3:** estaciones.
- **Nivel 4:** servicios.
- **Altura:** 4 aristas, calculada desde la raíz hasta la hoja más profunda.

Hay 369 nodos en total y 128 nodos internos en la construcción actual. Los números pueden cambiar si se modifica la cantidad de estaciones o servicios. La existencia de San Antonio y Caribe en varias líneas también hace que estos estén representados como nodos repetidos bajo cada línea; por eso el árbol no refleja correctamente su pertenencia compartida.

## Árbol binario de búsqueda por código de estación

Los códigos se insertaron en el orden indicado:
`50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 52, 56, 65, 90, 27, 29, 54, 58, 59`.

```text
                                    50 San Antonio
                         /                         \
                    30 Caribe                    70 Poblado
                   /         \                  /         \
             20 Bello      40 Hospital      60 Exposiciones 80 Itagüí
             /      \       /       \         /      \         \
        10 Niquía 25 Acevedo 35 Universidad 45 Parque Berrío 52 Cisneros 65 Industriales 90 La Estrella
                      \
                   27 Andalucía
                      \
                    29 Santo Domingo

                            52 Cisneros
                           /            \
                      54 Suramericana 56 Estadio
                                             \
                                           58 Floresta
                                                \
                                            59 San Javier
```

El dibujo está dividido en ramas secundarias para mantenerlo legible. En el árbol real, estas relaciones son:

```text
                                     50
                         /                         \
                       30                           70
                     /    \                       /    \
                   20      40                   60      80
                  /  \    /  \                 /  \       \
                10   25 35   45              52   65      90
                      \                         \
                      27                        56
                       \                      /    \
                       29                    54     58
                                                    \
                                                     59
```

### Identificación

- **Raíz:** `50 San Antonio`, nivel 0.
- **Altura:** 6 aristas, desde la raíz hasta `29 Santo Domingo` y `59 San Javier`.
- **Nodos internos:** todos los nodos con al menos un hijo.
- **Hojas:** `10 Niquía`, `29 Santo Domingo`, `35 Universidad`, `45 Parque Berrío`, `54 Suramericana`, `59 San Javier`, `65 Industriales` y `90 La Estrella`.

### Códigos repetidos

Si se intenta insertar una clave que ya existe, el programa actualiza el nombre de la estación almacenada en ese nodo y no crea un nodo adicional. Esto conserva una única entrada por código y mantiene la propiedad BST.

### Comparaciones de búsqueda

Cada comparación evalúa el nodo actual. Los resultados observados son:

| Búsqueda | Camino seguido | Comparaciones | Profundidad |
|---|---|---:|---:|
| 50 San Antonio | 50 | 1 | 0 |
| 59 San Javier | 50 → 70 → 60 → 52 → 56 → 58 → 59 | 7 | 6 |
| 10 Niquía | 50 → 30 → 20 → 10 | 4 | 3 |
| 45 Parque Berrío | 50 → 30 → 40 → 45 | 4 | 3 |
| 33 inexistente | 50 → 30 → 40 → 35 → null | La búsqueda devuelve `null` | No existe |

Para una búsqueda encontrada, el número de comparaciones es igual a `profundidad + 1`. Para el código 33, el recorrido termina al comprobar que no existe un hijo izquierdo debajo de 35.

## Adaptación del árbol a todas las estaciones

La lista original se amplió con todas las estaciones presentes en `datosRed`. Se conservaron los 20 códigos indicados inicialmente y se asignaron códigos únicos desde `100` a las estaciones que no tenían código.

De este modo existen 88 estaciones en el árbol. Los nombres que también aparecen en varias líneas conservan el código asignado a la entrada registrada como estación; las variantes con nombres distintos, como `San Antonio (Línea B)` y `Estación San Antonio`, son nodos independientes para evitar confundir una estación con otra denominación.

### Códigos originales conservados

| Código | Estación | Código | Estación |
|---:|---|---:|---|
| 50 | San Antonio | 30 | Caribe |
| 70 | Poblado | 20 | Bello |
| 40 | Hospital | 60 | Exposiciones |
| 80 | Itagüí | 10 | Niquía |
| 25 | Acevedo | 35 | Universidad |
| 45 | Parque Berrío | 52 | Cisneros |
| 56 | Estadio | 65 | Industriales |
| 90 | La Estrella | 27 | Andalucía |
| 29 | Santo Domingo | 54 | Suramericana |
| 58 | Floresta | 59 | San Javier |

### Códigos asignados a las estaciones restantes

| Código | Estación | Código | Estación |
|---:|---|---:|---|
| 100 | Madera | 101 | Tricentenario |
| 102 | Prado | 103 | Alpujarra |
| 104 | Aguacatala | 105 | Ayurá |
| 106 | Envigado | 107 | Sabaneta |
| 108 | Santa Lucía | 109 | San Antonio (Línea B) |
| 110 | Popular | 111 | Juan XXIII |
| 112 | Vallejuelos | 113 | La Aurora |
| 114 | SENA | 115 | Doce de Octubre |
| 116 | El Progreso | 117 | Oriente |
| 118 | Las Torres | 119 | Villa Sierra |
| 120 | Miraflores | 121 | El Pinal |
| 122 | Trece de Noviembre | 123 | Arví |
| 124 | Estación San Antonio | 125 | Estación Miraflores |
| 126 | Estación Oriente | 127 | Parada San José |
| 128 | Parada Pabellón del Agua EPM | 129 | Parada Bicentenario |
| 130 | Parada Buenos Aires | 131 | Parada Loyola |
| 132 | Parada Alejandro Echavarría | 133 | Parque Belén |
| 134 | Parque Aranjuez | 135 | Berlín |
| 136 | Las Esmeraldas | 137 | Manrique |
| 138 | Gardel | 139 | Palos Verdes |
| 140 | Ruta N – U. de A. | 141 | Chagualo |
| 142 | Minorista | 143 | Plaza Mayor |
| 144 | Nutibara | 145 | Fátima |
| 146 | Rosales | 147 | La Palma |
| 148 | Los Alpes | 149 | U. de M. |
| 150 | San Pedro (Fuera de servicio) | 151 | Catedral |
| 152 | La Playa | 153 | San José |
| 154 | Barrio Colón | 155 | Perpetuo Socorro |
| 156 | Barrio Colombia | 157 | Universal |
| 158 | Córdoba | 159 | Pilarica |
| 160 | Ciudadela Universitaria | 161 | Facultad de Minas |
| 162 | Los Colores | 163 | Calasanz |
| 164 | Los Pinos | 165 | Laureles |
| 166 | Santa Gema | 167 | Villa de Aburrá |

Los códigos se mantienen dentro del mismo árbol binario de búsqueda y no se reutilizan. Si se recibe otra vez una clave existente, `insertar` actualiza el nombre almacenado en su nodo sin crear una copia.

### Comparaciones con las 88 estaciones

| Búsqueda | Resultado | Comparaciones |
|---|---|---:|
| 50 San Antonio | Encontrada | 1 |
| 59 San Javier | Encontrada | 7 |
| 10 Niquía | Encontrada | 4 |
| 45 Parque Berrío | Encontrada | 4 |
| 100 Madera | Encontrada | 5 |
| 33 | No existe; devuelve `null` | Termina al encontrar el vacío |

La ampliación conserva los resultados requeridos: `buscar(50)` realiza una comparación y `buscar(59)` realiza siete. El árbol completo contiene 88 nodos y conserva `50 San Antonio` como raíz.

## Recorridos del índice binario

Los recorridos se verificaron antes de ejecutarlos sobre el árbol original de los 20 códigos indicados inicialmente:

`50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 52, 56, 65, 90, 27, 29, 54, 58, 59`.

### Predicción de inorden

Inorden visita primero el subárbol izquierdo, luego el nodo y después el subárbol derecho. La secuencia esperada y obtenida es:

```text
10, 20, 25, 27, 29, 30, 35, 40, 45, 50, 52, 54, 56, 58, 59, 60, 65, 70, 80, 90
```

Esta secuencia corresponde a un listado ascendente. En Ruta Paisa se usa para generar tableros informativos con las estaciones ordenadas por código.

### Predicción de preorden

Preorden visita el padre antes que sus hijos. La secuencia esperada y obtenida es:

```text
50, 30, 20, 10, 25, 27, 29, 40, 35, 45, 70, 60, 52, 56, 54, 58, 59, 65, 80, 90
```

Se exportaron estos códigos a un arreglo, se reconstruyó un árbol nuevo insertándolos en ese mismo orden y se confirmó que su forma coincide exactamente con la del original.

En Ruta Paisa, preorden permite exportar el índice completo con la información necesaria para reconstruirlo idéntico en otro servidor.

### Predicción de postorden

Postorden visita primero los hijos y después el padre. La secuencia esperada y obtenida es:

```text
10, 29, 27, 25, 20, 35, 45, 40, 30, 54, 59, 58, 56, 52, 65, 60, 90, 80, 70, 50
```

Este recorrido contó 20 nodos. En Ruta Paisa es adecuado para liberar el índice al reiniciar el sistema, porque los nodos hijos se procesan antes que el padre y no quedan referencias a liberar por debajo.

### Altura y hojas

Para el árbol original de 20 nodos:

- **Altura calculada:** 6 aristas desde la raíz hasta una hoja profunda.
- **Número de hojas:** 8.
- **Altura mínima posible:** para 20 nodos, una altura mínima teórica de 4 aristas.
- La altura real es mayor porque el árbol se formó siguiendo el orden de inserción y no quedó completamente equilibrado.

La altura mínima se calcula con `ceil(log₂(20 + 1)) - 1 = 4`. Como `4 < 6`, el índice podría mejorar su equilibrio, pero el recorrido preorden permite reconstruir exactamente el árbol actual sin aplicar otro reordenamiento.

## Consultas de mínimo, máximo y rango

El índice permite obtener el primer y último código sin recorrer todos los nodos:

- `minimo()` sigue exclusivamente los enlaces izquierdos hasta llegar al nodo más izquierdo.
- `maximo()` sigue exclusivamente los enlaces derechos hasta llegar al nodo más derecho.

Sobre el árbol original de 20 estaciones, el mínimo es **Niquía** con código `10` y el máximo es **La Estrella** con código `90`.

Para el rango de la zona norte, `rango(10, 30)` recorre en inorden solamente las regiones que pueden contener resultados. El orden esperado y obtenido es:

```text
10 Niquía
20 Bello
25 Acevedo
27 Andalucía
29 Santo Domingo
30 Caribe
```

`rango` poda el subárbol izquierdo cuando el nodo supera el límite máximo y poda el subárbol derecho cuando el nodo queda debajo del límite mínimo.

## Árbol degenerado por inserción ascendente

Las 20 estaciones se insertaron también desde `10` hasta `90` en orden ascendente:

```text
10
 \
  20
   \
    25
     \
      27
       \
        29
         \
          30
           \
            35
             \
              40
               \
                45
                 \
                  50
                   \
                    52
                     \
                      54
                       \
                        56
                         \
                          58
                           \
                            59
                             \
                              60
                               \
                                65
                                 \
                                  70
                                   \
                                    80
                                     \
                                      90
```

Cada código nuevo es mayor que el nodo anterior, por lo que se agrega siempre como hijo derecho. El árbol deja de dividir los datos en dos ramas y se convierte en una lista enlazada.

- **Altura en aristas:** 19.
- **Cantidad de niveles:** 20, contando la raíz como nivel 1.
- **Complejidad balanceada:** búsqueda, inserción y mínimo recorrido esperado en `O(log n)`.
- **Complejidad degenerada:** búsqueda e inserción en `O(n)`.

Al buscar San Javier en el árbol ascendente, el recorrido visita los 15 primeros códigos hasta encontrar `59`, por lo que realiza 15 comparaciones. Para La Estrella (`90`) realiza 20 comparaciones porque es el último nodo de la cadena.

## Grafo no dirigido de la red

Las conexiones directas se representan con vértices identificados por código. La red contiene 20 estaciones y 21 conexiones. Los nombres se obtienen reutilizando `codigosEstaciones20`, que funciona como índice del Día 1.

### Líneas y conexiones

- **Línea A:** `10-20-30-35-40-45-50-60-65-70-80-90`.
- **Línea B:** `50-52-54-56-58-59`.
- **Línea K:** `30-25-27-29`.
- **Línea T:** `40-56-65`.

```text
10 Niquía
 |
20 Bello
 |
30 Caribe -------- 25 Acevedo
 |                    |
35 Universidad        27 Andalucía
 |                    |
40 Hospital           29 Santo Domingo
 |\________
 |         56 Estadio
45 Parque Berrío  / | \
                  50 San Antonio--52 Cisneros--54 Suramericana
                  /  |
               60 Exposiciones
                  |
               65 Industriales
                  |
               70 Poblado
                  |
               80 Itagüí
                  |
               90 La Estrella
```

El dibujo simplificado debe interpretarse junto con la lista exacta de adyacencia siguiente:

```text
10 -> [20]
20 -> [10, 30]
30 -> [20, 35, 25]
35 -> [30, 40]
40 -> [35, 45, 56]
45 -> [40, 50]
50 -> [45, 60, 52]
60 -> [50, 65]
65 -> [60, 70, 56]
70 -> [65, 80]
80 -> [70, 90]
90 -> [80]

25 -> [30, 27]
27 -> [25, 29]
29 -> [27]

52 -> [50, 54]
54 -> [52, 56]
56 -> [54, 58, 40, 65]
58 -> [56, 59]
59 -> [58]
```

### Estaciones de transbordo

Se consideran transbordos los vértices cuyo grado sea mayor que 2:

| Código | Estación | Grado |
|---:|---|---:|
| 30 | Caribe | 3 |
| 40 | Hospital | 3 |
| 50 | San Antonio | 3 |
| 56 | Estadio | 4 |
| 65 | Industriales | 3 |

### Por qué se usa un grafo

San Antonio, Caribe y las demás estaciones compartidas pueden pertenecer a varias líneas. Un grafo permite tener un único vértice por estación y varias aristas hacia sus vecinos. Así no se duplican estaciones ni se obliga a elegir un único padre, como ocurría en el árbol.

### Lista de adyacencia frente a matriz

Para `V = 20` estaciones:

- Una matriz necesita `20 × 20 = 400` posiciones, aunque la red tenga solo 21 conexiones.
- La lista necesita una entrada por cada vértice y dos referencias por arista no dirigida. Guarda aproximadamente `20` conjuntos de vértices más `42` referencias en esta red.
- Consultar los vecinos de una estación cuesta `O(grado(v))` en la lista y `O(V)` al recorrer una fila completa de la matriz.
- Consultar si existe una conexión directa cuesta `O(1)` esperado con `Set` en la lista y `O(1)` en la matriz.

La lista de adyacencia es más conveniente para esta red dispersa: tiene `V = 20` y `E = 21`, una densidad baja. También permite recorrer directamente los vecinos de los transbordos sin revisar las 400 posiciones de una matriz.

## DFS, componentes conectados y estaciones críticas

Se agregaron `dfs(inicio, cerradas)` recursivo, `dfsIterativo(inicio, cerradas)` con pila explícita y `componentes(cerradas)`. Ambos recorridos devuelven un `Set` de códigos visitados; las estaciones cerradas se omiten, incluso si se intenta comenzar el recorrido desde una estación cerrada. La búsqueda de vecinos utiliza la lista de adyacencia, por lo que un recorrido y el cálculo de componentes cuestan `O(V + E)`.

### Traza recursiva desde Santo Domingo

Con la red completa, los primeros seis pasos (pila de llamadas desde la raíz hasta la llamada actual) son:

1. `Santo Domingo`
2. `Santo Domingo → Andalucía`
3. `Santo Domingo → Andalucía → Acevedo`
4. `Santo Domingo → Andalucía → Acevedo → Caribe`
5. `Santo Domingo → Andalucía → Acevedo → Caribe → Bello`
6. `Santo Domingo → Andalucía → Acevedo → Caribe → Bello → Niquía`

La traza sigue el orden de vecinos de la lista de adyacencia. Desde Santo Domingo se alcanzan las 20 estaciones; también se comprobó que ambos DFS alcanzan las 20 desde cada estación y que los conjuntos recursivo e iterativo coinciden.

### Cierre de Estadio

Al cerrar Estadio (`56`), el reporte obtiene dos componentes:

- Componente principal (17 estaciones): Niquía, Bello, Acevedo, Andalucía, Santo Domingo, Caribe, Universidad, Hospital, Parque Berrío, San Antonio, Cisneros, Suramericana, Exposiciones, Industriales, Poblado, Itagüí y La Estrella.
- Aisladas del componente principal: **Floresta (58)** y **San Javier (59)**.

Estadio también es crítica: su cierre deja precisamente esos dos componentes.

### Estaciones críticas y justificación

Una estación es crítica si al cerrarla quedan dos o más componentes. Cada grupo de la tabla es un componente conectado independiente que produjo `componentes(new Set([código]))`; los nombres se listan por código para compactar el registro. Las otras estaciones no son críticas porque su cierre deja una sola componente.

| Estación cerrada | Componentes que quedan |
|---|---|
| Bello (20) | `{10}`; `{25, 27, 29, 30, 35, 40, 45, 50, 52, 54, 56, 58, 59, 60, 65, 70, 80, 90}` |
| Caribe (30) | `{10, 20}`; `{35, 40, 45, 50, 52, 54, 56, 58, 59, 60, 65, 70, 80, 90}`; `{25, 27, 29}` |
| Universidad (35) | `{10, 20, 25, 27, 29, 30}`; `{40, 45, 50, 52, 54, 56, 58, 59, 60, 65, 70, 80, 90}` |
| Hospital (40) | `{10, 20, 25, 27, 29, 30, 35}`; `{45, 50, 52, 54, 56, 58, 59, 60, 65, 70, 80, 90}` |
| Industriales (65) | `{10, 20, 25, 27, 29, 30, 35, 40, 45, 50, 52, 54, 56, 58, 59, 60}`; `{70, 80, 90}` |
| Poblado (70) | `{10, 20, 25, 27, 29, 30, 35, 40, 45, 50, 52, 54, 56, 58, 59, 60, 65}`; `{80, 90}` |
| Itagüí (80) | `{10, 20, 25, 27, 29, 30, 35, 40, 45, 50, 52, 54, 56, 58, 59, 60, 65, 70}`; `{90}` |
| Estadio (56) | `{10, 20, 25, 27, 29, 30, 35, 40, 45, 50, 52, 54, 60, 65, 70, 80, 90}`; `{58, 59}` |
| Floresta (58) | `{10, 20, 25, 27, 29, 30, 35, 40, 45, 50, 52, 54, 56, 60, 65, 70, 80, 90}`; `{59}` |
| Acevedo (25) | `{10, 20, 30, 35, 40, 45, 50, 52, 54, 56, 58, 59, 60, 65, 70, 80, 90}`; `{27, 29}` |
| Andalucía (27) | `{10, 20, 25, 30, 35, 40, 45, 50, 52, 54, 56, 58, 59, 60, 65, 70, 80, 90}`; `{29}` |

El barrido prueba el cierre individual de cada vértice, calculando componentes en cada prueba; por eso el análisis completo de criticidad con este método directo cuesta `O(V(V + E))`. La complejidad `O(V + E)` corresponde a cada DFS y a cada cálculo individual de componentes.

## BFS para la ruta con menos paradas

Se implementó `rutaMasCorta(origen, destino, cerradas)` con BFS. La cola es un arreglo con índice de cabeza (sin `shift`, para mantener costo constante por extracción), `visitadas` evita encolar estaciones repetidas y `padres` registra el vértice desde el que se descubrió cada estación. Al llegar al destino, se sigue el mapa de padres hacia atrás y se invierte la secuencia para devolver el camino origen-destino. En esta red no ponderada, BFS garantiza la menor cantidad de conexiones en `O(V + E)`; reconstruir la ruta cuesta `O(V)` en el peor caso.

### Traza BFS desde Niquía hasta San Javier

Cada fila muestra la cola correspondiente a un nivel de distancia desde Niquía. En el último nivel, San Javier es el tercer elemento y el recorrido se detiene cuando sale de la cola:

| Nivel | Cola |
|---:|---|
| 0 | Niquía |
| 1 | Bello |
| 2 | Caribe |
| 3 | Universidad, Acevedo |
| 4 | Hospital, Andalucía |
| 5 | Parque Berrío, Estadio, Santo Domingo |
| 6 | San Antonio, Suramericana, Floresta, Industriales |
| 7 | Exposiciones, Cisneros, San Javier, Poblado |

### Rutas calculadas

| Origen → destino | Camino mínimo | Paradas |
|---|---|---:|
| Niquía → San Javier | Niquía → Bello → Caribe → Universidad → Hospital → Estadio → Floresta → San Javier | 7 |
| Santo Domingo → Poblado | Santo Domingo → Andalucía → Acevedo → Caribe → Universidad → Hospital → Estadio → Industriales → Poblado | 8 |
| La Estrella → Floresta | La Estrella → Itagüí → Poblado → Industriales → Estadio → Floresta | 5 |

La ruta Niquía → San Javier usa la conexión Hospital–Estadio de la línea T. DFS, por el orden de vecinos de la red, primero se interna por Parque Berrío, San Antonio y Exposiciones antes de regresar a Estadio; encuentra un camino válido de 11 paradas. BFS compara por niveles y devuelve el camino de 7 paradas, sin confundir “primer camino encontrado en profundidad” con “camino más corto”.

### Efecto del cierre de Estadio

- **Santo Domingo → Poblado:** pasa de 8 a 10 paradas. Sin el atajo por Estadio–Industriales, la ruta rodea por Hospital → Parque Berrío → San Antonio → Exposiciones → Industriales y continúa a Poblado.
- **Niquía → San Javier:** queda inalcanzable. Estadio es el único acceso a la subred Floresta–San Javier, que queda desconectada cuando se cierra.

### Casos borde

- Si origen y destino son la misma estación abierta, devuelve `[origen]` (cero paradas).
- Si el origen o destino no existe, si alguno está cerrado o si no hay conexión posible, devuelve `null` sin lanzar un error.

## Planificador de viajes v0.2

`src/planificador.js` integra el índice `arbol20` con el grafo: recibe códigos por `process.argv`, valida origen, destino y cierres con `buscar`, calcula la ruta BFS, y presenta nombres, línea de cada tramo, paradas y transbordos. Las aristas guardan la línea mediante `conectar(origen, destino, linea)`; las etiquetas se consultan en ambos sentidos. La opción `--cerradas` acepta uno o más códigos, por ejemplo `node src/planificador.js 29 70 --cerradas 56`. Si el cierre permite rodear, se presenta la ruta alternativa; si desconecta el destino, se informa que el viaje es imposible.

Ejemplo `node src/planificador.js 10 59`: la ruta tiene 7 paradas y cambia de Línea A a Línea T en Hospital, y de Línea T a Línea B en Estadio. Si Estadio (56) está cerrado, Niquía → San Javier es imposible; Santo Domingo → Poblado cambia de 8 a 10 paradas y se desvía por Hospital, Parque Berrío, San Antonio y Exposiciones.

### Estructuras de datos del planificador

| Estructura | Uso | Operación principal y complejidad |
|---|---|---|
| Árbol general | Representar jerárquicamente la red (modos, líneas, estaciones y servicios); es un modelo de organización, no el índice consultado por el planificador. | Buscar un elemento recorriendo el árbol: `O(V)`. |
| Árbol binario de búsqueda | Indexar códigos y validar origen, destino y estaciones cerradas mediante `arbol20.buscar`. | Buscar: `O(h)`; `O(log V)` si está balanceado y `O(V)` en el peor caso. |
| Grafo | Representar estaciones, conexiones no dirigidas y la línea asociada a cada conexión. | Recorrer vecinos cuesta `O(grado(v))`; BFS completo cuesta `O(V + E)`. |
| Cola | Mantener estaciones pendientes en orden FIFO durante BFS; se implementa con arreglo e índice de cabeza. | Encolar y desencolar: `O(1)` por operación; BFS completo: `O(V + E)`. |
| Pila | Guardar estaciones pendientes en DFS iterativo; DFS recursivo utiliza la pila de llamadas. | Apilar/desapilar: `O(1)`; DFS completo: `O(V + E)`. |
| Set | Controlar estaciones visitadas y cerradas sin duplicados. | Consultar/agregar: `O(1)` promedio; forma parte de recorridos `O(V + E)`. |
| Map | Guardar padres en BFS para reconstruir la ruta y etiquetas de línea para cada arista. | Consultar/insertar: `O(1)` promedio; reconstruir la ruta cuesta `O(V)` como máximo. |

## Reto de entrevista: validaciones duplicadas

### Protocolo en voz alta: respuesta del candidato

**Reformulación.** “Recibo validaciones de torniquete y debo detectar cada aparición repetida de una misma tarjeta en la misma estación y en el mismo minuto. La primera validación se conserva y cada repetición posterior se devuelve para corregir su cobro; el total a corregir es la suma del valor de esas repeticiones.”

**Preguntas para el entrevistador.**

- ¿Cuántas validaciones puede haber en un día? No se especifica un límite; asumiré `n` registros y una solución que escale linealmente.
- ¿`hora` ya viene normalizada al minuto? Sí: el dato se entrega como `HH:mm`; segundos no forman parte del criterio.
- Si hay tres registros con la misma clave, ¿se corrigen los dos posteriores? Asumiré que sí: se conserva el primero y cada aparición subsiguiente es un cobro duplicado.
- ¿El valor es numérico y cada validación repetida debe sumar su propio valor? Asumiré valores numéricos en pesos colombianos, como los `$3.000` del ejemplo.

**Casos de prueba y bordes que propongo.**

| Caso | Resultado esperado |
|---|---|
| Una validación y su repetición exacta | La segunda es duplicada. |
| Misma tarjeta/estación, minutos `07:02` y `07:09` | No son duplicadas: cambia la clave temporal. |
| Misma tarjeta y minuto, estaciones distintas | No son duplicadas. |
| Lista vacía o con un solo elemento | Ningún duplicado; monto `$0`. |
| Tres registros con la misma clave | Se devuelven el segundo y el tercero; el primero se conserva. |

**Solución inicial por fuerza bruta.** Para cada registro, compararía tarjeta, estación y minuto con todos los registros anteriores. Si alguno coincide, agregaría el actual una sola vez al resultado y sumaría su valor. El tiempo es `O(n²)` por comparar pares; el espacio adicional es `O(d)` para los `d` duplicados que se devuelven.

**Optimización.** Construyo la clave compuesta con una plantilla de texto `` `${tarjeta}|${estacion}|${hora}` `` y la guardo en un `Set`. Si ya existe, el registro actual es duplicado; si no, guardo la clave. Así cada registro se procesa una vez: tiempo esperado `O(n)` y espacio auxiliar `O(u)`, donde `u` es el número de claves únicas. El arreglo de resultados ocupa además `O(d)`, donde `d` es la cantidad de duplicados. `montoACorregir` suma el `valor` de los registros devueltos; ese segundo recorrido también es lineal, por lo que el tiempo total se mantiene en `O(n)`. Se devuelve cada objeto duplicado posterior, no el primer registro de la pareja.

### Recorrido del ejemplo en voz alta

| # | Clave consultada | Resultado |
|---:|---|---|
| 1 | `T-101|50|07:02` | Nueva; se agrega al `Set`. |
| 2 | `T-205|30|07:02` | Nueva; se agrega al `Set`. |
| 3 | `T-101|50|07:02` | Ya existe; duplicada, sumar `$3.000`. |
| 4 | `T-330|56|07:05` | Nueva; se agrega al `Set`. |
| 5 | `T-205|30|07:09` | Nueva; la hora cambió, no es duplicada. |
| 6 | `T-412|10|07:10` | Nueva; se agrega al `Set`. |
| 7 | `T-330|56|07:05` | Ya existe; duplicada, sumar `$3.000`. |
| 8 | `T-101|60|07:31` | Nueva; estación y hora distintas. |

El resultado son los registros 3 y 7; `montoACorregir` devuelve **$6.000**. El chequeo final cuesta `O(n)` tiempo esperado y `O(u + d)` espacio total, o `O(u)` auxiliar sin contar el arreglo de resultados.

### Rúbrica del simulacro

Escala acordada para esta práctica: 1 = requiere apoyo, 2 = en progreso, 3 = competente, 4 = destacado. Como esta entrega no incluye una entrevista presencial ni comentarios reales de otra persona, la evaluación recibida siguiente es una **simulación de retroalimentación**, no una calificación atribuida a un observador real. Debe confirmarse o reemplazarse después de ejecutar la ronda del trío.

| Criterio | Puntaje simulado | Evidencia / comentario del observador |
|---|---:|---|
| Comprensión | 4/4 | Delimita duplicidad por tarjeta, estación y minuto; distingue la primera validación de las repeticiones posteriores. |
| Diseño | 4/4 | Propone una clave compuesta y un `Set`, y separa detección de cálculo del monto. |
| Corrección | 4/4 | Identifica las filas 3 y 7, no confunde T-205 a las 07:02 y 07:09, y suma el valor de cada aparición posterior. |
| Complejidad | 4/4 | Compara fuerza bruta `O(n²)` con el método esperado `O(n)` y distingue el espacio auxiliar `O(u)` del resultado `O(d)`. |
| Comunicación | 3/4 | Explica el recorrido paso a paso. Oportunidad: confirmar desde el inicio la política para tres o más apariciones y la unidad temporal. |

**Fortaleza recibida (simulada):** la clave representa exactamente las tres dimensiones de identidad y evita contar dos veces el primer cobro. **Oportunidad recibida (simulada):** verbalizar explícitamente qué registro se conserva cuando hay más de dos coincidencias.

**Autoevaluación del candidato:** comprensión 4/4, diseño 4/4, corrección 4/4, complejidad 4/4 y comunicación 3/4. Fortaleza: mantuve el criterio de duplicidad separado del valor monetario y recorrí los ocho registros sin confundir estaciones ni minutos. Mejora: presentar primero la hipótesis de que se conserva la primera aparición y validar la precisión de `hora` antes de codificar.

### Rotación del trío

Cada ronda contempla 20 minutos de resolución y 5 minutos de retroalimentación. La siguiente rotación garantiza un turno de candidato por integrante; los rótulos son marcadores y deben sustituirse por los nombres del trío. La ejecución real no se puede verificar desde este repositorio.

| Ronda | Entrevistador | Candidato | Observador |
|---:|---|---|---|
| 1 | Integrante 2 | Integrante 1 | Integrante 3 |
| 2 | Integrante 3 | Integrante 2 | Integrante 1 |
| 3 | Integrante 1 | Integrante 3 | Integrante 2 |

## Segunda entrevista: demanda y estaciones más usadas

### Protocolo en voz alta: respuesta del candidato

**Reformulación.** “Tengo 20 conteos consecutivos, uno por minuto, desde las 6:00 hasta las 6:19. Debo hallar la ventana de `k` minutos con mayor suma y reportar su minuto de inicio y total. Después debo contar las validaciones agrupadas por estación y devolver las `k` estaciones con mayor frecuencia.”

**Señales del enunciado.** “Minutos consecutivos” indica una ventana deslizante de tamaño fijo: sumo la primera ventana y, al avanzar, agrego el dato nuevo y resto el que sale. “Estaciones más usadas” indica conteo de frecuencias, que guardaré en un `Map`.

**Preguntas para el entrevistador.**

- ¿Los 20 conteos corresponden a minutos sin huecos? Asumo que sí: índice 0 es 6:00 y cada índice avanza un minuto.
- ¿Los extremos de una ventana cuentan ambos? Sí; una ventana de 5 incluye exactamente 5 valores.
- Si dos ventanas empatan, ¿cuál devuelvo? Asumo la primera, conservando el máximo solo cuando aparece una suma estrictamente mayor.
- ¿Las estaciones de las validaciones pertenecen al índice de la red? Para el generador de prueba asumiré que sí; selecciono al azar entre los 20 códigos existentes.
- ¿Cómo se resuelven empates en frecuencias? El ordenamiento conserva el orden de primera aparición de las claves del `Map`.

**Fuerza bruta para la hora pico.** Sumaria cada ventana desde cero: hay `n-k+1` ventanas de `k` valores, por lo que cuesta `O((n-k+1)k)`, que en el peor caso es `O(nk)`. Para las estaciones, contar con un arreglo y volver a buscar cada estación puede costar `O(nu)` para `u` estaciones únicas.

**Optimización comunicada.** Para la demanda, calculo una suma inicial de `k` elementos y luego recorro el resto una sola vez: `suma = suma + nuevo - saliente`. El tiempo es `O(n)` y el espacio auxiliar `O(1)`. Para frecuencias, acumulo en un `Map` en `O(n)` esperado, ordeno las `u` entradas por conteo descendente en `O(u log u)` y tomo las primeras `k`; el total es `O(n + u log u)` tiempo y `O(u)` espacio.

### Recorrido de la ventana deslizante

La ventana inicial, de 6:00 a 6:04, suma `120 + 135 + 150 + 180 + 210 = 795`. En cada paso quito el minuto que sale y agrego el que entra:

| Inicio | Total de la ventana de 5 minutos |
|---|---:|
| 6:00 | 795 |
| 6:01 | 935 |
| 6:02 | 1.110 |
| 6:03 | 1.300 |
| 6:04 | 1.450 |
| 6:05 | 1.540 |
| 6:06 | 1.560 |
| 6:07 | 1.500 |
| 6:08 | 1.400 |
| 6:09 | 1.330 |
| 6:10 | 1.320 |
| 6:11 | 1.360 |
| 6:12 | 1.460 |
| 6:13 | 1.580 |
| 6:14 | **1.630** |
| 6:15 | 1.610 |

Por lo tanto, `horaPico(porMinuto, 5)` devuelve `{ minutoInicio: "6:14", total: 1630 }`. Para `k` positivo que supera el número de datos devuelve `null`; un tamaño no positivo o no entero es inválido.

### Conteo de estaciones y mejora para top 3

El programa genera 50.000 registros con códigos escogidos al azar de `codigosEstaciones20` y calcula las tres estaciones con más validaciones. Los conteos concretos cambian en cada ejecución porque los datos son aleatorios; la función devuelve `{ estacion, cantidad }` ordenados de mayor a menor frecuencia.

Si solo hacen falta las tres primeras, no es necesario ordenar todas las `u` estaciones: después del conteo en `Map`, se puede recorrer sus entradas y mantener un min-heap de tamaño 3. El coste del conteo sigue siendo `O(n)`; mantener el heap cuesta `O(u log 3)`, y el espacio total es `O(u + 3)` por el `Map` y el heap. Se evita ordenar las `u` entradas completas (`O(u log u)`).

### Pistas progresivas y evaluación del segundo simulacro

En esta resolución escrita no hubo bloqueo de más de tres minutos, así que se registran **0 pistas utilizadas**. La entrevista no fue observada ni cronometrada en vivo; esta cifra y la evaluación siguiente describen el simulacro textual y deben contrastarse con el trío real.

Escala: 1 = requiere apoyo, 2 = en progreso, 3 = competente, 4 = destacado. La evaluación recibida es **simulada**, no se atribuye a un compañero real.

| Criterio | Puntaje simulado | Evidencia / comentario del observador |
|---|---:|---|
| Comprensión | 4/4 | Reconoce la ventana deslizante y el conteo de frecuencias a partir de las señales del enunciado. |
| Diseño | 4/4 | Mantiene una suma incremental y usa `Map` más ordenamiento para el ranking. |
| Corrección | 4/4 | Devuelve 6:14 y 1.630; el generador selecciona estaciones del índice de la red. |
| Complejidad | 4/4 | Distingue `O(n)` de la ventana, `O(n + u log u)` del ordenamiento y propone heap `O(n + u log 3)` para top 3. |
| Comunicación | 3/4 | Explica la actualización del total paso a paso. Oportunidad: precisar el comportamiento de ventanas/frecuencias empatadas antes de implementar. |

**Fortaleza recibida (simulada):** reconoció rápidamente las dos señales y justificó por qué se resta el valor que sale de la ventana. **Oportunidad recibida (simulada):** aclarar primero las reglas de empate y cómo se interpretan los minutos faltantes.

**Autoevaluación:** comprensión 4/4, diseño 4/4, corrección 4/4, complejidad 4/4 y comunicación 3/4. Fortaleza: mantuve el algoritmo de ventana en una sola pasada y contrasté la solución ordenada con una alternativa top 3. Mejora: presentar los costes en función de `n` y `u` desde el principio y confirmar si los datos de minutos son contiguos.

### Rotación del trío

Se conserva el formato del MiniReto 9: 20 minutos para resolver y 5 para retroalimentar. Para rotar respecto a la ronda anterior, el orden planeado de candidatos es Integrante 2, Integrante 3 e Integrante 1; sustituir los rótulos por los nombres del equipo y registrar la participación real.