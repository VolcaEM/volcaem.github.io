export function getYgoBadgeRules() {
    return [
        { key: 'normal', cssClass: 'badge-type-normal' },

        { key: 'cxyz', cssClass: 'badge-type-cxyz' },
        { key: 'fxyz', cssClass: 'badge-type-cxyz' },
        { key: 'sxyz', cssClass: 'badge-type-cxyz' },
        { key: 'xyz', cssClass: 'badge-type-xyz' },

        { key: 'effect', cssClass: 'badge-type-effect' },
        { key: 'continuous', cssClass: 'badge-type-continuous' },
        { key: 'vanilla', cssClass: 'badge-type-vanilla' },
        { key: 'quickplay', cssClass: 'badge-type-quickplay' },
        { key: 'equip', cssClass: 'badge-type-equip' },
        { key: 'terrain', cssClass: 'badge-type-terrain' },

        { key: 'fusion', cssClass: 'badge-type-fusion' },
        { key: 'synchro', cssClass: 'badge-type-synchro' },
        { key: 'counter', cssClass: 'badge-type-counter' },
        { key: 'ritual', cssClass: 'badge-type-ritual' },
        { key: 'pendulum', cssClass: 'badge-type-pendulum' },
        { key: 'link', cssClass: 'badge-type-link' },
        { key: 'link-1', cssClass: 'badge-type-link' },
        { key: 'link-2', cssClass: 'badge-type-link' },
        { key: 'link-3', cssClass: 'badge-type-link' },
        { key: 'link-4', cssClass: 'badge-type-link' },
        { key: 'link-5', cssClass: 'badge-type-link' },
        { key: 'link-6', cssClass: 'badge-type-link' },
        { key: 'tuner', cssClass: 'badge-type-tuner' },
        { key: 'toon', cssClass: 'badge-type-toon' },
    ];
}


export const yugiohFilterOptions = [
    ['', 'allTypes'],
    ['───── MONSTERS ─────', null],
    ['Monster', 'monsters'],
    // Divider: stages of Pokémon
    ['Monster (Vanilla)', 'vanilla'],
    ['Monster (Effect)', 'effect'],
    ['Monster (Ritual)', 'ritual'],
    ['Monster (Fusion)', 'fusion'],
    ['Monster (Synchro)', 'synchro'],
    ['Monster (XYZ)', 'xyz'],
    ['Monster (CXYZ)', 'cxyz'],
    ['Monster (FXYZ)', 'fxyz'],
    ['Monster (SXYZ)', 'sxyz'],
    ['Monster (Pendulum)', 'pendulum'],
    ['Monster (Link)', 'link'],
    ['Monster (Link-1)', 'link-1'],
    ['Monster (Link-2)', 'link-2'],
    ['Monster (Link-3)', 'link-3'],
    ['Monster (Link-4)', 'link-4'],
    ['Monster (Link-5)', 'link-5'],
    ['Monster (Link-6)', 'link-6'],
    ['───── MONSTER SUBTYPES ─────', null],
    ['Monster (Tuner)', 'tuner'],
    ['Monster (Toon)', 'toon'],
    ['───── SPELLS ─────', null],
    ['Spell', 'spells'],
    ['Spell (Normal)', 'normal'],
    ['Spell (Quick-Play)', 'quickplay'],
    ['Spell (Continuous)', 'continuous'],
    ['Spell (Equip)', 'equip'],
    ['Spell (Terrain)', 'terrain'],
    ['Spell (Ritual)', 'spell-ritual'],
    ['───── TRAPS ─────', null],
    ['Trap', 'traps'],
    ['Trap (Normal)', 'normal'],
    ['Trap (Continuous)', 'continuous'],
    ['Trap (Counter)', 'counter'],
    ['───── OTHER ─────', null],
    ['Token', 'token']
];

export const yugiohRarityOptions = [
    ["", "rarityAll"],
    ["Common", "common"],
    ["Rare", "rare"],
    ["Super Rare", "superrare"],
    ["Ultra Rare", "ultrarare"],
    ["Secret Rare", "secretrare"],
    ["Ghost Rare", "ghostrare"],
    ["Collectors Rare", "collectorsrare"],
    ["Ultimate Rare", "ultimaterare"],
    ["Unknown", "unknown"],
    ["Fake", "fake"]
];