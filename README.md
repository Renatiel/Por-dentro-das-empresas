# Por dentro das empresas — Plataforma de Inteligência Financeira e Empresarial

Esqueleto inicial (front-end + back-end) da plataforma descrita no briefing. Este projeto
já roda de ponta a ponta com **dados mockados** (nenhuma informação financeira real é
inventada — os dados de exemplo são claramente marcados como fictícios), servindo de base
para depois plugar fontes reais (Receita Federal, CVM, Portal da Transparência etc.).

## O que já está implementado

- **Backend** (Node.js + Express): autenticação com JWT, modelos de dados (Sequelize/Postgres),
  rotas de empresas, indicadores financeiros, favoritos e usuário.
- **Frontend** (Next.js + Tailwind): Home com busca, resultado de pesquisa, dashboard da
  empresa (indicadores, evolução mensal/anual, balanço resumido), login e cadastro.
- Identidade visual própria (ver `frontend/styles/globals.css`): paleta "livro-razão" —
  tinta (`#10203A`), papel (`#F6F3EC`), verde-registro (`#2F6B4F`) para valores positivos e
  âmbar (`#B5762A`) para alertas/negativos. Tipografia: `Space Grotesk` (interface) +
  `IBM Plex Mono` (números/dados).

## O que fica como próximo passo (documentado, não implementado)

- Integração com fontes externas reais (Receita Federal/CNPJ, CVM, etc.) — hoje
  `backend/src/services/mockData.js` simula essa camada.
- Páginas de DRE detalhada, Tributos, Receitas/Despesas dedicadas, Notícias, Alertas e
  Configurações — seguem o mesmo padrão das páginas já criadas (componentes +
  rota de API correspondente já mapeada na tabela abaixo).
- Envio de e-mails transacionais (alertas) — pontos de extensão já isolados em
  `backend/src/services/` para receber um provedor (SES, SendGrid, etc.).
- Cache (Redis), fila de coleta/processamento de dados, CI/CD e infraestrutura em nuvem.

---

## Arquitetura

```
Front-end (Next.js)
      ↓ HTTPS/JSON
API REST (Express)
      ↓
Camada de serviços (auth, empresas, financeiro, alertas)
      ↓
Banco de dados (PostgreSQL)         Serviços de coleta (futuro)
                                            ↓
                                    Fontes externas oficiais
```

## Modelo de dados (PostgreSQL)

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  receber_emails BOOLEAN DEFAULT TRUE,
  data_cadastro TIMESTAMP DEFAULT NOW()
);

CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  razao_social VARCHAR(200) NOT NULL,
  nome_fantasia VARCHAR(200),
  situacao_cadastral VARCHAR(50),
  data_abertura DATE,
  natureza_juridica VARCHAR(120),
  porte VARCHAR(50),
  capital_social NUMERIC(18,2),
  endereco VARCHAR(255),
  municipio VARCHAR(100),
  estado CHAR(2),
  cnae_principal VARCHAR(120),
  cnaes_secundarios TEXT[],
  segmento VARCHAR(120),
  descricao TEXT,
  regime_tributario VARCHAR(80),
  numero_funcionarios INT,
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dados_financeiros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id),
  periodo VARCHAR(7) NOT NULL,          -- 'YYYY-MM' ou 'YYYY'
  tipo VARCHAR(10) NOT NULL,            -- 'mensal' | 'anual'
  receita NUMERIC(18,2),
  despesas NUMERIC(18,2),
  lucro NUMERIC(18,2),
  ativos NUMERIC(18,2),
  passivos NUMERIC(18,2),
  patrimonio_liquido NUMERIC(18,2),
  fonte_id UUID REFERENCES fontes(id)
);

CREATE TABLE balancos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id),
  periodo VARCHAR(7) NOT NULL,
  ativo_circulante NUMERIC(18,2),
  ativo_nao_circulante NUMERIC(18,2),
  passivo_circulante NUMERIC(18,2),
  passivo_nao_circulante NUMERIC(18,2),
  capital_social NUMERIC(18,2),
  reservas NUMERIC(18,2),
  lucros_acumulados NUMERIC(18,2),
  documento_url VARCHAR(255)
);

CREATE TABLE tributos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id),
  tipo VARCHAR(80) NOT NULL,        -- 'IRPJ', 'ICMS', 'ISS', 'PIS', 'COFINS', etc.
  periodo VARCHAR(7) NOT NULL,
  valor NUMERIC(18,2),
  situacao VARCHAR(50),             -- 'Apurado' | 'Recolhido' | 'Em parcelamento' | 'Em discussão'
  fonte_id UUID REFERENCES fontes(id)
);

CREATE TABLE socios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id),
  nome VARCHAR(200) NOT NULL,
  cargo VARCHAR(120)
);

CREATE TABLE filiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id),
  municipio VARCHAR(100),
  estado CHAR(2),
  tipo VARCHAR(50)                  -- 'Matriz' | 'Centro de distribuição' | 'Loja' etc.
);

CREATE TABLE favoritos (
  usuario_id UUID REFERENCES usuarios(id),
  empresa_id UUID REFERENCES empresas(id),
  criado_em TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (usuario_id, empresa_id)
);

CREATE TABLE alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  empresa_id UUID REFERENCES empresas(id),
  tipo VARCHAR(80),
  status VARCHAR(20) DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fontes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id),
  tipo VARCHAR(80),          -- 'Receita Federal', 'CVM', etc.
  url VARCHAR(255),
  confiabilidade VARCHAR(20),
  data_consulta TIMESTAMP DEFAULT NOW()
);
```

## API

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/auth/register` | Cria usuário | não |
| POST | `/auth/login` | Login, retorna JWT | não |
| POST | `/auth/logout` | Invalida sessão | sim |
| GET  | `/empresas?q=` | Busca por nome/CNPJ/razão social | não |
| GET  | `/empresas/:cnpj` | Dados cadastrais públicos | não |
| GET  | `/empresas/:cnpj/financeiro` | Indicadores + histórico | sim* |
| GET  | `/empresas/:cnpj/balanco` | Balanço patrimonial | sim |
| GET  | `/empresas/:cnpj/dre` | DRE | sim |
| GET  | `/empresas/:cnpj/tributos` | Tributos pagos por tipo, período e situação | sim |
| GET  | `/empresas/:cnpj/fontes` | Fontes oficiais de cada informação | não |
| POST | `/empresas/:cnpj/acompanhar` | Favoritar empresa | sim |
| DELETE | `/empresas/:cnpj/acompanhar` | Remover favorito | sim |
| GET  | `/usuario/empresas` | Empresas acompanhadas | sim |
| GET  | `/usuario/alertas` | Alertas do usuário | sim |

`*` sem login retorna um subconjunto resumido (indicadores básicos), conforme o
briefing (visitante vê o resumo, usuário logado vê a análise completa).

## Rodando localmente

```bash
# backend
cd backend && npm install && npm run dev   # http://localhost:4000

# frontend
cd frontend && npm install && npm run dev  # http://localhost:3000
```

O backend roda com dados mockados em memória por padrão (não exige Postgres para
explorar o protótipo) — ver `backend/src/services/mockData.js`. O schema Sequelize em
`backend/src/models` já está pronto para apontar para um Postgres real via
`DATABASE_URL` no `.env`.
