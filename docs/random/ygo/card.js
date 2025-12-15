import {
    langIndex,
    setLangIndex
} from './config.js';

import {
    currentGame,
    gameDetectors,
    setCurrentGame,
    loadGameTranslations,
} from './detect.js';

import {
    populateFilterTypeSelect,
} from './dynamic.js';

import {
    translations,
} from './translations.js';

import {
    yugiohFilterOptions,
    yugiohRarityOptions,
} from './yugioh.js';

import {
    pokemonFilterOptions,
    pokemonRarityOptions,
} from './pokemon.js';

import {
    vanguardFilterOptions,
    vanguardRarityOptions,
} from './vanguard.js';

import {
    digimonFilterOptions,
    digimonRarityOptions,
} from './digimon.js';

import {
    mtgFilterOptions,
    mtgRarityOptions,
} from './mtg.js';

import {
    onepieceFilterOptions,
    onepieceRarityOptions,
} from './onepiece.js';

import {
    dbsFilterOptions,
    dbsRarityOptions,
} from './dbs.js';

import {
    displayCards,
} from './csv.js';

////////////////////////////////
// Card Classes
////////////////////////////////

export class Card {
    constructor(data) {
        this.name = data.name;
        this.type = data.type;
        this.rarity = data.rarity;
        this.quality = data.quality;
        this.language = data.language;
        this.edition = data.edition;
        this.pricePaid = parseFloat(data.pricePaid) || 0.00;
        this.marketPrice = data.marketPrice || 0.00;
        this.id = data.id;
        this.packId = data.packId;
        this.dateObtained = data["Date Obtained"];
        this.location = data.location;
        this.comments = data.comments;
        this.wikiUrl = data["Wiki URL"] || "";
        this.photoURL = data.photoURL || "";
    }

    // Returns the image URL – if no external URL is provided, uses local images/cards/<id>.png.
    getImageUrl() {
        return this.photoURL ? this.photoURL : `images/cards/${this.id}.png`;
    }
}

export class CardManager {
    constructor() {
        this.cards = [];
        this.loaded = false;
    }

    loadCards(csvText) {
        const lines = csvText.split("\n");
        if (lines.length <= 1) return;

        const headers = lines[0].split("|")
            .map(h => h.trim());
        const typeIdx = headers.indexOf("Type");

        this.cards = [];
        setCurrentGame(""); // reset before detection

        let currentgamehtml = document.getElementById("detectedgame");

        // Skip the first line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            if (line.length <= 14) {
                continue;
            }

            const fields = line.split("|")
                .map(f => f.trim());
            const data = Object.fromEntries(headers.map((h, idx) => [h, fields[idx] || ""]));

            // Game detection on first unmatched card
            if (!currentGame) {
                const type = data["Type"];
                for (const [game, pattern] of Object.entries(gameDetectors)) {
                    if (pattern.test(type)) {
                        const filterSelect = document.getElementById('filterType');
                        const filterRarity = document.getElementById('filterRarity');
                        setCurrentGame(game);
                        if (currentgamehtml) {
                            currentgamehtml.innerText = "Detected game: " + currentGame;
                        }
                        loadGameTranslations(currentGame);

                        if (filterSelect != null && filterRarity != null) {
                            switch (currentGame) {
                                case "Yu-Gi-Oh": {
                                    populateFilterTypeSelect(filterSelect, yugiohFilterOptions, key => translations[langIndex][key]);
                                    populateFilterTypeSelect(filterRarity, yugiohRarityOptions, key => translations[langIndex][key]);

                                    let gsd = document.getElementById("gameSpecificDiv");

                                    // Create the wrapper span
                                    const genesysControl = document.createElement('span');
                                    genesysControl.id = "genesysControl";

                                    // Create the checkbox
                                    const checkbox = document.createElement('input');
                                    checkbox.type = "checkbox";
                                    checkbox.id = "genesysCheckbox";
                                    checkbox.checked = false;

                                    // Create the label span with translation key
                                    const labelSpan = document.createElement('span');
                                    const translationKey = "useGenesysFormat";
                                    labelSpan.setAttribute("data-translation-key", translationKey);

                                    // Inject the translated text immediately
                                    if (translations && translations[langIndex] && translations[langIndex][translationKey]) {
                                        labelSpan.textContent = translations[langIndex][translationKey];
                                    } else {
                                        labelSpan.textContent = translationKey; // fallback
                                    }

                                    // Assemble the structure
                                    genesysControl.appendChild(checkbox);
                                    genesysControl.appendChild(document.createTextNode(" ")); // spacing
                                    genesysControl.appendChild(labelSpan);

                                    // Append to your target container
                                    gsd.appendChild(genesysControl);
                                }
                                break;

                                case "Pokémon":
                                    populateFilterTypeSelect(filterSelect, pokemonFilterOptions, key => translations[langIndex][key]);
                                    populateFilterTypeSelect(filterRarity, pokemonRarityOptions, key => translations[langIndex][key]);
                                    break;

                                case "Vanguard":
                                    populateFilterTypeSelect(filterSelect, vanguardFilterOptions, key => translations[langIndex][key]);
                                    populateFilterTypeSelect(filterRarity, vanguardRarityOptions, key => translations[langIndex][key]);
                                    break;

                                case "Digimon":
                                    populateFilterTypeSelect(filterSelect, digimonFilterOptions, key => translations[langIndex][key]);
                                    populateFilterTypeSelect(filterRarity, digimonRarityOptions, key => translations[langIndex][key]);
                                    break;

                                case "Magic: The Gathering":
                                    populateFilterTypeSelect(filterSelect, mtgFilterOptions, key => translations[langIndex][key]);
                                    populateFilterTypeSelect(filterRarity, mtgRarityOptions, key => translations[langIndex][key]);
                                    break;

                                case "One Piece":
                                    populateFilterTypeSelect(filterSelect, onepieceFilterOptions, key => translations[langIndex][key]);
                                    populateFilterTypeSelect(filterRarity, onepieceRarityOptions, key => translations[langIndex][key]);
                                    break;

                                case "Dragon Ball Super":
                                    populateFilterTypeSelect(filterSelect, dbsFilterOptions, key => translations[langIndex][key]);
                                    populateFilterTypeSelect(filterRarity, dbsRarityOptions, key => translations[langIndex][key]);

                                default:
                                    console.warn(`Unsupported game: ${currentGame}`);
                                    break;
                            }

                            const option1 = document.createElement('option');
                            option1.textContent = "───── COMMON ─────";
                            option1.value = "";
                            option1.disabled = true;

                            const option2 = document.createElement('option');
                            option2.textContent = translations[langIndex]['products'];
                            option2.value = "product";

                            filterSelect.appendChild(option1);
                            filterSelect.appendChild(option2);
                        }

                        break;
                    }
                }
            }

            // Construct and store the card
            this.cards.push(new Card({
                name: data["Name"],
                type: data["Type"],
                rarity: data["Rarity"],
                quality: data["Quality"],
                language: data["Language"],
                edition: data["Edition type"],
                pricePaid: data["Price I paid for it"],
                marketPrice: data["Current market price"],
                id: data["ID"].replaceAll(/None|NONE/g, ""),
                packId: data["Pack ID"].replaceAll(/None|NONE/g, ""),
                "Date Obtained": data["Date Obtained"],
                location: data["Location"],
                comments: data["Comments"],
                photoURL: data["Photo URL"],
                "Wiki URL": data["Wiki URL"]
            }));
        }

        if (!currentGame) {
            console.log("Could not identify the current game.");
            if (currentgamehtml) {
                currentgamehtml.innerText = "Detected game: Unknown";
            }
            currentGame = "Unknown";
        }

        let sort_alphabetically = true;

        // Your existing alphabetical sort…
        if (sort_alphabetically) {
            const normalize = s => s
                .replace("CXyz ", "")
                .replace(/Number [CSF]|Numero [CSF]/g, translations[langIndex]["number"]);
            this.cards.sort((a, b) =>
                normalize(a.name)
                .localeCompare(normalize(b.name), 'it', {
                    numeric: true,
                    sensitivity: 'base'
                })
            );
        }

        this.loaded = true;
    }


    filterCards(filters) {
        return this.cards.filter(card => {

            let invertFilterCheckbox = document.getElementById("invertFilterCheckbox");

            if (filters.name && !card.name.toLowerCase()
                .replaceAll("—— ", "")
                .replaceAll("— ", "")
                .includes(filters.name.toLowerCase()
                    .replaceAll("—— ", "")
                    .replaceAll("— ", "")))
                return false;

            if (filters.type) {
                const cardTypeStr = card.type.toLowerCase().trim();
                const cardBase = card.type.replace(/\(([^)]+)\)/, "").trim().toLowerCase();

                let cardBadges = [];
                const badgeMatch = card.type.match(/\(([^)]+)\)/);
                if (badgeMatch) {
                    cardBadges = badgeMatch[1].split("/")
                        .map(token => token.trim().toLowerCase());
                }

                let match = true; // assume match until proven otherwise

                if (filters.type.indexOf("(") !== -1) {
                    // Full-type match with parentheses
                    const filterBase = filters.type.replace(/\(([^)]+)\)/, "").trim().toLowerCase();
                    let filterBadges = [];
                    const filterBadgeMatch = filters.type.match(/\(([^)]+)\)/);
                    if (filterBadgeMatch) {
                        filterBadges = filterBadgeMatch[1].split("/")
                            .map(token => token.trim().toLowerCase());
                    }

                    // Base must match
                    if (cardBase !== filterBase) match = false;

                    // Each badge in the filter must be present
                    for (const token of filterBadges) {
                        if (currentGame === "Yu-Gi-Oh") {
                            if (token === "xyz") {
                                if (!cardTypeStr.includes("xyz)")) match = false;
                            } else if (token === "link") {
                                if (!cardTypeStr.includes("(link")) match = false;
                            } else {
                                if (!cardBadges.includes(token)) match = false;
                            }
                        } else {
                            if (!cardBadges.includes(token)) match = false;
                        }
                    }
                } else {
                    // Partial matching: single or multiple tokens
                    const filterTokens = filters.type.toLowerCase().trim().includes("/") ?
                        filters.type.toLowerCase().split("/").map(t => t.trim()) : [filters.type.toLowerCase().trim()];

                    // At least one token must match
                    match = filterTokens.some(token =>
                        cardBase.includes(token) || cardBadges.some(badge => badge.includes(token))
                    );
                }

                // Apply inversion
                if (invertFilterCheckbox.checked) {
                    match = !match;
                }

                if (!match) return false;
            }

            if (filters.rarity) {
				//console.log("Filter active for rarity:", filters.rarity);

				const filterValue = filters.rarity.replaceAll("—", "").trim().toLowerCase().replaceAll(" ", "").replaceAll("'", "").trim().toLowerCase();
				const cardValue = card.rarity.replaceAll("—", "").replaceAll(" ", "").replaceAll("'", "").trim().toLowerCase();
				const translationValue = translations[0][filterValue].replaceAll("—", "").replaceAll(" ", "").replaceAll("'", "").trim().toLowerCase();

				//console.log("Computed filterValue:", filterValue);
				//console.log("Translation lookup:", translationValue);
				//console.log("Card rarity value:", cardValue);
				//console.log("Invert filter checked:", invertFilterCheckbox.checked);

				let result = false;
				result = cardValue === translationValue;
				
				if (invertFilterCheckbox.checked) {
                    result = !result;
                }
				
				return result;
			}


            if (filters.quality) {
                if (!invertFilterCheckbox.checked) {
                    if (card.quality !== filters.quality) {
                        return false;
                    }
                } else {
                    return card.quality !== filters.quality;
                }
            }

            // --- New: Filter by language
            if (filters.language) {
                if (!invertFilterCheckbox.checked) {
                    if (card.language.toLowerCase() !== filters.language.toLowerCase()) {
                        return false;
                    }
                } else {
                    return card.language.toLowerCase() !== filters.language.toLowerCase();
                }
            }

            // --- New: Filter by edition (or edition type)
            if (filters.edition) {
                if (!invertFilterCheckbox.checked) {
                    if (card.edition.toLowerCase() !== filters.edition.toLowerCase()) {
                        return false;
                    }
                } else {
                    return card.edition.toLowerCase() !== filters.edition.toLowerCase();
                }
            }

            return true;
        });
    }

    findCardById(id) {
        return this.cards.find(card => card.id === id);
    }

    findCardsById(cardId) {
        return this.cards.filter(card => card.id === cardId);
    }

    findCardsByIdOrName(cardId) {
        const params = new URLSearchParams(window.location.search);
        const checkName = params.has('checkname');

        // Find the reference card for this ID
        const referenceCard = this.cards.find(c => c.id === cardId);

        return this.cards.filter(card => {
            const idMatches = card.id === cardId;
            const nameMatches =
                checkName &&
                referenceCard &&
                card.name === referenceCard.name;

            return idMatches || nameMatches;
        });
    }


}

export const manager = new CardManager();