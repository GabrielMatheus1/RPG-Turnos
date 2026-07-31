export class Movimentos {

    constructor(jogador) {
        this.frame = 0;
    }

    carregarImagens(caminhos) {
        return caminhos.map((caminho) => {
            const imagem = new Image();
            imagem.src = caminho;

            return imagem;
        });
    }

    proximoFrame(acao) {

        const lista = this.config[acao];

        const imagem = new Image();

        imagem.src = lista[this.frame];

        this.frame++;

        if (this.frame >= lista.length) {
            this.frame = 0;
        }

        return imagem;

    }

}
