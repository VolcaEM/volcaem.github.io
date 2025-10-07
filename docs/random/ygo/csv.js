import {
    langIndex,
    localMode,
    shouldShowImage,
    allowNewlines,
    useTallTr,
    useSmallTr,
    enableCollections,
    isUsingAndroidApp,
    isAndroidApp

} from './config.js';

import {
    currentDisplayedCards,
    setCurrentDisplayedCards,
    updateTotalSpent,
    setLoadedFile,
} from './dynamic.js';

import {
    currentGame,
} from './detect.js';

import {
    manager,
} from './card.js';

import {
    translations,
} from './translations.js';

import {
    getTypeDisplay,
    getQualityBadge,
    getLanguageBadge,
    getEditionBadge,
} from './badges.js';

import {
    showOverlay,
    updateOverlayPosition,
    hideOverlay,
} from './img.js';

import {
    updatePackStats,
    updateLocationStats,
    updateDebugOptions,
} from './debug.js';

import {
    renderAllCharts,
} from './canvas.js';

import {
    clickHandler,
} from './common.js';

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
            setLoadedFile(true);
            let csvload = document.getElementById("loadCSV");
            if (csvload) {
                csvload.style.display = "none";
                //console.log("Set the display style of the CSV button to none");
            } else {
                //console.log("CSV load button is null");
            }
            renderAllCharts(currentDisplayedCards || []);
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

export function getLocalImagePath(card) {
    const sanitizeFileName = (str) =>
        str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[:#"\/\\?%*|<>]/g, '') // Remove unsupported symbols
        .trim()
        .replace(/\s+/g, '_') // Collapse spaces to underscores
        .replace(/_+/g, '_'); // Collapse multiple underscores

    const gameDir = sanitizeFileName(currentGame.replaceAll("-", "")).toLowerCase();
    const langDir = sanitizeFileName(card.language).toUpperCase();
    const idFile = sanitizeFileName(card.id);

    if (idFile.length === 0 && !card.getImageUrl().includes("common")) {
        return "";
    }

    if (card.getImageUrl().includes("..")) {
        return "";
    }

    if (isAndroidApp()) {
        // Assumes images are stored in: /storage/emulated/0/TCGCollection/images/...
        return `https://android.local/` + card.getImageUrl();
    } else {
        return card.getImageUrl();
    }

    return "";
}

function logMessage(msg) {
    const should_log = false;
    if (should_log) {
        const panel = document.getElementById("logPanel");
        if (panel) {
            if (panel.style.display == "none") {
                panel.style.display = "block";
            }
            const entry = document.createElement("div");
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            panel.appendChild(entry);
            panel.scrollTop = panel.scrollHeight;
        }
    }
}

export function createStealthButton(label, mycards) {
    const btn = document.createElement("button");

    // Store the real value for click handling
    btn.dataset.value = label;

    // Add a class for styling and pseudo-element rendering
    btn.classList.add("tag-button");

    // Accessibility: screen readers still get the label
    btn.setAttribute("aria-label", label);

    // Click handler: filter cards by tag
    btn.addEventListener("click", (cards) => {
        const tag = btn.dataset.value;

        // Find all cards whose comments contain [tag]
        const matchingCards = manager.cards.filter(card =>
            card.comments && card.comments.replaceAll("{", "[").replaceAll("}", "]").includes(`[${tag}]`)
        );

        // For now, just log them — replace with your display logic
        //console.log(`Cards with [${tag}]:`, matchingCards);

        // Example: update the UI
        // renderCards(matchingCards);
        displayCards(matchingCards);
        window.scrollTo(0, 0);
    });

    return btn;
}


// Display cards in the table.
export function displayCards(cards) {
    // Store a copy of the current displayed cards.
    setCurrentDisplayedCards(cards.slice());

    const tbody = document.getElementById("cardBody");
    tbody.innerHTML = "";

    logMessage(`isAndroidApp: ${isAndroidApp()}`);

    let filtered_cards = cards.slice();

    if (currentGame == "Yu-Gi-Oh") {
        let force_genesys = false;
        let genesysCheckbox = document.getElementById("genesysCheckbox");
        if (force_genesys || (genesysCheckbox && genesysCheckbox.checked)) {
            // Exclude Link and Pendulum cards
            filtered_cards = filtered_cards.filter(card =>
                !card.type.includes("Link") && !card.type.includes("Pendulum")
            );
        }
    }

    let duplicateCheck = document.getElementById("duplicatesCheckbox");
    if (duplicateCheck) {
        let matchingCards;
        let force_no_duplicates = false;

        if (force_no_duplicates || !duplicateCheck.checked) {
            // Deduplicate by card.name
            const seen = new Set();
            filtered_cards = filtered_cards.filter(card => {
                if (seen.has(card.name)) {
                    return false; // skip duplicates
                }
                seen.add(card.name);
                return true; // keep first occurrence
            });
        }
    }

    // Update the result count immediately even if 0 entries.
    const resultCountEl = document.getElementById("resultCount");
    if (filtered_cards.length === 0) {
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

    // Calculate the unique card names.
    const uniqueNames = new Set(filtered_cards.map(card => card.name));

    filtered_cards.forEach(card => {

        let nowrap_td = !allowNewlines;
        let usetall_tr = useTallTr;
        let usesmall_tr = useSmallTr;

        const tr = document.createElement("tr");

        if (usetall_tr === true) {
            tr.classList.add("tall-tr");
        } else if (usesmall_tr === true) {
            tr.classList.add("small-tr");
        }

        // Image cell with a set maximum width and error-handling tooltip.
        const imgTd = document.createElement("td");

        let showImage = document.getElementById("imageth");

        if (shouldShowImage) {

            // showImage.style.display = "block";

            imgTd.classList.add("img-cell");
            if (nowrap_td === true) imgTd.classList.add("nowrap-td");
            if (usetall_tr === true) imgTd.classList.add("tall-tr");
            if (usesmall_tr === true) imgTd.classList.add("small-tr");
            const img = document.createElement("img");
            img.src = getLocalImagePath(card);

            logMessage(`Trying to load image: ${img.src}`);

            // img.alt = card.name;
            img.alt = "X";

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

                // helper scoped inside onerror: remove accents, unsupported chars, collapse spaces/underscores
                function sanitizeFileName(str) {
                    return str
                        .normalize('NFD') // decompose accented chars
                        .replace(/[\u0300-\u036f]/g, '') // strip diacritics
                        .replace(/[:#"\/\\?%*|<>]/g, '') // remove unsupported symbols
                        .trim() // trim edges
                        .replace(/\s+/g, '_') // collapse spaces to underscores
                        .replace(/_+/g, '_') // collapse multiple underscores
                }

                // build each segment using sanitizeFileName
                const gameDir = sanitizeFileName(currentGame.replaceAll("-", ""))
                    .toLowerCase();
                const langDir = sanitizeFileName(card.language)
                    .toUpperCase();
                const idFile = sanitizeFileName(card.id);

                // set tooltip to the exact path you're attempting to load
                logMessage(`❌ Failed to load image: ${img.src}`);
                this.title = `Failed to load: ${img.src}`;

                // revert styling
                img.classList.remove("card-image");

                // detach event listeners
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
                    img.addEventListener('click', () => clickHandler(card, !duplicateCheck.checked));
                }
                img.addEventListener("mouseenter", mouseEnterHandler);
                img.addEventListener("mousemove", mouseMoveHandler);
                img.addEventListener("mouseleave", mouseLeaveHandler);
            }

            imgTd.appendChild(img);
            tr.appendChild(imgTd);
        } else {
            if (nowrap_td === true) imgTd.classList.add("nowrap-td");
            if (usetall_tr === true) imgTd.classList.add("tall-tr");
            if (usesmall_tr === true) imgTd.classList.add("small-tr");
            showImage.style.display = "none";
            showImage.style.width = "0px";
            showImage.style.height = "0px";
        }

        const sortBy = document.getElementById("sortBy")
            .value;

        // Name.
        let tdName = document.createElement("td");
        tdName.textContent = card.name;
        if (card.rarity.toLowerCase() == (translations[0]["fake"] || "FAKE")
            .toLowerCase()) {
            tdName.innerHTML = tdName.textContent + " <b>(" + translations[langIndex]["fake"] + ")</b>";
        }
        if (nowrap_td === true) tdName.classList.add("nowrap-td");
        if (usetall_tr === true) tdName.classList.add("tall-tr");
        if (usesmall_tr === true) tdName.classList.add("small-tr");
        tr.appendChild(tdName);

        // Type.
        let tdType = document.createElement("td");
        tdType.innerHTML = getTypeDisplay(card.type);
        if (nowrap_td === true) tdType.classList.add("nowrap-td");
        if (usetall_tr === true) tdType.classList.add("tall-tr");
        if (usesmall_tr === true) tdType.classList.add("small-tr");
        tr.appendChild(tdType);

        // Rarity.
        let tdRarity = document.createElement("td");
        let fakestr = `<span class="badge-type-fake">` + (translations[langIndex]["fake"] || "FAKE") + `</span>`;
        tdRarity.innerHTML = (card.rarity.toLowerCase() == ((translations[0]["fake"] || "FAKE")
            .toLowerCase()) ? fakestr : translations[langIndex][card.rarity.toLowerCase()
            .trim()
            .replace(" ", "")
        ]);
        if (nowrap_td === true) tdRarity.classList.add("nowrap-td");
        if (usetall_tr === true) tdRarity.classList.add("tall-tr");
        if (usesmall_tr === true) tdRarity.classList.add("small-tr");
        tr.appendChild(tdRarity);

        // Quality badge.
        let tdQuality = document.createElement("td");
        tdQuality.innerHTML = getQualityBadge(card.quality)
            .replaceAll("None", "");
        if (nowrap_td === true) tdQuality.classList.add("nowrap-td");
        if (usetall_tr === true) tdQuality.classList.add("tall-tr");
        if (usesmall_tr === true) tdQuality.classList.add("small-tr");
        tr.appendChild(tdQuality);

        // Language badge.
        let tdLanguage = document.createElement("td");
        tdLanguage.innerHTML = getLanguageBadge(card.language)
            .replaceAll("None", "")
            .replaceAll("NONE", "");
        if (nowrap_td === true) tdLanguage.classList.add("nowrap-td");
        if (usetall_tr === true) tdLanguage.classList.add("tall-tr");
        if (usesmall_tr === true) tdLanguage.classList.add("small-tr");
        tr.appendChild(tdLanguage);

        // Edition badge.
        let tdEdition = document.createElement("td");
        tdEdition.innerHTML = getEditionBadge(card.edition.replaceAll("None", ""));
        if (nowrap_td === true) tdEdition.classList.add("nowrap-td");
        if (usetall_tr === true) tdEdition.classList.add("tall-tr");
        if (usesmall_tr === true) tdEdition.classList.add("small-tr");
        tr.appendChild(tdEdition);

        // Price I Paid.
        let tdPricePaid = document.createElement("td");
        tdPricePaid.textContent = card.pricePaid.toFixed(2);
        if (nowrap_td === true) tdPricePaid.classList.add("nowrap-td");
        if (usetall_tr === true) tdPricePaid.classList.add("tall-tr");
        if (usesmall_tr === true) tdPricePaid.classList.add("small-tr");
        tr.appendChild(tdPricePaid);

        // Market Price.

        let cleanedMarketPrice = (card.marketPrice || "").toString().replaceAll("⬆️", "")
            .replaceAll("⬇️", "")
            .replaceAll("➡️", "")
            .replaceAll("None", "");
        let tdMarketPrice = document.createElement("td");
        tdMarketPrice.textContent = card.marketPrice;
        if (nowrap_td === true) tdMarketPrice.classList.add("nowrap-td");
        if (usetall_tr === true) tdMarketPrice.classList.add("tall-tr");
        if (usesmall_tr === true) tdMarketPrice.classList.add("small-tr");
        tr.appendChild(tdMarketPrice);


        // ID.
        let tdID = document.createElement("td");
        tdID.textContent = card.id.replaceAll("None", "")
            .replaceAll("NONE", "");
        if (nowrap_td === true) tdID.classList.add("nowrap-td");
        if (usetall_tr === true) tdID.classList.add("tall-tr");
        if (usesmall_tr === true) tdID.classList.add("small-tr");
        tr.appendChild(tdID);

        // Pack ID
        let tdPackID = document.createElement("td");
        tdPackID.textContent = card.packId.replaceAll("None", "")
            .replaceAll("NONE", "") + " ";
        tdPackID.style.height = "0px";
        tdPackID.style.width = "0px";
        tdPackID.style.display = "none";
        tdPackID.style.opacity = "0%";
        if (nowrap_td === true) tdPackID.classList.add("nowrap-td");
        if (usetall_tr === true) tdPackID.classList.add("tall-tr");
        if (usesmall_tr === true) tdPackID.classList.add("small-tr");
        tr.appendChild(tdPackID);

        // Date Obtained.
        let tdDate = document.createElement("td");
        tdDate.textContent = card.dateObtained;
        if (nowrap_td === true) tdDate.classList.add("nowrap-td");
        if (usetall_tr === true) tdDate.classList.add("tall-tr");
        if (usesmall_tr === true) tdDate.classList.add("small-tr");
        tr.appendChild(tdDate);

        // Location.
        let tdLocation = document.createElement("td");
        tdLocation.textContent = card.location;
        if (nowrap_td === true) tdLocation.classList.add("nowrap-td");
        if (usetall_tr === true) tdLocation.classList.add("tall-tr");
        if (usesmall_tr === true) tdLocation.classList.add("small-tr");
        tr.appendChild(tdLocation);

        // …inside your row‐rendering loop…

        let tdComments = document.createElement("td");
        let comments = card.comments || "";

        // Clear tdComments in case it had text
        tdComments.textContent = "";

        if (enableCollections) {
            comments = comments.replaceAll("{", "[").replaceAll("}", "]");
            // Regex to match [Something] patterns
            const parts = comments.split(/(\[[^\]]+\])/g);

            parts.forEach(part => {
                if (part.startsWith("[") && part.endsWith("]")) {
                    const label = part.slice(1, -1); // remove brackets
                    const btn = createStealthButton(label);
                    tdComments.appendChild(btn);
                    tdComments.appendChild(document.createTextNode(" "));
                } else {
                    tdComments.appendChild(document.createTextNode(part));
                }
            });
        } else {
            tdComments.textContent = comments.replaceAll("{", "").replaceAll("}", "").replaceAll(/\[[^\]]+\]/g, "").trim();
        }

        if (sortBy === "stonks") {
            const profit = (cleanedMarketPrice - Number(card.pricePaid))
                .toFixed(2);

            if (Number(profit) > 0.00 && Number(card.pricePaid) > 0.00) {
                // inject <br> only if there are comments
                tdComments.textContent = ("+" + profit);
            } else {
                tdComments.textContent = "";
            }
        }

        tr.appendChild(tdComments);



        if (nowrap_td === true) tdComments.classList.add("nowrap-td");
        if (usetall_tr === true) tdComments.classList.add("tall-tr");
        if (usesmall_tr === true) tdComments.classList.add("small-tr");
        tr.appendChild(tdComments);

        // Wiki button.
        let tdWiki = document.createElement("td");
        if (nowrap_td === true) tdWiki.classList.add("nowrap-td");
        if (usetall_tr === true) tdWiki.classList.add("tall-tr");
        if (usesmall_tr === true) tdWiki.classList.add("small-tr");
        if (card.wikiUrl && card.wikiUrl.length > 0) {
            let wikiBtn = document.createElement("button");
            wikiBtn.textContent = translations[langIndex]["go"];
            wikiBtn.addEventListener("click", () => {
                window.open(card.wikiUrl, "_blank");
            });
            tdWiki.appendChild(wikiBtn);
        } else {
            tdWiki.textContent = "";
        }
        tr.appendChild(tdWiki);

        tbody.appendChild(tr);
    });

    setCurrentDisplayedCards(filtered_cards.slice());

    updateTotalSpent();

    if (resultCountEl) {
        resultCountEl.innerHTML = "<div class=\"results\">" + translations[langIndex]["showingcards"]
            .replace("NUMBER", filtered_cards.length.toString())
            .replace("UNIQUENUM", uniqueNames.size.toString()) + "\t</div>";
    }
}

if (enableCollections) {
    // Detect CTRL+F / CMD+F and hide labels temporarily
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
            console.log("Hiding");
            document.querySelectorAll(".tag-button").forEach(btn => {
                btn.classList.add("hidden-label");
            });

            // Optional: restore after 5 seconds
            setTimeout(() => {
                document.querySelectorAll(".tag-button").forEach(btn => {
                    btn.classList.remove("hidden-label");
                });
            }, 9999);
        }
    });
}