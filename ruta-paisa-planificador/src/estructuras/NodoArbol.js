class NodoArbol {
  constructor(valor) {
    this.valor = valor;
    this.hijos = [];
  }

  agregarHijo(nodo) {
    this.hijos.push(nodo);
    return nodo;
  }
}

const datosRed = [
  // 1. TRENES (METRO) - Línea A (21 estaciones)
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Niquía",
    servicios: [
      "Punto de Atención al Cliente (PAC)",
      "Máquinas de recarga Cívica",
      "Parqueadero de bicicletas",
      "Baños públicos",
      "BiblioMetro",
      "Elementos de accesibilidad",
      "Cajeros electrónicos y locales comerciales"
    ]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Bello",
    servicios: [
      "Parqueadero de bicicletas",
      "Baños públicos",
      "Elementos de accesibilidad",
      "Cajeros electrónicos"
    ]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Madera",
    servicios: [
      "Baños públicos",
      "Elementos de accesibilidad",
      "Cajeros electrónicos"
    ]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Acevedo",
    servicios: [
      "Máquinas de recarga Cívica",
      "BiblioMetro",
      "Elementos de accesibilidad",
      "Cajeros electrónicos",
      "PAC en la conexión de Línea P"
    ]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Tricentenario",
    servicios: [
      "Máquinas de recarga Cívica",
      "Elementos de accesibilidad",
      "Cajeros electrónicos"
    ]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Caribe",
    servicios: [
      "Máquinas de recarga Cívica",
      "Elementos de accesibilidad",
      "Cajeros electrónicos"
    ]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Universidad",
    servicios: [
      "Máquinas de recarga Cívica",
      "Elementos de accesibilidad",
      "Cajeros electrónicos"
    ]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Hospital",
    servicios: ["Cajeros electrónicos"]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Prado",
    servicios: ["Baños públicos", "Elementos de accesibilidad"]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Parque Berrío",
    servicios: [
      "Máquinas de recarga Cívica",
      "Baños públicos",
      "Elementos de accesibilidad",
      "Cajeros electrónicos"
    ]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "San Antonio",
    servicios: [
      "Punto de Atención al Cliente (PAC)",
      "Máquinas de recarga Cívica",
      "Baños públicos",
      "BiblioMetro",
      "Elementos de accesibilidad",
      "Cajeros electrónicos y locales comerciales"
    ]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Alpujarra",
    servicios: ["Baños públicos", "Elementos de accesibilidad"]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Exposiciones",
    servicios: ["Baños públicos", "Elementos de accesibilidad"]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Industriales",
    servicios: ["Elementos de accesibilidad", "Cajeros electrónicos"]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Poblado",
    servicios: ["Parqueadero de bicicletas", "Elementos de accesibilidad"]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Aguacatala",
    servicios: ["Máquinas de recarga Cívica", "Elementos de accesibilidad"]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Ayurá",
    servicios: ["Máquinas de recarga Cívica", "Elementos de accesibilidad"]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Envigado",
    servicios: [
      "Máquinas de recarga Cívica",
      "Parqueadero de bicicletas",
      "Baños públicos",
      "Elementos de accesibilidad",
      "Cajeros electrónicos"
    ]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Itagüí",
    servicios: [
      "Punto de Atención al Cliente (PAC)",
      "Parqueadero de bicicletas",
      "Baños públicos",
      "BiblioMetro",
      "Sala de exposición",
      "Elementos de accesibilidad",
      "Cajeros electrónicos"
    ]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "Sabaneta",
    servicios: ["Elementos de accesibilidad"]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea A (Niquía – La Estrella)",
    estacion: "La Estrella",
    servicios: [
      "Máquinas de recarga",
      "Elementos de accesibilidad (ascensor y escaleras)"
    ]
  },

  // 1B. TRENES (METRO) - Línea B
  {
    modo: "Trenes (Metro)",
    linea: "Línea B (San Antonio – San Javier)",
    estacion: "San Javier",
    servicios: [
      "Punto de Atención al Cliente (PAC)",
      "Máquinas de recarga Cívica",
      "Elementos de accesibilidad",
      "Cajeros electrónicos"
    ]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea B (San Antonio – San Javier)",
    estacion: "Santa Lucía",
    servicios: ["Elementos de accesibilidad", "Cajeros electrónicos"]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea B (San Antonio – San Javier)",
    estacion: "Floresta",
    servicios: ["Parqueadero de bicicletas", "Elementos de accesibilidad"]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea B (San Antonio – San Javier)",
    estacion: "Estadio",
    servicios: [
      "Parqueadero de bicicletas",
      "Baños públicos",
      "Elementos de accesibilidad"
    ]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea B (San Antonio – San Javier)",
    estacion: "Suramericana",
    servicios: [
      "Parqueadero de bicicletas",
      "Sala de exposición",
      "Elementos de accesibilidad"
    ]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea B (San Antonio – San Javier)",
    estacion: "Cisneros",
    servicios: ["Elementos de accesibilidad"]
  },
  {
    modo: "Trenes (Metro)",
    linea: "Línea B (San Antonio – San Javier)",
    estacion: "San Antonio (Línea B)",
    servicios: [
      "Elementos de accesibilidad",
      "Conexión Línea A: PAC, baños, BiblioMetro, cajeros y locales comerciales"
    ]
  },

  // 2. CABLES AÉREOS (METROCABLE)
  // Línea K
  {
    modo: "Cables aéreos (Metrocable)",
    linea: "Línea K (Acevedo – Santo Domingo)",
    estacion: "Acevedo",
    servicios: [
      "Máquinas de recarga Cívica",
      "BiblioMetro",
      "Elementos de accesibilidad",
      "Cajeros electrónicos"
    ]
  },
  {
    modo: "Cables aéreos (Metrocable)",
    linea: "Línea K (Acevedo – Santo Domingo)",
    estacion: "Andalucía",
    servicios: ["Elementos de accesibilidad"]
  },
  {
    modo: "Cables aéreos (Metrocable)",
    linea: "Línea K (Acevedo – Santo Domingo)",
    estacion: "Popular",
    servicios: ["Elementos de accesibilidad"]
  },
  {
    modo: "Cables aéreos (Metrocable)",
    linea: "Línea K (Acevedo – Santo Domingo)",
    estacion: "Santo Domingo",
    servicios: ["Elementos de accesibilidad", "Cajeros electrónicos"]
  },

  // Línea J
  {
    modo: "Cables aéreos (Metrocable)",
    linea: "Línea J (San Javier – La Aurora)",
    estacion: "San Javier",
    servicios: [
      "Punto de Atención al Cliente (PAC)",
      "Máquinas de recarga Cívica",
      "Elementos de accesibilidad",
      "Cajeros electrónicos"
    ]
  },
  {
    modo: "Cables aéreos (Metrocable)",
    linea: "Línea J (San Javier – La Aurora)",
    estacion: "Juan XXIII",
    servicios: ["Elementos de accesibilidad"]
  },
  {
    modo: "Cables aéreos (Metrocable)",
    linea: "Línea J (San Javier – La Aurora)",
    estacion: "Vallejuelos",
    servicios: ["Elementos de accesibilidad", "Sala de cómputo"]
  },
  {
    modo: "Cables aéreos (Metrocable)",
    linea: "Línea J (San Javier – La Aurora)",
    estacion: "La Aurora",
    servicios: ["Elementos de accesibilidad"]
  },

  // Línea P
  ...["Acevedo", "SENA", "Doce de Octubre", "El Progreso"].map((nombre) => ({
    modo: "Cables aéreos (Metrocable)",
    linea: "Línea P (Acevedo – El Progreso)",
    estacion: nombre,
    servicios:
      nombre === "Acevedo"
        ? [
            "Elementos de accesibilidad",
            "Taquillas de recarga",
            "PAC y cajeros en zona de transferencia"
          ]
        : ["Elementos de accesibilidad", "Taquillas de recarga"]
  })),

  // Línea H
  ...["Oriente", "Las Torres", "Villa Sierra"].map((nombre) => ({
    modo: "Cables aéreos (Metrocable)",
    linea: "Línea H (Oriente – Villa Sierra)",
    estacion: nombre,
    servicios: ["Elementos de accesibilidad", "Taquillas de atención"]
  })),

  // Línea M
  ...["Miraflores", "El Pinal", "Trece de Noviembre"].map((nombre) => ({
    modo: "Cables aéreos (Metrocable)",
    linea: "Línea M (Miraflores – Trece de Noviembre)",
    estacion: nombre,
    servicios: ["Elementos de accesibilidad", "Taquillas de recarga"]
  })),

  // Línea L
  {
    modo: "Cables aéreos (Metrocable)",
    linea: "Línea L (Santo Domingo – Arví)",
    estacion: "Santo Domingo",
    servicios: [
      "Elementos de accesibilidad",
      "Taquillas especiales (turísticos/residenciales)",
      "Cajeros electrónicos en módulo urbano"
    ]
  },
  {
    modo: "Cables aéreos (Metrocable)",
    linea: "Línea L (Santo Domingo – Arví)",
    estacion: "Arví",
    servicios: [
      "Elementos de accesibilidad",
      "Taquillas especiales (turísticos/residenciales)"
    ]
  },

  // 3. TRANVÍA - Línea T
  ...["San Antonio", "Miraflores", "Oriente"].map((nombre) => ({
    modo: "Tranvía",
    linea: "Línea T (San Antonio – Oriente)",
    estacion: `Estación ${nombre}`,
    servicios:
      nombre === "San Antonio"
        ? [
            "Plataformas elevadas/a nivel con accesibilidad",
            "Torniquetes de acceso y taquillas",
            "PAC, baños, BiblioMetro y cajeros"
          ]
        : [
            "Plataformas elevadas/a nivel con accesibilidad",
            "Torniquetes de acceso y taquillas"
          ]
  })),
  ...[
    "San José",
    "Pabellón del Agua EPM",
    "Bicentenario",
    "Buenos Aires",
    "Loyola",
    "Alejandro Echavarría"
  ].map((nombre) => ({
    modo: "Tranvía",
    linea: "Línea T (San Antonio – Oriente)",
    estacion: `Parada ${nombre}`,
    servicios: [
      "Rampas de accesibilidad a nivel de calle",
      "Validadores de tarjeta/QR en vehículos"
    ]
  })),

  // 4. BUSES (METROPLÚS)
  // Línea 1
  {
    modo: "Buses (Metroplús)",
    linea: "Línea 1 (Parque Aranjuez – Universidad de Medellín)",
    estacion: "Parque Belén",
    servicios: [
      "Punto de Atención al Cliente (PAC)",
      "Máquinas de recarga Cívica",
      "Parqueadero de bicicletas",
      "Baños públicos",
      "BiblioMetro",
      "Elementos de accesibilidad",
      "Cajeros electrónicos y locales comerciales"
    ]
  },
  ...["Hospital", "Industriales"].map((nombre) => ({
    modo: "Buses (Metroplús)",
    linea: "Línea 1 (Parque Aranjuez – Universidad de Medellín)",
    estacion: nombre,
    servicios: ["Elementos de accesibilidad", "Cajeros electrónicos"]
  })),
  ...[
    "Parque Aranjuez",
    "Berlín",
    "Las Esmeraldas",
    "Manrique",
    "Gardel",
    "Palos Verdes",
    "Ruta N – U. de A.",
    "Chagualo",
    "Minorista",
    "Cisneros",
    "Plaza Mayor",
    "Nutibara",
    "Fátima",
    "Rosales",
    "La Palma",
    "Los Alpes",
    "U. de M."
  ].map((nombre) => ({
    modo: "Buses (Metroplús)",
    linea: "Línea 1 (Parque Aranjuez – Universidad de Medellín)",
    estacion: nombre,
    servicios: [
      "Elementos de accesibilidad (rampas y puertas a nivel)",
      "Puntos de recarga"
    ]
  })),
  {
    modo: "Buses (Metroplús)",
    linea: "Línea 1 (Parque Aranjuez – Universidad de Medellín)",
    estacion: "San Pedro (Fuera de servicio)",
    servicios: ["Estación temporalmente fuera de servicio"]
  },

  // Línea 2
  {
    modo: "Buses (Metroplús)",
    linea: "Línea 2 (Parque Aranjuez – Universidad de Medellín vía Av. Oriental)",
    estacion: "Industriales",
    servicios: ["Elementos de accesibilidad", "Cajeros electrónicos"]
  },
  ...[
    "Parque Aranjuez",
    "Berlín",
    "Las Esmeraldas",
    "Gardel",
    "Palos Verdes",
    "Catedral",
    "La Playa",
    "San José",
    "Barrio Colón",
    "Perpetuo Socorro",
    "Barrio Colombia",
    "Nutibara",
    "Fátima",
    "Rosales",
    "Parque Belén",
    "La Palma",
    "Los Alpes",
    "U. de M."
  ].map((nombre) => ({
    modo: "Buses (Metroplús)",
    linea: "Línea 2 (Parque Aranjuez – Universidad de Medellín vía Av. Oriental)",
    estacion: nombre,
    servicios: [
      "Elementos de accesibilidad (plataformas a nivel / acceso en paraderos)"
    ]
  })),

  // Línea O
  ...[
    "Caribe",
    "Universal",
    "Córdoba",
    "Pilarica",
    "Ciudadela Universitaria",
    "Facultad de Minas",
    "Los Colores",
    "Calasanz",
    "Floresta",
    "Los Pinos",
    "Laureles",
    "Santa Gema",
    "Villa de Aburrá",
    "La Palma"
  ].map((nombre) => ({
    modo: "Buses (Metroplús)",
    linea: "Línea O (Caribe – La Palma)",
    estacion: nombre,
    servicios:
      nombre === "Caribe"
        ? [
            "Señalética y paradero accesible a nivel de andén",
            "Validación electrónica al abordar bus eléctrico",
            "Enlace con máquinas de recarga y cajeros de estación férrea"
          ]
        : [
            "Señalética y paradero accesible a nivel de andén",
            "Validación electrónica al abordar bus eléctrico"
          ]
  }))
];

function construirArbolRed(registros) {
  const raiz = new NodoArbol("Red Ruta Paisa");
  const mapaModos = new Map();
  const mapaLineas = new Map();

  for (const item of registros) {
    if (!mapaModos.has(item.modo)) {
      const nodoModo = new NodoArbol(item.modo);
      mapaModos.set(item.modo, nodoModo);
      raiz.agregarHijo(nodoModo);
    }
    const nodoModo = mapaModos.get(item.modo);

    const claveLinea = `${item.modo}::${item.linea}`;
    if (!mapaLineas.has(claveLinea)) {
      const nodoLinea = new NodoArbol(item.linea);
      mapaLineas.set(claveLinea, nodoLinea);
      nodoModo.agregarHijo(nodoLinea);
    }
    const nodoLinea = mapaLineas.get(claveLinea);

    const nodoEstacion = new NodoArbol(item.estacion);
    for (const servicio of item.servicios) {
      nodoEstacion.agregarHijo(new NodoArbol(servicio));
    }

    nodoLinea.agregarHijo(nodoEstacion);
  }

  return raiz;
}

function imprimirArbol(nodo, nivel = 0) {
  if (!nodo) return;
  console.log(`${"  ".repeat(nivel)}- ${nodo.valor}`);
  for (const hijo of nodo.hijos) {
    imprimirArbol(hijo, nivel + 1);
  }
}

function contarNodos(nodo) {
  if (!nodo) return 0;
  let total = 1;
  for (const hijo of nodo.hijos) {
    total += contarNodos(hijo);
  }
  return total;
}

function contarHojas(nodo) {
  if (!nodo) return 0;
  if (nodo.hijos.length === 0) return 1;
  let hojas = 0;
  for (const hijo of nodo.hijos) {
    hojas += contarHojas(hijo);
  }
  return hojas;
}

function altura(nodo) {
  if (!nodo || nodo.hijos.length === 0) return 0;
  let maxAltura = 0;
  for (const hijo of nodo.hijos) {
    const h = altura(hijo);
    if (h > maxAltura) maxAltura = h;
  }
  return 1 + maxAltura;
}

const arbolRed = construirArbolRed(datosRed);
imprimirArbol(arbolRed);
console.log("Total de nodos:", contarNodos(arbolRed));
console.log("Total de hojas:", contarHojas(arbolRed));
console.log("Altura del árbol:", altura(arbolRed));