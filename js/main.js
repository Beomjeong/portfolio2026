gsap.registerPlugin(ScrollTrigger);

/* ── Header: transparent → frosted on scroll ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ═══════════════════════════════════════
   BG EFFECT (grid + blobs) — reusable
═══════════════════════════════════════ */
const CELL     = 55;
const RADIUS   = 210;
const STRENGTH = 52;

function initBgEffect(section, opts = {}) {
  const canvas = section.querySelector('canvas');
  const b1el   = section.querySelector('.blob-1');
  const b2el   = section.querySelector('.blob-2');
  const ctx    = canvas.getContext('2d');
  const mouse  = { x: -9999, y: -9999 };

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  if (opts.useWindowMouse) {
    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });
  } else {
    section.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }, { passive: true });
    section.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }

  let b1 = { x: canvas.width * 0.35, y: canvas.height * 0.42 };
  let b2 = { x: canvas.width * 0.55, y: canvas.height * 0.56 };

  function draw() {
    const W    = canvas.width;
    const H    = canvas.height;
    const cols = Math.ceil(W / CELL) + 1;
    const rows = Math.ceil(H / CELL) + 1;

    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth   = 0.75;

    const pts = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const bx   = c * CELL;
        const by   = r * CELL;
        const dx   = bx - mouse.x;
        const dy   = by - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const f    = Math.max(0, 1 - dist / RADIUS);
        const push = f * f * STRENGTH;
        const ang  = Math.atan2(dy, dx);
        row.push({ x: bx + Math.cos(ang) * push, y: by + Math.sin(ang) * push });
      }
      pts.push(row);
    }

    ctx.beginPath();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 1; c++) {
        ctx.moveTo(pts[r][c].x,     pts[r][c].y);
        ctx.lineTo(pts[r][c + 1].x, pts[r][c + 1].y);
      }
    }
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows - 1; r++) {
        ctx.moveTo(pts[r][c].x,     pts[r][c].y);
        ctx.lineTo(pts[r + 1][c].x, pts[r + 1][c].y);
      }
    }
    ctx.stroke();

    const tx = mouse.x > 0 ? mouse.x : b1.x;
    const ty = mouse.y > 0 ? mouse.y : b1.y;
    b1.x += (tx       - b1.x) * 0.07;
    b1.y += (ty       - b1.y) * 0.07;
    b2.x += (tx + 170 - b2.x) * 0.04;
    b2.y += (ty + 100 - b2.y) * 0.04;
    b1el.style.left = b1.x + 'px';
    b1el.style.top  = b1.y + 'px';
    b2el.style.left = b2.x + 'px';
    b2el.style.top  = b2.y + 'px';

    requestAnimationFrame(draw);
  }
  draw();
}

initBgEffect(document.querySelector('.hero'));
initBgEffect(document.getElementById('contactBg'), { useWindowMouse: true });

/* ═══════════════════════════════════════
   ROLE TEXT SCRAMBLE + CYCLE
═══════════════════════════════════════ */
const ROLES   = ['콘텐츠 디자이너', '콘텐츠 기획자', '바이브 코더'];
const SPECIAL = '~!@#$%^&*()_+=-';
const KOREAN  = '가나다라마바사아자차카타파하';
let roleIndex = 0;
const roleEl  = document.getElementById('roleText');

function randChar() {
  return Math.random() < 0.82
    ? SPECIAL[Math.floor(Math.random() * SPECIAL.length)]
    : KOREAN[Math.floor(Math.random() * KOREAN.length)];
}

function scrambleTo(target) {
  const DURATION = 750;
  const len      = target.length;
  const t0       = performance.now();
  function frame(now) {
    const progress = Math.min((now - t0) / DURATION, 1);
    let result = '';
    for (let i = 0; i < len; i++) {
      const ch = target[i];
      if (ch === ' ') { result += ch; continue; }
      const reveal = Math.max(0, (progress - (i / len) * 0.45) / 0.55);
      result += reveal >= 1 ? ch : randChar();
    }
    roleEl.textContent = result;
    if (progress < 1) requestAnimationFrame(frame);
    else roleEl.textContent = target;
  }
  requestAnimationFrame(frame);
}

setInterval(() => {
  roleIndex = (roleIndex + 1) % ROLES.length;
  scrambleTo(ROLES[roleIndex]);
}, 3000);

/* ═══════════════════════════════════════
   HERO ENTRANCE ANIMATION
═══════════════════════════════════════ */
gsap.timeline({ defaults: { ease: 'power3.out' } })
  .to('.hero-greeting', { opacity: 1, y: 0, duration: 0.7 }, 0.3)
  .to('.hero-role',     { opacity: 1, y: 0, duration: 0.8 }, 0.55)
  .to('.hero-tagline',  { opacity: 1, y: 0, duration: 0.7 }, 1.0)
  .to('.hero-scroll',   { opacity: 1, duration: 0.6 },       1.4);

/* ═══════════════════════════════════════
   SCROLL REVEALS
═══════════════════════════════════════ */
gsap.utils.toArray('.section-head, .career-item').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    }
  );
});

gsap.utils.toArray('.about-headline, .about-desc, .skills-wrap').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, y: 25 },
    {
      opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    }
  );
});

/* ═══════════════════════════════════════
   WORKS — TAB FILTER + CARD REVEAL
═══════════════════════════════════════ */
function revealVisibleCards() {
  gsap.fromTo(document.querySelectorAll('.work-card.visible'),
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
  );
}

const tabs  = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.work-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    cards.forEach(card => {
      const match = cat === 'all' || card.dataset.cat === cat;
      card.classList.toggle('hidden', !match);
      card.classList.toggle('visible', match);
    });
    revealVisibleCards();
  });
});

ScrollTrigger.create({
  trigger: '#worksGrid',
  start: 'top 85%',
  once: true,
  onEnter: () => {
    cards.forEach(c => c.classList.add('visible'));
    revealVisibleCards();
  }
});

/* Hide hero when contact is in view */
ScrollTrigger.create({
  trigger: '#contact',
  start: 'top bottom',
  onEnter:     () => gsap.set('.hero', { autoAlpha: 0 }),
  onLeaveBack: () => gsap.to('.hero', { autoAlpha: 1, duration: 0.3 }),
});

/* ─── Tool bars ─── */
ScrollTrigger.create({
  trigger: '.tools-list',
  start: 'top 85%',
  once: true,
  onEnter: () => {
    document.querySelectorAll('.tool-fill').forEach(bar => {
      bar.style.width = bar.dataset.level + '%';
    });
  }
});
