/* Medição objetiva de qualidade:
 *  1. PNGs  → dimensões reais e % de pixels de borda nítidos (Laplaciano)
 *  2. PDFs  → nº de páginas e renderização a 600 DPI (pdf.js) com a mesma métrica
 * Saída: valores usados no RELATORIO_QUALIDADE.md */
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer-core')

const RAIZ = path.resolve(__dirname, '..')
const SAIDA = path.join(RAIZ, 'SalvedCards')
const PDFJS = 'file:///' + path.join(process.env.LOCALAPPDATA || 'C:/Users/masil/AppData/Local/Temp', 'node_modules/pdfjs-dist/build/pdf.min.js').replace(/\\/g, '/')

function acharNavegador() {
  for (const c of [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ])
    if (fs.existsSync(c)) return c
  throw new Error('Chrome/Edge não encontrado')
}

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: acharNavegador(),
    headless: true,
    args: ['--no-sandbox', '--allow-file-access-from-files'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 900, height: 700 })
  await page.goto('about:blank')

  // ── 1) PNGs ──────────────────────────────────────────────────────────
  const pngs = fs.readdirSync(SAIDA).filter((f) => f.endsWith('.png'))
  const amostras = [
    pngs.find((f) => f.includes('CB-001') && f.includes('aberto')),
    pngs.find((f) => f.includes('CB-011') && f.includes('aberto')),
    pngs.find((f) => f.includes('CB-030') && f.includes('aberto')),
    pngs.find((f) => f.includes('CB-005') && f.includes('LadoDireito')),
    pngs.find((f) => f.includes('CB-029') && f.includes('LadoEsquerdo')),
  ].filter(Boolean)

  const resPng = []
  for (const nome of amostras) {
    const b64 = fs.readFileSync(path.join(SAIDA, nome)).toString('base64')
    const r = await page.evaluate(async (b64) => {
      const img = new Image()
      img.src = 'data:image/png;base64,' + b64
      await new Promise((ok, err) => ((img.onload = ok), (img.onerror = err)))
      const cv = document.createElement('canvas')
      cv.width = img.width
      cv.height = img.height
      const ctx = cv.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const d = ctx.getImageData(0, 0, cv.width, cv.height).data
      const lum = new Float32Array(cv.width * cv.height)
      let naoFundo = 0
      for (let i = 0, p = 0; i < d.length; i += 4, p++) {
        lum[p] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
        if (Math.abs(d[i] - 251) + Math.abs(d[i + 1] - 247) + Math.abs(d[i + 2] - 238) > 24) naoFundo++
      }
      // Laplaciano 4-vizinhos em amostragem (1 a cada 3 px, com passo 2)
      let borda = 0, forte = 0
      for (let y = 2; y < cv.height - 2; y += 2) {
        for (let x = 2; x < cv.width - 2; x += 2) {
          const i = y * cv.width + x
          const l = 4 * lum[i] - lum[i - 1] - lum[i + 1] - lum[i - cv.width] - lum[i + cv.width]
          if (Math.abs(l) > 40) {
            borda++
            if (Math.abs(l) > 120) forte++
          }
        }
      }
      return {
        w: cv.width,
        h: cv.height,
        bordaPct: +((borda / ((cv.width * cv.height) / 8)) * 100).toFixed(2),
        fortePct: +((forte / ((cv.width * cv.height) / 8)) * 100).toFixed(2),
        conteudoPct: +((naoFundo / (cv.width * cv.height)) * 100).toFixed(1),
      }
    }, b64)
    resPng.push({ nome, ...r })
  }

  console.log('══════════ PNGs (amostra) ══════════')
  for (const r of resPng) {
    const dpiX = (r.w / 20 / 2.54).toFixed(0)
    const dpiLado = (r.w / 10 / 2.54).toFixed(0)
    const tipo = r.nome.includes('aberto') ? `20cm→${dpiX} DPI` : `10cm→${dpiLado} DPI`
    console.log(
      `${r.nome.padEnd(48)} ${r.w}×${r.h}px  ${tipo}  bordas: ${r.bordaPct}% (fortes ${r.fortePct}%)  conteúdo: ${r.conteudoPct}%`,
    )
  }

  // ── 2) PDFs renderizados a 600 DPI ───────────────────────────────────
  await page.setContent('<script src="' + PDFJS + '"></script>', { waitUntil: 'load' })
  await page.waitForFunction(() => window.pdfjsLib, { timeout: 20000 })
  await page.evaluate(() => {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = ''
  })

  console.log('\n══════════ PDFs (render 600 DPI) ══════════')
  for (const nome of ['CartoesBiblicos_A4_3porPagina.pdf', 'CartoesBiblicos_A4_1porPagina.pdf']) {
    const b64 = fs.readFileSync(path.join(SAIDA, nome)).toString('base64')
    const r = await page.evaluate(async (b64) => {
      const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
      const doc = await pdfjsLib.getDocument({ data: bin }).promise
      const pg = await doc.getPage(1)
      const DPI = 600
      const vp = pg.getViewport({ scale: DPI / 72 })
      const cv = document.createElement('canvas')
      cv.width = Math.min(vp.width, 4000) // teto de memória: renderiza trecho superior
      cv.height = Math.min(vp.height, 4000)
      const ctx = cv.getContext('2d')
      await pg.render({ canvasContext: ctx, viewport: vp, transform: [1, 0, 0, 1, 0, 0] }).promise
      const d = ctx.getImageData(0, 0, cv.width, cv.height).data
      const lum = new Float32Array(cv.width * cv.height)
      for (let i = 0, p = 0; i < d.length; i += 4, p++)
        lum[p] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
      let borda = 0, forte = 0, total = 0
      for (let y = 2; y < cv.height - 2; y += 2)
        for (let x = 2; x < cv.width - 2; x += 2) {
          total++
          const i = y * cv.width + x
          const l = 4 * lum[i] - lum[i - 1] - lum[i + 1] - lum[i - cv.width] - lum[i + cv.width]
          if (Math.abs(l) > 40) {
            borda++
            if (Math.abs(l) > 120) forte++
          }
        }
      return { paginas: doc.numPages, w: cv.width, h: cv.height, bordaPct: +((borda / total) * 100).toFixed(2), fortePct: +((forte / total) * 100).toFixed(2) }
    }, b64)
    console.log(
      `${nome.padEnd(44)} ${r.paginas} pág. · render ${r.w}×${r.h}px @600DPI · bordas: ${r.bordaPct}% (fortes ${r.fortePct}%)`,
    )
  }

  await browser.close()
  console.log('\n✔ Medição concluída.')
})().catch((e) => {
  console.error('ERRO:', e)
  process.exit(1)
})
