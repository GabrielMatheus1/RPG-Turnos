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
    width: 40,
    height: 40,
    acao: "parado",
    img: movimentoMage.parado()
});

// ================================
// Controles
// ================================

const teclasPressionadas = {};

window.addEventListener("keydown", (event) => {
    const tecla = event.key.toLowerCase();

    if (tecla === "j") {
        if (!event.repeat && !movimentoMage.atacando) {
            teclasPressionadas.j = true;
            lancarMagia();
        }

        return;
    }

    teclasPressionadas[tecla] = true;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }
});

window.addEventListener("keyup", (event) => {
    const tecla = event.key.toLowerCase();

    if (tecla === "j") {
        return;
    }

    teclasPressionadas[tecla] = false;
});

// ================================
// Magia
// ================================

const circuloMagia = new Image();
circuloMagia.src = "./src/Imagens/herois/Magia/poder.png";

let magiaAtiva = false;
let inicioMagia = 0;
let tempoDaMagia;

const duracaoMagia = 900;
const tamanhoInicialCirculo = 0;
const tamanhoMaximoCirculo = 110;

function lancarMagia() {
    clearTimeout(tempoDaMagia);

    magiaAtiva = true;
    inicioMagia = performance.now();
    tempoDaMagia = setTimeout(pararMagia, duracaoMagia);
}

function pararMagia() {
    magiaAtiva = false;
}

const btnMagiaUm = document.querySelector("#magiaUm");

if (btnMagiaUm) {
    btnMagiaUm.addEventListener("click", lancarMagia);
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
    const estaAtacando = movimentoMage.atacando;
    const proximaAcao = estaAtacando ? "atacar" : estaAndando ? "andar" : "parado";

    if (jogador.acao !== proximaAcao) {
        jogador.acao = proximaAcao;
        jogador.img = obterSpritesDaAcao(proximaAcao);
        frameIndex = 0;
        contador = 0;
    }

    contador++;

    if (contador < atraso) {
        return;
    }

    if (jogador.acao === "atacar" && frameIndex === jogador.img.length - 1) {
        teclasPressionadas.j = false;
        movimentoMage.atacando = false;
        jogador.acao = "";
        frameIndex = 0;
        contador = 0;
        return;
    }

    frameIndex = (frameIndex + 1) % jogador.img.length;
    contador = 0;
}

function obterSpritesDaAcao(acao) {
    if (acao === "atacar") {
        return movimentoMage.atacar();
    }

    if (acao === "andar") {
        return movimentoMage.andar();
    }

    return movimentoMage.parado();
}

// ================================
// Render
// ================================

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    desenharMapa();
    desenharCirculoMagia();
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

function desenharCirculoMagia() {
    if (!circuloMagia.complete || circuloMagia.naturalWidth === 0) {
        return;
    }

    let tamanho = tamanhoInicialCirculo;
    let opacidade = 0.6;
    let rotacao = performance.now() / 1000;

    const centroX = jogador.x + jogador.width / 2;
    const centroY = jogador.y + jogador.height / 2;

    if (magiaAtiva) {
        const progresso = Math.min((performance.now() - inicioMagia) / duracaoMagia, 1);

        if (progresso >= 1) {
            magiaAtiva = false;
        } else {
            tamanho = calcularTamanhoCirculo(progresso);
            opacidade = progresso > 0.85 ? 0.6 + ((1 - progresso) / 0.15) * 0.4 : 1;
            rotacao = progresso * Math.PI * 4;
        }
    }

    ctx.save();
    ctx.globalAlpha = opacidade;
    ctx.translate(centroX, centroY);
    ctx.rotate(rotacao);
    ctx.drawImage(circuloMagia, -tamanho / 2, -tamanho / 2, tamanho, tamanho);
    ctx.restore();
}

function calcularTamanhoCirculo(progresso) {
    if (progresso < 0.3) {
        return tamanhoInicialCirculo + (tamanhoMaximoCirculo - tamanhoInicialCirculo) * (progresso / 0.3);
    }

    if (progresso < 0.75) {
        return tamanhoMaximoCirculo;
    }

    return tamanhoMaximoCirculo - (tamanhoMaximoCirculo - tamanhoInicialCirculo) * ((progresso - 0.75) / 0.25);
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
