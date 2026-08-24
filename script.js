// Mobile nav toggle, scroll animations, language switcher, form handlers & interactive components
document.addEventListener('DOMContentLoaded', () => {
  const toggle   = document.querySelector('.nav-toggle');
  const links    = document.querySelector('.nav-links');
  const header   = document.querySelector('.site-header');
  const backdrop = document.getElementById('navBackdrop');

  // ── Hamburger & Mobile Glass Drawer ─────────────────────
  if (toggle && links) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !links.classList.contains('open');
      links.classList.toggle('open', isOpen);
      if (backdrop) backdrop.classList.toggle('show', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    toggle.addEventListener('click', () => toggleMenu());
    if (backdrop) backdrop.addEventListener('click', () => toggleMenu(false));

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => toggleMenu(false));
    });
  }

  // ── Sticky header shadow & blur on scroll ───────────────
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Scroll reveal (.reveal and .reveal-group) ──────────
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    document.querySelectorAll('.reveal-group').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal, .reveal-group').forEach(el => el.classList.add('in'));
  }

  // ── Animated Stat Counters ──────────────────────────────
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
      if (progress < 1) requestAnimationFrame(step);
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

  // ── Floating Scroll-to-Top Button ───────────────────────
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Language Toggle (AR / EN) ──────────────────────────
  const langToggle = document.getElementById('langToggle');
  const langEnOpt  = document.getElementById('lang-en-opt');
  const langArOpt  = document.getElementById('lang-ar-opt');

  if (langToggle) {
    document.querySelectorAll('[data-ar]').forEach(el => {
      if (!el.dataset.en) {
        el.dataset.en = el.innerHTML.trim();
      }
    });

    let currentLang = localStorage.getItem('muqrin-lang') || 'en';

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

    if (currentLang === 'ar') applyLang('ar');

    langToggle.addEventListener('click', () => {
      applyLang(currentLang === 'en' ? 'ar' : 'en');
    });
  }

  // ── Generic Form Handler → Web3Forms with Shimmer ───────
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
