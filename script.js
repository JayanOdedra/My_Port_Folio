// ===== TYPED TEXT =====
const phrases = ['Full Stack Web Developer', 'Problem Solver'];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  if (!typedEl) return;

  const current = phrases[phraseIndex];
  typedEl.textContent = deleting
    ? current.substring(0, charIndex--)
    : current.substring(0, charIndex++);

  if (!deleting && charIndex === current.length + 1) {
    setTimeout(() => {
      deleting = true;
      type();
    }, 1800);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  setTimeout(type, deleting ? 60 : 100);
}

// Start typing after the DOM is ready (script is loaded at the end of body).
type();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
    if (!link) return;

    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    link.classList.toggle(
      'active',
      scrollPosition >= sectionTop && scrollPosition < sectionBottom
    );
  });
}

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  updateActiveLink();
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.setAttribute('aria-expanded', 'false');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===== PROFILE IMAGE FALLBACK =====
// Match the actual image filename used by the HTML.
const profileImgs = document.querySelectorAll(
  'img[src="images/profile.jpeg"], img[src="images/profile 1.jpeg"]'
);

profileImgs.forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';

    const placeholder = document.createElement('div');
    placeholder.style.cssText =
      'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#8892a4;font-size:0.85rem;text-align:center;padding:1rem;';

    placeholder.innerHTML =
      '<i class="fas fa-user" style="font-size:3rem;color:#00b4d8;margin-bottom:0.5rem;"></i><span>Profile image not found</span>';

    if (img.parentElement) img.parentElement.appendChild(placeholder);
  });
});
