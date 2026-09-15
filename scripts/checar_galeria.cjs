/* Abre a galeria no Chrome headless e confirma que todos os PNGs carregam. */
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer-core')

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
  const browser = await puppeteer.launch({ executablePath: acharNavegador(), headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  const alvo = 'file:///' + path.join(__dirname, '..', 'SalvedCards', 'GALERIA_TELA.html').replace(/\\/g, '/')
  await page.goto(alvo, { waitUntil: 'networkidle0', timeout: 60000 })
  const r = await page.evaluate(async () => {
    const imgs = [...document.querySelectorAll('img')]
    await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((ok) => (i.onload = i.onerror = ok)))))
    return { total: imgs.length, ok: imgs.filter((i) => i.naturalWidth > 0).length, falhas: imgs.filter((i) => i.naturalWidth === 0).map((i) => i.src.split('/').pop()) }
  })
  console.log(`Galeria: ${r.ok}/${r.total} PNGs carregados`, r.falhas.length ? '· FALHAS: ' + r.falhas.join(', ') : '· ✔ nenhum erro')
  await browser.close()
  if (r.ok !== r.total) process.exit(1)
})().catch((e) => {
  console.error('ERRO:', e)
  process.exit(1)
})
