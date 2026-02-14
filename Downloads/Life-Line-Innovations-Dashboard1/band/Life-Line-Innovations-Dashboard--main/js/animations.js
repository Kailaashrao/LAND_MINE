/* =============================================
   Life Band – Animations & Lottie Integration
   Lottie players, scroll animations, transitions
   ============================================= */

const Animations = (() => {

  // ---- Lottie Player Integration ----
  function loadLottie(containerId, animationUrl, options = {}) {
    const container = document.getElementById(containerId);
    if (!container || typeof lottie === 'undefined') return null;

    const defaults = {
      container: container,
      renderer: 'svg',
      loop: options.loop !== undefined ? options.loop : true,
      autoplay: options.autoplay !== undefined ? options.autoplay : true,
      path: animationUrl
    };

    return lottie.loadAnimation({ ...defaults, ...options });
  }

  // ---- Intersection Observer for scroll-triggered animations ----
  function observeAnimations(selector = '.animate-on-scroll') {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  // ---- Staggered entrance for card grids ----
  function staggerCards(containerSelector, delay = 80) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const cards = container.children;
    Array.from(cards).forEach((card, idx) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      card.style.transition = `opacity 0.4s ease ${idx * delay}ms, transform 0.4s ease ${idx * delay}ms`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      });
    });
  }

  // ---- Counter animation for metric numbers ----
  function animateCounter(element, target, duration = 1200, prefix = '', suffix = '') {
    if (!element) return;
    const start = 0;
    const startTime = performance.now();
    const isFloat = String(target).includes('.');

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;
      element.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---- Pulse effect on element ----
  function pulseElement(element, color = 'rgba(37,99,235,0.3)') {
    if (!element) return;
    element.style.boxShadow = `0 0 0 0 ${color}`;
    element.style.transition = 'box-shadow 0.6s ease';
    requestAnimationFrame(() => {
      element.style.boxShadow = `0 0 0 12px transparent`;
      setTimeout(() => { element.style.boxShadow = 'none'; }, 600);
    });
  }

  // ---- Page transition (fade in body) ----
  function pageTransition() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  }

  // ---- Splash screen handler ----
  function handleSplash(splashId = 'splash', delay = 2200) {
    const splash = document.getElementById(splashId);
    if (!splash) return;
    setTimeout(() => {
      splash.classList.add('hidden');
      setTimeout(() => splash.remove(), 600);
    }, delay);
  }

  // ---- Init: auto-run on DOMContentLoaded ----
  function init() {
    observeAnimations();
    pageTransition();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ---- Public API ----
  return {
    loadLottie,
    observeAnimations,
    staggerCards,
    animateCounter,
    pulseElement,
    pageTransition,
    handleSplash
  };

})();
