/**
 * Suíte de testes — padrão de nomes dos livros da Bíblia (item 1 do TODO.md).
 *
 * As tabelas de referência abaixo são a fonte da verdade (extraídas dos prints
 * anexados pelo usuário e transcritas no TODO.md). Qualquer divergência futura
 * em bibliaLivros.ts, biblia_dados.py ou nos JSONs de dados falha aqui.
 *
 * Executar: npm test
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LIVROS } from '../src/data/bibliaLivros.ts'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')

// ─── Referência oficial — Escrituras Hebraico-Aramaiacas (39) + Gregas Cristãs (27) ───
const NOMES_EXTENSO = [
  'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio', 'Josué', 'Juízes', 'Rute', '1 Samuel', '2 Samuel', '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas', 'Esdras', 'Neemias', 'Ester', 'Jó', 'Salmos', 'Provérbios', 'Eclesiastes', 'Cântico de Salomão', 'Isaías', 'Jeremias', 'Lamentações', 'Ezequiel', 'Daniel', 'Oseias', 'Joel', 'Amós', 'Obadias', 'Jonas', 'Miquéias', 'Naum', 'Habacuque', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
  'Mateus', 'Marcos', 'Lucas', 'João', 'Atos', 'Romanos', '1 Coríntios', '2 Coríntios', 'Gálatas', 'Efésios', 'Filipenses', 'Colossenses', '1 Tessalonicenses', '2 Tessalonicenses', '1 Timóteo', '2 Timóteo', 'Tito', 'Filemom', 'Hebreus', 'Tiago', '1 Pedro', '2 Pedro', '1 João', '2 João', '3 João', 'Judas', 'Apocalipse',
]
const NOMES_CURTOS = [
  'Gên', 'Êx', 'Le', 'Núm', 'De', 'Jos', 'Jz', 'Ru', '1Sa', '2Sa', '1Rs', '2Rs', '1Cr', '2Cr', 'Esd', 'Ne', 'Est', 'Jó', 'Sal', 'Pr', 'Ec', 'Cân', 'Is', 'Je', 'La', 'Ez', 'Da', 'Os', 'Jl', 'Am', 'Ob', 'Jon', 'Miq', 'Na', 'Hab', 'Sof', 'Ag', 'Za', 'Mal',
  'Mt', 'Mr', 'Lu', 'Jo', 'At', 'Ro', '1Co', '2Co', 'Gál', 'Ef', 'Fil', 'Col', '1Te', '2Te', '1Ti', '2Ti', 'Tit', 'Flm', 'He', 'Tg', '1Pe', '2Pe', '1Jo', '2Jo', '3Jo', 'Ju', 'Ap',
]
const CAPITULOS = [
  50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150, 31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4,
  28, 16, 24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1, 22,
]

// ─── Módulo principal (src/data/bibliaLivros.ts) ───

test('LIVROS: exatamente 66 livros', () => {
  assert.equal(LIVROS.length, 66)
})

test('LIVROS: ordem sequencial 1..66 sem lacunas', () => {
  LIVROS.forEach((livro, i) => assert.equal(livro.ordem, i + 1, `posição ${i + 1}`))
})

test('LIVROS: 39 hebraico + 27 grego, com fronteira correta', () => {
  assert.equal(LIVROS.filter((l) => l.testamento === 'hebraico').length, 39)
  assert.equal(LIVROS.filter((l) => l.testamento === 'grego').length, 27)
  LIVROS.forEach((l, i) => {
    assert.equal(l.testamento, i < 39 ? 'hebraico' : 'grego', `livro ${l.nome} na ordem ${i + 1}`)
  })
})

test('LIVROS: nomes por extenso idênticos à referência', () => {
  LIVROS.forEach((l, i) => {
    assert.equal(l.nome, NOMES_EXTENSO[i], `ordem ${i + 1}: esperado "${NOMES_EXTENSO[i]}", obtido "${l.nome}"`)
  })
})

test('LIVROS: abreviações idênticas à referência (padrão de nomes curtos)', () => {
  LIVROS.forEach((l, i) => {
    assert.equal(l.abrev, NOMES_CURTOS[i], `ordem ${i + 1} (${l.nome}): esperado "${NOMES_CURTOS[i]}", obtido "${l.abrev}"`)
  })
})

test('LIVROS: sem duplicidades de nome, abreviação e slug', () => {
  for (const campo of ['nome', 'abrev', 'slug'] as const) {
    const valores = LIVROS.map((l) => l[campo])
    assert.equal(new Set(valores).size, 66, `campo "${campo}" tem duplicidades`)
  }
})

test('LIVROS: capítulos idênticos à referência (soma 1189)', () => {
  LIVROS.forEach((l, i) => {
    assert.equal(l.capitulos, CAPITULOS[i], `${l.nome}: esperado ${CAPITULOS[i]} capítulos, obtido ${l.capitulos}`)
  })
  assert.equal(LIVROS.reduce((soma, l) => soma + l.capitulos, 0), 1189)
})

// ─── Espelho Python (gerador dos JSONs) ───

test('scripts/biblia_dados.py: nomes e abreviações idênticos à referência', () => {
  const py = readFileSync(join(RAIZ, 'scripts/biblia_dados.py'), 'utf8')
  const linhas = [...py.matchAll(/"nome": "([^"]+)",\s+"slug": "[^"]+",\s*"abrev": "([^"]+)"/g)]
  assert.equal(linhas.length, 66, `extraídas ${linhas.length} entradas do .py (esperado 66)`)
  linhas.forEach((m, i) => {
    assert.equal(m[1], NOMES_EXTENSO[i], `.py ordem ${i + 1}: nome "${m[1]}" deveria ser "${NOMES_EXTENSO[i]}"`)
    assert.equal(m[2], NOMES_CURTOS[i], `.py ordem ${i + 1}: abrev "${m[2]}" deveria ser "${NOMES_CURTOS[i]}"`)
  })
})

// ─── Dados gerados/servidos ───

function conferirLivro(livro, origem) {
  const ref = livro.ordem - 1
  assert.equal(livro.nome, NOMES_EXTENSO[ref], `${origem}: nome "${livro.nome}" deveria ser "${NOMES_EXTENSO[ref]}"`)
  assert.equal(livro.abreviacao, NOMES_CURTOS[ref], `${origem}: abreviacao "${livro.abreviacao}" deveria ser "${NOMES_CURTOS[ref]}"`)
}

test('dados servidos: public/dados/nwt_biblia_completa.json com nomes corretos', () => {
  const d = JSON.parse(readFileSync(join(RAIZ, 'public/dados/nwt_biblia_completa.json'), 'utf8'))
  assert.equal(d.total_livros, 66)
  assert.equal(d.livros.length, 66)
  d.livros.forEach((entrada, i) => {
    assert.equal(entrada.livro.ordem, i + 1, `livros[${i}].ordem`)
    conferirLivro(entrada.livro, `livros[${i}]`)
  })
})

test('DadosBiblia/nwt_biblia_completa.json com nomes corretos', () => {
  const d = JSON.parse(readFileSync(join(RAIZ, 'DadosBiblia/nwt_biblia_completa.json'), 'utf8'))
  assert.equal(d.livros.length, 66)
  d.livros.forEach((entrada) => conferirLivro(entrada.livro, `ordem ${entrada.livro.ordem}`))
})

test('DadosBiblia/nwt_por_livro: 66 arquivos com metadados corretos', () => {
  const dir = join(RAIZ, 'DadosBiblia/nwt_por_livro')
  const arquivos = readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
  assert.equal(arquivos.length, 66, `encontrados ${arquivos.length} arquivos (esperado 66)`)
  for (const arquivo of arquivos) {
    const d = JSON.parse(readFileSync(join(dir, arquivo), 'utf8'))
    conferirLivro(d.livro, arquivo)
  }
})
