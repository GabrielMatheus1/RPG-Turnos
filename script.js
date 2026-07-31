// import { Mage } from "./src/Classes/herois/Mage.js";
// import { Archer } from "./src/Classes/herois/Archer.js"

// import { Movimentos } from "./src/movimentos/Movimento.js";

import { MovimentoMage } from './src/movimentos/herois/MoveMage.js'

const magoMove = new MovimentoMage()


// const mago = new Mage({
//     name: "Melindo",
//     classe: "Mage"
// });

// const arqueiro = new Archer({
//     name: "Artemora",
//     classe: "Archer"
// });



// console.log("===========================")
// console.log("      Status Inicial")

// mago.exibirStatus();
// arqueiro.exibirStatus()



// console.log("===========================")
// console.log("    Recebendo Dano")

// mago.receberDano(21);
// arqueiro.receberDano(20)



// console.log("===========================")
// console.log("    Recebendo XP")

// mago.ganharXp(201);
// arqueiro.ganharXp(201)



// console.log("===========================")
// console.log("    Recebendo Cura")

// mago.curar();
// arqueiro.curar()



// mago.fireball(arqueiro)
// arqueiro.flechada(mago)






let canva = document.querySelector('canvas')
let ctx = canva.getContext('2d')
const teclasPressionadas = {};

window.addEventListener("keydown", (event) => {
    teclasPressionadas[event.key.toLowerCase()] = true;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }
});

window.addEventListener("keyup", (event) => {
    teclasPressionadas[event.key.toLowerCase()] = false;
});


let jogador = {
    x: 100,
    y: 100,

    width: 40,
    height: 40,

    acao: "parado",
    img: magoMove.parado()
}




let frameIndex = 0;
let contador = 0;
let atraso = 10; // quanto maior, mais lento

function desenharJogador() {
    const estaAndando = magoMove.mover(jogador, teclasPressionadas, canva);
    const proximaAcao = estaAndando ? "andar" : "parado";

    if (jogador.acao !== proximaAcao) {
        jogador.acao = proximaAcao;
        jogador.img = estaAndando ? magoMove.andar() : magoMove.parado();
        frameIndex = 0;
        contador = 0;
    }

    ctx.clearRect(0, 0, canva.width, canva.height);

    const frameAtual = jogador.img[frameIndex];

    if (magoMove.direcao === "esquerda") {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
            frameAtual,
            -jogador.x - jogador.width,
            jogador.y,
            jogador.width,
            jogador.height
        );
        ctx.restore();
    } else {
        ctx.drawImage(
            frameAtual,
            jogador.x,
            jogador.y,
            jogador.width,
            jogador.height
        );
    }



    // só troca de frame quando o contador atingir o atraso
    contador++;
    if (contador >= atraso) {
        frameIndex = (frameIndex + 1) % jogador.img.length;
        contador = 0;
    }

    requestAnimationFrame(desenharJogador);
}

desenharJogador();
