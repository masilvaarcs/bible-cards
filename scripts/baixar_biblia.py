#!/usr/bin/env python3
"""
Baixador da Bíblia NWT (Tradução do Novo Mundo) — Português do Brasil.
Faz scraping capítulo a capítulo do jw.org e salva em JSON organizado por livro.

Uso:
    python baixar_biblia.py                  # Baixa tudo
    python baixar_biblia.py --livro genesis  # Baixa só Gênesis
    python baixar_biblia.py --resume         # Retoma de onde parou
"""

import argparse
import json
import os
import sys

# Fix encoding for Windows console (emojis)
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass
import time
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# Adicionar o diretório ao path para importar o mapeamento
sys.path.insert(0, os.path.dirname(__file__))
from biblia_dados import LIVROS_BIBLIA, URL_BASE

# ─── Configurações ───────────────────────────────────────────────
DIRETORIO_SAIDA = Path(__file__).parent.parent / "DadosBiblia"
DIRETORIO_LIVROS = DIRETORIO_SAIDA / "nwt_por_livro"
ARQUIVO_COMPLETO = DIRETORIO_SAIDA / "nwt_biblia_completa.json"
ARQUIVO_PROGRESSO = DIRETORIO_SAIDA / ".progresso_biblia.json"

DELAY_ENTRE_REQUESTS = 1.5  # segundos
TIMEOUT_REQUEST = 30         # segundos
MAX_TENTATIVAS = 3

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
}

TRADUCAO = "Tradução do Novo Mundo da Bíblia Sagrada (revisão de 2015)"


# ─── Funções auxiliares ──────────────────────────────────────────

def carregar_progresso() -> dict:
    """Carrega o progresso de downloads anteriores."""
    if ARQUIVO_PROGRESSO.exists():
        with open(ARQUIVO_PROGRESSO, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def salvar_progresso(progresso: dict):
    """Salva o progresso atual."""
    with open(ARQUIVO_PROGRESSO, "w", encoding="utf-8") as f:
        json.dump(progresso, f, ensure_ascii=False, indent=2)


def baixar_pagina(url: str) -> str | None:
    """Baixa uma página HTML com retry e backoff."""
    for tentativa in range(1, MAX_TENTATIVAS + 1):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT_REQUEST)
            resp.raise_for_status()
            return resp.text
        except requests.RequestException as e:
            wait = DELAY_ENTRE_REQUESTS * (2 ** tentativa)
            print(f"  ⚠️  Tentativa {tentativa}/{MAX_TENTATIVAS} falhou: {e}")
            if tentativa < MAX_TENTATIVAS:
                print(f"  ⏳ Aguardando {wait:.1f}s antes de retry...")
                time.sleep(wait)
    return None


def extrair_versiculos(html: str) -> list[dict]:
    """
    Extrai os versículos de uma página da Bíblia no jw.org.
    
    O conteúdo bíblico está no HTML completo, mas não em <p class="sb">.
    Extraímos do texto completo da página, procurando o padrão:
    número de versículo (em linha separada) seguido do texto do versículo.
    """
    import re
    
    soup = BeautifulSoup(html, "lxml")
    
    # Remover scripts e estilos para pegar só o texto
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    
    full_text = soup.get_text(separator="\n", strip=True)
    lines = full_text.split("\n")
    
    # Palavras que indicam que NÃO é texto bíblico (metadados da página)
    SKIP_PATTERNS = [
        'TRADUÇÃO', 'REPRODUZIR', 'CONTEÚDO DO LIVRO', 'https://',
        'Leia a Bíblia', 'Direitos autorais', 'Português (Brasil)',
        'REVISÃO DE', 'Criação dos céus', 'Seis dias',
        'Dia 1:', 'Dia 2:', 'Dia 3:', 'Dia 4:', 'Dia 5:', 'Dia 6:',
        'https://cm', 'Gênesis 1:', 'Gênesis 2:', 'Êxodo',
        'REPRODUZIR CONTEÚDO', 'CONTEÚDO DO LIVRO',
        'REPRODUZIR\n', 'CONTEÚDO', 'conteúdo',
    ]
    
    def eh_texto_biblico(texto: str) -> bool:
        """Verifica se uma linha parece texto bíblico (não metadado)."""
        if not texto or len(texto) < 10:
            return False
        for pattern in SKIP_PATTERNS:
            if pattern in texto:
                return False
        # Texto bíblico geralmente:
        # - Começa com maiúscula
        # - Contém pontuação (vírgula, ponto, dois-pontos)
        # - Não é só números
        if texto.replace(' ', '').isdigit():
            return False
        if texto[0].isupper() or texto[0] in ['"', '\u201c', '\u2018']:
            # Verificar se não é uma sequência de números (como TOC)
            words = texto.split()
            if len(words) >= 2 and all(w.replace(',', '').replace('.', '').isdigit() for w in words[:3]):
                return False
            return True
        return False
    
    # Encontrar onde começa o texto bíblico
    # Procurar pela primeira sequência: número de versículo + texto bíblico válido
    start_idx = None
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.isdigit() and 1 <= int(stripped) <= 200:
            # Verificar se a PRÓXIMA linha é texto bíblico (não metadado)
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                if eh_texto_biblico(next_line):
                    # Verificar se NÃO é metadado (TOC, header)
                    is_metadata = any(p in next_line for p in [
                        'TRADUÇÃO', 'REPRODUZIR', 'CONTEÚDO', 'https://',
                        'Gênesis', 'Êxodo', 'Leví', 'Núm', 'Deut',
                    ])
                    if not is_metadata:
                        start_idx = i
                        break
    
    if start_idx is None:
        return []
    
    # Extrair versículos até "Notas de rodapé" ou "Direitos autorais"
    versiculos = []
    current_verse_num = None
    current_verse_text = []
    
    for i in range(start_idx, len(lines)):
        line = lines[i].strip()
        
        # Parar em notas de rodapé ou direitos autorais
        if any(line.startswith(s) for s in ["Notas de rodapé", "Direitos autorais", "Direitos"]):
            break
        
        # Pular marcadores de nota e símbolos
        if line in ["+", "*", ""] or line.startswith("^"):
            continue
        
        # Verificar se é número de versículo
        if line.isdigit() and 1 <= int(line) <= 200:
            # Salvar versículo anterior
            if current_verse_num is not None and current_verse_text:
                texto = " ".join(current_verse_text).strip()
                texto = limpar_texto_versiculo(texto)
                if texto:
                    versiculos.append({"versiculo": current_verse_num, "texto": texto})
            
            current_verse_num = int(line)
            current_verse_text = []
        elif current_verse_num is not None:
            current_verse_text.append(line)
    
    # Salvar último versículo
    if current_verse_num is not None and current_verse_text:
        texto = " ".join(current_verse_text).strip()
        texto = limpar_texto_versiculo(texto)
        if texto:
            versiculos.append({"versiculo": current_verse_num, "texto": texto})
    
    return versiculos


def limpar_texto_versiculo(texto: str) -> str:
    """Limpa o texto de um versículo removendo marcadores de notas."""
    import re
    # Remover + e * (marcadores de notas de rodapé)
    texto = re.sub(r'[+*]', '', texto)
    # Remover espaços duplos
    while "  " in texto:
        texto = texto.replace("  ", " ")
    return texto.strip()


def formatar_resultado(livro_info: dict, capitulos: list[dict]) -> dict:
    """Formata o resultado final para um livro."""
    return {
        "traducao": TRADUCAO,
        "idioma": "pt",
        "fonte": "jw.org",
        "livro": {
            "nome": livro_info["nome"],
            "abreviacao": livro_info["abrev"],
            "slug": livro_info["slug"],
            "testamento": livro_info["testamento"],
            "ordem": livro_info["ordem"],
            "total_capitulos": livro_info["capitulos"],
        },
        "capitulos": capitulos,
    }


def salvar_livro(slug: str, dados: dict):
    """Salva os dados de um livro em JSON."""
    # Nome do arquivo com número de ordem para ordenação
    livro_info = next(l for l in LIVROS_BIBLIA if l["slug"] == slug)
    nome_arquivo = f"{livro_info['ordem']:02d}_{slug}.json"
    
    caminho = DIRETORIO_LIVROS / nome_arquivo
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
    
    return caminho


def montar_biblia_completa():
    """Monta o arquivo completo da Bíblia a partir dos livros individuais."""
    print("\n📚 Montando arquivo completo da Bíblia...")
    
    livros_completos = []
    
    for livro_info in sorted(LIVROS_BIBLIA, key=lambda x: x["ordem"]):
        nome_arquivo = f"{livro_info['ordem']:02d}_{livro_info['slug']}.json"
        caminho = DIRETORIO_LIVROS / nome_arquivo
        
        if caminho.exists():
            with open(caminho, "r", encoding="utf-8") as f:
                dados_livro = json.load(f)
            livros_completos.append(dados_livro)
    
    biblia_completa = {
        "traducao": TRADUCAO,
        "idioma": "pt",
        "fonte": "jw.org",
        "total_livros": len(livros_completos),
        "livros": livros_completos,
    }
    
    with open(ARQUIVO_COMPLETO, "w", encoding="utf-8") as f:
        json.dump(biblia_completa, f, ensure_ascii=False, indent=2)
    
    # Estatísticas
    total_versiculos = sum(
        len(v)
        for livro in livros_completos
        for cap in livro["capitulos"]
        for v in [cap.get("versiculos", [])]
    )
    
    tamanho_mb = os.path.getsize(ARQUIVO_COMPLETO) / (1024 * 1024)
    print(f"  ✅ Arquivo completo salvo: {ARQUIVO_COMPLETO}")
    print(f"     {len(livros_completos)} livros | ~{total_versiculos} versículos | {tamanho_mb:.1f} MB")


def baixar_livro(livro_info: dict, progresso: dict, force: bool = False):
    """Baixa todos os capítulos de um livro."""
    slug = livro_info["slug"]
    nome = livro_info["nome"]
    total_caps = livro_info["capitulos"]
    
    # Verificar se já foi baixado
    if not force and progresso.get(slug, {}).get("completo", False):
        print(f"  ⏭️  {nome} já baixado. Use --force para重新 baixar.")
        return
    
    caps_baixados = progresso.get(slug, {}).get("caps", [])
    
    print(f"\n📖 Baixando: {nome} ({total_caps} capítulos)")
    
    capitulos = []
    
    for cap_num in range(1, total_caps + 1):
        # Pular capítulos já baixados (modo resume)
        if str(cap_num) in caps_baixados:
            # Carregar do progresso
            cap_dados = progresso[slug].get("capitulos", {}).get(str(cap_num))
            if cap_dados:
                capitulos.append(cap_dados)
                continue
        
        # Construir URL do capítulo
        url = f"{URL_BASE}/{slug}/{cap_num}/"
        
        print(f"  📄 Capítulo {cap_num}/{total_caps}...", end=" ", flush=True)
        
        html = baixar_pagina(url)
        
        if html is None:
            print("❌ Falhou")
            # Criar capítulo vazio para não quebrar a sequência
            capitulos.append({
                "numero": cap_num,
                "versiculos": [],
                "erro": "Falha no download",
            })
            continue
        
        versiculos = extrair_versiculos(html)
        
        cap_dados = {
            "numero": cap_num,
            "versiculos": versiculos,
        }
        
        capitulos.append(cap_dados)
        
        num_vers = len(versiculos)
        print(f"✅ {num_vers} versículos")
        
        # Atualizar progresso
        if slug not in progresso:
            progresso[slug] = {"caps": [], "capitulos": {}}
        progresso[slug]["caps"].append(str(cap_num))
        progresso[slug]["capitulos"][str(cap_num)] = cap_dados
        
        # Salvar progresso a cada 5 capítulos
        if cap_num % 5 == 0:
            salvar_progresso(progresso)
        
        # Delay entre requests
        time.sleep(DELAY_ENTRE_REQUESTS)
    
    # Salvar livro individual
    dados_livro = formatar_resultado(livro_info, capitulos)
    caminho = salvar_livro(slug, dados_livro)
    
    # Marcar como completo
    progresso[slug]["completo"] = True
    salvar_progresso(progresso)
    
    total_versiculos = sum(len(c.get("versiculos", [])) for c in capitulos)
    print(f"  ✅ {nome} completo! {total_versiculos} versículos → {caminho.name}")


def _atualizar_delay(novo_delay: float):
    """Atualiza o delay global entre requests."""
    global DELAY_ENTRE_REQUESTS
    DELAY_ENTRE_REQUESTS = novo_delay


def main():
    parser = argparse.ArgumentParser(
        description="Baixa a Bíblia NWT em português do jw.org"
    )
    parser.add_argument(
        "--livro", "-l",
        help="Nome do slug do livro para baixar (ex: genesis, psalms)",
    )
    parser.add_argument(
        "--resume", "-r",
        action="store_true",
        help="Retoma download de onde parou",
    )
    parser.add_argument(
        "--force", "-f",
        action="store_true",
        help="Força re-download de livros já baixados",
    )
    parser.add_argument(
        "--completo", "-c",
        action="store_true",
        help="Monta o arquivo completo a partir dos livros individuais",
    )
    parser.add_argument(
        "--listar",
        action="store_true",
        help="Lista todos os livros disponíveis",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=DELAY_ENTRE_REQUESTS,
        help=f"Delay entre requests em segundos (padrão: {DELAY_ENTRE_REQUESTS})",
    )
    
    args = parser.parse_args()
    
    # Criar diretórios
    DIRETORIO_SAIDA.mkdir(parents=True, exist_ok=True)
    DIRETORIO_LIVROS.mkdir(parents=True, exist_ok=True)
    
    # Listar livros
    if args.listar:
        print("\n📚 Livros da Bíblia NWT:")
        print(f"{'#':>3} {'Nome':<25} {'Capítulos':>10} {'Testamento':<12}")
        print("─" * 55)
        for l in LIVROS_BIBLIA:
            print(f"{l['ordem']:>3} {l['nome']:<25} {l['capitulos']:>10} {l['testamento']:<12}")
        print(f"\nTotal: {len(LIVROS_BIBLIA)} livros")
        return
    
    # Montar arquivo completo
    if args.completo:
        montar_biblia_completa()
        return
    
    _atualizar_delay(args.delay)
    
    progresso = carregar_progresso()
    
    # Baixar livro específico
    if args.livro:
        livro = next(
            (l for l in LIVROS_BIBLIA if l["slug"] == args.livro),
            None,
        )
        if not livro:
            print(f"❌ Livro '{args.livro}' não encontrado.")
            print("Use --listar para ver os livros disponíveis.")
            return
        
        baixar_livro(livro, progresso, force=args.force)
    else:
        # Baixar todos
        print("🇧🇷 Baixando a Bíblia NWT em português do Brasil...")
        print(f"   Fonte: jw.org")
        print(f"   Livros: {len(LIVROS_BIBLIA)}")
        print(f"   Total de capítulos: {sum(l['capitulos'] for l in LIVROS_BIBLIA)}")
        print(f"   Delay entre requests: {DELAY_ENTRE_REQUESTS}s")
        print()
        
        inicio = time.time()
        
        for i, livro in enumerate(LIVROS_BIBLIA):
            baixar_livro(livro, progresso, force=args.force)
        
        elapsed = time.time() - inicio
        print(f"\n🎉 Download completo em {elapsed/60:.1f} minutos!")
        
        # Montar arquivo completo
        montar_biblia_completa()
    
    # Limpar arquivo de progresso temporário se tudo completo
    if ARQUIVO_PROGRESSO.exists():
        todos_completos = all(
            progresso.get(l["slug"], {}).get("completo", False)
            for l in LIVROS_BIBLIA
        )
        if todos_completos:
            os.remove(ARQUIVO_PROGRESSO)
            print("🧹 Arquivo de progresso removido (download completo)")


if __name__ == "__main__":
    main()
