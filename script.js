/* ── Typed text animation ─────────────────────────────────────────────── */
const phrases = [
  'CS Student @ UMD',
  'Full-Stack Developer',
  'Problem Solver',
  'Open to Internships',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = phrases[phraseIdx];
  if (deleting) {
    typedEl.textContent = current.substring(0, --charIdx);
  } else {
    typedEl.textContent = current.substring(0, ++charIdx);
  }
  let delay = deleting ? 50 : 100;
  if (!deleting && charIdx === current.length) { delay = 1800; deleting = true; }
  else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 400; }
  setTimeout(type, delay);
}
type();

/* ── Footer year ──────────────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Navbar scroll shadow + active link ───────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scroll-to-top button
  scrollTopBtn.classList.toggle('visible', window.scrollY > 300);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

/* ── Mobile nav toggle ────────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});
navLinks.forEach(link => {
  link.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

/* ── Scroll-to-top button ─────────────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTop');
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── IntersectionObserver for animations ──────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate skill bars when they become visible
      if (entry.target.classList.contains('skill-bar')) {
        const fill = entry.target.querySelector('.skill-fill');
        const level = entry.target.dataset.level;
        fill.style.width = level + '%';
      }
    }
  });
}, { threshold: 0.15 });

// Observe fade-in elements
document.querySelectorAll('.fade-in, .timeline-item, .project-card').forEach(el => observer.observe(el));

// Observe skill bars
document.querySelectorAll('.skill-bar').forEach(el => observer.observe(el));

/* ── Section fade-in: attach class to section children ───────────────── */
document.querySelectorAll('.section .container > *:not(.section-title):not(.section-sub)').forEach((el, i) => {
  if (!el.classList.contains('fade-in')) {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${i * 0.05}s`;
  }
});

/* ── Project card modal ───────────────────────────────────────────────── */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(modal) {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Open via card click or btn-link
document.querySelectorAll('.project-card, .btn-link').forEach(el => {
  el.addEventListener('click', (e) => {
    // Don't open modal if clicking the GitHub icon link
    if (e.target.closest('.icon-link')) return;
    const id = el.dataset.modal || el.closest('[data-modal]')?.dataset.modal;
    if (id) openModal(id);
  });
});

// Close via backdrop click or close button
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay);
  });
});
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay')));
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
  }
});

/* ── Contact form (UI only — wire up Formspree to make it real) ───────── */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = '✓ Message sent!';
  btn.disabled = true;
  setTimeout(() => { btn.textContent = 'Send Message'; btn.disabled = false; e.target.reset(); }, 3000);
});
