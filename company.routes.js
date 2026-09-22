const router = require("express").Router();
const { optionalAuth, requireAuth } = require("../middleware/auth");
const data = require("../services/mockData");

// Favoritos em memória: usuário -> Set(cnpj). Em produção: tabela `favoritos`.
const favoritos = new Map();

router.get("/", (req, res) => {
  const resultado = data.buscarEmpresas(req.query.q);
  res.json(resultado);
});

router.get("/:cnpj", optionalAuth, (req, res) => {
  const empresa = data.buscarPorCnpj(req.params.cnpj);
  if (!empresa) {
    return res.status(404).json({ erro: "Empresa não encontrada." });
  }

  // Visitante: dados cadastrais básicos. Logado: mesmo bloco + flag de acesso completo.
  const base = { ...empresa, acessoCompleto: Boolean(req.usuario) };
  res.json(base);
});

router.get("/:cnpj/financeiro", optionalAuth, (req, res) => {
  const historico = data.financeiro[req.params.cnpj];
  if (!historico) {
    return res.status(404).json({ erro: "Dados não disponíveis." });
  }

  if (!req.usuario) {
    // Visitante: só o indicador mais recente, sem histórico completo.
    const ultimo = historico.anual[historico.anual.length - 1];
    return res.json({
      resumo: ultimo,
      mensagem: "Faça login para acessar a análise financeira completa desta empresa.",
    });
  }

  res.json(historico);
});

router.get("/:cnpj/balanco", requireAuth, (req, res) => {
  const balanco = data.balanco[req.params.cnpj];
  if (!balanco) {
    return res.status(404).json({ erro: "Dados não disponíveis na fonte consultada." });
  }
  res.json(balanco);
});

router.get("/:cnpj/tributos", requireAuth, (req, res) => {
  const tributos = data.tributos[req.params.cnpj];
  if (!tributos) {
    return res.status(404).json({ erro: "Informação não disponível na fonte consultada." });
  }
  res.json(tributos);
});

router.get("/:cnpj/fontes", (req, res) => {
  res.json(data.fontes[req.params.cnpj] || []);
});

router.post("/:cnpj/acompanhar", requireAuth, (req, res) => {
  const email = req.usuario.email;
  if (!favoritos.has(email)) favoritos.set(email, new Set());
  favoritos.get(email).add(req.params.cnpj);
  res.status(201).json({ mensagem: "Empresa adicionada aos favoritos." });
});

router.delete("/:cnpj/acompanhar", requireAuth, (req, res) => {
  favoritos.get(req.usuario.email)?.delete(req.params.cnpj);
  res.json({ mensagem: "Empresa removida dos favoritos." });
});

module.exports = { router, favoritos };
