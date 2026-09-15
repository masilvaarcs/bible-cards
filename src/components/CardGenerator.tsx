import React, { useState } from 'react'
import { ModeloIA, PersonagemDespertai, TipoPrompt, CartaoBiblico } from '../types'
import { TEMPLATES_PROMPT } from '../models'
import { gerarPromptCartao, copiarParaClipboard, exportarMarkdown, gerarIdCartao } from '../cardEngine'

interface CardGeneratorProps {
  modeloSelecionado: ModeloIA | null
  personagemSelecionado: PersonagemDespertai | null
  referenciaSelecionada?: string
  textoSelecionado?: string
  aoSalvarCartao?: (cartao: CartaoBiblico) => void
}

export function CardGenerator({
  modeloSelecionado,
  personagemSelecionado,
  referenciaSelecionada,
  textoSelecionado,
  aoSalvarCartao,
}: CardGeneratorProps) {
  const [tipoPrompt, setTipoPrompt] = useState<TipoPrompt>('cartao_personagem')
  const [tema, setTema] = useState('')
  const [promptGerado, setPromptGerado] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [salvo, setSalvo] = useState(false)

  const handleGerar = () => {
    if (!modeloSelecionado) {
      alert('Selecione um modelo de IA primeiro.')
      return
    }

    if (tipoPrompt === 'cartao_personagem' && !personagemSelecionado) {
      alert('Selecione um personagem primeiro (aba Personagens).')
      return
    }

    const resultado = gerarPromptCartao(
      tipoPrompt,
      modeloSelecionado,
      {
        personagem: personagemSelecionado || undefined,
        referencia: referenciaSelecionada,
        textoVersiculo: textoSelecionado,
        tema: tipoPrompt === 'cartao_tema' ? tema : undefined,
      },
      'pt-BR',
    )

    setPromptGerado(resultado.promptCompleto)
    setSalvo(false)
  }

  const handleCopiar = async () => {
    if (promptGerado) {
      await copiarParaClipboard(promptGerado)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  const handleExportar = () => {
    if (promptGerado) {
      const nomeArquivo = `cartao-biblico-${personagemSelecionado?.personagem || 'versiculo'}-${Date.now()}.md`
      exportarMarkdown(promptGerado, nomeArquivo)
    }
  }

  const handleSalvar = () => {
    if (!promptGerado || !aoSalvarCartao) return

    const titulo = personagemSelecionado?.personagem
      || (referenciaSelecionada ? `Cartão: ${referenciaSelecionada}` : tema || 'Cartão Bíblico')

    const tipoCartaoMap: Record<TipoPrompt, 'personagem' | 'versiculo' | 'tema'> = {
      cartao_personagem: 'personagem',
      cartao_versiculo: 'versiculo',
      cartao_tema: 'tema',
    }

    const cartao: CartaoBiblico = {
      id: gerarIdCartao(),
      tipo: tipoCartaoMap[tipoPrompt],
      titulo,
      personagem: personagemSelecionado?.personagem,
      versiculo_chave: referenciaSelecionada || '',
      referencia: referenciaSelecionada || '',
      perfil: promptGerado,
      perguntas: [],
      reflexao: '',
      curiosidade: '',
      cor_fundo: undefined,
    }

    aoSalvarCartao(cartao)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span style={{ fontSize: '1.5rem' }}>🃏</span>
        <div>
          <div className="panel-title">Gerador de Cartões Bíblicos</div>
          <div className="panel-subtitle">
            {modeloSelecionado
              ? `Modelo: ${modeloSelecionado.nome}`
              : 'Selecione um modelo na aba Configurações'}
          </div>
        </div>
      </div>

      {/* Tipo de cartão */}
      <div className="form-group">
        <label className="form-label">Tipo de Cartão</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TEMPLATES_PROMPT.map((template) => (
            <button
              key={template.id}
              className={`btn ${tipoPrompt === template.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTipoPrompt(template.id)}
            >
              {template.icone} {template.nome}
            </button>
          ))}
        </div>
      </div>

      {/* Dados disponíveis */}
      {personagemSelecionado && (
        <div
          style={{
            padding: 12,
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Personagem selecionado:</div>
          <div style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>
            👤 {personagemSelecionado.personagem} ({personagemSelecionado.total_artigos} artigos)
          </div>
        </div>
      )}

      {referenciaSelecionada && (
        <div
          style={{
            padding: 12,
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Versículo selecionado:</div>
          <div style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>
            📖 {referenciaSelecionada}
          </div>
          {textoSelecionado && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              "{textoSelecionado.slice(0, 150)}..."
            </div>
          )}
        </div>
      )}

      {/* Tema (apenas para cartão de tema) */}
      {tipoPrompt === 'cartao_tema' && (
        <div className="form-group">
          <label className="form-label">Tema Bíblico</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: Fé, Coragem, Perdão, Oração..."
            value={tema}
            onChange={(e) => setTema(e.target.value)}
          />
        </div>
      )}

      {/* Botão gerar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button
          className="btn btn-gold"
          onClick={handleGerar}
          disabled={!modeloSelecionado}
        >
          ✨ Gerar Prompt do Cartão
        </button>
      </div>

      {/* Prompt gerado */}
      {promptGerado && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>📋 Prompt Gerado</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-sm btn-secondary" onClick={handleCopiar}>
                {copiado ? '✅ Copiado!' : '📋 Copiar'}
              </button>
              <button className="btn btn-sm btn-secondary" onClick={handleExportar}>
                💾 Exportar .md
              </button>
              {aoSalvarCartao && (
                <button
                  className="btn btn-sm"
                  onClick={handleSalvar}
                  style={{
                    background: salvo ? 'var(--accent-green)' : 'var(--accent-purple)',
                    color: 'white',
                  }}
                >
                  {salvo ? '✅ Salvo!' : '💾 Salvar Cartão'}
                </button>
              )}
            </div>
          </div>
          <div className="prompt-output">
            <PromptDisplay texto={promptGerado} />
          </div>
        </div>
      )}
    </div>
  )
}

function PromptDisplay({ texto }: { texto: string }) {
  // Dividir o prompt em seções para melhor exibição
  const linhas = texto.split('\n')
  const secoes: { titulo: string; conteudo: string[] }[] = []
  let secaoAtual: { titulo: string; conteudo: string[] } | null = null

  for (const linha of linhas) {
    if (linha.match(/^[\u{1F527}\u{1F4CB}\u{1F464}\u{2753}\u{1F4AD}\u{1F31F}\u{1F4DD}]/u)) {
      if (secaoAtual) secoes.push(secaoAtual)
      secaoAtual = { titulo: linha, conteudo: [] }
    } else if (secaoAtual) {
      secaoAtual.conteudo.push(linha)
    }
  }
  if (secaoAtual) secoes.push(secaoAtual)

  if (secoes.length === 0) {
    return <pre>{texto}</pre>
  }

  return (
    <div>
      {secoes.map((secao, i) => (
        <div key={i} className="prompt-section">
          <div className="prompt-section-title">{secao.titulo}</div>
          <div className="prompt-section-content">
            <pre style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}>
              {secao.conteudo.join('\n')}
            </pre>
          </div>
        </div>
      ))}
    </div>
  )
}
