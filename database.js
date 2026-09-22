const { Sequelize } = require("sequelize");

// Só é usado quando USE_MOCK_DATA=false. O protótipo roda hoje inteiramente
// com backend/src/services/mockData.js para não depender de um Postgres.
const sequelize = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost:5432/por_dentro_das_empresas",
  { logging: false }
);

module.exports = sequelize;
