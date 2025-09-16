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
    }

    get subtotal() {
        // If shipping is optional, don't include it in subtotal
        return this.price + (this.shipping_optional ? 0 : this.shipping);
    }

    get baseTax() {
        return +(this.subtotal * 0.05).toFixed(2); // 5% Ko-Fi tax
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

    // Load the full tree from root category file
    const treeRes = await fetch(`data/${root}.json`);
    const tree = await treeRes.json();

    // Traverse the tree to reach the target node
    let node = tree;
    for (const seg of segments) {
        node = node[seg] || (node.children && node.children[seg]);
        if (!node) break;
    }

    // Try to find the item in node.items
    const items = Array.isArray(node?.items) ? node.items : [];
    const data = items.find(item => String(item.id) === id);
    if (!data) {
        console.warn(`Item with id=${id} not found in embedded items`);
        return;
    }

    const p = new Product(data);
    const detail = document.getElementById('detail');
    detail.innerHTML = `
  ${p.url 
    ? `<h2 id="myname"><a href="${p.url}" target="_blank">${p.name}</a></h2>` 
    : `<h1 id="myname">${p.name}</h1>`}
  <img src="${p.image}" alt="${p.name} Image">
  <div class="prices">
    <div class="prices-inner">
      <p>Price: ${p.price}€</p>
      <p>
  ${p.shipping_optional && p.shipping > 0.00
    ? `Shipping (optional): ${p.shipping}€` 
    : `Shipping: ${p.shipping}€`}
</p>

      <p>Taxes + rounding: ${p.taxes}€</p>
      <h3>Total: ${p.total}€</h3>
    </div>
	${p.shipping_optional && p.shipping > 0.00 
        ? `<p class="shipping-note">Shipping is <b>optional</b> for this item, and as such is <b>not</b> included in the total.</p>` 
        : ''}
  </div>
  ${
    p.price >= 952380 || p.price <= 0
      ? ''
      : `<a href="https://ko-fi.com/volca/${p.total}" target="_blank">
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

        // Add donation note after back button
        const note = document.createElement('p');
        note.className = 'donation-note';
        note.innerHTML = `
  <strong>Note:</strong> When donating, <b>please</b> include "<em>${p.name}</em>" or 
  <code><b id="copy-id" style="cursor:pointer;" title="Click to copy">ID ${p.id}</b></code> 
  in the message box so I know what it's for!
`;

        detail.appendChild(note);
    }

    document.getElementById('copy-id').addEventListener('click', () => {
        navigator.clipboard.writeText(`ID ${p.id}`).then(() => {
            alert(`Copied: ID ${p.id}`);
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    });


    console.log("Base price: " + p.price);
    console.log("Shipping: " + p.shipping);
    console.log("PayPal Tax:", p.paypalTax);
    console.log("Ko-Fi Tax:", p.baseTax);
    console.log("Total (no rounding):", (p.price + p.shipping + p.baseTax + p.paypalTax).toFixed(2));
    console.log("Total: ", p.total);
}


showProduct();