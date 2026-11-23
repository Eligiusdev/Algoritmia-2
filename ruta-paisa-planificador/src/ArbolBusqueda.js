class NodoBinario {
  constructor(codigo, estacion) {
    this.codigo = codigo;
    this.estacion = estacion;
    this.izquierdo = null;
    this.derecho = null;
  }
}

class ArbolBusqueda {
  constructor() {
    this.raiz = null;
  }

  insertar(codigo, estacion) {
    if (this.raiz === null) {
      this.raiz = new NodoBinario(codigo, estacion);
      return;
    }

    let actual = this.raiz;

    while (true) {
      if (codigo === actual.codigo) {
        actual.estacion = estacion;
        return;
      }

      if (codigo < actual.codigo) {
        if (actual.izquierdo === null) {
          actual.izquierdo = new NodoBinario(codigo, estacion);
          return;
        }
        actual = actual.izquierdo;
      } else {
        if (actual.derecho === null) {
          actual.derecho = new NodoBinario(codigo, estacion);
          return;
        }
        actual = actual.derecho;
      }
    }
  }

  buscar(codigo) {
    let actual = this.raiz;
    let comparaciones = 0;

    while (actual !== null) {
      comparaciones++;

      if (codigo === actual.codigo) {
        return {
          estacion: actual.estacion,
          comparaciones
        };
      }

      if (codigo < actual.codigo) {
        actual = actual.izquierdo;
      } else {
        actual = actual.derecho;
      }
    }

    return null;
  }

  inorden(callback = () => {}) {
    let visitados = 0;

    const recorrer = (nodo) => {
      if (nodo === null) return;
      recorrer(nodo.izquierdo);
      callback(nodo);
      visitados++;
      recorrer(nodo.derecho);
    };

    recorrer(this.raiz);
    return visitados;
  }

  preorden(callback = () => {}) {
    let visitados = 0;

    const recorrer = (nodo) => {
      if (nodo === null) return;
      callback(nodo);
      visitados++;
      recorrer(nodo.izquierdo);
      recorrer(nodo.derecho);
    };

    recorrer(this.raiz);
    return visitados;
  }

  postorden(callback = () => {}) {
    let visitados = 0;

    const recorrer = (nodo) => {
      if (nodo === null) return;
      recorrer(nodo.izquierdo);
      recorrer(nodo.derecho);
      callback(nodo);
      visitados++;
    };

    recorrer(this.raiz);
    return visitados;
  }

  altura() {
    const calcular = (nodo) => {
      if (nodo === null) return -1;
      return 1 + Math.max(calcular(nodo.izquierdo), calcular(nodo.derecho));
    };

    return calcular(this.raiz);
  }

  contarHojas() {
    const contar = (nodo) => {
      if (nodo === null) return 0;
      if (nodo.izquierdo === null && nodo.derecho === null) return 1;
      return contar(nodo.izquierdo) + contar(nodo.derecho);
    };

    return contar(this.raiz);
  }

  contarNodos() {
    let total = 0;
    this.inorden(() => total++);
    return total;
  }
}

const arbolEstaciones = new ArbolBusqueda();

const codigosEstaciones = new Map([
  [50, "San Antonio"],
  [30, "Caribe"],
  [70, "Poblado"],
  [20, "Bello"],
  [40, "Hospital"],
  [60, "Exposiciones"],
  [80, "Itagüí"],
  [10, "Niquía"],
  [25, "Acevedo"],
  [35, "Universidad"],
  [45, "Parque Berrío"],
  [52, "Cisneros"],
  [56, "Estadio"],
  [65, "Industriales"],
  [90, "La Estrella"],
  [27, "Andalucía"],
  [29, "Santo Domingo"],
  [54, "Suramericana"],
  [58, "Floresta"],
  [59, "San Javier"]
]);

const codigosEstaciones20 = new Map(codigosEstaciones);

const arbol20 = new ArbolBusqueda();
for (const [codigo, estacion] of codigosEstaciones20) {
  arbol20.insertar(codigo, estacion);
}

const codigosInorden = [];
arbol20.inorden((nodo) => codigosInorden.push(nodo.codigo));

const codigosPreorden = [];
arbol20.preorden((nodo) => codigosPreorden.push(nodo.codigo));

const arbolReconstruido = new ArbolBusqueda();
for (let i = 0; i < codigosPreorden.length; i++) {
  const codigo = codigosPreorden[i];
  arbolReconstruido.insertar(codigo, codigosEstaciones20.get(codigo));
}

function forma(nodo) {
  if (nodo === null) return null;
  return [nodo.codigo, forma(nodo.izquierdo), forma(nodo.derecho)];
}

const codigosPostorden = [];
const nodosPostorden = arbol20.postorden((nodo) => codigosPostorden.push(nodo.codigo));
const formaCoincide = JSON.stringify(forma(arbol20.raiz)) ===
  JSON.stringify(forma(arbolReconstruido.raiz));
const altura20 = arbol20.altura();
const alturaMinima20 = Math.ceil(Math.log2(20 + 1)) - 1;

const estacionesRed = [
  "Niquía", "Bello", "Madera", "Acevedo", "Tricentenario", "Caribe",
  "Universidad", "Hospital", "Prado", "Parque Berrío", "San Antonio",
  "Alpujarra", "Exposiciones", "Industriales", "Poblado", "Aguacatala",
  "Ayurá", "Envigado", "Itagüí", "Sabaneta", "La Estrella", "San Javier",
  "Santa Lucía", "Floresta", "Estadio", "Suramericana", "Cisneros",
  "San Antonio (Línea B)", "Andalucía", "Popular", "Santo Domingo",
  "Juan XXIII", "Vallejuelos", "La Aurora", "SENA", "Doce de Octubre",
  "El Progreso", "Oriente", "Las Torres", "Villa Sierra", "Miraflores",
  "El Pinal", "Trece de Noviembre", "Arví", "Estación San Antonio",
  "Estación Miraflores", "Estación Oriente", "Parada San José",
  "Parada Pabellón del Agua EPM", "Parada Bicentenario",
  "Parada Buenos Aires", "Parada Loyola", "Parada Alejandro Echavarría",
  "Parque Belén", "Parque Aranjuez", "Berlín", "Las Esmeraldas",
  "Manrique", "Gardel", "Palos Verdes", "Ruta N – U. de A.", "Chagualo",
  "Minorista", "Plaza Mayor", "Nutibara", "Fátima", "Rosales",
  "La Palma", "Los Alpes", "U. de M.", "San Pedro (Fuera de servicio)",
  "Catedral", "La Playa", "San José", "Barrio Colón", "Perpetuo Socorro",
  "Barrio Colombia", "Universal", "Córdoba", "Pilarica",
  "Ciudadela Universitaria", "Facultad de Minas", "Los Colores",
  "Calasanz", "Los Pinos", "Laureles", "Santa Gema", "Villa de Aburrá"
];

let siguienteCodigo = 100;
for (const estacion of estacionesRed) {
  if ([...codigosEstaciones.values()].includes(estacion)) continue;
  codigosEstaciones.set(siguienteCodigo, estacion);
  siguienteCodigo++;
}

for (const [codigo, estacion] of codigosEstaciones) {
  arbolEstaciones.insertar(codigo, estacion);
}

console.log("50:", arbolEstaciones.buscar(50));
console.log("59:", arbolEstaciones.buscar(59));
console.log("10:", arbolEstaciones.buscar(10));
console.log("45:", arbolEstaciones.buscar(45));
console.log("100:", arbolEstaciones.buscar(100));
console.log("33:", arbolEstaciones.buscar(33));
console.log("Inorden 20:", codigosInorden);
console.log("Preorden 20:", codigosPreorden);
console.log("Postorden 20:", codigosPostorden);
console.log("Postorden contó:", nodosPostorden);
console.log("Forma reconstruida:", formaCoincide);
console.log("Altura 20:", altura20);
console.log("Hojas 20:", arbol20.contarHojas());
console.log("Altura mínima 20:", alturaMinima20);

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    NodoBinario,
    ArbolBusqueda,
    codigosEstaciones,
    estacionesRed,
    codigosEstaciones20,
    arbol20,
    codigosInorden,
    codigosPreorden,
    codigosPostorden,
    arbolReconstruido,
    formaCoincide,
    forma,
    altura20,
    alturaMinima20
  };
}
