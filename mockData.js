/**
 * Camada de dados de exemplo.
 *
 * Em produção, este módulo é substituído por serviços reais de coleta
 * (Receita Federal, CVM, demonstrações publicadas pela empresa etc.),
 * cada valor sempre acompanhado de um registro em `fontes`.
 *
 * Todo valor aqui é FICTÍCIO e existe apenas para o protótipo funcionar
 * sem depender de integrações externas ainda não implementadas.
 */

const empresas = [
  {
    id: "1",
    cnpj: "47.960.950/0001-21",
    razaoSocial: "Magazine Luiza S.A.",
    nomeFantasia: "Magazine Luiza",
    situacaoCadastral: "Ativa",
    dataAbertura: "1991-03-16",
    naturezaJuridica: "Sociedade Anônima Aberta",
    porte: "Grande porte",
    capitalSocial: 100000000,
    endereco: "Rua Voluntários da Franca, 1465",
    municipio: "Franca",
    estado: "SP",
    cnaePrincipal: "47.13-0-02 — Comércio varejista",
    cnaesSecundarios: ["63.11-9-00 — Tratamento de dados"],
    segmento: "Varejo / E-commerce",
    descricao:
      "Rede varejista brasileira com atuação em lojas físicas e comércio eletrônico, oferecendo eletrodomésticos, eletrônicos e produtos de casa.",
    regimeTributario: "Lucro Real",
    numeroFuncionarios: 35000,
    socios: [
      { nome: "Frederico Trajano Inácio Rodrigues", cargo: "Diretor-presidente" },
      { nome: "Luiza Helena Trajano", cargo: "Presidente do Conselho de Administração" },
    ],
    filiais: [
      { municipio: "Franca", estado: "SP", tipo: "Matriz" },
      { municipio: "Louveira", estado: "SP", tipo: "Centro de distribuição" },
      { municipio: "Simões Filho", estado: "BA", tipo: "Centro de distribuição" },
    ],
    atualizadoEm: "2026-09-01",
  },
];

const financeiro = {
  "47.960.950/0001-21": {
    mensal: [
      { periodo: "2026-04", receita: 3200000000, despesas: 2950000000, lucro: 250000000 },
      { periodo: "2026-05", receita: 3350000000, despesas: 3050000000, lucro: 300000000 },
      { periodo: "2026-06", receita: 3100000000, despesas: 2980000000, lucro: 120000000 },
      { periodo: "2026-07", receita: 3400000000, despesas: 3100000000, lucro: 300000000 },
      { periodo: "2026-08", receita: 3550000000, despesas: 3200000000, lucro: 350000000 },
    ],
    anual: [
      { periodo: "2022", receita: 33700000000, despesas: 32100000000, lucro: -180000000, ativos: 25000000000, passivos: 18000000000, patrimonioLiquido: 7000000000 },
      { periodo: "2023", receita: 35200000000, despesas: 33500000000, lucro: 210000000, ativos: 26200000000, passivos: 18500000000, patrimonioLiquido: 7700000000 },
      { periodo: "2024", receita: 37600000000, despesas: 35100000000, lucro: 890000000, ativos: 27500000000, passivos: 19000000000, patrimonioLiquido: 8500000000 },
      { periodo: "2025", receita: 39800000000, despesas: 36900000000, lucro: 1400000000, ativos: 29000000000, passivos: 19800000000, patrimonioLiquido: 9200000000 },
    ],
  },
};

const balanco = {
  "47.960.950/0001-21": {
    periodo: "2025",
    ativoCirculante: 18000000000,
    ativoNaoCirculante: 11000000000,
    passivoCirculante: 12500000000,
    passivoNaoCirculante: 7300000000,
    capitalSocial: 100000000,
    reservas: 4200000000,
    lucrosAcumulados: 4900000000,
  },
};

const fontes = {
  "47.960.950/0001-21": [
    { tipo: "CVM", url: "https://www.rad.cvm.gov.br", confiabilidade: "oficial" },
    { tipo: "Receita Federal", url: "https://www.gov.br/receitafederal", confiabilidade: "oficial" },
  ],
};

// Tributos: valor pago/apurado por tipo de imposto/contribuição e período.
// `situacao` reflete se o valor já foi liquidado, é uma estimativa apurada
// a partir do lucro divulgado, ou está em discussão/parcelamento.
const tributos = {
  "47.960.950/0001-21": {
    regimeTributario: "Lucro Real",
    periodo: "2025",
    total: 2100000000,
    itens: [
      { tipo: "IRPJ — Imposto de Renda Pessoa Jurídica", valor: 480000000, situacao: "Apurado" },
      { tipo: "CSLL — Contribuição Social sobre o Lucro Líquido", valor: 210000000, situacao: "Apurado" },
      { tipo: "ICMS", valor: 890000000, situacao: "Recolhido" },
      { tipo: "PIS", valor: 95000000, situacao: "Recolhido" },
      { tipo: "COFINS", valor: 340000000, situacao: "Recolhido" },
      { tipo: "ISS", valor: 45000000, situacao: "Recolhido" },
      { tipo: "IPTU e taxas municipais", valor: 8000000, situacao: "Recolhido" },
      { tipo: "Parcelamento — débitos anteriores", valor: 32000000, situacao: "Em parcelamento" },
    ],
    historico: [
      { periodo: "2022", total: 1720000000 },
      { periodo: "2023", total: 1810000000 },
      { periodo: "2024", total: 1950000000 },
      { periodo: "2025", total: 2100000000 },
    ],
  },
};

function buscarEmpresas(query) {
  const q = (query || "").toLowerCase().replace(/[.\-/]/g, "");
  return empresas.filter((e) => {
    const alvo = `${e.razaoSocial} ${e.nomeFantasia} ${e.cnpj}`
      .toLowerCase()
      .replace(/[.\-/]/g, "");
    return alvo.includes(q);
  });
}

function buscarPorCnpj(cnpj) {
  return empresas.find((e) => e.cnpj === cnpj);
}

module.exports = {
  empresas,
  financeiro,
  balanco,
  tributos,
  fontes,
  buscarEmpresas,
  buscarPorCnpj,
};
