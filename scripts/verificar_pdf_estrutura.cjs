/* Verificação estrutural dos PDFs via pdf.js (Node, sem renderização):
 *  • nº de páginas e caixas
 *  • operadores por página: caminhos vetoriais, glifos de texto, imagens raster
 *  • camada de texto extraída (prova de texto selecionável/pesquisável)
 * Uso: NODE_PATH=<tmp>/node_modules node scripts/verificar_pdf_estrutura.cjs */
const fs = require('fs')
const path = require('path')
const SAIDA = path.join(__dirname, '..', 'SalvedCards')
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js')

async function analisar(nome) {
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(fs.readFileSync(path.join(SAIDA, nome))),
    useSystemFonts: false,
  }).promise

  console.log('════════════════════════════════════════')
  console.log(nome)
  console.log('páginas:', doc.numPages)

  let totalTexto = 0, totalCaminhos = 0, totalImagens = 0, totalCurvas = 0
  let amostraTexto = ''
  for (let n = 1; n <= doc.numPages; n++) {
    const pg = await doc.getPage(n)
    if (n === 1) {
      const vp = pg.getViewport({ scale: 1 })
      console.log(`MediaBox: ${vp.width.toFixed(1)} × ${vp.height.toFixed(1)} pt (A4 = 595×842)`)
    }
    const ops = await pg.getOperatorList()
    const OPS = pdfjs.OPS
    for (let i = 0; i < ops.fnArray.length; i++) {
      const fn = ops.fnArray[i]
      if (fn === OPS.showText || fn === OPS.showSpacedText) totalTexto++
      else if (fn === OPS.constructPath) totalCaminhos++
      else if (fn === OPS.paintImageXObject || fn === OPS.paintJpegXObject || fn === OPS.paintInlineImageXObject) totalImagens++
      if (fn === OPS.constructPath) {
        const args = ops.argsArray[i]
        totalCurvas += (args[2] || []).filter((op) => op === OPS.bezierCurveTo).length
      }
    }
    if (n === 1) {
      const tc = await pg.getTextContent()
      amostraTexto = tc.items.map((it) => it.str).join(' ').replace(/\s+/g, ' ').slice(0, 300)
    }
  }
  console.log('glifos/blocos de TEXTO (vetor):', totalTexto)
  console.log('caminhos vetoriais:', totalCaminhos, '· curvas Bézier:', totalCurvas)
  console.log('imagens raster desenhadas:', totalImagens)
  console.log('texto da página 1 (extraído):', JSON.stringify(amostraTexto))
  console.log()
}

;(async () => {
  await analisar('CartoesBiblicos_A4_3porPagina.pdf')
  await analisar('CartoesBiblicos_A4_1porPagina.pdf')
  console.log('✔ Verificação estrutural concluída.')
})().catch((e) => {
  console.error('ERRO:', e)
  process.exit(1)
})
