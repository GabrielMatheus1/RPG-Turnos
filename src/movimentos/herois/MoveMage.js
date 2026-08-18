export class MovimentoMage {

    constructor() {
        this.velocidade = 2;
        this.direcao = "direita";
        this.sprites = {
            parado: carregarImagens([
                "./src/Imagens/herois/Idle/idle_01.png",
                "./src/Imagens/herois/Idle/idle_02.png",
                "./src/Imagens/herois/Idle/idle_03.png",
                "./src/Imagens/herois/Idle/idle_04.png"
            ]),
            andar: carregarImagens([
                "./src/Imagens/herois/Walk/walk_01.png",
                "./src/Imagens/herois/Walk/walk_02.png",
                "./src/Imagens/herois/Walk/walk_03.png",
                "./src/Imagens/herois/Walk/walk_04.png"
            ])
        };
    }

    parado() {
        return this.sprites.parado;
    }

    andar() {
        return this.sprites.andar;
    }

    mover(jogador, teclas, limite) {
        const x = valorDirecao(teclas.arrowright || teclas.d) - valorDirecao(teclas.arrowleft || teclas.a);
        const y = valorDirecao(teclas.arrowdown || teclas.s) - valorDirecao(teclas.arrowup || teclas.w);

        if (x === 0 && y === 0) {
            return false;
        }

        if (x < 0) {
            this.direcao = "esquerda";
        }

        if (x > 0) {
            this.direcao = "direita";
        }

        const distancia = Math.hypot(x, y);

        jogador.x = limitar(
            jogador.x + (x / distancia) * this.velocidade,
            0,
            limite.width - jogador.width
        );

        jogador.y = limitar(
            jogador.y + (y / distancia) * this.velocidade,
            0,
            limite.height - jogador.height
        );

        return true;
    }
}

function valorDirecao(valor) {
    return valor ? 1 : 0;
}

function limitar(valor, minimo, maximo) {
    return Math.min(Math.max(valor, minimo), maximo);
}

function carregarImagens(caminhos) {
    return caminhos.map((caminho) => {
        const imagem = new Image();
        imagem.src = caminho;
        return imagem;
    });
}
