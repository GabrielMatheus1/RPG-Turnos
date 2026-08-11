import { Mage } from '../Classes/herois/Mage.js';

import { Goblin } from '../Classes/inimigos/Goblin.js';
import { Esqueleto } from '../Classes/inimigos/Esqueleto.js';
import { Drakar } from '../Classes/boss/Drakar.js';

import { Batalha } from '../Utils/Batalha.js'



export class Mapa {

    constructor(jogador) {

        this.jogador = jogador;

        this.locais = {

            vila: {
                nome: "Vila dos Magos",
                descricao: "Uma vila tranquila protegida por magia.",

                norte: "floresta",
                sul: null,
                leste: null,
                oeste: null,

                inimigo: null
            },

            floresta: {
                nome: "Floresta Sombria",
                descricao: "Uma floresta escura cheia de criaturas.",

                norte: "caverna",
                sul: "vila",
                leste: null,
                oeste: null,

                inimigo: new Goblin({
                    nivel: 1
                })
            },

            caverna: {
                nome: "Caverna Antiga",

                descricao: "Uma caverna fria cheia de esqueletos.",

                norte: "castelo",
                sul: "floresta",
                leste: null,
                oeste: null,

                inimigo: new Esqueleto({
                    nivel: 10
                })
            },

            castelo: {
                nome: "Castelo do Dragão",
                descricao: "O covil de Drakar, o Dragão Ancestral.",

                norte: null,
                sul: "caverna",
                leste: null,
                oeste: null,

                inimigo: new Drakar()
            }


        };

        this.posicaoAtual = "vila";
    }



    obterLocalAtual() {
        return this.locais[this.posicaoAtual];
    }



    exibirMapa() {

        const localAtual = this.obterLocalAtual();

        console.log(`\n
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
        \n`);

    }



    exibirLocal() {

        const local = this.obterLocalAtual();

        console.log("\n================================");
        console.log(local.nome);
        console.log("================================");
        console.log(local.descricao);

        if (local.inimigo && local.inimigo.estaVivo()) {

            console.log(`\nInimigo encontrado: ${local.inimigo.nome}`);

        } else {

            console.log("\nNão existem inimigos vivos neste local.");

        }

        this.exibirCaminhos();
    }



    exibirCaminhos() {

        const local = this.obterLocalAtual();

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

        const local = this.obterLocalAtual();

        direcao = direcao.toLowerCase();

        if (!local[direcao]) {

            console.log(`\nNão existe caminho para ${direcao}.`);
            return;
        }

        if (local.inimigo && local.inimigo.estaVivo()) {

            console.log(`\nVocê precisa derrotar ${local.inimigo.nome} antes de sair deste local.`);
            return;

        }

        this.posicaoAtual = local[direcao];

        console.log(`\n${this.jogador.nome} caminhou para ${direcao}.`);

        this.exibirLocal();
    }



    iniciarBatalha() {

        const local = this.obterLocalAtual();

        if (!local.inimigo) {

            console.log("\nNão existe nenhum inimigo neste local.");
            return null;
        }

        if (!local.inimigo.estaVivo()) {

            console.log(`\n${local.inimigo.nome} já foi derrotado.`);
            return null;
        }

        const batalha = new Batalha(this.jogador, local.inimigo);

        batalha.iniciar();

        return batalha;
    }

    descansar() {

        if (this.posicaoAtual !== "vila") {

            console.log("\nVocê só pode descansar na Vila dos Magos.");
            return;
        }

        this.jogador.curar();
    }




}








export class RenderMapa {

    constructor(ctx) {

        this.ctx = ctx;
        this.mapaAtual = null;

    }


    // ================================= //
    // ======== DEFINIR MAPA =========== //
    // ================================= //

    definirMapa(mapa) {

        this.mapaAtual = mapa;

    }


    // ================================= //
    // ========= RENDERIZAR ============ //
    // ================================= //

    renderizar() {

        if (!this.mapaAtual) {
            console.log("Nenhum mapa foi definido.");
            return;
        }


        const matriz = this.mapaAtual.mapa;

        const largura = this.mapaAtual.largura;
        const altura = this.mapaAtual.altura;


        for (let linha = 0; linha < matriz.length; linha++) {

            for (
                let coluna = 0;
                coluna < matriz[linha].length;
                coluna++
            ) {

                const bloco = matriz[linha][coluna];


                const x = coluna * largura;
                const y = linha * altura;


                // ============================= //
                // ========== CAMINHO ========== //
                // ============================= //

                if (bloco === 0) {

                    this.ctx.fillStyle = "green";

                    this.ctx.fillRect(
                        x,
                        y,
                        largura,
                        altura
                    );

                }


                // ============================= //
                // ========== PAREDE =========== //
                // ============================= //

                if (bloco === 1) {

                    this.ctx.fillStyle = "brown";

                    this.ctx.fillRect(
                        x,
                        y,
                        largura,
                        altura
                    );

                }


                // ============================= //
                // =========== SAÍDA =========== //
                // ============================= //

                if (bloco === 2) {

                    this.ctx.fillStyle = "blue";

                    this.ctx.fillRect(
                        x,
                        y,
                        largura,
                        altura
                    );

                }

            }

        }

    }


    // ================================= //
    // ======== TROCAR MAPA ============ //
    // ================================= //

    trocarMapa(novoMapa) {

        this.mapaAtual = novoMapa;
        console.log( `Mapa alterado para: ${novoMapa.nome}` );

    }

}