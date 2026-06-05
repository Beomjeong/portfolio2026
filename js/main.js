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

/* ═══════════════════════════════════════
   CONSTELLATION BACKGROUND (contact)
═══════════════════════════════════════ */
(function initConstellation() {
  const canvas = document.getElementById('constellationCanvas');
  const ctx    = canvas.getContext('2d');
  const ACCENT = '0,229,184';
  const COUNT  = 90;
  const DIST   = 140;
  const mouse  = { x: -9999, y: -9999 };

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  canvas.parentElement.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });
  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = -9999; mouse.y = -9999;
  });

  const particles = Array.from({ length: COUNT }, () => ({
    x:  Math.random(),
    y:  Math.random(),
    vx: (Math.random() - 0.5) * 0.0003,
    vy: (Math.random() - 0.5) * 0.0003,
    r:  Math.random() * 1.5 + 0.8,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.01 + Math.random() * 0.02,
  }));

  function draw() {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // resolve absolute positions
    const pts = particles.map(p => ({
      x: p.x * W, y: p.y * H,
      r: p.r,
      alpha: 0.5 + Math.sin(p.twinkle) * 0.35,
    }));

    // connections between particles
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          ctx.strokeStyle = `rgba(${ACCENT},${(1 - d / DIST) * 0.25})`;
          ctx.lineWidth   = 0.7;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    // mouse connections
    if (mouse.x > 0) {
      pts.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST * 1.4) {
          ctx.strokeStyle = `rgba(${ACCENT},${(1 - d / (DIST * 1.4)) * 0.5})`;
          ctx.lineWidth   = 0.9;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
    }

    // particles
    pts.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT},${p.alpha})`;
      ctx.fill();

      particles[i].x += particles[i].vx;
      particles[i].y += particles[i].vy;
      if (particles[i].x < 0 || particles[i].x > 1) particles[i].vx *= -1;
      if (particles[i].y < 0 || particles[i].y > 1) particles[i].vy *= -1;
      particles[i].twinkle += particles[i].twinkleSpeed;
    });

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ═══════════════════════════════════════
   WORK MODAL
═══════════════════════════════════════ */
const MODAL_DATA = {
  'web-01': {
    type: 'viewer',
    cat: 'Web Promotion',
    title: '이벤트페이지 타이틀',
    sub: '적응형(PC/MO)',
    contribution: '기여도 100%',
    tools: ['tool-ps', 'tool-figma'],
    desc: '프로젝트 설명이 들어갈 자리입니다.',
    views: [
      { label: 'PC ver', image: 'source/디아블로2 레저렉션_PC.jpg' },
      { label: 'MO ver', image: 'source/디아블로2 레저렉션_MO.jpg' },
      { label: 'Banner', type: 'banner', images: [
        'works/webpromo_diaII/banner 1.jpg',
        'works/webpromo_diaII/banner_2.jpg',
        'works/webpromo_diaII/banner_3.jpg',
        'works/webpromo_diaII/banner_4.png',
        'works/webpromo_diaII/banner_5.jpg',
        'works/webpromo_diaII/banner_6.jpg',
      ]},
    ],
  },
  'web-02':   { cat: 'Web Promotion', title: '상세페이지 타이틀',    sub: '상세페이지',     contribution: '기여도 100%', tools: ['tool-ps','tool-ai'] },
  'web-03':   { cat: 'Web Promotion', title: '배너 프로젝트',        sub: '배너',          contribution: '기여도 80%',  tools: ['tool-ps'] },
  'video-01': { cat: 'Video',         title: 'Short Form 타이틀',   sub: 'Shorts / Reels', contribution: '기여도 100%', tools: ['tool-pr','tool-ae'] },
  'video-02': { cat: 'Video',         title: 'PR 영상 타이틀',      sub: 'PR Video',       contribution: '기여도 100%', tools: ['tool-pr','tool-lr'] },
  '3d-01':    { cat: '3D',            title: '3D 에셋 타이틀',      sub: 'Blender',        contribution: '기여도 100%', tools: ['tool-blender'] },
  'print-01': { cat: 'Printing',      title: '포스터 타이틀',       sub: '포스터',         contribution: '기여도 100%', tools: ['tool-ai','tool-ps'] },
  'print-02': { cat: 'Printing',      title: 'X배너 / 사이니지',    sub: 'Stand Banner',   contribution: '기여도 100%', tools: ['tool-ai'] },
};

const overlay   = document.getElementById('workModal');
const panel     = overlay.querySelector('.modal-panel');
const closeBtn  = overlay.querySelector('.modal-close');
const modalCat  = overlay.querySelector('.modal-cat');
const modalTitle= overlay.querySelector('.modal-title');
const modalSub  = overlay.querySelector('.modal-sub');
const modalCont = overlay.querySelector('.modal-contribution');
const modalTools= overlay.querySelector('.modal-tools');

let modalTween = null;

function openModal(id) {
  const data = MODAL_DATA[id];
  if (!data) return;

  modalCat.textContent   = data.cat;
  modalTitle.textContent = data.title;
  modalSub.textContent   = data.sub;
  modalCont.textContent  = data.contribution;
  modalTools.innerHTML   = data.tools.map(t => `<li class="${t}"></li>`).join('');

  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  if (modalTween) modalTween.kill();
  gsap.set(panel, { y: '100%' });
  modalTween = gsap.timeline()
    .to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' })
    .to(panel,   { y: '0%',   duration: 0.45, ease: 'power3.out' }, 0.05);
}

function closeModal() {
  if (modalTween) modalTween.kill();
  modalTween = gsap.timeline({ onComplete: () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }})
    .to(panel,   { y: '100%', duration: 0.35, ease: 'power3.in' })
    .to(overlay, { opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.1);
}

document.querySelectorAll('.card-link[data-modal]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.dataset.modal;
    const data = MODAL_DATA[id];
    if (data && data.type === 'viewer') {
      openViewer(id);
    } else {
      openModal(id);
    }
  });
});

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal(); });

/* ═══════════════════════════════════════
   WORK VIEWER MODAL
═══════════════════════════════════════ */
(function () {
  const viewerOverlay = document.getElementById('workViewer');
  const viewerImgA    = document.getElementById('viewerImgA');
  const viewerImgB    = document.getElementById('viewerImgB');
  const viewerPanel   = document.getElementById('viewerPanel');
  const viewerToggle  = document.getElementById('viewerToggle');
  const viewerCatEl   = document.getElementById('viewerCat');
  const viewerTitleEl = document.getElementById('viewerTitle');
  const viewerSubEl   = document.getElementById('viewerSub');
  const viewerContEl  = document.getElementById('viewerContrib');
  const viewerToolsEl = document.getElementById('viewerTools');
  const viewerDescEl  = document.getElementById('viewerDesc');
  const viewerTabsEl  = document.getElementById('viewerTabs');

  const viewerBannerGrid = document.getElementById('viewerBannerGrid');

  let viewerTween = null;
  let activeLayer = 'A';

  function setViewerImage(url, animate) {
    const encoded = encodeURI(url);
    if (!animate) {
      viewerImgA.style.backgroundImage = `url('${encoded}')`;
      viewerImgA.style.opacity = '1';
      viewerImgB.style.opacity = '0';
      activeLayer = 'A';
      return;
    }
    if (activeLayer === 'A') {
      viewerImgB.style.backgroundImage = `url('${encoded}')`;
      viewerImgB.style.opacity = '1';
      viewerImgA.style.opacity = '0';
      activeLayer = 'B';
    } else {
      viewerImgA.style.backgroundImage = `url('${encoded}')`;
      viewerImgA.style.opacity = '1';
      viewerImgB.style.opacity = '0';
      activeLayer = 'A';
    }
  }

  function switchView(view, animate) {
    if (view.type === 'banner') {
      viewerBannerGrid.innerHTML = `<div class="banner-inner">${
        view.images.map(src => `<div class="banner-item"><img src="${encodeURI(src)}" alt="" loading="lazy"></div>`).join('')
      }</div>`;
      viewerBannerGrid.classList.add('is-active');
      viewerImgA.style.opacity = '0';
      viewerImgB.style.opacity = '0';
    } else {
      viewerBannerGrid.classList.remove('is-active');
      viewerBannerGrid.scrollTop = 0;
      setViewerImage(view.image, animate);
    }
  }

  function openViewer(id) {
    const data = MODAL_DATA[id];
    if (!data || data.type !== 'viewer') return;

    viewerCatEl.textContent   = data.cat;
    viewerTitleEl.textContent = data.title;
    viewerSubEl.textContent   = data.sub;
    viewerContEl.textContent  = data.contribution;
    viewerDescEl.textContent  = data.desc;
    viewerToolsEl.innerHTML   = data.tools.map(t => `<li class="${t}"></li>`).join('');

    viewerTabsEl.innerHTML = '';
    data.views.forEach((view, i) => {
      const btn = document.createElement('button');
      btn.className = 'viewer-tab' + (i === 0 ? ' active' : '');
      btn.textContent = view.label;
      btn.addEventListener('click', () => {
        viewerTabsEl.querySelectorAll('.viewer-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        switchView(view, true);
      });
      viewerTabsEl.appendChild(btn);
    });

    switchView(data.views[0], false);
    viewerPanel.classList.remove('collapsed');

    viewerOverlay.setAttribute('aria-hidden', 'false');
    viewerOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (viewerTween) viewerTween.kill();
    gsap.set(viewerOverlay, { opacity: 0 });
    viewerTween = gsap.to(viewerOverlay, { opacity: 1, duration: 0.35, ease: 'power2.out' });
  }

  function closeViewer() {
    if (viewerTween) viewerTween.kill();
    viewerTween = gsap.to(viewerOverlay, {
      opacity: 0, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        viewerOverlay.classList.remove('is-open');
        viewerOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  viewerToggle.addEventListener('click', () => {
    viewerPanel.classList.toggle('collapsed');
  });

  document.getElementById('viewerClose').addEventListener('click', closeViewer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && viewerOverlay.classList.contains('is-open')) closeViewer();
  });

  window.openViewer = openViewer;
})();

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
