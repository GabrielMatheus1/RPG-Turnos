import { Boss } from "../Personagens.js"

export class Drakar extends Boss {
  
  constructor(obj) {
    super(obj)

    this.nome = "Drakar";
    this.ataque = 20;
    this.defesa = 15;
    this.tipo = "Dragao Ancestral";
    this.vida = 2000;
    this.hpMax = 2000;
    this.xpRecompensa = 200
    this.nivel = 10
  }

    ataqueSimples(alvo) {
    
            if (!this.estaVivo()) {
                console.log(  `${this.nome} está derrotado e não pode atacar.`   );
                return 0;
            }
    
            console.log( `\n${this.nome} atacou ${alvo.nome}!`  );
    
            return alvo.receberDano(this.ataque);
        }
  

    exibirStatus() {

        console.log("\n===========================");
        console.log(`Nome: ${this.nome}`);
        console.log(`Tipo: ${this.tipo}`);
        console.log(`Nível: ${this.nivel}`);
        console.log(`Vida: ${this.vida}/${this.hpMax}`);
        console.log(`Ataque: ${this.ataque}`);
        console.log(`Defesa: ${this.defesa}`);
        console.log(`XP da recompensa: ${this.xpRecompensa}`);
        console.log("===========================\n");

      return {
            Nome: this.nome,
            Tipo: this.tipo,
            Nivel: this.nivel,
            Vida: this.vida,
            Hp: this.hpMax,
            Ataque: this.ataque,
            Defesa: this.defesa,
            Xp: this.xpRecompensa
      }
    }
  
  
}