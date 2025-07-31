// vanguard.js

import { translations, langEnglish } from './translations.js';
import { clean } from './utils.js';

/**
 * Returns the badge-rule array for Vanguard cards.
 * Each rule maps a translated prefix to a CSS class.
 */
export function getVanguardBadgeRules() {
    return [
        // Main/Sub types
        { key: 'unit', cssClass: 'badge-type-unit' },
        { key: 'trigger', cssClass: 'badge-type-trigger' },
        { key: 'g-unit', cssClass: 'badge-type-g-unit' },
        { key: 'g-guardian', cssClass: 'badge-type-g-guardian' },
        { key: 'order', cssClass: 'badge-type-order' },
        { key: 'token', cssClass: 'badge-type-token' },

        // Races
        { key: 'human', cssClass: 'badge-race-human' },
        { key: 'beast-deity', cssClass: 'badge-race-beast-deity' },
        { key: 'beast', cssClass: 'badge-race-beast' },
        { key: 'machine-deity', cssClass: 'badge-race-machine-deity' },
        { key: 'machine', cssClass: 'badge-race-machine' },
        { key: 'angel', cssClass: 'badge-race-angel' },
        { key: 'demon', cssClass: 'badge-race-demon' },
        { key: 'succubus', cssClass: 'badge-race-succubus' },
        { key: 'vampire', cssClass: 'badge-race-vampire' },
        { key: 'dragon', cssClass: 'badge-race-dragon' },
        { key: 'undead', cssClass: 'badge-race-undead' },
        { key: 'psychic', cssClass: 'badge-race-psychic' },
        { key: 'mermaid', cssClass: 'badge-race-mermaid' },
        { key: 'elf', cssClass: 'badge-race-elf' },
        { key: 'quintuplet', cssClass: 'badge-race-quintuplet' },
        { key: 'dragoroid', cssClass: 'badge-race-dragoroid' },
        { key: 'ghost', cssClass: 'badge-race-ghost' },
        { key: 'bioroid', cssClass: 'badge-race-bioroid' },
        { key: 'battleroid', cssClass: 'badge-race-battleroid' },
        { key: 'workeroid', cssClass: 'badge-race-workeroid' },
        { key: 'cyberoid', cssClass: 'badge-race-cyberoid' },
        { key: 'cyber-dragon', cssClass: 'badge-race-cyberDragon' },
        { key: 'cyber-beast', cssClass: 'badge-race-cyberBeast' },
        { key: 'cyber-fairy', cssClass: 'badge-race-cyberFairy' },
        { key: 'cyber-golem', cssClass: 'badge-race-cyberGolem' },
        { key: 'gearoid', cssClass: 'badge-race-gearoid' },
        { key: 'gear-beast', cssClass: 'badge-race-gearBeast' },
        { key: 'gear-dragon', cssClass: 'badge-race-gearDragon' },
        { key: 'gear-colossus', cssClass: 'badge-race-gearColossus' },
        { key: 'dryad', cssClass: 'badge-race-dryad' },
        { key: 'elemental', cssClass: 'badge-race-elemental' },
        { key: 'gnome', cssClass: 'badge-race-gnome' },
        { key: 'sylph', cssClass: 'badge-race-sylph' },
        { key: 'goblin', cssClass: 'badge-race-goblin' },
        { key: 'ogre', cssClass: 'badge-race-ogre' },
        { key: 'chimera', cssClass: 'badge-race-chimera' },
        { key: 'skeleton', cssClass: 'badge-race-skeleton' },
        { key: 'zombie', cssClass: 'badge-race-zombie' },
        { key: 'kraken', cssClass: 'badge-race-kraken' },
        { key: 'alien', cssClass: 'badge-race-alien' },
        { key: 'angelroid', cssClass: 'badge-race-angelroid' },
        { key: 'demon-lord', cssClass: 'badge-race-demonLord' },
        { key: 'astral-deity', cssClass: 'badge-race-astralDeity' },
        { key: 'astral-poet', cssClass: 'badge-race-astralPoet' },
        { key: 'mask-of-domination', cssClass: 'badge-race-maskOfDomination' },
        { key: 'shadow-army', cssClass: 'badge-race-shadowArmy' },
        { key: 'valkyrie', cssClass: 'badge-race-valkyrie' },
        { key: 'hero', cssClass: 'badge-race-hero' },
        { key: 'noble', cssClass: 'badge-race-noble' },
        { key: 'royal-beast', cssClass: 'badge-race-royalBeast' },
        { key: 'warbeast', cssClass: 'badge-race-warBeast' },
        { key: 'high-beast', cssClass: 'badge-race-highBeast' },
        { key: 'zodiac-time-beast', cssClass: 'badge-race-zodiacTimeBeast' },
        { key: 'zeroth-dragon', cssClass: 'badge-race-zerothDragon' },

        // Grades
        { key: 'grade-0', cssClass: 'badge-grade-0' },
        { key: 'grade-1', cssClass: 'badge-grade-1' },
        { key: 'grade-2', cssClass: 'badge-grade-2' },
        { key: 'grade-3', cssClass: 'badge-grade-3' },
        { key: 'grade-4', cssClass: 'badge-grade-4' },

        // Special mechanics
        { key: 'stride', cssClass: 'badge-stride' },
        { key: 'imaginary-gift', cssClass: 'badge-imaginary-gift' },
        { key: 'overdress', cssClass: 'badge-overdress' },
        { key: 'persona-ride', cssClass: 'badge-persona-ride' },

        // Nations
        { key: 'dragon-empire', cssClass: 'badge-nation-dragon-empire' },
        { key: 'dark-states', cssClass: 'badge-nation-dark-states' },
        { key: 'brandt-gate', cssClass: 'badge-nation-brandt-gate' },
        { key: 'keter-sanctuary', cssClass: 'badge-nation-keter-sanctuary' },
        { key: 'stoicheia', cssClass: 'badge-nation-stoicheia' },
        { key: 'lyrical-monasterio', cssClass: 'badge-nation-lyrical-monasterio' },

        // Clans
        { key: 'royal-paladin', cssClass: 'badge-clan-royal-paladin' },
        { key: 'kagero', cssClass: 'badge-clan-kagero' },
        { key: 'aqua-force', cssClass: 'badge-clan-aqua-force' },
        { key: 'shadow-paladin', cssClass: 'badge-clan-shadow-paladin' },
        { key: 'genesis', cssClass: 'badge-clan-genesis' },
        { key: 'gold-paladin', cssClass: 'badge-clan-gold-paladin' },
        { key: 'oracle-think-tank', cssClass: 'badge-clan-oracle-think-tank' },
        { key: 'dark-irregulars', cssClass: 'badge-clan-dark-irregulars' },
        { key: 'narukami', cssClass: 'badge-clan-narukami' },
        { key: 'bermuda-triangle', cssClass: 'badge-clan-bermuda-triangle' },
        { key: 'great-nature', cssClass: 'badge-clan-great-nature' },
        { key: 'neo-nectar', cssClass: 'badge-clan-neo-nectar' },
        { key: 'megacolony', cssClass: 'badge-clan-megacolony' },
        { key: 'granblue', cssClass: 'badge-clan-granblue' },
        { key: 'dimension-police', cssClass: 'badge-clan-dimension-police' },
        { key: 'spike-brothers', cssClass: 'badge-clan-spike-brothers' },
        { key: 'angel-feather', cssClass: 'badge-clan-angel-feather' },
        { key: 'nubatama', cssClass: 'badge-clan-nubatama' },
        { key: 'link-joker', cssClass: 'badge-clan-link-joker' },
        { key: 'tachikaze', cssClass: 'badge-clan-tachikaze' },
        { key: 'pale-moon', cssClass: 'badge-clan-pale-moon' },
        { key: 'murakumo', cssClass: 'badge-clan-murakumo' },
        { key: 'nova-grappler', cssClass: 'badge-clan-nova-grappler' },
        { key: 'gear-chronicle', cssClass: 'badge-clan-gear-chronicle' },
        { key: 'cray-elemental', cssClass: 'badge-clan-cray-elemental' }
    ];
}


/**
 * Filter dropdown options for Vanguard card categories.
 * Format: [ displayLabel, filterKey ]
 */
export const vanguardFilterOptions = [
    ['', 'allTypes'],

    // Divider: unit types
    ['───── UNIT TYPES ─────', null],
    ['Unit', 'unit'],
    ['Trigger Unit', 'trigger'],
    ['G-Unit', 'g-unit'],
    ['G-Guardian', 'g-guardian'],
    ['Order', 'order'],
    ['Token', 'token'],

    // Divider: races
    ['───── RACES ─────', null],
    ['Human', 'human'],
    ['Angel', 'angel'],
    ['Demon', 'demon'],
    ['Elf', 'elf'],
    ['Succubus', 'succubus'],
    ['Vampire', 'vampire'],
    ['Dragoroid', 'dragoroid'],
    ['Mermaid', 'mermaid'],
    ['Quintuplet', 'quintuplet'],
    ['Cyberoid', 'cyberoid'],
    ['Bioroid', 'bioroid'],
    ['Warbeast', 'warbeast'],

    // Divider: mechanics
    ['───── MECHANICS ─────', null],
    ['Grade 0', 'grade-0'],
    ['Grade 1', 'grade-1'],
    ['Grade 2', 'grade-2'],
    ['Grade 3', 'grade-3'],
    ['Grade 4', 'grade-4'],
    ['Stride', 'stride'],
    ['Imaginary Gift', 'imaginary-gift'],
    ['Overdress', 'overdress'],
    ['Persona Ride', 'persona-ride'],

    // Divider: nations
    ['───── NATIONS ─────', null],
    ['Dragon Empire', 'dragon-empire'],
    ['Dark States', 'dark-states'],
    ['Brandt Gate', 'brandt-gate'],
    ['Keter Sanctuary', 'keter-sanctuary'],
    ['Stoicheia', 'stoicheia'],
    ['Lyrical Monasterio', 'lyrical-monasterio'],

    // Divider: clans
    ['───── CLANS ─────', null],
    ['Royal Paladin', 'royal-paladin'],
    ['Kagero', 'kagero'],
    ['Aqua Force', 'aqua-force'],
    ['Shadow Paladin', 'shadow-paladin'],
    ['Genesis', 'genesis'],
    ['Gold Paladin', 'gold-paladin'],
    ['Oracle Think Tank', 'oracle-think-tank'],
    ['Dark Irregulars', 'dark-irregulars'],
    ['Narukami', 'narukami'],
    ['Bermuda Triangle', 'bermuda-triangle'],
    ['Great Nature', 'great-nature'],
    ['Neo Nectar', 'neo-nectar'],
    ['Megacolony', 'megacolony'],
    ['Granblue', 'granblue'],
    ['Dimension Police', 'dimension-police'],
    ['Spike Brothers', 'spike-brothers'],
    ['Angel Feather', 'angel-feather'],
    ['Nubatama', 'nubatama'],
    ['Link Joker', 'link-joker'],
    ['Tachikaze', 'tachikaze'],
];

/**
 * Filter dropdown options for Vanguard card rarities.
 * Format: [ displayLabel, rarityKey ]
 */
export const vanguardRarityOptions = [
    ['', 'rarityAll'],
    ['Common', 'c'],
    ['Rare', 'r'],
    ['Double Rare', 'rr'],
    ['Triple Rare', 'rrr'],
    ['Premium Rare', 'pr'],
    ['Generation Rare', 'gr'],
    ['Special Generation Rare', 'sgr'],
    ['Vanguard Rare', 'vr'],
    ['Special Vanguard Rare', 'svr'],
    ['Origin Rare', 'or'],
    ['Image Rare', 'imr'],
    ['Secret Rare', 'sec'],
    ['Reprint', 're'],
    ['Zeroth Rare', 'zr'],
    ['Wedding SP', 'wsp'],
    ['Promo', 'promo']
];