import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "../../lib/api";
import IndicatorCard from "../../components/IndicatorCard";
import FinancialChart from "../../components/FinancialChart";

export default function PaginaEmpresa() {
  const router = useRouter();
  const { cnpj } = router.query;

  const [empresa, setEmpresa] = useState(null);
  const [financeiro, setFinanceiro] = useState(null);
  const [balanco, setBalanco] = useState(null);
  const [tributos, setTributos] = useState(null);

  useEffect(() => {
    if (!cnpj) return;
    api.empresa(cnpj).then(setEmpresa).catch(() => {});
    api.financeiro(cnpj).then(setFinanceiro).catch(() => {});
    api.balanco(cnpj).then(setBalanco).catch(() => setBalanco(null));
    api.tributos(cnpj).then(setTributos).catch(() => setTributos(null));
  }, [cnpj]);

  if (!empresa) return <main className="p-12 text-ink/60">Carregando...</main>;

  const anual = financeiro?.anual || [];
  const mensal = financeiro?.mensal || [];
  const ultimoAno = anual[anual.length - 1];
  const acessoCompleto = empresa.acessoCompleto;

  async function acompanhar() {
    try {
      await api.acompanhar(cnpj);
      alert("Empresa adicionada aos favoritos.");
    } catch {
      alert("Faça login para acompanhar esta empresa.");
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Cabeçalho */}
      <div className="linha-registro pb-6 flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-medium">{empresa.nomeFantasia}</h1>
          <p className="numero text-ink/60 mt-1">{empresa.cnpj}</p>
          <p className="text-ink/70 mt-2 max-w-xl">{empresa.descricao}</p>
          <div className="flex gap-4 mt-3 text-sm text-ink/60">
            <span>{empresa.situacaoCadastral}</span>
            <span>·</span>
            <span>{empresa.segmento}</span>
            <span>·</span>
            <span>Atualizado em {empresa.atualizadoEm}</span>
          </div>
        </div>
        <button
          onClick={acompanhar}
          className="px-5 py-3 bg-ink text-paper hover:bg-aco transition-colors whitespace-nowrap"
        >
          ☆ Acompanhar empresa
        </button>
      </div>

      {/* Informações cadastrais completas */}
      <section className="mt-8">
        <h2 className="text-xl font-medium mb-2">Informações cadastrais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
          <IndicatorCard rotulo="Razão social" valor={null} textoLivre={empresa.razaoSocial} />
          <IndicatorCard rotulo="Natureza jurídica" valor={null} textoLivre={empresa.naturezaJuridica} />
          <IndicatorCard rotulo="Data de abertura" valor={null} textoLivre={empresa.dataAbertura} />
          <IndicatorCard rotulo="Porte" valor={null} textoLivre={empresa.porte} />
          <IndicatorCard rotulo="Capital social" valor={empresa.capitalSocial} />
          <IndicatorCard rotulo="Regime tributário" valor={null} textoLivre={empresa.regimeTributario} />
          <IndicatorCard rotulo="Endereço" valor={null} textoLivre={`${empresa.endereco}, ${empresa.municipio}/${empresa.estado}`} />
          <IndicatorCard rotulo="CNAE principal" valor={null} textoLivre={empresa.cnaePrincipal} />
          <IndicatorCard rotulo="Nº de funcionários" valor={null} textoLivre={empresa.numeroFuncionarios?.toLocaleString("pt-BR")} />
        </div>
        {empresa.cnaesSecundarios?.length > 0 && (
          <p className="linha-registro py-3 text-sm text-ink/70">
            CNAEs secundários: {empresa.cnaesSecundarios.join(" · ")}
          </p>
        )}
      </section>

      {/* Sócios e filiais */}
      {(empresa.socios?.length > 0 || empresa.filiais?.length > 0) && (
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10">
          {empresa.socios?.length > 0 && (
            <div>
              <h2 className="text-xl font-medium mb-2">Sócios e administradores</h2>
              {empresa.socios.map((s) => (
                <div key={s.nome} className="linha-registro py-3">
                  <p>{s.nome}</p>
                  <p className="text-sm text-ink/60">{s.cargo}</p>
                </div>
              ))}
            </div>
          )}
          {empresa.filiais?.length > 0 && (
            <div>
              <h2 className="text-xl font-medium mb-2">Filiais</h2>
              {empresa.filiais.map((f, i) => (
                <div key={i} className="linha-registro py-3">
                  <p>{f.municipio}/{f.estado}</p>
                  <p className="text-sm text-ink/60">{f.tipo}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Aviso de acesso restrito */}
      {!acessoCompleto && (
        <p className="linha-registro py-4 text-aco">
          Faça login para acessar a análise financeira completa desta empresa.
        </p>
      )}

      {/* Indicadores do último ano disponível */}
      <section className="mt-8">
        <h2 className="text-xl font-medium mb-2">Indicadores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
          <IndicatorCard rotulo="Receita anual" valor={ultimoAno?.receita} />
          <IndicatorCard rotulo="Despesas anuais" valor={ultimoAno?.despesas} />
          <IndicatorCard
            rotulo="Lucro / prejuízo"
            valor={ultimoAno?.lucro}
            tipo={ultimoAno?.lucro >= 0 ? "positivo" : "negativo"}
          />
          <IndicatorCard rotulo="Ativos" valor={ultimoAno?.ativos} />
          <IndicatorCard rotulo="Passivos" valor={ultimoAno?.passivos} />
          <IndicatorCard rotulo="Patrimônio líquido" valor={ultimoAno?.patrimonioLiquido} />
        </div>
      </section>

      {/* Desempenho mensal — só para quem tem acesso completo */}
      {acessoCompleto && mensal.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-medium mb-4">Desempenho mensal</h2>
          <FinancialChart dados={mensal} titulo="Últimos meses disponíveis" />
        </section>
      )}

      {/* Desempenho anual */}
      {acessoCompleto && anual.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-medium mb-4">Desempenho anual</h2>
          <FinancialChart dados={anual} titulo="Evolução anual" />
        </section>
      )}

      {/* Balanço patrimonial resumido */}
      {acessoCompleto && balanco && (
        <section className="mt-12">
          <h2 className="text-xl font-medium mb-2">Balanço patrimonial · {balanco.periodo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
            <IndicatorCard rotulo="Ativo circulante" valor={balanco.ativoCirculante} />
            <IndicatorCard rotulo="Ativo não circulante" valor={balanco.ativoNaoCirculante} />
            <IndicatorCard rotulo="Passivo circulante" valor={balanco.passivoCirculante} />
            <IndicatorCard rotulo="Passivo não circulante" valor={balanco.passivoNaoCirculante} />
            <IndicatorCard rotulo="Capital social" valor={balanco.capitalSocial} />
            <IndicatorCard rotulo="Reservas" valor={balanco.reservas} />
          </div>
        </section>
      )}

      {/* Tributação detalhada — quanto de imposto a empresa paga */}
      {acessoCompleto && tributos && (
        <section className="mt-12">
          <h2 className="text-xl font-medium mb-1">Tributação · {tributos.periodo}</h2>
          <p className="text-sm text-ink/60 mb-4">
            Regime: {tributos.regimeTributario} · Total de tributos no período:{" "}
            <span className="numero">
              R$ {(tributos.total / 1e9).toFixed(2)} bi
            </span>
          </p>
          {tributos.itens.map((item) => (
            <div key={item.tipo} className="linha-registro flex items-baseline justify-between py-3 gap-4">
              <span className="text-ink/80">{item.tipo}</span>
              <div className="flex items-baseline gap-3">
                <span
                  className={`text-xs px-2 py-0.5 ${
                    item.situacao === "Em parcelamento" ? "text-alerta" : "text-registro"
                  }`}
                >
                  {item.situacao}
                </span>
                <span className="numero text-lg">
                  R$ {(item.valor / 1e6).toFixed(1)} mi
                </span>
              </div>
            </div>
          ))}
          <FinancialChart
            dados={tributos.historico.map((h) => ({ periodo: h.periodo, total: h.total }))}
            titulo="Evolução do total de tributos"
            linhas={[{ key: "total", nome: "Total de tributos", cor: "#B5762A" }]}
          />
        </section>
      )}
      {acessoCompleto && !tributos && (
        <p className="linha-registro py-4 text-ink/60 mt-12">
          Informação tributária não disponível na fonte consultada.
        </p>
      )}

      <p className="mt-16 text-xs text-ink/40">
        Dados de exemplo para fins de demonstração deste protótipo — não representam
        valores reais publicados pela empresa.
      </p>
    </main>
  );
}
