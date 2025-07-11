document.addEventListener('DOMContentLoaded', () => {
    const tierListContainer = document.getElementById('tier-list-container');
    const imageLoader = document.getElementById('image-loader');
    const imageContainer = document.getElementById('image-container');
    const addTierButton = document.getElementById('add-tier-button');
    const saveButton = document.getElementById('save-button');

    let tierCount = 0;
    let zoomedImage = null;

    // 0) Create a single tooltip DIV
    const tooltip = document.createElement('div');
    Object.assign(tooltip.style, {
        position: 'absolute',
        padding: '4px 8px',
        background: 'rgba(0,0,0,0.75)',
        color: '#fff',
        borderRadius: '4px',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        fontSize: '12px',
        display: 'none',
        zIndex: '20000'
    });
    document.body.appendChild(tooltip);

    function showTooltip(e) {
        tooltip.textContent = e.currentTarget.dataset.filename;
        tooltip.style.display = 'block';
        moveTooltip(e);
    }

    function moveTooltip(e) {
        const x = e.pageX + 10,
            y = e.pageY + 10;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }

    function hideTooltip() {
        tooltip.style.display = 'none';
    }

    // 1) Inject Zoom CSS (50vh height)
    const styleTag = document.createElement('style');
    styleTag.textContent = `
    img.image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      transition: transform 0.3s ease;
      cursor: zoom-in;
    }
    .zoomed-image {
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      height: 60vh !important;
      width: auto !important;
      max-width: 90vw !important;
      z-index: 10000 !important;
      cursor: zoom-out !important;
      object-fit: contain !important;
    }
  `;
    document.head.appendChild(styleTag);

    // toggle zoom on click
    function handleImageClick(e) {
        const img = e.currentTarget;
        if (zoomedImage === img) {
            img.classList.remove('zoomed-image');
            zoomedImage = null;
        } else {
            if (zoomedImage) zoomedImage.classList.remove('zoomed-image');
            img.classList.add('zoomed-image');
            zoomedImage = img;
        }
    }

    // drag‐start helper
    function dragStart(e) {
        // hide tooltip if dragging starts
        hideTooltip();
        if (zoomedImage === e.currentTarget) {
            e.currentTarget.classList.remove('zoomed-image');
            zoomedImage = null;
        }
        e.dataTransfer.setData('text/plain', e.currentTarget.src);
    }

    // reorder main images
    function sortImageContainer() {
        Array.from(imageContainer.querySelectorAll('img.image'))
            .sort((a, b) =>
                a.dataset.filename.localeCompare(
                    b.dataset.filename,
                    undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    }
                )
            )
            .forEach(img => imageContainer.appendChild(img));
    }

    // DRY: make an <img> node wired up with tooltip, drag, click, etc.
    function makeImageElement(src, filename) {
        const img = document.createElement('img');
        img.src = src;
        img.dataset.filename = filename;
        img.classList.add('image');
        img.draggable = true;
        img.addEventListener('click', handleImageClick);
        img.addEventListener('dragstart', dragStart);
        img.addEventListener('mouseenter', showTooltip);
        img.addEventListener('mousemove', moveTooltip);
        img.addEventListener('mouseleave', hideTooltip);
        return img;
    }

    // create a new tier
    function createTier(name = `Tier ${tierCount+1}`) {
        const tier = document.createElement('div');
        tier.classList.add('tier');
        tier.dataset.tier = tierCount++;

        const header = document.createElement('div');
        header.classList.add('tier-name', 'custom-outline');
        header.contentEditable = true;
        header.textContent = name;
        header.style.backgroundColor = getRandomColor();
        tier.appendChild(header);

        const ctrls = document.createElement('div');
        ctrls.classList.add('tier-controls');
        [
            ['↑', -1],
            ['↓', 1],
            ['X', 'del']
        ].forEach(([txt, act]) => {
            const btn = document.createElement('button');
            btn.textContent = txt;
            if (act === 'del') btn.onclick = () => deleteTier(tier);
            else btn.onclick = () => moveTier(tier, act);
            ctrls.appendChild(btn);
        });
        header.appendChild(ctrls);

        const imgsDiv = document.createElement('div');
        imgsDiv.classList.add('tier-images');
        tier.appendChild(imgsDiv);

        tier.addEventListener('dragover', e => e.preventDefault());
        tier.addEventListener('drop', e => {
            e.preventDefault();
            const src = e.dataTransfer.getData('text/plain');
            const orig = document.querySelector(`img[src="${src}"]`);
            if (!orig) return;

            // cleanup
            hideTooltip();
            if (zoomedImage === orig) {
                orig.classList.remove('zoomed-image');
                zoomedImage = null;
            }

            const filename = orig.dataset.filename;
            orig.remove();
            imgsDiv.appendChild(makeImageElement(src, filename));
        });

        tierListContainer.appendChild(tier);
    }

    function moveTier(tier, dir) {
        const kids = Array.from(tierListContainer.children);
        const i = kids.indexOf(tier),
            t = i + dir;
        if (t < 0 || t >= kids.length) return;
        tierListContainer.insertBefore(
            tier,
            kids[t + (dir > 0 ? 1 : 0)]
        );
    }

    function deleteTier(tier) {
        tier.querySelectorAll('img.image').forEach(img => {
            hideTooltip();
            img.classList.remove('zoomed-image');
            zoomedImage = null;
            imageContainer.appendChild(img);
        });
        sortImageContainer();
        tier.remove();
    }

    function getRandomColor() {
        return '#' + [...Array(6)]
            .map(_ => '0123456789ABCDEF' [Math.random() * 16 | 0])
            .join('');
    }

    function debounce(fn, ms) {
        let t;
        return (...a) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...a), ms);
        };
    }

    imageLoader.addEventListener('change', debounce(e => {
        Array.from(e.target.files).forEach(file => {
            const url = URL.createObjectURL(file);
            const img = makeImageElement(url, file.name);
            imageContainer.appendChild(img);
            sortImageContainer();
        });
    }, 100));

    imageContainer.addEventListener('dragover', e => e.preventDefault());
    imageContainer.addEventListener('drop', e => {
        e.preventDefault();
        requestAnimationFrame(() => {
            const src = e.dataTransfer.getData('text/plain');
            const orig = document.querySelector(`img[src="${src}"]`);
            if (!orig) return;
            const filename = orig.dataset.filename;
            orig.remove();
            const img = makeImageElement(src, filename);
            imageContainer.appendChild(img);
            sortImageContainer();
        });
    });

    saveButton.addEventListener('click', () =>
        html2canvas(tierListContainer).then(canvas => {
            const a = document.createElement('a');
            a.download = 'tier-list.png';
            a.href = canvas.toDataURL();
            a.click();
        })
    );

    // Init
    createTier();
    addTierButton.onclick = () => createTier();
});