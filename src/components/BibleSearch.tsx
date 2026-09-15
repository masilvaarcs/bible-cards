import React, { useState } from 'react'
import { BibliaCompleta } from '../types'
import { useBibleSearch, ResultadoBusca } from '../hooks/useBibleSearch'
import { LIVROS } from '../data/bibliaLivros'

interface BibleSearchProps {
  biblia: BibliaCompleta | null
  aoSelecionarVersiculo?: (referencia: string, texto: string) => void
}

export function BibleSearch({ biblia, aoSelecionarVersiculo }: BibleSearchProps) {
  const { termoBusca, resultados, buscar, buscarPorReferencia, limpar } = useBibleSearch(biblia)
  const [modoBusca, setModoBusca] = useState<'texto' | 'referencia' | 'livro'>('texto')
  const [inputValor, setInputValor] = useState('')
  const [livroSelecionado, setLivroSelecionado] = useState('')
  const [capituloSelecionado, setCapituloSelecionado] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (modoBusca === 'texto') {
      buscar(inputValor)
    } else if (modoBusca === 'referencia') {
      buscarPorReferencia(inputValor)
    }
  }

  const handleLivroChange = (slug: string) => {
    setLivroSelecionado(slug)
    setCapituloSelecionado(1)
  }

  const livroInfo = LIVROS.find((l) => l.slug === livroSelecionado)

  return (
    <div className="panel">
      <div className="panel-header">
        <span style={{ fontSize: '1.5rem' }}>🔍</span>
        <div>
          <div className="panel-title">Busca Bíblica</div>
          <div className="panel-subtitle">
            {biblia
              ? `${biblia.total_livros} livros carregados`
              : 'Carregue os dados da Bíblia primeiro'}
          </div>
        </div>
      </div>

      {/* Toggle de modo de busca */}
      <div className="tabs" style={{ marginBottom: 16 }}>
        <button
          className={`tab ${modoBusca === 'texto' ? 'active' : ''}`}
          onClick={() => setModoBusca('texto')}
        >
          🔎 Buscar por Texto
        </button>
        <button
          className={`tab ${modoBusca === 'referencia' ? 'active' : ''}`}
          onClick={() => setModoBusca('referencia')}
        >
          📖 Buscar por Referência
        </button>
        <button
          className={`tab ${modoBusca === 'livro' ? 'active' : ''}`}
          onClick={() => setModoBusca('livro')}
        >
          📚 Explorar Livro
        </button>
      </div>

      {/* Barra de busca por texto */}
      {modoBusca === 'texto' && (
        <form onSubmit={handleSubmit} className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Digite uma palavra ou frase para buscar nos versículos..."
            value={inputValor}
            onChange={(e) => setInputValor(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            🔍 Buscar
          </button>
          {resultados.length > 0 && (
            <button type="button" className="btn btn-secondary" onClick={limpar}>
              ✕ Limpar
            </button>
          )}
        </form>
      )}

      {/* Busca por referência */}
      {modoBusca === 'referencia' && (
        <form onSubmit={handleSubmit} className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Ex: Gênesis 1:1, 1Samuel 3:10, João 3:16"
            value={inputValor}
            onChange={(e) => setInputValor(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            📖 Buscar
          </button>
        </form>
      )}

      {/* Explorar livro */}
      {modoBusca === 'livro' && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <select
            className="form-select"
            value={livroSelecionado}
            onChange={(e) => handleLivroChange(e.target.value)}
            style={{ flex: 2 }}
          >
            <option value="">Selecione um livro...</option>
            <optgroup label="Escrituras Hebraico-Aramaicas">
              {LIVROS.filter((l) => l.testamento === 'hebraico').map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.nome} ({l.capitulos} capítulos)
                </option>
              ))}
            </optgroup>
            <optgroup label="Escrituras Gregas Cristãs">
              {LIVROS.filter((l) => l.testamento === 'grego').map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.nome} ({l.capitulos} capítulos)
                </option>
              ))}
            </optgroup>
          </select>
          {livroInfo && (
            <select
              className="form-select"
              value={capituloSelecionado}
              onChange={(e) => setCapituloSelecionado(parseInt(e.target.value))}
              style={{ flex: 1 }}
            >
              {Array.from({ length: livroInfo.capitulos }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Cap. {i + 1}
                </option>
              ))}
            </select>
          )}
          {livroSelecionado && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                const livro = LIVROS.find((l) => l.slug === livroSelecionado)
                if (livro) {
                  buscarPorReferencia(`${livro.nome} ${capituloSelecionado}`)
                }
              }}
            >
              📖 Carregar
            </button>
          )}
        </div>
      )}

      {/* Resultados */}
      {resultados.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {resultados.length} resultado{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ maxHeight: 500, overflowY: 'auto' }}>
            {resultados.map((r, i) => (
              <ResultadoItem
                key={`${r.referencia}-${i}`}
                resultado={r}
                termo={modoBusca === 'texto' ? inputValor : ''}
                aoSelecionar={aoSelecionarVersiculo}
              />
            ))}
          </div>
        </div>
      )}

      {resultados.length === 0 && termoBusca && (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">Nenhum resultado encontrado</div>
          <div className="empty-state-desc">
            Tente buscar com outras palavras ou verifique a referência.
          </div>
        </div>
      )}
    </div>
  )
}

function ResultadoItem({
  resultado,
  termo,
  aoSelecionar,
}: {
  resultado: ResultadoBusca
  termo: string
  aoSelecionar?: (ref: string, texto: string) => void
}) {
  const destacarTexto = (texto: string, termo: string) => {
    if (!termo) return texto
    const regex = new RegExp(`(${termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const partes = texto.split(regex)
    return partes.map((parte, i) =>
      regex.test(parte) ? <mark key={i}>{parte}</mark> : parte,
    )
  }

  return (
    <div
      className="result-card"
      onClick={() => aoSelecionar?.(resultado.referencia, resultado.texto)}
      style={{ cursor: aoSelecionar ? 'pointer' : 'default' }}
    >
      <div className="result-reference">{resultado.referencia}</div>
      <div className="result-text">{destacarTexto(resultado.texto, termo)}</div>
    </div>
  )
}
