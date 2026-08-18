import { Mage } from "./src/Classes/herois/Mage.js";
import { MovimentoMage } from "./src/movimentos/herois/MoveMage.js";

import { floresta } from "./src/Mapas/world-1/Fases-1.js";
import { cavernaCristalina } from "./src/Mapas/world-1/Fases-2.js";
import { pantanoProfundo } from "./src/Mapas/world-1/Fases-3.js";
import { fortalezaAntiga } from "./src/Mapas/world-1/Fases-4.js";
import { santuarioCentral } from "./src/Mapas/world-1/Fases-5.js";

const fases = [floresta, cavernaCristalina, pantanoProfundo, fortalezaAntiga, santuarioCentral];
const teclas = {};
const cores = {
    1: "#68452f",
    2: "#167145",
    4: "#9c2734",
    padrao: "#77b86c"
};

let faseIndex = 0;
let mapaAtual = fases[faseIndex];

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
            pressionar(tecla, true);
            botao.classList.add("is-pressed");
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

function atualizar() {
    const posicaoAnterior = { x: jogador.x, y: jogador.y };
    const estaAndando = movimento.mover(jogador, teclas, {
        width: larguraMapa(),
        height: alturaMapa()
    });

    if (temColisao(jogador.x, jogador.y)) {
        jogador.x = posicaoAnterior.x;
        jogador.y = posicaoAnterior.y;
    } else {
        verificarSaida();
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

    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    desenharMapa();
    desenharJogador();
    ctx.restore();
}

function desenharMapa() {
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

    for (let linha = inicioLinha; linha < fimLinha; linha++) {
        for (let coluna = inicioColuna; coluna < fimColuna; coluna++) {
            const bloco = mapaAtual.mapa[linha][coluna];
            const x = coluna * mapaAtual.largura;
            const y = linha * mapaAtual.altura;

            ctx.fillStyle = cores[bloco] || cores.padrao;
            ctx.fillRect(x, y, mapaAtual.largura, mapaAtual.altura);

            ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
            ctx.strokeRect(x, y, mapaAtual.largura, mapaAtual.altura);
        }
    }
}

function desenharJogador() {
    const frame = jogador.img[animacao.frame];

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
    mapaAtual = fases[faseIndex];

    const novoSpawn = encontrarTile(3);
    jogador.x = novoSpawn.x;
    jogador.y = novoSpawn.y;
    camera.x = 0;
    camera.y = 0;
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

function limitar(valor, minimo, maximo) {
    if (maximo < minimo) {
        return minimo;
    }

    return Math.min(Math.max(valor, minimo), maximo);
}
