import { Mage } from './src/Classes/herois/Mage.js'
import { Mapa } from './src/Mapas/Mapas.js'

// informações para o jogo
const player = new Mage('Gabriel')
const mapa = new Mapa(player)

import { MovimentoMage } from './src/movimentos/herois/MoveMage.js'
const magoMove = new MovimentoMage()



// ================================= //
// ============ IMPORTS ============ //
// ================================= //

import { RenderMapa } from "./src/Mapas/Mapas.js";

import { floresta } from "./src/Mapas/world-1/Fases-1.js";


// ================================= //
// ============ CANVAS ============= //
// ================================= //

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


// ================================= //
// ======= CRIANDO RENDER MAPA ===== //
// ================================= //

const renderMapa = new RenderMapa(ctx);


// ================================= //
// ========= MAPA INICIAL ========== //
// ================================= //

renderMapa.definirMapa(floresta);


// ================================= //
// ======= TAMANHO DO CANVAS ======= //
// ================================= //

canvas.width =
    floresta.mapa[0].length *
    floresta.largura;


canvas.height =
    floresta.mapa.length *
    floresta.altura;


// ================================= //
// ========= RENDERIZANDO ========== //
// ================================= //

renderMapa.renderizar();