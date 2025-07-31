// pokemon.js

/**
 * Returns the badge-rule array for Pokémon cards.
 * Each rule maps a translated prefix to a CSS class.
 */
export function getPkmBadgeRules() {
    return [
        // Card sub‐types
        { key: 'base', cssClass: 'badge-type-base' },
        { key: 'stage-1', cssClass: 'badge-type-stage1' },
        { key: 'stage-2', cssClass: 'badge-type-stage2' },
        { key: 'mega', cssClass: 'badge-type-mega' },
        { key: 'energy', cssClass: 'badge-type-energy' },
        { key: 'special-energy', cssClass: 'badge-type-specialenergy' },
        { key: 'supporter', cssClass: 'badge-type-supporter' },
        { key: 'trainer', cssClass: 'badge-type-trainer' },
        { key: 'item', cssClass: 'badge-type-item' },
        { key: 'stadium', cssClass: 'badge-type-stadium' },
        { key: 'none', cssClass: 'badge-type-none' },

        // Pokémon “type” badges
        { key: 'grass', cssClass: 'badge-type-grass' },
        { key: 'fire', cssClass: 'badge-type-fire' },
        { key: 'water', cssClass: 'badge-type-water' },
        { key: 'lightning', cssClass: 'badge-type-lightning' },
        { key: 'psychic', cssClass: 'badge-type-psychic' },
        { key: 'fighting', cssClass: 'badge-type-fighting' },
        { key: 'darkness', cssClass: 'badge-type-darkness' },
        { key: 'metal', cssClass: 'badge-type-metal' },
        { key: 'dragon', cssClass: 'badge-type-dragon' },
        { key: 'colorless', cssClass: 'badge-type-colorless' },
        { key: "fairy", cssClass: 'badge-type-fairy' },
    ];
}

/**
 * Filter dropdown options for Pokémon card “types” and stages.
 * Format: [ displayLabel, filterKey ]
 */
export const pokemonFilterOptions = [
    ['', 'allTypes'],
    ['Pokémon', 'pokemon'],

    // Divider: stages of Pokémon
    ['───── STAGES ─────', null],
    ['Base', 'base'],
    ['Stage 1', 'stage-1'],
    ['Stage 2', 'stage-2'],
    ['MEGA', 'mega'],

    // Divider: elemental / color types
    ['───── TYPES ─────', null],
    ['Grass', 'grass'],
    ['Fire', 'fire'],
    ['Water', 'water'],
    ['Lightning', 'lightning'],
    ['Psychic', 'psychic'],
    ['Fighting', 'fighting'],
    ['Darkness', 'darkness'],
    ['Metal', 'metal'],
    ['Dragon', 'dragon'],
    ['Fairy', 'fairy'],
    ['Colorless', 'colorless'],

    // Divider: other TCG cards
    ['───── OTHER CARDS ─────', null],
    ['Energy', 'energy'],
    ['Special Energy', 'special-energy'],
    ['Supporter', 'supporter'],
    ['Trainer', 'trainer'],
    ['Item', 'item'],
    ['Stadium', 'stadium'],
    ['None', 'none'],
];


/**
 * Filter dropdown options for Pokémon card rarities.
 * Format: [ displayLabel, rarityKey ]
 */
export const pokemonRarityOptions = [
    ['', 'rarityAll'],
    ['Common', 'common'],
    ['Uncommon', 'uncommon'],
    ['Rare', 'rare'],
    ['Holo Rare', 'holorare'],
    ['Ultra Rare', 'ultrarare'],
    ['Secret Rare', 'secretrare'],
    ['Unknown', 'unknown'],
];