/* ============================================
   Scroll-triggered animacijos — elementai švelniai
   atsiranda (fade + slide up) juos pamačius ekrane.
   ============================================ */

(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let observer = null;

  function setup() {
    if (prefersReduced || !('IntersectionObserver' in window)) return null;
    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  }

  window.initReveal = function () {
    const els = document.querySelectorAll('.reveal:not(.in-view)');
    if (!els.length) return;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in-view'));
      return;
    }
    if (!observer) observer = setup();
    els.forEach(el => observer.observe(el));
  };

  document.addEventListener('DOMContentLoaded', window.initReveal);
})();

/* ============================================
   Mobilus meniu (hamburgeris) — automatiškai
   įterpiamas į kiekvieno puslapio antraštę.
   ============================================ */

(function () {
  function initMobileNav(){
    const header = document.querySelector('.site-header');
    if (!header) return;
    const nav = header.querySelector('nav');
    if (!nav) return;
    if (header.querySelector('.mobile-menu-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'mobile-menu-btn';
    btn.setAttribute('aria-label', 'Meniu');
    btn.innerHTML = '<span></span><span></span><span></span>';
    nav.parentNode.insertBefore(btn, nav);

    btn.addEventListener('click', () => {
      header.classList.toggle('nav-open');
    });

    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => header.classList.remove('nav-open'));
    });
  }

  document.addEventListener('DOMContentLoaded', initMobileNav);
})();
