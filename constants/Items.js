// constants/Items.js

// Tipos de Item
export const ITEM_TYPE = {
    MOLDURA: 'moldura',
    CABECA: 'cabeca',
    MAO: 'mao',
};

// Banco de Dados Visual
export const ITEMS_DB = {
    // Exemplo: ID do Banco : { imagem, tipo }
    1: { type: ITEM_TYPE.MOLDURA, source: require('../assets/items/chaves.png') },
    11: { type: ITEM_TYPE.CABECA, source: require('../assets/items/chapeu_palha.png') },
    21: { type: ITEM_TYPE.MAO, source: require('../assets/items/espada.png') },
};