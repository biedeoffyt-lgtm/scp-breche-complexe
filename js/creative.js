/* ============================================
   SCP:BC — JS Créatif V3
   ============================================ */
'use strict';

// ══ HORLOGE FAQ TERMINAL ════════════════════
(function initFaqClock() {
  const el = document.getElementById('faqClock');
  if (!el) return;
  function tick() {
    const n = new Date();
    el.textContent = [n.getHours(), n.getMinutes(), n.getSeconds()]
      .map(v => String(v).padStart(2,'0')).join(':');
  }
  tick();
  setInterval(tick, 1000);
})();

// ══ BOOT ANIMÉ FAQ ══════════════════════════
(function initFaqBoot() {
  const boot = document.querySelector('.faq-boot-text');
  if (!boot) return;
  const text = 'Initialisation FAQ.SYS... Chargement des entrées... OK';
  let i = 0;
  const obs = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    const iv = setInterval(() => {
      boot.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(iv);
    }, 28);
  }, { threshold: 0.4 });
  const terminal = document.querySelector('.faq-terminal');
  if (terminal) obs.observe(terminal);
})();

// ══ ACTIVER UNE ENTRÉE FAQ ══════════════════
window.activateFaq = function(id) {
  const entry = document.querySelector('.faq-entry[data-id="' + id + '"]');
  if (!entry) return;
  const wasActive = entry.classList.contains('active');

  document.querySelectorAll('.faq-entry').forEach(e => {
    e.classList.remove('active');
    const exec = e.querySelector('.faq-exec-indicator');
    if (exec) exec.textContent = '';
  });

  if (!wasActive) {
    entry.classList.add('active');
    const exec = entry.querySelector('.faq-exec-indicator');
    if (exec) {
      exec.textContent = 'EXEC...';
      setTimeout(() => { if (exec) exec.textContent = '[DONE]'; }, 350);
    }
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.frequency.value = 520; osc.type = 'square';
      g.gain.setValueAtTime(0.008, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.start(); osc.stop(ctx.currentTime + 0.06);
    } catch(e) {}
  }
};

// ══ HORLOGE TRANSMISSION ════════════════════
(function initTransmissionClock() {
  const el = document.getElementById('transmissionTime');
  if (!el) return;
  function tick() {
    const n = new Date();
    el.textContent = [n.getHours(), n.getMinutes(), n.getSeconds()]
      .map(v => String(v).padStart(2,'0')).join(':');
  }
  tick();
  setInterval(tick, 1000);
})();

// ══ HERO BADGE TYPING ═══════════════════════
(function initBadgeTyping() {
  const badge = document.querySelector('.hero-badge span');
  if (!badge) return;
  const text = badge.textContent;
  badge.textContent = '';
  let i = 0;
  setTimeout(() => {
    const iv = setInterval(() => {
      badge.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(iv);
    }, 30);
  }, 700);
})();

// ══ RAPPORTS D'INCIDENTS ════════════════════
(function initIncidentReports() {
  const popup  = document.getElementById('incidentPopup');
  const body   = document.getElementById('incidentBody');
  const title  = document.getElementById('incidentTitle');
  const codeEl = document.getElementById('incidentCode');
  const timeEl = document.getElementById('incidentTime');
  if (!popup) return;

  const incidents = [
    {
      title: 'ALERTE — SCP-173 ACTIF',
      lines: ['> MOUVEMENT DÉTECTÉ SECTEUR B-7', '> 2 AGENTS HORS CONTACT', '> PROTOCOLE DE CONFINEMENT ENGAGÉ', '> RENFORTS EN ROUTE — ETA: 4 MIN'],
      code: 'INC-173-A'
    },
    {
      title: 'RAPPORT — INTRUSION DÉTECTÉE',
      lines: ['> BADGE INVALIDE — PORTE E-04', '> GROUPE D\'INTÉRÊT SUSPECTÉ', '> CAMÉRAS NEUTRALISÉES SECTEUR C', '> MTF ALPHA-1 MOBILISÉ'],
      code: 'INC-INT-009'
    },
    {
      title: 'AVERTISSEMENT — SCP-079',
      lines: ['> TENTATIVE D\'ACCÈS SYSTÈME', '> PARE-FEU NIV.4 ACTIVÉ', '> ISOLATION RÉSEAU EN COURS...', '> ÉTAT: CONTENU — SURVEILLANCE RENFORCÉE'],
      code: 'INC-079-B'
    },
    {
      title: 'NOTIFICATION — MISE À JOUR',
      lines: ['> PATCH DE SÉCURITÉ INSTALLÉ', '> PROTOCOLES MIS À JOUR', '> TOUS LES SYSTÈMES OPÉRATIONNELS', '> PROCHAINE SORTIE: FIN 2026'],
      code: 'SYS-UPD-012'
    },
    {
      title: 'ALERTE — BRÈCHE CELLULE 49-B',
      lines: ['> CELLULE 49-B OUVERTE', '> SCP-049 LOCALISÉ COULOIR D', '> ÉVACUATION NIVEAU 1 INITIÉE', '> NE PAS APPROCHER — EUCLIDE'],
      code: 'INC-049-C'
    },
  ];

  window.closeIncident = function() {
    popup.classList.remove('visible');
  };

  function show() {
    const inc = incidents[Math.floor(Math.random() * incidents.length)];
    const now = new Date();
    const t   = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map(v => String(v).padStart(2,'0')).join(':');

    if (title)  title.textContent  = inc.title;
    if (codeEl) codeEl.textContent = 'REF: ' + inc.code;
    if (timeEl) timeEl.textContent = t;

    if (body) {
      body.innerHTML = '';
      inc.lines.forEach((line, i) => {
        const span = document.createElement('span');
        span.className = 'inc-line';
        span.textContent = line;
        span.style.animationDelay = (i * 0.14) + 's';
        body.appendChild(span);
      });
    }

    popup.classList.add('visible');
    setTimeout(() => popup.classList.remove('visible'), 6000);
    setTimeout(show, Math.random() * 25000 + 15000);
  }

  setTimeout(show, 8000);
})();

// ══ SCROLL CASCADE SUR GRILLES ══════════════
document.querySelectorAll('.features-grid .reveal, .scps-grid .reveal, .factions-grid .reveal').forEach((el, i) => {
  el.style.transitionDelay = (i * 55) + 'ms';
});
