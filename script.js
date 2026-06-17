document.addEventListener('DOMContentLoaded', () => {

  // --- DYNAMIC THEME ACCENT SWITCHING ---
  const savedTheme = localStorage.getItem('codeverse-theme') || 'lime';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeBtn = document.getElementById('theme-btn');
  const themeDropdown = document.getElementById('theme-dropdown');
  const themeSelectors = document.querySelectorAll('[data-set-theme]');

  // Toggle desktop theme picker dropdown
  if (themeBtn && themeDropdown) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      themeDropdown.classList.add('hidden');
    });

    themeDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Bind accent theme select event
  themeSelectors.forEach(selector => {
    selector.addEventListener('click', () => {
      const themeVal = selector.getAttribute('data-set-theme');
      document.documentElement.setAttribute('data-theme', themeVal);
      localStorage.setItem('codeverse-theme', themeVal);
      if (themeDropdown) {
        themeDropdown.classList.add('hidden');
      }
    });
  });


  // --- MOBILE DRAWER MENU ---
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMobileMenu() {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true' || false;
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    
    // Toggle layout visibility
    mobileMenu.classList.toggle('hidden');
    
    // Animate scale & opacity
    setTimeout(() => {
      mobileMenu.classList.toggle('scale-95');
      mobileMenu.classList.toggle('scale-100');
      mobileMenu.classList.toggle('opacity-0');
      mobileMenu.classList.toggle('opacity-100');
    }, 10);

    // Animate hamburger lines into 'X'
    const lines = menuBtn.querySelectorAll('span');
    if (lines.length === 3) {
      lines[0].classList.toggle('rotate-45');
      lines[0].classList.toggle('translate-y-1.5');
      lines[1].classList.toggle('opacity-0');
      lines[2].classList.toggle('-rotate-45');
      lines[2].classList.toggle('-translate-y-1.5');
    }
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when a drawer option is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (!mobileMenu.classList.contains('hidden')) {
          toggleMobileMenu();
        }
      });
    });
  }


  // --- DYNAMIC HEADER SCROLL EFFECT ---
  const headerNav = document.querySelector('header nav');
  if (headerNav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        headerNav.classList.remove('py-3', 'sm:py-4');
        headerNav.classList.add('py-2', 'shadow-[0_8px_32px_0_rgba(5,8,17,0.85)]', 'bg-slate-950/80');
      } else {
        headerNav.classList.remove('py-2', 'shadow-[0_8px_32px_0_rgba(5,8,17,0.85)]', 'bg-slate-950/80');
        headerNav.classList.add('py-3');
      }
    });
  }


  // --- SCROLL REVEAL ANIMATION INJECTION ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // --- ACTIVE SECTION TRACKER FOR NAV LINK MARKER ---
  const sections = document.querySelectorAll('section[id], header');
  const desktopLinks = document.querySelectorAll('header nav div a');

  if (desktopLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let currentId = '';
      const scrollPos = window.scrollY + 200;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentId = section.getAttribute('id') || '';
        }
      });

      desktopLinks.forEach(link => {
        link.classList.remove('nav-link-active');
        link.classList.add('text-slate-300');
        
        const href = link.getAttribute('href');
        if (href === '#' && currentId === '') {
          link.classList.add('nav-link-active');
          link.classList.remove('text-slate-300');
        } else if (href === `#${currentId}`) {
          link.classList.add('nav-link-active');
          link.classList.remove('text-slate-300');
        }
      });
    });
  }


  // --- MOCK CONTACT FORM SUBMISSION ---
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const resetFormBtn = document.getElementById('reset-form-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
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
        formSuccess.classList.remove('hidden');
        contactForm.reset();
      }, 1200);
    });
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      formSuccess.classList.add('hidden');
    });
  }


  // --- MOCK NEWSLETTER SUBMISSION ---
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;
      
      submitBtn.disabled = true;
      submitBtn.innerText = 'Syncing...';
      
      setTimeout(() => {
        submitBtn.innerText = 'Subscribed ✓';
        submitBtn.classList.remove('bg-neonLime');
        submitBtn.classList.add('bg-emerald-600', 'text-white');
        emailInput.value = '';
        emailInput.disabled = true;
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
          submitBtn.classList.remove('bg-emerald-600', 'text-white');
          submitBtn.classList.add('bg-neonLime');
          emailInput.disabled = false;
        }, 3000);
      }, 1000);
    });
  }


  // --- BLOG FILTER AND SEARCH LOGIC ---
  const searchInput = document.getElementById('search-input');
  const blogCards = document.querySelectorAll('.blog-card');
  const tabButtons = document.querySelectorAll('#category-tabs button');
  const noResults = document.getElementById('no-results');

  let activeCategory = 'all';
  let searchQuery = '';

  function filterPosts() {
    let visibleCount = 0;
    
    blogCards.forEach(card => {
      const category = card.getAttribute('data-post-category') || '';
      const title = card.querySelector('h3').innerText.toLowerCase();
      const desc = card.querySelector('p').innerText.toLowerCase();

      const matchesCategory = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = (title.includes(searchQuery) || desc.includes(searchQuery));

      if (matchesCategory && matchesSearch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (noResults) {
      if (visibleCount === 0) {
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterPosts();
    });
  }

  if (tabButtons.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle styling on tab buttons
        tabButtons.forEach(b => {
          b.className = "px-5 py-2 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 hover:text-neonLime hover:bg-slate-800 transition-all";
        });
        
        btn.className = "px-5 py-2 rounded-full text-xs font-semibold bg-neonLime text-black font-bold transition-all shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.2)]";

        activeCategory = btn.getAttribute('data-category') || 'all';
        filterPosts();
      });
    });
  }

});
