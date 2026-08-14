export class MovimentoMapa {

    constructor(jogador, velocidade = 10) {

        this.jogador = jogador;
        this.velocidade = velocidade;

    }

    cima() {

        this.jogador.y -= this.velocidade;

        this.jogador.direcao = "cima";

    }

    baixo() {

        this.jogador.y += this.velocidade;

        this.jogador.direcao = "baixo";

    }

    esquerda() {

        this.jogador.x -= this.velocidade;

        this.jogador.direcao = "esquerda";

    }

    direita() {

        this.jogador.x += this.velocidade;

        this.jogador.direcao = "direita";

    }

}