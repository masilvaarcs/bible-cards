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
- [x] Ajustar campos do Perfil onde colidirem com as novas questões.
- [x] Validar com `npm test` e `npm run build`.
- [x] Reexportar PNGs/PDFs em `SalvedCards/` sem quebrar o layout (puppeteer-core não instalado — decidir).

### 5. Dicas e respostas no lado Direito (faixa dourada, ao final)
- [x] Respostas sem opções (V/F e Complete) exibidas como **Dicas** autoexplicativas (número + tipo + resposta + referência).
- [x] Organização para que o usuário entenda sem ambiguidade: `a)`, `b)` para Responda, `V`/`F — ...` para V/F, `complete: ...` para Complete.

### 6. Espaço do lado Esquerdo
- [x] Imagem reduzida de 31% → 24% para acomodar 6 questões.
- [x] Validado: frente-perguntas e faixa-dourada sem estouro no layout.
- [x] Confirmar quebra de linha no cartão CB-019 via verificação visual (2026-10-12: verificado no visor — opções longas quebram em 2 linhas sem corte).

### 7. Palavra "Cruz" — INVESTIGAÇÃO (relatório; sem alteração sem aprovação)
OK — decisão do usuário: corrigir para a redação da NWT ("estaca") nos 2 pontos.
- [x] Identificado origem: apenas no cartão **CB-027 Maria**, 2 pontos em `design/cartao-modelo.html`.
- [x] Origem: texto digitado manualmente no template, sem publicação de origem registrada; entrou no commit inicial `78967fe` (15/09/2026).
- [x] Divergência comprovada: NWT nunca usa "cruz"; Jo 19:25 diz: "Junto à **estaca** de Jesus estavam sua mãe…".
- [x] Decisão do usuário (2026-10-07): **corrigir para a redação da NWT ("estaca")** nos 2 pontos.
- [x] Aplicar a correção + teste regressivo impedindo "cruz" no conteúdo dos cartões.

### 8. Testes de validação de conteúdo
OK — suíte `tests/bibliaLivros.test.ts` cobre nomes dos livros da bíblia.
- [x] Suíte em `tests/` cobrindo: estrutura 2 r + 2 v + 2 c por cartão; respostas com referência; 1 V + 1 F; letra da resposta ∈ opções da questão.
- [x] **Não-repetição**: fato de cada questão ausente do Perfil, da placa e das demais questões.
- [x] **Independência**: respostas/afirmações das 6 questões disjuntas (qualquer ordem de perguntas não afeta o resultado).
- [x] Guarda contra "cruz" no conteúdo dos cartões (dados + respostas). Termos vetados além de "cruz" ainda não definidos.

## Em andamento
_(itens em progresso)_

### 2026-10-12 — V/F: enunciados sem prefixo V—/F— + revisão dos 60 pares
Motivo (usuário): "F — Jael pediu permissão a Débora…" é ambíguo — lê-se "X é falso" OU "não X". Decisão: enunciado afirmativo/negativo puro; o julgamento fica só na dica lateral.
- **Prefixos removidos** dos 60 enunciados V/F (CB-001..030). Dicas continuam `V — …|ref` / `F — …|ref` (1 V + 1 F por cartão).
- **Teste atualizado**: "enunciados V/F sem prefixo + dicas trazem 1 V e 1 F" (suíte 10/10).
- **Pares corrigidos** (todos os valores conferidos contra `DadosBiblia/nwt_por_livro/`):
  - **CB-001 q3**: enunciado marcado F mas a dica O CONFIRMAVA ("40 anos de reinado sem coração firme" é verdadeiro, 1Rs 11:4/42) → novo par: "Salomão ofereceu mil sacrifícios no templo" → F (foram no alto de Gibeão, 1Rs 3:4).
  - **CB-001 q6**: "querubins de ______" era autorespondida e vazava a V/F q4 → "A rainha de ______ veio testar a sabedoria" (Sabá|1Rs 10:1); curiosidade do Perfil ajustada para não revelar.
  - **CB-009 Ana**: par "dia e noite" × "noite e dia" (discriminava só ordem de palavras, e o NWT diz "noite e dia") + 4 vazamentos (Perfil anunciava 84 anos, jejuns/noite-e-dia, Fanuel, Aser; Responda repetia "dia e noite") → cartão reconstruído: V/F = jejuava noite e dia (V) / era casada (F → viúva); Complete = tribo de Aser, 7 anos com o marido; Responda = 84 anos, para quem falava. Perfil limpo dos fatos testados.
  - **CB-010 q4**: "veio dos cedros do Líbano" é VERDADEIRO (Ed 3:7: "madeiras de cedro por mar, do Líbano") mas estava marcado F → enunciado falso novo ("veio do Egito").
  - **CB-012 q4**: dica garbled ("ela o fez tiver a adoração do povo") → "F — Ester não falou nada sobre seu povo|Et 2:10".
  - **CB-013 q4**: typo "primeira ouve" → "Os israelitas tomaram Jericó já na primeira volta à cidade"; dica "sete voltas|Js 6:15".
  - **CB-015 q4**: dica inventada ("refugiou-se") → "F — ele recusou; Jeová deveria governar|Jz 8:22-23".
  - **CB-017 q3**: dica garbled → "F — recusou e nada lhes deu|1Sm 25:10-11". q6 "Nabal significa ______ = tolo" vazava na V/F q1 ("duro e tolo") → "não derramar ______ inocente" (sangue|1Sm 25:26).
  - **CB-019 q3**: dica com letra trocada (V; o enunciado é F) → "F — conhecia apenas o batismo de João|At 18:25". q5 "morou com Áquila e ______ = Priscila" vazava na V/F q4 → "Áquila era natural de ______" (Ponto|At 18:2); Perfil perdeu "com mais exatidão" (vazava a Complete q6).
- **CB-006 (exemplo do usuário)**: "Jael pediu permissão a Débora antes de agir contra Sísera" → é **FALSO**; Jael agiu por decisão própria (Jz 4:18-21).
- Validação: `node --test tests/conteudoCartoes.test.ts` 10/10, `npm test` 11/11, `npm run build` OK, 0 estouro de layout medido nos 30 cartões (scrollHeight/clientHeight em cartao/frente/verso), gabarito regenerado, PNGs (90) e PDFs reexportados.

### 2026-10-12 — Auditoria de pendências ("tudo foi realmente testado?")
Resposta: **não** — a suíte não cobria numeração nem a letra das respostas, e o gabarito estava dessincronizado. Corrigido:
- **CB-018 Tabita**: questão Responda 2 tinha prefixo "6 —" na posição 4 (deveria ser "4 —"). Corrigido no HTML + teste regressivo novo.
- **CB-001 Salomão q2**: resposta "A — depois de quebrantar as alianças de Israel" não correspondia à opção a) ("no ápice de sua soberania"), e a opção b) repetia o enunciado — pergunta reescrita com fato verificado no NWT do repo (300 concubinas, 1Rs 11:3). Bônus: eliminou o único estouro de layout do lado esquerdo (CB-001 era o único cartão com overflow de 12px na frente-perguntas).
- **CB-009 q6**: dica "A — todos que esperavam" ≠ opção a) "a todos que esperavam a redenção" → alinhado.
- **CB-010 q2**: dica dizia "a) Jesué, filho de Josadaque" mas Jesué é a opção **b)** → corrigido para "b)".
- **CB-017 q2**: dica "impedir o massacre" ≠ opção a) "impedir um massacre" → alinhado.
- **Testes novos** (suite 8 → 10): (1) letra da resposta ∈ opções da questão (regra 3 que o TODO afirmava coberta mas não existia); (2) prefixo numérico "N — " confere com a posição renderizada 1–6.
- **gabarito_completo.txt** estava dessincronizado (gerado 16:24, HTML editado 19:51) — regenerado.
- PNGs/PDFs reexportados após as correções (2026-10-12).
- Valores verificados contra `DadosBiblia/nwt_por_livro/` (1Rs 6:23 pinho ✓, 1Rs 11:3 concubinas ✓).

### 2026-10-08 — Independência das questões: eliminação de vazamentos
- Detector automático: resposta/chave de cada questão varrida contra as outras 5 de cada cartão (30 cartões).
- Corrigidos vazamentos de Complete (resposta obtível em outra questão):
  - CB-009 Ana: "filha de Fanuel" e "jejuns e súplicas" (súplicas já nas V/F) → tribo de **Aser** e idade **84** (Lc 2:36-37).
  - CB-017 Abigail: "Nabal significa tolo" (dado já na V/F q1) → "derramasse **sangue** inocente" (1Sm 25:26).
  - CB-019 Priscila: "Paulo morou com Áquila e ______ (Priscila)" (nome repetido 3× nas outras questões) → Áquila natural de **Ponto** (At 18:2). Corrigido também o erro de redação da dica q3 (V → F).
  - CB-021 Moisés: "recebeu a Lei no monte Sinai" (Sinai no campo banda/historia e colisão com duplicação de questão) → fala com Jeová **face a face** (Êx 33:11).
  - CB-022 Davi: "derrotou Golias" (nome nas V/F e q4) → reinou **33 anos** em Jerusalém (2Sm 5:4-5).
  - CB-025 Jonas: "pregou em Nínive" (Nínive na q3 Responda) → filho de **Amittai** (Jn 1:1).
  - CB-029 Pedro: "irmão André" (André na q3) → nome de nascença **Simão** (Jo 1:42).
  - CB-001 Salomão: "querubins de ______" (dado já na V/F q4) → rainha de **Sabá** (1Rs 10:1).
- Vazamentos residuais aceitáveis: nome do próprio personagem em outras questões (CB-021 "Moisés") e palavras genéricas em Responda ("inimigo", "casa") — não revelam a resposta.
- Validado: detector 0 vazamentos em Complete; estrutura 6x6 nos 30; testes 8/8 + 11/11; build OK.
- Regenerado `gabarito_completo.txt`; fix no script: extração de PERSONAGENS tolerante a CRLF.

## Concluído
_(itens finalizados, com data)_

### 2026-10-08 — Fechamento de pendências (itens 4, 7, 8)
- Item 4 concluído: reescrita de `perguntas`/`respostas` dos 30 cartões e Perfil ajustado onde colidia — garantido pelo teste de não-repetição (passa para CB-001..030).
- Item 4 (build): `npm test` 11/11, `node --test tests/conteudoCartoes.test.ts` 8/8, `npm run build` exit 0 — todos verificados em 2026-10-08.
- Item 4 (export): `puppeteer-core` adicionado (commit `e94617a`) e PNGs/PDFs reexportados em `SalvedCards/` (commit `e7caecb`).
- Item 7 concluído: "cruz" → "estaca" em CB-021 e CB-027 (commit `56f679f`); testes regressivos "cruz não aparece nos dados" e "não aparece nas respostas" passam.
- Item 8 concluído: guarda de "cruz" implementada nos testes. Demais termos vetados: nenhuma lista aprovada além de "cruz".

### 2026-10-07 — Ajustes de conteúdo dos cartões bíblicos (itens 1, 2, 3, 5, 6, 8)
- Reescrita da estrutura do cartão: 6 questões fixas (2 r + 2 v + 2 c), sem sorteio.
- Remoção do botão "Re-sortear" e das funções de sorteio.
- Expansão da faixa Dicas (~24%) para caber 6 dicas.
- Redução da imagem (frente-img) de 31% para 24% para acomodar as 6 questões.
- Dicas formatadas: `a)`, `b)` para Responda; `V`/`F — ...` para Verdadeiro ou Falso; `complete: ...` para Complete.
- Validação visual através do servidor http:8765 para confirmar layout sem estouro.
