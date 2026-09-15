import {
  Idioma,
  ModeloIA,
  PromptGerado,
  PromptSection,
  TipoPrompt,
  PersonagemDespertai,
  DadosLivro,
} from './types'

/**
 * Motor de geração de prompts para Cartões Bíblicos.
 * Recebe dados do personagem/versículo + modelo selecionado
 * e produz um prompt estruturado para a IA gerar o cartão.
 */
export function gerarPromptCartao(
  tipo: TipoPrompt,
  modelo: ModeloIA,
  dadosEntrada: {
    personagem?: PersonagemDespertai
    livro?: DadosLivro
    referencia?: string
    textoVersiculo?: string
    tema?: string
  },
  lang: Idioma = 'pt-BR',
): PromptGerado {
  const secoes = buildSecoes(tipo, dadosEntrada, lang)
  const promptCompleto = montarPrompt(secoes)

  return {
    modeloId: modelo.id,
    entradaOriginal: JSON.stringify(dadosEntrada, null, 2),
    idioma: lang,
    secoes,
    promptCompleto,
    timestamp: new Date(),
  }
}

function buildSecoes(
  tipo: TipoPrompt,
  dados: {
    personagem?: PersonagemDespertai
    livro?: DadosLivro
    referencia?: string
    textoVersiculo?: string
    tema?: string
  },
  lang: Idioma,
): PromptSection[] {
  switch (tipo) {
    case 'cartao_personagem':
      return buildSecaoPersonagem(dados, lang)
    case 'cartao_versiculo':
      return buildSecaoVersiculo(dados, lang)
    case 'cartao_tema':
      return buildSecaoTema(dados, lang)
    default:
      return buildSecaoPersonagem(dados, lang)
  }
}

// ─── SYSTEM PROMPT ──────────────────────────────────────────

function systemPrompt(lang: Idioma): string {
  return lang === 'pt-BR'
    ? `Você é um educador bíblico especializado em criar material de estudo para crianças e jovens.
Sua tarefa é criar CARTÕES BÍBLICOS didáticos, envolventes e teologicamente precisos.

Regras:
1. Use SEMPRE a Tradução do Novo Mundo (NWT) para referências bíblicas
2. As perguntas devem ser adequadas para a faixa etária (8-14 anos)
3. O perfil deve ser fiel ao texto bíblico, sem inventar fatos
4. A reflexão deve conectar a história com lições para hoje
5. A curiosidade deve ser interessante e baseada em fatos reais
6. Formate tudo em Markdown para fácil leitura

Responda SEMPRE em português brasileiro.`
    : `You are a Bible educator specialized in creating study material for children and youth.
Your task is to create didactic, engaging, and theologically accurate BIBLE CARDS.

Rules:
1. Always use the New World Translation (NWT) for biblical references
2. Questions should be age-appropriate (8-14 years old)
3. The profile must be faithful to the biblical text, without inventing facts
4. The reflection should connect the story with lessons for today
5. The curiosity should be interesting and based on real facts
6. Format everything in Markdown for easy reading

ALWAYS respond in English.`
}

// ─── CARTÃO DE PERSONAGEM ──────────────────────────────────

function buildSecaoPersonagem(
  dados: { personagem?: PersonagemDespertai; livro?: DadosLivro },
  lang: Idioma,
): PromptSection[] {
  const isPt = lang === 'pt-BR'
  const p = dados.personagem

  const contextoPersonagem = p
    ? `**Nome:** ${p.personagem}
**Total de artigos encontrados:** ${p.total_artigos}

**Artigos da Despertai:**
${p.artigos.map((a, i) => `
${i + 1}. ${a.titulo} (${a.ano || 's/ data'})
   URL: ${a.url}
   ${a.perfil ? `Perfil: ${a.perfil}` : ''}
   Referências: ${a.referencias.join(', ')}
`).join('\n')}`
    : (isPt ? '(Dados do personagem serão inseridos aqui)' : '(Character data will be inserted here)')

  return [
    {
      id: 'system',
      titulo: '🔧 System Prompt',
      icone: '🔧',
      conteudo: systemPrompt(lang),
    },
    {
      id: 'contexto',
      titulo: '📋 Contexto do Personagem',
      icone: '📋',
      conteudo: isPt
        ? `Crie um Cartão Bíblico para o seguinte personagem:\n\n${contextoPersonagem}\n\n---\n\nMonte o cartão com todas as seções abaixo.`
        : `Create a Bible Card for the following character:\n\n${contextoPersonagem}\n\n---\n\nBuild the card with all sections below.`,
    },
    {
      id: 'perfil',
      titulo: '👤 Perfil do Personagem',
      icone: '👤',
      conteudo: isPt
        ? `**Nome do personagem:** (nome estilizado com formatação)\n**Período bíblico:** (época em que viveu)\n**Resumo em 3-5 linhas:** (quem foi, o que fez, por que é importante)\n**Versículo-chave:** (ref. NWT que resume a história)`
        : `**Character name:** (styled name with formatting)\n**Biblical period:** (era when they lived)\n**Summary in 3-5 lines:** (who they were, what they did, why they matter)\n**Key verse:** (NWT ref. that summarizes the story)`,
    },
    {
      id: 'perguntas',
      titulo: '❓ Perguntas de Múltipla Escolha',
      icone: '❓',
      conteudo: isPt
        ? `Crie 3 perguntas de múltipla escolha (A, B, C, D) sobre o personagem:\n\n1. **Pergunta fácil** (conhecimento básico)\n2. **Pergunta média** (detalhe da história)\n3. **Pergunta difícil** (conexão ou compreensão profunda)\n\nPara cada pergunta, indique a resposta correta.`
        : `Create 3 multiple-choice questions (A, B, C, D) about the character:\n\n1. **Easy question** (basic knowledge)\n2. **Medium question** (story detail)\n3. **Hard question** (connection or deep understanding)\n\nFor each question, indicate the correct answer.`,
    },
    {
      id: 'reflexao',
      titulo: '💭 Pergunta de Reflexão',
      icone: '💭',
      conteudo: isPt
        ? `Crie 1 pergunta de reflexão que conecte a história do personagem com a vida de uma criança/jovem de hoje. Exemplo: "O que podemos aprender com [personagem] sobre [qualidade]?"`
        : `Create 1 reflection question that connects the character's story with a child/youth's life today. Example: "What can we learn from [character] about [quality]?"`,
    },
    {
      id: 'curiosidade',
      titulo: '🌟 Curiosidade',
      icone: '🌟',
      conteudo: isPt
        ? `Inclua 1 curiosidade interessante sobre o personagem ou sua história que não seja óbvia. Pode ser um detalhe geográfico, cultural, ou um fato surpreendente.`
        : `Include 1 interesting curiosity about the character or their story that isn't obvious. It can be a geographic, cultural detail, or a surprising fact.`,
    },
    {
      id: 'formato',
      titulo: '📝 Formato de Saída',
      icone: '📝',
      conteudo: isPt
        ? `Formato do cartão em Markdown:\n\n\`\`\`markdown\n# 🃏 CARTÃO BÍBLICO #[NÚMERO]\n\n## 👤 [NOME DO PERSONAGEM]\n**Período:** [período]\n**Referência-chave:** [ref]\n\n### Perfil\n[perfil em 3-5 linhas]\n\n### Perguntas\n1. [pergunta]?\n   A) [opção]\n   B) [opção] ✅\n   C) [opção]\n   D) [opção]\n\n### Reflexão\n[pergunta de reflexão]\n\n### Curiosidade 🌟\n[curiosidade]\n\`\`\`\n\nGere apenas o conteúdo do cartão, sem explicações adicionais.`
        : `Card format in Markdown:\n\n\`\`\`markdown\n# 🃏 BIBLE CARD #[NUMBER]\n\n## 👤 [CHARACTER NAME]\n**Period:** [period]\n**Key reference:** [ref]\n\n### Profile\n[profile in 3-5 lines]\n\n### Questions\n1. [question]?\n   A) [option]\n   B) [option] ✅\n   C) [option]\n   D) [option]\n\n### Reflection\n[reflection question]\n\n### Curiosity 🌟\n[curiosity]\n\`\`\`\n\nGenerate only the card content, without additional explanations.`,
    },
  ]
}

// ─── CARTÃO DE VERSÍCULO ───────────────────────────────────

function buildSecaoVersiculo(
  dados: { referencia?: string; textoVersiculo?: string; livro?: DadosLivro },
  lang: Idioma,
): PromptSection[] {
  const isPt = lang === 'pt-BR'
  const ref = dados.referencia || (isPt ? '(inserir referência)' : '(insert reference)')
  const texto = dados.textoVersiculo || (isPt ? '(inserir texto do versículo)' : '(insert verse text)')

  return [
    {
      id: 'system',
      titulo: '🔧 System Prompt',
      icone: '🔧',
      conteudo: systemPrompt(lang),
    },
    {
      id: 'contexto',
      titulo: '📋 Versículo Selecionado',
      icone: '📋',
      conteudo: `**Referência:** ${ref}\n**Texto (NWT):** ${texto}\n\n---\n\nCrie um Cartão Bíblico destacando este versículo.`,
    },
    {
      id: 'destaque',
      titulo: '✨ Destaque do Versículo',
      icone: '✨',
      conteudo: isPt
        ? `**Versículo em destaque:** (formatação especial)\n**O que este versículo diz:** (explicação simples)\n**Por que é importante:** (relevância)`
        : `**Featured verse:** (special formatting)\n**What this verse says:** (simple explanation)\n**Why it matters:** (relevance)`,
    },
    {
      id: 'contexto_historico',
      titulo: '📚 Contexto Histórico',
      icone: '📚',
      conteudo: isPt
        ? `**Quem escreveu:** (autor)\n**Quando:** (período aproximado)\n**Para quem:** (público original)\n**O que acontecia:** (situação histórica)`
        : `**Who wrote it:** (author)\n**When:** (approximate period)\n**To whom:** (original audience)\n**What was happening:** (historical situation)`,
    },
    {
      id: 'aplicacao',
      titulo: '🎯 Aplicação Prática',
      icone: '🎯',
      conteudo: isPt
        ? `**Como aplicar hoje:** (2-3 frases)\n**Pergunta de reflexão:** (pergunta que conecta com a vida)\n**Ação:** (algo concreto que a pessoa pode fazer)`
        : `**How to apply today:** (2-3 sentences)\n**Reflection question:** (question connecting to life)\n**Action:** (something concrete the person can do)`,
    },
    {
      id: 'formato',
      titulo: '📝 Formato de Saída',
      icone: '📝',
      conteudo: isPt
        ? `Formato do cartão em Markdown (similar ao de personagem, mas focado no versículo).`
        : `Card format in Markdown (similar to character card, but focused on the verse).`,
    },
  ]
}

// ─── CARTÃO DE TEMA ─────────────────────────────────────────

function buildSecaoTema(
  dados: { tema?: string },
  lang: Idioma,
): PromptSection[] {
  const isPt = lang === 'pt-BR'
  const tema = dados.tema || (isPt ? '(inserir tema)' : '(insert theme)')

  return [
    {
      id: 'system',
      titulo: '🔧 System Prompt',
      icone: '🔧',
      conteudo: systemPrompt(lang),
    },
    {
      id: 'contexto',
      titulo: '📋 Tema Bíblico',
      icone: '📋',
      conteudo: `**Tema:** ${tema}\n\n---\n\nCrie um Cartão Bíblico sobre este tema, reunindo versículos e ensinamentos.`,
    },
    {
      id: 'versiculos',
      titulo: '📜 Versículos de Apoio',
      icone: '📜',
      conteudo: isPt
        ? `Selecione 3-5 versículos da NWT que abordam este tema:\n\n1. **[ref]** — [texto resumido]\n2. **[ref]** — [texto resumido]\n3. **[ref]** — [texto resumido]`
        : `Select 3-5 NWT verses that address this theme:\n\n1. **[ref]** — [summary text]\n2. **[ref]** — [summary text]\n3. **[ref]** — [summary text]`,
    },
    {
      id: 'ensino',
      titulo: '📖 Ensino Central',
      icone: '📖',
      conteudo: isPt
        ? `**O que a Bíblia diz sobre este tema:** (3-5 frases)\n**Princípio bíblico:** (qual é a lição)\n**Exemplos bíblicos:** (personagens que ilustram)`
        : `**What the Bible says about this theme:** (3-5 sentences)\n**Biblical principle:** (what is the lesson)\n**Biblical examples:** (characters who illustrate)`,
    },
    {
      id: 'formato',
      titulo: '📝 Formato de Saída',
      icone: '📝',
      conteudo: isPt
        ? `Formato do cartão em Markdown (similar aos anteriores, mas focado no tema bíblico com múltiplos versículos de apoio).`
        : `Card format in Markdown (similar to previous ones, but focused on the biblical theme with multiple supporting verses).`,
    },
  ]
}

// ─── MONTAR PROMPT ─────────────────────────────────────────

function montarPrompt(secoes: PromptSection[]): string {
  const partes: string[] = []
  for (const secao of secoes) {
    partes.push(`${secao.icone} ${secao.titulo}\n${'─'.repeat(40)}\n${secao.conteudo}\n`)
  }
  return partes.join('\n')
}

// ─── UTILITÁRIOS ───────────────────────────────────────────

export function copiarParaClipboard(texto: string): Promise<void> {
  return navigator.clipboard.writeText(texto)
}

export function exportarMarkdown(texto: string, nomeArquivo: string): void {
  const blob = new Blob([texto], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nomeArquivo
  a.click()
  URL.revokeObjectURL(url)
}

export function gerarIdCartao(): string {
  return `cartao-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
