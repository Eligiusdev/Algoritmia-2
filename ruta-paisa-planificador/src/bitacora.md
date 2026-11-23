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