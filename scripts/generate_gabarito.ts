import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert'

const RAIZ = dirname(fileURLToPath(import.meta.url))
const HTML = readFileSync(join(RAIZ, '..', 'design', 'cartao-modelo.html'), 'utf8')

const EXCERPT_START = 'const PERSONAGENS = ['
const EXCERPT_END = '\n];\n'
const start = HTML.indexOf(EXCERPT_START)
const end = HTML.indexOf(EXCERPT_END)
assert.ok(start > 0 && end > start, 'não consegui achar PERSONAGENS no HTML')

const { createContext, runInContext } = await import('node:vm')
const snippet = HTML.slice(start, end + EXCERPT_END.length)
const initializer = snippet.replace(/^(?:const|let|var)\s+PERSONAGENS\s*=\s*/, 'var PERSONAGENS = ')

const ctx = createContext({ Math, console })
runInContext(initializer, ctx)
const personagens = ctx.PERSONAGENS

function formatTipo(tipo: string): string {
  return tipo === 'r' ? 'Responda' : tipo === 'v' ? 'Verdadeiro/Falso' : 'Complete'
}

function formatResposta(r: string): { texto: string; ref: string } {
  const [txt, ref] = r.split('|')
  return { texto: txt.trim(), ref: ref.trim() }
}

let output = ''
output += '='.repeat(80) + '\n'
output += 'GABARITO COMPLETO — Cartões Bíblicos Série 1 (30 personagens)\n'
output += '='.repeat(80) + '\n\n'

for (const p of personagens) {
  output += '-'.repeat(80) + '\n'
  output += `ID: ${p.id} | Nome: ${p.nome} | Período: ${p.banda}\n`
  output += `-`.repeat(80) + '\n\n'
  
  output += 'PERFIL:\n'
  output += `  História: ${p.historia.replace(/<[^>]+>/g, '')}\n`
  output += `  Livros: ${p.livro}\n`
  output += `  Significado: ${p.nomeSignificado}\n`
  output += `  Genealogia: ${p.genealogia}\n`
  output += `  Função: ${p.funcao}\n`
  output += `  Profecia: ${p.profecia}\n`
  output += `  Destaque: ${p.destaque}\n`
  output += `  Curiosidade: ${p.curiosidade}\n`
  output += `  Versículo: ${p.versiculo}\n\n`
  
  output += 'QUESTÕES E RESPOSTAS:\n'
  
  const perguntasComRespostas = p.perguntas.map((q: any, idx: number) => {
    const resp = formatResposta(p.respostas[idx])
    return { pergunta: q, resposta: resp }
  })
  
  for (const { pergunta, resposta } of perguntasComRespostas) {
    const tipoLabel = formatTipo(pergunta.t)
    output += `  [${tipoLabel}] ${pergunta.txt}\n`
    if (pergunta.ops) {
      output += `      Opções: ${pergunta.ops}\n`
    }
    output += `      Resposta: ${resposta.texto}\n`
    output += `      Referência: ${resposta.ref}\n\n`
  }
  
  output += '\n'
}

console.log(output)