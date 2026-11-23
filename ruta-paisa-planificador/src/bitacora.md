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