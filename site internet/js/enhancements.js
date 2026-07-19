/* ============================================
   SCP:BC — Améliorations JS
   ============================================ */
'use strict';

// ── ÉCRAN DE CHARGEMENT ──────────────────────
(function initLoadingScreen() {
  const screen  = document.getElementById('loading-screen');
  const bar     = document.getElementById('loadBar');
  const status  = document.getElementById('loadStatus');
  if (!screen || !bar) return;

  const steps = [
    { pct: 10, msg: 'Connexion au Site-19...' },
    { pct: 25, msg: 'Chargement des dossiers SCP...' },
    { pct: 40, msg: 'Authentification O5 en cours...' },
    { pct: 58, msg: 'Déchiffrement des protocoles...' },
    { pct: 72, msg: 'Accès aux systèmes de confinement...' },
    { pct: 88, msg: 'Préparation de l\'interface...' },
    { pct: 100, msg: 'Accès autorisé.' },
  ];

  let i = 0;
  function nextStep() {
    if (i >= steps.length) {
      setTimeout(() => {
        screen.classList.add('fade-out');
        setTimeout(() => { screen.style.display = 'none'; }, 600);
      }, 300);
      return;
    }
    const step = steps[i++];
    bar.style.width = step.pct + '%';
    if (status) status.textContent = step.msg;
    const delay = step.pct === 100 ? 500 : Math.random() * 300 + 150;
    setTimeout(nextStep, delay);
  }

  setTimeout(nextStep, 400);
})();

// ── BARRE PROGRESSION DEV ────────────────────
(function initDevProgress() {
  const bar     = document.getElementById('devProgressBar');
  const percent = document.getElementById('devPercent');
  if (!bar) return;

  const TARGET = 45; // % d'avancement réel du jeu

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let current = 0;
        const step = TARGET / 60;
        const interval = setInterval(() => {
          current = Math.min(current + step, TARGET);
          bar.style.width = current.toFixed(1) + '%';
          if (percent) percent.textContent = Math.floor(current) + '%';
          if (current >= TARGET) clearInterval(interval);
        }, 20);
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });

  obs.observe(bar.parentElement);
})();

// ── NAVBAR ACTIVE SECTION ───────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id="gallery"]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => obs.observe(s));
})();

// ── PARALLAXE LÉGER SUR LE HERO ──────────────
(function initHeroParallax() {
  const heroGrid = document.querySelector('.hero-grid');
  if (!heroGrid) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.25;
    heroGrid.style.transform = `translateY(${y}px)`;
  }, { passive: true });
})();

// ── EFFET RIPPLE SUR LES BOUTONS ─────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:4px; height:4px;
      background:rgba(180,195,220,0.4);
      left:${e.clientX - rect.left}px;
      top:${e.clientY - rect.top}px;
      transform:scale(0);
      animation:rippleOut 0.5s ease forwards;
      pointer-events:none;
    `;
    if (!document.getElementById('rippleStyle')) {
      const s = document.createElement('style');
      s.id = 'rippleStyle';
      s.textContent = '@keyframes rippleOut{to{transform:scale(40);opacity:0;}}';
      document.head.appendChild(s);
    }
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});
