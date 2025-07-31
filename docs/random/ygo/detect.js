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
    "Digimon": /\b(Digimon|Digi[- ]Egg|Tamer|Option|Token)\b/i
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