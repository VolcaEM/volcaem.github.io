// mtg.js

/** 
 * Returns badge rules for MTG cards.
 * Maps keywords to CSS classes for visual badges. 
 */
export function getMTGBadgeRules() {
    return [
        // 🧩 Card Types
        { key: 'creature', cssClass: 'badge-type-creature' },
        { key: 'instant', cssClass: 'badge-type-instant' },
        { key: 'sorcery', cssClass: 'badge-type-sorcery' },
        { key: 'enchantment', cssClass: 'badge-type-enchantment' },
        { key: 'aura', cssClass: 'badge-type-aura' },
        { key: 'artifact', cssClass: 'badge-type-artifact' },
        { key: 'planeswalker', cssClass: 'badge-type-planeswalker' },
        { key: 'land', cssClass: 'badge-type-land' },
        { key: 'legendary', cssClass: 'badge-type-legendary' },
        { key: 'saga', cssClass: 'badge-type-saga' },
        { key: 'commander', cssClass: 'badge-type-commander' },
        { key: 'token', cssClass: 'badge-type-token' },
        { key: 'none', cssClass: 'badge-type-none' },

        // 🎨 Color Identity
        { key: 'white', cssClass: 'badge-color-white' },
        { key: 'blue', cssClass: 'badge-color-blue' },
        { key: 'black', cssClass: 'badge-color-black' },
        { key: 'red', cssClass: 'badge-color-red' },
        { key: 'green', cssClass: 'badge-color-green' },
        { key: 'multicolor', cssClass: 'badge-color-multicolor' },
        { key: 'colorless', cssClass: 'badge-color-colorless' }
    ];
}


/**
 * Filter dropdown options for MTG types.
 * Format: [ label, key ]
 */
export const mtgFilterOptions = [
    ['', 'allTypes'],
    ['───── CARD TYPES ─────', null],
    ['Creature', 'creature'],
    ['Instant', 'instant'],
    ['Sorcery', 'sorcery'],
    ['Enchantment', 'enchantment'],
    ['Artifact', 'artifact'],
    ['Aura', 'aura'],
    ['Planeswalker', 'planeswalker'],
    ['Land', 'land'],
    ['Legendary', 'legendary'],
    ['Saga', 'saga'],
    ['Commander', 'commander'],
    ['Token', 'token'],
    ['───── COLOR IDENTITY ─────', null], // 🆕 Separator
    ['White', 'white'],
    ['Blue', 'blue'],
    ['Black', 'black'],
    ['Red', 'red'],
    ['Green', 'green'],
    ['Multicolor', 'multicolor'],
    ['Colorless', 'colorless']
];


/**
 * Filter dropdown options for MTG rarities.
 * Format: [ label, key ]
 */
export const mtgRarityOptions = [
    ['', 'rarityAll'],
    ['Common', 'common'],
    ['Uncommon', 'uncommon'],
    ['Rare', 'rare'],
    ['Mythic Rare', 'mythicrare'],
    ['Promo', 'promo'],
    ['Masterpiece', 'masterpiece'],
    ['Special', 'special'],
    ['Timeshifted', 'timeshifted'],
    ['Bonus', 'bonus'],
    ['Token', 'token'],
    ['Unknown', 'unknown'],
];