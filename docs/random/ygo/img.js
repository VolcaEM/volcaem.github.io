// --- UPDATED: Overlay helper functions that position the full image ---
export function showOverlay(e, card, thumbnail) {
    const overlay = document.getElementById('fullImageOverlay');
    const overlayImg = overlay.querySelector('img');
    // Set the full (uncropped) image source
    overlayImg.src = card.getImageUrl();
    overlay.style.display = 'block';

    // When the image loads (or if already cached), update its position.
    overlayImg.onload = function() {
        updateOverlayPosition(e, thumbnail, overlay);
    };
    updateOverlayPosition(e, thumbnail, overlay);
}

export function updateOverlayPosition(e, thumbnail, overlay) {
    // Get the thumbnail's bounding rectangle
    const thumbRect = thumbnail.getBoundingClientRect();

    // Check if the mouse pointer is within the thumbnail's boundaries.
    if (
        e.clientX < thumbRect.left ||
        e.clientX > thumbRect.right ||
        e.clientY < thumbRect.top ||
        e.clientY > thumbRect.bottom
    ) {
        // If not within the boundaries, hide the overlay.
        hideOverlay();
        return;
    }

    // Align the overlay horizontally with the left edge of the thumbnail.
    // overlay.style.left = thumbRect.left + "px";
    overlay.style.left = "0px";

    const overlayImg = overlay.querySelector('img');
    const displayHeight = overlayImg.offsetHeight;

    // Position the overlay so that its vertical center is at the mouse Y coordinate.
    overlay.style.top = (e.clientY - displayHeight / 2) + "px";
}


export function hideOverlay() {
    const overlay = document.getElementById('fullImageOverlay');
    overlay.style.display = 'none';
}