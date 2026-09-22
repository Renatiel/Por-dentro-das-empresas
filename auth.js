const jwt = require("jsonwebtoken");

/** Exige um usuário autenticado. */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ erro: "Faça login para acessar este recurso." });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    next();
  } catch {
    return res.status(401).json({ erro: "Sessão inválida ou expirada." });
  }
}

/** Não bloqueia — só popula req.usuario quando houver um token válido. */
function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try {
      req.usuario = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    } catch {
      // token inválido: segue como visitante
    }
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
