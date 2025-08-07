import {
    CANVAS_SIZE,
} from './config.js';

import {
    getLuminance,
    drawLegend,
} from './canvas.js';

export function drawPieChart(canvasId, data, legendId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const total = data.reduce((sum, d) => sum + d.value, 0);
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    const radius = CANVAS_SIZE / 2 - 10;

    let startAngle = 0;
    canvas._slices = [];

    data.forEach(d => {
        const sliceAngle = (d.value / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        // Fill slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = d.color;
        ctx.fill();

        // Add border
        const lum = getLuminance(d.color);
        const border = lum > 60 ? '#000' : '#fff';
        ctx.strokeStyle = border;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        canvas._slices.push({ startAngle, endAngle, data: d });
        startAngle = endAngle;
    });

    drawLegend(data, legendId);
    setupPieTooltip(canvas, data);
}

function setupPieTooltip(canvas, data) {
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

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    // assume radius same as in drawPieChart()
    const radius = canvas.width / 2 - 10;

    canvas.onmousemove = evt => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mx = (evt.clientX - rect.left) * scaleX;
        const my = (evt.clientY - rect.top) * scaleY;

        // radial quick‐reject
        const dx = mx - centerX;
        const dy = my - centerY;
        if (dx * dx + dy * dy > radius * radius) {
            tooltip.style.display = 'none';
            return;
        }

        // find matching slice
        let hitSlice = null;
        canvas._slices.forEach(s => {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, s.startAngle, s.endAngle);
            ctx.closePath();
            if (ctx.isPointInPath(mx, my)) {
                hitSlice = s.data;
            }
        });

        if (!hitSlice) {
            tooltip.style.display = 'none';
            return;
        }

        // build tooltip content
        const total = data.reduce((sum, d) => sum + d.value, 0);
        const pct = ((hitSlice.value / total) * 100).toFixed(2);
        tooltip.innerHTML = `
      <strong>${hitSlice.label}</strong><br>
      Count: ${hitSlice.value}<br>
      ${pct}% of total
    `;

        // position it
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