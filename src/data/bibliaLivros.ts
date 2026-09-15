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
  { ordem: 2,  nome: 'Êxodo',                slug: 'exodus',           abrev: 'Êxo',  testamento: 'hebraico', capitulos: 40 },
  { ordem: 3,  nome: 'Levítico',             slug: 'leviticus',        abrev: 'Lev',  testamento: 'hebraico', capitulos: 27 },
  { ordem: 4,  nome: 'Números',              slug: 'numbers',          abrev: 'Núm',  testamento: 'hebraico', capitulos: 36 },
  { ordem: 5,  nome: 'Deuteronômio',         slug: 'deuteronomy',      abrev: 'Deut', testamento: 'hebraico', capitulos: 34 },
  { ordem: 6,  nome: 'Josué',                slug: 'joshua',           abrev: 'Jos',  testamento: 'hebraico', capitulos: 24 },
  { ordem: 7,  nome: 'Juízes',               slug: 'judges',           abrev: 'Juí',  testamento: 'hebraico', capitulos: 21 },
  { ordem: 8,  nome: 'Rute',                 slug: 'ruth',             abrev: 'Rute', testamento: 'hebraico', capitulos: 4 },
  { ordem: 9,  nome: '1 Samuel',             slug: '1-samuel',         abrev: '1Sam', testamento: 'hebraico', capitulos: 31 },
  { ordem: 10, nome: '2 Samuel',             slug: '2-samuel',         abrev: '2Sam', testamento: 'hebraico', capitulos: 24 },
  { ordem: 11, nome: '1 Reis',               slug: '1-kings',          abrev: '1Reis', testamento: 'hebraico', capitulos: 22 },
  { ordem: 12, nome: '2 Reis',               slug: '2-kings',          abrev: '2Reis', testamento: 'hebraico', capitulos: 25 },
  { ordem: 13, nome: '1 Crônicas',           slug: '1-chronicles',     abrev: '1Cró', testamento: 'hebraico', capitulos: 29 },
  { ordem: 14, nome: '2 Crônicas',           slug: '2-chronicles',     abrev: '2Cró', testamento: 'hebraico', capitulos: 36 },
  { ordem: 15, nome: 'Esdras',               slug: 'ezra',             abrev: 'Esd',  testamento: 'hebraico', capitulos: 10 },
  { ordem: 16, nome: 'Neemias',              slug: 'nehemiah',         abrev: 'Nee',  testamento: 'hebraico', capitulos: 13 },
  { ordem: 17, nome: 'Ester',                slug: 'esther',           abrev: 'Ester', testamento: 'hebraico', capitulos: 10 },
  { ordem: 18, nome: 'Jó',                   slug: 'job',              abrev: 'Jó',   testamento: 'hebraico', capitulos: 42 },
  { ordem: 19, nome: 'Salmos',               slug: 'psalms',           abrev: 'Sal',  testamento: 'hebraico', capitulos: 150 },
  { ordem: 20, nome: 'Provérbios',           slug: 'proverbs',         abrev: 'Pro',  testamento: 'hebraico', capitulos: 31 },
  { ordem: 21, nome: 'Eclesiastes',          slug: 'ecclesiastes',     abrev: 'Ecl',  testamento: 'hebraico', capitulos: 12 },
  { ordem: 22, nome: 'Cântico de Salomão',   slug: 'song-of-solomon',  abrev: 'Cân',  testamento: 'hebraico', capitulos: 8 },
  { ordem: 23, nome: 'Isaías',               slug: 'isaiah',           abrev: 'Isa',  testamento: 'hebraico', capitulos: 66 },
  { ordem: 24, nome: 'Jeremias',             slug: 'jeremiah',         abrev: 'Jer',  testamento: 'hebraico', capitulos: 52 },
  { ordem: 25, nome: 'Lamentações',          slug: 'lamentations',     abrev: 'Lam',  testamento: 'hebraico', capitulos: 5 },
  { ordem: 26, nome: 'Ezequiel',             slug: 'ezekiel',          abrev: 'Eze',  testamento: 'hebraico', capitulos: 48 },
  { ordem: 27, nome: 'Daniel',               slug: 'daniel',           abrev: 'Dan',  testamento: 'hebraico', capitulos: 12 },
  { ordem: 28, nome: 'Oseias',               slug: 'hosea',            abrev: 'Ose',  testamento: 'hebraico', capitulos: 14 },
  { ordem: 29, nome: 'Joel',                 slug: 'joel',             abrev: 'Joel', testamento: 'hebraico', capitulos: 3 },
  { ordem: 30, nome: 'Amós',                 slug: 'amos',             abrev: 'Amós', testamento: 'hebraico', capitulos: 9 },
  { ordem: 31, nome: 'Obadias',              slug: 'obadiah',          abrev: 'Obd',  testamento: 'hebraico', capitulos: 1 },
  { ordem: 32, nome: 'Jonas',                slug: 'jonah',            abrev: 'Jon',  testamento: 'hebraico', capitulos: 4 },
  { ordem: 33, nome: 'Miqueias',             slug: 'micah',            abrev: 'Miq',  testamento: 'hebraico', capitulos: 7 },
  { ordem: 34, nome: 'Naum',                 slug: 'nahum',            abrev: 'Naum', testamento: 'hebraico', capitulos: 3 },
  { ordem: 35, nome: 'Habacuque',            slug: 'habakkuk',         abrev: 'Hab',  testamento: 'hebraico', capitulos: 3 },
  { ordem: 36, nome: 'Sofonias',             slug: 'zephaniah',        abrev: 'Sof',  testamento: 'hebraico', capitulos: 3 },
  { ordem: 37, nome: 'Ageu',                 slug: 'haggai',           abrev: 'Ageu', testamento: 'hebraico', capitulos: 2 },
  { ordem: 38, nome: 'Zacarias',             slug: 'zechariah',        abrev: 'Zac',  testamento: 'hebraico', capitulos: 14 },
  { ordem: 39, nome: 'Malaquias',            slug: 'malachi',          abrev: 'Mal',  testamento: 'hebraico', capitulos: 4 },

  // ─── ESCRITURAS GREGAS CRISTÃS ───
  { ordem: 40, nome: 'Mateus',               slug: 'matthew',          abrev: 'Mat',  testamento: 'grego', capitulos: 28 },
  { ordem: 41, nome: 'Marcos',               slug: 'mark',             abrev: 'Mar',  testamento: 'grego', capitulos: 16 },
  { ordem: 42, nome: 'Lucas',                slug: 'luke',             abrev: 'Luc',  testamento: 'grego', capitulos: 24 },
  { ordem: 43, nome: 'João',                 slug: 'john',             abrev: 'João', testamento: 'grego', capitulos: 21 },
  { ordem: 44, nome: 'Atos',                 slug: 'acts',             abrev: 'Atos', testamento: 'grego', capitulos: 28 },
  { ordem: 45, nome: 'Romanos',              slug: 'romans',           abrev: 'Rom',  testamento: 'grego', capitulos: 16 },
  { ordem: 46, nome: '1 Coríntios',          slug: '1-corinthians',    abrev: '1Cor', testamento: 'grego', capitulos: 16 },
  { ordem: 47, nome: '2 Coríntios',          slug: '2-corinthians',    abrev: '2Cor', testamento: 'grego', capitulos: 13 },
  { ordem: 48, nome: 'Gálatas',              slug: 'galatians',        abrev: 'Gál',  testamento: 'grego', capitulos: 6 },
  { ordem: 49, nome: 'Efésios',              slug: 'ephesians',        abrev: 'Efé',  testamento: 'grego', capitulos: 6 },
  { ordem: 50, nome: 'Filipenses',           slug: 'philippians',      abrev: 'Fil',  testamento: 'grego', capitulos: 4 },
  { ordem: 51, nome: 'Colossenses',          slug: 'colossians',       abrev: 'Col',  testamento: 'grego', capitulos: 4 },
  { ordem: 52, nome: '1 Tessalonicenses',    slug: '1-thessalonians',  abrev: '1Te',  testamento: 'grego', capitulos: 5 },
  { ordem: 53, nome: '2 Tessalonicenses',    slug: '2-thessalonians',  abrev: '2Te',  testamento: 'grego', capitulos: 3 },
  { ordem: 54, nome: '1 Timóteo',            slug: '1-timothy',        abrev: '1Ti',  testamento: 'grego', capitulos: 6 },
  { ordem: 55, nome: '2 Timóteo',            slug: '2-timothy',        abrev: '2Ti',  testamento: 'grego', capitulos: 4 },
  { ordem: 56, nome: 'Tito',                 slug: 'titus',            abrev: 'Tito', testamento: 'grego', capitulos: 3 },
  { ordem: 57, nome: 'Filémon',              slug: 'philemon',         abrev: 'Flm',  testamento: 'grego', capitulos: 1 },
  { ordem: 58, nome: 'Hebreus',              slug: 'hebrews',          abrev: 'Heb',  testamento: 'grego', capitulos: 13 },
  { ordem: 59, nome: 'Tiago',                slug: 'james',            abrev: 'Tia',  testamento: 'grego', capitulos: 5 },
  { ordem: 60, nome: '1 Pedro',              slug: '1-peter',          abrev: '1Pe',  testamento: 'grego', capitulos: 5 },
  { ordem: 61, nome: '2 Pedro',              slug: '2-peter',          abrev: '2Pe',  testamento: 'grego', capitulos: 3 },
  { ordem: 62, nome: '1 João',               slug: '1-john',           abrev: '1Jo',  testamento: 'grego', capitulos: 5 },
  { ordem: 63, nome: '2 João',               slug: '2-john',           abrev: '2Jo',  testamento: 'grego', capitulos: 1 },
  { ordem: 64, nome: '3 João',               slug: '3-john',           abrev: '3Jo',  testamento: 'grego', capitulos: 1 },
  { ordem: 65, nome: 'Judas',                slug: 'jude',             abrev: 'Judas', testamento: 'grego', capitulos: 1 },
  { ordem: 66, nome: 'Apocalipse',           slug: 'revelation',       abrev: 'Apo',  testamento: 'grego', capitulos: 22 },
]
