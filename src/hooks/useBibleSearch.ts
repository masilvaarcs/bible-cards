import { useState, useCallback } from 'react'
import { BibliaCompleta } from '../types'

export interface ResultadoBusca {
  livro: string
  capitulo: number
  versiculo: number
  texto: string
  referencia: string
}

export function useBibleSearch(biblia: BibliaCompleta | null) {
  const [termoBusca, setTermoBusca] = useState('')
  const [resultados, setResultados] = useState<ResultadoBusca[]>([])
  const [buscando, setBuscando] = useState(false)

  const buscar = useCallback(
    (termo: string) => {
      if (!biblia || !termo.trim()) {
        setResultados([])
        return
      }

      setBuscando(true)
      setTermoBusca(termo)

      const termoLower = termo.toLowerCase()
      const novosResultados: ResultadoBusca[] = []

      // Buscar em todos os livros e capítulos
      for (const livro of biblia.livros) {
        for (const cap of livro.capitulos) {
          for (const vers of cap.versiculos) {
            if (vers.texto.toLowerCase().includes(termoLower)) {
              novosResultados.push({
                livro: livro.livro.nome,
                capitulo: cap.numero,
                versiculo: vers.versiculo,
                texto: vers.texto,
                referencia: `${livro.livro.nome} ${cap.numero}:${vers.versiculo}`,
              })
            }
          }
        }
      }

      setResultados(novosResultados.slice(0, 100)) // Limitar a 100 resultados
      setBuscando(false)
    },
    [biblia],
  )

  const buscarPorReferencia = useCallback(
    (referencia: string) => {
      if (!biblia || !referencia.trim()) {
        setResultados([])
        return
      }

      // Parse da referência: "Gênesis 1:1" ou "1Samuel 3:10"
      const match = referencia.match(/^([\w\s]+?)\s+(\d+):(\d+)(?:-(\d+))?$/i)
      if (!match) {
        // Tentar formato sem versículo: "Gênesis 1"
        const matchCap = referencia.match(/^([\w\s]+?)\s+(\d+)$/i)
        if (matchCap) {
          const nomeLivro = matchCap[1].trim()
          const capNum = parseInt(matchCap[2])
          buscarCapitulo(nomeLivro, capNum)
          return
        }
        return
      }

      const nomeLivro = match[1].trim()
      const capNum = parseInt(match[2])
      const versInicio = parseInt(match[3])
      const versFim = match[4] ? parseInt(match[4]) : versInicio

      // Encontrar o livro
      const livro = biblia.livros.find(
        (l) =>
          l.livro.nome.toLowerCase() === nomeLivro.toLowerCase() ||
          l.livro.slug.toLowerCase() === nomeLivro.toLowerCase().replace(/\s+/g, '-'),
      )

      if (!livro) return

      const cap = livro.capitulos.find((c) => c.numero === capNum)
      if (!cap) return

      const novosResultados: ResultadoBusca[] = []
      for (const vers of cap.versiculos) {
        if (vers.versiculo >= versInicio && vers.versiculo <= versFim) {
          novosResultados.push({
            livro: livro.livro.nome,
            capitulo: cap.numero,
            versiculo: vers.versiculo,
            texto: vers.texto,
            referencia: `${livro.livro.nome} ${cap.numero}:${vers.versiculo}`,
          })
        }
      }

      setResultados(novosResultados)
    },
    [biblia],
  )

  const buscarCapitulo = useCallback(
    (nomeLivro: string, capNum: number) => {
      if (!biblia) return

      const livro = biblia.livros.find(
        (l) =>
          l.livro.nome.toLowerCase() === nomeLivro.toLowerCase() ||
          l.livro.slug.toLowerCase() === nomeLivro.toLowerCase().replace(/\s+/g, '-'),
      )

      if (!livro) return

      const cap = livro.capitulos.find((c) => c.numero === capNum)
      if (!cap) return

      const novosResultados: ResultadoBusca[] = cap.versiculos.map((vers) => ({
        livro: livro.livro.nome,
        capitulo: cap.numero,
        versiculo: vers.versiculo,
        texto: vers.texto,
        referencia: `${livro.livro.nome} ${cap.numero}:${vers.versiculo}`,
      }))

      setResultados(novosResultados)
    },
    [biblia],
  )

  const limpar = useCallback(() => {
    setTermoBusca('')
    setResultados([])
  }, [])

  return {
    termoBusca,
    setTermoBusca,
    resultados,
    buscando,
    buscar,
    buscarPorReferencia,
    buscarCapitulo,
    limpar,
  }
}
