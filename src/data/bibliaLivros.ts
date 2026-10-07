/**
 * Mapeamento dos 66 livros da NWT para uso no frontend React.
 * (Espelho de scripts/biblia_dados.py)
 */

export interface LivroInfo {
  ordem: number
  nome: string
  slug: string
  abrev: string
  testamento: 'hebraico' | 'grego'
  capitulos: number
}

export const LIVROS: LivroInfo[] = [
  // ─── ESCRITURAS HEBRAICO-ARAMAICAS ───
  { ordem: 1,  nome: 'Gênesis',              slug: 'genesis',          abrev: 'Gên',  testamento: 'hebraico', capitulos: 50 },
  { ordem: 2,  nome: 'Êxodo',                slug: 'exodus',           abrev: 'Êx',   testamento: 'hebraico', capitulos: 40 },
  { ordem: 3,  nome: 'Levítico',             slug: 'leviticus',        abrev: 'Le',   testamento: 'hebraico', capitulos: 27 },
  { ordem: 4,  nome: 'Números',              slug: 'numbers',          abrev: 'Núm',  testamento: 'hebraico', capitulos: 36 },
  { ordem: 5,  nome: 'Deuteronômio',         slug: 'deuteronomy',      abrev: 'De',   testamento: 'hebraico', capitulos: 34 },
  { ordem: 6,  nome: 'Josué',                slug: 'joshua',           abrev: 'Jos',  testamento: 'hebraico', capitulos: 24 },
  { ordem: 7,  nome: 'Juízes',               slug: 'judges',           abrev: 'Jz',   testamento: 'hebraico', capitulos: 21 },
  { ordem: 8,  nome: 'Rute',                 slug: 'ruth',             abrev: 'Ru',   testamento: 'hebraico', capitulos: 4 },
  { ordem: 9,  nome: '1 Samuel',             slug: '1-samuel',         abrev: '1Sa',  testamento: 'hebraico', capitulos: 31 },
  { ordem: 10, nome: '2 Samuel',             slug: '2-samuel',         abrev: '2Sa',  testamento: 'hebraico', capitulos: 24 },
  { ordem: 11, nome: '1 Reis',               slug: '1-kings',          abrev: '1Rs',  testamento: 'hebraico', capitulos: 22 },
  { ordem: 12, nome: '2 Reis',               slug: '2-kings',          abrev: '2Rs',  testamento: 'hebraico', capitulos: 25 },
  { ordem: 13, nome: '1 Crônicas',           slug: '1-chronicles',     abrev: '1Cr',  testamento: 'hebraico', capitulos: 29 },
  { ordem: 14, nome: '2 Crônicas',           slug: '2-chronicles',     abrev: '2Cr',  testamento: 'hebraico', capitulos: 36 },
  { ordem: 15, nome: 'Esdras',               slug: 'ezra',             abrev: 'Esd',  testamento: 'hebraico', capitulos: 10 },
  { ordem: 16, nome: 'Neemias',              slug: 'nehemiah',         abrev: 'Ne',   testamento: 'hebraico', capitulos: 13 },
  { ordem: 17, nome: 'Ester',                slug: 'esther',           abrev: 'Est',  testamento: 'hebraico', capitulos: 10 },
  { ordem: 18, nome: 'Jó',                   slug: 'job',              abrev: 'Jó',   testamento: 'hebraico', capitulos: 42 },
  { ordem: 19, nome: 'Salmos',               slug: 'psalms',           abrev: 'Sal',  testamento: 'hebraico', capitulos: 150 },
  { ordem: 20, nome: 'Provérbios',           slug: 'proverbs',         abrev: 'Pr',   testamento: 'hebraico', capitulos: 31 },
  { ordem: 21, nome: 'Eclesiastes',          slug: 'ecclesiastes',     abrev: 'Ec',   testamento: 'hebraico', capitulos: 12 },
  { ordem: 22, nome: 'Cântico de Salomão',   slug: 'song-of-solomon',  abrev: 'Cân',  testamento: 'hebraico', capitulos: 8 },
  { ordem: 23, nome: 'Isaías',               slug: 'isaiah',           abrev: 'Is',   testamento: 'hebraico', capitulos: 66 },
  { ordem: 24, nome: 'Jeremias',             slug: 'jeremiah',         abrev: 'Je',   testamento: 'hebraico', capitulos: 52 },
  { ordem: 25, nome: 'Lamentações',          slug: 'lamentations',     abrev: 'La',   testamento: 'hebraico', capitulos: 5 },
  { ordem: 26, nome: 'Ezequiel',             slug: 'ezekiel',          abrev: 'Ez',   testamento: 'hebraico', capitulos: 48 },
  { ordem: 27, nome: 'Daniel',               slug: 'daniel',           abrev: 'Da',   testamento: 'hebraico', capitulos: 12 },
  { ordem: 28, nome: 'Oseias',               slug: 'hosea',            abrev: 'Os',   testamento: 'hebraico', capitulos: 14 },
  { ordem: 29, nome: 'Joel',                 slug: 'joel',             abrev: 'Jl',   testamento: 'hebraico', capitulos: 3 },
  { ordem: 30, nome: 'Amós',                 slug: 'amos',             abrev: 'Am',   testamento: 'hebraico', capitulos: 9 },
  { ordem: 31, nome: 'Obadias',              slug: 'obadiah',          abrev: 'Ob',   testamento: 'hebraico', capitulos: 1 },
  { ordem: 32, nome: 'Jonas',                slug: 'jonah',            abrev: 'Jon',  testamento: 'hebraico', capitulos: 4 },
  { ordem: 33, nome: 'Miquéias',             slug: 'micah',            abrev: 'Miq',  testamento: 'hebraico', capitulos: 7 },
  { ordem: 34, nome: 'Naum',                 slug: 'nahum',            abrev: 'Na',   testamento: 'hebraico', capitulos: 3 },
  { ordem: 35, nome: 'Habacuque',            slug: 'habakkuk',         abrev: 'Hab',  testamento: 'hebraico', capitulos: 3 },
  { ordem: 36, nome: 'Sofonias',             slug: 'zephaniah',        abrev: 'Sof',  testamento: 'hebraico', capitulos: 3 },
  { ordem: 37, nome: 'Ageu',                 slug: 'haggai',           abrev: 'Ag',   testamento: 'hebraico', capitulos: 2 },
  { ordem: 38, nome: 'Zacarias',             slug: 'zechariah',        abrev: 'Za',   testamento: 'hebraico', capitulos: 14 },
  { ordem: 39, nome: 'Malaquias',            slug: 'malachi',          abrev: 'Mal',  testamento: 'hebraico', capitulos: 4 },

  // ─── ESCRITURAS GREGAS CRISTÃS ───
  { ordem: 40, nome: 'Mateus',               slug: 'matthew',          abrev: 'Mt',   testamento: 'grego', capitulos: 28 },
  { ordem: 41, nome: 'Marcos',               slug: 'mark',             abrev: 'Mr',   testamento: 'grego', capitulos: 16 },
  { ordem: 42, nome: 'Lucas',                slug: 'luke',             abrev: 'Lu',   testamento: 'grego', capitulos: 24 },
  { ordem: 43, nome: 'João',                 slug: 'john',             abrev: 'Jo',   testamento: 'grego', capitulos: 21 },
  { ordem: 44, nome: 'Atos',                 slug: 'acts',             abrev: 'At',   testamento: 'grego', capitulos: 28 },
  { ordem: 45, nome: 'Romanos',              slug: 'romans',           abrev: 'Ro',   testamento: 'grego', capitulos: 16 },
  { ordem: 46, nome: '1 Coríntios',          slug: '1-corinthians',    abrev: '1Co',  testamento: 'grego', capitulos: 16 },
  { ordem: 47, nome: '2 Coríntios',          slug: '2-corinthians',    abrev: '2Co',  testamento: 'grego', capitulos: 13 },
  { ordem: 48, nome: 'Gálatas',              slug: 'galatians',        abrev: 'Gál',  testamento: 'grego', capitulos: 6 },
  { ordem: 49, nome: 'Efésios',              slug: 'ephesians',        abrev: 'Ef',   testamento: 'grego', capitulos: 6 },
  { ordem: 50, nome: 'Filipenses',           slug: 'philippians',      abrev: 'Fil',  testamento: 'grego', capitulos: 4 },
  { ordem: 51, nome: 'Colossenses',          slug: 'colossians',       abrev: 'Col',  testamento: 'grego', capitulos: 4 },
  { ordem: 52, nome: '1 Tessalonicenses',    slug: '1-thessalonians',  abrev: '1Te',  testamento: 'grego', capitulos: 5 },
  { ordem: 53, nome: '2 Tessalonicenses',    slug: '2-thessalonians',  abrev: '2Te',  testamento: 'grego', capitulos: 3 },
  { ordem: 54, nome: '1 Timóteo',            slug: '1-timothy',        abrev: '1Ti',  testamento: 'grego', capitulos: 6 },
  { ordem: 55, nome: '2 Timóteo',            slug: '2-timothy',        abrev: '2Ti',  testamento: 'grego', capitulos: 4 },
  { ordem: 56, nome: 'Tito',                 slug: 'titus',            abrev: 'Tit',  testamento: 'grego', capitulos: 3 },
  { ordem: 57, nome: 'Filemom',              slug: 'philemon',         abrev: 'Flm',  testamento: 'grego', capitulos: 1 },
  { ordem: 58, nome: 'Hebreus',              slug: 'hebrews',          abrev: 'He',   testamento: 'grego', capitulos: 13 },
  { ordem: 59, nome: 'Tiago',                slug: 'james',            abrev: 'Tg',   testamento: 'grego', capitulos: 5 },
  { ordem: 60, nome: '1 Pedro',              slug: '1-peter',          abrev: '1Pe',  testamento: 'grego', capitulos: 5 },
  { ordem: 61, nome: '2 Pedro',              slug: '2-peter',          abrev: '2Pe',  testamento: 'grego', capitulos: 3 },
  { ordem: 62, nome: '1 João',               slug: '1-john',           abrev: '1Jo',  testamento: 'grego', capitulos: 5 },
  { ordem: 63, nome: '2 João',               slug: '2-john',           abrev: '2Jo',  testamento: 'grego', capitulos: 1 },
  { ordem: 64, nome: '3 João',               slug: '3-john',           abrev: '3Jo',  testamento: 'grego', capitulos: 1 },
  { ordem: 65, nome: 'Judas',                slug: 'jude',             abrev: 'Ju',   testamento: 'grego', capitulos: 1 },
  { ordem: 66, nome: 'Apocalipse',           slug: 'revelation',       abrev: 'Ap',   testamento: 'grego', capitulos: 22 },
]
