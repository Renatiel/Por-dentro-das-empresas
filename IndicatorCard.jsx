function formatar(valor) {
  if (valor === null || valor === undefined) return null;
  const abs = Math.abs(valor);
  if (abs >= 1e9) return `R$ ${(valor / 1e9).toFixed(1)} bi`;
  if (abs >= 1e6) return `R$ ${(valor / 1e6).toFixed(1)} mi`;
  return `R$ ${valor.toLocaleString("pt-BR")}`;
}

export default function IndicatorCard({ rotulo, valor, tipo = "neutro", textoLivre }) {
  // Alguns dados cadastrais (razão social, endereço etc.) não são valores
  // monetários — nesse caso `textoLivre` é exibido em vez do valor formatado.
  const formatado = textoLivre !== undefined ? textoLivre : formatar(valor);
  const ehTexto = textoLivre !== undefined;
  const cor =
    !formatado
      ? "text-ink/40"
      : tipo === "positivo"
      ? "text-registro"
      : tipo === "negativo"
      ? "text-alerta"
      : "text-ink";

  return (
    <div className="linha-registro flex items-baseline justify-between py-4 gap-4">
      <span className="text-ink/70">{rotulo}</span>
      <span className={`${ehTexto ? "" : "numero"} text-right text-lg font-medium ${cor}`}>
        {formatado || "não disponível"}
      </span>
    </div>
  );
}
