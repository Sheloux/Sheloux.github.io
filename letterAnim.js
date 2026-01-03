// Letter Animation for .animatedTxt
document.addEventListener('DOMContentLoaded', function () {
    const animatedTxt = document.querySelector('.animatedTxt');

    if (!animatedTxt) return;

    // Split text into individual letter spans
    const text = animatedTxt.textContent;
    animatedTxt.innerHTML = text.split('').map((char, index) => {
        if (char === ' ' || char === '\n') {
            return char;
        }
        return `<span class="letter" data-index="${index}">${char}</span>`;
    }).join('');

    const letters = animatedTxt.querySelectorAll('.letter');

    // Function to randomly toggle a letter's case
    function animateRandomLetter() {
        // Pick a random letter
        const randomIndex = Math.floor(Math.random() * letters.length);
        const letter = letters[randomIndex];
        const originalChar = letter.textContent;

        // Toggle between uppercase and lowercase
        if (originalChar === originalChar.toUpperCase()) {
            letter.textContent = originalChar.toLowerCase();
        } else {
            letter.textContent = originalChar.toUpperCase();
        }

        // Reset after a short duration
        setTimeout(() => {
            letter.textContent = originalChar;
        }, 300 + Math.random() * 400);
    }

    // Animate random letters at intervals
    setInterval(() => {
        // Animate 2-4 random letters at once
        const numLetters = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < numLetters; i++) {
            animateRandomLetter();
        }
    }, 800);
});