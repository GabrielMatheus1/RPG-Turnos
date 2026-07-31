import { Mage } from "./src/Classes/herois/Mage.js";
import { Archer } from "./src/Classes/herois/Archer.js"

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

// curar 
mago.curar();
arqueiro.curar()



mago.fireball(arqueiro)
arqueiro.flechada(mago)