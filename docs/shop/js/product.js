class Product {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.image = data.image;
        this.price = parseFloat(data.price) || 0;
        this.sale_price = parseFloat(data.sale_price) || this.price;
        this.shipping = parseFloat(data.shipping) || 0;
        this.shipping_optional = data.shipping_optional || false;
        this.url = data.url || null;
        this.force_external = data.force_external || null;
        this.info = data.info || null;
        this.conditions = data.conditions || null;
        this.paypal_tax = data.paypal_tax || false;
        this.variable_price = data.variable_price || false;
        this.no_donate_button = data.no_donate_button || false;
        this.specific_instructions = data.specific_instructions || null;

        // User choice: if optional, default to excluded; if not optional, include by necessity
        this.includeShipping = this.shipping_optional ? false : true;
    }

    get subtotal() {
        // If shipping is optional, include it only if the user opted in.
        // If shipping is not optional, include it always.
        const shouldInclude = this.shipping_optional ? this.includeShipping : true;
        return this.sale_price + (shouldInclude ? this.shipping : 0);
    }

    get total() {
        const rawTotal = this.subtotal;
        return rawTotal;
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
		<p>${p.sale_price < p.price? `<s>${p.price}</s> <b>${p.sale_price}</b>` : `${p.price}`}€+</p>
            <p>Shipping: ${p.shipping}€+</p>
            <h3>Total: ${p.total}€+</h3>
        `;

        // 📜 Debug log of all price-related variables
        console.log("=== Price Debug ===");
        console.log("Price:", p.price);
        console.log("Shipping:", p.shipping);
        console.log("Shipping Optional:", p.shipping_optional);
        console.log("Include Shipping:", p.includeShipping);
        console.log("Conditions:", p.conditions);
        console.log("Subtotal:", p.subtotal);
        console.log("Base Tax (Ko‑Fi):", p.baseTax);
        console.log("PayPal Tax:", p.paypalTax);
        console.log("Total (rounded):", p.total);
        console.log("Taxes (displayed):", p.taxes);
        console.log("===================");
    }

    detail.innerHTML = `
        <h1 id="myname">${p.name}</h1>
        <img src="${p.image}" alt="${p.name} Image" class="zoomable">
		${p.conditions? `<p style="text-align: center;"><b>${p.conditions}</b></p>` : ``}
		${p.info ? `<p style="text-align: center;">${p.info}</p>` : ``}
		<br>
        <div class="prices">
            <div class="prices-inner"></div>
        </div>
    `;

    const backButton = document.createElement('a');
    backButton.href = `items.html?path=${path}`;
    backButton.textContent = `← Back to ${node.name || 'Category'}`;
    backButton.className = 'back-button';
    detail.appendChild(backButton);

    if (p.price < 952380 && p.price > 0.00) {
        const note = document.createElement('p');
        note.className = 'donation-note';
        note.innerHTML = p.specific_instructions ? p.specific_instructions : `
            <strong>Note:</strong> If you're interested in buying this item, please contact me at <a href="mailto:volcasvoice+shop@gmail.com" class="mail">volcasvoice+shop@gmail.com</a>, including the item's category ("<i>${node.name}</i>") and name ("<em>${p.name.replaceAll("<br>", " ").replaceAll("  ", " ")}</em>"), or 
            its ID (<code><b id="copy-id" style="cursor:pointer;" title="Click to copy">${p.id}</b></code>).
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