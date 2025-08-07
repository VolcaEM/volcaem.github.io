import {
    CANVAS_SIZE,
} from './config.js';

import {
    getLuminance,
    drawLegend,
} from './canvas.js';

/**
 * Draws a “defrag‐style” square chart with legend + tooltip.
 * Uses full‐canvas greedy packing, but if any items get
 * dropped, it shrinks everything a bit and retries.
 */
export function drawSquareChart(canvasId, data, legendId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // fix size
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    // try packing, shrinking by 10% up to 10 times
    const rects = layoutSquares(data, CANVAS_SIZE, CANVAS_SIZE);
    canvas._rects = rects;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // draw each square with contrasting border
    rects.forEach(r => {
        const c = r.data.color;
        const lum = getLuminance(c);
        const border = lum > 60 ? '#000' : '#fff';

        ctx.fillStyle = c;
        ctx.fillRect(r.x, r.y, r.width, r.height);

        ctx.strokeStyle = border;
        ctx.lineWidth = 2;
        ctx.strokeRect(r.x, r.y, r.width, r.height);
    });

    drawLegend(data, legendId);
    setupTooltip(canvas, data);
}



/**
 * Greedy rectangle‐packing that retries with a smaller scale if
 * it fails to pack every item. Returns the final rect list.
 */
function layoutSquares(data, width, height) {
    const totalValue = data.reduce((sum, d) => sum + d.value, 0);
    const totalArea = width * height;

    let scale = 1;
    let rects = [];

    // up to 10 attempts, each time shrinking by 10%
    for (let attempt = 0; attempt < 10; attempt++) {
        // 1) compute each square’s size (area ∝ value) & apply scale
        const squares = data
            .map(d => {
                const raw = Math.sqrt((d.value / totalValue) * totalArea);
                return { ...d, size: raw * scale };
            })
            .sort((a, b) => b.size - a.size);

        // 2) try greedy placement
        let gaps = [{ x: 0, y: 0, width, height }];
        rects = [];

        squares.forEach(item => {
            const idx = gaps.findIndex(
                g => g.width >= item.size && g.height >= item.size
            );
            if (idx < 0) return; // no fit

            const gap = gaps.splice(idx, 1)[0];
            const s = item.size;

            rects.push({ x: gap.x, y: gap.y, width: s, height: s, data: item });

            // carve out right + down gaps
            const rightGap = {
                x: gap.x + s,
                y: gap.y,
                width: gap.width - s,
                height: s
            };
            const downGap = {
                x: gap.x,
                y: gap.y + s,
                width: gap.width,
                height: gap.height - s
            };

            if (rightGap.width > 1 && rightGap.height > 1) gaps.push(rightGap);
            if (downGap.width > 1 && downGap.height > 1) gaps.push(downGap);

            gaps.sort((a, b) => a.width * a.height - b.width * b.height);
        });

        // 3) if we placed them all, stop; otherwise shrink and retry
        if (rects.length === data.length) break;
        scale *= 0.9;
    }

    return rects;
}

/**
 * Shared tooltip for all charts.
 */
function setupTooltip(canvas, data) {
    let tooltip = document.getElementById('chartTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'chartTooltip';
        Object.assign(tooltip.style, {
            position: 'fixed',
            padding: '6px 10px',
            borderRadius: '4px',
            pointerEvents: 'none',
            display: 'none',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            fontSize: '12px',
            zIndex: '9999'
        });
        document.body.appendChild(tooltip);
    }

    canvas.onmousemove = evt => {
        const bbox = canvas.getBoundingClientRect();
        const scaleX = canvas.width / bbox.width;
        const scaleY = canvas.height / bbox.height;
        const mx = (evt.clientX - bbox.left) * scaleX;
        const my = (evt.clientY - bbox.top) * scaleY;

        const hit = canvas._rects.find(r =>
            mx >= r.x && mx <= r.x + r.width &&
            my >= r.y && my <= r.y + r.height
        );
        if (!hit) {
            tooltip.style.display = 'none';
            return;
        }

        const d = hit.data;
        const tot = data.reduce((s, x) => s + x.value, 0);
        const pct = ((d.value / tot) * 100).toFixed(2);

        tooltip.innerHTML = `
      <strong>${d.label}</strong><br>
      Count: ${d.value}<br>
      ${pct}% of total
    `;

        const tw = tooltip.offsetWidth;
        const th = tooltip.offsetHeight;
        let left = evt.clientX + 12;
        let top = evt.clientY + 12;

        if (left + tw > window.innerWidth) left = evt.clientX - tw - 12;
        if (top + th > window.innerHeight) top = evt.clientY - th - 12;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.display = 'block';
    };

    canvas.onmouseleave = () => {
        tooltip.style.display = 'none';
    };
}