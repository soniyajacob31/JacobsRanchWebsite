let slideIndex = 0;
let isTransitioning = false;
let autoSlideTimer = null;
const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds
const slides = document.getElementsByClassName("gallery-slide");
const dots = document.getElementsByClassName("dot");

// Start or restart the auto-advance timer
function startAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => {
        changeSlide(1);
    }, AUTO_SLIDE_INTERVAL);
}

// Smooth crossfade
function showSlides(n) {
    if (isTransitioning || !slides.length) return;
    isTransitioning = true;

    // Loop back if at the end
    if (n >= slides.length) { slideIndex = 0; }
    else if (n < 0) { slideIndex = slides.length - 1; }
    else { slideIndex = n; }

    // Fade out current slide
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.opacity = "0";
        slides[i].style.display = "none";
        if (dots[i]) dots[i].classList.remove("active");
    }

    // Show and fade in selected slide
    slides[slideIndex].style.display = "flex";
    slides[slideIndex].style.opacity = "0";
    if (dots[slideIndex]) dots[slideIndex].classList.add("active");

    requestAnimationFrame(() => {
        slides[slideIndex].style.transition = "opacity 0.5s ease-in-out";
        slides[slideIndex].style.opacity = "1";
    });

    setTimeout(() => { isTransitioning = false; }, 500);

    // Reset timer for full 5 seconds after any slide change
    startAutoSlide();
}

// Function to change slides using arrows
function changeSlide(n) {
    slideIndex += n;
    showSlides(slideIndex);
}

// Function to select a slide using dots
function setSlide(n) {
    slideIndex = n;
    showSlides(slideIndex);
}

// Initialize slideshow on page load
document.addEventListener("DOMContentLoaded", function () {
    showSlides(slideIndex);
});
