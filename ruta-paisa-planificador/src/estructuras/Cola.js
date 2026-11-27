class NodoCola {
  constructor(valor) {
    this.valor = valor;
    this.siguiente = null;
  }
}

class Cola {
  constructor() {
    this.frente = null;
    this.final = null;
    this.cantidad = 0;
  }

  encolar(valor) {
    const nodo = new NodoCola(valor);
    if (this.final === null) {
      this.frente = nodo;
      this.final = nodo;
    } else {
      this.final.siguiente = nodo;
      this.final = nodo;
    }
    this.cantidad++;
  }

  desencolar() {
    if (this.frente === null) return null;

    const nodo = this.frente;
    this.frente = nodo.siguiente;
    this.cantidad--;
    if (this.frente === null) this.final = null;
    return nodo.valor;
  }

  verFrente() {
    return this.frente === null ? null : this.frente.valor;
  }

  estaVacia() {
    return this.frente === null;
  }

  tamanio() {
    return this.cantidad;
  }

  contenido() {
    const valores = [];
    for (let nodo = this.frente; nodo !== null; nodo = nodo.siguiente) {
      valores.push(nodo.valor);
    }
    return valores;
  }
}

module.exports = Cola;
