import { useState } from "react";
import { useRouter } from "next/router";

export default function SearchBar({ tamanho = "grande" }) {
  const [valor, setValor] = useState("");
  const router = useRouter();

  function pesquisar(e) {
    e.preventDefault();
    if (!valor.trim()) return;
    router.push(`/pesquisa?q=${encodeURIComponent(valor.trim())}`);
  }

  const altura = tamanho === "grande" ? "py-5 text-lg" : "py-3 text-base";

  return (
    <form onSubmit={pesquisar} className="flex w-full max-w-2xl gap-3">
      <input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Digite o nome da empresa, CNPJ ou razão social"
        className={`flex-1 ${altura} px-5 bg-white border border-ledger rounded-none focus:outline-none focus:ring-2 focus:ring-aco text-ink`}
      />
      <button
        type="submit"
        className={`${altura} px-6 bg-ink text-paper font-medium hover:bg-aco transition-colors`}
      >
        Pesquisar
      </button>
    </form>
  );
}
