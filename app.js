(function () {
  "use strict";

  // for scoll animations
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -80px 0px", 
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function initScrollAnimations() {
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      const attach = () => {
        if (el.dataset.revealObserving) return;
        el.dataset.revealObserving = "1";
        observer.observe(el);
      };

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const alreadyPeekingWhileAtTop =
        window.scrollY < 2 && rect.top < vh * 0.92 && rect.bottom > 96;

      if (!alreadyPeekingWhileAtTop) {
        attach();
        return;
      }

      let fallbackTimer = null;
      const armFallback = () => {
        fallbackTimer = window.setTimeout(() => {
          cleanup();
          attach();
        }, 2200);
      };
      const cleanup = () => {
        window.removeEventListener("scroll", onScroll);
        if (fallbackTimer !== null) {
          window.clearTimeout(fallbackTimer);
          fallbackTimer = null;
        }
      };
      const onScroll = () => {
        if (window.scrollY > 10) {
          cleanup();
          attach();
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      armFallback();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  function initGlowCards() {
    document.querySelectorAll(".glow-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--glow-x", `${x}px`);
        card.style.setProperty("--glow-y", `${y}px`);
      });
    });
  }

  function initFormAnimations() {
    document.querySelectorAll(".input-box input, .input-box textarea").forEach((input) => {
      input.addEventListener("focus", () => {
        input.parentElement.classList.add("focused");
      });
      input.addEventListener("blur", () => {
        input.parentElement.classList.remove("focused");
      });
    });
  }

  function initNavScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); 
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    initScrollAnimations();
    initGlowCards();
    initFormAnimations();
    initNavScroll();
  }
})();
