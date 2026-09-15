import React, { useState, useEffect, useCallback } from 'react'
import { ModeloIA, PersonagemDespertai, CartaoBiblico, BibliaCompleta, AbaAtiva } from './types'
import { ModelSelector } from './components/ModelSelector'
import { BibleSearch } from './components/BibleSearch'
import { CharacterProfile } from './components/CharacterProfile'
import { CardGenerator } from './components/CardGenerator'
import { CardPreview } from './components/CardPreview'
import './App.css'

// ─── localStorage helpers ──────────────────────────────────
const STORAGE_KEY_CARTOES = 'novos_cartoes_biblicos_cartoes'

function carregarCartoesLocalStorage(): CartaoBiblico[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CARTOES)
    if (raw) {
      const dados = JSON.parse(raw)
      return Array.isArray(dados) ? dados : []
    }
  } catch (e) {
    console.warn('Erro ao carregar cartões do localStorage:', e)
  }
  return []
}

function salvarCartoesLocalStorage(cartoes: CartaoBiblico[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CARTOES, JSON.stringify(cartoes))
  } catch (e) {
    console.warn('Erro ao salvar cartões no localStorage:', e)
  }
}

function exportarCartoesJSON(cartoes: CartaoBiblico[]): void {
  const blob = new Blob([JSON.stringify(cartoes, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cartoes-biblicos-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function App() {
  // ─── State ──────────────────────────────────────────────
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('busca')
  const [modeloSelecionado, setModeloSelecionado] = useState<ModeloIA | null>(null)
  const [personagemSelecionada, setPersonagemSelecionada] = useState<PersonagemDespertai | null>(null)
  const [referenciaSelecionada, setReferenciaSelecionada] = useState<string>('')
  const [textoSelecionado, setTextoSelecionado] = useState<string>('')
  const [cartoes, setCartoes] = useState<CartaoBiblico[]>(carregarCartoesLocalStorage)
  const [biblia, setBiblia] = useState<BibliaCompleta | null>(null)
  const [personagens, setPersonagens] = useState<Record<string, PersonagemDespertai>>({})
  const [carregando, setCarregando] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // ─── Carregar dados locais ──────────────────────────────
  useEffect(() => {
    carregarDados()
  }, [])

  // ─── Persistir cartões no localStorage ──────────────────
  useEffect(() => {
    salvarCartoesLocalStorage(cartoes)
  }, [cartoes])

  const carregarDados = async () => {
    setCarregando(true)
    try {
      // Tentar carregar a Bíblia
      try {
        const resp = await fetch('/dados/nwt_biblia_completa.json')
        if (resp.ok) {
          const dados = await resp.json()
          setBiblia(dados)
        }
      } catch {
        console.log('Dados da Bíblia não encontrados. Execute baixar_biblia.py primeiro.')
      }

      // Tentar carregar personagens
      try {
        const resp = await fetch('/dados/despertai_personagens.json')
        if (resp.ok) {
          const dados = await resp.json()
          setPersonagens(dados.personagens || {})
        }
      } catch {
        console.log('Dados da Despertai não encontrados. Execute baixar_despertai.py primeiro.')
      }

      // Cartões já vêm do localStorage via useState initializer
    } finally {
      setCarregando(false)
    }
  }

  // ─── Handlers ───────────────────────────────────────────
  const handleSelecionarVersiculo = useCallback((referencia: string, texto: string) => {
    setReferenciaSelecionada(referencia)
    setTextoSelecionado(texto)
    setAbaAtiva('gerador')
    mostrarToast(`Versículo selecionado: ${referencia}`)
  }, [])

  const handleSelecionarPersonagem = useCallback((personagem: PersonagemDespertai) => {
    setPersonagemSelecionada(personagem)
    setAbaAtiva('gerador')
    mostrarToast(`Personagem selecionado: ${personagem.personagem}`)
  }, [])

  const handleSalvarCartao = useCallback((cartao: CartaoBiblico) => {
    setCartoes((prev) => {
      // Evitar duplicatas pelo id
      if (prev.some((c) => c.id === cartao.id)) return prev
      return [cartao, ...prev]
    })
    mostrarToast(`✅ Cartão "${cartao.titulo}" salvo!`)
  }, [])

  const handleExcluirCartao = useCallback((id: string) => {
    setCartoes((prev) => prev.filter((c) => c.id !== id))
    mostrarToast('🗑️ Cartão excluído')
  }, [])

  const handleExportarTodos = useCallback(() => {
    if (cartoes.length === 0) {
      mostrarToast('⚠️ Nenhum cartão para exportar')
      return
    }
    exportarCartoesJSON(cartoes)
    mostrarToast(`💾 ${cartoes.length} cartão(ões) exportado(s)`) }, [cartoes])

  const mostrarToast = (mensagem: string) => {
    setToast(mensagem)
    setTimeout(() => setToast(null), 3000)
  }

  // ─── Render ─────────────────────────────────────────────
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-logo">
          <span>📖</span>
          <span>Cartões Bíblicos</span>
        </div>
        <nav className="app-nav">
          <button
            className={`nav-btn ${abaAtiva === 'busca' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('busca')}
          >
            🔍 Busca
          </button>
          <button
            className={`nav-btn ${abaAtiva === 'personagens' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('personagens')}
          >
            👤 Personagens
          </button>
          <button
            className={`nav-btn ${abaAtiva === 'gerador' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('gerador')}
          >
            🃏 Gerador
          </button>
          <button
            className={`nav-btn ${abaAtiva === 'cartoes' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('cartoes')}
          >
            📚 Cartões ({cartoes.length})
          </button>
        </nav>
      </header>

      {/* Main */}
      <main className="app-main">
        {carregando && (
          <div className="loading">
            <div className="spinner" />
            Carregando dados...
          </div>
        )}

        {/* Estatísticas */}
        {biblia && (
          <div className="stats-row" style={{ marginBottom: 24 }}>
            <div className="stat-item">
              <span className="stat-value">{biblia.total_livros}</span>
              <span className="stat-label">Livros</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {biblia.livros.reduce(
                  (acc, l) => acc + l.capitulos.reduce((a, c) => a + c.versiculos.length, 0),
                  0,
                )}
              </span>
              <span className="stat-label">Versículos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Object.keys(personagens).length}</span>
              <span className="stat-label">Personagens</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{cartoes.length}</span>
              <span className="stat-label">Cartões</span>
            </div>
          </div>
        )}

        {/* Aba: Busca */}
        {abaAtiva === 'busca' && (
          <BibleSearch biblia={biblia} aoSelecionarVersiculo={handleSelecionarVersiculo} />
        )}

        {/* Aba: Personagens */}
        {abaAtiva === 'personagens' && (
          <CharacterProfile personagens={personagens} aoSelecionar={handleSelecionarPersonagem} />
        )}

        {/* Aba: Gerador */}
        {abaAtiva === 'gerador' && (
          <div className="grid-2">
            <div>
              <div className="panel">
                <div className="panel-header">
                  <span style={{ fontSize: '1.5rem' }}>⚙️</span>
                  <div className="panel-title">Configurações</div>
                </div>
                <ModelSelector modeloSelecionado={modeloSelecionado} aoSelecionar={setModeloSelecionado} />
              </div>
            </div>
            <div>
              <CardGenerator
                modeloSelecionado={modeloSelecionado}
                personagemSelecionado={personagemSelecionada}
                referenciaSelecionada={referenciaSelecionada}
                textoSelecionado={textoSelecionado}
                aoSalvarCartao={handleSalvarCartao}
              />
            </div>
          </div>
        )}

        {/* Aba: Cartões */}
        {abaAtiva === 'cartoes' && (
          <CardPreview
              cartoes={cartoes}
              aoExcluir={handleExcluirCartao}
              aoExportarTodos={handleExportarTodos}
            />
        )}

        {/* Estado vazio */}
        {!carregando && !biblia && Object.keys(personagens).length === 0 && abaAtiva === 'busca' && (
          <div className="panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>📖</div>
            <h2 style={{ marginBottom: 12 }}>Bem-vindo aos Novos Cartões Bíblicos!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
              Para começar, execute os scripts Python para baixar os dados da Bíblia NWT
              e dos personagens da revista Despertai.
            </p>
            <div
              style={{
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius)',
                padding: 20,
                textAlign: 'left',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                maxWidth: 500,
                margin: '0 auto',
              }}
            >
              <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}># Instale as dependências</div>
              <div style={{ color: 'var(--accent-green)' }}>$ pip install -r scripts/requirements.txt</div>
              <br />
              <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}># Baixe a Bíblia NWT</div>
              <div style={{ color: 'var(--accent-green)' }}>$ python scripts/baixar_biblia.py</div>
              <br />
              <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}># Baixe personagens da Despertai</div>
              <div style={{ color: 'var(--accent-green)' }}>$ python scripts/baixar_despertai.py</div>
              <br />
              <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}># Copie os dados para o app</div>
              <div style={{ color: 'var(--accent-green)' }}>
                $ cp -r DadosBiblia/* public/dados/
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
