import {
    langIndex,
} from './config.js';

import {
    currentGame,
} from './detect.js';

import {
    translations,
} from './translations.js';

import {
    parseDate,
} from './utils.js';

// Strip emojis/"None", parse floats, and compute profit
export function precomputeNumericFields(card) {
    card._marketPrice = parseFloat(
        (card.marketPrice || "0.00")
        .replace(/⬆️|⬇️|➡️|None/g, "")
        .trim()
    ) || 0;

    card._pricePaid = Number(card.pricePaid) || 0;
    card._profit = card._marketPrice - card._pricePaid;
}

// Map of sort keys to comparator functions
export const comparators = {
    // String‐based sorts
    name: compareByName,
    type: compareByType,
    Id: compareById,
    location: (a, b) => a.location.localeCompare(b.location),
    language: (a, b) => a.language.localeCompare(b.language),
    comments: compareByCommentPresenceAndName,

    // Numeric sorts (ascending)
    pricePaid: (a, b) => b._pricePaid - a._pricePaid,
    marketPrice: (a, b) => (a._marketPrice || 0.00) - (b._marketPrice || 0.00),

    // Profit sort (descending)
    stonks: (a, b) => b.pricePaid > 0.00 && Math.max(0.00, b._profit - a._profit),

    // Date sort
    dateObtained: (a, b) => parseDate(a.dateObtained) - parseDate(b.dateObtained),

    // Custom‐order sorts
    condition: compareByCondition,
    edition: compareByEdition,
};

export function compareByCommentPresenceAndName(a, b) {

    //console.log("compareComment");

    return (a.comments.length > 0 || b.comments.length > 0) && a.comments.trim().localeCompare(b.comments.trim(), undefined, { numeric: true });
}


// 1) Correct JS syntax
export function compareById(a, b) {
    // Split at the dash; if there is no dash, sufX will be undefined
    const [preA, sufA = ""] = a.id.split("-");
    const [preB, sufB = ""] = b.id.split("-");

    // 2) Compare the prefixes first (e.g. "ALIN" vs "CBLZ")
    const prefixCompare = preA.trim().localeCompare(preB.trim());
    if (prefixCompare !== 0) {
        return prefixCompare;
    }

    // 3) Same prefix: try numeric compare of the suffix
    const nA = parseInt(sufA.trim(), 10);
    const nB = parseInt(sufB.trim(), 10);
    if (!isNaN(nA) && !isNaN(nB)) {
        return nA - nB; // e.g. "9" < "10"
    }

    // 4) Fallback to string compare (handles non-numeric suffixes)
    return sufA.trim().localeCompare(sufB.trim());
}

// Normalize and compare names (Italian numeric locale)
export function compareByName(a, b) {
    const clean = str =>
        str.replace("CXyz ", "")
        .replace(/Number [CSF]|Numero [CSF]/g, translations[langIndex]["number"])
        .trim();

    return clean(a.name)
        .localeCompare(clean(b.name), "it", {
            numeric: true,
            sensitivity: "base"
        });
}


// Strip HTML and whitespace, then compare
export function compareByType(a, b) {
    const strip = s =>
        s.replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    return strip(a.type)
        .localeCompare(strip(b.type));
}


// Custom condition ordering
export const qualityOrder = {
    "": 0,
    "Mint": 1,
    "Near Mint": 2,
    "Slightly Played": 3,
    "Moderately Played": 4,
    "Played": 5,
    "Poor": 6,
    "Unknown (good)": 7,
    "Unknown (bad)": 8,
    "Fake": 9,
    "None": 10,
};

export function compareByCondition(a, b) {
    const oa = qualityOrder[a.quality] ?? 999;
    const ob = qualityOrder[b.quality] ?? 999;
    return oa - ob;
}


// Custom edition ordering
export const editionOrder = {
    "Limited Edition": 1,
    "First Edition": 2,
    "Standard Edition": 3,
    "Unknown": 4,
    "None": 5,
    "Fake": 6
};

export function compareByEdition(a, b) {
    const oa = editionOrder[a.edition] ?? 999;
    const ob = editionOrder[b.edition] ?? 999;
    return oa - ob;
}

export function getRarityOrder(game) {
    const map = new Map();

    const addOrder = (order) => {
        order.forEach((entry, i) => {
            entry.forEach(alias =>
                map.set(alias.toLowerCase().replace(/\s+/g, ""), i)
            );
        });
    };

    if (game === "Yu-Gi-Oh") {
        addOrder([
            ["Starlight Rare", "starlightrare"],
            ["Ghost Rare", "ghostrare"],
            ["Quarter Century Secret Rare", "quartercenturysecretrare"],
            ["Prismatic Collector's Rare", "prismaticcollectorsrare"],
            ["Collectors Rare", "collectorsrare"],
            ["Prismatic Ultimate Rare", "prismaticultimaterare"],
            ["Ultimate Rare", "ultimaterare"],
            ["Platinum Secret Rare", "platinumsecretrare"],
            ["Prismatic Secret Rare", "prismaticsecretrare"],
            ["Gold Secret Rare", "goldsecretrare"],
            ["Secret Rare", "secretrare"],
            ["Premium Gold Rare", "premiumgoldrare"],
            ["Gold Rare", "goldrare"],
            ["Ultra Parallel Rare", "ultraparallelrare"],
            ["Ultra Rare", "ultrarare"],
            ["Super Rare", "superrare"],
            ["Parallel Rare", "rare"],
            ["Rare", "rare"],
            ["Common", "common"],
            ["Unknown", "unknown"],
            ["None", "none"],
            ["Fake", "fake"]
        ]);
    }

    if (game === "Pokémon") {
        addOrder([
            ["Secret Rare", "secretrare"],
            ["Ultra Rare", "ultrarare"],
            ["Holo Rare", "holorare"],
            ["Rare", "rare"],
            ["Uncommon", "uncommon"],
            ["Common", "common"],
            ["Unknown", "unknown"],
            ["None", "none"],
            ["Fake", "fake"]
        ]);
    }

    if (game === "Vanguard") {
        addOrder([
            ["Secret Rare", "sec"],
            ["Zeroth Rare", "zr"],
            ["Wedding SP", "wsp"],
            ["Image Rare", "imr"],
            ["Origin Rare", "or"],
            ["Special Vanguard Rare", "svr"],
            ["Vanguard Rare", "vr"],
            ["Special Generation Rare", "sgr"],
            ["Generation Rare", "gr"],
            ["Premium Rare", "pr"],
            ["Triple Rare", "rrr"],
            ["Double Rare", "rr"],
            ["Rare", "r"],
            ["Common", "c"],
            ["Reprint", "re"],
            ["Promo", "promo"],
            ["Unknown", "unknown"],
            ["None", "none"],
            ["Fake", "fake"]
        ]);
    }

    if (game === "Digimon") {
        addOrder([
            ["Secret Rare", "secretrare"],
            ["Super Rare", "superrare"],
            ["Rare", "rare"],
            ["Uncommon", "uncommon"],
            ["Common", "common"],
            ["Promo", "promo"],
            ["Parallel Art", "parallelart"],
            ["Unknown", "unknown"]
        ]);
    }

    if (game === "Magic: The Gathering") {
        addOrder([
            ["Mythic Rare", "mythicrare"],
            ["Rare", "rare"],
            ["Uncommon", "uncommon"],
            ["Common", "common"],
            ["Promo", "promo"],
            ["Masterpiece", "masterpiece"],
            ["Special", "special"],
            ["Timeshifted", "timeshifted"],
            ["Bonus", "bonus"],
            ["Token", "token"],
            ["Unknown", "unknown"]
        ]);
    }

    // One Piece Card Game
    if (game === "One Piece") {
        // Order: SEC > SP/Manga > SR > L > R > UC > C > Promo > Parallel/Alt > DON!! > Unknown > None > Fake
        addOrder([
            ["Secret Rare", "secretrare", "SEC", "sec"],
            ["Special (SP / Manga)", "special", "SP", "sp", "Manga", "manga"],
            ["Super Rare", "superrare", "SR", "sr"],
            ["Leader (L)", "leader", "L", "l"],
            ["Rare", "rare", "R", "r"],
            ["Uncommon", "uncommon", "UC", "uc"],
            ["Common", "common", "C", "c"],
            ["Promo", "promo", "P", "pr", "PR"],
            ["Parallel / Alt Art", "parallel", "altart", "parallelart", "aa", "alt"],
            ["DON!!", "don", "don!!"],
            ["Unknown", "unknown"],
            ["None", "none"],
            ["Fake", "fake"]
        ]);
    }

    // Dragon Ball Super Card Game
    if (game === "Dragon Ball Super") {
        // PR > Promo > Secret Rare > Special Rare > Super Rare > Rare > Uncommon > Common
        addOrder([
            ["PR", "pr"],
            ["Promo", "promo", "P", "p"],
            ["Secret Rare", "secret-rare", "secretrare", "SCR", "scr"],
            ["Special Rare", "special-rare", "specialrare", "SPR", "spr"],
            ["Super Rare", "super-rare", "superrare", "SR", "sr"],
            ["Rare", "rare", "R", "r"],
            ["Uncommon", "uncommon", "UC", "uc"],
            ["Common", "common", "C", "c"]
        ]);
    }

    return map;
}


export function getCardSortIndexChanges(cards) {
    const rarityOrder = getRarityOrder(currentGame);
    const normalize = s =>
        typeof s === "string" ?
        s.toLowerCase().replace(/['’"]/g, "").replace(/\s+/g, "").trim() :
        "";

    // Attach sorting metadata
    const withMeta = cards.map((c, i) => ({
        from: i,
        sortKey: {
            rarity: rarityOrder.get(normalize(c.rarity)) ?? rarityOrder.size,
            name: normalize(c.name),
            price: c._pricePaid || 0,
        }
    }));

    // Sort by rarity, name, price
    const sorted = [...withMeta].sort((a, b) => {
        return (
            a.sortKey.rarity - b.sortKey.rarity ||
            a.sortKey.name.localeCompare(b.sortKey.name) ||
            b.sortKey.price - a.sortKey.price
        );
    });

    // Return index map
    return sorted.map((entry, newIndex) => ({
        from: entry.from,
        to: newIndex
    }));
}