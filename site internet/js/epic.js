/* ============================================
   SCP:BC — Effets épiques JS
   ============================================ */
'use strict';

// ══ RÉSEAU DE PARTICULES (CANVAS) ═══════════
(function initNetworkCanvas() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initNodes(); });

  function initNodes() {
    const count = Math.floor((W * H) / 28000);
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5
      });
    }
  }
  initNodes();

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Connexions
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(160,175,200,${(1 - dist/130) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    // Points
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(160,175,200,0.25)';
      ctx.fill();
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ══ COUNTDOWN SORTIE ════════════════════════
(function initCountdown() {
  const target = new Date('2027-01-01T00:00:00').getTime();
  const els = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    min:   document.getElementById('cd-min'),
    sec:   document.getElementById('cd-sec'),
  };
  if (!els.sec) return;

  function update() {
    const now  = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      Object.values(els).forEach(e => { if(e) e.textContent = '00'; });
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const pad = n => String(n).padStart(2,'0');

    if (els.days)  els.days.textContent  = pad(d);
    if (els.hours) els.hours.textContent = pad(h);
    if (els.min)   els.min.textContent   = pad(m);
    if (els.sec) {
      els.sec.textContent = pad(s);
      els.sec.classList.add('tick');
      setTimeout(() => els.sec.classList.remove('tick'), 200);
    }
  }
  update();
  setInterval(update, 1000);
})();

// ══ BANDES DE DONNÉES ══════════════════════
(function initDataBands() {
  const chars = '0123456789ABCDEF ';
  const codes = ['SCP-079','SCP-096','SCP-173','SCP-106','BREACH','KETER','EUCLIDE','O5-CMD','MTF-E11','SITE-19','ALPHA-1','NU-7','DELTA-9'];

  function makeData(len) {
    let out = '';
    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.08) {
        out += ' [' + codes[Math.floor(Math.random()*codes.length)] + '] ';
        i += 10;
      } else {
        out += chars[Math.floor(Math.random()*chars.length)];
      }
    }
    return out + ' ' + out; // double pour loop
  }

  ['dataBand','dataBand2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = makeData(300);
  });
})();

// ══ SIGNAL PERDU ALÉATOIRE ═════════════════
(function initSignalLost() {
  const el = document.getElementById('signalLost');
  if (!el) return;

  function trigger() {
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 80 + Math.random() * 120);
    // Parfois double flash
    if (Math.random() < 0.4) {
      setTimeout(() => {
        el.classList.add('active');
        setTimeout(() => el.classList.remove('active'), 60);
      }, 200);
    }
    setTimeout(trigger, Math.random() * 12000 + 6000);
  }
  setTimeout(trigger, 3000);
})();

// ══ GLITCH PAGE ALÉATOIRE ══════════════════
(function initPageGlitch() {
  function trigger() {
    document.body.classList.add('page-glitch');
    setTimeout(() => document.body.classList.remove('page-glitch'), 200);
    setTimeout(trigger, Math.random() * 20000 + 10000);
  }
  setTimeout(trigger, 5000);
})();

// ══ CURSEUR TRAÎNE DE DONNÉES ══════════════
(function initDataTrail() {
  if (window.innerWidth < 768) return;
  const fragments = [
    'AUTH:FAIL','[KETER]','SCP-079','BREACH','NULL','ERR:0xC4',
    'ACCESS','O5-CMD','MTF','SITE-19','LOCK','DATA','SCP-096',
    '01101001','ALPHA','SECURE','CONTAIN','PROTECT'
  ];
  let lastSpawn = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSpawn < 200) return;
    lastSpawn = now;

    if (Math.random() > 0.4) return;

    const el = document.createElement('div');
    el.className = 'cursor-data';
    el.textContent = fragments[Math.floor(Math.random() * fragments.length)];
    el.style.left = (e.clientX + Math.random() * 30 - 15) + 'px';
    el.style.top  = (e.clientY + Math.random() * 20 - 30) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }, { passive: true });
})();

// ══ CARTES SCP — TILT 3D ══════════════════
(function initSCPTilt() {
  function applyTilt(selector, strength) {
    document.querySelectorAll(selector).forEach(card => {
      // Ajouter shine si pas déjà là
      if (!card.querySelector('.tilt-shine')) {
        const shine = document.createElement('div');
        shine.className = 'tilt-shine';
        card.appendChild(shine);
      }
      const shine = card.querySelector('.tilt-shine');

      card.addEventListener('mousemove', (e) => {
        const rect  = card.getBoundingClientRect();
        const cx    = rect.left + rect.width  / 2;
        const cy    = rect.top  + rect.height / 2;
        const dx    = (e.clientX - cx) / (rect.width  / 2);
        const dy    = (e.clientY - cy) / (rect.height / 2);
        const tiltX = dy * -strength;
        const tiltY = dx *  strength;
        card.style.transform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
        card.style.zIndex = '10';
        // Mettre à jour le shine
        const mx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        const my = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        if (shine) shine.style.setProperty('--mx', mx + '%'), shine.style.setProperty('--my', my + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.zIndex = '';
      });
    });
  }

  applyTilt('.scp-card', 8);
  applyTilt('.faction-card', 6);
  applyTilt('.feature-item', 5);
  applyTilt('.staff-card', 10);
})();

// ══ FACTIONS — SÉLECTION MILITAIRE ═════════
(function initFactionSelect() {
  document.querySelectorAll('.faction-card').forEach(card => {
    card.addEventListener('click', () => {
      // Désélectionner les autres
      document.querySelectorAll('.faction-card').forEach(c => {
        c.classList.remove('selected');
        const badge = c.querySelector('.faction-selected-badge');
        if (badge) badge.remove();
      });
      // Sélectionner celui-ci
      card.classList.add('selected', 'select-anim');
      setTimeout(() => card.classList.remove('select-anim'), 400);

      const badge = document.createElement('div');
      badge.className = 'faction-selected-badge';
      badge.textContent = '⬤ SÉLECTIONNÉ';
      card.appendChild(badge);

      // Son de clic terminal
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 660;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(); osc.stop(ctx.currentTime + 0.08);
      } catch(e) {}
    });
  });
})();

// ══ TEXTE DÉCRYPTAGE AU SCROLL ══════════════
(function initDecryptText() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%&';

  function decrypt(el) {
    const original = el.dataset.original || el.textContent;
    el.dataset.original = original;
    el.classList.add('decrypting');
    let iteration = 0;
    const maxIterations = original.length * 3;

    const interval = setInterval(() => {
      el.textContent = original.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < iteration / 3) return original[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      iteration++;
      if (iteration >= maxIterations) {
        el.textContent = original;
        clearInterval(interval);
      }
    }, 30);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        decrypt(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  // Appliquer sur tous les titres de section
  document.querySelectorAll('.section-title, .breach-timer-display').forEach(el => {
    obs.observe(el);
  });
})();

// ══ MÉTA-TEXTES FLOTTANTS HERO ══════════════
(function initMetaFloats() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const texts = [
    'ACCESS GRANTED','SCP-079 ONLINE','BREACH DETECTED',
    'KETER CLASS','MTF DEPLOYED','O5 CLEARANCE',
    'CELL OPEN','CONTAINMENT FAIL','SITE-19',
    '01001011 01100101','PROTOCOL OMEGA','EUCLIDE',
  ];

  function spawn() {
    const el = document.createElement('div');
    el.className = 'meta-float';
    el.textContent = texts[Math.floor(Math.random() * texts.length)];
    el.style.left  = (10 + Math.random() * 80) + '%';
    el.style.animationDuration = (15 + Math.random() * 10) + 's';
    el.style.animationDelay    = '0s';
    hero.appendChild(el);
    setTimeout(() => el.remove(), 25000);
    setTimeout(spawn, Math.random() * 3000 + 1500);
  }
  setTimeout(spawn, 1500);
})();

// ══ FAQ — ANIMATION SUPPLÉMENTAIRE ══════════
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    // Petit flash
    item.style.transition = 'background 0.1s';
    item.style.background = 'rgba(160,175,200,0.04)';
    setTimeout(() => { item.style.background = ''; }, 150);
  });
});

// ══ CONSOLE EASTER EGG AVANCÉ ═══════════════
setTimeout(() => {
  console.log('%c ', 'font-size:1px');
  console.log('%c████████╗██╗    ██╗ ██████╗    ████████╗███████╗', 'color:#9099aa;font-family:monospace;font-size:9px');
  console.log('%c   ██║   ██║    ██║██╔═══██╗      ██║   ██╔════╝', 'color:#9099aa;font-family:monospace;font-size:9px');
  console.log('%c   ██║   ███████╗██║██║   ██║      ██║   ███████╗', 'color:#9099aa;font-family:monospace;font-size:9px');
  console.log('%c   ██║   ██╔══██╗██║██║   ██║      ██║        ██╝', 'color:#9099aa;font-family:monospace;font-size:9px');
  console.log('%c   ██║   ██║  ██║██║╚██████╔╝      ██║   ███████╗', 'color:#9099aa;font-family:monospace;font-size:9px');
  console.log('%c ', 'font-size:1px');
  console.log('%cFONDATION SCP — SITE-19 — ACCÈS NON AUTORISÉ DÉTECTÉ', 'color:#cc4444;font-family:monospace;font-size:11px;font-weight:bold');
  console.log('%cVotre adresse IP a été enregistrée.', 'color:#556070;font-family:monospace;font-size:10px');
  console.log('%cBonne chance. — O5-██', 'color:#445060;font-family:monospace;font-size:10px');
}, 2000);
