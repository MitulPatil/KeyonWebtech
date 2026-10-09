const isLocalFrontend = window.location.protocol === 'file:'
  || (['localhost', '127.0.0.1'].includes(window.location.hostname) && window.location.port !== '5000');
const API_URL = isLocalFrontend
  ? 'http://localhost:5000/api'
  : '/api';
const fallbackSlides = [{ imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85', eyebrow: 'Built for better business', title: 'A clearer way to move your business forward.', description: 'Thoughtful digital products and dependable technology for teams ready to do their best work.' }];
let slides = [];
let activeSlide = 0;
let timer;

const track = document.querySelector('#hero-track');
const heroContent = document.querySelector('#hero-content');
const current = document.querySelector('#slide-current');
const total = document.querySelector('#slide-total');

function renderSlides() {
  track.innerHTML = slides.map((slide, index) => `<div class="hero-slide ${index === activeSlide ? 'is-active' : ''}" style="background-image: url('${slide.imageUrl}')"></div>`).join('');
  total.textContent = String(slides.length).padStart(2, '0');
  renderHeroContent();
}

function renderHeroContent() {
  const slide = slides[activeSlide];
  heroContent.innerHTML = `<p class="eyebrow">${slide.eyebrow || 'Built for better business'}</p><h1>${slide.title}</h1><p class="hero-description">${slide.description}</p><a class="hero-link" href="#products">Explore our work <span>↘</span></a>`;
  current.textContent = String(activeSlide + 1).padStart(2, '0');
  document.querySelectorAll('.hero-slide').forEach((element, index) => element.classList.toggle('is-active', index === activeSlide));
}

function moveSlide(step) {
  activeSlide = (activeSlide + step + slides.length) % slides.length;
  renderHeroContent();
  restartTimer();
}

function restartTimer() {
  clearInterval(timer);
  if (slides.length > 1) timer = setInterval(() => moveSlide(1), 1000);
}

document.querySelector('#slide-next').addEventListener('click', () => moveSlide(1));
document.querySelector('#slide-prev').addEventListener('click', () => moveSlide(-1));

async function loadSlides() {
  try {
    const response = await fetch(`${API_URL}/slides`);
    if (!response.ok) throw new Error('Slides unavailable');
    const data = await response.json();
    slides = data.length ? data : fallbackSlides;
  } catch {
    slides = fallbackSlides;
  }
  renderSlides();
  restartTimer();
}

async function loadProducts() {
  const productGrid = document.querySelector('#product-grid');
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Products unavailable');
    const products = await response.json();
    productGrid.innerHTML = products.map((product, index) => `<article class="product-card"><div class="product-image" style="background-image: url('${product.imageUrl}')"><span>${String(index + 1).padStart(2, '0')} / ${String(products.length).padStart(2, '0')}</span></div><div class="product-body"><h3>${product.title}</h3><p>${product.description}</p><a class="round-link" href="#contact" aria-label="Learn about ${product.title}">↗</a></div></article>`).join('');
  } catch {
    productGrid.innerHTML = '<p class="data-status">Products are temporarily unavailable.</p>';
  }
}

const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  button.disabled = true;
  button.innerHTML = 'Sending...';
  formStatus.textContent = '';
  try {
    const response = await fetch(`${API_URL}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    form.reset();
    formStatus.textContent = result.message;
    formStatus.className = 'form-status success';
  } catch (error) {
    formStatus.textContent = error.message || 'Something went wrong. Please try again.';
    formStatus.className = 'form-status error';
  } finally {
    button.disabled = false;
    button.innerHTML = 'Send message <span>↗</span>';
  }
});

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('is-open')));

loadSlides();
loadProducts();
