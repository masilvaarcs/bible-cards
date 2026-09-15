/* Análise interna dos PDFs: fontes embutidas (texto vetorial), dimensões das
 * imagens raster e caixas de página.
 * Uso: NODE_PATH=<tmp>/node_modules node scripts/analizar_pdf.cjs */
const fs = require('fs')
const path = require('path')
const SAIDA = path.join(__dirname, '..', 'SalvedCards')

for (const nome of ['CartoesBiblicos_A4_3porPagina.pdf', 'CartoesBiblicos_A4_1porPagina.pdf']) {
  const buf = fs.readFileSync(path.join(SAIDA, nome))
  const bin = buf.toString('latin1')

  // Fontes embutidas (subset com prefixo ABCDEF+ significa vetor de texto)
  const fontes = [...new Set(bin.match(/\/BaseFont\s*\/[A-Z]{6}\+[A-Za-z0-9-]+/g) || [])]

  // Dimensões das imagens raster (objeto /Width /Height /ColorSpace /Filter)
  const imgs = []
  const re = /\/Width (\d+)\/Height (\d+)\/ColorSpace(\/\w+|\/Device\w+)\/BitsPerComponent (\d+)\/Filter(\/\w+)\/Length \d+>>stream/g
  let m
  while ((m = re.exec(bin)) !== null) {
    imgs.push({ w: +m[1], h: +m[2], cs: m[3].replace('/', ''), filtro: m[5].replace('/', '') })
  }

  // Caixa MediaBox (A4 esperado: 595.28 × 841.89 pt)
  const media = [...new Set((bin.match(/\/MediaBox\s*\[[^\]]+\]/g) || []))]

  console.log('════════════════════════════════════════')
  console.log(nome)
  console.log('────────────────────────────────────────')
  console.log('MediaBox:', media.join(' | ') || 'n/d')
  console.log('Fontes embutidas (texto vetorial):')
  for (const f of fontes) console.log('  ', f)
  console.log('Imagens raster embutidas:', imgs.length)
  const unicos = new Map()
  for (const im of imgs) {
    const chave = `${im.w}×${im.h} ${im.cs}/${im.filtro}`
    unicos.set(chave, (unicos.get(chave) || 0) + 1)
  }
  for (const [k, q] of unicos) console.log(`   ${k} → ${q} ocorrência(s)`)
  const semFonte = fontes.length === 0
  console.log(semFonte ? '⚠ NENHUMA FONTE EMBUTIDA (texto pode ter virado raster!)' : '✔ Texto vetorial confirmado (fontes subset embutidas).')
  console.log()
}
