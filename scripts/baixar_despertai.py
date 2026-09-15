#!/usr/bin/env python3
"""
Baixador de artigos da revista Despertai sobre personagens bíblicos.
Coleta perfis, cartões bíblicos e artigos sobre personagens das Escrituras.

Uso:
    python baixar_despertai.py              # Baixa tudo
    python baixar_despertai.py --buscar "Moisés"  # Busca um personagem
"""

import argparse
import json
import os
import re
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

sys.path.insert(0, os.path.dirname(__file__))

# ─── Configurações ───────────────────────────────────────────────
DIRETORIO_SAIDA = Path(__file__).parent.parent / "DadosBiblia"
DIRETORIO_PERSONAGENS = DIRETORIO_SAIDA / "despertai_por_personagem"
ARQUIVO_COMPLETO = DIRETORIO_SAIDA / "despertai_personagens.json"

DELAY_ENTRE_REQUESTS = 2.0
TIMEOUT_REQUEST = 30
MAX_TENTATIVAS = 3

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
}

# ─── URLs de busca conhecidas ───────────────────────────────────
# Artigos da Despertai com "PERFIL" de personagens bíblicos (série "Colecione e Aprenda")
# Estes foram encontrados via busca e são endpoints conhecidos
URLS_CONHECIDAS = [
    # 2012
    {"url": "https://wol.jw.org/pt/wol/d/r5/lp-t/102012053", "ano": 2012, "titulo": "Para Considerar em Família - Samuel"},
    {"url": "https://wol.jw.org/pt/wol/d/r5/lp-t/102012131", "ano": 2012, "titulo": "Para Considerar em Família - Timóteo"},
    {"url": "https://wol.jw.org/pt/wol/d/r5/lp-t/102012295", "ano": 2012, "titulo": "Para Considerar em Família - Noé"},
    {"url": "https://wol.jw.org/pt/wol/d/r5/lp-t/102012377", "ano": 2012, "titulo": "Para Considerar em Família - Neemias"},
    {"url": "https://wol.jw.org/pt/wol/d/r5/lp-t/102012418", "ano": 2012, "titulo": "Para Considerar em Família - Jonatã"},
    {"url": "https://wol.jw.org/pt/wol/d/r5/lp-t/102012453", "ano": 2012, "titulo": "Para Considerar em Família - Sansão"},
    # 2011
    {"url": "https://wol.jw.org/pt/wol/d/r5/lp-t/102011173", "ano": 2011, "titulo": "Para Considerar em Família - Abraão"},
    {"url": "https://wol.jw.org/pt/wol/d/r5/lp-t/102011371", "ano": 2011, "titulo": "Para Considerar em Família - Salomão"},
    {"url": "https://wol.jw.org/pt/wol/d/r5/lp-t/102011054", "ano": 2011, "titulo": "Para Considerar em Família - Jeremias"},
]

# ─── Personagens bíblicos conhecidos (para busca) ───────────────
PERSONAGENS_CONHECIDOS = [
    "Adão", "Eva", "Caim", "Abel", "Sete", "Noé", "Abraão", "Isaque",
    "Jacó", "José", "Moisés", "Arão", "Josué", "Calebe", "Rute",
    "Samuel", "Saul", "Davi", "Salomão", "Roboão", "Acabe", "Jezabel",
    "Eliseu", "Isaías", "Jeremias", "Daniel", "Jonas", "Neemias",
    "Ester", "Mardoqueu", "Jó", "Sansão", "Débora", "Gideão",
    "Sansão", "Rute", "Jonatã", "Bate-Seba", "Absalom",
    "Pedro", "Paulo", "Tiago", "João", "André", "Filipe",
    "Bartolomeu", "Mateus", "Tomé", "Judas Iscariotes", "Barnabé",
    "Timóteo", "Tito", "Filémon", "Lázaro", "Martha", "Maria",
    "Zacarias", "Elizabeth", "José", "Maria", "Simão",
]


# ─── Funções auxiliares ──────────────────────────────────────────

def baixar_pagina(url: str) -> str | None:
    """Baixa uma página HTML com retry e backoff."""
    for tentativa in range(1, MAX_TENTATIVAS + 1):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT_REQUEST)
            resp.raise_for_status()
            return resp.text
        except requests.RequestException as e:
            wait = DELAY_ENTRE_REQUESTS * (2 ** tentativa)
            print(f"  ⚠️  Tentativa {tentativa}/{MAX_TENTATIVAS}: {e}")
            if tentativa < MAX_TENTATIVAS:
                print(f"  ⏳ Aguardando {wait:.1f}s...")
                time.sleep(wait)
    return None


def extrair_conteudo_despertai(html: str) -> dict:
    """
    Extrai conteúdo de uma página da revista Despertai no wol.jw.org.
    
    Busca por:
    - Texto do artigo
    - Seção "PERFIL" do personagem
    - Cartão bíblico (se houver)
    - Referências bíblicas
    """
    soup = BeautifulSoup(html, "lxml")
    
    resultado = {
        "texto_completo": "",
        "perfil": "",
        "cartao_biblico": None,
        "referencias": [],
        "personagens_encontrados": [],
    }
    
    # Buscar container principal do artigo
    article = (
        soup.find("div", class_="result-container") or
        soup.find("article") or
        soup.find("div", class_="bodyRoom") or
        soup.find("div", id="article")
    )
    
    if not article:
        article = soup
    
    # Extrair texto completo
    texto_completo = article.get_text(separator="\n", strip=True)
    resultado["texto_completo"] = texto_completo
    
    # Buscar seção PERFIL
    # O perfil geralmente vem após o texto "PERFIL" ou "PERFIL:" ou dentro de um bloco específico
    perfil_match = re.search(
        r'PERFIL[:\s]*(.*?)(?:RESPOSTAS|CARTÃO|ATIVIDADE|PARA CONVERSAR|\Z)',
        texto_completo,
        re.DOTALL | re.IGNORECASE,
    )
    if perfil_match:
        perfil_texto = perfil_match.group(1).strip()
        # Limpar o perfil
        perfil_texto = re.sub(r'\s+', ' ', perfil_texto)
        resultado["perfil"] = perfil_texto
    
    # Buscar cartão bíblico
    cartao_match = re.search(
        r'CARTÃO BÍBLICO\s+(\d+)\s+(\w[\w\s]*?)(?:\n|PERGUNTAS)',
        texto_completo,
        re.IGNORECASE,
    )
    if cartao_match:
        resultado["cartao_biblico"] = {
            "numero": int(cartao_match.group(1)),
            "personagem": cartao_match.group(2).strip(),
        }
    
    # Buscar perguntas e respostas do cartão
    perguntas_match = re.search(
        r'PERGUNTAS[:\s]*(.*?)(?:RESPOSTAS|PERFIL|CARTÃO|\Z)',
        texto_completo,
        re.DOTALL | re.IGNORECASE,
    )
    if perguntas_match and resultado["cartao_biblico"]:
        texto_perguntas = perguntas_match.group(1).strip()
        resultado["cartao_biblico"]["perguntas"] = texto_perguntas
    
    respostas_match = re.search(
        r'RESPOSTAS[:\s]*(.*?)(?:Povos|Para as|RESPOSTAS DAS|\Z)',
        texto_completo,
        re.DOTALL | re.IGNORECASE,
    )
    if respostas_match and resultado["cartao_biblico"]:
        texto_respostas = respostas_match.group(1).strip()
        resultado["cartao_biblico"]["respostas"] = texto_respostas
    
    # Buscar referências bíblicas (padrão: Livro Cap:Vers)
    ref_pattern = r'(?:1\s|2\s|3\s)?(?:Samuel|Reis|Crônicas|Coríntios|Tessalonicenses|Timóteo|Pedro|João)\s+\d+:\d+|(?:Gênesis|Êxodo|Levítico|Números|Deuteronômio|Josué|Juízes|Rute|Esdras|Neemias|Ester|Jó|Salmos|Provérbios|Eclesiastes|Cântico|Isaías|Jeremias|Lamentações|Ezequiel|Daniel|Oseias|Joel|Amós|Obadias|Jonas|Miqueias|Naum|Habacuque|Sofonias|Ageu|Zacarias|Malaquias|Mateus|Marcos|Lucas|João|Atos|Romanos|Gálatas|Efésios|Filipenses|Colossenses|Hebreus|Tiago|Judas|Apocalipse)\s+\d+:\d+(?:-\d+)?'
    refs = re.findall(ref_pattern, texto_completo)
    resultado["referencias"] = list(set(refs))
    
    # Buscar personagens mencionados
    for personagem in PERSONAGENS_CONHECIDOS:
        if re.search(rf'\b{re.escape(personagem)}\b', texto_completo, re.IGNORECASE):
            resultado["personagens_encontrados"].append(personagem)
    
    return resultado


def buscar_artigos_despertai(query: str = "") -> list[dict]:
    """
    Busca artigos da Despertai sobre personagens bíblicos.
    
    Usa o Google Custom Search (via Serper API) ou busca diretamente no wol.jw.org.
    """
    print(f"\n🔍 Buscando artigos da Despertai...")
    
    artigos_encontrados = []
    
    # Adicionar URLs conhecidas
    for artigo in URLS_CONHECIDAS:
        artigos_encontrados.append({
            "url": artigo["url"],
            "titulo": artigo["titulo"],
            "ano": artigo["ano"],
            "fonte": "conhecido",
        })
    
    # Buscar no wol.jw.org via busca interna
    search_url = f"https://wol.jw.org/pt/wol/s/r5/lp-t?q=PERFIL+despertai&fc%5B%5D=g&st=e"
    
    print(f"  📡 Buscando no wol.jw.org...")
    html = baixar_pagina(search_url)
    
    if html:
        soup = BeautifulSoup(html, "lxml")
        links = soup.find_all("a", href=True)
        
        for link in links:
            href = link.get("href", "")
            if "/wol/d/r5/lp-t/" in href:
                url_completa = f"https://wol.jw.org{href}" if href.startswith("/") else href
                titulo = link.get_text(strip=True)
                
                # Verificar se não já temos esta URL
                if not any(a["url"] == url_completa for a in artigos_encontrados):
                    artigos_encontrados.append({
                        "url": url_completa,
                        "titulo": titulo,
                        "ano": None,
                        "fonte": "busca_wol",
                    })
    
    # Buscar variações
    variacoes_busca = [
        "coleccione aprenda despertai",
        "cartão bíblico despertai",
        "personagem bíblico despertai",
    ]
    
    for variacao in variacoes_busca:
        search_url = f"https://wol.jw.org/pt/wol/s/r5/lp-t?q={variacao.replace(' ', '+')}&fc%5B%5D=g&st=e"
        html = baixar_pagina(search_url)
        
        if html:
            soup = BeautifulSoup(html, "lxml")
            links = soup.find_all("a", href=True)
            
            for link in links:
                href = link.get("href", "")
                if "/wol/d/r5/lp-t/" in href:
                    url_completa = f"https://wol.jw.org{href}" if href.startswith("/") else href
                    titulo = link.get_text(strip=True)
                    
                    if not any(a["url"] == url_completa for a in artigos_encontrados):
                        artigos_encontrados.append({
                            "url": url_completa,
                            "titulo": titulo,
                            "ano": None,
                            "fonte": "busca_wol",
                        })
        
        time.sleep(DELAY_ENTRE_REQUESTS)
    
    print(f"  📋 {len(artigos_encontrados)} artigos encontrados")
    return artigos_encontrados


def processar_artigos(artigos: list[dict]) -> dict:
    """
    Processa os artigos e organiza por personagem.
    
    Retorna um dicionário com personagens como chaves.
    """
    print(f"\n📝 Processando {len(artigos)} artigos...")
    
    personagens = {}
    artigos_processados = []
    
    for i, artigo in enumerate(artigos):
        url = artigo["url"]
        print(f"  [{i+1}/{len(artigos)}] {artigo.get('titulo', url[:60])}...", end=" ", flush=True)
        
        html = baixar_pagina(url)
        
        if html is None:
            print("❌ Falhou")
            continue
        
        conteudo = extrair_conteudo_despertai(html)
        
        # Criar registro do artigo
        registro = {
            "url": url,
            "titulo": artigo.get("titulo", ""),
            "ano": artigo.get("ano"),
            "texto_completo": conteudo["texto_completo"],
            "perfil": conteudo["perfil"],
            "cartao_biblico": conteudo["cartao_biblico"],
            "referencias": conteudo["referencias"],
        }
        
        artigos_processados.append(registro)
        
        # Organizar por personagem
        for personagem in conteudo["personagens_encontrados"]:
            nome_lower = personagem.lower()
            if nome_lower not in personagens:
                personagens[nome_lower] = {
                    "personagem": personagem,
                    "artigos": [],
                }
            personagens[nome_lower]["artigos"].append(registro)
        
        # Se tem cartão bíblico com nome de personagem
        if conteudo["cartao_biblico"] and conteudo["cartao_biblico"].get("personagem"):
            nome_personagem = conteudo["cartao_biblico"]["personagem"]
            nome_lower = nome_personagem.lower()
            if nome_lower not in personagens:
                personagens[nome_lower] = {
                    "personagem": nome_personagem,
                    "artigos": [],
                }
            # Adicionar registro se não já adicionado
            if registro not in personagens[nome_lower]["artigos"]:
                personagens[nome_lower]["artigos"].append(registro)
        
        # Se tem perfil, identificar o personagem pelo contexto
        if conteudo["perfil"] and not conteudo["personagens_encontrados"]:
            # Tentar extrair nome do personagem do contexto
            nome_perfil = extrair_nome_do_perfil(conteudo["texto_completo"])
            if nome_perfil:
                nome_lower = nome_perfil.lower()
                if nome_lower not in personagens:
                    personagens[nome_lower] = {
                        "personagem": nome_perfil,
                        "artigos": [],
                    }
                if registro not in personagens[nome_lower]["artigos"]:
                    personagens[nome_lower]["artigos"].append(registro)
        
        print(f"✅ {len(conteudo['personagens_encontrados'])} personagens")
        time.sleep(DELAY_ENTRE_REQUESTS)
    
    print(f"\n📊 {len(personagens)} personagens únicos encontrados")
    return {
        "artigos": artigos_processados,
        "personagens": personagens,
    }


def extrair_nome_do_perfil(texto: str) -> str | None:
    """Tenta extrair o nome do personagem a partir do contexto do perfil."""
    # Buscar padrões como "SAMUEL\nPERFIL" ou "ABRAO\nPERFIL"
    match = re.search(r'([A-ZÁÉÍÓÚÃÕÊÔÇ][A-ZÁÉÍÓÚÃÕÊÔÇ\s]+)\s*\n?\s*PERFIL', texto)
    if match:
        nome = match.group(1).strip()
        if len(nome) <= 30:  # Nome não muito longo
            return nome
    return None


def salvar_resultados(dados: dict):
    """Salva os resultados em JSON."""
    # Criar diretório
    DIRETORIO_SAIDA.mkdir(parents=True, exist_ok=True)
    DIRETORIO_PERSONAGENS.mkdir(parents=True, exist_ok=True)
    
    # Salvar arquivo completo
    saida_completa = {
        "fonte": "Despertai! - Revista das Testemunhas de Jeová",
        "periodo": "2011-2025",
        "total_artigos": len(dados["artigos"]),
        "total_personagens": len(dados["personagens"]),
        "personagens": {
            nome: {
                "personagem": info["personagem"],
                "total_artigos": len(info["artigos"]),
                "artigos": info["artigos"],
            }
            for nome, info in dados["personagens"].items()
        },
    }
    
    with open(ARQUIVO_COMPLETO, "w", encoding="utf-8") as f:
        json.dump(saida_completa, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 Arquivo completo salvo: {ARQUIVO_COMPLETO}")
    
    # Salvar por personagem
    for nome, info in dados["personagens"].items():
        nome_arquivo = f"{nome.replace(' ', '_').replace('/', '_')}.json"
        caminho = DIRETORIO_PERSONAGENS / nome_arquivo
        
        with open(caminho, "w", encoding="utf-8") as f:
            json.dump(info, f, ensure_ascii=False, indent=2)
    
    print(f"📁 {len(dados['personagens'])} arquivos individuais salvos em despertai_por_personagem/")


def buscar_por_personagem(nome: str):
    """Busca artigos específicos sobre um personagem."""
    print(f"\n🔍 Buscando artigos sobre: {nome}")
    
    # Verificar se já temos dados locais
    if ARQUIVO_COMPLETO.exists():
        with open(ARQUIVO_COMPLETO, "r", encoding="utf-8") as f:
            dados = json.load(f)
        
        nome_lower = nome.lower()
        if nome_lower in dados.get("personagens", {}):
            personagem = dados["personagens"][nome_lower]
            print(f"\n👤 {personagem['personagem']}: {len(personagem['artigos'])} artigos encontrados")
            for artigo in personagem["artigos"]:
                print(f"  📰 {artigo['titulo']} ({artigo['ano']})")
                if artigo.get("perfil"):
                    print(f"     Perfil: {artigo['perfil'][:100]}...")
            return
    
    print("  ⚠️  Dados locais não encontrados. Execute primeiro sem --buscar.")


def _atualizar_delay(novo_delay: float):
    """Atualiza o delay global entre requests."""
    global DELAY_ENTRE_REQUESTS
    DELAY_ENTRE_REQUESTS = novo_delay


def main():
    parser = argparse.ArgumentParser(
        description="Baixa artigos da Despertai sobre personagens bíblicos"
    )
    parser.add_argument(
        "--buscar", "-b",
        help="Busca um personagem específico nos dados já baixados",
    )
    parser.add_argument(
        "--listar",
        action="store_true",
        help="Lista todos os personagens encontrados",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=DELAY_ENTRE_REQUESTS,
        help=f"Delay entre requests em segundos (padrão: {DELAY_ENTRE_REQUESTS})",
    )
    
    args = parser.parse_args()
    
    _atualizar_delay(args.delay)
    
    if args.buscar:
        buscar_por_personagem(args.buscar)
        return
    
    # Buscar artigos
    artigos = buscar_artigos_despertai()
    
    if not artigos:
        print("❌ Nenhum artigo encontrado.")
        return
    
    # Processar
    dados = processar_artigos(artigos)
    
    # Salvar
    salvar_resultados(dados)
    
    # Listar personagens
    if args.listar or True:
        print(f"\n👤 Personagens encontrados ({len(dados['personagens'])}):")
        for nome, info in sorted(dados["personagens"].items()):
            print(f"  • {info['personagem']} ({len(info['artigos'])} artigos)")


if __name__ == "__main__":
    main()
