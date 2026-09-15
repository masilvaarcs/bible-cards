# 📊 Relatório de Qualidade — Exportação dos Cartões Bíblicos

**Gerado em:** 09/09/2026 · **Fonte:** `design/cartao-modelo.html` (30 personagens, CB-001 a CB-030)
**Destino:** `SalvedCards/` — 92 arquivos · ~57 MB

---

## ✅ Resumo da análise de qualidade

| Item | Resultado | Avaliação |
|---|---|---|
| Texto nos PDFs | **100% vetorial** — 8.840 / 13.941 blocos de glifos com fontes embutidas (Georgia, Arial, Segoe UI Symbol) | ⭐ Máxima nitidez em qualquer DPI |
| Camada de texto dos PDFs | **Selecionável e pesquisável** (extração confirmada via pdf.js) | ⭐ |
| Páginas dos PDFs | A4 exato (595,0 × 841,9 pt) — 10 págs. (3 cartões/folha) e 30 págs. (1 cartão/folha) | ⭐ |
| Raster nos PDFs | Apenas ~2 faixas de fundo por página (gradientes suaves, 2416 px de largura ≈ 800 DPI no tamanho impresso) | ⭐ Invisível a olho nu |
| PNGs abertos (30) | **4536 × 2268 px** → 20 × 10 cm a **576 DPI** | ⭐ Acima do padrão gráfico (300 DPI) |
| PNGs por lado (60) | **2262 × 2256 px** → 10 × 10 cm a **576 DPI** | ⭐ |
| Nitidez dos PNGs (Laplaciano, amostra de 5) | 8,2–10,3% de pixels de borda, 3,6–4,3% bordas fortes — texto e traços SVG crisp, sem serrilhado | ⭐ |
| Compactação | PNG **sem perdas** (lossless) | ⭐ |
| Sorteio das perguntas | 1 V/F + 2 Complete + 2 Responda por cartão (execução determinística e reprodutível) | ⭐ |

---

## 📁 Arquivos gerados

### PDFs vetoriais (recomendados para impressão)
| Arquivo | Conteúdo | Uso |
|---|---|---|
| `CartoesBiblicos_A4_3porPagina.pdf` | 10 páginas A4 · 3 cartões por folha (~19,2 × 9,6 cm) + linhas ✂ de corte | **Impressão econômica em jato de tinta** |
| `CartoesBiblicos_A4_1porPagina.pdf` | 30 páginas A4 · 1 cartão por folha no **tamanho real 20 × 10 cm** | Impressão individual / conferência 1:1 |

### PNGs @ 576 DPI (impressão de alta qualidade e tela)
- `CB-XXX-Nome-aberto.png` (30) — cartão completo aberto, 20 × 10 cm
- `CB-XXX-Nome-LadoEsquerdo.png` (30) — capa com as 5 perguntas, 10 × 10 cm
- `CB-XXX-Nome-LadoDireito.png` (30) — perfil + faixa de respostas, 10 × 10 cm

---

## 🖨️ Como imprimir

1. **Jato de tinta (folhas A4):** use `CartoesBiblicos_A4_3porPagina.pdf`.
   - Configurações: papel A4 · escala **100% ("Tamanho real")** · qualidade **Máxima/Alta** · papel mais encorpado (120–200 g/m²) evita transparência.
2. **Tamanho real 20 × 10 cm:** use `CartoesBiblicos_A4_1porPagina.pdf` (ou os PNGs, que também estão em 1:1 a 576 DPI).
3. **Corte e dobra:** corte nas linhas ✂ e dobre na linha tracejada central — cada metade vira um cartão de 10 × 10 cm.
4. **Tela/apresentação:** os PNGs abrem em qualquer visualizador; a 100% de zoom ocupam ~2.400 × 1.200 px de tela com folga.

## 🔍 Como a qualidade foi verificada

- `scripts/verificar_pdf_estrutura.cjs` — pdf.js: contagem de operadores de texto/caminho/imagem por documento, MediaBox e extração da camada de texto.
- `scripts/verificar_fontes_pdf.cjs` — streams inflados: todos os glifos desenhados por fontes embutidas (subset).
- `scripts/medir_qualidade.cjs` — dimensões reais dos PNGs (IHDR) + métrica de nitidez (Laplaciano) em amostra.
- `scripts/exportar_cartoes_alta_qualidade.cjs` — exportação (Chrome headless, deviceScaleFactor 6 → 576 DPI; PDF nativo do Chrome = vetor).
