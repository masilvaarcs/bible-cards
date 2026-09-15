import React, { useState } from 'react'
import { CartaoBiblico } from '../types'

interface CardPreviewProps {
  cartoes: CartaoBiblico[]
  aoExcluir?: (id: string) => void
  aoExportarTodos?: () => void
}

export function CardPreview({ cartoes, aoExcluir, aoExportarTodos }: CardPreviewProps) {
  const [exportando, setExportando] = useState(false)

  if (cartoes.length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">
          <span style={{ fontSize: '1.5rem' }}>🃏</span>
          <div>
            <div className="panel-title">Cartões Gerados</div>
            <div className="panel-subtitle">Nenhum cartão ainda</div>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">🃏</div>
          <div className="empty-state-title">Nenhum cartão gerado</div>
          <div className="empty-state-desc">
            Use o Gerador de Cartões para criar novos cartões bíblicos com IA.
            <br />
            Os cartões são salvos automaticamente no navegador.
          </div>
        </div>
      </div>
    )
  }

  const handleExportarTodos = () => {
    aoExportarTodos?.()
    setExportando(true)
    setTimeout(() => setExportando(false), 2000)
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span style={{ fontSize: '1.5rem' }}>🃏</span>
        <div style={{ flex: 1 }}>
          <div className="panel-title">Cartões Gerados</div>
          <div className="panel-subtitle">
            {cartoes.length} cartão(ões) · Salvos automaticamente no navegador
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <button className="btn btn-sm btn-secondary" onClick={handleExportarTodos}>
            {exportando ? '✅ Exportado!' : '📦 Exportar Todos (.json)'}
          </button>
        </div>
      </div>

      <div className="grid-2">
        {cartoes.map((cartao) => (
          <CartaoCard
            key={cartao.id}
            cartao={cartao}
            aoExcluir={aoExcluir}
          />
        ))}
      </div>
    </div>
  )
}

function CartaoCard({
  cartao,
  aoExcluir,
}: {
  cartao: CartaoBiblico
  aoExcluir?: (id: string) => void
}) {
  const [expandido, setExpandido] = useState(false)
  const [copiado, setCopiado] = useState(false)

  const corTipo: Record<string, string> = {
    personagem: 'var(--accent-purple)',
    versiculo: 'var(--accent-blue)',
    tema: 'var(--accent-green)',
  }

  const iconeTipo: Record<string, string> = {
    personagem: '👤',
    versiculo: '📜',
    tema: '🎯',
  }

  const handleCopiarPrompt = async () => {
    const texto = cartao.perfil || '(prompt não disponível)'
    await navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const handleExportarIndividual = () => {
    const dados = {
      id: cartao.id,
      tipo: cartao.tipo,
      titulo: cartao.titulo,
      personagem: cartao.personagem,
      referencia: cartao.referencia,
      versiculo_chave: cartao.versiculo_chave,
      perfil: cartao.perfil,
      perguntas: cartao.perguntas,
      reflexao: cartao.reflexao,
      curiosidade: cartao.curiosidade,
      exportado_em: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(dados, null, 2)], {
      type: 'application/json;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cartao-${cartao.personagem || cartao.titulo.replace(/\s+/g, '-').toLowerCase()}-${cartao.id.slice(-6)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="character-card"
      style={{ borderLeftColor: corTipo[cartao.tipo], borderLeftWidth: 4 }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }}
        onClick={() => setExpandido(!expandido)}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 4,
                background: `${corTipo[cartao.tipo]}20`,
                color: corTipo[cartao.tipo],
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {iconeTipo[cartao.tipo]} {cartao.tipo}
            </span>
          </div>
          <div className="character-name" style={{ fontSize: '1.1rem' }}>
            {cartao.titulo}
          </div>
          {cartao.personagem && (
            <div className="character-meta">{cartao.personagem}</div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {aoExcluir && (
            <button
              className="btn-icon"
              onClick={(e) => {
                e.stopPropagation()
                aoExcluir(cartao.id)
              }}
              title="Excluir cartão"
            >
              🗑️
            </button>
          )}
          <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
            {expandido ? '▼' : '▶'}
          </span>
        </div>
      </div>

      {expandido && (
        <div style={{ marginTop: 16 }}>
          {/* Botões de ação */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-sm btn-secondary" onClick={handleCopiarPrompt}>
              {copiado ? '✅ Copiado!' : '📋 Copiar Prompt'}
            </button>
            <button className="btn btn-sm btn-secondary" onClick={handleExportarIndividual}>
              💾 Exportar .json
            </button>
          </div>

          <div
            style={{
              padding: 16,
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              maxHeight: 400,
              overflowY: 'auto',
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <strong style={{ color: 'var(--accent-gold)' }}>📖 Versículo-chave:</strong>
              <br />
              {cartao.referencia || '(não informado)'}
            </div>

            <div style={{ marginBottom: 12 }}>
              <strong style={{ color: 'var(--accent-gold)' }}>👤 Perfil:</strong>
              <br />
              {cartao.perfil || '(não informado)'}
            </div>

            {cartao.perguntas.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <strong style={{ color: 'var(--accent-gold)' }}>❓ Perguntas:</strong>
                {cartao.perguntas.map((p, i) => (
                  <div key={i} style={{ marginTop: 8 }}>
                    <div>{p.pergunta}</div>
                    {p.opcoes.map((op, j) => (
                      <div
                        key={j}
                        style={{
                          marginLeft: 12,
                          color: j === p.resposta_correta ? 'var(--accent-green)' : 'var(--text-secondary)',
                        }}
                      >
                        {String.fromCharCode(65 + j)}) {op}
                        {j === p.resposta_correta && ' ✅'}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {cartao.reflexao && (
              <div style={{ marginBottom: 12 }}>
                <strong style={{ color: 'var(--accent-gold)' }}>💭 Reflexão:</strong>
                <br />
                {cartao.reflexao}
              </div>
            )}

            {cartao.curiosidade && (
              <div>
                <strong style={{ color: 'var(--accent-gold)' }}>🌟 Curiosidade:</strong>
                <br />
                {cartao.curiosidade}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
