import { Mage } from "./src/Classes/herois/Mage.js";
import { MovimentoMage } from "./src/movimentos/herois/MoveMage.js";
import { floresta } from "./src/Mapas/world-1/Fases-1.js";

// ================================
// Canvas
// ================================

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const larguraMapa = floresta.mapa[0].length * floresta.largura;
const alturaMapa = floresta.mapa.length * floresta.altura;

const camera = {
    x: 0,
    y: 0,
    width: Math.min(640, larguraMapa),
    height: Math.min(480, alturaMapa)
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

    teclasPressionadas[tecla] = true;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }
});

window.addEventListener("keyup", (event) => {
    const tecla = event.key.toLowerCase();

    teclasPressionadas[tecla] = false;
});

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
        width: larguraMapa,
        height: alturaMapa
    });

    if (!podeOcupar(jogador.x, jogador.y)) {
        jogador.x = xAnterior;
        jogador.y = yAnterior;
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
        larguraMapa - camera.width
    );

    camera.y = limitar(
        centroJogadorY - camera.height / 2,
        0,
        alturaMapa - camera.height
    );
}

function limitar(valor, minimo, maximo) {
    return Math.min(Math.max(valor, minimo), maximo);
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
    for (let linha = 0; linha < floresta.mapa.length; linha++) {
        for (let coluna = 0; coluna < floresta.mapa[linha].length; coluna++) {
            const bloco = floresta.mapa[linha][coluna];
            const x = coluna * floresta.largura;
            const y = linha * floresta.altura;

            ctx.fillStyle = corDoBloco(bloco);
            ctx.fillRect(x, y, floresta.largura, floresta.altura);

            ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
            ctx.strokeRect(x, y, floresta.largura, floresta.altura);
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
        const coluna = Math.floor(ponto.x / floresta.largura);
        const linha = Math.floor(ponto.y / floresta.altura);

        if (!floresta.mapa[linha] || floresta.mapa[linha][coluna] === undefined) {
            return false;
        }

        return floresta.mapa[linha][coluna] !== 1;
    });
}

function encontrarTile(tipo) {
    for (let linha = 0; linha < floresta.mapa.length; linha++) {
        for (let coluna = 0; coluna < floresta.mapa[linha].length; coluna++) {
            if (floresta.mapa[linha][coluna] === tipo) {
                return {
                    x: coluna * floresta.largura,
                    y: linha * floresta.altura
                };
            }
        }
    }

    return { x: 0, y: 0 };
}

atualizar();
