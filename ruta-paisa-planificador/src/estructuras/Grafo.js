const Cola = require("./Cola");

class Grafo {
  constructor() {
    this.adyacencia = new Map();
    this.lineasPorConexion = new Map();
  }

  agregarEstacion(codigo) {
    if (!this.adyacencia.has(codigo)) {
      this.adyacencia.set(codigo, new Set());
      this.lineasPorConexion.set(codigo, new Map());
    }
  }

  conectar(a, b, linea = null) {
    this.agregarEstacion(a);
    this.agregarEstacion(b);

    if (a !== b) {
      this.adyacencia.get(a).add(b);
      this.adyacencia.get(b).add(a);

      if (linea !== null) {
        const lineasDesdeA = this.lineasPorConexion.get(a);
        const lineasDesdeB = this.lineasPorConexion.get(b);
        if (!lineasDesdeA.has(b)) lineasDesdeA.set(b, new Set());
        if (!lineasDesdeB.has(a)) lineasDesdeB.set(a, new Set());
        lineasDesdeA.get(b).add(linea);
        lineasDesdeB.get(a).add(linea);
      }
    }
  }

  vecinos(codigo) {
    if (!this.adyacencia.has(codigo)) return [];
    return [...this.adyacencia.get(codigo)];
  }

  lineasDeConexion(a, b) {
    return [...(this.lineasPorConexion.get(a)?.get(b) || [])];
  }

  dfs(inicio, cerradas = new Set(), alVisitar = null) {
    const visitadas = new Set();
    const pilaLlamadas = [];

    const recorrer = (codigo) => {
      if (cerradas.has(codigo) || visitadas.has(codigo)) return;

      visitadas.add(codigo);
      pilaLlamadas.push(codigo);
      if (alVisitar) alVisitar(codigo, pilaLlamadas);

      for (const vecino of this.vecinos(codigo)) {
        recorrer(vecino);
      }

      pilaLlamadas.pop();
    };

    recorrer(inicio);
    return visitadas;
  }

  dfsIterativo(inicio, cerradas = new Set()) {
    const visitadas = new Set();
    if (cerradas.has(inicio) || !this.adyacencia.has(inicio)) return visitadas;

    const pila = [inicio];
    while (pila.length > 0) {
      const codigo = pila.pop();
      if (cerradas.has(codigo) || visitadas.has(codigo)) continue;

      visitadas.add(codigo);
      for (const vecino of this.vecinos(codigo)) {
        if (!cerradas.has(vecino) && !visitadas.has(vecino)) {
          pila.push(vecino);
        }
      }
    }

    return visitadas;
  }

  componentes(cerradas = new Set()) {
    const visitadas = new Set(cerradas);
    const componentes = [];

    for (const codigo of this.adyacencia.keys()) {
      if (visitadas.has(codigo)) continue;

      const componente = this.dfsIterativo(codigo, cerradas);
      componentes.push(componente);
      for (const estacion of componente) {
        visitadas.add(estacion);
      }
    }

    return componentes;
  }

  estacionesCriticas() {
    const criticas = [];
    for (const codigo of this.adyacencia.keys()) {
      const componentes = this.componentes(new Set([codigo]));
      if (componentes.length >= 2) {
        criticas.push({ codigo, componentes });
      }
    }
    return criticas;
  }

  rutaMasCorta(origen, destino, cerradas = new Set(), alProcesarNivel = null) {
    if (
      !this.adyacencia.has(origen) ||
      !this.adyacencia.has(destino) ||
      cerradas.has(origen) ||
      cerradas.has(destino)
    ) {
      return null;
    }

    const visitadas = new Set([origen]);
    const padres = new Map([[origen, null]]);
    const cola = new Cola();
    cola.encolar(origen);
    let nivel = 0;

    while (!cola.estaVacia()) {
      const estacionesEnNivel = cola.tamanio();
      if (alProcesarNivel) {
        alProcesarNivel(nivel, cola.contenido());
      }

      for (let indice = 0; indice < estacionesEnNivel; indice++) {
        const actual = cola.desencolar();
        if (actual === destino) {
          const camino = [];
          let estacion = destino;
          while (estacion !== null) {
            camino.push(estacion);
            estacion = padres.get(estacion);
          }
          return camino.reverse();
        }

        for (const vecino of this.vecinos(actual)) {
          if (cerradas.has(vecino) || visitadas.has(vecino)) continue;
          visitadas.add(vecino);
          padres.set(vecino, actual);
          cola.encolar(vecino);
        }
      }

      nivel++;
    }

    return null;
  }

  grado(codigo) {
    if (!this.adyacencia.has(codigo)) return 0;
    return this.adyacencia.get(codigo).size;
  }

  contarEstaciones() {
    return this.adyacencia.size;
  }

  contarConexiones() {
    let sumaGrados = 0;
    for (const codigo of this.adyacencia.keys()) {
      sumaGrados += this.grado(codigo);
    }
    return sumaGrados / 2;
  }

  transbordos() {
    const estaciones = [];
    for (const codigo of this.adyacencia.keys()) {
      if (this.grado(codigo) > 2) {
        estaciones.push(codigo);
      }
    }
    return estaciones;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = Grafo;
}
