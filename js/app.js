// =============================================
// EMPIRE BY MK — Main App JS
// =============================================

const WA_NUMBER = '237600000000'; // Replace with real number
const WA_MSG = encodeURIComponent("Bonjour, je souhaite prendre un rendez-vous chez Empire By MK");
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

// --- Data Store (loaded from JSON or localStorage) ---
let DATA = {
  services: [],
  testimonials: [],
  gallery: []
};

// --- Load Data ---
async function loadData() {
  try {
    const stored_s = localStorage.getItem('empireServices');
    const stored_t = localStorage.getItem('empireTestimonials');
    const stored_g = localStorage.getItem('empireGallery');

    if (stored_s) DATA.services = JSON.parse(stored_s);
    else {
      const r = await fetch('./data/services.json');
      DATA.services = await r.json();
    }

    if (stored_t) DATA.testimonials = JSON.parse(stored_t);
    else {
      const r = await fetch('./data/testimonials.json');
      DATA.testimonials = await r.json();
    }

    if (stored_g) DATA.gallery = JSON.parse(stored_g);
    else {
      const r = await fetch('./data/gallery.json');
      DATA.gallery = await r.json();
    }

    renderAll();
  } catch (e) {
    console.error('Data load error:', e);
  }
}

function renderAll() {
  renderServices();
  renderTestimonials();
  renderGallery();
}

// --- Navbar ---
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  hamburger?.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// --- Theme ---
function initTheme() {
  const saved = localStorage.getItem('empireTheme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeBtn(saved);

  document.getElementById('btn-theme')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('empireTheme', next);
    updateThemeBtn(next);
  });
}

function updateThemeBtn(theme) {
  const btn = document.getElementById('btn-theme');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// --- WhatsApp Links ---
function initWhatsApp() {
  document.querySelectorAll('[data-wa]').forEach(el => {
    el.addEventListener('click', () => window.open(WA_URL, '_blank'));
  });
}

// --- Services ---
function renderServices() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  grid.innerHTML = DATA.services.map(s => `
    <div class="service-card fade-in-up" data-service-id="${s.id}">
      <img 
        class="service-img" 
        src="${s.image}" 
        alt="${s.name}"
        loading="lazy"
        onerror="this.style.display='none'"
      >
      <span class="service-icon">${s.icon}</span>
      <h3 class="service-name">${s.name}</h3>
      <p class="service-desc">${s.description}</p>
      <div class="service-footer">
        <span class="service-price">${s.price}</span>
        <button class="service-rdv" onclick="bookService('${s.name}')">Réserver</button>
      </div>
    </div>
  `).join('');

  initObserver();
}

function bookService(serviceName) {
  const msg = encodeURIComponent(`Bonjour, je souhaite prendre un rendez-vous pour ${serviceName} chez Empire By MK`);
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
}

// --- Testimonials ---
function renderTestimonials() {
  const track = document.getElementById('testimonials-track');
  if (!track) return;

  track.innerHTML = DATA.testimonials.map(t => `
    <div class="testimonial-card fade-in-up">
      <div class="testimonial-quote">"</div>
      <div class="testimonial-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
      <p class="testimonial-text">${t.comment}</p>
      <div class="testimonial-author">
        <div class="author-avatar">${t.name.charAt(0)}</div>
        <div>
          <div class="author-name">${t.name}</div>
          <div class="author-service">${t.service}</div>
        </div>
      </div>
    </div>
  `).join('');

  initObserver();
}

// --- Gallery ---
function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = DATA.gallery.map(item => `
    <div class="gallery-item fade-in-up" onclick="openLightbox(${item.id})">
      <div class="gallery-comparison">
        <div class="gallery-half">
          <img src="${item.before}" alt="Avant" loading="lazy">
          <span class="gallery-tag">Avant</span>
        </div>
        <div class="gallery-half">
          <img src="${item.after}" alt="Après" loading="lazy">
          <span class="gallery-tag">Après</span>
        </div>
      </div>
      <div class="gallery-overlay">
        <div class="gallery-expand">⤢</div>
      </div>
    </div>
  `).join('');

  initObserver();
}

// --- Lightbox ---
function openLightbox(id) {
  const item = DATA.gallery.find(g => g.id === id);
  if (!item) return;

  document.getElementById('lb-title').textContent = item.title;
  document.getElementById('lb-before').src = item.before;
  document.getElementById('lb-after').src = item.after;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// --- Scroll Observer ---
function initObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in-up:not(.visible)').forEach(el => observer.observe(el));
}

// --- Service Worker ---
function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(r => console.log('SW registered:', r.scope))
        .catch(e => console.log('SW error:', e));
    });
  }
}

// --- Admin Panel toggle ---
function openAdmin() {
  document.getElementById('admin-panel').classList.add('open');
  document.body.style.overflow = 'hidden';
  window.adminInit?.();
}

function closeAdmin() {
  document.getElementById('admin-panel').classList.remove('open');
  document.body.style.overflow = '';
  renderAll(); // Re-render main site with updated data
}

// --- PWA Install ---
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const banner = document.getElementById('install-banner');
  if (banner) banner.style.display = 'flex';
});

function installPWA() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(() => {
    deferredPrompt = null;
    const banner = document.getElementById('install-banner');
    if (banner) banner.style.display = 'none';
  });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTheme();
  initWhatsApp();
  loadData();
  registerSW();

  // Lightbox close
  document.getElementById('lightbox')?.addEventListener('click', e => {
    if (e.target.id === 'lightbox') closeLightbox();
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
