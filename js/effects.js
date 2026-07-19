/* ============================================
   SCP : BC — Effets visuels avancés
   ============================================ */
'use strict';

// ── PARTICULES ROUGES FLOTTANTES ─────────────
(function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const COUNT = window.innerWidth < 768 ? 25 : 60;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 3 + 1;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 15;
    const xStart = Math.random() * 100;
    const drift = (Math.random() - 0.5) * 200;
    const opacity = Math.random() * 0.6 + 0.2;

    p.style.cssText = `
      left: ${xStart}%;
      width: ${size}px;
      height: ${size}px;
      --drift: ${drift}px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      opacity: ${opacity};
      background: rgba(160,175,200,${0.15 + Math.random() * 0.2});
    `;
    container.appendChild(p);
  }
})();

// ── PARALLAXE HERO ───────────────────────────
(function initParallax() {
  const heroGrid = document.querySelector('.hero-grid');
  const heroBg   = document.querySelector('.hero-bg');
  if (!heroGrid) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.3;
    heroGrid.style.transform = `translateY(${rate}px)`;
    if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.15}px)`;
  }, { passive: true });
})();

// ── PARALLAXE SECTIONS ───────────────────────
(function initSectionParallax() {
  const parallaxEls = document.querySelectorAll('.stats-bg');
  if (!parallaxEls.length) return;

  window.addEventListener('scroll', () => {
    parallaxEls.forEach(el => {
      const rect = el.parentElement.getBoundingClientRect();
      const offset = rect.top * 0.2;
      el.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });
})();

// ── SON TERMINAL DISCRET ─────────────────────
(function initTerminalSound() {
  let ctx = null;

  function createBeep(freq = 440, duration = 0.05, gain = 0.02) {
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.value = freq;
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(gain, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch(e) { /* silently fail if audio not supported */ }
  }

  // Bip discret sur les boutons principaux
  document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
    btn.addEventListener('click', () => createBeep(880, 0.04, 0.015));
  });

  // Bip très discret sur les liens nav
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('mouseenter', () => createBeep(440, 0.02, 0.008));
  });

  // Son FAQ
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => createBeep(660, 0.05, 0.012));
  });
})();

// ── GLITCH ALÉATOIRE SUR TEXTES HERO ─────────
(function initRandomGlitch() {
  const glitchEls = document.querySelectorAll('.hero-title.glitch-text');

  function triggerRandomGlitch() {
    glitchEls.forEach(el => {
      el.style.animation = 'none';
      void el.offsetHeight; // reflow
      el.style.animation = '';
    });
    const nextDelay = Math.random() * 8000 + 4000;
    setTimeout(triggerRandomGlitch, nextDelay);
  }

  setTimeout(triggerRandomGlitch, 3000);
})();

// ── EFFECT SCAN SUR CARTES SCP ───────────────
(function initScanEffect() {
  document.querySelectorAll('.scp-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const scan = document.createElement('div');
      scan.style.cssText = `
        position:absolute; top:0; left:0; width:100%; height:2px;
        background:linear-gradient(90deg, transparent, rgba(204,0,0,0.8), transparent);
        z-index:20; pointer-events:none;
        animation:scanSweepCard 0.8s ease forwards;
      `;
      // Ajouter l'animation inline
      const style = document.createElement('style');
      style.textContent = `
        @keyframes scanSweepCard {
          0% { top: 0%; opacity:1; }
          100% { top: 100%; opacity:0; }
        }
      `;
      if (!document.getElementById('scanStyle')) {
        style.id = 'scanStyle';
        document.head.appendChild(style);
      }
      card.appendChild(scan);
      setTimeout(() => scan.remove(), 800);
    });
  });
})();

// ── FOND ANIMÉ DYNAMIQUE ─────────────────────
(function initDynamicBackground() {
  let angle = 0;
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;

  function animateBg() {
    angle = (angle + 0.02) % 360;
    const x = 50 + Math.sin(angle * Math.PI / 180) * 10;
    const y = 50 + Math.cos(angle * Math.PI / 180) * 8;
    bg.style.background = `radial-gradient(ellipse at ${x}% ${y}%, #232830 0%, #1c2028 70%)`;
    requestAnimationFrame(animateBg);
  }
  animateBg();
})();

// ── INDICATEUR DE LOADING PAGE ───────────────
(function initLoadingBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed; top:0; left:0; height:2px; width:0%;
    background:linear-gradient(90deg, #cc0000, #ff1a1a);
    z-index:99999; transition:width 0.2s ease;
    box-shadow: 0 0 10px rgba(204,0,0,0.8);
  `;
  document.body.prepend(bar);

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 90) { clearInterval(interval); }
    bar.style.width = Math.min(progress, 90) + '%';
  }, 100);

  window.addEventListener('load', () => {
    clearInterval(interval);
    bar.style.width = '100%';
    setTimeout(() => {
      bar.style.opacity = '0';
      setTimeout(() => bar.remove(), 300);
    }, 400);
  });
})();

// ── EFFET ALERTE FLASH ───────────────────────
(function initAlertPulse() {
  const alertBadge = document.querySelector('.hero-badge');
  if (!alertBadge) return;

  let alertActive = false;
  setInterval(() => {
    if (!alertActive) {
      alertActive = true;
      alertBadge.style.boxShadow = '0 0 30px rgba(204,0,0,0.9), 0 0 60px rgba(204,0,0,0.3)';
      alertBadge.style.background = 'rgba(204,0,0,0.25)';
      setTimeout(() => {
        alertBadge.style.boxShadow = '';
        alertBadge.style.background = '';
        alertActive = false;
      }, 200);
    }
  }, 5000);
})();

// ── CONSOLE EASTEREGG ────────────────────────
console.log('%c⚠ SITE-19 // ACCÈS NON AUTORISÉ', 'color:#cc0000; font-size:16px; font-weight:bold; font-family:monospace;');
console.log('%cFONDATION SCP — DOCUMENT CLASSIFIÉ NIVEAU 5', 'color:#888; font-family:monospace; font-size:11px;');
console.log('%cSi vous lisez ceci, vous avez les habilitations nécessaires.', 'color:#555; font-family:monospace; font-size:10px;');
