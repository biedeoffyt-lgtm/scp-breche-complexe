/* ============================================
   SCP:BC — Effets Finaux JS
   ============================================ */
'use strict';

// ══ BARRE DE PROGRESSION SCROLL ════════════
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / max * 100) + '%';
  }, { passive: true });
})();

// ══ ANNEAUX SVG STATS ═══════════════════════
(function initRings() {
  const CIRCUMFERENCE = 2 * Math.PI * 35; // r=35

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const ring = entry.target.querySelector('.stat-ring-fill');
      if (!ring) return;
      const pct = parseFloat(ring.dataset.pct) || 0;
      const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
      setTimeout(() => {
        ring.style.strokeDashoffset = offset;
      }, 200);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-item').forEach(el => obs.observe(el));
})();

// ══ ENTRÉE 3D DES FACTION CARDS ══════════════
(function initFactionEntrance() {
  const cards = document.querySelectorAll('.faction-card');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const idx  = [...cards].indexOf(card);
      setTimeout(() => card.classList.add('card-visible'), idx * 100);
      obs.unobserve(card);
    });
  }, { threshold: 0.15 });
  cards.forEach(c => obs.observe(c));
})();

// ══ TYPEWRITER SCP DESC AU HOVER ════════════
(function initSCPTypewriter() {
  document.querySelectorAll('.scp-card').forEach(card => {
    const desc = card.querySelector('.scp-desc');
    if (!desc) return;
    const original = desc.textContent;
    let timeout;

    card.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      desc.innerHTML = '';
      let i = 0;
      function type() {
        if (i < original.length) {
          const span = document.createElement('span');
          span.className = 'typed-char';
          span.style.animationDelay = (i * 12) + 'ms';
          span.textContent = original[i];
          desc.appendChild(span);
          i++;
          timeout = setTimeout(type, 12);
        }
      }
      type();
    });

    card.addEventListener('mouseleave', () => {
      clearTimeout(timeout);
      desc.textContent = original;
    });
  });
})();

// ══ EXPLOSION DONNÉES BOUTONS ════════════════
(function initDataBurst() {
  const fragments = [
    'BREACH','SCP-079','KETER','SITE-19','01001011',
    'AUTH:OK','O5-CMD','MTF','ACCESS','SECURE',
    'CONTAIN','PROTECT','01101100','ALPHA-1','NU-7'
  ];

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;

      for (let i = 0; i < 8; i++) {
        const el = document.createElement('div');
        el.className = 'data-burst';
        const angle = (i / 8) * Math.PI * 2;
        const dist  = 60 + Math.random() * 80;
        const bx = Math.cos(angle) * dist;
        const by = Math.sin(angle) * dist - 40;
        const dur = (0.6 + Math.random() * 0.4) + 's';
        el.style.cssText = `
          left:${cx}px; top:${cy}px;
          --bx:${bx}px; --by:${by}px; --dur:${dur};
          animation-delay:${i * 40}ms;
        `;
        el.textContent = fragments[Math.floor(Math.random() * fragments.length)];
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
      }
    });
  });
})();

// ══ KONAMI CODE ═════════════════════════════
(function initKonami() {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key === code[idx]) {
      idx++;
      if (idx === code.length) {
        idx = 0;
        const overlay = document.getElementById('konamiOverlay');
        if (overlay) {
          overlay.classList.add('active');
          // Son dramatique
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            [220, 330, 440, 550, 440].forEach((freq, i) => {
              const osc = ctx.createOscillator();
              const g   = ctx.createGain();
              osc.connect(g); g.connect(ctx.destination);
              osc.frequency.value = freq;
              osc.type = 'sine';
              g.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.15);
              g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.2);
              osc.start(ctx.currentTime + i * 0.15);
              osc.stop(ctx.currentTime + i * 0.15 + 0.2);
            });
          } catch(e) {}
        }
      }
    } else { idx = 0; }
  });
})();

// ══ LUMIÈRES AMBIANTES PARALLAXE ════════════
(function initAmbientParallax() {
  const lights = document.querySelectorAll('.ambient-light');
  if (!lights.length) return;
  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    lights.forEach((l, i) => {
      const factor = (i + 1) * 8;
      l.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });
})();

// ══ AMÉLIORATION HERO GRID — ZOOM SCROLL ════
(function initHeroDepth() {
  const layer1 = document.querySelector('.hero-layer-1');
  const layer2 = document.querySelector('.hero-layer-2');
  const grid   = document.querySelector('.hero-grid');
  if (!grid) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (layer1) layer1.style.transform = `translateY(${y * 0.15}px)`;
    if (layer2) layer2.style.transform = `translateY(${y * 0.25}px)`;
    grid.style.transform = `translateY(${y * 0.3}px) scale(${1 + y * 0.0002})`;
  }, { passive: true });
})();

// ══ SECTION AMBIENT LIGHTS ══════════════════
(function addSectionAmbients() {
  const sections = document.querySelectorAll('.section');
  const colors = ['rgba(100,120,160,1)', 'rgba(120,100,160,1)', 'rgba(100,140,120,1)', 'rgba(140,120,100,1)'];
  sections.forEach((sec, i) => {
    if (!window.getComputedStyle(sec).position || window.getComputedStyle(sec).position === 'static') {
      sec.style.position = 'relative';
    }
    const orb = document.createElement('div');
    orb.className = 'section-ambient';
    const c = colors[i % colors.length];
    const size = 400 + Math.random() * 200;
    orb.style.cssText = `
      width:${size}px; height:${size}px;
      background:${c};
      top:50%; left:${20 + Math.random() * 60}%;
      transform:translate(-50%,-50%);
      animation-duration:${18 + i * 4}s;
      animation-delay:${i * 2}s;
    `;
    sec.appendChild(orb);
  });
})();

// ══ SECTION TITLE — DÉCRYPTAGE AMÉLIORÉ ═════
// (override pour inclure les section-title dynamiquement ajoutés)
(function reinitDecrypt() {
  const alreadyDone = new Set();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%';

  function decrypt(el) {
    if (alreadyDone.has(el)) return;
    alreadyDone.add(el);
    const original = el.dataset.original || el.textContent;
    el.dataset.original = original;
    let it = 0;
    const max = original.length * 3;
    const iv = setInterval(() => {
      el.textContent = original.split('').map((ch, i) => {
        if (ch === ' ' || ch === ':') return ch;
        if (i < it / 3) return original[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      it++;
      if (it >= max) { el.textContent = original; clearInterval(iv); }
    }, 28);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { decrypt(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.section-title').forEach(el => obs.observe(el));
})();

// ══ SOUND AMBIENT DISCRET (OPT-IN) ══════════
// Aucun son non sollicité — uniquement sur interaction
document.addEventListener('click', function startAudio() {
  document.removeEventListener('click', startAudio);
  // Micro ambient : très subtil, imperceptible
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Simule un hum de serveur
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.connect(filter); filter.connect(g); g.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.value = 60;
    filter.type = 'lowpass';
    filter.frequency.value = 120;
    g.gain.setValueAtTime(0.003, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.006, ctx.currentTime + 3);
    osc.start();
    // S'éteint au bout de 8s
    g.gain.setValueAtTime(0.006, ctx.currentTime + 6);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 8);
    osc.stop(ctx.currentTime + 8);
  } catch(e) {}
}, { once: true });

// ══ CARROUSEL HERO ══════════════════════════
(function initHeroCarousel() {
  const slides  = document.querySelectorAll('.hero-slide');
  const dots    = document.querySelectorAll('.carousel-dot');
  const counter = document.getElementById('carouselCurrent');
  const label   = document.getElementById('carouselLabel');
  const heroBg  = document.querySelector('.hero-bg');

  if (!slides.length) return;

  const labels = [
    'COULOIR DE CONFINEMENT — SECTEUR 3',
    'ZONE LOGISTIQUE — SITE-19',
    'APERÇU EXCLUSIF — SITE-19',
  ];

  let current   = 0;
  let animating = false;
  let timer     = null;

  function goToSlide(next) {
    if (animating) return;
    next = ((next % slides.length) + slides.length) % slides.length;
    if (next === current) return;
    animating = true;

    const prev     = current;
    current        = next;

    const prevSlide = slides[prev];
    const nextSlide = slides[current];

    // Flash
    if (heroBg) {
      const flash = document.createElement('div');
      flash.className = 'hero-flash';
      heroBg.appendChild(flash);
      setTimeout(() => flash.remove(), 400);
    }

    // Animer
    prevSlide.classList.remove('active');
    prevSlide.classList.add('exit-right');
    nextSlide.style.opacity = '1';
    nextSlide.classList.add('enter-left');

    // Dots
    dots.forEach((d, i) => {
      if (i === current) {
        d.classList.remove('active');
        void d.offsetWidth; // force reflow pour relancer l'animation CSS
        d.classList.add('active');
      } else {
        d.classList.remove('active');
      }
    });

    // Compteur + label
    if (counter) counter.textContent = String(current + 1).padStart(2, '0');
    if (label) {
      label.style.opacity = '0';
      setTimeout(() => {
        label.textContent = labels[current] || '';
        label.style.opacity = '1';
      }, 400);
    }

    // Nettoyage après animation (1s)
    setTimeout(() => {
      prevSlide.classList.remove('exit-right');
      prevSlide.style.opacity = '0';
      nextSlide.classList.remove('enter-left');
      nextSlide.classList.add('active');
      animating = false;
    }, 1050);
  }

  // Exposer pour les onclick des dots
  window.goToSlide = function(n) {
    goToSlide(n);
    restartTimer();
  };

  function restartTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      goToSlide(current + 1);
    }, 5000);
  }

  // Démarrer immédiatement
  restartTimer();

  // Swipe mobile
  let tx = 0;
  document.querySelector('.hero')?.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  document.querySelector('.hero')?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) {
      goToSlide(dx < 0 ? current + 1 : current - 1);
      restartTimer();
    }
  }, { passive: true });
})();
