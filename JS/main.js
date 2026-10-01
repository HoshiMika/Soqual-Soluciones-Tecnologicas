// main.js - Interacciones compartidas por todas las páginas
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Header: sombra al hacer scroll ---------- */
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Menú móvil ---------- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
  const setOpen = (open) => {
    navLinks.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.querySelector('i').className = open ? 'fas fa-xmark' : 'fas fa-bars';
  };
  navToggle.addEventListener('click', () => setOpen(navToggle.getAttribute('aria-expanded') !== 'true'));
  navLinks.addEventListener('click', (e) => e.target.closest('a') && setOpen(false));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
  window.matchMedia('(min-width: 881px)').addEventListener('change', () => setOpen(false));
}

/* ---------- Tema claro / oscuro ---------- */
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
  const root = document.documentElement;
  const sync = () => {
    const isLight = root.dataset.theme === 'light';
    themeToggle.setAttribute('aria-label', isLight ? 'Activar modo oscuro' : 'Activar modo claro');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isLight ? '#f4f7fb' : '#070b14');
  };
  sync();
  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem('soqual-theme', root.dataset.theme);
    } catch {
      /* almacenamiento no disponible: el tema solo dura esta visita */
    }
    sync();
  });
}

/* ---------- Aparición al hacer scroll ---------- */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

/* ---------- Contadores animados ---------- */
const counters = document.querySelectorAll('[data-count]');
const runCounter = (el) => {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) {
    el.textContent = target + suffix;
    return;
  }
  const duration = 1600;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
if (counters.length) {
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          runCounter(entry.target);
          co.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach(runCounter);
  }
}

/* ---------- Brillo que sigue al cursor en tarjetas ---------- */
if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest?.('.card--spotlight');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}

/* ---------- Modal de términos y condiciones ---------- */
const termsModal = document.getElementById('terms-modal');
if (termsModal) {
  const checkbox = termsModal.querySelector('#accept-terms');
  const acceptBtn = termsModal.querySelector('[data-accept-terms]');

  document.querySelectorAll('[data-open-terms]').forEach((btn) =>
    btn.addEventListener('click', () => {
      checkbox.checked = false;
      acceptBtn.disabled = true;
      termsModal.showModal();
    })
  );
  termsModal.querySelectorAll('[data-close-modal]').forEach((btn) =>
    btn.addEventListener('click', () => termsModal.close())
  );
  // Cerrar al hacer clic fuera del contenido
  termsModal.addEventListener('click', (e) => {
    if (e.target === termsModal) termsModal.close();
  });
  checkbox.addEventListener('change', () => {
    acceptBtn.disabled = !checkbox.checked;
  });
  acceptBtn.addEventListener('click', () => {
    if (!checkbox.checked) return;
    try {
      sessionStorage.setItem('soqual-terms', 'ok');
    } catch {
      /* sin almacenamiento: no es necesario recordar la aceptación */
    }
    window.location.href = acceptBtn.dataset.acceptTerms;
  });
}

/* ---------- Cuenta regresiva de la promoción ---------- */
const countdown = document.querySelector('[data-countdown-end]');
if (countdown) {
  const end = new Date(countdown.dataset.countdownEnd).getTime();
  const parts = {
    d: countdown.querySelector('[data-unit="d"]'),
    h: countdown.querySelector('[data-unit="h"]'),
    m: countdown.querySelector('[data-unit="m"]'),
    s: countdown.querySelector('[data-unit="s"]'),
  };
  const pad = (n) => String(n).padStart(2, '0');
  const update = () => {
    const diff = end - Date.now();
    if (Number.isNaN(end) || diff <= 0) {
      countdown.innerHTML = '<p class="countdown-ended">La promoción ha finalizado. ¡Pronto tendremos nuevas ofertas!</p>';
      clearInterval(timer);
      return;
    }
    parts.d.textContent = Math.floor(diff / 86_400_000);
    parts.h.textContent = pad(Math.floor(diff / 3_600_000) % 24);
    parts.m.textContent = pad(Math.floor(diff / 60_000) % 60);
    parts.s.textContent = pad(Math.floor(diff / 1000) % 60);
  };
  const timer = setInterval(update, 1000);
  update();
}

/* ---------- Año actual en el footer ---------- */
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});
