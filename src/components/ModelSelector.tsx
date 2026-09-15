import React from 'react'
import { ModeloIA } from '../types'
import { MODELOS_IA } from '../models'

interface ModelSelectorProps {
  modeloSelecionado: ModeloIA | null
  aoSelecionar: (modelo: ModeloIA) => void
}

export function ModelSelector({ modeloSelecionado, aoSelecionar }: ModelSelectorProps) {
  const pagos = MODELOS_IA.filter((m) => m.categoria === 'pago')
  const gratis = MODELOS_IA.filter((m) => m.categoria === 'gratis')

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ color: 'var(--accent-red)', marginBottom: 8, fontSize: '0.85rem' }}>
          💰 Modelos Pagos
        </h4>
        <div className="model-grid">
          {pagos.map((modelo) => (
            <ModelCard
              key={modelo.id}
              modelo={modelo}
              selecionado={modeloSelecionado?.id === modelo.id}
              aoClicar={() => aoSelecionar(modelo)}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ color: 'var(--accent-green)', marginBottom: 8, fontSize: '0.85rem' }}>
          🆓 Modelos Gratuitos / Open Source
        </h4>
        <div className="model-grid">
          {gratis.map((modelo) => (
            <ModelCard
              key={modelo.id}
              modelo={modelo}
              selecionado={modeloSelecionado?.id === modelo.id}
              aoClicar={() => aoSelecionar(modelo)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ModelCard({
  modelo,
  selecionado,
  aoClicar,
}: {
  modelo: ModeloIA
  selecionado: boolean
  aoClicar: () => void
}) {
  return (
    <div
      className={`model-card ${selecionado ? 'selected' : ''}`}
      onClick={aoClicar}
    >
      <div className="model-card-header">
        <span style={{ fontSize: '1.2rem' }}>{modelo.icone}</span>
        <div>
          <div className="model-card-name">{modelo.nome}</div>
          <div className="model-card-provider">{modelo.provider}</div>
        </div>
        <span
          className={`model-card-badge ${modelo.categoria === 'pago' ? 'badge-pago' : 'badge-gratis'}`}
          style={{ marginLeft: 'auto' }}
        >
          {modelo.categoria}
        </span>
      </div>
      <div className="model-card-strengths">
        {modelo.pontos_fortes.slice(0, 3).map((pf) => (
          <span key={pf} className="strength-tag">
            {pf}
          </span>
        ))}
      </div>
    </div>
  )
}
