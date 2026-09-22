import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const router = useRouter();

  async function entrar(e) {
    e.preventDefault();
    setErro(null);
    try {
      const { token } = await api.login(email, senha);
      window.localStorage.setItem("pde_token", token);
      router.push("/");
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <main className="max-w-sm mx-auto px-6 py-24">
      <h1 className="text-2xl font-medium mb-8">Entrar</h1>
      <form onSubmit={entrar} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 border border-ledger bg-white focus:outline-none focus:ring-2 focus:ring-aco"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="px-4 py-3 border border-ledger bg-white focus:outline-none focus:ring-2 focus:ring-aco"
          required
        />
        {erro && <p className="text-alerta text-sm">{erro}</p>}
        <button className="mt-2 py-3 bg-ink text-paper hover:bg-aco transition-colors">
          Entrar
        </button>
      </form>
      <p className="mt-6 text-sm text-ink/60">
        Ainda não tem conta? <a href="/cadastro" className="text-aco">Criar conta</a>
      </p>
    </main>
  );
}
