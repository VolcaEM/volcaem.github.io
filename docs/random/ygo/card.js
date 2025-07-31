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
                        switch (currentGame) {
                            case "Yu-Gi-Oh":
                                populateFilterTypeSelect(filterSelect, yugiohFilterOptions, key => translations[langIndex][key]);
                                populateFilterTypeSelect(filterRarity, yugiohRarityOptions, key => translations[langIndex][key]);
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

                            default:
                                console.warn(`Unsupported game: ${currentGame}`);
                                break;
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
    }


    filterCards(filters) {
        return this.cards.filter(card => {
            if (filters.name && !card.name.toLowerCase()
                .replaceAll("—— ", "")
                .replaceAll("— ", "")
                .includes(filters.name.toLowerCase()
                    .replaceAll("—— ", "")
                    .replaceAll("— ", "")))
                return false;

            if (filters.type) {
                // Normalize and extract card type details.
                const cardTypeStr = card.type.toLowerCase()
                    .trim();
                const cardBase = card.type.replace(/\(([^)]+)\)/, "")
                    .trim()
                    .toLowerCase();
                let cardBadges = [];
                const badgeMatch = card.type.match(/\(([^)]+)\)/);
                if (badgeMatch) {
                    // Use "/" as delimiter, so "Pendulum/Effect" becomes ["pendulum", "effect"].
                    cardBadges = badgeMatch[1].split("/")
                        .map(token => token.trim()
                            .toLowerCase());
                }

                // If the filter string includes parentheses, assume a full-type match.
                if (filters.type.indexOf("(") !== -1) {
                    const filterTypeStr = filters.type.toLowerCase()
                        .trim();
                    // Extract the base from the filter.
                    const filterBase = filters.type.replace(/\(([^)]+)\)/, "")
                        .trim()
                        .toLowerCase();
                    let filterBadges = [];
                    const filterBadgeMatch = filters.type.match(/\(([^)]+)\)/);
                    if (filterBadgeMatch) {
                        filterBadges = filterBadgeMatch[1].split("/")
                            .map(token => token.trim()
                                .toLowerCase());
                    }

                    // Base must match exactly.
                    if (cardBase !== filterBase) return false;

                    // Each badge in the filter must be present in the card.
                    for (const token of filterBadges) {
                        // Special handling in case you use "xyz" as shorthand.
                        if (token === "xyz") {
                            if (!cardTypeStr.includes("xyz)")) return false;
                        } else {
                            if (!cardBadges.includes(token)) return false;
                        }
                    }
                } else {
                    // Partial matching: the filter may be a single term or multiple tokens separated by "/"
                    const filterTypeStr = filters.type.toLowerCase()
                        .trim();
                    let filterTokens = filterTypeStr.includes("/") ?
                        filterTypeStr.split("/")
                        .map(t => t.trim()) : [filterTypeStr];

                    // For each filter token, at least one must appear in the card base or one of its badges.
                    for (const token of filterTokens) {
                        if (
                            !cardBase.includes(token) &&
                            !cardBadges.some(badge => badge.includes(token))
                        ) {
                            return false;
                        }
                    }
                }
            }



            if (filters.rarity && card.rarity !== filters.rarity)
                return false;

            if (filters.quality && card.quality !== filters.quality)
                return false;

            // --- New: Filter by language
            if (filters.language && card.language.toLowerCase() !== filters.language.toLowerCase())
                return false;

            // --- New: Filter by edition (or edition type)
            if (filters.edition && card.edition.toLowerCase() !== filters.edition.toLowerCase())
                return false;

            return true;
        });
    }

    findCardById(id) {
        return this.cards.find(card => card.id === id);
    }

    findCardsById(cardId) {
        return this.cards.filter(card => card.id === cardId);
    }
}

export const manager = new CardManager();