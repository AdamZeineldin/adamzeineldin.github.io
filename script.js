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

/* ── Footer year (no-op if footer removed) ────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Mobile nav toggle ────────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => navLinksEl.classList.toggle('open'));
navLinks.forEach(link => link.addEventListener('click', () => navLinksEl.classList.remove('open')));

/* ── Scroll-to-top button ─────────────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTop');
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Navbar active link + scroll-to-top visibility ───────────────────── */
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 300);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

/* ── STEP 1: Add fade-in class to section children FIRST ─────────────── */
document.querySelectorAll('.section .container > *').forEach((el, i) => {
  // Skip elements that already have their own animation classes
  if (
    el.classList.contains('section-title') ||
    el.classList.contains('section-sub') ||
    el.classList.contains('fade-in') ||
    el.classList.contains('timeline') ||
    el.classList.contains('projects-grid') ||
    el.classList.contains('skills-grid') ||
    el.classList.contains('contact-grid') ||
    el.classList.contains('about-grid')
  ) return;
  el.classList.add('fade-in');
  el.style.transitionDelay = `${i * 0.05}s`;
});

/* ── STEP 2: Set up IntersectionObserver AFTER classes are assigned ───── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    // Animate skill bar fills
    if (entry.target.classList.contains('skill-bar')) {
      const fill = entry.target.querySelector('.skill-fill');
      if (fill) fill.style.width = (entry.target.dataset.level || 0) + '%';
    }
  });
}, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

// Observe every animated element
document.querySelectorAll(
  '.fade-in, .timeline-item, .project-card, .about-grid, .skills-grid, .contact-grid, .skill-bar'
).forEach(el => observer.observe(el));

/* ── Project card modals ──────────────────────────────────────────────── */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(modal) {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.project-card, .btn-link').forEach(el => {
  el.addEventListener('click', (e) => {
    if (e.target.closest('.icon-link')) return;
    const id = el.dataset.modal || el.closest('[data-modal]')?.dataset.modal;
    if (id) openModal(id);
  });
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(overlay); });
});
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay')));
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(closeModal);
});

/* ── Contact form (UI only) ───────────────────────────────────────────── */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = '✓ Message sent!';
  btn.disabled = true;
  setTimeout(() => { btn.textContent = 'Send Message'; btn.disabled = false; e.target.reset(); }, 3000);
});
