export class Mage {

    constructor(obj) {
        this.magia = obj.magia || 10;
        this.defesa = obj.defesa || 20;
    }



    podeAtacar(alvo) {

        if (!this.estaVivo()) {
            console.log(`${this.nome} está derrotado e não pode atacar.`);
            return false;
        }

        if (!alvo.estaVivo()) {
            console.log(`${alvo.nome} já está derrotado.`);
            return false;
        }

        return true;
    }



    fireball(alvo) {

        if (!this.podeAtacar(alvo)) {
            return 0;
        }

        const dano = (this.magia * 0.3) * this.nivel;

        console.log( `\n${this.nome} lançou Bola de Fogo em ${alvo.nome}!` );

        return alvo.receberDano(dano);
    }



}
