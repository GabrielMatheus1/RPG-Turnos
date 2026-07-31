export class MovimentoMage {

    constructor() {

        this.velocidade = 2;
        this.direcao = "direita"; 
        this.atacando = false

        this.sprites = {
            parado: this.carregarImagens([
                "./src/Imagens/herois/Idle/idle_01.png",
                "./src/Imagens/herois/Idle/idle_02.png",
                "./src/Imagens/herois/Idle/idle_03.png",
                "./src/Imagens/herois/Idle/idle_04.png",
            ]),

            andar: this.carregarImagens([
                "./src/Imagens/herois/Walk/walk_01.png",
                "./src/Imagens/herois/Walk/walk_02.png",
                "./src/Imagens/herois/Walk/walk_03.png",
                "./src/Imagens/herois/Walk/walk_04.png"
            ]),

            atacar: this.carregarImagens([
                "./src/Imagens/herois/Attack/attack_01.png",
                "./src/Imagens/herois/Attack/attack_02.png",
                "./src/Imagens/herois/Attack/attack_03.png",
                "./src/Imagens/herois/Attack/attack_04.png"
            ])
        };

    }


    parado() {
        return this.sprites.parado;
    }


    andar() {
        return this.sprites.andar;
    }


    atacar() {
        return this.sprites.atacar;
    }


    mover(jogador, teclas, limite) {
        let movimentoX = 0;
        let movimentoY = 0;

        if (teclas.arrowleft || teclas.a) {
            movimentoX -= 1;
            this.direcao = "esquerda";
        }

        if (teclas.arrowright || teclas.d) {
            movimentoX += 1;
            this.direcao = "direita";
        }

        if (teclas.arrowup || teclas.w) {
            movimentoY -= 1;
        }

        if (teclas.arrowdown || teclas.s) {
            movimentoY += 1;
        }

        if (teclas.j) {
            this.atacando = true
            this.atacar()
        } else {
            this.atacando = false
        }

        if (movimentoX === 0 && movimentoY === 0) {
            return false;
        }



        const distancia = Math.hypot(movimentoX, movimentoY);
        
        const proximoX = jogador.x + (movimentoX / distancia) * this.velocidade;
        const proximoY = jogador.y + (movimentoY / distancia) * this.velocidade;

        jogador.x = Math.min(Math.max(0, proximoX), limite.width - jogador.width);
        jogador.y = Math.min(Math.max(0, proximoY), limite.height - jogador.height);

        return true;
    }

    carregarImagens(caminhos) {
        return caminhos.map((caminho) => {
            const imagem = new Image();
            imagem.src = caminho;

            return imagem;
        });
    }
    
}

