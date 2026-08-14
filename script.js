import { Mage } from "./src/Classes/herois/Mage.js";
import { MovimentoMage } from "./src/movimentos/herois/MoveMage.js";
import { floresta } from "./src/Mapas/world-1/Fases-1.js";
import { cavernaCristalina } from "./src/Mapas/world-1/Fases-2.js";
import { pantanoProfundo } from "./src/Mapas/world-1/Fases-3.js";
import { fortalezaAntiga } from "./src/Mapas/world-1/Fases-4.js";
import { santuarioCentral } from "./src/Mapas/world-1/Fases-5.js";

const fases = [
    floresta,
    cavernaCristalina,
    pantanoProfundo,
    fortalezaAntiga,
    santuarioCentral
];

let faseAtualIndex = 0;
let mapaAtual = fases[faseAtualIndex];

// ================================
// Canvas
// ================================

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const camera = {
    x: 0,
    y: 0,
    width: Math.min(640, obterLarguraMapa()),
    height: Math.min(480, obterAlturaMapa())
};

canvas.width = camera.width;
canvas.height = camera.height;
ctx.imageSmoothingEnabled = false;

// ================================
// Jogador
// ================================

const movimentoMage = new MovimentoMage();
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
    acao: "parado",
    img: movimentoMage.parado()
});

// ================================
// Controles
// ================================

const teclasPressionadas = {};

window.addEventListener("keydown", (event) => {
    const tecla = event.key.toLowerCase();

    definirTecla(tecla, true);

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }
});

window.addEventListener("keyup", (event) => {
    const tecla = event.key.toLowerCase();

    definirTecla(tecla, false);
});

document.querySelectorAll("[data-key]").forEach((botao) => {
    const tecla = botao.dataset.key;

    botao.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        botao.setPointerCapture(event.pointerId);
        definirTecla(tecla, true);
        botao.classList.add("is-pressed");
    });

    botao.addEventListener("pointerup", (event) => {
        event.preventDefault();
        soltarBotao(botao, tecla);
    });

    botao.addEventListener("pointercancel", () => {
        soltarBotao(botao, tecla);
    });

    botao.addEventListener("lostpointercapture", () => {
        soltarBotao(botao, tecla);
    });
});

window.addEventListener("blur", limparControles);

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        limparControles();
    }
});

function definirTecla(tecla, pressionada) {
    teclasPressionadas[tecla] = pressionada;
}

function soltarBotao(botao, tecla) {
    definirTecla(tecla, false);
    botao.classList.remove("is-pressed");
}

function limparControles() {
    Object.keys(teclasPressionadas).forEach((tecla) => {
        teclasPressionadas[tecla] = false;
    });

    document.querySelectorAll(".control-button").forEach((botao) => {
        botao.classList.remove("is-pressed");
    });
}

// ================================
// Animacao
// ================================

let frameIndex = 0;
let contador = 0;
const atraso = 8;

function atualizar() {
    const xAnterior = jogador.x;
    const yAnterior = jogador.y;

    const estaAndando = movimentoMage.mover(jogador, teclasPressionadas, {
        width: obterLarguraMapa(),
        height: obterAlturaMapa()
    });

    if (!podeOcupar(jogador.x, jogador.y)) {
        jogador.x = xAnterior;
        jogador.y = yAnterior;
    } else {
        verificarSaida();
    }

    atualizarAnimacao(estaAndando);
    atualizarCamera();
    desenhar();

    requestAnimationFrame(atualizar);
}

function atualizarCamera() {
    const centroJogadorX = jogador.x + jogador.width / 2;
    const centroJogadorY = jogador.y + jogador.height / 2;

    camera.x = limitar(
        centroJogadorX - camera.width / 2,
        0,
        obterLarguraMapa() - camera.width
    );

    camera.y = limitar(
        centroJogadorY - camera.height / 2,
        0,
        obterAlturaMapa() - camera.height
    );
}

function limitar(valor, minimo, maximo) {
    if (maximo < minimo) {
        return minimo;
    }

    return Math.min(Math.max(valor, minimo), maximo);
}

function obterLarguraMapa() {
    return mapaAtual.mapa[0].length * mapaAtual.largura;
}

function obterAlturaMapa() {
    return mapaAtual.mapa.length * mapaAtual.altura;
}

function verificarSaida() {
    if (obterTileDoJogador() !== 2 || faseAtualIndex >= fases.length - 1) {
        return;
    }

    trocarFase(faseAtualIndex + 1);
}

function trocarFase(novoIndex) {
    faseAtualIndex = novoIndex;
    mapaAtual = fases[faseAtualIndex];

    const novoSpawn = encontrarTile(3);

    jogador.x = novoSpawn.x;
    jogador.y = novoSpawn.y;
    camera.x = 0;
    camera.y = 0;
}

function atualizarAnimacao(estaAndando) {
    const proximaAcao = estaAndando ? "andar" : "parado";

    if (jogador.acao !== proximaAcao) {
        jogador.acao = proximaAcao;
        jogador.img = estaAndando ? movimentoMage.andar() : movimentoMage.parado();
        frameIndex = 0;
        contador = 0;
    }

    contador++;

    if (contador < atraso) {
        return;
    }

    frameIndex = (frameIndex + 1) % jogador.img.length;
    contador = 0;
}

// ================================
// Render
// ================================

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    desenharMapa();
    desenharJogador();

    ctx.restore();
}

function desenharMapa() {
    const colunaInicial = Math.max(0, Math.floor(camera.x / mapaAtual.largura));
    const colunaFinal = Math.min(
        mapaAtual.mapa[0].length,
        Math.ceil((camera.x + camera.width) / mapaAtual.largura) + 1
    );

    const linhaInicial = Math.max(0, Math.floor(camera.y / mapaAtual.altura));
    const linhaFinal = Math.min(
        mapaAtual.mapa.length,
        Math.ceil((camera.y + camera.height) / mapaAtual.altura) + 1
    );

    for (let linha = linhaInicial; linha < linhaFinal; linha++) {
        for (let coluna = colunaInicial; coluna < colunaFinal; coluna++) {
            const bloco = mapaAtual.mapa[linha][coluna];
            const x = coluna * mapaAtual.largura;
            const y = linha * mapaAtual.altura;

            ctx.fillStyle = corDoBloco(bloco);
            ctx.fillRect(x, y, mapaAtual.largura, mapaAtual.altura);

            ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
            ctx.strokeRect(x, y, mapaAtual.largura, mapaAtual.altura);
        }
    }
}

function corDoBloco(bloco) {
    switch (bloco) {
        case 1:
            return "#68452f";
        case 2:
            return "#167145";
        case 4:
            return "#9c2734";
        default:
            return "#77b86c";
    }
}

function desenharJogador() {
    const frameAtual = jogador.img[frameIndex];

    if (!frameAtual.complete || frameAtual.naturalWidth === 0) {
        ctx.fillStyle = "#2454c6";
        ctx.fillRect(jogador.x, jogador.y, jogador.width, jogador.height);
        return;
    }

    if (movimentoMage.direcao === "esquerda") {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(frameAtual, -jogador.x - jogador.width, jogador.y, jogador.width, jogador.height);
        ctx.restore();
        return;
    }

    ctx.drawImage(frameAtual, jogador.x, jogador.y, jogador.width, jogador.height);
}

// ================================
// Colisao
// ================================

function podeOcupar(x, y) {
    const margem = 7;
    const pontos = [
        { x: x + margem, y: y + margem },
        { x: x + jogador.width - margem, y: y + margem },
        { x: x + margem, y: y + jogador.height - margem },
        { x: x + jogador.width - margem, y: y + jogador.height - margem }
    ];

    return pontos.every((ponto) => {
        const coluna = Math.floor(ponto.x / mapaAtual.largura);
        const linha = Math.floor(ponto.y / mapaAtual.altura);

        if (!mapaAtual.mapa[linha] || mapaAtual.mapa[linha][coluna] === undefined) {
            return false;
        }

        return mapaAtual.mapa[linha][coluna] !== 1;
    });
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

function obterTileDoJogador() {
    const centroX = jogador.x + jogador.width / 2;
    const centroY = jogador.y + jogador.height / 2;
    const coluna = Math.floor(centroX / mapaAtual.largura);
    const linha = Math.floor(centroY / mapaAtual.altura);

    return mapaAtual.mapa[linha]?.[coluna];
}

atualizar();
