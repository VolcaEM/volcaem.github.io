// canvas.js

import {
    usePieChart,
    CANVAS_SIZE,
} from './config.js';

import {
    drawSquareChart,
} from './square_charts.js';

import {
    drawPieChart,
} from './pie_charts.js';

import {
    currentGame,
} from './detect.js';

/**
 * Fisher–Yates shuffle
 */
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Count & color-assign
 */
function prepareData(cards, prop, customColorMap = {}) {
    const counts = cards.reduce((acc, c) => {
        const key = c[prop] ?? 'Unknown';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const entries = Object.entries(counts)
        .sort((a, b) => a[0].localeCompare(b[0]));

    if (!entries.length) return [];

    const hueStep = 360 / entries.length;
    const baseColors = entries.map((_, i) =>
        `hsl(${Math.round(i * hueStep)},70%,60%)`
    );
    const palette = shuffleArray(baseColors);

    return entries.map(([label, value], i) => ({
        label,
        value,
        color: customColorMap[label] || palette[i]
    }));
}

/**
 * Main initializer
 */
export function initChart(
    cards,
    canvasId,
    prop,
    customColorMap = {},
    legendId,
    chartType,
) {
    let data = prepareData(cards, prop, customColorMap);
    if (!data.length) return;

    if (currentGame === "Yu-Gi-Oh") {
        if (prop === 'type') {
            data.forEach(item => {
                // override Spell/Trap
                if (item.label.toLowerCase().includes('spell')) item.color = 'lightseagreen';
                if (item.label.toLowerCase().includes('trap')) item.color = 'magenta';
                if (item.label.toLowerCase().includes('vanilla')) item.color = 'yellow';
                if (item.label.toLowerCase().includes('effect')) item.color = 'orange';
                if (item.label.toLowerCase().includes('ritual')) item.color = 'aquamarine';
                if (item.label.toLowerCase().includes('fusion')) item.color = 'purple';
                if (item.label.toLowerCase().includes('synchro')) item.color = 'silver';
                if (item.label.toLowerCase().includes('xyz')) item.color = 'black';
                if (item.label.toLowerCase().includes('link')) item.color = 'blue';
                if (item.label.toLowerCase().includes('token')) item.color = 'lightslategray';
                if (item.label.toLowerCase().includes('product')) item.color = 'green';
            });
        }
    }

    if (prop === 'quality') {
        data.forEach(item => {
            if (item.label.toLowerCase() === 'mint') item.color = '#17a2b8';
            if (item.label.toLowerCase() === 'near mint') item.color = '#87b726';
            if (item.label.toLowerCase() === 'slightly played') item.color = '#c8d400';
            if (item.label.toLowerCase() === 'moderately played') item.color = '#f9b000';
            if (item.label.toLowerCase() === 'played') item.color = '#ee7203';
            if (item.label.toLowerCase() === 'poor') item.color = '#b13907';
            if (item.label.toLowerCase() === 'unknown (good)') item.color = 'olive';
            if (item.label.toLowerCase() === 'unknown (bad)') item.color = 'palevioletred';
            if (item.label.toLowerCase() === 'none') item.color = 'black';
        });
    }

    if (prop === 'edition') {
        data.forEach(item => {
            if (item.label.toLowerCase() === 'limited edition') item.color = 'gold';
            if (item.label.toLowerCase() === 'first edition') item.color = 'lavender';
            if (item.label.toLowerCase() === 'standard edition') item.color = 'papayawhip';
            if (item.label.toLowerCase() === 'none') item.color = 'black';
        });
    }

    if (chartType === 'pie') {
        drawPieChart(canvasId, data, legendId);
    } else {
        drawSquareChart(canvasId, data, legendId);
    }
}

export function renderAllCharts(cards) {
    const container = document.getElementById('chartsContainer');
    if (!container) return;
    container.innerHTML = '';

    const props = ['type', 'rarity', 'quality', 'language', 'edition'];

    props.forEach(prop => {
        // 1) Create a wrapper DIV for this chart
        const chartDiv = document.createElement('div');
        chartDiv.className = 'chartBlock'; // optional, for styling
        container.appendChild(chartDiv);

        // 2) Title
        const title = document.createElement('h3');
        title.textContent = prop.charAt(0).toUpperCase() + prop.slice(1);
        chartDiv.appendChild(title);

        // 3) Canvas (fixed 500×500)
        const canvas = document.createElement('canvas');
        canvas.classList.add('canvasclass');
        canvas.id = `chart_${prop}`;
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        chartDiv.appendChild(canvas);

        // 4) Legend
        const legend = document.createElement('div');
        legend.id = `legend_${prop}`;
        chartDiv.appendChild(legend);

        // 5) Draw the chart into the canvas
        initChart(
            cards,
            canvas.id,
            prop, {},
            legend.id,
            usePieChart ? "pie" : "square",
        );

        // 6) Add two <br>s to force a gap before the next chart
        container.appendChild(document.createElement('br'));
        container.appendChild(document.createElement('hr'));
        container.appendChild(document.createElement('br'));
    });
}

/**
 * Extracts lightness from an HSL string for a contrast check.
 */
export function getLuminance(hsl) {
    const parts = hsl.match(/\d+/g);
    return parts ? parseInt(parts[2], 10) : 50;
}

/**
 * Renders the legend: color swatch, label, count & percentage.
 */
export function drawLegend(data, legendId) {
    const legend = document.getElementById(legendId);
    if (!legend) return;
    legend.innerHTML = '';

    data.sort((a, b) => b.value - a.value); // if count is undefined

    const total = data.reduce((sum, d) => sum + d.value, 0);
    data.forEach(item => {
        const pct = ((item.value / total) * 100).toFixed(2);
        const entry = document.createElement('div');
        entry.style.marginBottom = '4px';
        entry.innerHTML = `
      <span style="
        display:inline-block;
        width:12px; height:12px;
        margin-right:6px;
        background:${item.color};
        border:1px solid #ccc;
      "></span>
      ${item.label}: ${item.value} (${pct}%)
    `;
        legend.appendChild(entry);
    });
}