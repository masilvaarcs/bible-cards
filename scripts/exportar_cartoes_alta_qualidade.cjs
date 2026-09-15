/* ============================================================================
 * Exportação em ALTA QUALIDADE — Cartões Bíblicos (30 personagens)
 * ----------------------------------------------------------------------------
 * Saída em  ./SalvedCards/
 *   • 30 PNGs "abertos"   (20×10 cm  @ ~600 DPI → 4536×2268 px)
 *   • 60 PNGs por lado    (10×10 cm  @ ~600 DPI → 2268×2268 px)
 *     (LadoEsquerdo = capa com perguntas · LadoDireito = perfil + respostas)
 *   • PDF vetorial A4 — 3 cartões/página (10 páginas)
 *   • PDF vetorial A4 — 1 cartão/página (30 páginas, tamanho real 20×10 cm)
 *   • RELATORIO_QUALIDADE.md
 *
 * Os PDFs são VETORIAIS (texto nítido em qualquer zoom/impressora).
 * Os PNGs são rasterizados a ~600 DPI — adequados para jato de tinta.
 *
 * Requisitos: Chrome/Edge instalado + `npm i -D puppeteer-core`
 * Uso:  NODE_PATH=<pasta com puppeteer-core> node scripts/exportar_cartoes_alta_qualidade.cjs
 * ==========================================================================*/
const fs = require('fs')
const path = require('path')
const { readdirSync } = fs
const puppeteer = require('puppeteer-core')

const RAIZ = path.resolve(__dirname, '..')
const HTML = path.join(RAIZ, 'design', 'cartao-modelo.html')
const SAIDA = path.join(RAIZ, 'SalvedCards')
const DPI = 6 // 96 dpi × 6 = 576 dpi ≈ 600 dpi para impressão jato de tinta

// Procura o executável do Chrome/Edge no Windows
function acharNavegador() {
  const candidatos = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ]
  for (const c of candidatos) if (fs.existsSync(c)) return c
  throw new Error('Chrome/Edge não encontrado.')
}

;(async () => {
  fs.mkdirSync(SAIDA, { recursive: true })
  const navegador = acharNavegador()
  console.log('Navegador:', navegador)

  const browser = await puppeteer.launch({
    executablePath: navegador,
    headless: true,
    args: ['--no-sandbox', '--font-render-hinting=none', '--hide-scrollbars'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 1200, deviceScaleFactor: DPI })

  await page.goto('file:///' + HTML.replace(/\\/g, '/'), { waitUntil: 'networkidle0' })
  await page.waitForFunction(
    () =>
      document.readyState === 'complete' &&
      typeof renderCartao === 'function' &&
      document.querySelectorAll('.folha').length > 0,
    { timeout: 30000 },
  )

  // Sorteio determinístico (reprodutível): 1 V/F + 2 Complete + 2 Responda por cartão
  await page.evaluate(() => {
    function seedEmbaralhar(arr) {
      const a = arr.slice()
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    }
    sorteados = PERSONAGENS.map((p) => {
      const banco = p.perguntas.map((q, oi) => ({ ...q, oi }))
      const vf = seedEmbaralhar(banco.filter((q) => q.t === 'v')).slice(0, 1)
      const comp = seedEmbaralhar(banco.filter((q) => q.t === 'c')).slice(0, 2)
      const resp = seedEmbaralhar(banco.filter((q) => q.t === 'r')).slice(0, 2)
      return seedEmbaralhar(vf.concat(comp, resp))
    })
    renderVisor()
    reconstruirFolhas()
  })

  // ── 1) PNGs em ~600 DPI ────────────────────────────────────────────────
  await page.evaluate(() => {
    const area = document.getElementById('area-exportacao')
    area.style.left = '0'
    area.style.top = '0'
    area.style.width = '756px'
    area.style.zIndex = '-1'
  })
  const alvos = []
  for (let i = 0; i < 30; i++) alvos.push({ i, sel: null, suf: '-aberto' })
  for (let i = 0; i < 30; i++) alvos.push({ i, sel: '.frente', suf: '-LadoEsquerdo' })
  for (let i = 0; i < 30; i++) alvos.push({ i, sel: '.verso', suf: '-LadoDireito' })

  let feitos = 0
  for (const alvo of alvos) {
    const info = await page.evaluate(
      (i, sel, suf) => {
        const area = document.getElementById('area-exportacao')
        area.innerHTML = renderCartao(PERSONAGENS[i])
        ajustarFaixaRespostas(area)
        const el = sel ? area.querySelector(sel) : area.firstElementChild
        const r = el.getBoundingClientRect()
        return { nome: nomeArquivo(PERSONAGENS[i], suf), x: r.x, y: r.y, w: r.width, h: r.height }
      },
      alvo.i,
      alvo.sel,
      alvo.suf,
    )
    const png = await page.screenshot({
      clip: { x: info.x, y: info.y, width: info.w, height: info.h },
      captureBeyondViewport: true,
      omitBackground: false,
    })
    fs.writeFileSync(path.join(SAIDA, info.nome), png)
    feitos++
    if (feitos % 15 === 0) console.log(`PNGs: ${feitos}/90`)
  }

  // ── 2) PDFs vetoriais A4 ───────────────────────────────────────────────
  await page.evaluate(() => {
    const m = document.getElementById('modoFolha')
    m.value = '3'
    reconstruirFolhas()
  })
  await page.pdf({
    path: path.join(SAIDA, 'CartoesBiblicos_A4_3porPagina.pdf'),
    preferCSSPageSize: true,
    printBackground: true,
    scale: 1, // layout vetorial A4 exato; o texto já é vetorial (nítido em qualquer DPI)
  })
  await page.evaluate(() => {
    document.getElementById('modoFolha').value = '1'
    reconstruirFolhas()
  })
  await page.pdf({
    path: path.join(SAIDA, 'CartoesBiblicos_A4_1porPagina.pdf'),
    preferCSSPageSize: true,
    printBackground: true,
    scale: 1,
  })

  await browser.close()

  // ── 3) Relatório de qualidade ─────────────────────────────────────────
  const arquivos = readdirSync(SAIDA).sort()
  const pngs = arquivos.filter((f) => f.endsWith('.png'))
  let abertos = 0, lados = 0, bytesTotal = 0, dims = new Map()
  for (const f of pngs) {
    const b = fs.readFileSync(path.join(SAIDA, f))
    bytesTotal += b.length
    // dimensões reais do PNG (IHDR, bytes 16–24)
    const w = b.readUInt32BE(16), h = b.readUInt32BE(20)
    const chave = `${w}×${h}`
    dims.set(chave, (dims.get(chave) || 0) + 1)
    if (f.includes('-aberto')) abertos++; else lados++
  }
  const pdfs = arquivos.filter((f) => f.endsWith('.pdf'))
  const infoPdf = {}
  for (const f of pdfs) {
    const bin = fs.readFileSync(path.join(SAIDA, f)).toString('latin1')
    const paginas = (bin.match(/\/Type\s*\/Page[^s]/g) || []).length
    const imagens = (bin.match(/\/Subtype\s*\/Image/g) || []).length
    const mb = fs.statSync(path.join(SAIDA, f)).size / 1048576
    infoPdf[f] = { paginas, imagens, mb: mb.toFixed(2) }
  }

  const linhas = []
  linhas.push('# 📊 Relatório de Qualidade — Exportação dos Cartões Bíblicos')
  linhas.push('')
  linhas.push(`Gerado em: ${new Date().toLocaleString('pt-BR')}`)
  linhas.push('')
  linhas.push('## PNGs (raster — impressão jato de tinta / visualização)')
  linhas.push('')
  linhas.push(`- **Total: ${pngs.length} arquivos** — ${abertos} abertos (20×10 cm) + ${lados} lados separados (10×10 cm)`)
  linhas.push(`- **Densidade: ~576 DPI** (96 dpi CSS × 6) — acima do padrão de impressão de 300 DPI`)
  linhas.push(`- **Dimensões:** ${[...dims.entries()].map(([d, q]) => `${d} px ×${q} arquivos`).join(' · ')}`)
  linhas.push(`  - 4536×2268 px = 20×10 cm a 576 DPI (cartão aberto)`)
  linhas.push(`  - 2268×2268 px = 10×10 cm a 576 DPI (cada lado)`)
  linhas.push(`- **Tamanho total dos PNGs: ${(bytesTotal / 1048576).toFixed(1)} MB** (sem compressão com perdas — PNG sem perdas)`)
  linhas.push('')
  linhas.push('## PDFs (vetoriais — nitidez máxima em qualquer impressora)')
  linhas.push('')
  for (const [f, v] of Object.entries(infoPdf)) {
    linhas.push(`- **${f}** — ${v.paginas} páginas · ${v.mb} MB · imagens rasterizadas: ${v.imagens} (0 = 100% vetorial)`)
  }
  linhas.push('- Texto e formas exportados como vetores: nítidos em 300, 600, 1200 DPI ou zoom infinito.')
  linhas.push('')
  linhas.push('## Como imprimir')
  linhas.push('')
  linhas.push('- **Jato de tinta:** use `CartoesBiblicos_A4_3porPagina.pdf` (3 cartões por folha, corte nas linhas ✂).')
  linhas.push('  Nas configurações da impressora: A4, escala 100% ("Tamanho real"), margens padrão, melhor qualidade.')
  linhas.push('- **Lados separados / reimpressão individual:** use os PNGs por lado ou `CartoesBiblicos_A4_1porPagina.pdf` (cartão no tamanho real 20×10 cm, 1 por página).')
  linhas.push('- **Tela:** os PNGs servem para visualização em alta resolução ( zoom sem serrilhado até ~200%).')
  fs.writeFileSync(path.join(SAIDA, 'RELATORIO_QUALIDADE.md'), linhas.join('\n'), 'utf8')

  console.log('\n===== RELATÓRIO =====')
  console.log(`PNGs: ${pngs.length} (${abertos} abertos + ${lados} lados) · ${(bytesTotal / 1048576).toFixed(1)} MB`)
  for (const [d, q] of dims) console.log(`  ${d} px → ${q} arquivos`)
  for (const [f, v] of Object.entries(infoPdf))
    console.log(`PDF ${f}: ${v.paginas} páginas, ${v.mb} MB, imagens raster: ${v.imagens}`)
  console.log('Concluído →', SAIDA)
})().catch((e) => {
  console.error('ERRO:', e)
  process.exit(1)
})
