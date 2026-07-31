import { Goblin } from "../classes/monstros/Goblin.js";


export class Batalha {

    constructor(jogador, inimigo) {
        this.jogador = jogador;
        this.inimigo = inimigo;
        this.turno = 1;
        this.finalizada = false;
    }
    

    iniciar() {

        if (!this.jogador.estaVivo()) {
            console.log(
                `${this.jogador.nome} não possui vida suficiente para lutar.`
            );

            this.finalizada = true;
            return;
        }

        if (!this.inimigo.estaVivo()) {
            console.log(
                `${this.inimigo.nome} já foi derrotado.`
            );

            this.finalizada = true;
            return;
        }

        console.log("\n================================");
        console.log("        INÍCIO DA BATALHA");
        console.log("================================");

        console.log(
            `${this.jogador.nome} VS ${this.inimigo.nome}`
        );

        this.exibirStatus();
    }


    turnoJogador(ataque) {

        if (this.finalizada) {
            console.log(
                "A batalha já terminou."
            );

            return;
        }

        if (!this.jogador.estaVivo()) {
            this.encerrarBatalha();
            return;
        }

        console.log(
            `\n===== TURNO ${this.turno} =====`
        );

        console.log(
            `Turno de ${this.jogador.nome}`
        );

        switch (ataque.toLowerCase()) {

            case "fireball":
                this.jogador.fireball(this.inimigo);
                break;

            case "meteor":
                this.jogador.meteor(this.inimigo);
                break;

            case "thunder":
                this.jogador.thunder(this.inimigo);
                break;

            case "ultimate":
                this.jogador.ultimate(this.inimigo);
                break;

            default:
                console.log(
                    `Ataque "${ataque}" inválido.`
                );

                console.log(
                    "Ataques disponíveis: fireball, meteor, thunder e ultimate."
                );

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

        console.log(
            `\nTurno de ${this.inimigo.nome}`
        );

        if (
            this.inimigo instanceof Goblin
        ) {
            this.inimigo.golpeDeAdaga(
                this.jogador
            );

        } else {
            this.inimigo.atacar(
                this.jogador
            );
        }

        if (!this.jogador.estaVivo()) {
            this.encerrarBatalha();
            return;
        }

        this.turno++;

        this.exibirStatus();
    }

    exibirStatus() {

        console.log("\n------------- STATUS -------------");

        console.log(
            `${this.jogador.nome}: ${this.jogador.vida}/${this.jogador.hp}`
        );

        console.log(
            `${this.inimigo.nome}: ${this.inimigo.vida}/${this.inimigo.hp}`
        );

        console.log("----------------------------------");
    }

    encerrarBatalha() {

        if (this.finalizada) {
            return;
        }

        this.finalizada = true;

        console.log("\n================================");
        console.log("         FIM DA BATALHA");
        console.log("================================");

        if (this.jogador.estaVivo()) {

            console.log(
                `${this.jogador.nome} venceu a batalha!`
            );

            this.jogador.ganharXp(
                this.inimigo.xpRecompensa
            );

        } else {

            console.log(
                `${this.jogador.nome} foi derrotado por ${this.inimigo.nome}.`
            );
        }
    }
}

