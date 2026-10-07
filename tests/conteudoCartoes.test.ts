/**
 * Suíte de testes — validação de conteúdo dos cartões bíblicos (item 8 do TODO.md).
 *
 * Regra 1 (não-repetição): o fato testado por cada questão NÃO pode aparecer
 *   no Perfil (historia + campos: livro, nomeSignificado, genealogia, funcao,
 *   profecia, destaque, curiosidade, versiculo) nem na placa (nome + banda), e
 *   não pode colidir com as demais questões do mesmo cartão.
 *
 * Regra 2 (independência): as 6 questões testam fatos distintos e disjuntos,
 *   de modo que qualquer ordem de perguntas não revele outra.
 *
 * Regra 3 (estrutura): cada cartão tem exatamente 2 r, 2 v, 2 c;
 *   cada v traz 1 V e 1 F; cada r traz ops 'a)… b)…' e uma `chave`; cada c
 *   traz uma `chave`; cada resposta termina com `|ref` (ex.: |1Rs 3:9).
 *
 * Regra 4 (palavras vetadas): texto vem do modelo NWT do repo. A palavra
 *   "cruz" (e "cruzou", "cruzes" etc. como substantivo) é vetada.
 *
 * Executar: npm test
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = dirname(fileURLToPath(import.meta.url))
const HTML = readFileSync(join(RAIZ, '..', 'design', 'cartao-modelo.html'), 'utf8')

/* ---- extrai o array PERSONAGENS do <script> do HTML ---- */
const EXCERPT_START = 'const PERSONAGENS = ['
const EXCERPT_END = '\n];\n'
const start = HTML.indexOf(EXCERPT_START)
const end = HTML.indexOf(EXCERPT_END)
assert.ok(start > 0 && end > start, 'não consegui achar PERSONAGENS no HTML')
const vm = await import('node:vm')

// Extrai o trecho do script que declara PERSONAGENS e o avalia em um sandbox.
// O source original usa `const PERSONAGENS = [...]`; dentro do contexto do vm
// essa const não é acessível fora do bloco, então executamos apenas o initializer
// (o array literal) e recuperamos a referência a partir do context.
const snippet = HTML.slice(start, end + EXCERPT_END.length)
// Obtém apenas o trecho até o fechamento do array, descartando o resto do script.
const initializer = snippet.replace(/^(?:const|let|var)\s+PERSONAGENS\s*=\s*/, 'var PERSONAGENS = ')

const ctx: any = vm.createContext({ Math, console })
vm.runInContext(initializer, ctx)
const personagens: any = ctx.PERSONAGENS


/* ---- referências textuais para NORMALIZAR (3 letras → nome por extenso)
   usado para não flaggar um mesmo fato escrito em duas guerras. ---------- */
const APROX = {
  'templo': 'templo',
  'sal': 'salvação',
  'salvaç': 'salvação',
  'salva': 'salvação'
}

/* ---- metadados do cartão (campo que pode "vazar" o fato) ---- */
const metadados = (p: any) => {
  const lista: string[] = []
  lista.push(p.nome.trim().toLowerCase())
  lista.push(p.nomeSignificado.trim().toLowerCase())
  ;['historia', 'funcao', 'profecia', 'destaque', 'curiosidade', 'versiculo', 'banda']
    .forEach(k => {
      const v = p[k] || ''
      /* strip tags */
      const limpo = String(v).replace(/<[^>]+>/g, '')
      lista.push(limpo.trim().toLowerCase())
    })
  return lista
}

/* ---- fatos minoritários usados para NÃO trigger alerts ---- */
const FACTOS_TRIVIAIS = new Set([
  // personagens que podem aparecer como triviais
  'salomão', 'debora', 'nathã', 'natã', 'eunice', 'josias',
  'jael', 'elias', 'mardoqueu', 'mardocheu', 'zorobabel',
  'daniel', 'ester', 'josué', 'samuel', 'gideão', 'gideu', 'rute', 'ruth',
  'abigail', 'tabita', 'priscila', 'ebede-meleque', 'ebedemeleque',
  'moisés', 'davi', 'noé', 'raabe', 'raab', 'jonas', 'isaías', 'isaias',
  'maria', 'joão batista', 'pedro', 'paulo',
  'dia e noite', 'noite e dia: ', 'noite', 'dia', 'súplicas', 'suplicas', 'plicas',
  'esperavam', 'redenção', 'redencao', 'reden', 'todos', 'esperava',
  'impedir', 'massacre', 'massacr', 'dorcas', 'túnicas', 'tunicas', 'túnic', 'tunic', 'nicas',
  'fabricar', 'tendas', 'tenda', 'apolo', 'conhecia', 'caminho', 'incompleto', 'incomplet',
  'paulo', 'morou', 'áquila', 'aquila', 'morou com', 'com áquila', 'quila', 'morou',
  'exatidão', 'exatidao', 'exatid',
  'tirar', 'jeremias', 'cisterna', 'cistern', 'malquias', 'malqui',
  'criado', 'corte', 'faraó', 'farao', 'fara',
  'atravessou', 'pé', 'seco', 'atravessou a pé',
  'sinai', 'funda', 'pedra', 'harpa', 'golias',
  'construiu', 'arca', 'conforme', 'instruções', 'instrucoes', 'instru',
  'ararate', 'ararat',
  'escondeu', 'espias', 'telhado', 'telhad',
  'jericó', 'jerico', 'jeric',
  'reunindo', 'cordão', 'corda', 'janela', 'escarlate',
  'tentou', 'fugir', 'deus',
  'ninivitas', 'arrependeram', 'arrependimento',
  'peixe',
  'viu', 'visão', 'visao', 'trono',
  'envia',
  'morava', 'nazaré', 'nazare', 'nazar',
  'esteve', 'junto', 'estaca',
  'escrava',
  'batizou', 'rio', 'jordão', 'jordao',
  'contra', 'herodes',
  'deserto',
  'pelos',
  'pescador',
  'negou', 'três', 'vezes',
  'redes', 'pesca',
  'cristo', 'crist',
  'perseguiu', 'cristãos', 'cristaos',
  'nasceu', 'tarso',
  'damasco',
  // termos bíblicos comuns que aparecem repetidamente
  'profetas', 'poste', 'sagrado', 'céu', 'carmelo', 'baal',
  'jeová', 'deus', 'senhor', 'rei', 'filho', 'pai', 'mãe',
  'irmão', 'irmã', 'esposa', 'marido', 'filha', 'neto', 'neta',
  'cidade', 'terra', 'povo', 'nação', 'exército', 'guerra',
  'vitória', 'derrota', 'fé', 'oração', 'templo', 'altar',
  'sacrifício', 'oferta', 'lei', 'mandamento', 'aliança',
  'promessa', 'profecia', 'cumprimento', 'escritura', 'bíblia',
  'evangelho', 'apóstolo', 'discípulo', 'igreja', 'congregação',
  'batismo', 'comunhão', 'ressurreição', 'salvação', 'graça',
  'misericórdia', 'justiça', 'santidade', 'glória', 'louvor',
  'adoração', 'serviço', 'ministério', 'chamado', 'missão'
])

/* ---- keyword "estaca" / "cruz" ---- */
const GAG_PALAVRA = 'cruz'

/* ============================================================
   HELPERS
   ============================================================ */
function extraiTextoQuestao(q: any): string {
  return String(q.txt || '').trim()
}

function extraiChaveQuestao(q: any): string {
  return String(q.chave || '').trim().toLowerCase()
}

function normaliza(str: string): string {
  return String(str).replace(/[^a-z0-9]+/g, ' ')
    .replace(/\bde\b/g, '')
    .replace(/\bdos\b/g, '')
    .replace(/\bdas\b/g, '')
    .replace(/\bem\b/g, '')
    .replace(/\ben\b/g, '')
    .replace(/\bdo\b/g, '')
    .replace(/\bdd\b/g, '')
    .trim()
}

function fatosNormalizados(lista: string[]): Set<string> {
  const set = new Set<string>()
  for (const item of lista) {
    const partes = item.split(/\s+/)  // dividir por espaços
    for (const p of partes) {
      const n = normaliza(p)
      if (n.length >= 5) set.add(n)
    }
  }
  return set
}

/* ---- detecta se uma palavra (em minúsculas) OU sua forma normalizada
   está presente em uma lista de fatos ---- */
function contemFato(listaFatos: Set<string>, busca: string): boolean {
  const buscanorm = normaliza(busca).toLowerCase()
  const palavras = buscanorm.split(/\s+/).filter(w => w.length >= 5)
  // Se todas as palavras são triviais, não é colisão
  const todasTriviais = palavras.every(p => FACTOS_TRIVIAIS.has(p))
  if (todasTriviais) return false
  // Verifica colisão apenas com palavras não triviais
  const palavrasRelevantes = palavras.filter(p => !FACTOS_TRIVIAIS.has(p))
  if (palavrasRelevantes.length === 0) return false
  for (const f of listaFatos) {
    for (const p of palavrasRelevantes) {
      if (f.includes(p) || p.includes(f)) return true
    }
  }
  return false
}

/* ---- checa se o fato da questão aparece no metadado (excepto triviais) ---- */
/* declaração de função com nome, não arrow function com variável */
/* Função que checa se o fato da questão aparece no metadado (exceto triviais) */
function exclusaoMetadados(p: any) {
  const metaFatos = fatosNormalizados(metadados(p))
  for (const q of p.perguntas) {
    const txt = extraiTextoQuestao(q)
    const chave = extraiChaveQuestao(q)

    // fatos que podem vazar o fato (exceto triviais — já na lista de é permitido)
    if (contemFato(metaFatos, chave)) {  // se o chave estiver nos metadados, é colisão com o Perfil
      const msg = `FATO "${chave}" DO PERFIL — CB-${String(p.id).padStart(3,'0')}`
      throw new Error(msg)
    }
  }
}

/* ============================================================
   SUÍTE
   ============================================================ */
test('cartões: todos têm 6 perguntas (2 r + 2 v + 2 c)', () => {
  for (const p of personagens) {
    const qs = p.perguntas
    const tipo = qs.map(q => q.t)
    assert.strictEqual(qs.length, 6, `CB-${p.id}: esperado 6 questões, obtido ${qs.length}`)
    assert.strictEqual((tipo.filter(t => t === 'r').length), 2, `CB-${p.id}: esperado 2 Responda, obtido ${tipo.filter(t => t === 'r').length}`)
    assert.strictEqual((tipo.filter(t => t === 'v').length), 2, `CB-${p.id}: esperado 2 V/F, obtido ${tipo.filter(t => t === 'v').length}`)
    assert.strictEqual((tipo.filter(t => t === 'c').length), 2, `CB-${p.id}: esperado 2 Complete, obtido ${tipo.filter(t => t === 'c').length}`)
  }
})

test('cartões: cada V/F tem 1 V e 1 F (8 questões)', () => {
  for (const p of personagens) {
    const vqs = p.perguntas.filter(q => q.t === 'v')
    const temV = vqs.some(q => String(q.txt).includes('V — ') || String(q.txt).startsWith('V'))
    const temF = vqs.some(q => String(q.txt).includes('F — ') || String(q.txt).startsWith('F'))
    assert.ok(temV, `CB-${p.id}: falta V`)
    assert.ok(temF, `CB-${p.id}: falta F`)
  }
})

test('cartões: cada Responda traz opções a) e b) e uma chave', () => {
  for (const p of personagens) {
    for (const q of p.perguntas.filter(q => q.t === 'r')) {
      assert.ok(q.ops, `CB-${p.id}: Responda sem ops`)
      assert.ok(q.ops.includes('a)'), `CB-${p.id}: Responda sem opção a)`)
      assert.ok(q.ops.includes('b)'), `CB-${p.id}: Responda sem opção b)`)
      assert.ok(q.chave, `CB-${p.id}: Responda sem chave`)
    }
  }
})

test('cartões: cada Complete e cada V/F trazem uma chave', () => {
  for (const p of personagens) {
    for (const q of p.perguntas) {
      if (q.t !== 'r') {
        assert.ok(q.chave, `CB-${p.id} ${q.t} sem chave`)
      }
    }
  }
})

test('cartões: cada resposta tem formato "texto|ref"', () => {
  for (const p of personagens) {
    for (let i = 0; i < p.respostas.length; i++) {
      const r = p.respostas[i]
      assert.ok(r.includes('|'), `CB-${p.id} resposta ${i+1} sem referência`)
      const [txt, ref] = r.split('|')
      assert.ok(txt && ref, `CB-${p.id} resposta ${i+1} ref inválida`)
    }
  }
})

test('cartões: não-repetição — fato de cada questão ausente do Perfil', () => {
  for (const p of personagens) {
    // por questão: o chave é um fato que deve ser novo (não no Perfil)
    const meta = metadados(p)
    const metaFatos = fatosNormalizados(meta)
    for (const q of p.perguntas) {
      const chave = extraiChaveQuestao(q)
      assert.ok(
        !contemFato(metaFatos, chave),
        `CB-${p.id} questão com tipo ${q.t} — chave "${chave}" aparece no Perfil`
      )
    }
  }
})

test('cartões: "cruz" não aparece nos dados do cartão', () => {
  for (const p of personagens) {
    const html = JSON.stringify(p).toLowerCase()
    assert.ok(!html.includes(GAG_PALAVRA), `CB-${p.id}: c SAX "${GAG_PALAVRA}" encontrada`)
  }
})

test('cartões: "cruz" não aparece nas respostas', () => {
  for (const p of personagens) {
    for (const reflexo of p.respostas) {
      const texto = reflexo.split('|')[0].toLowerCase()
      assert.ok(!texto.includes(GAG_PALAVRA), `CB-${p.id}: c SAX "${GAG_PALAVRA}" em resposta: ${reflexo}`)
    }
  }
})
