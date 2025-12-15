import {
    langIndex,
} from './config.js';

import {
    manager,
} from './card.js';

import {
    translations,
} from './translations.js';

export function updatePackStats() {
    const container = document.getElementById("packStats");
    if (!container) return;

    const cards = manager.cards; // use all cards (unfiltered)
    const total = cards.length;
    const packMap = {}; // stores counts by resolved packId
    const unknownValue = "unknown";

    cards.forEach(card => {
        let rawPackId = String(card.packId || "")
            .trim();
        let resolvedPackId;

        if (rawPackId !== "" && rawPackId.toLowerCase() !== unknownValue) {
            resolvedPackId = rawPackId.split("#")[0].trim();
        } else {
            const rawCardId = String(card.id || "")
                .trim();
            resolvedPackId = rawCardId !== "" ? rawCardId.split("#")[0].trim() : unknownValue;
        }

        if (resolvedPackId && resolvedPackId != "unknown") {
            packMap[resolvedPackId] = (packMap[resolvedPackId] || 0) + 1;
        }
    });

    // Sort the pack IDs by count in descending order.
    const sortedPackIds = Object.keys(packMap)
        .sort((a, b) => packMap[b] - packMap[a]);

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
        const percentage = ((count / total) * 100)
            .toFixed(2);
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
    const sortedLocations = Object.keys(locationMap)
        .sort((a, b) => locationMap[b] - locationMap[a]);

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
        const percentage = ((count / total) * 100)
            .toFixed(2);
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
    const unknownValue = "unknown";

    manager.cards.forEach(card => {
        let rawPackId = String(card.packId || "")
            .trim();
        let pid;

        if (rawPackId !== "" && rawPackId.toLowerCase() !== unknownValue) {
            pid = rawPackId.split("#")[0].trim();
        } else {
            const rawCardId = String(card.id || "")
                .trim();
            pid = rawCardId !== "" ? rawCardId.split("#")[0].trim() : unknownValue;
        }

        //console.log("Final resolved pid:", pid);
        if (pid && pid != "unknown") {
            packSet.add(pid);
        }
    });

    // ✨ Sort alphabetically
    const packOptionsLines = [...packSet]
        .sort((a, b) => a.localeCompare(b))
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
        const name = card.name.replaceAll("<", "")
            .replaceAll(">", "") || translations[langIndex]["Unknown"];
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