/* Verificação profunda: infla os streams dos PDFs e conta o uso de cada fonte
 * (confirma que os símbolos ✓ ✎ ▢ são vetoriais também no PDF 1/página). */
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const SAIDA = path.join(__dirname, '..', 'SalvedCards')

for (const nome of ['CartoesBiblicos_A4_3porPagina.pdf', 'CartoesBiblicos_A4_1porPagina.pdf']) {
  const bin = fs.readFileSync(path.join(SAIDA, nome)).toString('latin1')

  // Mapa objId → BaseFont
  const fontes = {}
  const reFont = /(\d+) 0 obj[^>]*?\/Type\s*\/Font[^>]*?\/BaseFont\s*\/([^\s\/>]+)/g
  let m
  while ((m = reFont.exec(bin)) !== null) fontes[m[1]] = m[2]

  // Mapa nomeRecurso → objId (ex.: /F1 5 0 R)
  const recursos = {}
  const reRec = /\/(F\d+) (\d+) 0 R/g
  while ((m = reRec.exec(bin)) !== null) recursos[m[1]] = m[2]

  // Infla todos os streams de conteúdo de página
  const streams = []
  const reStream = /stream\r?\n/g
  let idx = 0
  while ((m = reStream.exec(bin)) !== null) {
    const fim = bin.indexOf('endstream', m.index)
    if (fim < 0) continue
    const bruto = Buffer.from(bin.slice(m.index + m[0].length, fim), 'latin1')
    try {
      streams.push(zlib.inflateSync(bruto).toString('latin1'))
    } catch {}
  }
  const conteudo = streams.join('\n')

  // Conta glifos por fonte: "Tj"/"TJ" precedidos de /Fx tamanho Tf
  const uso = {}
  const reTf = /\/(F\d+) ([\d.]+) Tf/g
  let fonteAtual = null
  const linhas = conteudo.split('\n')
  for (const l of linhas) {
    const tf = l.match(/\/(F\d+) ([\d.]+) Tf/)
    if (tf) fonteAtual = tf[1]
    if (/T[jJ]/.test(l) && fonteAtual) {
      const base = fontes[recursos[fonteAtual]] || fonteAtual
      const n = (l.match(/<[^>]+>|\([^)]*\)/g) || []).length
      uso[base] = (uso[base] || 0) + n
    }
  }

  console.log('════════════════════════════════════════')
  console.log(nome)
  console.log('streams inflados:', streams.length, '· linhas de texto:')
  for (const [f, n] of Object.entries(uso).sort((a, b) => b[1] - a[1]))
    console.log(`   ${f.padEnd(26)} ${String(n).padStart(6)} bloco(s) de glifos`)
  const semVetor = Object.keys(uso).some((f) => !f.includes('+'))
  console.log(semVetor ? '⚠ há glifos sem fonte embutida' : '✔ 100% dos glifos usam fontes embutidas (vetor)')
  console.log()
}
