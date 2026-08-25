/**
 * Muqrin for Real Estate Development
 * Core client script: mobile navigation drawer, scroll animations,
 * language switcher (EN / AR), counter animations, and form handlers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ─────────────────────────────────────────────────────────────
  // 1. Mobile Navigation & Glass Drawer Controls
  // ─────────────────────────────────────────────────────────────
  const toggle   = document.querySelector('.nav-toggle');
  const links    = document.querySelector('.nav-links');
  const header   = document.querySelector('.site-header');
  const backdrop = document.getElementById('navBackdrop');

  if (toggle && links) {
    /**
     * Toggles the mobile drawer menu open/closed state.
     * Synchronizes aria attributes, class states, backdrop, and body scroll lock.
     *
     * @param {boolean} [open] - Optional explicit open state.
     */
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !links.classList.contains('open');

      links.classList.toggle('open', isOpen);
      toggle.classList.toggle('open', isOpen);

      if (backdrop) {
        backdrop.classList.toggle('show', isOpen);
      }

      // Lock body scroll when mobile menu is active
      document.body.style.overflow = isOpen ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      // Reset horizontal scroll position on close
      if (!isOpen) {
        window.scrollTo({ left: 0 });
      }
    };

    // Toggle button click handler
    toggle.addEventListener('click', () => toggleMenu());

    // Backdrop click handler to dismiss drawer
    if (backdrop) {
      backdrop.addEventListener('click', () => toggleMenu(false));
    }

    // Auto-close menu when a navigation link is clicked
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close menu on 'Escape' key press for accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        toggleMenu(false);
      }
    });

    // Auto-close menu if viewport is resized beyond mobile breakpoint (860px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && links.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 2. Sticky Header Elevation & Blur on Scroll
  // ─────────────────────────────────────────────────────────────
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ─────────────────────────────────────────────────────────────
  // 3. Scroll Reveal Animations (.reveal and .reveal-group)
  // ─────────────────────────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    document.querySelectorAll('.reveal-group').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal, .reveal-group').forEach(el => el.classList.add('in'));
  }

  // ─────────────────────────────────────────────────────────────
  // 4. Animated Stat Counters
  // ─────────────────────────────────────────────────────────────
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    if (isNaN(target)) return;

    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(eased * target);

      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-target]').forEach(el => statObserver.observe(el));
  } else {
    document.querySelectorAll('[data-target]').forEach(el => animateCounter(el));
  }

  // ─────────────────────────────────────────────────────────────
  // 5. Floating Scroll-to-Top Button
  // ─────────────────────────────────────────────────────────────
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 6. Bilingual Language Switcher (AR / EN)
  // ─────────────────────────────────────────────────────────────
  const langToggle = document.getElementById('langToggle');
  const langEnOpt  = document.getElementById('lang-en-opt');
  const langArOpt  = document.getElementById('lang-ar-opt');

  if (langToggle) {
    // Cache default English text for elements with data-ar attribute
    document.querySelectorAll('[data-ar]').forEach(el => {
      if (!el.dataset.en) {
        el.dataset.en = el.innerHTML.trim();
      }
    });

    let currentLang = localStorage.getItem('muqrin-lang') || 'en';

    /**
     * Applies the selected language across all localized elements.
     * Updates document direction (dir), lang attribute, and switcher styling.
     *
     * @param {string} lang - Language code ('en' or 'ar').
     */
    function applyLang(lang) {
      const isAr = lang === 'ar';

      document.documentElement.lang = lang;
      document.documentElement.dir  = isAr ? 'rtl' : 'ltr';

      document.querySelectorAll('[data-ar]').forEach(el => {
        el.innerHTML = isAr ? el.dataset.ar : el.dataset.en;
      });

      if (langEnOpt && langArOpt) {
        langEnOpt.dataset.active = isAr ? 'false' : 'true';
        langArOpt.dataset.active = isAr ? 'true'  : 'false';
        langEnOpt.style.color    = isAr ? '' : 'var(--copper)';
        langArOpt.style.color    = isAr ? 'var(--copper)' : '';
        langEnOpt.style.fontWeight = isAr ? '500' : '700';
        langArOpt.style.fontWeight = isAr ? '700' : '500';
      }

      currentLang = lang;
      localStorage.setItem('muqrin-lang', lang);
    }

    // Initialize with stored language if Arabic
    if (currentLang === 'ar') {
      applyLang('ar');
    }

    // Language toggle click listener
    langToggle.addEventListener('click', () => {
      applyLang(currentLang === 'en' ? 'ar' : 'en');
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 7. Generic Form Handler → Web3Forms with Shimmer State
  // ─────────────────────────────────────────────────────────────
  document.querySelectorAll('form[data-web3forms]').forEach(form => {
    const submitBtn = form.querySelector('button[type="submit"]');
    const errorEl   = form.parentElement.querySelector('.form-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData     = new FormData(form);
      const originalText = submitBtn.textContent;

      submitBtn.classList.add('loading');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled    = true;
      if (errorEl) errorEl.classList.remove('show');

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData
        });
        const data = await response.json();

        if (response.ok && data.success) {
          form.reset();
          form.style.display = 'none';
          const success = form.parentElement.querySelector('.form-success');
          if (success) {
            success.classList.add('show');
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = 'Something went wrong. Please try again, or reach us directly by phone or email.';
          errorEl.classList.add('show');
        }
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalText;
        submitBtn.disabled    = false;
      }
    });
  });
});
