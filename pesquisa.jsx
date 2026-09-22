import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SearchBar from "../components/SearchBar";
import Logo from "../components/Logo";
import { api } from "../lib/api";

export default function Pesquisa() {
  const router = useRouter();
  const { q } = router.query;
  const [resultados, setResultados] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!q) return;
    api
      .buscarEmpresas(q)
      .then(setResultados)
      .catch((e) => setErro(e.message));
  }, [q]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8"><Logo tamanho={22} /></div>
      <SearchBar tamanho="pequeno" />

      <h2 className="mt-10 mb-4 text-ink/70">
        {resultados ? `${resultados.length} resultado(s) para "${q}"` : "Buscando..."}
      </h2>

      {erro && <p className="text-alerta">{erro}</p>}

      <ul>
        {resultados?.map((empresa) => (
          <li key={empresa.cnpj} className="linha-registro py-5">
            <Link href={`/empresa/${encodeURIComponent(empresa.cnpj)}`} className="block group">
              <p className="text-lg font-medium group-hover:text-aco">{empresa.nomeFantasia}</p>
              <p className="numero text-sm text-ink/60">{empresa.cnpj}</p>
              <p className="text-sm text-ink/70 mt-1">{empresa.segmento}</p>
            </Link>
          </li>
        ))}
      </ul>

      {resultados && resultados.length === 0 && (
        <p className="text-ink/60">Nenhuma empresa encontrada para este termo.</p>
      )}
    </main>
  );
}
