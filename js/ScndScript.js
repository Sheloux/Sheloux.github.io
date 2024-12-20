let audiscd = new Audio("/Assets/Sound_2.mp3");

function playAudioscd() {
    audiscd.play().catch((err) => {
        console.error("Audio playback failed:", err);
    });
}

// Attach to touchstart on the entire document
document.addEventListener('touchstart', function handleTouchStart() {
    playAudioscd();

    // Remove the event listener after the first touch
    document.removeEventListener('touchstart', handleTouchStart);
}, { passive: true });
