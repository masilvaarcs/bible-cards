// ─── Bíblia NWT ──────────────────────────────────────────────

export interface Versiculo {
  versiculo: number
  texto: string
}

export interface Capitulo {
  numero: number
  versiculos: Versiculo[]
}

export interface LivroBiblico {
  nome: string
  abreviacao: string
  slug: string
  testamento: 'hebraico' | 'grego'
  ordem: number
  total_capitulos: number
}

export interface DadosLivro {
  traducao: string
  idioma: string
  fonte: string
  livro: LivroBiblico
  capitulos: Capitulo[]
}

export interface BibliaCompleta {
  traducao: string
  idioma: string
  fonte: string
  total_livros: number
  livros: DadosLivro[]
}

// ─── Referência Bíblica ──────────────────────────────────────

export interface ReferenciaBiblica {
  livro: string
  capitulo: number
  versiculo_inicio: number
  versiculo_fim?: number
  texto?: string
}

// ─── Personagem / Despertai ─────────────────────────────────

export interface CartaoBiblicoOriginal {
  numero: number
  personagem: string
  perguntas?: string
  respostas?: string
}

export interface ArtigoDespertai {
  url: string
  titulo: string
  ano: number | null
  texto_completo: string
  perfil: string
  cartao_biblico: CartaoBiblicoOriginal | null
  referencias: string[]
}

export interface PersonagemDespertai {
  personagem: string
  total_artigos: number
  artigos: ArtigoDespertai[]
}

// ─── Cartão Bíblico Gerado ──────────────────────────────────

export type TipoCartao = 'personagem' | 'versiculo' | 'tema'

export interface CartaoBiblico {
  id: string
  tipo: TipoCartao
  titulo: string
  subtitulo?: string
  personagem?: string
  versiculo_chave: string
  referencia: string
  perfil: string
  perguntas: PerguntaCartao[]
  reflexao: string
  curiosidade: string
  cor_fundo?: string
}

export interface PerguntaCartao {
  pergunta: string
  opcoes: string[]
  resposta_correta: number
}

// ─── IA / Geração ───────────────────────────────────────────

export type Idioma = 'pt-BR' | 'en'

export interface ModeloIA {
  id: string
  nome: string
  provider: string
  categoria: 'pago' | 'gratis'
  maxTokens: number
  pontos_fortes: string[]
  icone: string
}

export interface PromptSection {
  id: string
  titulo: string
  conteudo: string
  icone: string
}

export interface PromptGerado {
  modeloId: string
  entradaOriginal: string
  idioma: Idioma
  secoes: PromptSection[]
  promptCompleto: string
  timestamp: Date
}

export type TipoPrompt = 'cartao_personagem' | 'cartao_versiculo' | 'cartao_tema'

export interface TemplatePrompt {
  id: TipoPrompt
  nome: string
  descricao: string
  icone: string
}

// ─── App State ──────────────────────────────────────────────

export type AbaAtiva = 'busca' | 'personagens' | 'gerador' | 'cartoes'

export interface AppState {
  abaAtiva: AbaAtiva
  biblia: BibliaCompleta | null
  personagens: Record<string, PersonagemDespertai>
  carregando: boolean
  erro: string | null
}
