// para batalha e classes
import { Mage } from "./src/Classes/herois/Mage.js";
import { Archer } from "./src/Classes/herois/Archer.js"

// para batalha e classes
import { Goblin } from "./src/Classes/inimigos/Goblin.js"
import { Drakar } from "./src/Classes/boss/Drakar.js"

// para batalha
import { Batalha } from "./src/utils/Batalha.js";

// para renderização
// import { MovimentoMage } from './src/movimentos/herois/MoveMage.js'
// const magoMove = new MovimentoMage()




// // ================================
// // Teste de Batalha
// // ================================

// const mago = new Mage({
//     name: "Melindo",
//     classe: "Mage"
// });

// const monstroUm = new Goblin()



// mago.exibirStatus()
// monstroUm.exibirStatus()


// const battle = new Batalha(mago, monstroUm)


// if (!battle.finalizada) {

//     battle.iniciar()
    
//     battle.turnoJogador( 'fireball' )
//     battle.turnoJogador( 'fireball' )
//     battle.turnoJogador( 'fireball' )
//     battle.turnoJogador( 'fireball' )
//     battle.turnoJogador( 'fireball' )

// } else {
//     console.log('nada')
// }




// // ================================
// // Teste de Classes
// // ================================

// const mago = new Mage({
//     name: "Melindo",
//     classe: "Mage"
// });

// const arqueiro = new Archer({
//     name: "Artemora",
//     classe: "Archer"
// });

// const monstroUm = new Goblin()
// const drakar = new Drakar()

// console.log("===========================")
// console.log("      Status Inicial")

// mago.exibirStatus();
// arqueiro.exibirStatus()
// monstroUm.exibirStatus()
// drakar.exibirStatus()


// console.log("===========================")
// console.log("    Recebendo Dano")

// mago.receberDano(21);
// arqueiro.receberDano(20)
// monstroUm.receberDano(320)
// drakar.receberDano(2000)

// console.log("===========================")
// console.log("    Recebendo Cura")

// mago.curar();
// arqueiro.curar()



// console.log("===========================")
// console.log("        Atacando")

// mago.fireball(monstroUm)
// monstroUm.ataqueSimples(mago)
// arqueiro.flechada(monstroUm)
// drakar.ataqueSimples(mago)
// arqueiro.flechada(drakar)



// console.log("===========================")
// console.log("    Recebendo XP")

// mago.ganharXp(monstroUm.xpRecompensa);
// mago.ganharXp(monstroUm.xpRecompensa);
// arqueiro.ganharXp(drakar.xpRecompensa)
// arqueiro.ganharXp(drakar.xpRecompensa)



// // ================================
// // Teste de Renderização do Game
// // ================================

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

// const circuloMagia = new Image()
// circuloMagia.src = "./src/Imagens/herois/Magia/poder.png"


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
// let magiaAtiva = false
// let inicioMagia = 0
// let tempoDaMagia
// const duracaoMagia = 5000
// const tamanhoInicialCirculo = 0
// const tamanhoMaximoCirculo = 100

// function calcularTamanhoCirculo(progresso) {
//     if (progresso < 0.3) {
//         return tamanhoInicialCirculo + (tamanhoMaximoCirculo - tamanhoInicialCirculo) * (progresso / 0.3)
//     }

//     if (progresso < 0.75) {
//         return tamanhoMaximoCirculo
//     }

//     return tamanhoMaximoCirculo - (tamanhoMaximoCirculo - tamanhoInicialCirculo) * ((progresso - 0.75) / 0.25)
// }

// function desenharCirculoMagia() {
//     if (!circuloMagia.complete) {
//         return
//     }

//     let tamanho = tamanhoInicialCirculo
//     let opacidade = 0.55
//     let rotacao = performance.now() / 1000
//     const centroX = jogador.x + jogador.width / 2
//     const centroY = jogador.y + jogador.height / 2

//     if (magiaAtiva) {
//         const tempoAtual = performance.now()
//         const progresso = Math.min((tempoAtual - inicioMagia) / duracaoMagia, 1)

//         if (progresso >= 1) {
//             magiaAtiva = false
//         } else {
//             tamanho = calcularTamanhoCirculo(progresso)
//             opacidade = progresso > 0.85 ? 0.55 + ((1 - progresso) / 0.15) * 0.45 : 1
//             rotacao = progresso * Math.PI * 4
//         }
//     }

//     ctx.save()
//     ctx.globalAlpha = opacidade
//     ctx.translate(centroX, centroY)
//     ctx.rotate(rotacao)
//     ctx.drawImage(
//         circuloMagia,
//         -tamanho / 2,
//         -tamanho / 2,
//         tamanho,
//         tamanho
//     )
//     ctx.restore()
// }

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
//     desenharCirculoMagia()

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



// const btnMagiaUm = document.querySelector('#magiaUm')

// function lancar() {

//     clearTimeout(tempoDaMagia)
//     magiaAtiva = true
//     inicioMagia = performance.now()

//     tempoDaMagia = setTimeout(parar, duracaoMagia)

// }

// function parar() {
//     magiaAtiva = false
// }


// btnMagiaUm.addEventListener('click', lancar)
