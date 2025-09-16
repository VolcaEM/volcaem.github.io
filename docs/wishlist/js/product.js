class Product {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.image = data.image;
        this.price = parseFloat(data.price) || 0;
        this.shipping = parseFloat(data.shipping) || 0;
        this.shipping_optional = data.shipping_optional || false;
        this.url = data.url || null;
        this.force_external = data.force_external || null;
        this.paypal_tax = data.paypal_tax || false;

        // User choice: if optional, default to excluded; if not optional, include by necessity
        this.includeShipping = this.shipping_optional ? false : true;
    }

    get subtotal() {
        // If shipping is optional, include it only if the user opted in.
        // If shipping is not optional, include it always.
        const shouldInclude = this.shipping_optional ? this.includeShipping : true;
        return this.price + (shouldInclude ? this.shipping : 0);
    }

    get baseTax() {
        return +(this.subtotal * 0.05).toFixed(2); // 5% Ko‑Fi tax
    }

    get paypalTax() {
        if (!this.paypal_tax) return 0;
        const fee = this.subtotal * 0.05 + 0.35;
        return +fee.toFixed(2);
    }

    get total() {
        const rawTotal = this.subtotal + this.baseTax + this.paypalTax;
        return rawTotal % 2 === 0 ? rawTotal : Math.ceil(rawTotal / 2) * 2;
    }

    get taxes() {
        return +(this.total - this.subtotal).toFixed(2);
    }
}


async function showProduct() {
    const params = new URLSearchParams(window.location.search);
    const path = params.get('path');
    const id = params.get('id');
    if (!path || !id) return;

    const segments = path.split('/').filter(Boolean);
    const root = segments[0];

    const treeRes = await fetch(`data/${root}.json`);
    const tree = await treeRes.json();

    let node = tree;
    for (const seg of segments) {
        node = node[seg] || (node.children && node.children[seg]);
        if (!node) break;
    }

    const items = Array.isArray(node?.items) ? node.items : [];
    const data = items.find(item => String(item.id) === id);
    if (!data) {
        console.warn(`Item with id=${id} not found`);
        return;
    }

    const p = new Product(data);
    const detail = document.getElementById('detail');

    function renderPrices() {
        const pricesInner = detail.querySelector('.prices-inner');
        pricesInner.innerHTML = `
            <p>Price: ${p.price}€</p>
            <p>${
                p.shipping_optional && p.shipping > 0
                    ? (p.includeShipping ? `Shipping: ${p.shipping}€` : `Shipping (optional): ${p.shipping}€`)
                    : `Shipping: ${p.shipping}€`
            }</p>
            <p>Taxes + rounding: ${p.taxes}€</p>
            <h3>Total: ${p.total}€</h3>
        `;

        const donateBtn = detail.querySelector('.donate-btn');
        if (donateBtn) {
            donateBtn.href = `https://ko-fi.com/volca/${p.total}`;
            donateBtn.textContent = `Donate ${p.total}€ via Ko-Fi`;
        }

        // Keep the note visibility in sync if elements exist
        const shippingNote = detail.querySelector('#shipping-note');
        if (shippingNote) {
            shippingNote.style.display = p.includeShipping ? 'none' : '';
        }

        // Keep checkbox in sync with model
        const shippingCheckbox = detail.querySelector('#add-shipping');
        if (shippingCheckbox) {
            shippingCheckbox.checked = p.includeShipping;
        }

        // 📜 Debug log of all price-related variables
        console.log("=== Price Debug ===");
        console.log("Price:", p.price);
        console.log("Shipping:", p.shipping);
        console.log("Shipping Optional:", p.shipping_optional);
        console.log("Include Shipping:", p.includeShipping);
        console.log("Subtotal:", p.subtotal);
        console.log("Base Tax (Ko‑Fi):", p.baseTax);
        console.log("PayPal Tax:", p.paypalTax);
        console.log("Total (rounded):", p.total);
        console.log("Taxes (displayed):", p.taxes);
        console.log("===================");
    }

    detail.innerHTML = `
        ${p.url 
            ? `<h2 id="myname"><a href="${p.url}" target="_blank">${p.name}</a></h2>` 
            : `<h1 id="myname">${p.name}</h1>`}
        <img src="${p.image}" alt="${p.name} Image" class="zoomable">
        <div class="prices">
            <div class="prices-inner"></div>
            ${
                p.shipping_optional && p.shipping > 0
                    ? `
                    <div class="shipping-note">
                        <p id="shipping-note">
                            Shipping is <b>optional</b> for this item, and as such is <b>not</b> included in the total.
                            <br>
                            If you choose to add shipping, it <i>may</i> increase the <b>taxes</b> — please be careful.
                            <br>
                        </p>
                        <label>
                            <input type="checkbox" id="add-shipping" class="mycheckbox"> Add shipping (${p.shipping}€+)
                        </label>
                    </div>`
                    : ''
            }
        </div>
        ${
            p.price >= 952380 || p.price <= 0
                ? ''
                : `<a class="donate-btn" href="https://ko-fi.com/volca/${p.total}" target="_blank">
                       Donate ${p.total}€ via Ko-Fi
                   </a>`
        }
    `;

    const backButton = document.createElement('a');
    backButton.href = `items.html?path=${encodeURIComponent(path)}`;
    backButton.textContent = `← Back to ${node.name || 'Category'}`;
    backButton.className = 'back-button';
    detail.appendChild(backButton);

    if (p.price < 952380 && p.price > 0.00) {
        const note = document.createElement('p');
        note.className = 'donation-note';
        note.innerHTML = `
            <strong>Note:</strong> When donating, <b>please</b> include "<em>${p.name}</em>" or 
            <code><b id="copy-id" style="cursor:pointer;" title="Click to copy">ID ${p.id}</b></code> 
            in the message box so I know what it's for!
        `;
        detail.appendChild(note);
    }

    document.addEventListener('click', e => {
        if (e.target.id === 'copy-id') {
            navigator.clipboard.writeText(`ID ${p.id}`).then(() => {
                alert(`Copied: ID ${p.id}`);
            }).catch(err => console.error('Copy failed:', err));
        }
    });

    // Initial render — respects Product’s default includeShipping
    renderPrices();

    // Checkbox event
    const shippingCheckbox = document.getElementById('add-shipping');
    if (shippingCheckbox) {
        // Set initial checkbox state to match the model
        shippingCheckbox.checked = p.includeShipping;

        shippingCheckbox.addEventListener('change', e => {
            p.includeShipping = e.target.checked; // user’s deliberate choice
            renderPrices();
        });
    }

    // Zoom functionality
    const productImg = detail.querySelector('img.zoomable');
    if (productImg && productImg.src.length > 2) {
        productImg.addEventListener('click', () => {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.id = 'zoom-overlay';

            // Create zoomed image
            const zoomedImg = document.createElement('img');
            zoomedImg.src = productImg.src;
            zoomedImg.alt = productImg.alt;

            // Append and show
            overlay.appendChild(zoomedImg);
            document.body.appendChild(overlay);

            // Close on click or Escape
            const closeZoom = () => overlay.remove();
            zoomedImg.addEventListener('click', closeZoom);
            overlay.addEventListener('click', closeZoom);
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    closeZoom();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    }

}

showProduct();