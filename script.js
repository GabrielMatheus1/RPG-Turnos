import { Mage } from "./src/Classes/herois/Mage.js";
import { MovimentoMage } from "./src/movimentos/herois/MoveMage.js";
import { Goblin } from "./src/Classes/inimigos/Goblin.js";
import { Esqueleto } from "./src/Classes/inimigos/Esqueleto.js";
import { Drakar } from "./src/Classes/boss/Drakar.js";

import { floresta } from "./src/Mapas/world-1/Fases-1.js";
import { cavernaCristalina } from "./src/Mapas/world-1/Fases-2.js";
import { pantanoProfundo } from "./src/Mapas/world-1/Fases-3.js";
import { fortalezaAntiga } from "./src/Mapas/world-1/Fases-4.js";
import { santuarioCentral } from "./src/Mapas/world-1/Fases-5.js";

const fases = [floresta, cavernaCristalina, pantanoProfundo, fortalezaAntiga, santuarioCentral];
const teclas = {};
const ESTADO_JOGO = {
    mapa: "mapa",
    batalha: "batalha"
};
const OPCOES_BATALHA = ["ATACAR", "MAGIA", "BOLSA", "FUGIR"];
const VELOCIDADE_MAPA = {
    normal: 2,
    dash: 4
};
const ENCONTROS = {
    minimoPorFase: 8,
    maximoPorFase: 42,
    distanciaDoSpawn: 5,
    distanciaDaSaida: 4,
    distanciaEntreEncontros: 3
};
const TEMAS = {
    floresta: {
        fundo: "#6fb95d",
        chao: "#79c861",
        caminho: "#d9bb70",
        caminhoClaro: "#f1da93",
        caminhoSombra: "#ae7d43",
        parede: "#347e3e",
        paredeClara: "#52ad50",
        paredeSombra: "#245d35",
        detalhe: "#f2d85b",
        gramaAlta: "#3f9c42",
        gramaAltaClara: "#76d760",
        saida: "#5ac1ff",
        saidaSombra: "#1d6fb6",
        moldura: "#1f2430",
        hud: "#fff6df",
        hudSombra: "#d3aa61",
        texto: "#1e2430",
        destaque: "#e34545",
        tipoObstaculo: "arvore"
    },
    "caverna-cristalina": {
        fundo: "#5a527f",
        chao: "#7d76a8",
        caminho: "#bdb5dc",
        caminhoClaro: "#d9d3f0",
        caminhoSombra: "#706895",
        parede: "#5c537d",
        paredeClara: "#8a7dbb",
        paredeSombra: "#3d3757",
        detalhe: "#8ff0ff",
        gramaAlta: "#65c8dc",
        gramaAltaClara: "#b8f8ff",
        saida: "#81f2e6",
        saidaSombra: "#2693a6",
        moldura: "#27233b",
        hud: "#f7f2ff",
        hudSombra: "#a795d1",
        texto: "#242036",
        destaque: "#f05d8a",
        tipoObstaculo: "cristal"
    },
    "pantano-profundo": {
        fundo: "#5e7d4f",
        chao: "#86a85e",
        caminho: "#a88958",
        caminhoClaro: "#c7ad70",
        caminhoSombra: "#695739",
        parede: "#3f6346",
        paredeClara: "#638d51",
        paredeSombra: "#294532",
        detalhe: "#d6e88b",
        gramaAlta: "#607f3b",
        gramaAltaClara: "#9bbf5c",
        saida: "#7ed7be",
        saidaSombra: "#2c8172",
        moldura: "#243025",
        hud: "#fbf4d7",
        hudSombra: "#a68655",
        texto: "#202719",
        destaque: "#db534b",
        tipoObstaculo: "pantano"
    },
    "fortaleza-antiga": {
        fundo: "#8a826d",
        chao: "#a99d7f",
        caminho: "#cdb98a",
        caminhoClaro: "#e3d3a8",
        caminhoSombra: "#85714f",
        parede: "#6f6f78",
        paredeClara: "#9a9aa3",
        paredeSombra: "#4c4d55",
        detalhe: "#d8bc57",
        gramaAlta: "#7a8b58",
        gramaAltaClara: "#b3bf75",
        saida: "#e8c95e",
        saidaSombra: "#8d6b2e",
        moldura: "#2a2b31",
        hud: "#fff2d0",
        hudSombra: "#a08a60",
        texto: "#27251f",
        destaque: "#c94e43",
        tipoObstaculo: "pedra"
    },
    "santuario-central": {
        fundo: "#6f91a0",
        chao: "#9ebfc0",
        caminho: "#cdd9d5",
        caminhoClaro: "#eef5ef",
        caminhoSombra: "#7f9997",
        parede: "#5f7794",
        paredeClara: "#8fabcb",
        paredeSombra: "#41566f",
        detalhe: "#f0ca54",
        gramaAlta: "#6fa0a0",
        gramaAltaClara: "#a9d6d0",
        saida: "#f0cc58",
        saidaSombra: "#9a7528",
        moldura: "#25313d",
        hud: "#f8f6e8",
        hudSombra: "#91a6ac",
        texto: "#1f2a32",
        destaque: "#cf4a4a",
        tipoObstaculo: "santuario"
    }
};

let faseIndex = 0;
let mapaAtual = prepararFase(fases[faseIndex], faseIndex);
let tempoJogo = 0;
let estadoJogo = ESTADO_JOGO.mapa;
let batalhaAtual = null;
let posicaoAntesDaBatalha = null;
const inventario = {
    pocoes: 4
};
let avisoFase = {
    texto: mapaAtual.nome,
    tempo: 150
};

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const camera = {
    x: 0,
    y: 0,
    width: Math.min(640, larguraMapa()),
    height: Math.min(480, alturaMapa())
};

canvas.width = camera.width;
canvas.height = camera.height;
ctx.imageSmoothingEnabled = false;

const movimento = new MovimentoMage();
const spawn = encontrarTile(3);

const jogador = new Mage({
    name: "Merlin",
    classe: "Mage",
    nivel: 1,
    vida: 150,
    hpMax: 150,
    ataque: 8,
    defesa: 5,
    xp: 0
});

Object.assign(jogador, {
    x: spawn.x,
    y: spawn.y,
    width: 80,
    height: 80,
    ataque: jogador.ataque || 8,
    acao: "parado",
    img: movimento.parado()
});

const animacao = {
    frame: 0,
    contador: 0,
    atraso: 8
};

configurarControles();
atualizar();

function configurarControles() {
    window.addEventListener("keydown", (event) => {
        if (estadoJogo === ESTADO_JOGO.batalha) {
            controlarBatalhaPorTecla(event.key);

            if (teclaDaBatalha(event.key)) {
                event.preventDefault();
            }

            return;
        }

        pressionar(event.key, true);

        if (event.key.startsWith("Arrow")) {
            event.preventDefault();
        }
    });

    window.addEventListener("keyup", (event) => {
        pressionar(event.key, false);
    });

    document.querySelectorAll("[data-key]").forEach((botao) => {
        const tecla = botao.dataset.key;

        botao.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            botao.setPointerCapture(event.pointerId);
            botao.classList.add("is-pressed");

            if (estadoJogo === ESTADO_JOGO.batalha) {
                controlarBatalhaPorTecla(tecla);
                return;
            }

            pressionar(tecla, true);
        });

        ["pointerup", "pointercancel", "lostpointercapture"].forEach((evento) => {
            botao.addEventListener(evento, () => soltarBotao(botao, tecla));
        });
    });

    window.addEventListener("blur", limparControles);
    window.addEventListener("resize", atualizarCamera);
    window.addEventListener("orientationchange", atualizarCamera);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            limparControles();
        }
    });

    canvas.addEventListener("pointerdown", selecionarBatalhaPorToque);
}

function pressionar(tecla, valor) {
    teclas[tecla.toLowerCase()] = valor;
}

function soltarBotao(botao, tecla) {
    pressionar(tecla, false);
    botao.classList.remove("is-pressed");
}

function limparControles() {
    Object.keys(teclas).forEach((tecla) => {
        teclas[tecla] = false;
    });

    document.querySelectorAll(".control-button").forEach((botao) => {
        botao.classList.remove("is-pressed");
    });
}

function estaCorrendo() {
    return Boolean(teclas.shift);
}

function atualizar() {
    tempoJogo++;

    if (estadoJogo === ESTADO_JOGO.batalha) {
        atualizarAnimacao(false);
        atualizarBatalha();
        desenhar();
        requestAnimationFrame(atualizar);
        return;
    }

    if (avisoFase.tempo > 0) {
        avisoFase.tempo--;
    }

    const posicaoAnterior = { x: jogador.x, y: jogador.y };
    movimento.velocidade = estaCorrendo() ? VELOCIDADE_MAPA.dash : VELOCIDADE_MAPA.normal;

    const estaAndando = movimento.mover(jogador, teclas, {
        width: larguraMapa(),
        height: alturaMapa()
    });

    if (temColisao(jogador.x, jogador.y)) {
        jogador.x = posicaoAnterior.x;
        jogador.y = posicaoAnterior.y;
    } else {
        verificarSaida();
        verificarEncontro(posicaoAnterior);
    }

    atualizarAnimacao(estaAndando);
    atualizarCamera();
    desenhar();

    requestAnimationFrame(atualizar);
}

function atualizarAnimacao(estaAndando) {
    const acao = estaAndando ? "andar" : "parado";

    if (jogador.acao !== acao) {
        jogador.acao = acao;
        jogador.img = estaAndando ? movimento.andar() : movimento.parado();
        animacao.frame = 0;
        animacao.contador = 0;
    }

    animacao.contador++;

    if (animacao.contador >= animacao.atraso) {
        animacao.frame = (animacao.frame + 1) % jogador.img.length;
        animacao.contador = 0;
    }
}

function atualizarCamera() {
    camera.x = limitar(
        jogador.x + jogador.width / 2 - camera.width / 2,
        0,
        larguraMapa() - camera.width
    );

    camera.y = limitar(
        jogador.y + jogador.height / 2 - camera.height / 2,
        0,
        alturaMapa() - camera.height
    );
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (estadoJogo === ESTADO_JOGO.batalha) {
        desenharBatalha();
        return;
    }

    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    desenharMapa();
    desenharJogador();
    ctx.restore();

    desenharHud();
}

function desenharMapa() {
    const tema = temaAtual();
    const inicioColuna = Math.max(0, Math.floor(camera.x / mapaAtual.largura));
    const fimColuna = Math.min(
        mapaAtual.mapa[0].length,
        Math.ceil((camera.x + camera.width) / mapaAtual.largura) + 1
    );

    const inicioLinha = Math.max(0, Math.floor(camera.y / mapaAtual.altura));
    const fimLinha = Math.min(
        mapaAtual.mapa.length,
        Math.ceil((camera.y + camera.height) / mapaAtual.altura) + 1
    );

    ctx.fillStyle = tema.fundo;
    ctx.fillRect(camera.x, camera.y, camera.width, camera.height);

    for (let linha = inicioLinha; linha < fimLinha; linha++) {
        for (let coluna = inicioColuna; coluna < fimColuna; coluna++) {
            const bloco = mapaAtual.mapa[linha][coluna];
            const x = coluna * mapaAtual.largura;
            const y = linha * mapaAtual.altura;

            if (bloco === 1) {
                desenharTerreno(x, y, mapaAtual.largura, mapaAtual.altura, tema, linha, coluna);
                desenharObstaculo(x, y, mapaAtual.largura, mapaAtual.altura, tema, linha, coluna);
                continue;
            }

            if (bloco === 4) {
                desenharCaminho(x, y, mapaAtual.largura, mapaAtual.altura, tema, linha, coluna);
                continue;
            }

            desenharCaminho(x, y, mapaAtual.largura, mapaAtual.altura, tema, linha, coluna);

            if (bloco === 2) {
                desenharSaida(x, y, mapaAtual.largura, mapaAtual.altura, tema);
            }
        }
    }
}

function desenharTerreno(x, y, largura, altura, tema, linha, coluna) {
    ctx.fillStyle = tema.chao;
    ctx.fillRect(x, y, largura, altura);

    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.fillRect(x, y, largura, Math.max(5, altura * 0.08));

    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(x, y + altura - Math.max(6, altura * 0.08), largura, Math.max(6, altura * 0.08));

    for (let i = 0; i < 5; i++) {
        const px = x + 10 + ruido(linha, coluna, i) * (largura - 20);
        const py = y + 12 + ruido(linha, coluna, i + 9) * (altura - 24);
        const tamanho = 3 + Math.floor(ruido(linha, coluna, i + 18) * 5);

        ctx.fillStyle = i % 2 === 0 ? "rgba(255, 255, 255, 0.16)" : "rgba(38, 86, 44, 0.16)";
        ctx.fillRect(Math.floor(px), Math.floor(py), tamanho, tamanho);
    }
}

function desenharCaminho(x, y, largura, altura, tema, linha, coluna) {
    ctx.fillStyle = tema.caminho;
    ctx.fillRect(x, y, largura, altura);

    ctx.fillStyle = tema.caminhoClaro;
    ctx.globalAlpha = 0.36;
    ctx.fillRect(x, y, largura, Math.max(7, altura * 0.14));
    ctx.globalAlpha = 1;

    ctx.fillStyle = tema.caminhoSombra;
    ctx.globalAlpha = 0.28;
    ctx.fillRect(x, y + altura - Math.max(8, altura * 0.12), largura, Math.max(8, altura * 0.12));
    ctx.globalAlpha = 1;

    desenharBordasCaminho(x, y, largura, altura, tema, linha, coluna);

    for (let i = 0; i < 6; i++) {
        const px = x + 12 + ruido(linha, coluna, i + 2) * (largura - 24);
        const py = y + 14 + ruido(linha, coluna, i + 12) * (altura - 28);
        const larguraPedra = 4 + Math.floor(ruido(linha, coluna, i + 22) * 7);

        ctx.fillStyle = i % 2 === 0 ? "rgba(83, 64, 42, 0.18)" : "rgba(255, 248, 198, 0.3)";
        ctx.fillRect(Math.floor(px), Math.floor(py), larguraPedra, 3);
    }
}

function desenharBordasCaminho(x, y, largura, altura, tema, linha, coluna) {
    const espessura = 7;
    ctx.fillStyle = "rgba(36, 74, 46, 0.16)";

    if (blocoMapa(linha - 1, coluna) === 1) {
        ctx.fillRect(x, y, largura, espessura);
    }

    if (blocoMapa(linha + 1, coluna) === 1) {
        ctx.fillRect(x, y + altura - espessura, largura, espessura);
    }

    if (blocoMapa(linha, coluna - 1) === 1) {
        ctx.fillRect(x, y, espessura, altura);
    }

    if (blocoMapa(linha, coluna + 1) === 1) {
        ctx.fillRect(x + largura - espessura, y, espessura, altura);
    }

    ctx.fillStyle = tema.detalhe;
    ctx.globalAlpha = 0.22;

    if (ruido(linha, coluna, 31) > 0.7) {
        ctx.fillRect(x + largura * 0.16, y + altura * 0.16, largura * 0.18, 4);
    }

    ctx.globalAlpha = 1;
}

function desenharObstaculo(x, y, largura, altura, tema, linha, coluna) {
    if (tema.tipoObstaculo === "arvore") {
        desenharArvore(x, y, largura, altura, tema, linha, coluna);
        return;
    }

    if (tema.tipoObstaculo === "cristal") {
        desenharCristal(x, y, largura, altura, tema, linha, coluna);
        return;
    }

    if (tema.tipoObstaculo === "pantano") {
        desenharPantano(x, y, largura, altura, tema, linha, coluna);
        return;
    }

    desenharPedra(x, y, largura, altura, tema, linha, coluna);
}

function desenharArvore(x, y, largura, altura, tema, linha, coluna) {
    ctx.fillStyle = tema.paredeSombra;
    ctx.fillRect(x, y + altura * 0.66, largura, altura * 0.34);

    ctx.fillStyle = "#7c5633";
    ctx.fillRect(x + largura * 0.42, y + altura * 0.5, largura * 0.18, altura * 0.34);

    ctx.fillStyle = "#5d3f25";
    ctx.fillRect(x + largura * 0.44, y + altura * 0.67, largura * 0.14, altura * 0.08);

    const balanco = Math.sin((tempoJogo + linha * 7 + coluna * 5) / 42) * 2;
    desenharElipse(x + largura * 0.48 + balanco, y + altura * 0.38, largura * 0.42, altura * 0.28, tema.parede);
    desenharElipse(x + largura * 0.32 + balanco, y + altura * 0.46, largura * 0.32, altura * 0.24, tema.paredeClara);
    desenharElipse(x + largura * 0.65 + balanco, y + altura * 0.48, largura * 0.34, altura * 0.24, tema.parede);
    desenharElipse(x + largura * 0.5 + balanco, y + altura * 0.25, largura * 0.36, altura * 0.24, tema.paredeClara);

    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(x + largura * 0.22, y + altura * 0.22, largura * 0.16, 4);
}

function desenharCristal(x, y, largura, altura, tema, linha, coluna) {
    ctx.fillStyle = tema.paredeSombra;
    ctx.fillRect(x, y + altura * 0.72, largura, altura * 0.28);

    ctx.fillStyle = tema.parede;
    ctx.fillRect(x + 7, y + 10, largura - 14, altura - 18);

    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.fillRect(x + 7, y + 10, largura - 14, altura * 0.18);

    const deslocamento = ruido(linha, coluna, 3) * largura * 0.2;
    desenharPoligono([
        [x + largura * 0.35 + deslocamento, y + altura * 0.18],
        [x + largura * 0.52 + deslocamento, y + altura * 0.54],
        [x + largura * 0.3 + deslocamento, y + altura * 0.88],
        [x + largura * 0.16 + deslocamento, y + altura * 0.52]
    ], tema.paredeClara);
    desenharPoligono([
        [x + largura * 0.58, y + altura * 0.24],
        [x + largura * 0.78, y + altura * 0.58],
        [x + largura * 0.55, y + altura * 0.82],
        [x + largura * 0.46, y + altura * 0.5]
    ], tema.detalhe);

    ctx.fillStyle = "rgba(255, 255, 255, 0.46)";
    ctx.fillRect(x + largura * 0.61, y + altura * 0.34, 5, altura * 0.28);
}

function desenharPantano(x, y, largura, altura, tema, linha, coluna) {
    ctx.fillStyle = tema.paredeSombra;
    ctx.fillRect(x, y, largura, altura);

    ctx.fillStyle = tema.parede;
    ctx.fillRect(x + 4, y + 6, largura - 8, altura - 12);

    ctx.fillStyle = "rgba(28, 50, 34, 0.24)";
    desenharElipse(x + largura * 0.32, y + altura * 0.42, largura * 0.36, altura * 0.18, "rgba(31, 74, 63, 0.46)");
    desenharElipse(x + largura * 0.7, y + altura * 0.68, largura * 0.28, altura * 0.14, "rgba(31, 74, 63, 0.36)");

    for (let i = 0; i < 5; i++) {
        const baseX = x + 12 + ruido(linha, coluna, i + 40) * (largura - 24);
        const baseY = y + altura * (0.38 + ruido(linha, coluna, i + 45) * 0.42);
        desenharFolha(baseX, baseY, tema.paredeClara, 16 + i * 2);
    }
}

function desenharPedra(x, y, largura, altura, tema, linha, coluna) {
    ctx.fillStyle = tema.paredeSombra;
    ctx.fillRect(x, y + altura * 0.76, largura, altura * 0.24);

    ctx.fillStyle = tema.parede;
    ctx.fillRect(x + 6, y + 6, largura - 12, altura - 12);

    ctx.strokeStyle = tema.paredeSombra;
    ctx.lineWidth = 3;

    for (let i = 1; i < 4; i++) {
        const py = y + (altura / 4) * i + ruido(linha, coluna, i + 55) * 8;
        ctx.beginPath();
        ctx.moveTo(x + 8, py);
        ctx.lineTo(x + largura - 8, py + ruido(linha, coluna, i + 60) * 8);
        ctx.stroke();
    }

    for (let i = 1; i < 4; i++) {
        const px = x + (largura / 4) * i + ruido(linha, coluna, i + 65) * 8;
        ctx.beginPath();
        ctx.moveTo(px, y + 10);
        ctx.lineTo(px - 8, y + altura - 10);
        ctx.stroke();
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    ctx.fillRect(x + 14, y + 12, largura * 0.36, 5);

    if (tema.tipoObstaculo === "santuario") {
        ctx.fillStyle = tema.detalhe;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(x + largura * 0.42, y + altura * 0.18, largura * 0.16, altura * 0.54);
        ctx.fillRect(x + largura * 0.25, y + altura * 0.36, largura * 0.5, altura * 0.12);
        ctx.globalAlpha = 1;
    }
}

function desenharGramaAlta(x, y, largura, altura, tema, linha, coluna) {
    ctx.fillStyle = tema.gramaAlta;
    ctx.fillRect(x, y, largura, altura);

    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.fillRect(x, y, largura, altura * 0.12);

    ctx.fillStyle = "rgba(24, 75, 35, 0.22)";
    ctx.fillRect(x, y + altura * 0.56, largura, altura * 0.18);

    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    ctx.fillRect(x + largura * 0.12, y + altura * 0.22, largura * 0.28, 5);
    ctx.fillRect(x + largura * 0.58, y + altura * 0.34, largura * 0.22, 4);

    for (let i = 0; i < 18; i++) {
        const baseX = x + 8 + ruido(linha, coluna, i + 80) * (largura - 16);
        const baseY = y + altura * (0.38 + ruido(linha, coluna, i + 95) * 0.52);
        const tamanho = 18 + ruido(linha, coluna, i + 110) * 22;
        const inclinacao = Math.sin((tempoJogo + i * 11 + linha * 5) / 22) * 3;

        ctx.strokeStyle = i % 3 === 0 ? tema.gramaAltaClara : "rgba(34, 82, 34, 0.64)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.lineTo(baseX + inclinacao, baseY - tamanho);
        ctx.stroke();
    }
}

function desenharIndicadorEncontro(x, y, largura, altura, tema, linha, coluna) {
    const cx = x + largura * 0.5;
    const cy = y + altura * 0.33 + Math.sin((tempoJogo + linha * 8 + coluna * 3) / 18) * 3;

    desenharElipse(cx, cy + 16, largura * 0.34, altura * 0.08, "rgba(0, 0, 0, 0.22)");

    ctx.fillStyle = "#fff8ef";
    ctx.strokeStyle = tema.moldura;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = tema.destaque;
    ctx.fillRect(cx - 10, cy - 13, 20, 15);

    ctx.fillStyle = tema.moldura;
    ctx.font = "700 20px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("!", cx, cy + 3);
}

function desenharSaida(x, y, largura, altura, tema) {
    const margemX = largura * 0.22;
    const margemY = altura * 0.18;
    const portalX = x + margemX;
    const portalY = y + margemY;
    const portalLargura = largura - margemX * 2;
    const portalAltura = altura - margemY * 2;

    desenharElipse(x + largura / 2, y + altura * 0.78, largura * 0.54, altura * 0.12, "rgba(0, 0, 0, 0.26)");

    ctx.fillStyle = tema.saidaSombra;
    ctx.fillRect(portalX - 5, portalY + 8, portalLargura + 10, portalAltura);

    ctx.fillStyle = tema.saida;
    ctx.fillRect(portalX, portalY, portalLargura, portalAltura);

    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.fillRect(portalX + 8, portalY + 8, portalLargura - 16, 8);
    ctx.fillRect(portalX + portalLargura * 0.42, portalY + 12, 8, portalAltura - 24);

    desenharPoligono([
        [x + largura * 0.45, y + altura * 0.43],
        [x + largura * 0.62, y + altura * 0.5],
        [x + largura * 0.45, y + altura * 0.57]
    ], "#fff8d7");
}

function desenharJogador() {
    const frame = jogador.img[animacao.frame];

    desenharElipse(
        jogador.x + jogador.width / 2,
        jogador.y + jogador.height * 0.84,
        jogador.width * 0.66,
        jogador.height * 0.16,
        "rgba(0, 0, 0, 0.24)"
    );

    if (!frame.complete || frame.naturalWidth === 0) {
        ctx.fillStyle = "#2454c6";
        ctx.fillRect(jogador.x, jogador.y, jogador.width, jogador.height);
        return;
    }

    if (movimento.direcao === "esquerda") {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(frame, -jogador.x - jogador.width, jogador.y, jogador.width, jogador.height);
        ctx.restore();
        return;
    }

    ctx.drawImage(frame, jogador.x, jogador.y, jogador.width, jogador.height);
}

function verificarSaida() {
    const ultimaFase = faseIndex === fases.length - 1;

    if (blocoNoCentroDoJogador() !== 2 || ultimaFase) {
        return;
    }

    faseIndex++;
    mapaAtual = prepararFase(fases[faseIndex], faseIndex);

    const novoSpawn = encontrarTile(3);
    jogador.x = novoSpawn.x;
    jogador.y = novoSpawn.y;
    camera.x = 0;
    camera.y = 0;
    avisoFase = {
        texto: mapaAtual.nome,
        tempo: 150
    };
}

function verificarEncontro(posicaoAnterior) {
    if (estadoJogo !== ESTADO_JOGO.mapa || blocoNoCentroDoJogador() !== 4) {
        return;
    }

    const coluna = Math.floor((jogador.x + jogador.width / 2) / mapaAtual.largura);
    const linha = Math.floor((jogador.y + jogador.height / 2) / mapaAtual.altura);
    iniciarBatalha(linha, coluna, posicaoAnterior);
}

function iniciarBatalha(linha, coluna, posicaoAnterior) {
    const inimigo = criarInimigo(linha, coluna);

    limparControles();
    estadoJogo = ESTADO_JOGO.batalha;
    posicaoAntesDaBatalha = { x: posicaoAnterior.x, y: posicaoAnterior.y };
    batalhaAtual = {
        inimigo,
        linha,
        coluna,
        selecionado: 0,
        mensagens: ["Algo se mexeu na grama!", `Um ${inimigo.nome} selvagem apareceu!`],
        fase: "menu",
        animacaoTurno: null,
        turno: 1,
        resultado: null,
        contadorFim: 0,
        flashJogador: 0,
        flashInimigo: 0,
        tremorJogador: 0,
        tremorInimigo: 0
    };
}

function criarInimigo(linha, coluna) {
    const nivel = faseIndex + 1;
    const variacao = Math.floor(ruido(linha, coluna, 140) * 3);
    let inimigo;

    if (faseIndex >= 4) {
        inimigo = new Drakar({ nivel: nivel + 2 });
        Object.assign(inimigo, {
            nome: "Drakar",
            tipo: "Guardiao Ancestral",
            nivel: nivel + 2,
            ataque: 34 + variacao * 3,
            defesa: 12 + variacao,
            vida: 260 + variacao * 35,
            hpMax: 260 + variacao * 35,
            xpRecompensa: 110 + variacao * 30,
            paleta: ["#d84d3f", "#f2b35a", "#5f2430"]
        });

        return inimigo;
    }

    if (faseIndex >= 2) {
        inimigo = new Esqueleto({ nivel: nivel + variacao });
        Object.assign(inimigo, {
            nome: variacao === 2 ? "Sentinela" : "Esqueleto",
            tipo: faseIndex === 2 ? "Pantano" : "Fortaleza",
            nivel: nivel + variacao,
            ataque: 23 + nivel * 4 + variacao * 2,
            defesa: 7 + nivel + variacao,
            vida: 130 + nivel * 22 + variacao * 18,
            hpMax: 130 + nivel * 22 + variacao * 18,
            xpRecompensa: 65 + nivel * 15 + variacao * 12,
            paleta: ["#e8e0bd", "#8c8d95", "#3f4047"]
        });

        return inimigo;
    }

    inimigo = new Goblin({ nivel: nivel + variacao });
    Object.assign(inimigo, {
        nome: variacao === 2 ? "Goblin Alfa" : "Goblin",
        tipo: faseIndex === 0 ? "Floresta" : "Cristal",
        nivel: nivel + variacao,
        ataque: 16 + nivel * 3 + variacao * 2,
        defesa: 4 + nivel + variacao,
        vida: 90 + nivel * 18 + variacao * 14,
        hpMax: 90 + nivel * 18 + variacao * 14,
        xpRecompensa: 35 + nivel * 12 + variacao * 8,
        paleta: faseIndex === 0
            ? ["#63b74f", "#e2cf67", "#2f6338"]
            : ["#66d0d8", "#d6f7ff", "#3c6984"]
    });

    return inimigo;
}

function atualizarBatalha() {
    if (!batalhaAtual) {
        return;
    }

    batalhaAtual.flashJogador = Math.max(0, batalhaAtual.flashJogador - 1);
    batalhaAtual.flashInimigo = Math.max(0, batalhaAtual.flashInimigo - 1);
    batalhaAtual.tremorJogador = Math.max(0, batalhaAtual.tremorJogador - 1);
    batalhaAtual.tremorInimigo = Math.max(0, batalhaAtual.tremorInimigo - 1);

    atualizarAnimacaoTurno();

    if (batalhaAtual.resultado) {
        batalhaAtual.contadorFim--;

        if (batalhaAtual.contadorFim <= 0) {
            retornarDaBatalha();
        }
    }
}

function controlarBatalhaPorTecla(tecla) {
    if (!batalhaAtual || batalhaAtual.resultado || batalhaAtual.fase !== "menu") {
        return;
    }

    const teclaNormalizada = tecla.toLowerCase();

    if (teclaNormalizada === "arrowleft" || teclaNormalizada === "a") {
        batalhaAtual.selecionado = batalhaAtual.selecionado % 2 === 0
            ? batalhaAtual.selecionado + 1
            : batalhaAtual.selecionado - 1;
        return;
    }

    if (teclaNormalizada === "arrowright" || teclaNormalizada === "d") {
        batalhaAtual.selecionado = batalhaAtual.selecionado % 2 === 0
            ? batalhaAtual.selecionado + 1
            : batalhaAtual.selecionado - 1;
        return;
    }

    if (teclaNormalizada === "arrowup" || teclaNormalizada === "w") {
        batalhaAtual.selecionado = batalhaAtual.selecionado < 2
            ? batalhaAtual.selecionado + 2
            : batalhaAtual.selecionado - 2;
        return;
    }

    if (teclaNormalizada === "arrowdown" || teclaNormalizada === "s") {
        batalhaAtual.selecionado = batalhaAtual.selecionado < 2
            ? batalhaAtual.selecionado + 2
            : batalhaAtual.selecionado - 2;
        return;
    }

    if (teclaNormalizada === "enter" || teclaNormalizada === " ") {
        executarAcaoBatalha();
        return;
    }

    if (teclaNormalizada === "escape") {
        batalhaAtual.selecionado = 3;
        executarAcaoBatalha();
    }
}

function teclaDaBatalha(tecla) {
    return ["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "d", "w", "s", "enter", " ", "escape"]
        .includes(tecla.toLowerCase());
}

function selecionarBatalhaPorToque(event) {
    if (
        estadoJogo !== ESTADO_JOGO.batalha ||
        !batalhaAtual ||
        batalhaAtual.resultado ||
        batalhaAtual.fase !== "menu"
    ) {
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    const opcao = obterAreasMenuBatalha().findIndex((area) =>
        x >= area.x && x <= area.x + area.largura && y >= area.y && y <= area.y + area.altura
    );

    if (opcao === -1) {
        return;
    }

    event.preventDefault();
    batalhaAtual.selecionado = opcao;
    executarAcaoBatalha();
}

function executarAcaoBatalha() {
    if (!batalhaAtual || batalhaAtual.resultado || batalhaAtual.fase !== "menu") {
        return;
    }

    const opcao = OPCOES_BATALHA[batalhaAtual.selecionado];

    if (opcao === "ATACAR") {
        ataqueDoJogador("Cajado", calcularDanoJogador("ataque"));
        return;
    }

    if (opcao === "MAGIA") {
        ataqueDoJogador("Chama Arcana", calcularDanoJogador("magia"));
        return;
    }

    if (opcao === "BOLSA") {
        usarPocao();
        return;
    }

    tentarFugir();
}

function ataqueDoJogador(nomeAtaque, dano) {
    iniciarAnimacaoAtaque({
        atacante: "jogador",
        alvo: "inimigo",
        dano,
        mensagemInicio: `${jogador.nome} usou ${nomeAtaque}!`,
        mensagemDano: (danoFinal) => `${batalhaAtual.inimigo.nome} perdeu ${danoFinal} HP.`,
        aoFim: () => {
            if (!batalhaAtual.inimigo.estaVivo()) {
                finalizarBatalha("vitoria");
                return;
            }

            turnoDoInimigo();
        }
    });
}

function turnoDoInimigo() {
    const inimigo = batalhaAtual.inimigo;
    const dano = calcularDanoInimigo();

    iniciarAnimacaoAtaque({
        atacante: "inimigo",
        alvo: "jogador",
        dano,
        mensagemInicio: `${inimigo.nome} contra-atacou!`,
        mensagemDano: (danoFinal) => `${jogador.nome} perdeu ${danoFinal} HP.`,
        aoFim: () => {
            batalhaAtual.turno++;

            if (!jogador.estaVivo()) {
                finalizarBatalha("derrota");
                return;
            }

            batalhaAtual.fase = "menu";
            registrarMensagem("Escolha o proximo movimento.");
        }
    });
}

function usarPocao() {
    if (inventario.pocoes <= 0) {
        registrarMensagem("A bolsa esta vazia.", "Escolha outro comando.");
        return;
    }

    if (jogador.vida >= jogador.hpMax) {
        registrarMensagem(`${jogador.nome} ja esta com HP cheio.`, "A pocao ficou guardada.");
        return;
    }

    inventario.pocoes--;
    const antes = jogador.vida;
    jogador.vida = Math.min(jogador.hpMax, jogador.vida + 65);
    registrarMensagem(`${jogador.nome} usou Pocao.`, `Recuperou ${jogador.vida - antes} HP.`);
    esperarNaBatalha(28, turnoDoInimigo);
}

function tentarFugir() {
    const inimigo = batalhaAtual.inimigo;
    const chance = inimigo.nome === "Drakar" ? 0.35 : 0.72;

    if (Math.random() < chance) {
        registrarMensagem(`${jogador.nome} fugiu da batalha.`, "O inimigo ficou para tras.");
        finalizarBatalha("fuga");
        return;
    }

    registrarMensagem("A fuga falhou!", `${inimigo.nome} bloqueou o caminho.`);
    esperarNaBatalha(28, turnoDoInimigo);
}

function iniciarAnimacaoAtaque({ atacante, alvo, dano, mensagemInicio, mensagemDano, aoFim }) {
    batalhaAtual.fase = "animando";
    batalhaAtual.animacaoTurno = {
        atacante,
        alvo,
        dano,
        mensagemInicio,
        mensagemDano,
        aoFim,
        tempo: 0,
        duracao: 54,
        danoAplicado: false
    };

    registrarMensagem(mensagemInicio);
}

function esperarNaBatalha(duracao, aoFim) {
    batalhaAtual.fase = "animando";
    batalhaAtual.animacaoTurno = {
        atacante: null,
        alvo: null,
        dano: 0,
        aoFim,
        tempo: 0,
        duracao,
        danoAplicado: true
    };
}

function atualizarAnimacaoTurno() {
    const animacaoTurno = batalhaAtual.animacaoTurno;

    if (!animacaoTurno) {
        return;
    }

    animacaoTurno.tempo++;

    if (!animacaoTurno.danoAplicado && animacaoTurno.tempo >= 24) {
        const alvo = animacaoTurno.alvo === "inimigo" ? batalhaAtual.inimigo : jogador;
        const danoFinal = aplicarDano(alvo, animacaoTurno.dano);

        animacaoTurno.danoAplicado = true;

        if (animacaoTurno.alvo === "inimigo") {
            batalhaAtual.flashInimigo = 14;
            batalhaAtual.tremorInimigo = 14;
        } else {
            batalhaAtual.flashJogador = 14;
            batalhaAtual.tremorJogador = 14;
        }

        if (animacaoTurno.mensagemDano) {
            registrarMensagem(animacaoTurno.mensagemDano(danoFinal));
        }
    }

    if (animacaoTurno.tempo < animacaoTurno.duracao) {
        return;
    }

    const aoFim = animacaoTurno.aoFim;
    batalhaAtual.animacaoTurno = null;

    if (aoFim) {
        aoFim();
    }
}

function finalizarBatalha(resultado) {
    if (batalhaAtual.resultado) {
        return;
    }

    batalhaAtual.resultado = resultado;
    batalhaAtual.fase = "fim";
    batalhaAtual.contadorFim = 110;

    if (resultado === "vitoria") {
        const xp = batalhaAtual.inimigo.xpRecompensa;
        const nivelAnterior = jogador.nivel;
        registrarMensagem(`${batalhaAtual.inimigo.nome} foi derrotado!`, `${jogador.nome} recebeu ${xp} XP.`);
        jogador.ganharXp(xp);

        if (jogador.nivel > nivelAnterior) {
            registrarMensagem(`${jogador.nome} subiu para Nv. ${jogador.nivel}!`);
        }

        return;
    }

    if (resultado === "derrota") {
        registrarMensagem(`${jogador.nome} ficou sem HP.`, "Voltando para a entrada.");
        return;
    }

    registrarMensagem("Batalha encerrada.", "De volta ao mapa.");
}

function retornarDaBatalha() {
    const resultado = batalhaAtual.resultado;

    if (resultado === "vitoria") {
        mapaAtual.mapa[batalhaAtual.linha][batalhaAtual.coluna] = 0;
        mapaAtual.encontrosRestantes = Math.max(0, (mapaAtual.encontrosRestantes || 1) - 1);
        avisoFase = {
            texto: `${batalhaAtual.inimigo.nome} derrotado`,
            tempo: 120
        };
    }

    if (resultado === "fuga" && posicaoAntesDaBatalha) {
        jogador.x = posicaoAntesDaBatalha.x;
        jogador.y = posicaoAntesDaBatalha.y;
        avisoFase = {
            texto: "Fuga bem-sucedida",
            tempo: 90
        };
    }

    if (resultado === "derrota") {
        const spawnAtual = encontrarTile(3);
        jogador.x = spawnAtual.x;
        jogador.y = spawnAtual.y;
        jogador.vida = jogador.hpMax;
        avisoFase = {
            texto: "HP recuperado",
            tempo: 120
        };
    }

    batalhaAtual = null;
    posicaoAntesDaBatalha = null;
    estadoJogo = ESTADO_JOGO.mapa;
    limparControles();
    atualizarCamera();
}

function calcularDanoJogador(tipo) {
    const inimigo = batalhaAtual.inimigo;
    const variacao = 0.88 + Math.random() * 0.24;

    if (tipo === "magia") {
        return Math.max(12, Math.round((jogador.magia * 0.22 + jogador.nivel * 8) * variacao - inimigo.defesa));
    }

    return Math.max(8, Math.round((28 + (jogador.ataque || 8) + jogador.nivel * 8) * variacao - inimigo.defesa));
}

function calcularDanoInimigo() {
    const inimigo = batalhaAtual.inimigo;
    const variacao = 0.86 + Math.random() * 0.2;
    return Math.max(4, Math.round((inimigo.ataque + inimigo.nivel * 2) * variacao - jogador.defesa));
}

function aplicarDano(alvo, dano) {
    const danoFinal = Math.max(0, Math.round(dano));
    alvo.vida = Math.max(0, alvo.vida - danoFinal);
    return danoFinal;
}

function registrarMensagem(...mensagens) {
    batalhaAtual.mensagens.push(...mensagens);
    batalhaAtual.mensagens = batalhaAtual.mensagens.slice(-4);
}

function desenharBatalha() {
    const tema = temaAtual();
    const inimigo = batalhaAtual.inimigo;

    desenharFundoBatalha(tema);
    desenharPlataformaBatalha(466, 177, 250, 72, tema, false);
    desenharPlataformaBatalha(172, 332, 292, 82, tema, true);
    desenharInimigoBatalha(inimigo, 466, 128);
    desenharJogadorBatalha();
    desenharStatusBatalha(24, 24, 254, 76, inimigo.nome, inimigo.nivel, inimigo.vida, inimigo.hpMax, tema);
    desenharStatusBatalha(362, 250, 254, 86, jogador.nome, jogador.nivel, jogador.vida, jogador.hpMax, tema);
    desenharPainelBatalha(tema);
}

function desenharFundoBatalha(tema) {
    const ceu = ctx.createLinearGradient(0, 0, 0, canvas.height);
    ceu.addColorStop(0, tema.caminhoClaro);
    ceu.addColorStop(0.42, tema.chao);
    ceu.addColorStop(0.43, tema.gramaAlta);
    ceu.addColorStop(1, tema.fundo);

    ctx.fillStyle = ceu;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(0, 0, canvas.width, 70);

    ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
    ctx.fillRect(0, 190, canvas.width, 22);

    for (let i = 0; i < 30; i++) {
        const x = Math.floor(ruido(i, faseIndex, 210) * canvas.width);
        const y = 210 + Math.floor(ruido(i, faseIndex, 220) * 130);
        const largura = 18 + Math.floor(ruido(i, faseIndex, 230) * 28);

        ctx.fillStyle = i % 2 === 0 ? "rgba(255, 255, 255, 0.16)" : "rgba(35, 88, 45, 0.18)";
        ctx.fillRect(x, y, largura, 4);
    }
}

function desenharPlataformaBatalha(x, y, largura, altura, tema, grande) {
    desenharElipse(x, y + 10, largura, altura, "rgba(0, 0, 0, 0.22)");
    desenharElipse(x, y, largura, altura, tema.caminho);
    desenharElipse(x, y - 8, largura * 0.86, altura * 0.48, tema.caminhoClaro);

    ctx.fillStyle = tema.caminhoSombra;
    ctx.globalAlpha = 0.34;
    ctx.fillRect(x - largura * 0.42, y + altura * 0.02, largura * 0.84, grande ? 12 : 8);
    ctx.globalAlpha = 1;
}

function desenharInimigoBatalha(inimigo, x, y) {
    const tremor = batalhaAtual.tremorInimigo > 0 ? Math.sin(tempoJogo * 1.8) * 5 : 0;
    const salto = Math.sin(tempoJogo / 24) * 3;
    const deslocamento = deslocamentoAtaque("inimigo");
    const paleta = inimigo.paleta || ["#63b74f", "#e2cf67", "#2f6338"];

    ctx.save();
    ctx.translate(x + tremor + deslocamento.x, y + salto + deslocamento.y);

    if (inimigo.nome === "Drakar") {
        desenharDrakarBatalha(paleta);
    } else if (inimigo.nome === "Esqueleto" || inimigo.nome === "Sentinela") {
        desenharEsqueletoBatalha(paleta);
    } else {
        desenharGoblinBatalha(paleta);
    }

    if (batalhaAtual.flashInimigo > 0) {
        ctx.globalAlpha = 0.42;
        desenharElipse(0, 8, 96, 104, "#ffffff");
    }

    ctx.restore();
}

function desenharGoblinBatalha(paleta) {
    desenharPoligono([
        [-48, -22],
        [-78, -42],
        [-52, -4]
    ], paleta[2]);
    desenharPoligono([
        [48, -22],
        [78, -42],
        [52, -4]
    ], paleta[2]);
    desenharElipse(0, 18, 78, 72, paleta[0]);
    desenharElipse(0, -28, 72, 58, paleta[0]);
    desenharElipse(-18, -34, 14, 18, "#fff8de");
    desenharElipse(18, -34, 14, 18, "#fff8de");
    desenharElipse(-18, -34, 6, 10, "#1e2430");
    desenharElipse(18, -34, 6, 10, "#1e2430");
    ctx.fillStyle = paleta[1];
    ctx.fillRect(-28, -4, 56, 9);
    ctx.fillStyle = paleta[2];
    ctx.fillRect(-18, 30, 14, 30);
    ctx.fillRect(8, 30, 14, 30);
}

function desenharEsqueletoBatalha(paleta) {
    desenharElipse(0, -35, 66, 58, paleta[0]);
    ctx.fillStyle = paleta[2];
    ctx.fillRect(-30, -2, 60, 76);
    ctx.fillStyle = paleta[0];
    ctx.fillRect(-23, 2, 46, 58);

    ctx.strokeStyle = paleta[2];
    ctx.lineWidth = 5;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-24, 14 + i * 10);
        ctx.lineTo(24, 14 + i * 10);
        ctx.stroke();
    }

    desenharElipse(-17, -40, 12, 14, "#252833");
    desenharElipse(17, -40, 12, 14, "#252833");
    ctx.fillStyle = paleta[1];
    ctx.fillRect(-10, -24, 20, 5);
    ctx.fillStyle = paleta[2];
    ctx.fillRect(-43, 20, 18, 12);
    ctx.fillRect(25, 20, 18, 12);
    ctx.fillRect(-20, 64, 13, 26);
    ctx.fillRect(7, 64, 13, 26);
}

function desenharDrakarBatalha(paleta) {
    desenharPoligono([
        [-16, -18],
        [-92, -58],
        [-68, 20]
    ], paleta[2]);
    desenharPoligono([
        [16, -18],
        [92, -58],
        [68, 20]
    ], paleta[2]);
    desenharPoligono([
        [-48, -62],
        [-34, -94],
        [-20, -62]
    ], paleta[1]);
    desenharPoligono([
        [48, -62],
        [34, -94],
        [20, -62]
    ], paleta[1]);
    desenharElipse(0, 10, 92, 82, paleta[0]);
    desenharElipse(0, -48, 82, 66, paleta[0]);
    desenharElipse(-22, -55, 14, 16, "#fff8de");
    desenharElipse(22, -55, 14, 16, "#fff8de");
    desenharElipse(-22, -55, 6, 10, "#1e2430");
    desenharElipse(22, -55, 6, 10, "#1e2430");
    ctx.fillStyle = paleta[1];
    ctx.fillRect(-28, -22, 56, 9);
    ctx.fillStyle = paleta[2];
    ctx.fillRect(-28, 44, 16, 30);
    ctx.fillRect(12, 44, 16, 30);
}

function desenharJogadorBatalha() {
    const frame = jogador.img[animacao.frame];
    const tremor = batalhaAtual.tremorJogador > 0 ? Math.sin(tempoJogo * 1.9) * 5 : 0;
    const deslocamento = deslocamentoAtaque("jogador");
    const x = 108 + tremor + deslocamento.x;
    const y = 230 + deslocamento.y;
    const largura = 130;
    const altura = 130;

    desenharElipse(x + largura * 0.48, y + altura * 0.84, largura * 0.56, altura * 0.12, "rgba(0, 0, 0, 0.24)");

    if (!frame.complete || frame.naturalWidth === 0) {
        ctx.fillStyle = "#2454c6";
        ctx.fillRect(x, y, largura, altura);
    } else {
        ctx.drawImage(frame, x, y, largura, altura);
    }

    if (batalhaAtual.flashJogador > 0) {
        ctx.globalAlpha = 0.38;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + 12, y + 8, largura - 24, altura - 10);
        ctx.globalAlpha = 1;
    }
}

function deslocamentoAtaque(tipo) {
    const animacaoTurno = batalhaAtual?.animacaoTurno;

    if (!animacaoTurno || animacaoTurno.atacante !== tipo) {
        return { x: 0, y: 0 };
    }

    const progresso = progressoAtaque(animacaoTurno.tempo, animacaoTurno.duracao);
    const direcao = tipo === "jogador" ? 1 : -1;

    return {
        x: direcao * 78 * progresso,
        y: (tipo === "jogador" ? -24 : 30) * progresso
    };
}

function progressoAtaque(tempo, duracao) {
    const t = limitar(tempo / duracao, 0, 1);

    if (t < 0.42) {
        return easeOutCubic(t / 0.42);
    }

    if (t < 0.62) {
        return 1;
    }

    return 1 - easeInCubic((t - 0.62) / 0.38);
}

function easeOutCubic(valor) {
    return 1 - Math.pow(1 - valor, 3);
}

function easeInCubic(valor) {
    return valor * valor * valor;
}

function desenharStatusBatalha(x, y, largura, altura, nome, nivel, vida, hpMax, tema) {
    desenharJanela(x, y, largura, altura, tema);

    ctx.fillStyle = tema.texto;
    ctx.font = "700 17px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(textoCurto(nome, 15), x + 18, y + 25);

    ctx.font = "700 14px Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`Nv. ${nivel}`, x + largura - 20, y + 25);

    desenharBarra(x + 20, y + 46, largura - 40, 13, vida / hpMax, "#43b75d", "#f1d253", "#dc4b4b");

    ctx.fillStyle = tema.texto;
    ctx.font = "700 12px Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${Math.max(0, vida)} / ${hpMax}`, x + largura - 20, y + altura - 16);
}

function desenharPainelBatalha(tema) {
    const layout = obterLayoutBatalha();
    desenharJanela(layout.mensagem.x, layout.mensagem.y, layout.mensagem.largura, layout.mensagem.altura, tema);
    desenharJanela(layout.menu.x, layout.menu.y, layout.menu.largura, layout.menu.altura, tema);

    const linhas = linhasMensagemBatalha();
    ctx.fillStyle = tema.texto;
    ctx.font = "700 16px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    linhas.forEach((linha, index) => {
        ctx.fillText(linha, layout.mensagem.x + 22, layout.mensagem.y + 28 + index * 22);
    });

    obterAreasMenuBatalha().forEach((area, index) => {
        const selecionado = index === batalhaAtual.selecionado;
        const label = OPCOES_BATALHA[index] === "BOLSA"
            ? `BOLSA x${inventario.pocoes}`
            : OPCOES_BATALHA[index];

        ctx.fillStyle = selecionado ? tema.destaque : "#fffaf0";
        desenharRetanguloArredondado(area.x, area.y, area.largura, area.altura, 6);
        ctx.strokeStyle = selecionado ? tema.moldura : tema.hudSombra;
        ctx.lineWidth = selecionado ? 4 : 2;
        contornarRetanguloArredondado(area.x + 1, area.y + 1, area.largura - 2, area.altura - 2, 5);

        ctx.fillStyle = selecionado ? "#fffaf0" : tema.texto;
        ctx.font = "700 14px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, area.x + area.largura / 2, area.y + area.altura / 2 + 1);
    });
}

function obterLayoutBatalha() {
    const y = canvas.height - 118;
    return {
        mensagem: { x: 16, y, largura: 344, altura: 102 },
        menu: { x: 374, y, largura: 250, altura: 102 }
    };
}

function obterAreasMenuBatalha() {
    const layout = obterLayoutBatalha().menu;
    const margem = 14;
    const gap = 10;
    const largura = (layout.largura - margem * 2 - gap) / 2;
    const altura = 32;
    const topo = layout.y + 17;

    return OPCOES_BATALHA.map((_, index) => ({
        x: layout.x + margem + (index % 2) * (largura + gap),
        y: topo + Math.floor(index / 2) * (altura + 10),
        largura,
        altura
    }));
}

function linhasMensagemBatalha() {
    const linhas = [];

    batalhaAtual.mensagens.slice(-3).forEach((mensagem) => {
        linhas.push(...quebrarTexto(mensagem, 34));
    });

    return linhas.slice(-3);
}

function quebrarTexto(texto, limite) {
    const palavras = texto.split(" ");
    const linhas = [];
    let linhaAtual = "";

    palavras.forEach((palavra) => {
        const tentativa = linhaAtual ? `${linhaAtual} ${palavra}` : palavra;

        if (tentativa.length > limite && linhaAtual) {
            linhas.push(linhaAtual);
            linhaAtual = palavra;
            return;
        }

        linhaAtual = tentativa;
    });

    if (linhaAtual) {
        linhas.push(linhaAtual);
    }

    return linhas;
}

function textoCurto(texto, limite) {
    return texto.length > limite ? `${texto.slice(0, limite - 1)}.` : texto;
}

function desenharHud() {
    const tema = temaAtual();

    ctx.save();
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.font = "700 16px Arial, sans-serif";

    desenharJanela(16, 16, 226, 58, tema);

    ctx.fillStyle = tema.destaque;
    desenharRetanguloArredondado(28, 28, 42, 34, 8);

    ctx.fillStyle = "#fffaf0";
    ctx.font = "700 14px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${faseIndex + 1}/${fases.length}`, 49, 46);

    ctx.fillStyle = tema.texto;
    ctx.font = "700 17px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(mapaAtual.nome.toUpperCase(), 82, 46);

    const statusLargura = 214;
    const statusX = canvas.width - statusLargura - 16;
    desenharJanela(statusX, 16, statusLargura, 78, tema);

    ctx.fillStyle = tema.texto;
    ctx.font = "700 16px Arial, sans-serif";
    ctx.fillText(jogador.nome, statusX + 18, 38);
    ctx.font = "700 14px Arial, sans-serif";
    ctx.fillText(`Nv. ${jogador.nivel}`, statusX + statusLargura - 66, 38);

    desenharBarra(statusX + 18, 54, statusLargura - 36, 12, jogador.vida / jogador.hpMax, "#43b75d", "#f1d253", "#dc4b4b");
    desenharBarra(statusX + 18, 72, statusLargura - 36, 7, jogador.xp / jogador.xpProximoNivel, "#4aa4e8", "#4aa4e8", "#4aa4e8");

    desenharAvisoFase(tema);
    ctx.restore();
}

function desenharAvisoFase(tema) {
    if (avisoFase.tempo <= 0) {
        return;
    }

    const entrada = Math.min(1, (150 - avisoFase.tempo) / 18);
    const saida = Math.min(1, avisoFase.tempo / 28);
    const alpha = Math.min(entrada, saida);
    const largura = Math.min(canvas.width - 48, 360);
    const x = (canvas.width - largura) / 2;
    const y = canvas.height - 74;

    ctx.save();
    ctx.globalAlpha = alpha;
    desenharJanela(x, y, largura, 48, tema);
    ctx.fillStyle = tema.texto;
    ctx.font = "700 16px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Agora em ${avisoFase.texto}`, canvas.width / 2, y + 26);
    ctx.restore();
}

function desenharBarra(x, y, largura, altura, porcentagem, corAlta, corMedia, corBaixa) {
    const valor = limitar(porcentagem, 0, 1);
    const cor = valor > 0.5 ? corAlta : valor > 0.25 ? corMedia : corBaixa;

    ctx.fillStyle = "#222733";
    desenharRetanguloArredondado(x, y, largura, altura, altura / 2);

    ctx.fillStyle = "#d8dde8";
    desenharRetanguloArredondado(x + 2, y + 2, largura - 4, altura - 4, altura / 2);

    ctx.fillStyle = cor;
    desenharRetanguloArredondado(x + 2, y + 2, Math.max(0, (largura - 4) * valor), altura - 4, altura / 2);
}

function desenharJanela(x, y, largura, altura, tema) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    desenharRetanguloArredondado(x + 4, y + 5, largura, altura, 8);

    ctx.fillStyle = tema.hud;
    desenharRetanguloArredondado(x, y, largura, altura, 8);

    ctx.strokeStyle = tema.moldura;
    ctx.lineWidth = 4;
    contornarRetanguloArredondado(x + 2, y + 2, largura - 4, altura - 4, 7);

    ctx.strokeStyle = tema.hudSombra;
    ctx.lineWidth = 3;
    contornarRetanguloArredondado(x + 8, y + 8, largura - 16, altura - 16, 4);
}

function desenharRetanguloArredondado(x, y, largura, altura, raio) {
    ctx.beginPath();
    ctx.moveTo(x + raio, y);
    ctx.lineTo(x + largura - raio, y);
    ctx.quadraticCurveTo(x + largura, y, x + largura, y + raio);
    ctx.lineTo(x + largura, y + altura - raio);
    ctx.quadraticCurveTo(x + largura, y + altura, x + largura - raio, y + altura);
    ctx.lineTo(x + raio, y + altura);
    ctx.quadraticCurveTo(x, y + altura, x, y + altura - raio);
    ctx.lineTo(x, y + raio);
    ctx.quadraticCurveTo(x, y, x + raio, y);
    ctx.fill();
}

function contornarRetanguloArredondado(x, y, largura, altura, raio) {
    ctx.beginPath();
    ctx.moveTo(x + raio, y);
    ctx.lineTo(x + largura - raio, y);
    ctx.quadraticCurveTo(x + largura, y, x + largura, y + raio);
    ctx.lineTo(x + largura, y + altura - raio);
    ctx.quadraticCurveTo(x + largura, y + altura, x + largura - raio, y + altura);
    ctx.lineTo(x + raio, y + altura);
    ctx.quadraticCurveTo(x, y + altura, x, y + altura - raio);
    ctx.lineTo(x, y + raio);
    ctx.quadraticCurveTo(x, y, x + raio, y);
    ctx.stroke();
}

function desenharElipse(x, y, largura, altura, cor) {
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.ellipse(x, y, largura / 2, altura / 2, 0, 0, Math.PI * 2);
    ctx.fill();
}

function desenharFolha(x, y, cor, tamanho) {
    ctx.strokeStyle = cor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - tamanho * 0.25, y - tamanho);
    ctx.moveTo(x, y);
    ctx.lineTo(x + tamanho * 0.25, y - tamanho * 0.9);
    ctx.stroke();
}

function desenharPoligono(pontos, cor) {
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.moveTo(pontos[0][0], pontos[0][1]);

    for (let i = 1; i < pontos.length; i++) {
        ctx.lineTo(pontos[i][0], pontos[i][1]);
    }

    ctx.closePath();
    ctx.fill();
}

function temColisao(x, y) {
    const margem = 7;
    const pontos = [
        [x + margem, y + margem],
        [x + jogador.width - margem, y + margem],
        [x + margem, y + jogador.height - margem],
        [x + jogador.width - margem, y + jogador.height - margem]
    ];

    return pontos.some(([pontoX, pontoY]) => blocoNaPosicao(pontoX, pontoY) === 1);
}

function blocoNoCentroDoJogador() {
    return blocoNaPosicao(jogador.x + jogador.width / 2, jogador.y + jogador.height / 2);
}

function blocoNaPosicao(x, y) {
    const coluna = Math.floor(x / mapaAtual.largura);
    const linha = Math.floor(y / mapaAtual.altura);

    return mapaAtual.mapa[linha]?.[coluna] ?? 1;
}

function blocoMapa(linha, coluna) {
    return mapaAtual.mapa[linha]?.[coluna] ?? 1;
}

function prepararFase(fase, indice) {
    const mapa = fase.mapa.map((linha) =>
        linha.map((bloco) => bloco === 4 ? 0 : bloco)
    );
    const spawnFase = localizarTileNoMapa(mapa, 3);
    const saidaFase = localizarTileNoMapa(mapa, 2);
    const candidatos = [];

    for (let linha = 0; linha < mapa.length; linha++) {
        for (let coluna = 0; coluna < mapa[linha].length; coluna++) {
            if (mapa[linha][coluna] !== 0) {
                continue;
            }

            if (spawnFase && distanciaTiles(linha, coluna, spawnFase.linha, spawnFase.coluna) < ENCONTROS.distanciaDoSpawn) {
                continue;
            }

            if (saidaFase && distanciaTiles(linha, coluna, saidaFase.linha, saidaFase.coluna) < ENCONTROS.distanciaDaSaida) {
                continue;
            }

            candidatos.push({ linha, coluna });
        }
    }

    const encontros = [];
    const quantidade = calcularQuantidadeEncontros(candidatos.length, indice);

    embaralhar(candidatos).some((candidato) => {
        const pertoDeOutro = encontros.some((encontro) =>
            distanciaTiles(candidato.linha, candidato.coluna, encontro.linha, encontro.coluna) < ENCONTROS.distanciaEntreEncontros
        );

        if (!pertoDeOutro) {
            mapa[candidato.linha][candidato.coluna] = 4;
            encontros.push(candidato);
        }

        return encontros.length >= quantidade;
    });

    return {
        ...fase,
        mapa,
        encontrosRestantes: encontros.length
    };
}

function localizarTileNoMapa(mapa, tipo) {
    for (let linha = 0; linha < mapa.length; linha++) {
        for (let coluna = 0; coluna < mapa[linha].length; coluna++) {
            if (mapa[linha][coluna] === tipo) {
                return { linha, coluna };
            }
        }
    }

    return null;
}

function calcularQuantidadeEncontros(totalCandidatos, indice) {
    const pelaFase = ENCONTROS.minimoPorFase + indice * 5;
    const peloMapa = Math.floor(totalCandidatos * 0.09);
    return Math.min(ENCONTROS.maximoPorFase, Math.max(pelaFase, peloMapa));
}

function embaralhar(lista) {
    const copia = [...lista];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

function distanciaTiles(linhaA, colunaA, linhaB, colunaB) {
    return Math.abs(linhaA - linhaB) + Math.abs(colunaA - colunaB);
}

function encontrarTile(tipo) {
    for (let linha = 0; linha < mapaAtual.mapa.length; linha++) {
        for (let coluna = 0; coluna < mapaAtual.mapa[linha].length; coluna++) {
            if (mapaAtual.mapa[linha][coluna] === tipo) {
                return {
                    x: coluna * mapaAtual.largura,
                    y: linha * mapaAtual.altura
                };
            }
        }
    }

    return { x: 0, y: 0 };
}

function larguraMapa() {
    return mapaAtual.mapa[0].length * mapaAtual.largura;
}

function alturaMapa() {
    return mapaAtual.mapa.length * mapaAtual.altura;
}

function temaAtual() {
    return TEMAS[mapaAtual.id] || TEMAS.floresta;
}

function ruido(linha, coluna, salt = 0) {
    const valor = Math.sin(linha * 12.9898 + coluna * 78.233 + salt * 37.719) * 43758.5453;
    return valor - Math.floor(valor);
}

function limitar(valor, minimo, maximo) {
    if (maximo < minimo) {
        return minimo;
    }

    return Math.min(Math.max(valor, minimo), maximo);
}
