// cardDetails.js

import {
    langIndex,
    localMode,
    shouldShowImage,
} from './config.js';

import {
    translations,
    applyTranslations,
} from './translations.js';

var loadedFile = false;

////////////////////////////////
// Helper Functions and Dictionary
////////////////////////////////

// Language dictionary mapping two-letter codes to emoji.
var languageDict = {
    "IT": "🇮🇹",
    "EN": "🇺🇸",
    "DE": "🇩🇪",
    "FR": "🇫🇷",
    "JP": "🇯🇵"
};

export let currentDisplayedCards = [];
export var has_debug_checkbox = document.getElementById("debugCheckbox") != null;

// --- UPDATED: Overlay helper functions that position the full image ---
export function showOverlay(e, card, thumbnail) {
    const overlay = document.getElementById('fullImageOverlay');
    const overlayImg = overlay.querySelector('img');
    // Set the full (uncropped) image source
    overlayImg.src = card.getImageUrl();
    overlay.style.display = 'block';

    // When the image loads (or if already cached), update its position.
    overlayImg.onload = function() {
        updateOverlayPosition(e, thumbnail, overlay);
    };
    updateOverlayPosition(e, thumbnail, overlay);
}

export function updateOverlayPosition(e, thumbnail, overlay) {
    // Get the thumbnail's bounding rectangle
    const thumbRect = thumbnail.getBoundingClientRect();

    // Check if the mouse pointer is within the thumbnail's boundaries.
    if (
        e.clientX < thumbRect.left ||
        e.clientX > thumbRect.right ||
        e.clientY < thumbRect.top ||
        e.clientY > thumbRect.bottom
    ) {
        // If not within the boundaries, hide the overlay.
        hideOverlay();
        return;
    }

    // Align the overlay horizontally with the left edge of the thumbnail.
    // overlay.style.left = thumbRect.left + "px";
    overlay.style.left = "0px";

    const overlayImg = overlay.querySelector('img');
    const displayHeight = overlayImg.offsetHeight;

    // Position the overlay so that its vertical center is at the mouse Y coordinate.
    overlay.style.top = (e.clientY - displayHeight / 2) + "px";
}


export function hideOverlay() {
    const overlay = document.getElementById('fullImageOverlay');
    overlay.style.display = 'none';
}

export function updatePackStats() {
    const container = document.getElementById("packStats");
    if (!container) return;

    const cards = manager.cards; // use all cards (unfiltered)
    const total = cards.length;
    const packMap = {}; // stores counts by packId

    cards.forEach(card => {
        // Group empty or missing pack IDs as "Unknown"
        const packId = card.packId && card.packId.trim() !== "" ? card.packId : translations[langIndex]["Unknown"];
        packMap[packId] = (packMap[packId] || 0) + 1;
    });

    // Sort the pack IDs by count in descending order.
    const sortedPackIds = Object.keys(packMap).sort((a, b) => packMap[b] - packMap[a]);

    let tableHTML = `<table style="border-collapse:collapse; width: 100%;" border="1">
      <caption><strong>Pack Statistics</strong></caption>
      <thead>
          <tr>
              <th>PackID</th>
              <th>Count</th>
              <th>Percentage</th>
          </tr>
      </thead>
      <tbody>`;

    sortedPackIds.forEach(packId => {
        const count = packMap[packId];
        const percentage = ((count / total) * 100).toFixed(2);
        tableHTML += `<tr>
          <td>${packId}</td>
          <td>${count}</td>
          <td>${percentage}%</td>
      </tr>`;
    });
    tableHTML += `</tbody></table>`;

    container.innerHTML = tableHTML;
}


export function updateLocationStats() {
    const container = document.getElementById("locationStats");
    if (!container) return;

    const cards = manager.cards;
    const total = cards.length;
    const locationMap = {};

    cards.forEach(card => {
        // Group empty or missing locations as "Unknown"
        const location = card.location && card.location.trim() !== "" ? card.location : translations[langIndex]["Unknown"];
        locationMap[location] = (locationMap[location] || 0) + 1;
    });

    // Sort the locations by count in descending order.
    const sortedLocations = Object.keys(locationMap).sort((a, b) => locationMap[b] - locationMap[a]);

    let tableHTML = `<table style="border-collapse:collapse; width: 100%;" border="1">
      <caption><strong>Location Statistics</strong></caption>
      <thead>
          <tr>
              <th>Location</th>
              <th>Count</th>
              <th>Percentage</th>
          </tr>
      </thead>
      <tbody>`;

    sortedLocations.forEach(loc => {
        const count = locationMap[loc];
        const percentage = ((count / total) * 100).toFixed(2);
        tableHTML += `<tr>
          <td>${loc}</td>
          <td>${count}</td>
          <td>${percentage}%</td>
      </tr>`;
    });
    tableHTML += `</tbody></table>`;

    container.innerHTML = tableHTML;
}


// Update the debug text areas with pack options, location options, and duplicate cards.
export function updateDebugOptions() {
    // --- Pack Options ---
    const packSet = new Set();
    manager.cards.forEach(card => {
        const pid = card.packId && card.packId.trim() !== "" ? card.packId : translations[langIndex]["Unknown"];
        packSet.add(pid);
    });
    const packOptionsLines = [...packSet]
        .map(pid => `<option value="${pid}">`)
        .join("\n");
    const packOptionsElement = document.getElementById("packOptions");
    if (packOptionsElement) {
        packOptionsElement.value = packOptionsLines;
    }

    // --- Location Options ---
    const locationSet = new Set();
    manager.cards.forEach(card => {
        const loc = card.location && card.location.trim() !== "" ? card.location : translations[langIndex]["Unknown"];
        locationSet.add(loc);
    });
    const locationOptionsLines = [...locationSet]
        .map(loc => `<option value="${loc}">`)
        .join("\n");
    const locationOptionsElement = document.getElementById("locationOptions");
    if (locationOptionsElement) {
        locationOptionsElement.value = locationOptionsLines;
    }

    // --- Duplicate Cards ---
    // Calculate frequency of each card name.
    const freq = {};
    manager.cards.forEach(card => {
        const name = card.name.replace("<", "").replace(">", "") || translations[langIndex]["Unknown"];
        freq[name] = (freq[name] || 0) + 1;
    });

    // Get all names found more than once.
    const duplicateLines = Object.keys(freq)
        .filter(name => freq[name] > 1)
        .map(name => `<li>${name} - ${freq[name]}x</li>`)
        .join("\n");

    const duplicateCardsElement = document.getElementById("duplicateCards");
    if (duplicateCardsElement) {
        duplicateCardsElement.innerHTML = "<ul>\n" + duplicateLines + "</ul>\n";
    }
}

export function getLanguageBadge(language) {
    let code = language.trim().toUpperCase();
    let emoji = languageDict[code] || code;
    return `<span data-cell-title="Language">${emoji}</span>`;
}

export function getQualityBadge(quality) {
    let q = quality.toLowerCase();

    if (q === translations[0]["unknowngood"].toLowerCase()) {
        return '<span class="badge" data-original-title="Near Mint">✅</span>';
    }
    if (q === translations[0]["unknownbad"].toLowerCase()) {
        return '<span class="badge" data-original-title="Near Mint">❌</span>';
    }

    if (q === translations[0]["nearmint"].toLowerCase()) {
        return '<span class="badge badge-cond-near-mint" data-original-title="Near Mint">NM</span>';
    } else if (q === translations[0]["slightlyplayed"].toLowerCase()) {
        return '<span class="badge badge-cond-slightly-played" data-original-title="Slightly Played">SP</span>';
    } else if (q === translations[0]["moderatelyplayed"].toLowerCase()) {
        return '<span class="badge badge-cond-moderately-played" data-original-title="Moderately Played">MP</span>';
    } else if (q === translations[0]["played"].toLowerCase()) {
        return '<span class="badge badge-cond-played" data-original-title="Played">PL</span>';
    } else if (q === translations[0]["poor"].toLowerCase()) {
        return '<span class="badge badge-cond-poor" data-original-title="Poor">PO</span>';
    } else {
        return quality;
    }
}

export function getEditionBadge(edition) {
    let accepted = true;
    let ed = edition.toLowerCase();
    let num = "";
    if (ed.includes(translations[0]["first"].toLowerCase())) {
        num = "1";
        accepted = true;
    } else if (ed.includes(translations[0]["limited"].toLowerCase())) {
        num = "0";
        accepted = true;
    } else if (ed.includes(translations[0]["standard"].toLowerCase())) {
        num = "2";
        accepted = !has_debug_checkbox;
    } else {
        num = "3";
        accepted = !has_debug_checkbox;
    }
    // Here, we return two classes: a base class ("edition-badge") for common styling,
    // and a dynamic class ("edition-badge-[num]") for specific modifications.
    return (accepted ? `<span class="edition-badge edition-badge-${num}" data-original-title="${edition}">${num}</span>` : `<span class="null" data-original-title="${edition}"></span>`);
}


// Process type string, extracting any parenthesized info as a badge.
export function getTypeDisplay(typeText) {
    let base = typeText;
    let badges = [];
    const regex = /\(([^)]+)\)/;
    const match = typeText.match(regex);

    if (match) {
        // Remove the parenthesized part from the base.
        base = typeText.replace(regex, "").trim();

        // Split the parenthesized string by "|" so we can support multiple badges.
        const badgeTokens = match[1].split("/").map(token => token.trim());

        // Define an array of badge rules in order of priority.
        const badgeRules = [{
                prefix: translations[0]["cxyz"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-cxyz"
            },
            {
                prefix: translations[0]["fxyz"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-cxyz"
            },
            {
                prefix: translations[0]["sxyz"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-cxyz"
            },
            {
                prefix: translations[0]["xyz"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-xyz"
            },
            {
                prefix: translations[0]["effect"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-effect"
            },
            {
                prefix: translations[0]["continuous"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-continuous"
            },
            {
                prefix: translations[0]["vanilla"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-vanilla"
            },
            {
                prefix: translations[0]["normal"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-normal"
            },
            {
                prefix: translations[0]["quickplay"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-quickplay"
            },
            {
                prefix: translations[0]["equip"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-equip"
            },
            {
                prefix: translations[0]["terrain"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-terrain"
            },
            {
                prefix: translations[0]["fusion"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-fusion"
            },
            {
                prefix: translations[0]["synchro"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-synchro"
            },
            {
                prefix: translations[0]["counter"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-counter"
            },
            {
                prefix: translations[0]["ritual"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-ritual"
            },
            {
                prefix: translations[0]["pendulum"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-pendulum"
            },
            {
                prefix: translations[0]["link"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-link"
            },
            {
                prefix: translations[0]["tuner"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-tuner"
            },
            {
                prefix: translations[0]["toon"].replaceAll("—— ", "").replaceAll("— ", ""),
                cssClass: "badge-type-toon"
            }

            // Add more rules here as needed.
        ];

        // Process each badge token individually.
        for (const token of badgeTokens) {
            for (const rule of badgeRules) {
                if (token.startsWith(rule.prefix)) {
                    // Clean the token text to match the translation key.
                    const processedToken = token.replace("-", "").toLowerCase().trim();
                    // Look up the translation for this token; if not available, fall back to the token.
                    const displayText =
                        translations[langIndex][processedToken].replaceAll("—— ", "").replaceAll("— ", "") || token;
                    badges.push(`<span class="${rule.cssClass}">${displayText}</span>`);
                    break; // Once a rule is matched, we move on to the next token.
                }
            }
        }
    }

    // Look up the base type translation.
    const baseDisplay = translations[langIndex][base.replace("-", "").toLowerCase().trim()];
    // Join the badge spans with a single space in between.
    const badgeDisplay = badges.join(" ");

    return baseDisplay + (badgeDisplay ? " " + badgeDisplay : "");
}


// Parse dates in dd/mm/YYYY format for sorting.
export function parseDate(dateStr) {
    let parts = dateStr.split("/");
    if (parts.length !== 3) return new Date(0);
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

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
        this.pricePaid = parseFloat(data.pricePaid) || 0;
        this.marketPrice = parseFloat(data.marketPrice) || 0;
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
        const lines = csvText.split('\n');
        if (lines.length <= 1) return;
        const headers = lines[0].split("|").map(h => h.trim());
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === "") continue;
            const fields = line.split("|").map(f => f.trim());
            let data = {};
            headers.forEach((header, i) => data[header] = fields[i] || "");
            this.cards.push(new Card({
                name: data["Name"],
                type: data["Type"],
                rarity: data["Rarity"],
                quality: data["Quality"],
                language: data["Language"],
                edition: data["Edition type"],
                pricePaid: data["Price I paid for it"],
                marketPrice: data["Current market price"],
                id: data["ID"],
                packId: data["Pack ID"],
                "Date Obtained": data["Date Obtained"],
                location: data["Location"],
                comments: data["Comments"],
                photoURL: data["Photo URL"],
                "Wiki URL": data["Wiki URL"]
            }));
        }

        let sort_alphabetically = true;

        if (sort_alphabetically) {
            this.cards.sort((a, b) => {
                return a.name
                    .replace("CXyz ", "")
                    .replace("Number C", "Number ")
                    .replace("Numero C", "Numero ")
                    .replace("Number S", "Number ")
                    .replace("Numero S", "Numero ")
                    .replace("Number F", "Number ")
                    .replace("Numero F", "Numero ")
                    .localeCompare(b.name
                        .replace("CXyz ", "")
                        .replace("Number C", "Number ")
                        .replace("Numero C", "Numero ")
                        .replace("Number S", "Number ")
                        .replace("Numero S", "Numero ")
                        .replace("Number F", "Number ")
                        .replace("Numero F", "Numero "), 'it', {
                            numeric: true,
                            sensitivity: 'base'
                        });
            });
        }
    }

    filterCards(filters) {
        return this.cards.filter(card => {
            if (filters.name && !card.name.toLowerCase().replaceAll("—— ", "").replaceAll("— ", "").includes(filters.name.toLowerCase().replaceAll("—— ", "").replaceAll("— ", "")))
                return false;

            if (filters.type) {
                // Normalize and extract card type details.
                const cardTypeStr = card.type.toLowerCase().trim();
                const cardBase = card.type.replace(/\(([^)]+)\)/, "").trim().toLowerCase();
                let cardBadges = [];
                const badgeMatch = card.type.match(/\(([^)]+)\)/);
                if (badgeMatch) {
                    // Use "/" as delimiter, so "Pendulum/Effect" becomes ["pendulum", "effect"].
                    cardBadges = badgeMatch[1].split("/").map(token => token.trim().toLowerCase());
                }

                // If the filter string includes parentheses, assume a full-type match.
                if (filters.type.indexOf("(") !== -1) {
                    const filterTypeStr = filters.type.toLowerCase().trim();
                    // Extract the base from the filter.
                    const filterBase = filters.type.replace(/\(([^)]+)\)/, "").trim().toLowerCase();
                    let filterBadges = [];
                    const filterBadgeMatch = filters.type.match(/\(([^)]+)\)/);
                    if (filterBadgeMatch) {
                        filterBadges = filterBadgeMatch[1].split("/").map(token => token.trim().toLowerCase());
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
                    const filterTypeStr = filters.type.toLowerCase().trim();
                    let filterTokens = filterTypeStr.includes("/") ?
                        filterTypeStr.split("/").map(t => t.trim()) : [filterTypeStr];

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
export const cardId = getQueryParam("id");

// Display cards in the table.
export function displayCards(cards) {
    // Store a copy of the current displayed cards.
    currentDisplayedCards = cards.slice();

    const tbody = document.getElementById("cardBody");
    tbody.innerHTML = "";

    // Calculate the unique card names.
    const uniqueNames = new Set(cards.map(card => card.name));

    // Update the result count immediately even if 0 entries.
    const resultCountEl = document.getElementById("resultCount");
    if (cards.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.setAttribute("colspan", "15");
        td.textContent = translations[langIndex]["nothingfound"];
        tr.appendChild(td);
        tbody.appendChild(tr);
        if (resultCountEl) {
            resultCountEl.textContent = translations[langIndex]["showingentries"].replaceAll("NUMBER", "0");
        }
        return;
    }

    cards.forEach(card => {
        const tr = document.createElement("tr");

        // Image cell with a set maximum width and error-handling tooltip.
        const imgTd = document.createElement("td");

        let showImage = document.getElementById("imageth");

        if (shouldShowImage) {

            // showImage.style.display = "block";

            imgTd.classList.add("img-cell");
            const img = document.createElement("img");
            img.src = card.getImageUrl();

            // img.alt = card.name;
            img.alt = "X";

            // Define the event handler functions so they can be removed later
            function clickHandler() {
                window.location.href = `card.html?id=${encodeURIComponent(card.id)}`;
            }

            function mouseEnterHandler(e) {
                showOverlay(e, card, img);
            }

            function mouseMoveHandler(e) {
                updateOverlayPosition(e, img, document.getElementById('fullImageOverlay'));
            }

            function mouseLeaveHandler() {
                hideOverlay();
            }

            img.onerror = function() {
                this.title = 'Should be loaded from: images/cards/' + card.language + '/' + card.id + '.png';
                img.classList.remove("card-image");

                // Remove event listeners
                img.removeEventListener("click", clickHandler);
                img.removeEventListener("mouseenter", mouseEnterHandler);
                img.removeEventListener("mousemove", mouseMoveHandler);
                img.removeEventListener("mouseleave", mouseLeaveHandler);
            };

            if (img.src.length > 0) {
                //console.log(img.src);
                img.classList.add("card-image");

                // Add the event listeners
                if (localMode) {
                    img.addEventListener("click", clickHandler);
                }
                img.addEventListener("mouseenter", mouseEnterHandler);
                img.addEventListener("mousemove", mouseMoveHandler);
                img.addEventListener("mouseleave", mouseLeaveHandler);
            }

            imgTd.appendChild(img);
            tr.appendChild(imgTd);
        } else {
            showImage.style.display = "none";
            showImage.style.width = "0px";
            showImage.style.height = "0px";
        }

        // Name.
        let tdName = document.createElement("td");
        tdName.textContent = card.name;
        if (card.rarity.toLowerCase() == translations[0]["fake"].toLowerCase()) {
            tdName.innerHTML = tdName.textContent + " <b>(" + translations[langIndex]["fake"] + ")</b>";
        }
        tr.appendChild(tdName);

        // Type.
        let tdType = document.createElement("td");
        tdType.innerHTML = getTypeDisplay(card.type);
        tr.appendChild(tdType);

        // Rarity.
        let tdRarity = document.createElement("td");
        let fakestr = `<span class="badge-type-fake">` + translations[langIndex]["fake"] + `</span>`;
        tdRarity.innerHTML = (card.rarity.toLowerCase() == translations[0]["fake"].toLowerCase() ? fakestr : translations[langIndex][card.rarity.toLowerCase().trim().replace(" ", "")]);
        tr.appendChild(tdRarity);

        // Quality badge.
        let tdQuality = document.createElement("td");
        tdQuality.innerHTML = getQualityBadge(card.quality);
        tr.appendChild(tdQuality);

        // Language badge.
        let tdLanguage = document.createElement("td");
        tdLanguage.innerHTML = getLanguageBadge(card.language);
        tr.appendChild(tdLanguage);

        // Edition badge.
        let tdEdition = document.createElement("td");
        tdEdition.innerHTML = getEditionBadge(card.edition);
        tr.appendChild(tdEdition);

        // Price I Paid.
        let tdPricePaid = document.createElement("td");
        tdPricePaid.textContent = card.pricePaid.toFixed(2);
        tr.appendChild(tdPricePaid);

        // Market Price.
        /* 
		let tdMarketPrice = document.createElement("td");
        tdMarketPrice.textContent = card.marketPrice.toFixed(2);
        tr.appendChild(tdMarketPrice);
		*/

        // ID.
        let tdID = document.createElement("td");
        tdID.textContent = card.id;
        tr.appendChild(tdID);

        // Pack ID
        let tdPackID = document.createElement("td");
        tdPackID.textContent = card.packId + " ";
        tdPackID.style.height = "0px";
        tdPackID.style.width = "0px";
        tdPackID.style.display = "none";
        tdPackID.style.opacity = "0%";
        tr.appendChild(tdPackID);

        // Date Obtained.
        let tdDate = document.createElement("td");
        tdDate.textContent = card.dateObtained;
        tr.appendChild(tdDate);

        // Location.
        let tdLocation = document.createElement("td");
        tdLocation.textContent = card.location;
        tr.appendChild(tdLocation);

        // Comments.
        let tdComments = document.createElement("td");
        tdComments.textContent = card.comments;
        tr.appendChild(tdComments);

        // Wiki button.
        let tdWiki = document.createElement("td");
        if (card.wikiUrl) {
            let wikiBtn = document.createElement("button");
            wikiBtn.textContent = translations[langIndex]["go"];
            wikiBtn.addEventListener("click", () => {
                window.open(card.wikiUrl, "_blank");
            });
            tdWiki.appendChild(wikiBtn);
        } else {
            tdWiki.textContent = "N/A";
        }
        tr.appendChild(tdWiki);

        tbody.appendChild(tr);
    });

    if (resultCountEl) {
        resultCountEl.innerHTML = "<div class=\"results\">" + translations[langIndex]["showingcards"]
            .replace("NUMBER", currentDisplayedCards.length.toString())
            .replace("UNIQUENUM", uniqueNames.size.toString()) + "\t</div>";
    }


}

// Function to reset all filter controls
export function resetFilters() {
    document.getElementById("selectedLanguage").selectedIndex = langIndex;
    document.getElementById("filterName").value = "";
    document.getElementById("filterType").value = "";
    document.getElementById("filterRarity").value = "";
    document.getElementById("filterQuality").value = "";
    document.getElementById("filterLanguage").value = "";
    document.getElementById("filterEdition").value = "";
    document.getElementById("sortBy").value = "";
    document.getElementById("debugCheckbox").checked = false;
    document.getElementById("sortBy").selectedIndex = 0;
}

// Function to load CSV data and display cards
export function loadCSVAndDisplayCards(myfile) {

    if (!myfile.includes(".")) {
        return;
    }

    fetch(myfile)
        .then(response => response.text())
        .then(csvText => {
            manager.loadCards(csvText);
            displayCards(manager.cards);
            updatePackStats();
            updateLocationStats();
            // Update the copy-only debug textareas.
            updateDebugOptions();
            loadedFile = true;
            let csvload = document.getElementById("loadCSV");
            if (csvload) {
                csvload.style.display = "none";
                //console.log("Set the display style of the CSV button to none");
            } else {
                //console.log("CSV load button is null");
            }
        })
        .catch(err => {
            console.error("Error loading CSV file:", err);
            const tbody = document.getElementById("cardBody");
            tbody.innerHTML = "";
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.setAttribute("colspan", "15");
            td.textContent = translations[langIndex]["csverror"];
            tr.appendChild(td);
            tbody.appendChild(tr);
        });
}

// Function to handle the filtering logic when the "Apply Filters" button is clicked
export function handleApplyFilters() {

    if (!loadedFile) {
        return;
    }

    let selectedLanguageElem = document.getElementById("selectedLanguage");
    if (selectedLanguageElem) {
        let selectedLanguage = selectedLanguageElem.selectedIndex;
        if (selectedLanguage !== langIndex) {
            applyTranslations(selectedLanguage);
        }
    }

    // Gather filter values from the page
    const filters = {
        name: document.getElementById("filterName").value,
        type: document.getElementById("filterType").value,
        rarity: document.getElementById("filterRarity").value,
        quality: document.getElementById("filterQuality").value,
        language: document.getElementById("filterLanguage").value,
        edition: document.getElementById("filterEdition").value
    };

    // Filter the cards using the filters object
    let filteredCards = manager.filterCards(filters);
    const sortBy = document.getElementById("sortBy").value;

    if (sortBy) {
        filteredCards.sort((a, b) => {
            if (sortBy === "name") return a.name
                .replace("CXyz ", "")
                .replace("Number C", "Number ")
                .replace("Numero C", "Numero ")
                .replace("Number S", "Number ")
                .replace("Numero S", "Numero ")
                .replace("Number F", "Number ")
                .replace("Numero F", "Numero ")
                .localeCompare(b.name
                    .replace("CXyz ", "")
                    .replace("Number C", "Number ")
                    .replace("Numero C", "Numero ")
                    .replace("Number S", "Number ")
                    .replace("Numero S", "Numero ")
                    .replace("Number F", "Number ")
                    .replace("Numero F", "Numero "), 'it', {
                        numeric: true,
                        sensitivity: 'base'
                    });
            if (sortBy === "type") {
                const stripHTML = str =>
                    str.replace(/<[^>]*>/g, "") // remove all HTML tags
                    .replace(/\n/g, "") // remove newline characters
                    .replace(/\s+/g, " ") // collapse multiple spaces into one
                    .trim() // trim leading/trailing whitespace
                    .toLowerCase(); // convert to lowercase

                const aTypeClean = stripHTML(a.type);
                const bTypeClean = stripHTML(b.type);

                const is_cxyz = aTypeClean.includes("cxyz") || bTypeClean.includes("cxyz");

                if (is_cxyz) {
                    //console.log("Comparing types:");
                    //console.log("Raw a.type: ", a.type);
                    //console.log("Cleaned a.type: ", aTypeClean);
                    //console.log("Raw b.type: ", b.type);
                    //console.log("Cleaned b.type: ", bTypeClean);
                }

                const result = aTypeClean.localeCompare(bTypeClean);

                //if(is_cxyz) console.log("localeCompare result: ", result);
                return result;
            }

            if (sortBy === "condition") {
                // Define the desired custom order.
                // Lower numbers will sort first.
                const qualityOrder = {
                    "": 0, // If quality is empty
                    "Near Mint": 1,
                    "Slightly Played": 2,
                    "Moderately Played": 3,
                    "Played": 4,
                    "Poor": 5,
                    "Unknown (good)": 6,
                    "Unknown (bad)": 7
                };

                // Get the assigned order values; if a quality isn't in the list, give it a high order.
                const aOrder = qualityOrder[a.quality] !== undefined ? qualityOrder[a.quality] : 999;
                const bOrder = qualityOrder[b.quality] !== undefined ? qualityOrder[b.quality] : 999;

                return aOrder - bOrder;
            }

            if (sortBy === "pricePaid") return a.pricePaid - b.pricePaid;
            if (sortBy === "marketPrice") return a.marketPrice - b.marketPrice;
            if (sortBy === "packId") return a.packId.localeCompare(b.packId);
            if (sortBy === "location") return a.location.localeCompare(b.location);
            if (sortBy === "comments") return b.comments.localeCompare(a.comments);
            if (sortBy === "dateObtained") {
                return parseDate(a.dateObtained) - parseDate(b.dateObtained);
            }
            if (sortBy === "language") return a.language.localeCompare(b.language);
            if (sortBy === "edition") {
                // Define the desired custom order, where lower numbers come first.
                const editionOrder = {
                    "Limited Edition": 1,
                    "First Edition": 2,
                    "Standard Edition": 3
                };

                // Get the order value for each edition, using a fallback if the edition isn't mapped.
                const aOrder = editionOrder[a.edition] !== undefined ? editionOrder[a.edition] : 999;
                const bOrder = editionOrder[b.edition] !== undefined ? editionOrder[b.edition] : 999;

                return aOrder - bOrder;
            }

            if (sortBy === "rarity") {
                // Create a normalization function.
                const normalizeRarity = (str) =>
                    str.toLowerCase().replace(/['’]/g, "").trim(); // remove both straight and curly apostrophes

                // Build the rarity order array using the normalized values.
                const rarityOrder = [
                    normalizeRarity(translations[0]["collectorsrare"]),
                    normalizeRarity(translations[0]["ultimaterare"]),
                    normalizeRarity(translations[0]["secretrare"]),
                    normalizeRarity(translations[0]["ghostrare"]),
                    normalizeRarity(translations[0]["ultrarare"]),
                    normalizeRarity(translations[0]["superrare"]),
                    normalizeRarity(translations[0]["rare"]),
                    normalizeRarity(translations[0]["common"])
                ];

                const indexA = rarityOrder.indexOf(normalizeRarity(a.rarity));
                const indexB = rarityOrder.indexOf(normalizeRarity(b.rarity));
                // If indexOf returns -1 (not found), use rarityOrder.length as a fallback.
                const rarityA = indexA !== -1 ? indexA : rarityOrder.length;
                const rarityB = indexB !== -1 ? indexB : rarityOrder.length;

                // First sort by rarity.
                if (rarityA !== rarityB) {
                    return rarityA - rarityB;
                }

                // If the rarities are the same, sort by pricePaid (assumed numeric).
                return parseFloat(b.pricePaid) - parseFloat(a.pricePaid);
            }
            return 0;
        });
    }

    displayCards(filteredCards);
}


export function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

export function displayCardDetails(cards) {
    if (localMode) {
        const container = document.getElementById("cardDetails");
        container.innerHTML = ''; // Clear existing content

        // Use the first card's common details (assumes they are the same across all entries)
        const commonCard = cards[0];
        container.innerHTML += `
            <div class="common-card">
                <h2>${commonCard.name} (${cards.length} elements)</h2>
				<br>
                <img src="${commonCard.getImageUrl()}" alt="${commonCard.name}" onclick="window.location.href='index.html'"><br>
				<br>
                <div class="detail-row"><span class="detail-label">Type:</span> ${getTypeDisplay(commonCard.type)}</div>
                <div class="detail-row"><span class="detail-label">ID:</span> ${commonCard.id}</div>
                <div class="detail-row"><span class="detail-label">Pack ID:</span> ${commonCard.packId}</div>
				${ commonCard.wikiUrl 
            ? '<div class="detail-row"><button onclick="window.open(\'' 
               + commonCard.wikiUrl 
               + '\', \'_blank\')">Wiki</button></div>' 
            : '' }
            </div>
			<br>
        `;

        // Now iterate over each card version to display variant-specific data.
        cards.forEach((card, index) => {
            container.innerHTML += `
			            <hr>
				<br>
                <div class="version-entry">
                    <div class="detail-row"><span class="detail-label">Rarity:</span> ${card.rarity}</div>
                    <div class="detail-row"><span class="detail-label">Quality:</span> ${getQualityBadge(card.quality)}</div>
                    <div class="detail-row"><span class="detail-label">Language:</span> ${getLanguageBadge(card.language)}</div>
                    <div class="detail-row"><span class="detail-label">Edition:</span> ${getEditionBadge(card.edition)}</div>
                    <div class="detail-row"><span class="detail-label">Price I Paid:</span> €${card.pricePaid.toFixed(2)}</div>
                    <div class="detail-row"><span class="detail-label">Market Price:</span> €${card.marketPrice.toFixed(2)}</div>
                    <div class="detail-row"><span class="detail-label">Location:</span> ${card.location}</div>
                    <div class="detail-row"><span class="detail-label">Comments:</span> ${card.comments}</div>
					<br>
                </div>
            `;
        });
    }
}



export function initCardDetailsPage(myfile) {
    if (!cardId) {
        document.getElementById("cardDetails").textContent = "No card ID provided.";
        return;
    }

    if (localMode) {
        fetch(myfile)
            .then(response => response.text())
            .then(csvText => {
                manager.loadCards(csvText);
                const cards = manager.findCardsById(cardId); // Use the new method
                if (!cards || cards.length === 0) {
                    document.getElementById("cardDetails").textContent = "Card not found.";
                } else {
                    displayCardDetails(cards); // Pass the array of cards
                }
            })
            .catch(err => {
                console.error("Error loading CSV file:", err);
                document.getElementById("cardDetails").textContent = "Error loading card details.";
            });
    }
}


export function initCollectionPage() {

    resetFilters();

    if (localMode) {
        document.addEventListener("DOMContentLoaded", () => {
            loadCSVAndDisplayCards('cards.csv');
        });
    }

    const applyFiltersBtn = document.getElementById("applyFilters");
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener("click", handleApplyFilters);
    }

    // New: Add event listener for the reverse button.
    const reverseBtn = document.getElementById("reverseOrder");
    if (reverseBtn) {
        reverseBtn.addEventListener("click", () => {
            if (!loadedFile) {
                return;
            }
            if (currentDisplayedCards && currentDisplayedCards.length) {
                // Reverse the order in-place and re-display.
                currentDisplayedCards.reverse();
                displayCards(currentDisplayedCards);
            }
        });
    }

    if (!localMode) {
        const loadCSVButton = document.getElementById("loadCSV");
        if (loadCSVButton) {
            //console.log("OK");
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = ".csv"; // only CSV files
            fileInput.style.display = "none"; // hide it
            // Why?
            //document.body.appendChild(fileInput);
            loadCSVButton.addEventListener("click", () => {
                fileInput.click();
                //console.log("Clicked");
            });
            // Listen for changes to the file input (i.e. when a file is selected)
            fileInput.addEventListener("change", () => {
                //console.log("Changed");
                // Check if a file was selected; if not, show an alert and exit
                if (!fileInput.files || fileInput.files.length === 0) {
                    alert("You must select a CSV file!");
                    return;
                }

                // Get the selected file (note: full file path is not available)

                const file = fileInput.files[0];
                //console.log("Loading file: " + file.name);
                const fileURL = URL.createObjectURL(file);
                loadCSVAndDisplayCards(fileURL);

            });
        } else {
            //console.log("LoadCSV button is null!");
        }
    }

    // Add event listener for the "Show Debug" checkbox.
    const debugCheck = document.getElementById("debugCheckbox");
    if (debugCheck) {
        debugCheck.addEventListener("change", function() {
            const debugDiv = document.getElementById("debugInfo");
            debugDiv.style.display = this.checked ? "block" : "none";
        });
    }

}