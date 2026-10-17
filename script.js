// ===== TYPED TEXT =====
const phrases = ['Full Stack Web Developer', 'Problem Solver'];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = phrases[phraseIndex];
  typedEl.textContent = deleting
    ? current.substring(0, charIndex--)
    : current.substring(0, charIndex++);

  if (!deleting && charIndex === current.length + 1) {
    setTimeout(() => { deleting = true; type(); }, 1800);
    return;
  }
  if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }
  setTimeout(type, deleting ? 60 : 100);
}
type();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  backToTop.classList.toggle('visible', window.scrollY > 400);
  updateActiveLink();
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== ACTIVE NAV LINK =====
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop, height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}

// ===== PROFILE IMAGE FALLBACK =====
const profileImgs = document.querySelectorAll('img[src="images/profile.jpg"]');
profileImgs.forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#8892a4;font-size:0.85rem;text-align:center;padding:1rem;';
    placeholder.innerHTML = '<i class="fas fa-user" style="font-size:3rem;color:#00b4d8;margin-bottom:0.5rem;"></i><span>Add profile.jpg<br>to images/ folder</span>';
    img.parentElement.appendChild(placeholder);
  });
});
