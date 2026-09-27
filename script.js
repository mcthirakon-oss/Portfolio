// Typing animation effect for Thai role titles
const typingWords = [
  "ผู้พัฒนาเว็บไซต์ (Web Developer)",
  "ผู้สร้างสรรค์ผลงาน (Creative Creator)",
  "ผู้หลงใหลในเทคโนโลยี (Tech Enthusiast)",
  "พร้อมเรียนรู้สิ่งใหม่ๆ (Lifelong Learner)"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById("typing-text");

function typeEffect() {
  const currentWord = typingWords[wordIndex];
  
  if (isDeleting) {
    typingElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let typingSpeed = isDeleting ? 45 : 90;

  if (!isDeleting && charIndex === currentWord.length) {
    typingSpeed = 1800; // Pause at end of word
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % typingWords.length;
    typingSpeed = 400; // Pause before new word
  }

  setTimeout(typeEffect, typingSpeed);
}

// Start typing animation once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  if (typingElement) {
    setTimeout(typeEffect, 600);
  }

  // Navbar scroll background change
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    updateActiveNavLink();
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const icon = mobileToggle.querySelector("i");
      if (navMenu.classList.contains("open")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
      } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        const icon = mobileToggle.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-xmark");
          icon.classList.add("fa-bars");
        }
      });
    });
  }

  // 3D Card tilt effect on hero photo
  const photoFrame = document.querySelector(".photo-frame");
  if (photoFrame && window.innerWidth > 768) {
    photoFrame.addEventListener("mousemove", (e) => {
      const rect = photoFrame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      photoFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });

    photoFrame.addEventListener("mouseleave", () => {
      photoFrame.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
    });
  }
});

// Highlight active navigation link on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const scrollPos = window.scrollY + 150;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-link[href="#${id}"]`);

    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    }
  });
}

// Contact form submission feedback simulation
function showContactNotification() {
  const form = document.getElementById("contact-form");
  const alertBox = document.getElementById("form-message");
  
  if (alertBox) {
    alertBox.textContent = "ขอบคุณสำหรับข้อความ! ได้รับข้อมูลเรียบร้อยแล้ว";
    alertBox.style.display = "block";
    form.reset();

    setTimeout(() => {
      alertBox.style.display = "none";
    }, 4500);
  }
}

// ============================================================
// Portfolio Presentation Slider Controller
// ============================================================
let currentSlideIndex = 0;
let slideItems = [];
let totalSlides = 0;
let sliderModal, slidesTrack, sliderDotsContainer, slideStepIndicator, sliderProgressBar, sliderBackdrop, sliderCloseBtn;

function initSliderElements() {
  slideItems = document.querySelectorAll(".slide-item");
  totalSlides = slideItems.length;
  sliderModal = document.getElementById("slider-modal");
  slidesTrack = document.getElementById("slides-track");
  sliderDotsContainer = document.getElementById("slider-dots");
  slideStepIndicator = document.getElementById("slide-step-indicator");
  sliderProgressBar = document.getElementById("slider-progress-bar");
  sliderBackdrop = document.getElementById("slider-backdrop");
  sliderCloseBtn = document.getElementById("slider-close-btn");
}

// Generate slide indicator dots (for content slides 1 to N)
function initSliderDots() {
  if (!sliderDotsContainer) return;
  sliderDotsContainer.innerHTML = "";
  // Dots correspond to content slides (slide index 1 to totalSlides - 1)
  for (let i = 1; i < totalSlides; i++) {
    const dot = document.createElement("button");
    dot.className = `slider-dot ${i === 1 ? "active" : ""}`;
    dot.setAttribute("aria-label", `ไปยังสไลด์ที่ ${i}`);
    dot.addEventListener("click", () => goToSlide(i));
    sliderDotsContainer.appendChild(dot);
  }
}

// Open Slider Modal (Defaults to Slide 0: Blank Screen)
function openPortfolioSlider(index = 0) {
  if (!sliderModal) initSliderElements();
  if (!sliderModal) return;
  sliderModal.classList.add("active");
  sliderModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // Prevent background scroll
  goToSlide(index);
}

// Close Slider Modal
function closePortfolioSlider() {
  if (!sliderModal) return;
  sliderModal.classList.remove("active");
  sliderModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = ""; // Restore background scroll
}

// Navigate to a specific slide
function goToSlide(index) {
  if (!slideItems.length) initSliderElements();
  if (index < 0) index = 0;
  if (index >= totalSlides) index = totalSlides - 1;

  currentSlideIndex = index;

  // Track active slide on modal for CSS visibility controls
  if (sliderModal) {
    sliderModal.dataset.activeSlide = currentSlideIndex;
  }

  // Move the slides track horizontally
  if (slidesTrack) {
    slidesTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
  }

  // Update slide active state
  slideItems.forEach((item, idx) => {
    if (idx === currentSlideIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Update dots (dot 0 corresponds to slide index 1)
  const dots = document.querySelectorAll(".slider-dot");
  dots.forEach((dot, dotIdx) => {
    if (dotIdx === currentSlideIndex - 1) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });

  // Update progress bar & counter
  const contentSlidesCount = Math.max(1, totalSlides - 1);
  if (slideStepIndicator) {
    if (currentSlideIndex === 0) {
      slideStepIndicator.textContent = "";
    } else {
      slideStepIndicator.textContent = `สไลด์ ${currentSlideIndex} / ${contentSlidesCount}`;
    }
  }
  if (sliderProgressBar) {
    if (currentSlideIndex === 0) {
      sliderProgressBar.style.width = "0%";
    } else {
      const progressPercent = (currentSlideIndex / contentSlidesCount) * 100;
      sliderProgressBar.style.width = `${progressPercent}%`;
    }
  }
}

// Next slide
function nextSlide() {
  if (currentSlideIndex < totalSlides - 1) {
    goToSlide(currentSlideIndex + 1);
  } else {
    goToSlide(1); // Loop back to Slide 1
  }
}

// Previous slide
function prevSlide() {
  if (currentSlideIndex > 0) {
    goToSlide(currentSlideIndex - 1);
  } else {
    goToSlide(totalSlides - 1); // Loop to end
  }
}

// Event Listeners for Slider & Poster Parallax Effect
document.addEventListener("DOMContentLoaded", () => {
  initSliderElements();
  initSliderDots();

  // Close button & backdrop click
  if (sliderCloseBtn) {
    sliderCloseBtn.addEventListener("click", closePortfolioSlider);
  }
  if (sliderBackdrop) {
    sliderBackdrop.addEventListener("click", closePortfolioSlider);
  }

  // Keyboard controls: Escape to close, Left/Right/Up/Down arrows to navigate
  window.addEventListener("keydown", (e) => {
    if (sliderModal && sliderModal.classList.contains("active")) {
      if (e.key === "Escape") {
        closePortfolioSlider();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        prevSlide();
      }
    }
  });

  // Mouse Wheel Scroll Navigation (หมุนสกอร์เมาส์เพื่อค่อยๆ เลื่อนสไลด์)
  let isSlideWheelLocked = false;
  let wheelAccumulator = 0;
  let wheelResetTimeout = null;

  function handleSliderWheel(e) {
    if (!sliderModal || !sliderModal.classList.contains("active")) return;
    
    // Always prevent page behind modal from scrolling
    e.preventDefault();

    if (isSlideWheelLocked) return;

    wheelAccumulator += e.deltaY;
    clearTimeout(wheelResetTimeout);
    wheelResetTimeout = setTimeout(() => {
      wheelAccumulator = 0;
    }, 180);

    const SCROLL_THRESHOLD = 30; // Responsive yet prevents accidental triggers
    if (Math.abs(wheelAccumulator) >= SCROLL_THRESHOLD) {
      if (wheelAccumulator > 0) {
        // Wheel rolled down -> Next slide
        if (currentSlideIndex < totalSlides - 1) {
          goToSlide(currentSlideIndex + 1);
          triggerWheelLock();
        } else {
          // Loop back to start smoothly
          goToSlide(1);
          triggerWheelLock();
        }
      } else {
        // Wheel rolled up -> Previous slide
        if (currentSlideIndex > 0) {
          goToSlide(currentSlideIndex - 1);
          triggerWheelLock();
        } else {
          wheelAccumulator = 0;
        }
      }
    }
  }

  function triggerWheelLock() {
    isSlideWheelLocked = true;
    wheelAccumulator = 0;
    setTimeout(() => {
      isSlideWheelLocked = false;
    }, 900); // Matches smooth gradual transition duration
  }

  window.addEventListener("wheel", handleSliderWheel, { passive: false });

  // Touch Swipe gestures for mobile / touchscreens
  let touchStartX = 0;
  let touchEndX = 0;
  const viewport = document.querySelector(".slides-viewport");

  if (viewport) {
    viewport.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    }, { passive: true });

    function handleGesture() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance < 0) {
          nextSlide(); // Swiped left -> next
        } else {
          prevSlide(); // Swiped right -> prev
        }
      }
    }
  }

  // ============================================================
  // GSAP 3D Mousemove Effects — All Slides
  // ============================================================

  function initSlideGSAPEffects() {
    if (typeof gsap === "undefined" || window.innerWidth <= 768) return;

    // ----- SLIDE 1: Poster — Deep Parallax Layers -----
    const posterContainer = document.querySelector(".poster-container");
    const bgText          = document.querySelector(".poster-bg-text");
    const portraitImg     = document.querySelector(".poster-portrait-img");
    const fgText          = document.querySelector(".poster-fg-text");
    const posterBadge     = document.querySelector(".poster-top-header");

    if (posterContainer) {
      posterContainer.addEventListener("mousemove", (e) => {
        const rect = posterContainer.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 → 0.5
        const ny = (e.clientY - rect.top)  / rect.height - 0.5;

        // Layer 0 — bg badge: barely moves, subtle depth
        if (posterBadge) {
          gsap.to(posterBadge, { x: nx * -8, y: ny * -5, duration: 0.9, ease: "power2.out" });
        }
        // Layer 1 — BG text: slowest, feels furthest away
        if (bgText) {
          gsap.to(bgText, { x: nx * -32, y: ny * -18, duration: 0.8, ease: "power2.out" });
        }
        // Layer 2 — Portrait: mid-speed + subtle tilt
        if (portraitImg) {
          gsap.to(portraitImg, {
            x: nx * 18, y: ny * 10,
            rotateY: nx * 10, rotateX: ny * -6,
            scale: 1.035,
            duration: 0.75, ease: "power2.out",
            transformPerspective: 900
          });
        }
        // Layer 3 — FG text: fastest, feels closest to viewer
        if (fgText) {
          gsap.to(fgText, { x: nx * 38, y: ny * 22, duration: 0.65, ease: "power2.out" });
        }
      });

      posterContainer.addEventListener("mouseleave", () => {
        gsap.to([posterBadge, bgText, portraitImg, fgText], {
          x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1,
          duration: 1.1, ease: "elastic.out(1, 0.55)"
        });
      });
    }

    // ----- SLIDE 2: Quote — Subtle Tilt + Text Shadow Drift -----
    const slide2 = document.querySelector(".slide-quote-1");
    if (slide2) {
      const q2Container = slide2.querySelector(".slide-quote-container");
      const q2Main      = slide2.querySelector(".slide-quote-main");
      const q2Sub       = slide2.querySelector(".slide-quote-sub");

      slide2.addEventListener("mousemove", (e) => {
        const rect = slide2.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top)  / rect.height - 0.5;

        // Gentle 3D tilt on whole container
        if (q2Container) {
          gsap.to(q2Container, {
            rotateX: ny * -4, rotateY: nx * 6,
            duration: 0.9, ease: "power2.out",
            transformPerspective: 1200
          });
        }
        // Main text drifts slightly — creates floating feel
        if (q2Main) {
          gsap.to(q2Main, {
            x: nx * 14, y: ny * 8,
            textShadow: `${nx * -12}px ${ny * -8}px 28px rgba(255,255,255,0.18)`,
            duration: 0.8, ease: "power2.out"
          });
        }
        // Sub text counter-drifts for parallax separation
        if (q2Sub) {
          gsap.to(q2Sub, { x: nx * -8, y: ny * -5, duration: 0.85, ease: "power2.out" });
        }
      });

      slide2.addEventListener("mouseleave", () => {
        gsap.to([q2Container, q2Main, q2Sub], {
          x: 0, y: 0, rotateX: 0, rotateY: 0,
          textShadow: "none",
          duration: 1.2, ease: "elastic.out(1, 0.5)"
        });
      });
    }

    // ----- SLIDE 3: Quote — Stronger Tilt + Magnetic Pull -----
    const slide3 = document.querySelector(".slide-quote-2");
    if (slide3) {
      const q3Container = slide3.querySelector(".slide-quote-container");
      const q3Main      = slide3.querySelector(".slide-quote-main");
      const q3Sub       = slide3.querySelector(".slide-quote-sub");

      slide3.addEventListener("mousemove", (e) => {
        const rect = slide3.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top)  / rect.height - 0.5;

        // Stronger tilt — bolder energy than slide 2
        if (q3Container) {
          gsap.to(q3Container, {
            rotateX: ny * -7, rotateY: nx * 10,
            duration: 0.75, ease: "power3.out",
            transformPerspective: 1000
          });
        }
        // Magnetic pull — text moves toward cursor
        if (q3Main) {
          gsap.to(q3Main, {
            x: nx * 28, y: ny * 16,
            textShadow: `${nx * -18}px ${ny * -12}px 40px rgba(255,255,255,0.22)`,
            duration: 0.7, ease: "power3.out"
          });
        }
        if (q3Sub) {
          gsap.to(q3Sub, {
            x: nx * 16, y: ny * 9,
            opacity: 0.75 + Math.abs(nx) * 0.25,
            duration: 0.8, ease: "power2.out"
          });
        }
      });

      slide3.addEventListener("mouseleave", () => {
        gsap.to([q3Container, q3Main, q3Sub], {
          x: 0, y: 0, rotateX: 0, rotateY: 0,
          textShadow: "none", opacity: 0.88,
          duration: 1.3, ease: "elastic.out(1, 0.45)"
        });
      });
    }

    // ----- SLIDE 4: First Work (TokNaRok) — Game Visual 3D Tilt & Floating Parallax -----
    const slide4 = document.querySelector(".slide-firstwork-item");
    if (slide4) {
      const imgWrapper  = slide4.querySelector(".firstwork-img-wrapper");
      const gameTag     = slide4.querySelector(".firstwork-tag");
      const textCol     = slide4.querySelector(".firstwork-text-col");
      const topTitle    = slide4.querySelector(".firstwork-top-title");
      const bottomQuote = slide4.querySelector(".firstwork-bottom-quote");

      slide4.addEventListener("mousemove", (e) => {
        const rect = slide4.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top)  / rect.height - 0.5;

        // Game cover 3D perspective tilt
        if (imgWrapper) {
          gsap.to(imgWrapper, {
            rotateX: ny * -12, rotateY: nx * 14,
            scale: 1.025,
            boxShadow: `${nx * -20}px ${ny * -15}px 40px rgba(0,0,0,0.9), 0 0 30px rgba(255, 60, 0, 0.25)`,
            duration: 0.65, ease: "power2.out",
            transformPerspective: 900
          });
        }
        // Subtitle tag floats with slight parallax
        if (gameTag) {
          gsap.to(gameTag, {
            x: nx * 16, y: ny * 8,
            duration: 0.7, ease: "power2.out"
          });
        }
        // Story text block drifts gently
        if (textCol) {
          gsap.to(textCol, {
            x: nx * 12, y: ny * 6,
            duration: 0.75, ease: "power2.out"
          });
        }
        // Top and bottom titles subtle floating depth
        if (topTitle) {
          gsap.to(topTitle, { x: nx * -8, y: ny * -4, duration: 0.8, ease: "power2.out" });
        }
        if (bottomQuote) {
          gsap.to(bottomQuote, { x: nx * 10, y: ny * 6, duration: 0.8, ease: "power2.out" });
        }
      });

      slide4.addEventListener("mouseleave", () => {
        gsap.to([imgWrapper, gameTag, textCol, topTitle, bottomQuote], {
          x: 0, y: 0, rotateX: 0, rotateY: 0,
          scale: 1,
          boxShadow: "0 16px 45px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 60, 0, 0.12)",
          duration: 1.1, ease: "elastic.out(1, 0.5)"
        });
      });
    }
  }

  // Init on load; re-init after slider opens so elements exist in DOM
  initSlideGSAPEffects();

  // Also wire into openPortfolioSlider so effects apply when modal opens
  const origOpenSlider = openPortfolioSlider;
  openPortfolioSlider = function(index) {
    origOpenSlider(index);
    setTimeout(initSlideGSAPEffects, 50);
  };

});

