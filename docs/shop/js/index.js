async function loadCategories() {
    console.group('loadCategories');

    try {
        const res = await fetch('data/categories.json');
        const categories = await res.json();
        const grid = document.getElementById('categories');

        for (const key in categories) {
            console.group(`Category: ${key}`);

            try {
                const itemsRes = await fetch(`data/${key.replaceAll(" ", "")}.json`);
                const text = await itemsRes.text(); // Read raw text first
                console.log(`Raw JSON for ${key}:`, text.slice(0, 100)); // Preview first 100 chars

                let items;
                try {
                    items = JSON.parse(text);
                } catch (jsonErr) {
                    console.error(`JSON parsing failed for ${key}.`, jsonErr);
                    continue;
                }

                if (!items || items.length === 0) {
                    console.log(`No items found for ${key}. Skipping.`);
                    continue;
                }

                const cat = categories[key];
                const link = cat.url || `items.html?category=${key}`;

                const card = document.createElement('div');
                card.className = 'category-card';
                card.innerHTML = `
      <a href="${link}" class="category-link">
        <img src="${cat.image}" alt="${cat.name}">
        <div class="category-name">${cat.name}</div>
      </a>
    `;

                grid.appendChild(card);
                console.log(`Rendered card for ${key}`);
            } catch (e) {
                console.error(`Failed to load or render category "${key}"`, e);
            }

            console.groupEnd();
        }
    } catch (e) {
        console.error('Failed to load categories.json', e);
    }

    console.groupEnd();
}


loadCategories();