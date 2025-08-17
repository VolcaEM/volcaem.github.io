import {
    langIndex,
} from './config.js';

import {
    translations,
    langEnglish,
    langItalian,
    applyTranslations,
} from './translations.js';

import {
    gameTranslations,
} from './translations_games.js';

export var currentGame = "";

export function setCurrentGame(value) {
    currentGame = value;
}

export const gameDetectors = {
    "Yu-Gi-Oh": /\b(Monster|Spell|Trap)\b/i,
    "Pokémon": /\b(Pokémon|Pokemon|Base|Stage|GX|V|EX|Trainer|Energy)\b/i,
    "Vanguard": /\b(Grade\s?[0-4]|Unit|Trigger|G-Unit|G-Guardian|Stride|Order|Guard(ian)?|Imaginary Gift|Overdress|Persona Ride)\b/i,
    "Digimon": /\b(Digimon|Digi[- ]Egg|Tamer|Option|Token)\b/i,
    "Magic: The Gathering": /\b(MTG|Magic:?\s*The\s*Gathering|Creature|Enchant\s+Creature|Enchantment|Artifact|Planeswalker|Land(?:\s+Base)?|Instant|Sorcery|Legendary|Saga|Commander)\b/i,
    "One Piece": /\bDON!!\b|\b(?:Straw Hat Crew|Supernovas|Navy|Revolutionary Army|Animal Kingdom Pirates|Big Mom Pirates|Whitebeard Pirates|Red-Hair Pirates|Donquixote Pirates|Heart Pirates|Kid Pirates|Baroque Works|CP9|CP0|Seven Warlords of the Sea|Fish-Man|Merfolk|Mink Tribe|Skypiea|Wano|Dressrosa|Cross Guild|Buggy's Delivery|Blackbeard Pirates|East Blue|Alabasta|Thriller Bark Pirates|Firetank Pirates|Sun Pirates|Kuja Pirates|Roger Pirates|Spade Pirates|Flying Six|Impel Down|World Pirates|Straw Hat Grand Fleet)\b/i,
    "Dragon Ball Super": /\b(?:Universe\s?(?:[1-9]|1[0-2])|Saiyan|Earthling|Namekian|Frieza Race|Android|Majin|God|Angel|Demon Realm Race|Battle|Unison|Leader|Awaken|Sparking|Double Strike|Triple Strike|Critical|Deflect|Blocker|Barrier|Unique|Offering|Successor|Arrival|Union|Overlord|Over Realm|Dark Over Realm)\b/i,
};

export function loadGameTranslations(game) {
    const entries = gameTranslations[game.toLowerCase()];
    if (!entries) {
        console.warn(`No translations for ${game}`);
        return;
    }

    // 1) Seed both English (0) and Italian (1)
    entries.forEach(([key, en, it]) => {
        translations[langEnglish][key] = en;
        translations[langItalian][key] = it;
    });

    // 2) Fetch the user's dropdown choice and reapply
    const sel = document.getElementById("selectedLanguage");
    const idx = sel ? sel.selectedIndex : langIndex;
    applyTranslations(idx);
}