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

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    NodoBinario,
    ArbolBusqueda,
    codigosEstaciones,
    estacionesRed
  };
}
