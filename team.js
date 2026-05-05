let slideIndex = 0;
const slides = document.getElementsByClassName("team-member");
const dots = document.getElementsByClassName("dot");

// Function to show a slide
function showSlides(n) {
    // Loop back if at the end
    if (n >= slides.length) { slideIndex = 0; }
    if (n < 0) { slideIndex = slides.length - 1; }

    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        if (dots[i]) dots[i].classList.remove("active");
    }

    // Show the selected slide
    slides[slideIndex].style.display = "flex";
    if (dots[slideIndex]) dots[slideIndex].classList.add("active");
}

// Function to change slides with arrows
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

    // Auto-slide every 5 seconds
    setInterval(() => {
        changeSlide(1);
    }, 5000);
});
