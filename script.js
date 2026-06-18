const initCodeVerse = () => {
  // --- LIGHT / DARK MODE CONTROLLER ---
  const savedMode = localStorage.getItem("codeverse-mode") || "dark";
  applyMode(savedMode);

  const modeBtn = document.getElementById("mode-btn");
  const mobileModeBtn = document.getElementById("mobile-mode-btn");

  function applyMode(mode) {
    const moons = document.querySelectorAll("#mode-moon");
    const suns = document.querySelectorAll("#mode-sun");
    const mobileModeText = document.getElementById("mobile-mode-text");

    if (mode === "dark") {
      document.documentElement.classList.add("dark");
      moons.forEach((m) => {
        m.classList.remove("hidden");
        m.classList.add("block");
      });
      suns.forEach((s) => {
        s.classList.remove("block");
        s.classList.add("hidden");
      });
      if (mobileModeText) {
        mobileModeText.innerText = "Dark Mode";
      }
    } else {
      document.documentElement.classList.remove("dark");
      moons.forEach((m) => {
        m.classList.remove("block");
        m.classList.add("hidden");
      });
      suns.forEach((s) => {
        s.classList.remove("hidden");
        s.classList.add("block");
      });
      if (mobileModeText) {
        mobileModeText.innerText = "Light Mode";
      }
    }
  }

  function toggleMode() {
    const currentMode = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    const newMode = currentMode === "dark" ? "light" : "dark";
    applyMode(newMode);
    localStorage.setItem("codeverse-mode", newMode);
  }

  if (modeBtn) {
    modeBtn.addEventListener("click", toggleMode);
  }
  if (mobileModeBtn) {
    mobileModeBtn.addEventListener("click", toggleMode);
  }

  // --- DYNAMIC ACCENT THEME SWITCHING ---
  const savedTheme = localStorage.getItem("codeverse-theme") || "lime";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const themeBtn = document.getElementById("theme-btn");
  const themeDropdown = document.getElementById("theme-dropdown");
  const themeSelectors = document.querySelectorAll("[data-set-theme]");

  // Toggle desktop theme picker dropdown
  if (themeBtn && themeDropdown) {
    themeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", () => {
      themeDropdown.classList.add("hidden");
    });

    themeDropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // Bind accent theme select event
  themeSelectors.forEach((selector) => {
    selector.addEventListener("click", () => {
      const themeVal = selector.getAttribute("data-set-theme");
      document.documentElement.setAttribute("data-theme", themeVal);
      localStorage.setItem("codeverse-theme", themeVal);
      if (themeDropdown) {
        themeDropdown.classList.add("hidden");
      }
    });
  });

  // --- MOBILE SIDEBAR DRAWER MENU ---
  const menuBtn = document.getElementById("menu-btn");
  const closeBtn = document.getElementById("close-btn");
  const mobileSidebar = document.getElementById("mobile-sidebar");
  const mobileBackdrop = document.getElementById("mobile-backdrop");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  function openMobileMenu() {
    if (!mobileSidebar || !mobileBackdrop) return;

    // Show backdrop container
    mobileBackdrop.classList.remove("hidden");
    // Force reflow
    void mobileBackdrop.offsetWidth;
    // Animate opacity in
    mobileBackdrop.classList.remove("opacity-0");
    mobileBackdrop.classList.add("opacity-100");

    // Slide sidebar drawer in
    mobileSidebar.classList.remove("-translate-x-full");
    mobileSidebar.classList.add("translate-x-0");
  }

  function closeMobileMenu() {
    if (!mobileSidebar || !mobileBackdrop) return;

    // Slide sidebar drawer out
    mobileSidebar.classList.remove("translate-x-0");
    mobileSidebar.classList.add("-translate-x-full");

    // Fade backdrop out
    mobileBackdrop.classList.remove("opacity-100");
    mobileBackdrop.classList.add("opacity-0");

    // Wait for transition duration (300ms) to hide backdrop element
    setTimeout(() => {
      if (mobileBackdrop.classList.contains("opacity-0")) {
        mobileBackdrop.classList.add("hidden");
      }
    }, 300);
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", openMobileMenu);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeMobileMenu);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener("click", closeMobileMenu);
  }

  // Close mobile sidebar when clicking on any navigation anchors
  mobileLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Don't close if it is the theme switcher trigger
      if (
        link.getAttribute("href") &&
        link.getAttribute("href").startsWith("#")
      ) {
        closeMobileMenu();
      }
    });
  });

  // --- DYNAMIC HEADER SCROLL EFFECT ---
  const headerNav = document.querySelector("header nav");
  if (headerNav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        headerNav.classList.remove("py-3", "sm:py-4");
        headerNav.classList.add("py-2", "scrolled");
      } else {
        headerNav.classList.remove("py-2", "scrolled");
        headerNav.classList.add("py-3", "sm:py-4");
      }
    });
  }

  // --- SCROLL REVEAL ANIMATION INJECTION ---
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // --- ACTIVE SECTION TRACKER FOR NAV LINK MARKER ---
  const sections = document.querySelectorAll("section[id], header");
  const desktopLinks = document.querySelectorAll("header nav .nav-link");

  function updateActiveLinks() {
    let currentId = "";
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute("id") || "";
      }
    });

    desktopLinks.forEach((link) => {
      link.classList.remove("nav-link-active");
      link.classList.add("text-textMuted");

      const href = link.getAttribute("href");
      if (href === "#" && currentId === "") {
        link.classList.add("nav-link-active");
        link.classList.remove("text-textMuted");
      } else if (
        currentId !== "" &&
        (href === `#${currentId}` || href.endsWith(`#${currentId}`))
      ) {
        link.classList.add("nav-link-active");
        link.classList.remove("text-textMuted");
      }
    });

    mobileLinks.forEach((link) => {
      link.classList.remove("text-neonLime", "font-semibold");
      link.classList.add("text-textMuted");

      const href = link.getAttribute("href");
      if (href === "#" && currentId === "") {
        link.classList.add("text-neonLime", "font-semibold");
        link.classList.remove("text-textMuted");
      } else if (
        currentId !== "" &&
        (href === `#${currentId}` || href.endsWith(`#${currentId}`))
      ) {
        link.classList.add("text-neonLime", "font-semibold");
        link.classList.remove("text-textMuted");
      }
    });
  }

  if (desktopLinks.length > 0 || mobileLinks.length > 0) {
    window.addEventListener("scroll", updateActiveLinks);
    updateActiveLinks(); // run once on load
  }

  // --- MOCK CONTACT FORM SUBMISSION ---
  const contactForm = document.getElementById("contact-form");
  const formSuccess = document.getElementById("form-success");
  const resetFormBtn = document.getElementById("reset-form-btn");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending Specification...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        formSuccess.classList.remove("hidden");
        contactForm.reset();
      }, 1200);
    });
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener("click", () => {
      formSuccess.classList.add("hidden");
    });
  }

  // --- MOCK NEWSLETTER SUBMISSION ---
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;

      submitBtn.disabled = true;
      submitBtn.innerText = "Syncing...";

      setTimeout(() => {
        submitBtn.innerText = "Subscribed ✓";
        submitBtn.classList.remove("bg-neonLime");
        submitBtn.classList.add("bg-emerald-600", "text-white");
        emailInput.value = "";
        emailInput.disabled = true;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
          submitBtn.classList.remove("bg-emerald-600", "text-white");
          submitBtn.classList.add("bg-neonLime");
          emailInput.disabled = false;
        }, 3000);
      }, 1000);
    });
  }

  // --- BLOG FILTER AND SEARCH LOGIC ---
  const searchInput = document.getElementById("search-input");
  const blogCards = document.querySelectorAll(".blog-card");
  const tabButtons = document.querySelectorAll("#category-tabs button");
  const noResults = document.getElementById("no-results");

  let activeCategory = "all";
  let searchQuery = "";

  function filterPosts() {
    let visibleCount = 0;

    blogCards.forEach((card) => {
      const category = card.getAttribute("data-post-category") || "";
      const title = card.querySelector("h3").innerText.toLowerCase();
      const desc = card.querySelector("p").innerText.toLowerCase();

      const matchesCategory =
        activeCategory === "all" || category === activeCategory;
      const matchesSearch =
        title.includes(searchQuery) || desc.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.classList.remove("hidden");
        visibleCount++;
      } else {
        card.classList.add("hidden");
      }
    });

    if (noResults) {
      if (visibleCount === 0) {
        noResults.classList.remove("hidden");
      } else {
        noResults.classList.add("hidden");
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterPosts();
    });
  }

  if (tabButtons.length > 0) {
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabButtons.forEach((b) => {
          b.classList.remove(
            "bg-neonLime",
            "text-black",
            "font-bold",
            "shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.2)]",
          );
          b.classList.add(
            "bg-slate-100",
            "dark:bg-slate-900",
            "text-slate-700",
            "dark:text-slate-300",
            "hover:bg-slate-200",
            "dark:hover:bg-slate-800",
            "hover:text-neonLime",
            "dark:hover:text-neonLime",
          );
        });

        btn.classList.add(
          "bg-neonLime",
          "text-black",
          "font-bold",
          "shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.2)]",
        );
        btn.classList.remove(
          "bg-slate-100",
          "dark:bg-slate-900",
          "text-slate-700",
          "dark:text-slate-300",
          "hover:bg-slate-200",
          "dark:hover:bg-slate-800",
          "hover:text-neonLime",
          "dark:hover:text-neonLime",
        );

        activeCategory = btn.getAttribute("data-category") || "all";
        filterPosts();
      });
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCodeVerse);
} else {
  initCodeVerse();
}

$(document).ready(function () {
  $(".testimonial").slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });
});
