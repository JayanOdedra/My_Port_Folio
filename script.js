'use strict';
/* ============ CONFIG: edit your content here ============ */
const CONFIG = {
  links: {
    linkedin: 'https://www.linkedin.com/in/jayan-odedra',
    github: 'https://github.com/JayanOdedra',
    email: 'odedrajayan@gmail.com',
    resume: 'assets/Jayan_Odedra_Resume.pdf',
    campusRepo: 'https://github.com/JayanOdedra/CampusPro_Academic-Management-System',   // paste the repository URL
    campusDemo: '',   // optional: add only if a live demo exists
    studentRepo: 'https://github.com/JayanOdedra/Student-Management-System',   // paste the repository URL
    studentDemo: '',   // optional: add only if a live demo exists
    phishingRepo: 'https://github.com/JayanOdedra/Phishing-url-system',  // paste the repository URL
    phishingDemo: ''   // optional
  },
  // level: 'hands' = Hands-on, 'found' = Foundations
  skills: [
    ['HTML, CSS, JavaScript','Web technologies','hands'],['Django, Flask','Framework','hands'],
    ['SQLite, MongoDB','Database','hands'],['Python(basics)','Programming','found'],
    ['Kali Linux(Basics)','Operating system','found'],['Git, GitHub, VS Code','Tool','hands']
  ]
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));
document.documentElement.classList.add('js');

/* Toast for links that are not configured yet */
let toastT;
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),3200)}

/* ---------- Build skills and certificate cards ---------- */
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
$('#skillGrid').innerHTML = CONFIG.skills.map(([n,c,l],i)=>
  `<article class="card glass reveal spot" style="--d:${(i%4)*.06}s"><p class="skill-cat">${c}</p><h3>${esc(n)}</h3><span class="lvl ${l}">${l==='hands'?'Hands-on':'Foundations'}</span></article>`).join('');

/* ---------- Wire up links from CONFIG ---------- */
$$('[data-link]').forEach(el=>{
  const key=el.dataset.link, val=CONFIG.links[key];
  if(key==='email'){
    el.href=`mailto:${val}`;$('#mailLine').textContent=val;return;
  }
  if(val){el.href=val;return}
  if(el.hasAttribute('data-optional')){el.hidden=true;return}   // no demo link = no demo button
  el.setAttribute('aria-disabled','true');el.setAttribute('role','link');
  el.title='Not added yet. Set it in CONFIG in script.js';
  el.addEventListener('click',e=>{e.preventDefault();toast(`"${el.textContent.trim()}" link is not set yet. Add it in CONFIG inside script.js.`)});
});
$('#year').textContent = new Date().getFullYear();

/* ---------- Preloader (about 2.4s) ---------- */
(async function preloader(){
  const log=$('#preLog'),fill=$('#preFill'),pct=$('#prePct');
  const steps=['INITIALIZING PORTFOLIO...','LOADING SECURITY MODULES...','SYSTEM READY'];
  const gap = reduced?0:650;
  for(let i=0;i<steps.length;i++){
    log.textContent += (i?'\n':'')+'> '+steps[i];
    const to=Math.round((i+1)/steps.length*100);
    fill.style.transition=`width ${gap||1}ms linear`;fill.style.width=to+'%';pct.textContent=to+'%';
    await sleep(gap);
  }
  await sleep(reduced?0:300);
  $('#preloader').classList.add('done');
  document.body.classList.remove('is-loading');
  startHero();
})();

/* ---------- Hero: typewriter, glitch, terminal panel ---------- */
let heroStarted=false;
function startHero(){
  if(heroStarted)return;heroStarted=true;
  const words=['Full Stack Web Developer','Django Developer'];
  const out=$('#typed');
  if(reduced){out.textContent=words[0]}else{
    (async()=>{let w=0;for(;;){
      const word=words[w];
      for(let i=1;i<=word.length;i++){out.textContent=word.slice(0,i);await sleep(70)}
      await sleep(1400);
      for(let i=word.length;i>=0;i--){out.textContent=word.slice(0,i);await sleep(35)}
      await sleep(350);w=(w+1)%words.length;
    }})();
  }
  // Glitch: add .on briefly every few seconds (CSS handles the effect)
  const h1=$('.glitch');
  if(!reduced)setInterval(()=>{h1.classList.add('on');setTimeout(()=>h1.classList.remove('on'),380)},4500);

  // Decorative terminal: fake status lines only, nothing is executed
  const lines=['$ whoami','<span class="ok">jayan_odedra</span>','$ status --learning','<b>[ok]</b> frontend ........... active','<b>[ok]</b> backend (django) .... active','<b>[ok]</b> databases ........... active','$ stack','html css js django mongodb sqlite','$ goal','<span class="ok">full stack developer</span>'];
  const body=$('#termBody');
  (async()=>{
    for(const l of lines){body.innerHTML+=l+'\n';body.scrollTop=body.scrollHeight;await sleep(reduced?0:420)}
    body.innerHTML+='$ <span class="cursor"></span>';body.scrollTop=body.scrollHeight;
  })();
}

/* ---------- Scroll reveal + counters (IntersectionObserver) ---------- */
function countUp(el){
  const to=+el.dataset.to;
  if(reduced){el.textContent=to;return}
  const dur=1400,t0=performance.now();
  (function tick(t){const p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e);if(p<1)requestAnimationFrame(tick)})(t0);
}
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('in');
  $$('.count',e.target).forEach(countUp);
  io.unobserve(e.target);
}),{threshold:.15});
$$('.reveal').forEach(el=>io.observe(el));

/* ---------- Card spotlight follows the cursor ---------- */
document.addEventListener('pointermove',e=>{
  const c=e.target.closest&&e.target.closest('.spot');if(!c)return;
  const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px');
},{passive:true});

/* ---------- Nav: scrolled state, progress bar, active section ---------- */
const nav=$('#nav'),bar=$('#scrollProgress'),links=$$('.menu a'),ind=$('#indicator');
const sections=links.map(a=>$(a.getAttribute('href')));
function moveIndicator(a){
  if(!a||innerWidth<=900)return;
  ind.style.width=a.offsetWidth+'px';ind.style.transform=`translateX(${a.offsetLeft}px)`;
}
function onScroll(){
  nav.classList.toggle('scrolled',scrollY>30);
  const max=document.documentElement.scrollHeight-innerHeight;
  bar.style.transform=`scaleX(${max>0?scrollY/max:0})`;
  let cur=0;const y=scrollY+innerHeight*.35;
  sections.forEach((s,i)=>{if(s.offsetTop<=y)cur=i});
  if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)cur=sections.length-1;
  links.forEach((a,i)=>{a.classList.toggle('active',i===cur);if(i===cur)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});
  moveIndicator(links[cur]);
}
let ticking=false;
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{onScroll();ticking=false})}},{passive:true});
addEventListener('resize',onScroll);
onScroll();document.fonts&&document.fonts.ready.then(onScroll);

/* ---------- Mobile menu ---------- */
const burger=$('#burger'),menu=$('#menu');
function setMenu(open){menu.classList.toggle('open',open);burger.setAttribute('aria-expanded',open);burger.setAttribute('aria-label',open?'Close menu':'Open menu')}
burger.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
links.forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
addEventListener('resize',()=>{if(innerWidth>900)setMenu(false)});

/* ---------- Background: lightweight particles on canvas ---------- */
(function particles(){
  const cv=$('#bg'),ctx=cv.getContext('2d');
  let W,H,P=[],raf,visible=true;
  const dpr=Math.min(devicePixelRatio||1,2);
  function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const n=Math.min(48,Math.floor(W*H/32000));
    P=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:-.1-Math.random()*.3,r:1+Math.random()*1.6,c:Math.random()>.5?'0,255,157':'34,211,238'}))}
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(const p of P){
      if(!reduced){p.x+=p.vx;p.y+=p.vy;if(p.y<-5){p.y=H+5;p.x=Math.random()*W}if(p.x<-5)p.x=W+5;if(p.x>W+5)p.x=-5}
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fillStyle=`rgba(${p.c},.55)`;ctx.shadowBlur=8;ctx.shadowColor=`rgb(${p.c})`;ctx.fill();
    }
    if(!reduced&&visible)raf=requestAnimationFrame(draw);
  }
  size();draw();addEventListener('resize',()=>{size();if(reduced)draw()});
  // Pause the loop when the tab is hidden to save CPU
  document.addEventListener('visibilitychange',()=>{visible=!document.hidden;cancelAnimationFrame(raf);if(visible&&!reduced)draw()});
})();

/* ---------- Profile photo: show a labelled placeholder if assets/profile.jpg is missing ---------- */
(function profilePhoto(){
  const img=$('#profilePhoto'),fig=img.closest('.hero-photo');
  const miss=()=>fig.classList.add('no-photo');
  img.addEventListener('error',miss);
  if(img.complete&&img.naturalWidth===0)miss();
})();

/* ---------- Project screenshots: use the image if the file exists, else keep the placeholder ---------- */
$$('[data-shot]').forEach(box=>{
  const im=new Image();
  im.onload=()=>{box.removeAttribute('role');box.removeAttribute('aria-label');box.innerHTML='';im.alt=box.closest('.card').querySelector('h3').textContent+' project screenshot';im.decoding='async';box.appendChild(im)};
  im.src=box.dataset.shot;
});