import { Personagem } from "../Personagens.js"


export class Archer extends Personagem {

    constructor(obj) {
        super(obj)
        this.ataque = obj.ataque || 95;
        this.defesa = obj.defesa || 18;
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



    flechada(alvo) {

        if (!this.podeAtacar(alvo)) {
            return 0;
        }

        const dano = (this.ataque * 0.4) * this.nivel;

        console.log( `\n${this.nome} Atirou uma Flecha em ${alvo.nome}!` );

        return alvo.receberDano(dano);
    }


  exibirStatus() {

        console.log('\n===========================')
        console.log(`Nome: ${this.nome}`)
        console.log(`Classe: ${this.classe}`)
        console.log(`Nivel: ${this.nivel}`)
        console.log(`HP: ${this.vida} / ${this.hpMax}`)
        console.log(`Ataque: ${this.ataque}`)
        console.log(`Defesa: ${this.defesa}`)
        console.log(`XP: ${this.xp} / ${this.xpProximoNivel}`)
        console.log('===========================\n')

        return {
            Nome: this.nome,
            Classe: this.classe,
            Nivel: this.nivel,
            Vida: this.vida,
            Hp: this.hpMax,
            Ataque: this.ataque,
            Xp: this.xp,
            xpProximoNivel: this.xpProximoNivel
        }

    }



}
