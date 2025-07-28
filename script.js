// --- Configurações do Jogo ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 32; // Tamanho de cada bloco em pixels
const WORLD_WIDTH_TILES = 100; // Largura do mundo em blocos
const WORLD_HEIGHT_TILES = 50; // Altura do mundo em blocos (do topo ao fundo)

// Ajusta o tamanho do canvas para o número de blocos visíveis na tela
canvas.width = 800; // Ex: 25 blocos * 32px
canvas.height = 600; // Ex: 18.75 blocos * 32px, arredondado para cima

// --- Definição dos Tipos de Blocos ---
const Blocks = {
    AIR: 0,
    DIRT: 1,
    GRASS: 2,
    STONE: 3,
    WOOD: 4,
    LEAVES: 5,
    WATER: 6,
    SAND: 7
};

// Cores dos blocos (simples, você pode substituir por imagens depois)
const BlockColors = {
    [Blocks.AIR]: 'rgba(0,0,0,0)', // Transparente
    [Blocks.DIRT]: '#8B4513', // Marrom
    [Blocks.GRASS]: '#228B22', // Verde
    [Blocks.STONE]: '#808080', // Cinza
    [Blocks.WOOD]: '#A0522D', // Marrom Avermelhado
    [Blocks.LEAVES]: '#006400', // Verde Escuro
    [Blocks.WATER]: '#1E90FF', // Azul claro
    [Blocks.SAND]: '#F4A460' // Laranja claro
};

// Blocos que não caem (sólidos para a gravidade)
const SOLID_BLOCKS = [
    Blocks.DIRT, Blocks.GRASS, Blocks.STONE,
    Blocks.WOOD, Blocks.LEAVES, Blocks.SAND
];

// Blocos que podem ser quebrados/coletados
const BREAKABLE_BLOCKS = [
    Blocks.DIRT, Blocks.GRASS, Blocks.STONE,
    Blocks.WOOD, Blocks.LEAVES, Blocks.SAND, Blocks.WATER
];

// --- Mundo do Jogo ---
let world = []; // Matriz 2D para armazenar os blocos

function generateWorld() {
    world = [];
    for (let y = 0; y < WORLD_HEIGHT_TILES; y++) {
        world.push([]);
        for (let x = 0; x < WORLD_WIDTH_TILES; x++) {
            if (y < WORLD_HEIGHT_TILES / 2) {
                // Acima da metade, principalmente ar, talvez algumas árvores no topo
                if (Math.random() < 0.02 && y > WORLD_HEIGHT_TILES / 4 && y < WORLD_HEIGHT_TILES / 2 - 2) {
                    // Tenta gerar uma árvore (tronco)
                    world[y].push(Blocks.WOOD);
                } else if (Math.random() < 0.05 && y > WORLD_HEIGHT_TILES / 2 - 5) {
                    // Pequenas poças de água no topo
                    world[y].push(Blocks.WATER);
                } else {
                    world[y].push(Blocks.AIR);
                }
            } else if (y === WORLD_HEIGHT_TILES / 2) {
                // Camada superior de grama
                world[y].push(Blocks.GRASS);
            } else if (y > WORLD_HEIGHT_TILES / 2 && y < WORLD_HEIGHT_TILES / 2 + 5) {
                // Abaixo da grama, terra
                world[y].push(Blocks.DIRT);
            } else {
                // Mais abaixo, pedra
                world[y].push(Blocks.STONE);
            }
        }
    }

    // Refinar árvores: Adicionar folhas e troncos
    for (let y = 0; y < WORLD_HEIGHT_TILES; y++) {
        for (let x = 0; x < WORLD_WIDTH_TILES; x++) {
            if (world[y][x] === Blocks.WOOD) {
                // Adiciona folhas ao redor do tronco (se for ar)
                for (let dy = -2; dy <= 2; dy++) {
                    for (let dx = -2; dx <= 2; dx++) {
                        const leafY = y + dy;
                        const leafX = x + dx;
                        if (leafY >= 0 && leafY < WORLD_HEIGHT_TILES &&
                            leafX >= 0 && leafX < WORLD_WIDTH_TILES &&
                            world[leafY][leafX] === Blocks.AIR) {
                            world[leafY][leafX] = Blocks.LEAVES;
                        }
                    }
                }
                // Estende o tronco para baixo
                if (y + 1 < WORLD_HEIGHT_TILES && world[y + 1][x] === Blocks.AIR) {
                    world[y + 1][x] = Blocks.WOOD; // Estende o tronco para baixo
                }
            }
        }
    }

    // Adiciona algumas camadas de areia flutuante (para testar gravidade de areia)
    for (let x = 10; x < 20; x++) {
        world[WORLD_HEIGHT_TILES / 2 - 3][x] = Blocks.SAND;
    }
}

// --- Jogador ---
const player = {
    x: WORLD_WIDTH_TILES / 2 * TILE_SIZE, // Posição X em pixels
    y: (WORLD_HEIGHT_TILES / 2 - 5) * TILE_SIZE, // Posição Y em pixels (acima da grama)
    width: TILE_SIZE * 0.8, // Largura um pouco menor que o bloco
    height: TILE_SIZE * 1.8, // Altura para ocupar quase 2 blocos
    color
