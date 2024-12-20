const card = document.getElementById('interactiveCard');
let isMouseDown = false;
let audio = new Audio("/Assets/Sound_1.mp3");

// Prevent default touch behaviors
card.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
card.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

// Calculate tilt based on input position
function calculateTilt(clientX, clientY) {
    const cardRect = card.getBoundingClientRect();

    // Calculate center of the card
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;

    // Calculate tilt angles
    const maxTilt = 15; // Maximum tilt angle
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    // Horizontal tilt (X-axis rotation)
    const tiltX = -deltaY / (cardRect.height / 2) * maxTilt;

    // Vertical tilt (Y-axis rotation)
    const tiltY = deltaX / (cardRect.width / 2) * maxTilt;

    return { tiltX, tiltY };
}

// Apply 3D transform
function applyTilt(tiltX, tiltY) {
    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
}

// Reset card position
function resetTilt() {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
}
function playAudio() {
    audio.play();
}

// Mouse events
card.addEventListener('mouseenter', resetTilt);
card.addEventListener('mousemove', (e) => {
    const { tiltX, tiltY } = calculateTilt(e.clientX, e.clientY);
    applyTilt(tiltX, tiltY);
});
card.addEventListener('mouseleave', resetTilt);

// Touch events
card.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const { tiltX, tiltY } = calculateTilt(touch.clientX, touch.clientY);
    applyTilt(tiltX, tiltY);
});
card.addEventListener('touchend', resetTilt);

playAudio();