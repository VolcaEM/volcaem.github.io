// script.js
// Full, self-contained script for XYZ summon: image painting, particles, deterministic material flights,
// spiral (MaterialUzu) rotation with fallback, and full playSummon timeline with logging.

// ---------- Image list (edit filenames placed inside images/ folder) ----------
const imageList = {
    materials: ['mat1.png', 'mat2.png'], // material card art
    back: 'card_back.png', // card back or placeholder
    final: 'result_card.png', // final summoned card art
    star: 'starfield.png', // star background (fades in on press)
    materialUzu: 'spiral.png', // spiral/uzu image
    centerFlare: 'center.png' // center flare image
};

const img = name => `images/${name}`; // helper URL builder

// ---------- DOM refs ----------
const stage = document.getElementById('stage');
const camera = document.getElementById('camera');
const cardStack = document.getElementById('card-stack');
const cards = {
    back: cardStack.querySelector('.card.back'),
    m1: cardStack.querySelector('.card.material.m1'),
    m2: cardStack.querySelector('.card.material.m2')
};
const xyzEffect = document.getElementById('xyz-effect');
const vortex = document.getElementById('vortex');
const materialUzuEl = document.getElementById('material-uzu');
const centerFlareEl = document.getElementById('center-flare');
const glowOrb = document.getElementById('glow-orb');
const particlesCanvas = document.getElementById('particles');
const playBtn = document.getElementById('playBtn');
const starsEl = document.getElementById('stars');

let ctx, cw, ch, particles = [],
    lastTime = null;

// ---------- Painting / preload ----------
function setElementImage(el, filename, opts = {}) {
    if (!el || !filename) return;
    const url = img(filename);
    el.style.backgroundImage = `url("${url}")`;
    el.style.backgroundSize = opts.cover ? 'cover' : 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = 'center';
}

function preloadAndPaint() {
    if (imageList.star && starsEl) {
        starsEl.style.backgroundImage = `url("${img(imageList.star)}")`;
        starsEl.style.opacity = '0';
    }

    if (cards.back && imageList.back) setElementImage(cards.back, imageList.back, { cover: true });
    if (cards.m1 && imageList.materials[0]) setElementImage(cards.m1, imageList.materials[0], { cover: true });
    if (cards.m2 && imageList.materials[1]) setElementImage(cards.m2, imageList.materials[1], { cover: true });

    if (materialUzuEl && imageList.materialUzu) setElementImage(materialUzuEl, imageList.materialUzu, { cover: true });
    if (centerFlareEl && imageList.centerFlare) setElementImage(centerFlareEl, imageList.centerFlare, { cover: true });
}

// ---------- Particle engine ----------
function initParticles() {
    const dpr = window.devicePixelRatio || 1;
    cw = particlesCanvas.width = window.innerWidth * dpr;
    ch = particlesCanvas.height = window.innerHeight * dpr;
    particlesCanvas.style.width = window.innerWidth + 'px';
    particlesCanvas.style.height = window.innerHeight + 'px';
    ctx = particlesCanvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawnParticle(x, y, vx, vy, color, size, life) {
    particles.push({ x, y, vx, vy, color, size, life, age: 0 });
}

function stepParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        if (p.age >= p.life) { particles.splice(i, 1); continue; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 300 * dt;
    }
}

function drawParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const p of particles) {
        const alpha = Math.max(0, 1 - p.age / p.life);
        ctx.fillStyle = `rgba(${p.color},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.2, p.size * (1 - p.age / p.life)), 0, Math.PI * 2);
        ctx.fill();
    }
}

function animLoop(t) {
    if (!lastTime) lastTime = t;
    const dt = Math.min(0.033, (t - lastTime) / 1000);
    lastTime = t;
    stepParticles(dt);
    drawParticles();
    requestAnimationFrame(animLoop);
}

// ---------- Utilities ----------
function wait(ms) { return new Promise(res => setTimeout(res, ms)); }

function centerPoint() { return { x: window.innerWidth / 2, y: window.innerHeight / 2 }; }

function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

function shakeCamera(strength = 10, duration = 400) {
    const start = performance.now();

    function s(now) {
        const p = (now - start) / duration;
        if (p >= 1) { camera.style.transform = ''; return; }
        const amp = strength * (1 - p);
        const x = (Math.random() - 0.5) * amp;
        const y = (Math.random() - 0.5) * amp;
        const rot = (Math.random() - 0.5) * amp * 0.02;
        camera.style.transform = `translate(${x}px,${y}px) rotate(${rot}deg)`;
        requestAnimationFrame(s);
    }
    requestAnimationFrame(s);
}

// animateMaterialDeterministic targeting (0,0) as final point (for debugging)
function animateMaterialDeterministic(materialEl, side = 'left', duration = 1200) {
    if (!materialEl) {
        console.warn('animateMaterialDeterministic called with no element');
        return Promise.resolve();
    }

    // cubic evaluator and easing (self-contained)
    function cubicBezierPoint(t, p0, p1, p2, p3) {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;
        return {
            x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
            y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
        };
    }

    function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    // deterministic start points
    const w = window.innerWidth,
        h = window.innerHeight,
        pad = 160;
    const p0 = side === 'left' ? { x: -pad - 0.05 * w, y: 0.25 * h } : { x: w + pad + 0.05 * w, y: 0.25 * h };
    // FINAL TARGET: (0,0) in viewport coordinates (we'll center element on that point with translate(-50%,-50%))
    const center = { x: 150, y: 200 };
    const p1 = side === 'left' ? { x: -900, y: p0.y - h * 0.12 } : { x: p0.x - w * 0.18, y: p0.y - h * 0.12 };
    const p2 = side === 'left' ? { x: center.x - w * 0.18, y: center.y - h * 0.18 } : { x: center.x + w * 0.18, y: center.y - h * 0.18 };
    const bez = { p0, p1, p2, p3: center };

    // DOM prep
    materialEl.classList.add('in-flight');
    materialEl.style.transition = 'none';
    materialEl.style.opacity = '1';
    materialEl.style.willChange = 'transform, opacity';

    // place at start using fixed left/top = p0; center visually with translate(-50%,-50%)
    materialEl.style.position = 'fixed';
    materialEl.style.left = `${Math.round(bez.p0.x)}px`;
    materialEl.style.top = `${Math.round(bez.p0.y)}px`;
    materialEl.style.transformOrigin = '50% 50%';
    materialEl.style.transform = `translate(-50%,-50%) scale(1) rotate(${side==='left' ? -12 : 12}deg)`;

    console.log(`[material:${side}] bezier p0=${JSON.stringify(bez.p0)} p1=${JSON.stringify(bez.p1)} p2=${JSON.stringify(bez.p2)} p3(target 0,0)=${JSON.stringify(bez.p3)}`);
    console.log(`[material:${side}] animation started at ${new Date().toISOString()} startPos=${JSON.stringify(bez.p0)} target=(0,0)`);

    return new Promise(resolve => {
        const startTime = performance.now();
        let lastLoggedPercent = -1;
        let lastLogTs = 0;

        function frame(now) {
            const raw = (now - startTime) / duration;
            const tClamped = Math.min(1, Math.max(0, raw));
            const t = easeInOutCubic(tClamped);

            const pt = cubicBezierPoint(t, bez.p0, bez.p1, bez.p2, bez.p3);

            // update left/top to world center position (pt). translate(-50%,-50%) keeps element centered on that point.
            materialEl.style.left = `${Math.round(pt.x)}px`;
            materialEl.style.top = `${Math.round(pt.y)}px`;

            const rot = (side === 'left' ? -18 : 18) * (1 - t) * 0.6;
            const scale = 1 - 0.72 * t;
            materialEl.style.transform = `translate(-50%,-50%) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

            const percent = Math.floor(tClamped * 5);
            const nowMs = Date.now();
            if ((percent !== lastLoggedPercent && percent >= 0) || (nowMs - lastLogTs) > 250) {
                lastLoggedPercent = percent;
                lastLogTs = nowMs;
                console.log(
                    `[material:${side}] progress ${(tClamped*100).toFixed(0)}%`,
                    `worldCenterPos=(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`,
                    `left/top=(${Math.round(pt.x)}, ${Math.round(pt.y)})`,
                    `t=${tClamped.toFixed(3)}`
                );
            }

            if (tClamped < 1) {
                requestAnimationFrame(frame);
            } else {
                // final ensure exact (0,0) and disappear into it
                materialEl.style.left = `${center.x}px`;
                materialEl.style.top = `${center.y}px`;
                materialEl.style.transform = `translate(-50%,-50%) scale(0.18)`;
                materialEl.style.opacity = '0';
                console.log(`[material:${side}] final snap to target coords (${center.x}, ${center.y})`);
                setTimeout(() => {
                    materialEl.classList.remove('in-flight');
                    materialEl.classList.add('final-pos');
                    materialEl.style.position = '';
                    materialEl.style.left = '';
                    materialEl.style.top = '';
                    materialEl.style.transform = '';
                    materialEl.style.opacity = '';
                    materialEl.style.willChange = '';
                    console.log(`[material:${side}] complete at ${new Date().toISOString()}`);
                    resolve();
                }, 220);
            }
        }

        requestAnimationFrame(frame);
    });
}



// ---------- Spiral rotation start/stop (CSS class + JS fallback) ----------
function startUzuRotation(speedSeconds = 6) {
    if (!materialUzuEl) {
        console.log("No spiral");
        return;
    }
    materialUzuEl.style.animationTimingFunction = 'linear';
    materialUzuEl.style.animationDuration = `${speedSeconds}s`;
    materialUzuEl.classList.add('rotate-uzu');

    const computed = window.getComputedStyle(materialUzuEl);
    const hasAnimation = computed.animationName && computed.animationName !== 'none';
    if (!hasAnimation) {
        let start = null;
        const anglePerMs = 360 / (speedSeconds * 1000);

        function step(ts) {
            if (!start) start = ts;
            const elapsed = ts - start;
            const angle = (elapsed * anglePerMs) % 360;
            materialUzuEl.style.transform = `translate(-50%,-50%) rotate(${angle}deg) scale(1)`;
            materialUzuEl._uzuRaf = requestAnimationFrame(step);
        }
        if (materialUzuEl._uzuRaf) cancelAnimationFrame(materialUzuEl._uzuRaf);
        materialUzuEl._uzuRaf = requestAnimationFrame(step);
    }
}

function stopUzuRotation() {
    if (!materialUzuEl) return;
    materialUzuEl.classList.remove('rotate-uzu');
    if (materialUzuEl._uzuRaf) {
        cancelAnimationFrame(materialUzuEl._uzuRaf);
        materialUzuEl._uzuRaf = null;
    }
    materialUzuEl.style.transform = 'translate(-50%,-50%) scale(1)';
}

// ---------- Show/hide helpers for Uzu and flare ----------
function showUzuAndFlare() {
    if (materialUzuEl) {
        materialUzuEl.style.position = 'fixed';
        materialUzuEl.style.left = '50%';
        materialUzuEl.style.top = '50%';
        materialUzuEl.style.transform = 'translate(-50%,-50%) scale(1)';
        materialUzuEl.style.opacity = '1';
    }
    if (centerFlareEl) {
        centerFlareEl.style.position = 'fixed';
        centerFlareEl.style.left = '50%';
        centerFlareEl.style.top = '50%';
        centerFlareEl.style.transform = 'translate(-50%,-50%) scale(1)';
        centerFlareEl.style.opacity = '1';
    }
}

function hideUzuAndFlare() {
    if (materialUzuEl) {
        materialUzuEl.style.opacity = '0';
        materialUzuEl.style.transform = 'translate(-50%,-50%) scale(0.9)';
    }
    if (centerFlareEl) {
        centerFlareEl.style.opacity = '0';
        centerFlareEl.style.transform = 'translate(-50%,-50%) scale(0.9)';
    }
}

// load and play a sound, returns a Promise that resolves when playback ends or is stopped
function playSoundOnce(url, { volume = 1.0 } = {}) {
    return new Promise((resolve, reject) => {
        try {
            const audio = new Audio(url);
            audio.preload = 'auto';
            audio.volume = Math.max(0, Math.min(1, volume));
            const cleanup = () => {
                audio.removeEventListener('ended', onEnded);
                audio.removeEventListener('error', onError);
            };
            const onEnded = () => {
                cleanup();
                resolve();
            };
            const onError = (e) => {
                cleanup();
                resolve();
            }; // resolve to avoid breaking timeline on load error
            audio.addEventListener('ended', onEnded);
            audio.addEventListener('error', onError);
            // ensure play returns a promise and handle promise rejection from autoplay policy
            audio.play().catch(err => {
                // user gesture or autoplay blocked, resolve to continue without sound
                console.warn('Audio play blocked or failed', err);
                cleanup();
                resolve();
            });
        } catch (err) {
            console.warn('playSoundOnce error', err);
            resolve();
        }
    });
}


// ---------- Main timeline: playSummon ----------
async function playSummon() {

    // 0) Immediately show starfield
    if (imageList.star && starsEl) {
        starsEl.style.transition = 'opacity 520ms ease';
        requestAnimationFrame(() => { starsEl.style.opacity = '1'; });
    }

    // reset state
    document.body.classList.remove('effect-active', 'effect-pulse');
    particles.length = 0;
    lastTime = null;

    // show spiral + flare and start rotation
    await showUzuAndFlare();
    await startUzuRotation(6);

    // prepare materials (hidden)
    [cards.m1, cards.m2].forEach((c, i) => {
        c && c.classList.remove('final-pos');
        c && c.classList.remove('in-flight');
        if (c) {
            c.style.transition = 'transform 220ms ease-out, opacity 200ms linear';
            c.style.opacity = '0';
            c.style.transform = i === 0 ? 'translate(-28px,10px) rotateZ(-8deg) translateZ(10px)' : 'translate(28px,-14px) rotateZ(8deg) translateZ(20px)';
        }
    });
    if (cards.back) {
        cards.back.style.opacity = '0.6';
        cards.back.style.transform = 'translateZ(-40px) rotateX(8deg) scale(0.9)';
    }

    await wait(300);

    // camera micro-zoom
    if (camera) {
        camera.style.transition = 'transform 700ms cubic-bezier(.2,.9,.25,1)';
        camera.style.transform = 'scale(1.14)';
    }
    await wait(220);

    playSoundOnce('audio/start.wav', { volume: 0.1 });

    // Deterministic material flights (left then right, 500ms stagger)
    const mat1Promise = animateMaterialDeterministic(cards.m1, 'left', 1200).catch(() => {});
    await wait(120);
    setTimeout(() => {
        animateMaterialDeterministic(cards.m2, 'right', 1200).catch(() => {});
    }, 500);

    // inward streak particles
    const viewportCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    for (let i = 0; i < 22; i++) {
        const ang = Math.random() * Math.PI * 2;
        const speed = 320 + Math.random() * 240;
        const vx = Math.cos(ang) * -speed;
        const vy = Math.sin(ang) * -speed;
        spawnParticle(viewportCenter.x + (Math.random() - 0.5) * 160, viewportCenter.y + (Math.random() - 0.5) * 160, vx, vy, '255,240,200', 3 + Math.random() * 2, 0.6 + Math.random() * 0.6);
    }

    // let materials approach partway
    await wait(600);

    // Vortex / pop
    document.body.classList.add('effect-active');
    await wait(80);
    document.body.classList.add('effect-pulse');
    shakeCamera(14, 500);

    for (let i = 0; i < 42; i++) {
        const x = viewportCenter.x + (Math.random() - 0.5) * 140;
        const y = viewportCenter.y + (Math.random() - 0.5) * 140;
        const vx = (Math.random() - 0.5) * 80;
        const vy = -140 - Math.random() * 280;
        spawnParticle(x, y, vx, vy, '102,204,255', 2 + Math.random() * 3, 0.9 + Math.random() * 0.7);
    }
    await wait(200);

    // wait a short time for material flights to finish (race with timeout)
    try {
        await Promise.race([mat1Promise, new Promise(res => setTimeout(res, 700))]);
    } catch (e) { /* ignore */ }

    await wait(900);
    await stopUzuRotation();
    await hideUzuAndFlare();

    // Reveal final card
    if (imageList.final) setElementImage(cards.back, imageList.final, { cover: true });
    cards.back.classList.add('revealed');

    // call after reveal / before final cleanup
    playSoundOnce('audio/end.wav', { volume: 0.1 });


    const particlesEl = document.getElementById('particles');
    const savedParticlesZ = particlesEl ? particlesEl.style.zIndex : null;
    if (particlesEl) particlesEl.style.zIndex = '5';

    cards.back.style.opacity = '0';
    cards.back.style.transform = 'translateZ(40px) scale(0.2)';
    await wait(140);
    cards.back.style.transition = 'transform 420ms cubic-bezier(.2,.9,.25,1), opacity 220ms linear';
    cards.back.style.opacity = '1';
    cards.back.style.transform = 'translateZ(0) scale(1.04)';

    const exp = document.getElementById('explosion');
    if (exp) {
        await wait(50); // maybe?
        // ensure it uses the same transform stacking as camera/card-stack
        exp.style.display = 'block';
        // quick pop animation: scale up slightly then fade out
        exp.style.transform = 'translate(-50%,-50%) scale(0.88)';
        exp.style.opacity = '0';
        // let layout settle
        requestAnimationFrame(() => {
            exp.style.transition = 'opacity 360ms ease, transform 420ms cubic-bezier(.2,.9,.25,1)';
            exp.style.opacity = '0.9';
            exp.style.transform = 'translate(-50%,-50%) scale(1)';
            // hide after short delay so it doesn't block interactions
            setTimeout(() => {
                exp.style.opacity = '0';
                setTimeout(() => { exp.style.display = 'none'; }, 420);
            }, 1000); // visible duration
        });
    }

    await wait(260);
    cards.back.style.transform = 'translateZ(0) scale(1)';

    await wait(100);
    cards.back.style.transform = 'translateZ(0) scale(1.4)';

    for (let i = 0; i < 120; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 200 + Math.random() * 900;
        const vx = Math.cos(ang) * spd;
        const vy = Math.sin(ang) * spd;
        spawnParticle(viewportCenter.x, viewportCenter.y, vx, vy, i % 3 === 0 ? '255,215,127' : '102,204,255', 2 + Math.random() * 3, 0.9 + Math.random() * 0.8);
    }

    for (let i = 0; i < 36; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 30 + Math.random() * 160;
        spawnParticle(viewportCenter.x + (Math.random() - 0.5) * 40, viewportCenter.y + (Math.random() - 0.5) * 40, Math.cos(ang) * spd, Math.sin(ang) * spd, '255,245,220', 1 + Math.random() * 2, 0.9 + Math.random() * 0.8);
    }
    shakeCamera(6, 420);

    await wait(380);
    document.body.classList.remove('effect-pulse');

    if (particlesEl) particlesEl.style.zIndex = savedParticlesZ || '25';

    await wait(300);
    document.body.classList.remove('effect-active');

    // cleanup materials
    [cards.m1, cards.m2].forEach(c => {
        if (!c) return;
        c.classList.remove('in-flight');
        c.classList.remove('final-pos');
        c.style.position = '';
        c.style.left = '';
        c.style.top = '';
        c.style.transform = '';
        c.style.opacity = '';
    });
}

// ---------- Event wiring and init ----------
function onResize() {
    initParticles();
}

function attachEvents() {
    window.addEventListener('resize', onResize);
}

async function init() {
    // --- NEW: check URL query for ?final=... ---
    const params = new URLSearchParams(window.location.search);
    const finalParam = params.get('final');
    if (finalParam) {
        // assign dynamically; you can prepend a folder if needed
        imageList.final = finalParam + (finalParam.includes(".png") ? "" : ".png");
        console.log('imageList.final set from URL query:', imageList.final);
    } else {
        imageList.final = "39.png";
    }

    preloadAndPaint();
    initParticles();
    attachEvents();
    requestAnimationFrame(animLoop);

    // ambient particles
    const c = centerPoint();
    for (let i = 0; i < 30; i++) {
        spawnParticle(
            c.x + (Math.random() - 0.5) * window.innerWidth * 0.6,
            c.y + (Math.random() - 0.5) * window.innerHeight * 0.6,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            '200,220,255',
            0.8 + Math.random() * 1.8,
            3 + Math.random() * 2
        );
    }

    await playSummon().catch(console.error);
}

// auto-init
init();