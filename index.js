const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define("Usuario", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nome: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  senhaHash: DataTypes.STRING,
  receberEmails: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: "usuarios", timestamps: false });

const Empresa = sequelize.define("Empresa", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  cnpj: { type: DataTypes.STRING, unique: true },
  razaoSocial: DataTypes.STRING,
  nomeFantasia: DataTypes.STRING,
  situacaoCadastral: DataTypes.STRING,
  dataAbertura: DataTypes.DATEONLY,
  naturezaJuridica: DataTypes.STRING,
  porte: DataTypes.STRING,
  capitalSocial: DataTypes.DECIMAL(18, 2),
  endereco: DataTypes.STRING,
  municipio: DataTypes.STRING,
  estado: DataTypes.STRING(2),
  cnaePrincipal: DataTypes.STRING,
  segmento: DataTypes.STRING,
  descricao: DataTypes.TEXT,
  regimeTributario: DataTypes.STRING,
  numeroFuncionarios: DataTypes.INTEGER,
}, { tableName: "empresas", timestamps: false });

const DadoFinanceiro = sequelize.define("DadoFinanceiro", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  periodo: DataTypes.STRING(7),
  tipo: DataTypes.STRING(10),
  receita: DataTypes.DECIMAL(18, 2),
  despesas: DataTypes.DECIMAL(18, 2),
  lucro: DataTypes.DECIMAL(18, 2),
  ativos: DataTypes.DECIMAL(18, 2),
  passivos: DataTypes.DECIMAL(18, 2),
  patrimonioLiquido: DataTypes.DECIMAL(18, 2),
}, { tableName: "dados_financeiros", timestamps: false });

const Balanco = sequelize.define("Balanco", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  periodo: DataTypes.STRING(7),
  ativoCirculante: DataTypes.DECIMAL(18, 2),
  ativoNaoCirculante: DataTypes.DECIMAL(18, 2),
  passivoCirculante: DataTypes.DECIMAL(18, 2),
  passivoNaoCirculante: DataTypes.DECIMAL(18, 2),
  capitalSocial: DataTypes.DECIMAL(18, 2),
  reservas: DataTypes.DECIMAL(18, 2),
  lucrosAcumulados: DataTypes.DECIMAL(18, 2),
}, { tableName: "balancos", timestamps: false });

const Tributo = sequelize.define("Tributo", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  tipo: DataTypes.STRING,
  periodo: DataTypes.STRING(7),
  valor: DataTypes.DECIMAL(18, 2),
  situacao: DataTypes.STRING,
}, { tableName: "tributos", timestamps: false });

const Fonte = sequelize.define("Fonte", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  tipo: DataTypes.STRING,
  url: DataTypes.STRING,
  confiabilidade: DataTypes.STRING,
}, { tableName: "fontes", timestamps: false });

Empresa.hasMany(DadoFinanceiro, { foreignKey: "empresaId" });
Empresa.hasMany(Balanco, { foreignKey: "empresaId" });
Empresa.hasMany(Tributo, { foreignKey: "empresaId" });
Empresa.hasMany(Fonte, { foreignKey: "empresaId" });
Usuario.belongsToMany(Empresa, { through: "favoritos" });
Empresa.belongsToMany(Usuario, { through: "favoritos" });

module.exports = { sequelize, Usuario, Empresa, DadoFinanceiro, Balanco, Tributo, Fonte };
