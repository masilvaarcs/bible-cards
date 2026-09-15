import React, { useState } from 'react'
import { PersonagemDespertai } from '../types'

interface CharacterProfileProps {
  personagens: Record<string, PersonagemDespertai>
  aoSelecionar?: (personagem: PersonagemDespertai) => void
}

export function CharacterProfile({ personagens, aoSelecionar }: CharacterProfileProps) {
  const [busca, setBusca] = useState('')
  const [expandido, setExpandido] = useState<string | null>(null)

  const listaPersonagens = Object.entries(personagens).sort(
    ([, a], [, b]) => b.total_artigos - a.total_artigos,
  )

  const filtrados = busca
    ? listaPersonagens.filter(([, p]) =>
        p.personagem.toLowerCase().includes(busca.toLowerCase()),
      )
    : listaPersonagens

  return (
    <div className="panel">
      <div className="panel-header">
        <span style={{ fontSize: '1.5rem' }}>👤</span>
        <div>
          <div className="panel-title">Personagens Bíblicos</div>
          <div className="panel-subtitle">
            {listaPersonagens.length} personagens da revista Despertai
          </div>
        </div>
      </div>

      {/* Busca */}
      <div className="search-bar" style={{ marginBottom: 20 }}>
        <input
          type="text"
          className="search-input"
          placeholder="Filtrar personagens..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Lista */}
      <div style={{ maxHeight: 600, overflowY: 'auto' }}>
        {filtrados.map(([key, personagem]) => (
          <div
            key={key}
            className="character-card"
            style={{ cursor: aoSelecionar ? 'pointer' : 'default' }}
          >
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
              onClick={() => setExpandido(expandido === key ? null : key)}
            >
              <div>
                <div className="character-name">{personagem.personagem}</div>
                <div className="character-meta">
                  {personagem.total_artigos} artigo{personagem.total_artigos !== 1 ? 's' : ''} na Despertai
                </div>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                {expandido === key ? '▼' : '▶'}
              </span>
            </div>

            {expandido === key && (
              <div style={{ marginTop: 12 }}>
                {personagem.artigos.map((artigo, i) => (
                  <div
                    key={i}
                    style={{
                      padding: 12,
                      background: 'var(--bg-input)',
                      borderRadius: 'var(--radius)',
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{artigo.titulo}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                      {artigo.ano && `${artigo.ano} · `}
                      <a href={artigo.url} target="_blank" rel="noopener noreferrer">
                        Ver no wol.jw.org ↗
                      </a>
                    </div>

                    {artigo.perfil && (
                      <div className="character-profile">{artigo.perfil}</div>
                    )}

                    {artigo.cartao_biblico && (
                      <div
                        style={{
                          padding: 10,
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius)',
                          border: '1px solid var(--border)',
                          marginTop: 8,
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--accent-gold)' }}>
                          🃏 Cartão Bíblico #{artigo.cartao_biblico.numero} — {artigo.cartao_biblico.personagem}
                        </div>
                      </div>
                    )}

                    {artigo.referencias.length > 0 && (
                      <div className="character-refs" style={{ marginTop: 8 }}>
                        {artigo.referencias.map((ref) => (
                          <span key={ref} className="ref-tag">
                            {ref}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {aoSelecionar && (
                  <button
                    className="btn btn-gold"
                    style={{ marginTop: 8 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      aoSelecionar(personagem)
                    }}
                  >
                    🃏 Gerar Cartão com IA
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {filtrados.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <div className="empty-state-title">
              {busca ? 'Nenhum personagem encontrado' : 'Nenhum personagem carregado'}
            </div>
            <div className="empty-state-desc">
              {busca
                ? 'Tente outro termo de busca.'
                : 'Execute o script baixar_despertai.py para carregar os dados.'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
