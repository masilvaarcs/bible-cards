# TODO — fix-conteudo-cards

Ajustes de conteúdo dos cartões bíblicos (branch `fix-conteudo-cards`).
Fonte dos cartões: `design/cartao-modelo.html` → exportação via `scripts/exportar_cartoes_alta_qualidade.cjs` → `SalvedCards/`.

## Como usar
- Marque `[x]` quando o item estiver resolvido.
- Mova itens resolvidos para a seção **Concluído** com a data.

## Pendências

### 1. Complementariedade entre os lados (Direito ≠ Esquerdo)
OK — regra aplicada aos 30 cartões (ver seção Concluído abaixo).
- [x] O **Perfil (lado Direito)** não repete os fatos testados pelas **questões (lado Esquerdo)** — são dados complementares.

### 2. Independência entre as questões (lado Esquerdo)
OK — cada questão testa um fato que não aparece no Perfil nem nas demais questões.
- [x] Responder uma questão não fornece dados para as demais.
- [x] Questões instrutivas, inteligentes e criativas — exigen atenção aos detalhes.

### 3. Estrutura padrão do lado Esquerdo (conteúdo fixo, sem sorteio)
OK — implementado em `renderCartaoInterno()`.
- [x] 2 perguntas Responda (a/b) — não óbvias, detalhe importa.
- [x] 2 Verdadeiro ou Falso (1 V + 1 F) — opções inteligentes.
- [x] 2 Complete — trecho não revelado por nenhuma outra parte do cartão.
- [x] Total de 6 questões numeradas 1–6, agrupadas por tipo.

### 4. Aplicar o padrão aos 30 cartões
- [x] Reescrito `perguntas`/`respostas` de CB-001 a CB-030 no novo formato (2 r + 2 v + 2 c), com referências NWT.
- [x] Organização CB-001..007 (Salomão, Débora, Natã, Eunice, Josias, Jael, Elias).
- [x] Organização CB-008..012 (Mardoqueu, Ana, Zorobabel, Daniel, Ester).
- [x] Organização CB-013..016 (Josué, Samuel, Gideão, Rute).
- [x] Organização CB-017..021 (Abigail, Tabita, Priscila, Ebede-Meleque, Moisés, Davi, Noé).
- [x] Organização CB-022..026 (Raabe, Jonas, Isaías) — CB-022..026 ok.
- [x] Organização CB-027..030 (Maria, João Batista, Pedro, Paulo).
- [ ] Ajustar campos do Perfil onde colidirem com as novas questões.
- [ ] Validar com `npm test` e `npm run build`.
- [ ] Reexportar PNGs/PDFs em `SalvedCards/` sem quebrar o layout (puppeteer-core não instalado — decidir).

### 5. Dicas e respostas no lado Direito (faixa dourada, ao final)
- [x] Respostas sem opções (V/F e Complete) exibidas como **Dicas** autoexplicativas (número + tipo + resposta + referência).
- [x] Organização para que o usuário entenda sem ambiguidade: `a)`, `b)` para Responda, `V`/`F — ...` para V/F, `complete: ...` para Complete.

### 6. Espaço do lado Esquerdo
- [x] Imagem reduzida de 31% → 24% para acomodar 6 questões.
- [x] Validado: frente-perguntas e faixa-dourada sem estouro no layout.
- [ ] Confirmar quebra de linha no cartão CB-019 via verificação visual.

### 7. Palavra "Cruz" — INVESTIGAÇÃO (relatório; sem alteração sem aprovação)
OK — decisão do usuário: corrigir para a redação da NWT ("estaca") nos 2 pontos.
- [x] Identificado origem: apenas no cartão **CB-027 Maria**, 2 pontos em `design/cartao-modelo.html`.
- [x] Origem: texto digitado manualmente no template, sem publicação de origem registrada; entrou no commit inicial `78967fe` (15/09/2026).
- [x] Divergência comprovada: NWT nunca usa "cruz"; Jo 19:25 diz: "Junto à **estaca** de Jesus estavam sua mãe…".
- [x] Decisão do usuário (2026-10-07): **corrigir para a redação da NWT ("estaca")** nos 2 pontos.
- [ ] Aplicar a correção + teste regressivo impedindo "cruz" no conteúdo dos cartões.

### 8. Testes de validação de conteúdo
OK — suíte `tests/bibliaLivros.test.ts` cobre nomes dos livros da bíblia.
- [x] Suíte em `tests/` cobrindo: estrutura 2 r + 2 v + 2 c por cartão; respostas com referência; 1 V + 1 F; letra da resposta ∈ opções da questão.
- [x] **Não-repetição**: fato de cada questão ausente do Perfil, da placa e das demais questões.
- [x] **Independência**: respostas/afirmações das 6 questões disjuntas (qualquer ordem de perguntas não afeta o resultado).
- [ ] Guarda contra "cruz" (e demais termos vetados aprovados) no conteúdo dos cartões.

## Em andamento
_(itens em progresso)_

## Concluído
_(itens finalizados, com data)_

### 2026-10-07 — Ajustes de conteúdo dos cartões bíblicos (itens 1, 2, 3, 5, 6, 8)
- Reescrita da estrutura do cartão: 6 questões fixas (2 r + 2 v + 2 c), sem sorteio.
- Remoção do botão "Re-sortear" e das funções de sorteio.
- Expansão da faixa Dicas (~24%) para caber 6 dicas.
- Redução da imagem (frente-img) de 31% para 24% para acomodar as 6 questões.
- Dicas formatadas: `a)`, `b)` para Responda; `V`/`F — ...` para Verdadeiro ou Falso; `complete: ...` para Complete.
- Validação visual através do servidor http:8765 para confirmar layout sem estouro.
