const SIN_VISITAR = 0;
const EN_PROCESO = 1;
const TERMINADA = 2;

class GrafoDirigido {
  constructor() {
    this.adyacencia = new Map();
  }

  agregarTarea(tarea) {
    if (!this.adyacencia.has(tarea)) {
      this.adyacencia.set(tarea, new Set());
    }
  }

  conectar(origen, destino) {
    this.agregarTarea(origen);
    this.agregarTarea(destino);
    this.adyacencia.get(origen).add(destino);
  }

  vecinos(tarea) {
    return [...(this.adyacencia.get(tarea) || [])];
  }

  _normalizarCiclo(ciclo) {
    const posiciones = new Map();
    let posicion = 0;
    for (const tarea of this.adyacencia.keys()) {
      posiciones.set(tarea, posicion++);
    }

    const tareas = ciclo.slice(0, -1);
    let inicio = 0;
    for (let indice = 1; indice < tareas.length; indice++) {
      if (posiciones.get(tareas[indice]) < posiciones.get(tareas[inicio])) {
        inicio = indice;
      }
    }

    const rotado = [...tareas.slice(inicio), ...tareas.slice(0, inicio)];
    return [...rotado, rotado[0]];
  }

  _analizar() {
    const estados = new Map();
    const pila = [];
    const finalizacion = [];

    const visitar = (tarea) => {
      estados.set(tarea, EN_PROCESO);
      pila.push(tarea);

      for (const vecino of this.adyacencia.get(tarea)) {
        const estado = estados.get(vecino) ?? SIN_VISITAR;
        if (estado === EN_PROCESO) {
          return this._normalizarCiclo([
            ...pila.slice(pila.indexOf(vecino)),
            vecino
          ]);
        }
        if (estado === SIN_VISITAR) {
          const ciclo = visitar(vecino);
          if (ciclo) return ciclo;
        }
      }

      pila.pop();
      estados.set(tarea, TERMINADA);
      finalizacion.push(tarea);
      return null;
    };

    for (const tarea of this.adyacencia.keys()) {
      if ((estados.get(tarea) ?? SIN_VISITAR) === SIN_VISITAR) {
        const ciclo = visitar(tarea);
        if (ciclo) return { ciclo, finalizacion: [] };
      }
    }

    return { ciclo: null, finalizacion };
  }

  tieneCiclo() {
    return this._analizar().ciclo;
  }

  ordenDeEjecucion() {
    const { ciclo, finalizacion } = this._analizar();
    if (ciclo) {
      throw new Error(`No hay orden válido; dependencias cíclicas: ${ciclo.join(" -> ")}`);
    }
    return finalizacion.reverse();
  }
}

module.exports = GrafoDirigido;
