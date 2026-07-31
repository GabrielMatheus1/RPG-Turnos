
export class Personagem {

    constructor(obj) {

        this.nome = obj.name;
        this.classe = obj.classe;
        this.nivel = obj.nivel || 1;
        this.vida = obj.vida || 500;
        this.hpMax = obj.hpMax || 500;

        this.xp = obj.xp || 0;
        this.xpProximoNivel = this.calcularXpProximoNivel();
    }



    estaVivo() {
        return this.vida > 0;
    }



    calcularXpProximoNivel() {
        return this.nivel * 150;
    }



    receberDano(danoBruto) {

        const danoRecebido = Math.max(0, Math.round(danoBruto - this.defesa));

        this.vida = Math.max(0, this.vida - danoRecebido);

        console.log("\n===========================")
        console.log(`${this.nome} recebeu ${danoRecebido} de dano.`);
        console.log(`Vida: ${this.vida}/${this.hpMax}`);

        if (!this.estaVivo()) {
            console.log(`${this.nome} foi derrotado!`);
        }

        console.log("===========================\n")
        return danoRecebido;
    }



    ganharXp(quantidade) {

        this.xp += quantidade;

        console.log("\n===========================")
        console.log(`${this.nome} recebeu ${quantidade} de XP!`);

        while (this.xp >= this.xpProximoNivel) {

            this.xp -= this.xpProximoNivel;
            this.subirNivel();
            this.xpProximoNivel = this.calcularXpProximoNivel();
        }

        console.log(`XP atual: ${this.xp}/${this.xpProximoNivel}`);
        console.log("===========================\n")
    }



    subirNivel() {

        let atributos = {
            nivel: this.nivel,
            vida: this.vida,
            hp: this.hpMax,
            ataque: this.ataque,
            defesa: this.defesa,
            magia: this.magia
        }

        this.nivel++;

        let classeUp = this.classe.toLowerCase()

        switch (classeUp) {

            case "mage":
                this.hpMax += 100;
                this.vida += 100;
                this.magia += 5;
                this.defesa += 2;


                this.vida = Math.min(this.vida, this.hpMax);

                console.log(`\n${this.nome} subiu do nível ${atributos.nivel} para o nível ${this.nivel}!`);
                console.log("------------------------------------------------");
                console.log("Atributo | Antes | Depois | Aumento");
                console.log("------------------------------------------------");
                console.log(`Vida     | ${atributos.vida}\t| ${this.vida}\t| +${this.vida - atributos.vida}`);
                console.log(`HP       | ${atributos.hp}\t| ${this.hpMax}\t| +${this.hpMax - atributos.hp}`);
                console.log(`Magia    | ${atributos.magia}\t| ${this.magia}\t| +${this.magia - atributos.magia}`);
                console.log(`Defesa   | ${atributos.defesa}\t| ${this.defesa}\t| +${this.defesa - atributos.defesa}`);
                console.log("------------------------------------------------ \n");

                break;

            case "archer":
                this.hpMax += 120;
                this.vida += 120;
                this.ataque += 7;
                this.defesa += 1;


                this.vida = Math.min(this.vida, this.hpMax);

                console.log(`\n${this.nome} subiu do nível ${atributos.nivel} para o nível ${this.nivel}!`);
                console.log("------------------------------------------------");
                console.log("Atributo | Antes | Depois | Aumento");
                console.log("------------------------------------------------");
                console.log(`Vida     | ${atributos.vida}\t| ${this.vida}\t| +${this.vida - atributos.vida}`);
                console.log(`HP       | ${atributos.hp}\t| ${this.hpMax}\t| +${this.hpMax - atributos.hp}`);
                console.log(`Ataque    | ${atributos.ataque}\t| ${this.ataque}\t| +${this.ataque - atributos.ataque}`);
                console.log(`Defesa   | ${atributos.defesa}\t| ${this.defesa}\t| +${this.defesa - atributos.defesa}`);
                console.log("------------------------------------------------ \n");

                break;

            default:
                console.log(`A classe ${this.classe} ainda não possui evolução configurada.`);
                break;
        }


    }



    curar() {
        this.vida = this.hpMax;
        console.log("\n===========================")
        console.log(`${this.nome} recuperou toda a vida: ${this.vida}/${this.hpMax}`);
        console.log("===========================\n")
    }



}




export class Monstro {

    constructor(obj) {
        this.nome = obj.name;
        this.tipo = obj.tipo;
        this.nivel = obj.nivel;
        this.vida = obj.vida;
        this.hp = obj.hp;
        this.ataque = obj.ataque;
        this.defesa = obj.defesa;
        this.xpRecompensa = obj.xpRecompensa;
    }

    estaVivo() {
        return this.vida > 0;
    }

    receberDano(danoBruto) {

        const danoRecebido = Math.max(
            0,
            Math.round(danoBruto - this.defesa)
        );

        this.vida = Math.max(
            0,
            this.vida - danoRecebido
        );

        console.log(
            `${this.nome} recebeu ${danoRecebido} de dano.`
        );

        console.log(
            `Vida: ${this.vida}/${this.hp}`
        );

        if (!this.estaVivo()) {
            console.log(`${this.nome} foi derrotado!`);
        }

        return danoRecebido;
    }

    atacar(alvo) {

        if (!this.estaVivo()) {
            console.log(
                `${this.nome} está derrotado e não pode atacar.`
            );

            return 0;
        }

        console.log(
            `\n${this.nome} atacou ${alvo.nome}!`
        );

        return alvo.receberDano(this.ataque);
    }

    exibirStatus() {

        console.log("\n================================");
        console.log(`Nome: ${this.nome}`);
        console.log(`Tipo: ${this.tipo}`);
        console.log(`Nível: ${this.nivel}`);
        console.log(`Vida: ${this.vida}/${this.hp}`);
        console.log(`Ataque: ${this.ataque}`);
        console.log(`Defesa: ${this.defesa}`);
        console.log(`XP da recompensa: ${this.xpRecompensa}`);
        console.log("================================");
    }
}

export class Boss extends Monstro {

    constructor(obj) {
        super(obj);

        this.fase = 1;
        this.vidaMaxima = obj.hp;
    }

    receberDano(dano) {

        const danoRecebido =
            super.receberDano(dano);

        if (this.estaVivo()) {
            this.atualizarFase();
        }

        return danoRecebido;
    }

    atualizarFase() {

        const porcentagemVida =
            (this.vida / this.vidaMaxima) * 100;

        if (
            porcentagemVida <= 50 &&
            this.fase === 1
        ) {
            this.fase = 2;

            this.ataque += 10;
            this.defesa += 5;

            console.log("\n================================");
            console.log(`${this.nome} entrou na FASE 2!`);
            console.log("O chefe ficou mais forte!");
            console.log(`Ataque: ${this.ataque}`);
            console.log(`Defesa: ${this.defesa}`);
            console.log("================================");
        }
    }

    ataqueEspecial(alvo) {

        if (!this.estaVivo()) {
            console.log(
                `${this.nome} está derrotado e não pode atacar.`
            );

            return 0;
        }

        const dano =
            this.ataque * 2;

        console.log(
            `\n${this.nome} usou um ATAQUE ESPECIAL!`
        );

        return alvo.receberDano(dano);
    }
}
