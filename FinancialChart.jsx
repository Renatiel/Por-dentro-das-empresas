import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CORES = { receita: "#4A6B8A", despesas: "#B5762A", lucro: "#2F6B4F" };

const LINHAS_PADRAO = [
  { key: "receita", nome: "Receita", cor: CORES.receita },
  { key: "despesas", nome: "Despesas", cor: CORES.despesas },
  { key: "lucro", nome: "Lucro", cor: CORES.lucro },
];

export default function FinancialChart({ dados, titulo, linhas = LINHAS_PADRAO }) {
  return (
    <div className="linha-registro pb-6">
      <p className="mb-3 text-ink/70">{titulo}</p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={dados} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#D8D2C0" vertical={false} />
          <XAxis dataKey="periodo" stroke="#10203A" tick={{ fontSize: 12 }} />
          <YAxis
            stroke="#10203A"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${(v / 1e6).toFixed(0)}mi`}
          />
          <Tooltip formatter={(v) => `R$ ${(v / 1e6).toFixed(1)} mi`} />
          <Legend />
          {linhas.map((l) => (
            <Line key={l.key} type="monotone" dataKey={l.key} name={l.nome} stroke={l.cor} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
