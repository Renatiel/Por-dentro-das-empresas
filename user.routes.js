const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { favoritos } = require("./company.routes");
const data = require("../services/mockData");

router.get("/empresas", requireAuth, (req, res) => {
  const cnpjs = [...(favoritos.get(req.usuario.email) || [])];
  const empresas = cnpjs.map((cnpj) => data.buscarPorCnpj(cnpj)).filter(Boolean);
  res.json(empresas);
});

router.get("/alertas", requireAuth, (_req, res) => {
  // Sem alertas gerados ainda neste protótipo — a tabela `alertas` já existe
  // no schema (ver README) e o serviço de notificação por e-mail é o
  // próximo ponto de extensão.
  res.json([]);
});

module.exports = router;
