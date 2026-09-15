# 📖 Novos Cartões Bíblicos

### Gerador de Cartões Bíblicos com IA — Tradução do Novo Mundo

![Version](https://img.shields.io/badge/version-1.0.0-ffd700?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=for-the-badge&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.x-3776ab?style=for-the-badge&logo=python)

<br/>

**Novos Cartões Bíblicos** é um sistema completo para:
1. 📥 **Baixar** a Bíblia NWT completa em português do Brasil
2. 👤 **Coletar** perfis de personagens da revista Despertai
3. 🃏 **Gerar** novos cartões bíblicos usando modelos de IA

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Formato dos Dados](#formato-dos-dados)
- [Modelos de IA Suportados](#modelos-de-ia-suportados)
- [Licença](#licença)

---

## 🌟 Visão Geral

O projeto resolve três problemas:

| Problema | Solução |
|----------|---------|
| Bíblia NWT disponível apenas online | Download completo em JSON pesquisável |
| Artigos da Despertai difíceis de organizar | Perfis de personagens indexados e pesquisáveis |
| Criar material de estudo bíblico é demorado | IA gera cartões estruturados em segundos |

---

## ✨ Funcionalidades

### 📥 Download da Bíblia NWT

- **66 livros** — Todas as Escrituras Hebraico-Aramaicas e Gregas
- **1.189 capítulos** — Capítulo por capítulo do jw.org
- **~31.000 versículos** — Texto completo em português do Brasil
- **JSON pesquisável** — Busca por texto, referência ou personagem
- **Download incremental** — Retoma de onde parou se interrompido

### 👤 Personagens da Despertai

- **Perfis completos** — Extraídos da série "Colecione e Aprenda"
- **Cartões originais** — Números e perguntas das publicações
- **Referências bíblicas** — Conexões com versículos da NWT
- **Organizado por personagem** — JSON individual para cada personagem

### 🃏 Gerador de Cartões com IA

- **3 tipos de cartão**: Personagem, Versículo, Tema
- **10 modelos de IA**: GPT-4o, Claude, Gemini, Llama, etc.
- **Prompt estruturado** — Gera prompts profissionais para a IA
- **Exportação** — Copiar, exportar Markdown, salvar local

---

## 📁 Estrutura do Projeto

```
NovosCartoesBiblicos/
├── DadosBiblia/                          ← Dados baixados
│   ├── nwt_biblia_completa.json          ← Bíblia inteira
│   ├── nwt_por_livro/                    ← JSONs individuais
│   ├── despertai_personagens.json        ← Personagens
│   └── despertai_por_personagem/         ← Por personagem
├── scripts/                              ← Scripts Python
│   ├── baixar_biblia.py                  ← Download da Bíblia
│   ├── baixar_despertai.py               ← Download da Despertai
│   ├── biblia_dados.py                   ← Mapeamento dos 66 livros
│   └── requirements.txt                  ← Dependências Python
├── src/                                  ← App React
│   ├── components/                       ← Componentes React
│   ├── hooks/                            ← Hooks customizados
│   ├── data/                             ← Dados estáticos
│   ├── types.ts                          ← Definições TypeScript
│   ├── models.ts                         ← Modelos de IA e templates
│   ├── cardEngine.ts                     ← Motor de geração
│   ├── App.tsx                           ← Componente principal
│   └── App.css                           ← Estilos
├── public/                               ← Arquivos públicos
│   └── dados/                            ← JSONs para o app
├── SalvedCards/                          ← Cartões exportados (PNG/PDF)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📦 Instalação (Execução Local)

### Pré-requisitos

- **Node.js** ≥ 18.x
- **Python** ≥ 3.10 *(apenas para download inicial dos dados)*
- **pip** *(gerenciador de pacotes Python)*

### 1. Clone o repositório

```bash
git clone https://github.com/masilvaarcs/bible-cards.git
cd bible-cards
```

### 2. Instale dependências React

```bash
npm install
```

### 3. Baixe os dados (Python — uma única vez)

```bash
# Instale dependências Python
pip install -r scripts/requirements.txt

# Baixe a Bíblia NWT completa (~15-20 minutos)
python scripts/baixar_biblia.py

# Baixe personagens da Despertai
python scripts/baixar_despertai.py
```

> **💡 Nota:** Os dados já estão incluídos no repositório em `DadosBiblia/` e `public/dados/`. Os scripts Python são apenas para **atualizar** os dados caso necessário.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O app estará disponível em **http://localhost:5173**

### 5. Build de produção (opcional)

```bash
npm run build
npm run preview   # Pré-visualiza o build
```

---

## 🚀 Uso

### Busca Bíblica

1. Acesse a aba **🔍 Busca**
2. Digite uma palavra ou frase para buscar em todos os versículos
3. Ou busque por referência: `Gênesis 1:1`, `João 3:16`
4. Ou explore um livro específico capítulo por capítulo
5. Clique em um resultado para selecioná-lo para o gerador

### Personagens

1. Acesse a aba **👤 Personagens**
2. Navegue pela lista de personagens da Despertai
3. Clique para expandir e ver os artigos
4. Clique em **🃏 Gerar Cartão com IA** para criar um cartão

### Gerador de Cartões

1. Acesse a aba **🃏 Gerador**
2. Selecione um **modelo de IA** (GPT-4o, Claude, etc.)
3. Escolha o **tipo de cartão**: Personagem, Versículo ou Tema
4. Selecione um personagem (aba Personagens) ou versículo (aba Busca)
5. Clique em **✨ Gerar Prompt do Cartão**
6. Copie o prompt e cole no modelo de IA escolhido
7. A IA gerará o cartão estruturado!

---

## Formato dos Dados

### Bíblia NWT (JSON)

```json
{
  "traducao": "TNM (revisão de 2015)",
  "idioma": "pt",
  "livros": [
    {
      "livro": {
        "nome": "Gênesis",
        "slug": "genesis",
        "testamento": "hebraico",
        "ordem": 1,
        "total_capitulos": 50
      },
      "capitulos": [
        {
          "numero": 1,
          "versiculos": [
            { "versiculo": 1, "texto": "No princípio Deus criou os céus e a terra." }
          ]
        }
      ]
    }
  ]
}
```

### Personagens Despertai (JSON)

```json
{
  "personagem": "Samuel",
  "total_artigos": 2,
  "artigos": [
    {
      "titulo": "Para Considerar em Família",
      "ano": 2012,
      "url": "https://wol.jw.org/pt/wol/d/r5/lp-t/102012053",
      "perfil": "Seus pais o 'emprestaram a Jeová'...",
      "cartao_biblico": { "numero": 14, "personagem": "Samuel" },
      "referencias": ["1 Samuel 1:24-28", "1 Samuel 3:19-21"]
    }
  ]
}
```

---

## Modelos de IA Suportados

| Modelo | Provider | Max Tokens | Tipo |
|--------|----------|-----------|------|
| GPT-4o | OpenAI | 128K | 💰 Pago |
| GPT-4.1 | OpenAI | 1M | 💰 Pago |
| Claude Opus 4 | Anthropic | 200K | 💰 Pago |
| Claude Sonnet 4 | Anthropic | 200K | 💰 Pago |
| Gemini 2.5 Pro | Google | 1M | 💰 Pago |
| Gemini 2.5 Flash | Google | 1M | 💰 Pago |
| GPT-4.1 Mini | OpenAI | 1M | 🆓 Grátis |
| Gemini 2.0 Flash | Google | 1M | 🆓 Grátis |
| Llama 4 Maverick | Meta | 1M | 🆓 Open Source |
| Qwen3 235B | Alibaba | 131K | 🆓 Open Source |

---

## 📜 Licença

MIT License — Uso pessoal e para estudo bíblico.

---

<div align="center">

**Feito com ❤️ para estudo da Palavra de Deus**

📖 *"Toda a Escritura é inspirada por Deus e proveitosa"* — 2 Timóteo 3:16

</div>
