# Libro Abierto - Catálogo v1.0

Libro Abierto es un catálogo demostrativo de una red de bibliotecas. Integra búsquedas exactas y por prefijo, rankings, exhibiciones y algoritmos propios de ordenamiento. Cada libro contiene `isbn`, `titulo`, `autor`, `año` y `prestamos`.

## Ejecución

Desde la carpeta `libro-abierto-catalogo`:

```bash
node src/catalogo.js
```

Ejecuta el laboratorio de rendimiento:

```bash
node src/laboratorio.js
```

Requisitos: Node.js.

## Demostración v1.0

`src/catalogo.js` genera 10.000 libros y muestra:

- Consulta lineal por título y por autor.
- Consulta binaria por ISBN.
- Ranking Top-10 por préstamos.
- Autocompletar por tres prefijos.
- Exhibición ordenada por año.
- Copias ordenadas por ISBN y título mediante Merge Sort.

## Tabla de algoritmos

| Algoritmo | Complejidad promedio | Mejor caso | Peor caso | Estabilidad | Uso en Libro Abierto |
|---|---|---|---|---|---|
| Búsqueda lineal | O(n) | O(1) | O(n) | No aplica | Título y autor |
| Búsqueda binaria | O(log n) | O(1) | O(log n) | No aplica | ISBN y prefijo |
| Bubble Sort | O(n²) | O(n) optimizado | O(n²) | Estable | Línea base y exhibición pequeña |
| Selection Sort | O(n²) | O(n²) | O(n²) | Inestable | Comparativo del laboratorio |
| Insertion Sort | O(n²) | O(n) | O(n²) | Estable | Inserción diaria |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | Estable | Copias por ISBN/título y Top-K |
| Quick Sort mediana de tres | O(n log n) esperado | O(n log n) | O(n²) evitado por medianas | Inestable | Alternativa en equipos con poca memoria |

## Decisiones técnicas

- **Reordenamiento nocturno de 10.000 libros:** usar Merge Sort. Sus comparaciones crecen como n log n y conserva estabilidad. Insertion Sort puede ser útil si la red entrega un catálogo casi ordenado, pero no garantiza ese rendimiento sin esa condición.
- **Inserción diaria:** mantener el catálogo casi ordenado y usar Insertion Sort. Cuando llegan pocas novedades al final, las comparaciones son cercanas a lineales y no requiere memoria adicional proporcional al catálogo.
- **Listas pequeñas de exhibición:** usar Bubble Sort o Insertion Sort para 20 elementos. La diferencia sobre casos grandes no compensa su sencillez didáctica; para rankings generales se usan Merge Sort o selección parcial según k.
