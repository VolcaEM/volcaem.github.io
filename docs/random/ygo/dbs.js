// dbs.js
/** 
 * Restituisce le regole badge per Dragon Ball Super Card Game.
 * Ogni regola mappa una key a una classe CSS per il badge.
 */
export function getDBSBadgeRules() {
    return [
        // 🌌 Universes
        { key: 'universe-1', cssClass: 'badge-universe-1' },
        { key: 'universe-2', cssClass: 'badge-universe-2' },
        { key: 'universe-3', cssClass: 'badge-universe-3' },
        { key: 'universe-4', cssClass: 'badge-universe-4' },
        { key: 'universe-5', cssClass: 'badge-universe-5' },
        { key: 'universe-6', cssClass: 'badge-universe-6' },
        { key: 'universe-7', cssClass: 'badge-universe-7' },
        { key: 'universe-8', cssClass: 'badge-universe-8' },
        { key: 'universe-9', cssClass: 'badge-universe-9' },
        { key: 'universe-10', cssClass: 'badge-universe-10' },
        { key: 'universe-11', cssClass: 'badge-universe-11' },
        { key: 'universe-12', cssClass: 'badge-universe-12' },

        // 🥋 Razze / Personaggi
        { key: 'saiyan', cssClass: 'badge-race-saiyan' },
        { key: 'earthling', cssClass: 'badge-race-earthling' },
        { key: 'namekian', cssClass: 'badge-race-namekian' },
        { key: 'frieza-race', cssClass: 'badge-race-frieza' },
        { key: 'android', cssClass: 'badge-race-android' },
        { key: 'majin', cssClass: 'badge-race-majin' },
        { key: 'god', cssClass: 'badge-race-god' },
        { key: 'angel', cssClass: 'badge-race-angel' },
        { key: 'demon-realm-race', cssClass: 'badge-race-demonrealm' },
        { key: 'monster', cssClass: 'badge-race-monster' },
        { key: 'alien', cssClass: 'badge-race-alien' },

        // 🎴 Tipi di carta
        { key: 'battle', cssClass: 'badge-type-battle' },
        { key: 'extra', cssClass: 'badge-type-extra' },
        { key: 'unison', cssClass: 'badge-type-unison' },
        { key: 'leader', cssClass: 'badge-type-leader' },
        { key: 'z-leader', cssClass: 'badge-type-zleader' },
        { key: 'z-battle', cssClass: 'badge-type-zbattle' },
        { key: 'z-extra', cssClass: 'badge-type-zextra' },

        // 💠 Parole chiave / Meccaniche
        { key: 'awaken', cssClass: 'badge-keyword-awaken' },
        { key: 'sparking', cssClass: 'badge-keyword-sparking' },
        { key: 'double-strike', cssClass: 'badge-keyword-doublestrike' },
        { key: 'triple-strike', cssClass: 'badge-keyword-triplestrike' },
        { key: 'critical', cssClass: 'badge-keyword-critical' },
        { key: 'deflect', cssClass: 'badge-keyword-deflect' },
        { key: 'blocker', cssClass: 'badge-keyword-blocker' },
        { key: 'barrier', cssClass: 'badge-keyword-barrier' },
        { key: 'unique', cssClass: 'badge-keyword-unique' },
        { key: 'offering', cssClass: 'badge-keyword-offering' },
        { key: 'successor', cssClass: 'badge-keyword-successor' },
        { key: 'arrival', cssClass: 'badge-keyword-arrival' },
        { key: 'union', cssClass: 'badge-keyword-union' },
        { key: 'overlord', cssClass: 'badge-keyword-overlord' },
        { key: 'over-realm', cssClass: 'badge-keyword-overrealm' },
        { key: 'dark-over-realm', cssClass: 'badge-keyword-darkoverrealm' },

        // Events
        { key: 'tournament-of-power', cssClass: 'badge-event-tournamentofpower' },

        // 🎨 Colori
        { key: 'red', cssClass: 'badge-color-red' },
        { key: 'blue', cssClass: 'badge-color-blue' },
        { key: 'green', cssClass: 'badge-color-green' },
        { key: 'yellow', cssClass: 'badge-color-yellow' },
        { key: 'black', cssClass: 'badge-color-black' },
        { key: 'multicolor', cssClass: 'badge-color-multicolor' },

        // 🏆 Rarità
        { key: 'common', cssClass: 'badge-rarity-common' },
        { key: 'uncommon', cssClass: 'badge-rarity-uncommon' },
        { key: 'rare', cssClass: 'badge-rarity-rare' },
        { key: 'super-rare', cssClass: 'badge-rarity-superrare' },
        { key: 'special-rare', cssClass: 'badge-rarity-specialrare' },
        { key: 'secret-rare', cssClass: 'badge-rarity-secretrare' },
        { key: 'promo', cssClass: 'badge-rarity-promo' },
        { key: 'pr', cssClass: 'badge-rarity-pr' },
    ];
}

/**
 * Opzioni filtro per i tipi e categorie DBS.
 * Formato: [ etichetta, chiaveFiltro ]
 */
export const dbsFilterOptions = [
    ['', 'allTypes'],
    ['───── UNIVERSE ─────', null],
    ['Universe 1', 'universe-1'],
    ['Universe 2', 'universe-2'],
    ['Universe 3', 'universe-3'],
    ['Universe 4', 'universe-4'],
    ['Universe 5', 'universe-5'],
    ['Universe 6', 'universe-6'],
    ['Universe 7', 'universe-7'],
    ['Universe 8', 'universe-8'],
    ['Universe 9', 'universe-9'],
    ['Universe 10', 'universe-10'],
    ['Universe 11', 'universe-11'],
    ['Universe 12', 'universe-12'],

    ['───── RACE ─────', null],
    ['Saiyan', 'saiyan'],
    ['Earthling', 'earthling'],
    ['Namekian', 'namekian'],
    ['Frieza Race', 'frieza-race'],
    ['Android', 'android'],
    ['Majin', 'majin'],
    ['God', 'god'],
    ['Angel', 'angel'],
    ['Demon Realm Race', 'demon-realm-race'],
    ['Monster', 'monster'],
    ['Alien', 'alien'],

    ['───── CARD TYPE ─────', null],
    ['Battle', 'battle'],
    ['Extra', 'extra'],
    ['Unison', 'unison'],
    ['Leader', 'leader'],
    ['Z-Leader', 'z-leader'],
    ['Z-Battle', 'z-battle'],
    ['Z-Extra', 'z-extra'],

    ['───── EVENT ─────', null],
    ['Tournament of Power', 'tournament-of-power'],


    ['───── COLOR ─────', null],
    ['Red', 'red'],
    ['Blue', 'blue'],
    ['Green', 'green'],
    ['Yellow', 'yellow'],
    ['Black', 'black'],
    ['Multicolor', 'multicolor'],
];

/**
 * Opzioni filtro per le rarità DBS.
 */
export const dbsRarityOptions = [
    ['', 'rarityAll'],
    ['Common', 'common'],
    ['Uncommon', 'uncommon'],
    ['Rare', 'rare'],
    ['Super Rare', 'super-rare'],
    ['Special Rare', 'special-rare'],
    ['Secret Rare', 'secret-rare'],
    ['Promo', 'promo'],
    ['PR', 'pr'],
];