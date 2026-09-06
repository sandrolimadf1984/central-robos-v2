# -*- coding: utf-8 -*-
"""
GERADOR DO ARQUIVO DE RESERVA

Junta todos os módulos de src/ num arquivo só: releases/ATUAL/central-completo.js

Para que serve: se um módulo não baixar (internet oscilando, GitHub fora do
ar, arquivo apagado sem querer), o carregador usa esse arquivo único e o
atendente não fica na mão.

Como rodar (na pasta do projeto):

    python3 ferramentas/gerar-reserva.py

Rode SEMPRE que mexer em qualquer arquivo de src/, senão a reserva fica
para trás. E, quando for publicar uma versão, copie a reserva para
releases/vX.Y.Z/ — é assim que dá para voltar atrás depois.
"""
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def ler(caminho):
    with open(os.path.join(RAIZ, caminho), encoding='utf-8') as f:
        return f.read()


def base_do_carregador():
    """Pega do central.js o pedaço que monta o CR (base, estado, registrar).

    Assim a reserva nunca sai do ar em relação ao carregador: se o CR mudar
    lá, muda aqui junto, sem ninguém precisar lembrar de copiar."""
    txt = ler('central.js')
    endereco = txt[txt.index('    var REPO'):txt.index('    /* Lista de reserva')]
    base = txt[txt.index('    /* ── BASE COMPARTILHADA'):txt.index('    /* ── AVISO DE CARREGAMENTO')]
    return endereco + base


def main():
    modulos = json.loads(ler('manifest.json'))['modulos']
    versao = json.loads(ler('manifest.json'))['versao']

    partes = []
    partes.append('/* ' + '=' * 62)
    partes.append(' *  CENTRAL DE AUTOMAÇÃO — ARQUIVO DE RESERVA · versão ' + versao)
    partes.append(' *')
    partes.append(' *  NÃO EDITE ESTE ARQUIVO À MÃO.')
    partes.append(' *  Ele é gerado por ferramentas/gerar-reserva.py juntando')
    partes.append(' *  todos os módulos de src/. Mexa nos módulos e gere de novo.')
    partes.append(' *')
    partes.append(' *  Ele existe por um motivo só: se algum módulo não baixar,')
    partes.append(' *  o carregador cai aqui e a equipe continua trabalhando.')
    partes.append(' * ' + '=' * 62 + ' */')
    partes.append('(function () {')
    partes.append('    "use strict";')
    partes.append('    if (document.getElementById("menu-central-robos")) return;')
    partes.append('')
    partes.append(base_do_carregador())
    partes.append('    CR.modulosCarregados = %d;' % len(modulos))
    partes.append('    CR.tempoCarga = 0;')
    partes.append('    CR.reserva = true;')
    partes.append('')

    for caminho in modulos:
        conteudo = ler(caminho)
        partes.append('/* ' + '-' * 58)
        partes.append(' * ' + caminho)
        partes.append(' * ' + '-' * 58 + ' */')
        partes.append(conteudo)
        partes.append('')

    # avisos por último: a tela já existe, então é só redesenhar
    partes.append('''
    /* Avisos e situação dos robôs chegam depois e redesenham a tela. */
    try {
        CR.avisos.carregar(function () {
            try { CR.ui.atualizarAvisos(); } catch (e) { }
        });
    } catch (e) { }

})();
''')

    saida = '\n'.join(partes)

    destino = os.path.join(RAIZ, 'releases', 'ATUAL')
    os.makedirs(destino, exist_ok=True)
    arquivo = os.path.join(destino, 'central-completo.js')
    with open(arquivo, 'w', encoding='utf-8') as f:
        f.write(saida)

    print('Reserva gerada: releases/ATUAL/central-completo.js')
    print('  %d módulos · %d bytes' % (len(modulos), len(saida.encode('utf-8'))))
    return 0


if __name__ == '__main__':
    sys.exit(main())
