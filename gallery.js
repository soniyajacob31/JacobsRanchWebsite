(function () {
  "use strict";

  const masonry = document.querySelector(".gallery-masonry");
  const lightbox = document.getElementById("gallery-lightbox");
  if (!masonry || !lightbox) return;

  const backdrop = lightbox.querySelector(".gallery-lightbox-backdrop");
  const closeBtn = lightbox.querySelector(".gallery-lightbox-close");
  const prevBtn = lightbox.querySelector(".gallery-lightbox-prev");
  const nextBtn = lightbox.querySelector(".gallery-lightbox-next");
  const stage = lightbox.querySelector(".gallery-lightbox-stage");
  const imageEl = lightbox.querySelector(".gallery-lightbox-image");
  const counterEl = lightbox.querySelector(".gallery-lightbox-counter");
  const thumbsEl = lightbox.querySelector(".gallery-lightbox-thumbs");

  const items = Array.from(masonry.querySelectorAll(".gallery-item"));
  const photos = items.map((item) => {
    const img = item.querySelector("img");
    return {
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt") || "",
    };
  });

  let currentIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let isDragging = false;

  items.forEach((item, index) => {
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.setAttribute("aria-label", `View photo ${index + 1} of ${photos.length}`);

    item.addEventListener("click", () => openLightbox(index));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  function buildThumbs() {
    thumbsEl.innerHTML = "";
    photos.forEach((photo, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-lightbox-thumb";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", photo.alt || `Photo ${index + 1}`);
      btn.setAttribute("aria-selected", index === currentIndex ? "true" : "false");
      btn.innerHTML = `<img src="${photo.src}" alt="" width="80" height="60" loading="lazy" />`;
      btn.addEventListener("click", () => goTo(index));
      thumbsEl.appendChild(btn);
    });
  }

  function updateThumbs() {
    const thumbButtons = thumbsEl.querySelectorAll(".gallery-lightbox-thumb");
    thumbButtons.forEach((btn, index) => {
      btn.setAttribute("aria-selected", index === currentIndex ? "true" : "false");
      btn.classList.toggle("is-active", index === currentIndex);
      if (index === currentIndex) {
        btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    });
  }

  function goTo(index) {
    currentIndex = (index + photos.length) % photos.length;
    const photo = photos[currentIndex];

    imageEl.src = photo.src;
    imageEl.alt = photo.alt;
    counterEl.textContent = `${currentIndex + 1} / ${photos.length}`;

    stage.classList.remove("is-sliding-left", "is-sliding-right");
    updateThumbs();
  }

  function openLightbox(index) {
    currentIndex = index;
    if (!thumbsEl.children.length) buildThumbs();
    goTo(index);

    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("gallery-lightbox-open");
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gallery-lightbox-open");
    imageEl.removeAttribute("src");
    items[currentIndex]?.focus();
  }

  function step(direction) {
    stage.classList.add(direction > 0 ? "is-sliding-left" : "is-sliding-right");
    window.setTimeout(() => goTo(currentIndex + direction), 120);
  }

  closeBtn.addEventListener("click", closeLightbox);
  backdrop.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  stage.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isDragging = true;
    },
    { passive: true }
  );

  stage.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  stage.addEventListener(
    "touchend",
    (e) => {
      if (!isDragging) return;
      isDragging = false;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const SWIPE_THRESHOLD = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= SWIPE_THRESHOLD) {
        step(deltaX < 0 ? 1 : -1);
      }
    },
    { passive: true }
  );
})();
