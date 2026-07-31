<<<<<<< HEAD
import { Personagem } from "../Personagens.js"

=======
import { Personagem } from '../Personagens.js'
>>>>>>> 6960446287454f3815a018d76d678bbaf1defedc

export class Mage extends Personagem {

    constructor(obj) {
        super(obj)
<<<<<<< HEAD
=======

>>>>>>> 6960446287454f3815a018d76d678bbaf1defedc
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

        console.log(`\n${this.nome} lançou Bola de Fogo em ${alvo.nome}!`);

        return alvo.receberDano(dano);
    }

  
  exibirStatus() {

        console.log('\n===========================')
        console.log(`Nome: ${this.nome}`)
        console.log(`Classe: ${this.classe}`)
        console.log(`Nivel: ${this.nivel}`)
        console.log(`HP: ${this.vida} / ${this.hpMax}`)
        console.log(`Defesa: ${this.defesa}`)
        console.log(`Magia: ${this.magia}`)
        console.log(`XP: ${this.xp} / ${this.xpProximoNivel}`)
        console.log('===========================\n')

        return {
            Nome: this.nome,
            Classe: this.classe,
            Nivel: this.nivel,
            Vida: this.vida,
            Hp: this.hpMax,
            Defesa: this.defesa,
            Magia: this.magia,
            Xp: this.xp,
            xpProximoNivel: this.xpProximoNivel
        }

    }



    exibirStatus() {

        console.log('===========================')
        console.log(`Nome: ${this.nome}`)
        console.log(`Classe: ${this.classe}`)
        console.log(`Nivel: ${this.nivel}`)
        console.log(`HP: ${this.vida} / ${this.hpMax}`)
        console.log(`Defesa: ${this.defesa}`)
        console.log(`Magia: ${this.magia}`)
        console.log(`XP: ${this.xp} / ${this.xpProximoNivel}`)
        console.log('===========================')

        return {
            Nome: this.nome,
            Classe: this.classe,
            Nivel: this.nivel,
            Vida: this.vida,
            Hp: this.hpMax,
            Defesa: this.defesa,
            Magia: this.magia,
            Xp: this.xp,
            xpProximoNivel: this.xpProximoNivel
        }

    }


}
