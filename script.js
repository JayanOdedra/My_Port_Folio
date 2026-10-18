/* =========================================================
   Jayan Odedra portfolio: script.js
   ========================================================= */

/* >>> CONTACT FORM SETUP <<<
   1. Create a free form at https://formspree.io
   2. Copy your form ID (the part after /f/ in the endpoint URL)
   3. Paste it below in place of YOUR_FORM_ID
   Until you do, the form falls back to opening your email app. */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
const CONTACT_EMAIL = 'odedrajayan@gmail.com';

document.documentElement.classList.add('js'); // enables reveal animations only when JS runs

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};

/* ---------- Theme toggle ---------- */
const root = document.documentElement;
const themeBtn = $('#themeToggle');
function applyTheme(t) {
  root.setAttribute('data-theme', t);
  const dark = t === 'dark';
  themeBtn.innerHTML = `<i class="fa-solid ${dark ? 'fa-sun' : 'fa-moon'}"></i>`;
  themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}
applyTheme(root.getAttribute('data-theme') || 'light');
themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  store.set('theme', next);
});
// Follow system changes only if the user never chose manually
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!store.get('theme')) applyTheme(e.matches ? 'dark' : 'light');
});

/* ---------- Mobile menu ---------- */
const burger = $('#burger');
const links = $('#navLinks');
function setMenu(open) {
  links.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  burger.innerHTML = `<i class="fa-solid ${open ? 'fa-xmark' : 'fa-bars'}"></i>`;
}
burger.addEventListener('click', () => setMenu(!links.classList.contains('open')));
links.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });

/* ---------- Active link highlight (scroll spy) ---------- */
const navAnchors = $$('.nav__links a');
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

/* ---------- Scroll reveal ---------- */
const revealIO = new IntersectionObserver((entries, obs) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); } });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => revealIO.observe(el));

/* ---------- Typing animation ---------- */
const roles = ['Full Stack Web Developer', 'Django Developer', 'Cyber Security Enthusiast'];
const typed = $('#typed');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  typed.textContent = roles[0];
} else {
  let r = 0, c = 0, del = false;
  (function tick() {
    const word = roles[r];
    typed.textContent = word.slice(0, c);
    let wait = del ? 40 : 85;
    if (!del && c === word.length) { del = true; wait = 1400; }
    else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
    else c += del ? -1 : 1;
    setTimeout(tick, wait);
  })();
}

/* ---------- Profile photo fallback ("JO") ---------- */
const img = $('#profileImg');
const avatar = $('.avatar');
const showFallback = () => avatar.classList.add('no-img');
img.addEventListener('error', showFallback);
if (img.complete && img.naturalWidth === 0) showFallback();

/* ---------- Resume modal ---------- */
const modal = $('#resumeModal');
const frame = $('#resumeFrame');
const PDF = 'assets/Jayan_Odedra_Resume.pdf';
let lastFocus = null;
function openModal() {
  lastFocus = document.activeElement;
  frame.src = PDF;                 // load only when opened
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  $('#modalClose').focus();
}
function closeModal() {
  modal.hidden = true;
  frame.src = 'about:blank';
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}
$$('[data-open-resume]').forEach(b => b.addEventListener('click', openModal));
$('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => {
  if (modal.hidden) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Tab') { // keep focus inside the dialog
    const f = $$('a[href], button', modal);
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ---------- Contact form ---------- */
const form = $('#contactForm');
const status = $('#formStatus');
const rules = {
  name: v => v.trim().length >= 2 || 'Enter your name (at least 2 characters).',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter a valid email address.',
  message: v => v.trim().length >= 10 || 'Write a message of at least 10 characters.'
};
function check(name) {
  const input = form.elements[name];
  const res = rules[name](input.value);
  const ok = res === true;
  input.closest('.field').classList.toggle('invalid', !ok);
  input.setAttribute('aria-invalid', !ok);
  $('#' + name + 'Err').textContent = ok ? '' : res;
  return ok;
}
Object.keys(rules).forEach(n => form.elements[n].addEventListener('blur', () => check(n)));

form.addEventListener('submit', async e => {
  e.preventDefault();
  status.className = 'form__status';
  status.textContent = '';
  const valid = Object.keys(rules).map(check).every(Boolean);
  if (!valid) return;

  // Fallback until a Formspree ID is added: open the visitor's email app
  if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
    const { name, email, message } = form.elements;
    const body = `${message.value}\n\nFrom: ${name.value} (${email.value})`;
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Portfolio message from ' + name.value)}&body=${encodeURIComponent(body)}`;
    return;
  }

  const btn = $('button[type="submit"]', form);
  btn.disabled = true;
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    });
    if (!res.ok) throw new Error('Request failed');
    form.reset();
    status.textContent = 'Message sent. Thank you, I will reply soon.';
    status.classList.add('ok');
  } catch (err) {
    status.textContent = 'Could not send the message. Please email me directly at ' + CONTACT_EMAIL + '.';
    status.classList.add('bad');
  } finally {
    btn.disabled = false;
  }
});

/* ---------- Back to top + footer year ---------- */
const toTop = $('#toTop');
addEventListener('scroll', () => toTop.classList.toggle('show', scrollY > 600), { passive: true });
toTop.addEventListener('click', () => scrollTo({ top: 0 }));
$('#year').textContent = new Date().getFullYear();