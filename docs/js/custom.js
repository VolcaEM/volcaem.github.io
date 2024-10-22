const images = document.querySelectorAll('img');
let isZoomed = false;
let currentImage = null;

// Function to check if the device is mobile or tablet
function isMobileOrTablet() {
    return /Mobi|Android|iPad|iPhone/.test(navigator.userAgent);
}

// Only apply zoom functionality if not on mobile or tablet
if (!isMobileOrTablet()) {
    images.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (event) => {
            if (!isZoomed) {
                isZoomed = true;
                currentImage = img;
                img.classList.add('zoomed');
                const rect = img.getBoundingClientRect();
                const offsetX = (event.clientX - rect.left) / rect.width;
                const offsetY = (event.clientY - rect.top) / rect.height;
                img.style.transformOrigin = `${offsetX * 100}% ${offsetY * 100}%`;
                img.style.transition = 'transform 0.25s ease';
                img.style.transform = 'scale(2)';
                img.style.cursor = 'zoom-out';
            } else {
                isZoomed = false;
                currentImage = null;
                img.classList.remove('zoomed');
                img.style.transform = 'scale(1)';
                img.style.cursor = 'zoom-in';
            }
        });

        img.addEventListener('wheel', (event) => {
            if (isZoomed && currentImage === img) {
                event.preventDefault();
                let scale = Number(img.style.transform.replace(/[^0-9.]/g, ''));
                const delta = event.deltaY > 0 ? -0.1 : 0.1;
                scale = Math.min(Math.max(1, scale + delta), 5); // Limita lo zoom tra 1x e 5x
                const rect = img.getBoundingClientRect();
                const offsetX = (event.clientX - rect.left) / rect.width;
                const offsetY = (event.clientY - rect.top) / rect.height;
                img.style.transformOrigin = `${offsetX * 100}% ${offsetY * 100}%`;
                img.style.transform = `scale(${scale})`;
            }
        });

        img.addEventListener('mousemove', (event) => {
            if (isZoomed && currentImage === img) {
                const rect = img.getBoundingClientRect();
                const offsetX = (event.clientX - rect.left) / rect.width;
                const offsetY = (event.clientY - rect.top) / rect.height;
                img.style.transformOrigin = `${offsetX * 100}% ${offsetY * 100}%`;
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (isZoomed && !currentImage.contains(event.target)) {
            isZoomed = false;
            currentImage.classList.remove('zoomed');
            currentImage.style.transform = 'scale(1)';
            currentImage.style.cursor = 'zoom-in';
            currentImage = null;
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (isZoomed && currentImage) {
            const rect = currentImage.getBoundingClientRect();
            const offsetX = (event.clientX - rect.left) / rect.width;
            const offsetY = (event.clientY - rect.top) / rect.height;
            currentImage.style.transformOrigin = `${offsetX * 100}% ${offsetY * 100}%`;
        }
    });
}