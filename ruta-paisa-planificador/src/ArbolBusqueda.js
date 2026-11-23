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
}

const arbolEstaciones = new ArbolBusqueda();

const estaciones = [
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
];

for (const [codigo, estacion] of estaciones) {
  arbolEstaciones.insertar(codigo, estacion);
}

console.log("50:", arbolEstaciones.buscar(50));
console.log("59:", arbolEstaciones.buscar(59));
console.log("10:", arbolEstaciones.buscar(10));
console.log("45:", arbolEstaciones.buscar(45));
console.log("33:", arbolEstaciones.buscar(33));

if (typeof module !== "undefined" && module.exports) {
  module.exports = { NodoBinario, ArbolBusqueda };
}
