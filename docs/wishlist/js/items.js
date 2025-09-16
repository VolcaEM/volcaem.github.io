// =======================
// items.js (verbose debug)
// =======================

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

function toTitleCase(str) {
    return str.replace(/\w\S*/g, word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
}

/**
 * Resolve a node in a nested category tree based on segments.
 * Returns { node, names, pathWalk }
 */
function resolveNode(tree, segments) {
    console.group('resolveNode');
    console.log('Segments:', segments);

    let cursor = tree;
    const names = [];
    const pathWalk = [];

    for (const seg of segments) {
        console.group(`Step: ${seg}`);
        console.log('Current cursor keys:', Object.keys(cursor));

        // If cursor has a direct match, use it
        if (cursor[seg]) {
            cursor = cursor[seg];
        }
        // Otherwise, check inside .children
        else if (cursor.children && cursor.children[seg]) {
            cursor = cursor.children[seg];
        } else {
            console.warn(`Segment "${seg}" not found. Breaking.`);
            console.groupEnd();
            break;
        }

        names.push(cursor.name || toTitleCase(seg));
        pathWalk.push(seg);
        console.log('Resolved to:', cursor.name);
        console.groupEnd();
    }

    console.log('Final node:', cursor);
    console.log('Breadcrumb:', names.join(' / '));
    console.groupEnd();

    return { node: cursor, names, pathWalk };
}


/**
 * Render a subcategory card
 */
function renderSubcategoryCard(grid, currentPath, key, sub) {
    const nextPath = `${currentPath}/${key}`;
    const name = sub?.name || toTitleCase(key);
    const img = sub?.image || '/images/default.png';
    const hasCustomURL = sub.force_external === true;
    const link = hasCustomURL ?
        sub.url :
        `items.html?path=${encodeURIComponent(nextPath)}`;

    const card = document.createElement('div');
    card.className = 'item-card subcategory-card' + (hasCustomURL ? ' has-custom-url' : '');
    card.innerHTML = `
    <a href="${link}" ${hasCustomURL ? 'target="_blank"' : ''}>
      <img src="${img}" alt="${name}">
      <div class="item-name" title="${name}">${name}</div>
    </a>
  `;
    grid.appendChild(card);
}


/**
 * Render a product card
 */
function renderProductCard(grid, path, prodData) {
    const p = new Product(prodData);
    const hasCustomURL = prodData.force_external === true;
    const link = hasCustomURL ?
        prodData.url :
        `product.html?path=${encodeURIComponent(path)}&id=${p.id}`;


    const card = document.createElement('div');
    card.className = 'item-card' + (hasCustomURL ? ' has-custom-url' : '');
    card.innerHTML = `
    <a href="${link}" ${hasCustomURL ? 'target="_blank"' : ''}>
      <img src="${p.image}" alt="${p.name}">
      <div class="item-name" title="${p.name}">${p.name}</div>
      <div class="item-price">${p.total}€+</div>
    </a>
  `;
    grid.appendChild(card);
}


/**
 * Attempt to fetch JSON, log verbosely, return undefined on failure
 */
async function tryFetchJSON(url, label = 'fetch') {
    console.group(`tryFetchJSON: ${label}`);
    console.log('URL:', url);
    try {
        const res = await fetch(url, { cache: 'no-store' });
        console.log('Response.ok:', res.ok, 'status:', res.status);
        if (!res.ok) {
            console.warn('Non-OK response');
            console.groupEnd();
            return undefined;
        }
        const data = await res.json();
        console.log('Parsed JSON keys:', typeof data === 'object' ? Object.keys(data) : data);
        console.groupEnd();
        return data;
    } catch (e) {
        console.error('Fetch failed:', e);
        console.groupEnd();
        return undefined;
    }
}

async function showItems() {
    console.group('showItems');

    const params = new URLSearchParams(window.location.search);
    const pathParam = params.get('path');
    const legacyCategory = params.get('category'); // legacy support
    const legacySubcategory = params.get('subcategory'); // legacy optional

    console.log('URL params:', Object.fromEntries(params.entries()));
    let path = pathParam;

    // Backward compatibility: allow category[/subcategory] to form a path
    if (!path && legacyCategory) {
        path = legacySubcategory ? `${legacyCategory}/${legacySubcategory}` : legacyCategory;
        console.log('Using legacy params to build path:', path);
    }

    if (!path) {
        console.warn('No "path" (or legacy category) provided. Aborting render.');
        console.groupEnd();
        return;
    }

    // Basic DOM refs
    const titleEl = document.getElementById('category-name');
    const headingEl = document.getElementById('item-category-name');
    const grid = document.getElementById('items');

    if (!grid) {
        console.error('#items grid not found in DOM.');
        console.groupEnd();
        return;
    }
    grid.innerHTML = '';

    const segments = path.split('/').filter(Boolean);
    console.log('Normalized path:', path, 'Segments:', segments);

    // Load the tree for the root category (first segment)
    const root = segments[0];
    console.log('Root segment:', root);

    if (root === 'supportMeForFree') {
        let desc = document.getElementById("description");
        if (desc) {
            desc.innerHTML = "By doing some of these actions, I may earn a commission, at no extra cost to you. Thanks for your help!";
        }
    }

    // Strategy:
    // - Load the per-root tree at data/<root>.json (your deep tree like food.json)
    // - Fallback to categories.json if needed (not expected to contain deep children)
    let tree = await tryFetchJSON(`data/${root}.json`, `root-tree (${root}.json)`);
    if (!tree) {
        console.warn(`Fallback: loading data/categories.json because data/${root}.json was not found/OK`);
        const cats = await tryFetchJSON('data/categories.json', 'categories.json (fallback)');
        // If only main categories exist, create a minimal pseudo-tree to resolve the first node
        if (cats && cats[root]) {
            tree = {
                [root]: { name: cats[root].name, image: cats[root].image }
            };
        }
    }

    if (!tree) {
        console.error('No tree available. Cannot proceed.');
        console.groupEnd();
        return;
    }

    // Resolve down the segments
    const { node, names, pathWalk } = resolveNode(tree, segments);

    // Build title/breadcrumb text
    const breadcrumb = names.join(' / ') || toTitleCase(segments.join(' / '));
    console.log('Breadcrumb text:', breadcrumb);

    if (titleEl) titleEl.textContent = breadcrumb || 'Category Items';
    if (headingEl) headingEl.textContent = `${breadcrumb || 'Items'}:`;

    // 1) Render subcategories from node.children (if any)
    if (node && node.children && typeof node.children === 'object') {
        console.group('Render subcategories from node.children');
        const childKeys = Object.keys(node.children);
        console.log('Child subcategories:', childKeys);
        childKeys.forEach(key => renderSubcategoryCard(grid, pathWalk.join('/'), key, node.children[key]));
        console.groupEnd();
    } else {
        console.log('No node.children present here.');
    }

    // 2) Render products
    // Two strategies supported:
    //   A. Embedded: node.items is an array of products
    //   B. External file: data/<full-path>.json is an array of products
    let renderedAnyProduct = false;

    // A) Embedded items
    if (node && Array.isArray(node.items)) {
        console.group('Render products from node.items (embedded)');
        console.log('Embedded items count:', node.items.length);
        node.items.forEach(item => {
            renderProductCard(grid, pathWalk.join('/'), item);
            renderedAnyProduct = true;
        });
        console.groupEnd();
    } else {
        console.log('No embedded node.items found.');
    }

    // B) External product list at data/<full-path>.json
    if (!renderedAnyProduct) {
        const externalPath = `data/${segments.join('/')}.json`;
        console.group('Try external product list');
        console.log('External product URL:', externalPath);
        const ext = await tryFetchJSON(externalPath, `external-products (${externalPath})`);
        if (Array.isArray(ext)) {
            console.log('External product array length:', ext.length);
            ext.forEach(item => {
                renderProductCard(grid, segments.join('/'), item);
            });
            renderedAnyProduct = ext.length > 0;
        } else if (ext && Array.isArray(ext.items)) {
            console.log('External file has "items" array length:', ext.items.length);
            ext.items.forEach(item => {
                renderProductCard(grid, segments.join('/'), item);
            });
            renderedAnyProduct = ext.items.length > 0;
        } else {
            console.warn('No external items array found.');
        }
        console.groupEnd();
    }

    if (!renderedAnyProduct && (!node || !node.children)) {
        console.warn('No subcategories and no products found for this path.');
        const empty = document.createElement('div');
        empty.style.width = '100%';
        empty.style.textAlign = 'center';
        empty.style.opacity = '0.7';
        empty.textContent = 'No items here yet.';
        grid.appendChild(empty);
    }

    const footer = document.getElementById('myfooter');
    if (footer) {
        console.log('Injecting back button into #myfooter');

        const segments = path.split('/').filter(Boolean);
        const isTopLevel = segments.length === 1;

        const backBtn = document.createElement('a');
        backBtn.className = 'back-button';

        if (isTopLevel) {
            backBtn.href = '/wishlist/wishlist.html';
            backBtn.textContent = '← Back to Wishlist Home Page';
        } else {
            const parentPath = segments.slice(0, -1).join('/');
            backBtn.href = `items.html?path=${encodeURIComponent(parentPath)}`;
            backBtn.textContent = '← Go Back';
        }

        footer.appendChild(backBtn);
    } else {
        console.warn('#myfooter not found, skipping back button.');
    }


    console.groupEnd();
}

// Kickoff
showItems();