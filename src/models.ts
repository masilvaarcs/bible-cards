import { ModeloIA, TemplatePrompt } from './types'

export const MODELOS_IA: ModeloIA[] = [
  // ─── PAGOS ───
  {
    id: 'gpt-4o',
    nome: 'GPT-4o',
    provider: 'OpenAI',
    categoria: 'pago',
    maxTokens: 128000,
    pontos_fortes: ['Multimodal', 'Rápido', 'Geração de código', 'Raciocínio'],
    icone: '🤖',
  },
  {
    id: 'gpt-4.1',
    nome: 'GPT-4.1',
    provider: 'OpenAI',
    categoria: 'pago',
    maxTokens: 1000000,
    pontos_fortes: ['Contexto longo', 'Codificação agêntica', 'Seguimento de instruções'],
    icone: '🧠',
  },
  {
    id: 'claude-opus-4',
    nome: 'Claude Opus 4',
    provider: 'Anthropic',
    categoria: 'pago',
    maxTokens: 200000,
    pontos_fortes: ['Raciocínio profundo', 'Qualidade de código', 'Pensamento estendido'],
    icone: '🏛️',
  },
  {
    id: 'claude-sonnet-4',
    nome: 'Claude Sonnet 4',
    provider: 'Anthropic',
    categoria: 'pago',
    maxTokens: 200000,
    pontos_fortes: ['Velocidade/qualidade equilibrada', 'Codificação', 'Análise'],
    icone: '⚡',
  },
  {
    id: 'gemini-2.5-pro',
    nome: 'Gemini 2.5 Pro',
    provider: 'Google',
    categoria: 'pago',
    maxTokens: 1000000,
    pontos_fortes: ['Contexto enorme', 'Multimodal', 'Código', 'Pesquisa'],
    icone: '💎',
  },
  {
    id: 'gemini-2.5-flash',
    nome: 'Gemini 2.5 Flash',
    provider: 'Google',
    categoria: 'pago',
    maxTokens: 1000000,
    pontos_fortes: ['Rápido', 'Custo-efetivo', 'Contexto longo'],
    icone: '⚡',
  },

  // ─── GRÁTIS / OPEN SOURCE ───
  {
    id: 'gpt-4.1-mini',
    nome: 'GPT-4.1 Mini',
    provider: 'OpenAI',
    categoria: 'gratis',
    maxTokens: 1000000,
    pontos_fortes: ['Rápido', 'Acessível', 'Seguimento de instruções'],
    icone: '🤖',
  },
  {
    id: 'gemini-2.0-flash',
    nome: 'Gemini 2.0 Flash',
    provider: 'Google',
    categoria: 'gratis',
    maxTokens: 1000000,
    pontos_fortes: ['Tier gratuito disponível', 'Rápido', 'Multimodal'],
    icone: '✨',
  },
  {
    id: 'llama-4-maverick',
    nome: 'Llama 4 Maverick',
    provider: 'Meta (Open Source)',
    categoria: 'gratis',
    maxTokens: 1000000,
    pontos_fortes: ['Código aberto', 'Multimodal', 'Multilíngue'],
    icone: '🦙',
  },
  {
    id: 'qwen-3-235b',
    nome: 'Qwen3 235B',
    provider: 'Alibaba (Open Source)',
    categoria: 'gratis',
    maxTokens: 131072,
    pontos_fortes: ['Código aberto', 'Multilíngue', 'Codificação', 'Raciocínio'],
    icone: '🔮',
  },
]

export const TEMPLATES_PROMPT: TemplatePrompt[] = [
  {
    id: 'cartao_personagem',
    nome: 'Cartão de Personagem Bíblico',
    descricao: 'Cria um cartão completo com perfil, perguntas e curiosidades sobre um personagem',
    icone: '👤',
  },
  {
    id: 'cartao_versiculo',
    nome: 'Cartão de Versículo',
    descricao: 'Cria um cartão destacando um versículo com contexto e aplicação',
    icone: '📜',
  },
  {
    id: 'cartao_tema',
    nome: 'Cartão de Tema Bíblico',
    descricao: 'Cria um cartão sobre um tema bíblico com versículos de apoio',
    icone: '🎯',
  },
]
