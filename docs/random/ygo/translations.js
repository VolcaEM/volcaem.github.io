// translation.js

import {
    langIndex,
    setLangIndex
} from './config.js';

export const langEnglish = 0;
export const langItalian = 1;

// Define your translations array for each supported language.
// For example, index 0 for English and index 1 for Italian.
export const translations = [{
        collectionheader: "My Yu-Gi-Oh Card Collection",
        filterNamePlaceholder: "Card Name",
        allTypes: "All Types",
        monsters: "Monsters",
        monster: "Monster",
        vanilla: "— Vanilla",
        effect: "— Effect",
        ritual: "— Ritual",
        fusion: "— Fusion",
        synchro: "— Synchro",
        xyz: "— XYZ",
        cxyz: "— CXYZ",
        fxyz: "— FXYZ",
        sxyz: "— SXYZ",
        pendulum: "— Pendulum",
        link: "— Link",
        spells: "Spells",
        spell: "Spell",
        normal: "— Normal",
        quickplay: "— Quick-Play",
        continuous: "— Continuous",
        equip: "— Equip",
        terrain: "— Terrain",
        traps: "Traps",
        trap: "Trap",
        counter: "— Counter",
        token: "Token",
        tuner: "Tuner",
        toon: "Toon",

        rarityAll: "All Rarities",
        common: "Common",
        rare: "Rare",
        superrare: "Super Rare",
        ultrarare: "Ultra Rare",
        secretrare: "Secret Rare",
        ghostrare: "Ghost Rare",
        collectorsrare: "Collector's Rare",
        ultimaterare: "Ultimate Rare",
        fake: "FAKE",

        qualityAll: "All Conditions",
        nearmint: "Near Mint",
        slightlyplayed: "Slightly Played",
        moderatelyplayed: "Moderately Played",
        played: "Played",
        poor: "Poor",
        unknowngood: "Unknown (good)",
        unknownbad: "Unknown (bad)",

        languageAll: "All Languages",
        IT: "IT",
        EN: "EN",
        JP: "JP",
        DE: "DE",
        ES: "ES",
        FR: "FR",

        editionAll: "All Editions",
        firstedition: "First Edition",
        first: "First",
        limitededition: "Limited Edition",
        limited: "Limited",
        standardedition: "Standard Edition",
        standard: "Standard",

        sortNone: "No Sorting",
        sortType: "Sort by Type",
        sortName: "Sort by Name",
        sortRarity: "Sort by Rarity",
        sortCondition: "Sort by Condition",
        sortLanguage: "Sort by Language",
        sortEdition: "	Sort by Edition",
        sortPricePaid: "Sort by Money Spent",
        sortMarketPrice: "Sort by Market Price",
        sortPackId: "Sort by PackID",
        sortDateObtained: "Sort by Acquirement Date",
        sortLocation: "Sort by Location",
        sortComments: "Sort by Comments",

        applyFilters: "Apply Filters",
        reverseOrder: "Reverse Table",

        showDebug: "Show Debug",

        tableImage: "IMG",
        tableName: "Name",
        tableType: "Type",
        tableRarity: "Rarity",
        tableQuality: "Condition",
        tableLanguage: "Lang.",
        tableEdition: "Edit.",
        tableSpent: "Spent",
        tableMarket: "Market",
        tableId: "ID",
        tableObtained: "Obt.",
        tableLocation: "Loc.",
        tableComments: "Comments",
        tableWiki: "Wiki",

        unknown: "Unknown",
        nothingfound: "Nothing found. Check CSV or filter conditions!",
        showingentries: "NUMBER results.",
        showingcards: " --- Showing NUMBER results. Unique: UNIQUENUM",
        csverror: "Error loading CSV file. Please check your CSV file.",

        go: "Go",
        pageLanguage: "Display Language: ",
        loadcsv: "Load CSV",
        totalSpent: "Total spent: ",
        product: "Product",
        sleeves: "Sleeves",
        structuredeck: "Structure Deck",
        storage: "Storage",
        fieldcentercard: "Field Center Card",
        empty: "Empty",
        album: "Album",
        none: "",
    },
    {
        collectionheader: "La mia collezione di carte di Yu-Gi-Oh",
        filterNamePlaceholder: "Nome della Carta",
        allTypes: "Tutti i Tipi",
        monsters: "Mostri",
        monster: "Mostro",
        vanilla: "— Vanilla",
        effect: "— con Effetto",
        ritual: "— Rituale",
        fusion: "— Fusione",
        synchro: "— Synchro",
        xyz: "— XYZ",
        cxyz: "—— CXYZ",
        fxyz: "—— FXYZ",
        sxyz: "—— SXYZ",
        pendulum: "— Pendulum",
        link: "— Link",
        spells: "Magie",
        spell: "Magia",
        normal: "— Normale",
        quickplay: "— Rapida",
        continuous: "— Continua",
        equip: "— Equipaggiamento",
        terrain: "— Terreno",
        traps: "Trappole",
        trap: "Trappola",
        counter: "— Contro-Trappola",
        token: "Token",
        tuner: "Tuner",
        toon: "Toon",

        rarityAll: "Tutte le Rarità",
        common: "Comune",
        rare: "Rara",
        superrare: "Super Rara",
        ultrarare: "Ultra Rara",
        secretrare: "Rara Segreta",
        ghostrare: "Rara Ghost",
        collectorsrare: "Rara da Collezione",
        ultimaterare: "Rara Definitiva",
        fake: "FALSA",

        qualityAll: "Tutte le Condizioni",
        nearmint: "Near Mint",
        slightlyplayed: "Slightly Played",
        moderatelyplayed: "Moderately Played",
        played: "Played",
        poor: "Poor",
        unknowngood: "Boh (buona)",
        unknownbad: "Boh (scarsa)",

        languageAll: "Tutte le Lingue",
        IT: "IT",
        EN: "EN",
        JP: "JP",
        DE: "DE",
        ES: "ES",
        FR: "FR",

        editionAll: "Tutte le Edizioni",
        firstedition: "Prima Edizione",
        first: "Prima",
        limitededition: "Edizione Limitata",
        limited: "Limitata",
        standardedition: "Edizione Standard",
        standard: "Standard",

        sortNone: "Nessun Ordinamento",
        sortName: "Ordina per Nome",
        sortType: "Ordina per Tipo",
        sortRarity: "Ordina per Rarità",
        sortCondition: "Ordina per Stato",
        sortLanguage: "Ordina per Lingua",
        sortEdition: "Ordina per Edizione",
        sortPricePaid: "Ordina per Prezzo",
        sortMarketPrice: "Ordina per Prezzo di Mercato",
        sortPackId: "Ordina per ID Pacchetto",
        sortDateObtained: "Ordina per Data di Acquisizione",
        sortLocation: "Ordina per Posizione",
        sortComments: "Ordina per Commenti",

        applyFilters: "Applica Filtri",
        reverseOrder: "Inverti Tabella",

        showDebug: "Mostra Debug",

        tableImage: "IMG",
        tableName: "Nome",
        tableType: "Tipo",
        tableRarity: "Rarità",
        tableQuality: "Stato",
        tableLanguage: "Lingua",
        tableEdition: "Ediz.",
        tableSpent: "Spesi",
        tableMarket: "Mercato",
        tableId: "ID",
        tableObtained: "Otten.",
        tableLocation: "Posiz.",
        tableComments: "Commenti",
        tableWiki: "Wiki",

        unknown: "Boh",
        nothingfound: "Nessun risultato. Ricontrolla il CSV o i filtri!",
        showingentries: "NUMBER risultati.",
        showingcards: " --- NUMBER risultati. Unici: UNIQUENUM",
        csverror: "Errore nel caricamento del CSV. Ricontrollalo",

        go: "Vai",
        pageLanguage: "Lingua Pagina: ",
        loadcsv: "Carica CSV",
        totalSpent: "Totale: ",
        product: "Prodotto",
        sleeves: "Sleeves",
        structuredeck: "Structure Deck",
        storage: "Storage",
        fieldcentercard: "Field Center Card",
        empty: "Vuoto/a",
        album: "Album",
        none: "",
    }
];

/**
 * Applies the translations to the elements on the page.
 * Elements that need translation should have a data attribute "data-translation-key".
 * If the element is an input with a placeholder, it will update the placeholder.
 *
 * @param {number} langIndex - The index of the language to use.
 */
export function applyTranslations(newlangIndex) {
    setLangIndex(newlangIndex);
    const strings = translations[langIndex];
    document.querySelectorAll("[data-translation-key]").forEach(el => {
        const key = el.getAttribute("data-translation-key");
        if (strings[key]) {
            // For input elements with placeholders
            if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
                el.setAttribute("placeholder", strings[key]);
            } else {
                el.textContent = strings[key];
            }
        }
    });
}