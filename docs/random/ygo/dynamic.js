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
    // 1. Only cards with a paid price
    const cardsWithPrice = currentDisplayedCards.filter(card => card.pricePaid > 0);

    // 2. Sum of all item prices (regardless of position)
    const itemsTotal = cardsWithPrice.reduce((sum, card) => sum + card.pricePaid, 0);

    // 3. Filter only CTZ cards for tax calculations
    const ctzCards = cardsWithPrice.filter(card => card.location.includes('CTZ'));

    // 4. 5% fee on each CTZ card’s price
    const feeOnCtzPrices = ctzCards.reduce((sum, card) => sum + card.pricePaid * 0.05, 0);

    // 5. €0.35 fee per unique date that has at least one CTZ card
    const uniqueCtzDates = new Set(
        ctzCards
        .map(card => card.dateObtained)
        .filter(date => date) // drop undefined/null
    );
    const dateFee = uniqueCtzDates.size * 0.35;

    // 6. Total taxes = percentage fee + date‐based fee
    const taxesTotal = feeOnCtzPrices + dateFee;

    // 7. Grand total
    const grandTotal = itemsTotal + taxesTotal;

    // 8. Format everything as EUR
    const formatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "EUR"
    });

    const formattedTotal = formatter.format(grandTotal);
    const formattedItems = formatter.format(itemsTotal);
    const formattedTaxes = formatter.format(taxesTotal);

    // 9. Inject the breakdown string
    document.getElementById("totalSpentValue").textContent =
        `Total spent: ${formattedTotal} (${formattedItems} for the items, ${formattedTaxes} in taxes)`;
}