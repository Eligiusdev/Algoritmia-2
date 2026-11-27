const { ejecutar } = require("./dominio/planificador");

if (require.main === module) {
  process.exitCode = ejecutar(process.argv.slice(2));
}

module.exports = { ejecutar };
