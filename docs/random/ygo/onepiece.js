// onepiece.js

/**
 * Returns badge rules for One Piece Card Game cards.
 * Maps keywords to CSS classes for visual badges.
 */
export function getOnePieceBadgeRules() {
    return [
        // 🧩 Card Types
        { key: 'leader', cssClass: 'badge-type-leader' },
        { key: 'character', cssClass: 'badge-type-character' },
        { key: 'event', cssClass: 'badge-type-event' },
        { key: 'stage', cssClass: 'badge-type-stage' },
        { key: 'don', cssClass: 'badge-type-don' },
        { key: 'token', cssClass: 'badge-type-token' },
        { key: 'none', cssClass: 'badge-type-none' },

        // 🎨 Colors
        { key: 'red', cssClass: 'badge-color-red' },
        { key: 'green', cssClass: 'badge-color-green' },
        { key: 'blue', cssClass: 'badge-color-blue' },
        { key: 'purple', cssClass: 'badge-color-purple' },
        { key: 'black', cssClass: 'badge-color-black' },
        { key: 'yellow', cssClass: 'badge-color-yellow' },
        { key: 'multicolor', cssClass: 'badge-color-multicolor' },

        // ⚔️ Attributes
        { key: 'slash', cssClass: 'badge-attr-slash' },
        { key: 'strike', cssClass: 'badge-attr-strike' },
        { key: 'ranged', cssClass: 'badge-attr-ranged' },
        { key: 'special', cssClass: 'badge-attr-special' },
        { key: 'wisdom', cssClass: 'badge-attr-wisdom' },

        // 🏴 Traits (crews/factions/world)
        { key: 'straw-hat-crew', cssClass: 'badge-trait-straw-hat-crew' },
        { key: 'supernovas', cssClass: 'badge-trait-supernovas' },
        { key: 'navy', cssClass: 'badge-trait-navy' },
        { key: 'revolutionary-army', cssClass: 'badge-trait-revolutionary-army' },
        { key: 'animal-kingdom-pirates', cssClass: 'badge-trait-animal-kingdom-pirates' },
        { key: 'big-mom-pirates', cssClass: 'badge-trait-big-mom-pirates' },
        { key: 'whitebeard-pirates', cssClass: 'badge-trait-whitebeard-pirates' },
        { key: 'red-hair-pirates', cssClass: 'badge-trait-red-hair-pirates' },
        { key: 'donquixote-pirates', cssClass: 'badge-trait-donquixote-pirates' },
        { key: 'heart-pirates', cssClass: 'badge-trait-heart-pirates' },
        { key: 'kid-pirates', cssClass: 'badge-trait-kid-pirates' },
        { key: 'baroque-works', cssClass: 'badge-trait-baroque-works' },
        { key: 'cp9', cssClass: 'badge-trait-cp9' },
        { key: 'cp0', cssClass: 'badge-trait-cp0' },
        { key: 'seven-warlords-of-the-sea', cssClass: 'badge-trait-seven-warlords-of-the-sea' },
        { key: 'fish-man', cssClass: 'badge-trait-fish-man' },
        { key: 'merfolk', cssClass: 'badge-trait-merfolk' },
        { key: 'mink-tribe', cssClass: 'badge-trait-mink-tribe' },
        { key: 'skypiea', cssClass: 'badge-trait-skypiea' },
        { key: 'wano', cssClass: 'badge-trait-wano' },
        { key: 'dressrosa', cssClass: 'badge-trait-dressrosa' },
        { key: 'cross-guild', cssClass: 'badge-trait-cross-guild' },
        { key: 'buggys-delivery', cssClass: 'badge-trait-buggys-delivery' },
        { key: 'blackbeard-pirates', cssClass: 'badge-trait-blackbeard-pirates' },
        { key: 'east-blue', cssClass: 'badge-trait-east-blue' },
        { key: 'alabasta', cssClass: 'badge-trait-alabasta' },
        { key: 'thriller-bark-pirates', cssClass: 'badge-trait-thriller-bark-pirates' },
        { key: 'firetank-pirates', cssClass: 'badge-trait-firetank-pirates' },
        { key: 'sun-pirates', cssClass: 'badge-trait-sun-pirates' },
        { key: 'kuja-pirates', cssClass: 'badge-trait-kuja-pirates' },
        { key: 'roger-pirates', cssClass: 'badge-trait-roger-pirates' },
        { key: 'spade-pirates', cssClass: 'badge-trait-spade-pirates' },
        { key: 'flying-six', cssClass: 'badge-trait-flying-six' },
        { key: 'impel-down', cssClass: 'badge-trait-impel-down' },
        { key: 'world-pirates', cssClass: 'badge-trait-world-pirates' },
        { key: 'straw-hat-grand-fleet', cssClass: 'badge-trait-straw-hat-grand-fleet' },
    ];
}

/**
 * Filter dropdown options for One Piece types, colors, attributes, and traits.
 * Format: [ label, key ]
 */
export const onepieceFilterOptions = [
    ['', 'allTypes'],

    ['───── CARD TYPES ─────', null],
    ['Leader', 'leader'],
    ['Character', 'character'],
    ['Event', 'event'],
    ['Stage', 'stage'],
    ['DON!!', 'don'],
    ['Token', 'token'],

    ['───── COLORS ─────', null],
    ['Red', 'red'],
    ['Green', 'green'],
    ['Blue', 'blue'],
    ['Purple', 'purple'],
    ['Black', 'black'],
    ['Yellow', 'yellow'],
    ['Multicolor', 'multicolor'],

    ['───── ATTRIBUTES ─────', null],
    ['Slash', 'slash'],
    ['Strike', 'strike'],
    ['Ranged', 'ranged'],
    ['Special', 'special'],
    ['Wisdom', 'wisdom'],

    ['───── TRAITS ─────', null],
    ['Straw Hat Crew', 'straw-hat-crew'],
    ['Supernovas', 'supernovas'],
    ['Navy', 'navy'],
    ['Revolutionary Army', 'revolutionary-army'],
    ['Animal Kingdom Pirates', 'animal-kingdom-pirates'],
    ['Big Mom Pirates', 'big-mom-pirates'],
    ['Whitebeard Pirates', 'whitebeard-pirates'],
    ['Red-Hair Pirates', 'red-hair-pirates'],
    ['Donquixote Pirates', 'donquixote-pirates'],
    ['Heart Pirates', 'heart-pirates'],
    ['Kid Pirates', 'kid-pirates'],
    ['Baroque Works', 'baroque-works'],
    ['CP9', 'cp9'],
    ['CP0', 'cp0'],
    ['Seven Warlords of the Sea', 'seven-warlords-of-the-sea'],
    ['Fish-Man', 'fish-man'],
    ['Merfolk', 'merfolk'],
    ['Mink Tribe', 'mink-tribe'],
    ['Skypiea', 'skypiea'],
    ['Wano', 'wano'],
    ['Dressrosa', 'dressrosa'],
    ['Cross Guild', 'cross-guild'],
    ["Buggy's Delivery", 'buggys-delivery'],
    ['Blackbeard Pirates', 'blackbeard-pirates'],
    ['East Blue', 'east-blue'],
    ['Alabasta', 'alabasta'],
    ['Thriller Bark Pirates', 'thriller-bark-pirates'],
    ['Firetank Pirates', 'firetank-pirates'],
    ['Sun Pirates', 'sun-pirates'],
    ['Kuja Pirates', 'kuja-pirates'],
    ['Roger Pirates', 'roger-pirates'],
    ['Spade Pirates', 'spade-pirates'],
    ['Flying Six', 'flying-six'],
    ['Impel Down', 'impel-down'],
    ['World Pirates', 'world-pirates'],
    ['Straw Hat Grand Fleet', 'straw-hat-grand-fleet'],
];

/**
 * Filter dropdown options for One Piece rarities.
 * Format: [ label, key ]
 */
export const onepieceRarityOptions = [
    ['', 'rarityAll'],
    ['Common', 'common'],
    ['Uncommon', 'uncommon'],
    ['Rare', 'rare'],
    ['Super Rare', 'superrare'],
    ['Secret Rare', 'secretrare'],
    ['Leader (L)', 'leader'],
    ['Promo', 'promo'],
    ['Parallel / Alt Art', 'parallel'],
    ['Special (SP / Manga)', 'special'],
    ['DON!!', 'don'],
    ['Unknown', 'unknown'],
];