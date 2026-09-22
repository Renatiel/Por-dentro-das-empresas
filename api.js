const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function token() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("pde_token");
}

async function request(path, options = {}) {
  const t = token();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...options.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.erro || "Erro ao consultar a API.");
  return body;
}

export const api = {
  buscarEmpresas: (q) => request(`/empresas?q=${encodeURIComponent(q)}`),
  empresa: (cnpj) => request(`/empresas/${encodeURIComponent(cnpj)}`),
  financeiro: (cnpj) => request(`/empresas/${encodeURIComponent(cnpj)}/financeiro`),
  balanco: (cnpj) => request(`/empresas/${encodeURIComponent(cnpj)}/balanco`),
  tributos: (cnpj) => request(`/empresas/${encodeURIComponent(cnpj)}/tributos`),
  login: (email, senha) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, senha }) }),
  registrar: (nome, email, senha) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ nome, email, senha }) }),
  acompanhar: (cnpj) => request(`/empresas/${encodeURIComponent(cnpj)}/acompanhar`, { method: "POST" }),
};
