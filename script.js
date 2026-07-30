import { Personagem } from "./src/Classes/Personagens.js";

const personagem = new Personagem({
    name: "Melindo",
    classe: "Mage"
});

const personagem2 = new Personagem({
    name: "Melippdasdo",
    classe: "asd" 
});


// estatus 
personagem.exibirStatus();

// receber dano
personagem.receberDano(21);

// ganhar xp
personagem.ganharXp(201);

// curar 
personagem.curar(201);



personagem.fireball(personagem2)
personagem2.fireball(personagem)