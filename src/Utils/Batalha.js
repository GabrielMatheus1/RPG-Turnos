import { Goblin } from "../Classes/inimigos/Goblin.js"
import { Drakar } from "../Classes/boss/Drakar.js"


export class Batalha {

    constructor(jogador, inimigo) {
        this.jogador = jogador;
        this.inimigo = inimigo;
        this.turno = 1;
        this.finalizada = false;
    }


    iniciar() {

        if (!this.jogador.estaVivo()) {
            console.log(`${this.jogador.nome} não possui vida suficiente para lutar.`);

            return this.finalizada = true;
        }

        if (!this.inimigo.estaVivo()) {
            console.log(`${this.inimigo.nome} já foi derrotado.`);
            return this.finalizada = true;

        }

        console.log("\n================================");
        console.log("        INÍCIO DA BATALHA");
        console.log("================================");

        console.log(`${this.jogador.nome} VS ${this.inimigo.nome}`);

        this.exibirStatus();
    }



    exibirStatus() {

        console.log("\n------------- STATUS -------------");
        console.log( `${this.jogador.nome}: ${this.jogador.vida}/${this.jogador.hpMax}` );
        console.log( `${this.inimigo.nome}: ${this.inimigo.vida}/${this.inimigo.hpMax}` );
        console.log("----------------------------------");

        console.log("\n================================\n");
    }



    turnoJogador(ataque) {

        if (this.finalizada) {
            console.log(  "A batalha já terminou." );
            return;
        }

        if (!this.jogador.estaVivo()) {
            this.encerrarBatalha();
            return;
        }

        console.log( `\n===== TURNO ${this.turno} =====` );
        console.log( `Turno de ${this.jogador.nome}`  );

        // ataques de magos
        switch (ataque.toLowerCase()) {

            case "fireball":
                this.jogador.fireball(this.inimigo);
                break;

        
            default:
                console.log( `\nAtaque "${ataque}" inválido.` );
                console.log( "Ataque disponível: fireball. \n" );
                return;
        }

        if (!this.inimigo.estaVivo()) {
            this.encerrarBatalha();
            return;
        }

        this.turnoInimigo();
    }



    turnoInimigo() {

        if (this.finalizada) {
            return;
        }

        console.log( `\nTurno de ${this.inimigo.nome}`  );

        // ataque de goblin
        if ( this.inimigo instanceof Goblin ) {

            this.inimigo.ataqueSimples(  this.jogador );

        } 

        else {
            console.log(`\n ${this.inimigo.nome} não tem ataques configurado`)
        }

        if (!this.jogador.estaVivo()) {
            this.encerrarBatalha();
            return;
        }

        this.turno++;
        this.exibirStatus();
    }



    encerrarBatalha() {

        if (this.finalizada) {
            return;
        }

        this.finalizada = true;

        console.log("\n================================");
        console.log("         FIM DA BATALHA");
        console.log("================================\n");

        if (this.jogador.estaVivo()) {

            console.log(  `${this.jogador.nome} venceu a batalha!`  );
            this.jogador.ganharXp( this.inimigo.xpRecompensa  );

        } else {
            console.log( `${this.jogador.nome} foi derrotado por ${this.inimigo.nome}.`  );
        }

    }



}


