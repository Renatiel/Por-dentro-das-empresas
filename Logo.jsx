// Marca "Por dentro das empresas": uma porta entreaberta revelando o
// crescimento financeiro de uma empresa — o conceito central do produto
// (olhar por dentro dos números de uma empresa), na paleta ink/aço já
// usada no resto da interface.
export default function Logo({ tamanho = 28, comTexto = true }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg width={tamanho} height={tamanho} viewBox="0 0 40 40" fill="none">
        {/* batente da porta */}
        <path d="M6 6 H24 V34 H6" stroke="#10203A" strokeWidth="2.5" fill="none" />
        {/* porta entreaberta */}
        <path d="M24 6 L33 9 V31 L24 34 Z" fill="#4A6B8A" />
        {/* maçaneta */}
        <circle cx="28.5" cy="20" r="1.4" fill="#F6F3EC" />
        {/* barras de crescimento vistas "por dentro" */}
        <rect x="10" y="22" width="3" height="8" fill="#2F6B4F" />
        <rect x="15" y="17" width="3" height="13" fill="#2F6B4F" />
        <rect x="20" y="12" width="3" height="18" fill="#2F6B4F" />
      </svg>
      {comTexto && (
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: tamanho * 0.5 }}>
          Por dentro das empresas
        </span>
      )}
    </span>
  );
}
