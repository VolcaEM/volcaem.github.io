document.addEventListener('DOMContentLoaded', () => {
    const tierListContainer = document.getElementById('tier-list-container');
    const imageLoader = document.getElementById('image-loader');
    const imageContainer = document.getElementById('image-container');
    const addTierButton = document.getElementById('add-tier-button');
    const saveButton = document.getElementById('save-button');

    let tierCount = 0;

    // Function to create a new tier
    function createTier(name = `Tier ${tierCount + 1}`) {
        const tier = document.createElement('div');
        tier.classList.add('tier');
        tier.dataset.tier = tierCount;

        const tierName = document.createElement('div');
        tierName.classList.add('tier-name');
        tierName.classList.add('custom-outline');
        tierName.contentEditable = true;
        tierName.textContent = name;
        tierName.style.backgroundColor = getRandomColor();
        tier.appendChild(tierName);

        const tierControls = document.createElement('div');
        tierControls.classList.add('tier-controls');

        const upButton = document.createElement('button');
        upButton.textContent = '↑';
        upButton.addEventListener('click', () => moveTier(tier, -1));
        tierControls.appendChild(upButton);

        const downButton = document.createElement('button');
        downButton.textContent = '↓';
        downButton.addEventListener('click', () => moveTier(tier, 1));
        tierControls.appendChild(downButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', () => deleteTier(tier));
        tierControls.appendChild(deleteButton);

        tierName.appendChild(tierControls); // Append controls to tierName

        const tierImages = document.createElement('div');
        tierImages.classList.add('tier-images');
        tier.appendChild(tierImages);

        tierListContainer.appendChild(tier);

        tier.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        tier.addEventListener('drop', (event) => {
            event.preventDefault();
            const src = event.dataTransfer.getData('text/plain');
            const img = document.querySelector(`img[src="${src}"]`);
            if (img) {
                img.remove();
                const newImg = document.createElement('img');
                newImg.src = src;
                newImg.classList.add('image');
                newImg.draggable = true;
                newImg.addEventListener('dragstart', dragStart);
                tierImages.appendChild(newImg);
            }
        });

        tierCount++;
    }

    // Function to move a tier up or down
    function moveTier(tier, direction) {
        const currentIndex = Array.from(tierListContainer.children).indexOf(tier);
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < tierListContainer.children.length) {
            tierListContainer.insertBefore(tier, tierListContainer.children[newIndex + (direction > 0 ? 1 : 0)]);
        }
    }

    // Function to delete a tier
    function deleteTier(tier) {
        const images = tier.querySelectorAll('.image');
        images.forEach(img => imageContainer.appendChild(img));
        tier.remove();
    }

    // Function to get a random color
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Debounce function to limit the rate of function execution
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Load images with debounce
    imageLoader.addEventListener('change', debounce((event) => {
        const files = event.target.files;
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('image');
                img.draggable = true;
                img.addEventListener('dragstart', dragStart);
                imageContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }, 100));

    // Drag and drop functionality with requestAnimationFrame
    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.src);
    }

    imageContainer.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    imageContainer.addEventListener('drop', (event) => {
        event.preventDefault();
        requestAnimationFrame(() => {
            const src = event.dataTransfer.getData('text/plain');
            const img = document.querySelector(`img[src="${src}"]`);
            if (img) {
                img.remove();
                const newImg = document.createElement('img');
                newImg.src = src;
                newImg.classList.add('image');
                newImg.draggable = true;
                newImg.addEventListener('dragstart', dragStart);
                imageContainer.appendChild(newImg);
            }
        });
    });

    // Save as PNG
    saveButton.addEventListener('click', () => {
        html2canvas(tierListContainer).then(canvas => {
            const link = document.createElement('a');
            link.download = 'tier-list.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });

    // Initial tier creation
    createTier();

    // Add new tier button functionality
    addTierButton.addEventListener('click', () => createTier());
});
