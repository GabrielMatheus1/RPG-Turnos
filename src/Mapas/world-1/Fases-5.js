function criarMapaSantuarioCentral() {
    const colunas = 57;
    const linhas = 57;
    const centroX = Math.floor(colunas / 2);
    const centroY = Math.floor(linhas / 2);

    const mapa = Array.from({ length: linhas }, (_, linha) =>
        Array.from({ length: colunas }, (_, coluna) =>
            linha === 0 || coluna === 0 || linha === linhas - 1 || coluna === colunas - 1 ? 1 : 0
        )
    );

    for (let linha = 4; linha < linhas - 4; linha += 6) {
        for (let coluna = 2; coluna < colunas - 2; coluna++) {
            if (
                Math.abs(coluna - centroX) > 2 &&
                coluna % 9 !== 0 &&
                coluna % 13 !== 0
            ) {
                mapa[linha][coluna] = 1;
            }
        }
    }

    for (let coluna = 6; coluna < colunas - 6; coluna += 8) {
        for (let linha = 2; linha < linhas - 2; linha++) {
            if (
                Math.abs(linha - centroY) > 2 &&
                linha % 7 !== 0 &&
                linha % 11 !== 0
            ) {
                mapa[linha][coluna] = 1;
            }
        }
    }

    for (let linha = centroY - 5; linha <= centroY + 5; linha++) {
        for (let coluna = centroX - 5; coluna <= centroX + 5; coluna++) {
            mapa[linha][coluna] = 0;
        }
    }

    for (let coluna = 1; coluna < colunas - 1; coluna++) {
        mapa[centroY][coluna] = 0;
        mapa[centroY - 1][coluna] = 0;
        mapa[centroY + 1][coluna] = 0;
    }

    for (let linha = 1; linha < linhas - 1; linha++) {
        mapa[linha][centroX] = 0;
        mapa[linha][centroX - 1] = 0;
        mapa[linha][centroX + 1] = 0;
    }

    const salas = [
        { x: 4, y: 4, largura: 7, altura: 6 },
        { x: 42, y: 5, largura: 8, altura: 7 },
        { x: 7, y: 39, largura: 9, altura: 8 },
        { x: 39, y: 38, largura: 10, altura: 9 },
        { x: 20, y: 8, largura: 8, altura: 7 },
        { x: 29, y: 41, largura: 7, altura: 6 }
    ];

    for (const sala of salas) {
        for (let linha = sala.y; linha < sala.y + sala.altura; linha++) {
            for (let coluna = sala.x; coluna < sala.x + sala.largura; coluna++) {
                mapa[linha][coluna] = 0;
            }
        }
    }

    const inimigos = [
        [8, 7],
        [20, 13],
        [45, 10],
        [12, 22],
        [39, 21],
        [18, 34],
        [44, 36],
        [10, 44],
        [32, 45],
        [49, 48],
        [27, 18],
        [30, 37]
    ];

    for (const [coluna, linha] of inimigos) {
        mapa[linha][coluna] = 4;
    }

    mapa[centroY][centroX] = 3;
    mapa[centroY][colunas - 2] = 2;

    return mapa;
}

export const santuarioCentral = {

    id: "santuario-central",

    nome: "Santuario Central",

    mapa: criarMapaSantuarioCentral(),

    largura: 100,
    altura: 100

};


// 0 = caminho
// 1 = parede
// 2 = saida
// 3 = jogador
// 4 = inimigo
