/* ============================================
   SCP : Brèche de Complexe — main.js
   ============================================ */
'use strict';

// ── NAVBAR SCROLL ────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── NAV TOGGLE MOBILE ────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ── HORLOGE HERO ─────────────────────────────
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');
  const el = document.getElementById('hero-clock');
  if (el) el.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

// ── TYPEWRITER HERO ──────────────────────────
const phrases = [
  'Lorsque les portes s\'ouvrent, le chaos commence.',
  'Site-19 — Brèche de confinement générale.',
  'Sécuriser. Contenir. Protéger.',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const subtitleEl = document.getElementById('heroSubtitle');

function typeWriter() {
  if (!subtitleEl) return;
  const current = phrases[phraseIdx];
  if (!deleting) {
    subtitleEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeWriter, 2500);
      return;
    }
  } else {
    subtitleEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeWriter, deleting ? 40 : 80);
}
setTimeout(typeWriter, 1200);

// ── REVEAL ON SCROLL ─────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ── COMPTEURS ANIMÉS ─────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString('fr-FR');
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num, .counter-num').forEach(el => {
  counterObserver.observe(el);
});

// ── FAQ ACCORDION ────────────────────────────
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── GALERIE LIGHTBOX ─────────────────────────
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-img').forEach(img => {
  img.addEventListener('click', () => {
    const label = img.querySelector('.gallery-overlay span')?.textContent || '';
    lightboxContent.innerHTML = `
      <div style="
        width:80vw; max-width:900px; height:60vh;
        background: ${getComputedStyle(img).background};
        border: 1px solid #cc0000; border-radius:4px;
        display:flex; align-items:center; justify-content:center;
        flex-direction:column; gap:1rem;
      ">
        <div style="font-family:'Orbitron',sans-serif; font-size:1.5rem; color:#fff;">${label}</div>
        <div style="font-family:'Share Tech Mono',monospace; font-size:0.7rem; color:#cc0000;">SITE-19 // CAMÉRA DE SURVEILLANCE</div>
      </div>`;
    lightbox.classList.add('active');
  });
});

lightboxClose?.addEventListener('click', () => lightbox.classList.remove('active'));
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.classList.remove('active');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') lightbox?.classList.remove('active');
});

// ── PARTAGE ──────────────────────────────────
function shareProject() {
  if (navigator.share) {
    navigator.share({
      title: 'SCP : Brèche de Complexe',
      text: 'Découvrez SCP : Brèche de Complexe, le jeu Roblox immersif basé sur la Fondation SCP !',
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showNotification('Lien copié dans le presse-papier !');
    });
  }
}
window.shareProject = shareProject;

// ── NOTIFICATION TOAST ───────────────────────
function showNotification(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:30px; left:50%; transform:translateX(-50%);
    background:#0a0c10; border:1px solid #cc0000; color:#fff;
    padding:0.8rem 2rem; border-radius:4px; z-index:9999;
    font-family:'Share Tech Mono',monospace; font-size:0.8rem;
    animation:fadeSlideUp 0.3s ease; box-shadow:0 0 20px rgba(204,0,0,0.3);`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── FACTION BAR ANIMATION ────────────────────
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.faction-bar-fill').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = width; }, 200);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.faction-card').forEach(card => barObserver.observe(card));

// ── DANGER BAR ANIMATION ─────────────────────
const dangerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.danger-fill').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
          bar.style.transition = 'width 1.2s ease';
          bar.style.width = width;
        }, 300);
      });
      dangerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.scp-card').forEach(card => dangerObserver.observe(card));

// ── SMOOTH SCROLL LINKS ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── TOGGLE RÔLES FACTIONS ────────────────────
function toggleRoles(btn) {
  const roles = btn.nextElementSibling;
  const isHidden = roles.classList.contains('hidden');
  roles.classList.toggle('hidden', !isHidden);
  const icon = btn.querySelector('i');
  if (icon) icon.style.transform = isHidden ? 'rotate(180deg)' : '';
}
window.toggleRoles = toggleRoles;
