import { Mage } from "./src/Classes/herois/Mage.js";
import { Archer } from "./src/Classes/herois/Archer.js"

import { MovimentoMage } from './src/movimentos/herois/MoveMage.js'
// const magoMove = new MovimentoMage()


const mago = new Mage({
    name: "Melindo",
    classe: "Mage"
});

const arqueiro = new Archer({
    name: "Artemora",
    classe: "Archer"
});



console.log("===========================")
console.log("      Status Inicial")

mago.exibirStatus();
arqueiro.exibirStatus()



console.log("===========================")
console.log("    Recebendo Dano")

mago.receberDano(21);
arqueiro.receberDano(20)



console.log("===========================")
console.log("    Recebendo XP")

mago.ganharXp(201);
arqueiro.ganharXp(201)



console.log("===========================")
console.log("    Recebendo Cura")

mago.curar();
arqueiro.curar()



console.log("===========================")
console.log("        Atacando")

mago.fireball(arqueiro)
arqueiro.flechada(mago)




// let canva = document.querySelector('canvas')
// let ctx = canva.getContext('2d')

// const teclasPressionadas = {};

// window.addEventListener("keydown", (event) => {
//     const tecla = event.key.toLowerCase();

//     if (tecla === "j") {
//         if (!event.repeat && !magoMove.atacando) {
//             teclasPressionadas.j = true;
//         }
//         return;
//     }

//     teclasPressionadas[tecla] = true;

//     if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
//         event.preventDefault();
//     }
// });

// window.addEventListener("keyup", (event) => {
//     const tecla = event.key.toLowerCase();

//     if (tecla === "j") {
//         return;
//     }

//     teclasPressionadas[tecla] = false;
// });




// let jogador = {
//     x: 100,
//     y: 100,

//     width: 40,
//     height: 40,

//     acao: "parado",
//     img: magoMove.parado()
// }




// let frameIndex = 0;
// let contador = 0;
// let atraso = 8;

// function desenharJogador() {

//     const estaAndando = magoMove.mover(jogador, teclasPressionadas, canva);
//     const estaAtacando = magoMove.atacando
    

//     const proximaAcao = estaAtacando ? "atacar" : estaAndando ? "andar" : "parado";


//     if (jogador.acao !== proximaAcao) {

//         jogador.acao = proximaAcao;

//         if (proximaAcao === "atacar") {
//             jogador.img = magoMove.atacar()
//         } else {
//             jogador.img = estaAndando ? magoMove.andar() : magoMove.parado();
//         }


//         frameIndex = 0; 
//         contador = 0;
//     }

//     ctx.clearRect(0, 0, canva.width, canva.height);

//     const frameAtual = jogador.img[frameIndex];


//     if (magoMove.direcao === "esquerda") {
//         ctx.save();
//         ctx.scale(-1, 1);
//         ctx.drawImage(
//             frameAtual,
//             -jogador.x - jogador.width,
//             jogador.y,
//             jogador.width,
//             jogador.height
//         );
//         ctx.restore();
//     } else {
//         ctx.drawImage(
//             frameAtual,
//             jogador.x,
//             jogador.y,
//             jogador.width,
//             jogador.height
//         );
//     }

//     contador++;

//     if (contador >= atraso) {
//         if (jogador.acao === "atacar" && frameIndex === jogador.img.length - 1) {
//             teclasPressionadas.j = false;
//             magoMove.atacando = false;
//             jogador.acao = "";
//             frameIndex = 0;
//             contador = 0;
//             requestAnimationFrame(desenharJogador);
//             return;
//         }

//         frameIndex = (frameIndex + 1) % jogador.img.length;
//         contador = 0;
//     }

//     requestAnimationFrame(desenharJogador);
// }

// desenharJogador();
