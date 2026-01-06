// Initialize Lenis for smooth scrolling

function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

// Check if device is mobile
const isMobile = window.matchMedia("(max-width: 768px)").matches;

const lenis = new Lenis({
    duration: isMobile ? 1.0 : 1.2,
    easing: easeOutQuart,
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: isMobile,
    touchMultiplier: isMobile ? 1.5 : 2,
    infinite: false,
});

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
gsap.registerPlugin(ScrollTrigger);

// Sync Lenis with ScrollTrigger
lenis.on('scroll', () => {
    ScrollTrigger.update();
});

// Section 2: Scroll-triggered animations for each item
// const sections = document.querySelectorAll('.section-2, .section-4, .section-3, .section-5, .section-6');

// sections.forEach((section, i) => {
//     const container = section.querySelector('.container');

//     if (!container) return;

//     gsap.fromTo(container,
//         {
//             opacity: 0,
//             y: isMobile ? 100 : 200
//         },
//         {
//             opacity: 1,
//             y: 0,
//             ease: "power1.out",
//             scrollTrigger: {
//                 trigger: section,
//                 start: isMobile ? "top-=100 " : "top center+=100",
//                 end: isMobile ? "top 40%" : "center center+=200",
//                 scrub: isMobile ? 0.5 : 1,
//                 markers: false
//             }
//         }
//     );

    // // Fade out as it scrolls past
    // gsap.to(container, {
    //     opacity: 0,
    //     y: -200,
    //     ease: "power2.out",
    //     scrollTrigger: {
    //         trigger: section,
    //         start: "center center",
    //         end: "bottom top",
    //         scrub: 2,
    //         markers: false
    //     }
    // });
// });


// Section 3: Scroll-triggered image animations
const imageCards = document.querySelectorAll('.section-3 .image-card');

imageCards.forEach((card, index) => {
    gsap.fromTo(
        card,
        {
            y: 150,
            scale: 0.5,
            opacity: 0,
        },
        {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 3,
            scrollTrigger: {
                trigger: '.section-3',
                start: `top ${70 - index * 15}%`,
                end: `top ${20 - index * 15}%`,
                scrub: -2,
                markers: false,
            },
        }
    );
});

// Section 4: Text and video animations
gsap.fromTo(
    '.text-content',
    {
        opacity: 0,
        x: -50,
    },
    {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.section-4',
            start: 'top 70%',
            end: 'top 50%',
            scrub: 1,
            markers: false,
        },
    }
);

// Section 3: 3D Click-based Carousel
function setup3DCarousel() {
    const carousel = document.getElementById('carousel');
    let items = document.querySelectorAll('.carousel-item');

    if (!carousel || items.length === 0) {
        console.error('Carousel or items not found');
        return;
    }

    console.log('Carousel initialized with', items.length, 'items');

    let currentIndex = 0;
    const totalItems = items.length;
    const angleIncrement = 360 / totalItems;
    const radius = isMobile ? 450 : 600;

    function updateCarousel(newIndex) {
        // console.log('🔥 Updating carousel FROM index:', currentIndex, 'TO index:', newIndex);
        currentIndex = newIndex;

        items.forEach((item, index) => {
            const offset = index - currentIndex;
            const angle = offset * angleIncrement;
            const distance = Math.abs(offset);

            // Calculate position
            const x = Math.sin(angle * Math.PI / 180) * radius;
            const z = Math.cos(angle * Math.PI / 180) * radius - radius;

            // Scale based on distance from center
            const scale = Math.max(0.5, 1 - distance * 0.15);

            // Opacity based on distance
            const opacity = Math.max(0.3, 1 - distance * 0.2);

            // Z-index based on position
            const zIndex = offset === 0 ? 10 : Math.max(1, 10 - Math.abs(offset));

            item.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${-angle}deg) scale(${scale})`;
            item.style.opacity = opacity;
            item.style.zIndex = zIndex;

            console.log(`Item ${index}: offset=${offset}, angle=${angle}, scale=${scale}`);

            // Add/remove active class
            if (offset === 0) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Add click handlers using event delegation on the carousel container
    carousel.addEventListener('click', (e) => {
        console.log('👆 Click detected, target:', e.target.className);
        const clickedItem = e.target.closest('.carousel-item');
        if (clickedItem) {
            const clickedIndex = parseInt(clickedItem.getAttribute('data-index'));
            // console.log('🎯 CLICK DETECTED on item with data-index:', clickedIndex, 'Current index:', currentIndex);
            if (!isNaN(clickedIndex)) {
                if (clickedIndex === currentIndex) {
                    // If clicking on center image, move to next
                    const newIndex = (currentIndex + 1) % totalItems;
                    // console.log('✨ Center image clicked, moving to next:', newIndex);
                    updateCarousel(newIndex);
                } else {
                    // If clicking on side image, bring it to center
                    updateCarousel(clickedIndex);
                }
            }
        } else {
            // console.log('❌ No carousel-item found');
        }
    });

    // Ensure items have pointer events
    items.forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.style.pointerEvents = 'auto';
        // console.log('Item', index, 'has data-index:', item.getAttribute('data-index'));
    });


    // Initialize carousel
    updateCarousel(0);

    // Auto-rotate on scroll into view
    ScrollTrigger.create({
        trigger: '.section-3',
        start: 'top center',
        onEnter: () => updateCarousel(0),
        markers: false
    });
}

// Wait for DOM to be fully loaded
window.addEventListener('load', () => {
    // setup3DCarousel();
    ScrollTrigger.refresh();
});

// Refresh on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        setup3DCarousel();
        ScrollTrigger.refresh();
    }, 250);
});

// Refresh ScrollTrigger when Lenis updates
lenis.on('scroll', () => {
    ScrollTrigger.update();
});