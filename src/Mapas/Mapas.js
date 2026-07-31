import { Monstro } from "../classes/Personagens.js";
import { Goblin } from "../classes/monstros/Goblin.js";
import { DragaoBoss } from "../classes/monstros/DragaoBoss.js";

import { Batalha } from "../utils/Batalha.js";


export class Mapa {

    constructor(jogador) {

        this.jogador = jogador;

        this.locais = {

            vila: {
                nome: "Vila dos Magos",
                descricao:
                    "Uma vila tranquila protegida por magia.",

                norte: "floresta",
                sul: null,
                leste: null,
                oeste: null,

                inimigo: null
            },

            floresta: {
                nome: "Floresta Sombria",
                descricao:
                    "Uma floresta escura cheia de criaturas.",

                norte: "caverna",
                sul: "vila",
                leste: null,
                oeste: null,

                inimigo: new Goblin({
                    name: "Goblin da Floresta",
                    tipo: "Goblin",
                    nivel: 1,
                    vida: 50,
                    hp: 50,
                    ataque: 12,
                    defesa: 3,
                    xpRecompensa: 160
                })
            },

            caverna: {
                nome: "Caverna Antiga",

                descricao:
                    "Uma caverna fria cheia de esqueletos.",

                norte: "castelo",
                sul: "floresta",
                leste: null,
                oeste: null,

                inimigo: new Monstro({
                    name: "Esqueleto Guerreiro",
                    tipo: "Esqueleto",
                    nivel: 3,
                    vida: 100,
                    hp: 100,
                    ataque: 20,
                    defesa: 6,
                    xpRecompensa: 150
                })
            },

            castelo: {
                nome: "Castelo do Dragão",

                descricao:
                    "O covil de Drakar, o Dragão Ancestral.",

                norte: null,
                sul: "caverna",
                leste: null,
                oeste: null,

                inimigo: new DragaoBoss({
                    name: "Drakar, o Dragão Ancestral",
                    tipo: "Dragão",
                    nivel: 10,
                    vida: 500,
                    hp: 500,
                    ataque: 40,
                    defesa: 10,
                    xpRecompensa: 1000
                }, 60)
            }

            

          
        };

        this.posicaoAtual = "vila";
    }


    obterLocalAtual() {
        return this.locais[this.posicaoAtual];
    }


    exibirLocal() {

        const local =
            this.obterLocalAtual();

        console.log("\n================================");
        console.log(local.nome);
        console.log("================================");
        console.log(local.descricao);

        if (
            local.inimigo &&
            local.inimigo.estaVivo()
        ) {
            console.log(
                `\nInimigo encontrado: ${local.inimigo.nome}`
            );

        } else {
            console.log(
                "\nNão existem inimigos vivos neste local."
            );
        }

        this.exibirCaminhos();
    }


    exibirCaminhos() {

        const local =
            this.obterLocalAtual();

        console.log("\nCaminhos disponíveis:");

        let encontrouCaminho = false;

        if (local.norte) {
            console.log("- Norte");
            encontrouCaminho = true;
        }

        if (local.sul) {
            console.log("- Sul");
            encontrouCaminho = true;
        }

        if (local.leste) {
            console.log("- Leste");
            encontrouCaminho = true;
        }

        if (local.oeste) {
            console.log("- Oeste");
            encontrouCaminho = true;
        }

        if (!encontrouCaminho) {
            console.log("- Nenhum caminho disponível");
        }
    }


    mover(direcao) {

        const local =
            this.obterLocalAtual();

        direcao =
            direcao.toLowerCase();

        if (!local[direcao]) {

            console.log(
                `\nNão existe caminho para ${direcao}.`
            );

            return;
        }

        if (
            local.inimigo &&
            local.inimigo.estaVivo()
        ) {
            console.log(
                `\nVocê precisa derrotar ${local.inimigo.nome} antes de sair deste local.`
            );

            return;
        }

        this.posicaoAtual =
            local[direcao];

        console.log(
            `\n${this.jogador.nome} caminhou para ${direcao}.`
        );

        this.exibirLocal();
    }


    iniciarBatalha() {

        const local =
            this.obterLocalAtual();

        if (!local.inimigo) {

            console.log(
                "\nNão existe nenhum inimigo neste local."
            );

            return null;
        }

        if (!local.inimigo.estaVivo()) {

            console.log(
                `\n${local.inimigo.nome} já foi derrotado.`
            );

            return null;
        }

        const batalha = new Batalha(
            this.jogador,
            local.inimigo
        );

        batalha.iniciar();

        return batalha;
    }

    descansar() {

        if (this.posicaoAtual !== "vila") {

            console.log(
                "\nVocê só pode descansar na Vila dos Magos."
            );

            return;
        }

        this.jogador.curar();
    }

    exibirMapa() {

        const localAtual =
            this.obterLocalAtual();

        console.log(`
================================
              MAPA
================================
        [Castelo do Dragão]
                |
        [Caverna Antiga]      
                |
        [Floresta Sombria]
                |
        [Vila dos Magos]

Local atual: ${localAtual.nome}

================================
        `);
    }
}
