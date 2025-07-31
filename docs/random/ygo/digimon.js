// digimon.js

/**
 * Returns the badge‐rule array for Digimon cards.
 * Each rule maps a key to a CSS class.
 */
export function getDigimonBadgeRules() {
    return [
        // Card categories
        { key: 'digimon', cssClass: 'badge-type-digimon' },
        { key: 'digi-egg', cssClass: 'badge-type-digi-egg' },
        { key: 'tamer', cssClass: 'badge-type-tamer' },
        { key: 'option', cssClass: 'badge-type-option' },
        { key: 'token', cssClass: 'badge-type-token' },

        // Forms / subtypes
        { key: 'in-training', cssClass: 'badge-form-intraining' },
        { key: 'rookie', cssClass: 'badge-form-rookie' },
        { key: 'champion', cssClass: 'badge-form-champion' },
        { key: 'ultimate', cssClass: 'badge-form-ultimate' },
        { key: 'mega', cssClass: 'badge-form-mega' },

        // Colors / attributes
        { key: 'red', cssClass: 'badge-color-red' },
        { key: 'blue', cssClass: 'badge-color-blue' },
        { key: 'yellow', cssClass: 'badge-color-yellow' },
        { key: 'green', cssClass: 'badge-color-green' },
        { key: 'black', cssClass: 'badge-color-black' },
        { key: 'purple', cssClass: 'badge-color-purple' },
        { key: 'white', cssClass: 'badge-color-white' },

        // Rarities
        { key: 'common', cssClass: 'badge-rarity-common' },
        { key: 'uncommon', cssClass: 'badge-rarity-uncommon' },
        { key: 'rare', cssClass: 'badge-rarity-rare' },
        { key: 'superrare', cssClass: 'badge-rarity-superrare' },
        { key: 'secretrare', cssClass: 'badge-rarity-secretrare' },
        { key: 'promo', cssClass: 'badge-rarity-promo' },
        { key: 'parallelart', cssClass: 'badge-rarity-parallelart' },

        { key: 'cs', cssClass: 'badge-trait-cs' },
        { key: 'accel', cssClass: 'badge-trait-accel' },
    ];
}

/**
 * Filter dropdown options for Digimon card “types”, forms, colors, and rarities.
 * Format: [ displayLabel, filterKey ]
 */

export const digimonFilterOptions = [
    ['', 'allTypes'],

    // Card categories
    ['Digimon', 'digimon'],
    ['Digi-Egg', 'digi-egg'],
    ['Tamer', 'tamer'],
    ['Option', 'option'],
    ['Token', 'token'],

    // Divider: forms / subtypes
    ['───── FORMS ─────', null],
    ['In-Training', 'in-training'],
    ['Rookie', 'rookie'],
    ['Champion', 'champion'],
    ['Ultimate', 'ultimate'],
    ['Mega', 'mega'],

    // Divider: colors / attributes
    ['───── COLORS ─────', null],
    ['Red', 'red'],
    ['Blue', 'blue'],
    ['Yellow', 'yellow'],
    ['Green', 'green'],
    ['Black', 'black'],
    ['Purple', 'purple'],
    ['White', 'white'],

    // Divider: traits / series
    ['───── TRAITS ─────', null],
    ['CS', 'cs'],
    ['ACCEL', 'accel'],
];

/**
 * Filter dropdown options for Digimon card rarities.
 * Format: [ displayLabel, rarityKey ]
 */
export const digimonRarityOptions = [
    ['', 'rarityAll'],
    ['Common', 'common'],
    ['Uncommon', 'uncommon'],
    ['Rare', 'rare'],
    ['Super Rare', 'superrare'],
    ['Secret Rare', 'secretrare'],
    ['Promo', 'promo'],
    ['Parallel Art', 'parallelart'],
];