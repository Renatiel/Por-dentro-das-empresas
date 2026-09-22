const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Armazenamento em memória apenas para o protótipo.
// Em produção: tabela `usuarios` via Sequelize (ver backend/src/models).
const usuarios = new Map();

router.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Nome, e-mail e senha são obrigatórios." });
  }
  if (usuarios.has(email)) {
    return res.status(409).json({ erro: "Já existe uma conta com este e-mail." });
  }
  const senhaHash = await bcrypt.hash(senha, 10);
  usuarios.set(email, { nome, email, senhaHash, receberEmails: true });
  return res.status(201).json({ mensagem: "Conta criada. Você já pode fazer login." });
});

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.get(email);
  if (!usuario || !(await bcrypt.compare(senha, usuario.senhaHash))) {
    return res.status(401).json({ erro: "E-mail ou senha inválidos." });
  }
  const token = jwt.sign(
    { email: usuario.email, nome: usuario.nome },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );
  return res.json({ token, usuario: { nome: usuario.nome, email: usuario.email } });
});

router.post("/logout", (_req, res) => {
  // Com JWT stateless, o logout é tratado no cliente (descartar o token).
  // Ponto de extensão para blacklist de tokens, se necessário.
  res.json({ mensagem: "Sessão encerrada." });
});

module.exports = router;
