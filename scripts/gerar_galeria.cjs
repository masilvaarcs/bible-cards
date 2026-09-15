/* Gera a galeria de visualização em tela a partir dos PNGs realmente presentes. */
const fs = require('fs')
const path = require('path')
const dir = path.join(__dirname, '..', 'SalvedCards')
const lista = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('-aberto.png'))
  .sort()
const entradas = lista.map((a) => "  '" + a + "',").join('\n')
const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Cartões Bíblicos — Galeria (PNGs 576 DPI)</title>
<style>
  body { font-family: Georgia, serif; background: #e9edf2; margin: 0; padding: 24px; }
  h1 { color: #1d3d5c; font-size: 1.3rem; }
  p.sub { color: #6b7684; font-size: .9rem; margin-top: 4px; }
  .g { display: grid; grid-template-columns: repeat(auto-fill, minmax(560px, 1fr)); gap: 22px; }
  figure { margin: 0; background: #fff; border: 1px solid #d8dee6; border-radius: 8px; padding: 10px; }
  img { width: 100%; height: auto; border-radius: 4px; display: block; }
  figcaption { font-size: .82rem; color: #1d3d5c; font-weight: bold; margin-top: 6px; }
</style>
</head>
<body>
<h1>🃏 Cartões Bíblicos — Galeria de PNGs exportados (4536×2268 px · 576 DPI)</h1>
<p class="sub">Visualização em tela: os ${lista.length} cartões abertos (20 × 10 cm). Os lados separados (10 × 10 cm) estão na mesma pasta SalvedCards.</p>
<div class="g" id="galeria"></div>
<script>
const ARQS = [
${entradas}
];
document.getElementById('galeria').innerHTML = ARQS.map(a => {
  const m = a.match(/^(CB-\\d+)-(.+)-aberto\\.png$/);
  return '<figure><img src="SalvedCards/' + a + '" loading="lazy" alt="' + a + '"><figcaption>' + m[1] + ' · ' + m[2] + '</figcaption></figure>';
}).join('');
</script>
</body>
</html>
`
fs.writeFileSync(path.join(dir, 'GALERIA_TELA.html'), html, 'utf8')
console.log('Galeria gerada com', lista.length, 'cartões')
