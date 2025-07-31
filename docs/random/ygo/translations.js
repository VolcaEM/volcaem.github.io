// translation.js

import {
    langIndex,
    setLangIndex
} from './config.js';

import {
    baseTranslations,
} from './translations_base.js';

import {
    gameTranslations,
} from './translations_games.js';

export const langEnglish = 0;
export const langItalian = 1;

export var translations = [];
translations[langEnglish] = {};
translations[langItalian] = {};

// Lazy‐load guard: true if we haven’t yet pushed base keys
function needInitBase() {
    return Object.keys(translations[langEnglish])
        .length === 0;
}

export function addToTranslationArray(key, enValue, itValue) {
    translations[langEnglish][key] = enValue;
    translations[langItalian][key] = itValue;
}


/**
 * Applies the translations to the elements on the page.
 * Elements that need translation should have a data attribute "data-translation-key".
 * If the element is an input with a placeholder, it will update the placeholder.
 *
 * @param {number} langIndex - The index of the language to use.
 */
export function applyTranslations(newLangIndex) {
    // 1) update your global index
    setLangIndex(newLangIndex);

    // 2) pick the right language map
    const strings = translations[newLangIndex];
    if (!strings) {
        console.error(`No translations loaded for index ${newLangIndex}`);
        //console.log('translations array:', translations);
        return;
    }

    // 3) walk every element that wants translation
    document.querySelectorAll('[data-translation-key]')
        .forEach(el => {
            const key = el.getAttribute('data-translation-key');
            const txt = strings[key];

            if (txt != null) {
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    el.setAttribute('placeholder', txt);
                } else {
                    el.textContent = txt;
                }
            } else {
                console.warn(`Missing translation for "${key}" @ lang ${newLangIndex}`);
                //console.groupCollapsed('🛠 translations dump');
                //console.log('translations:', translations);
                //console.log(`translations[${newLangIndex}]:`, strings);
                //console.groupEnd();
            }
        });
}

Object.entries(baseTranslations)
    .forEach(([key, [en, it]]) =>
        addToTranslationArray(key, en, it)
    );