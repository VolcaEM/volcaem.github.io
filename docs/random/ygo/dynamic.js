import {
    translations,
    langEnglish,
    langItalian,
} from './translations.js';

export var loadedFile = false;

export var has_debug_checkbox = document.getElementById("debugCheckbox") != null;

export let currentDisplayedCards = [];

export function setLoadedFile(value) {
    loadedFile = value;
}

export function setCurrentDisplayedCards(value) {
    currentDisplayedCards = value;
}

export function reverseCurrentDisplayedCards() {
    currentDisplayedCards.reverse();
}

export function populateFilterTypeSelect(selectElement, options, translate, currentLang) {

    if (selectElement == null) {
        console.warn("selectElement is null!");
        return;
    }

    // Backup original innerHTML
    const originalHTML = selectElement.innerHTML;

    // Clear options
    selectElement.innerHTML = '';

    if (options.length === 0) {
        console.log("No options?");
    }

    options.forEach(([label, key]) => {
        const opt = document.createElement('option');

        if (key === null) {
            opt.disabled = true;
            opt.textContent = label;
            //console.log("Key is NULL");
        } else {
            opt.value = label; // Use label for internal logic
            opt.dataset.translationKey = key;

            let translatedText = label;

            if (typeof translate === 'function') {
                translatedText = translate(key);

                //console.log(`${key} --> ${translatedText}`);
                //console.log("English has this key: " + (translations[langEnglish][key] != null) + ", set to " + (translations[langEnglish][key] || "NULL"));
                //console.log("New text: " + translatedText);
            } else {
                //console.log("Translate: not a function");
            }

            opt.textContent = translatedText;
        }

        selectElement.appendChild(opt);
    });
}

export function updateTotalSpent() {
    // Filter cards with pricePaid > 0
    const cardsWithPrice = currentDisplayedCards.filter(card => card.pricePaid > 0);

    // Sum of pricePaid from cards with actual payment
    let total = cardsWithPrice.reduce((sum, card) => sum + card.pricePaid, 0);

    // Add 5% fee only to valid purchases
    total += total * 0.05;

    // Collect unique dates with at least one valid purchase
    const validDates = new Set(cardsWithPrice
        .map(card => card.dateObtained)
        .filter(date => date) // Avoid undefined/null dates
    );

    // Add €0.35 per unique valid date
    total += validDates.size * 0.35;

    // Format using browser’s locale; force EUR or change as needed
    const formatted = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "EUR"
        })
        .format(total);

    document.getElementById("totalSpentValue")
        .textContent = formatted;
}