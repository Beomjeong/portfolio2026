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
    title: '디아블로II 악마술사 출시기념 이벤트',
    sub: '적응형(PC/MO) 페이지·배너',
    contribution: '기여도: 디자인 100%',
    tools: ['tool-ps'],
    desc: '디아블로II 신규 클래스 악마술사 런칭 기념으로 진행한 PC방 이벤트 랜딩페이지 및 배너 디자인입니다.',
    views: [
      { label: 'PC ver', images: [
        'works/webpromo_diaII/dia_pc_01.jpg',
        'works/webpromo_diaII/dia_pc_02.jpg',
        'works/webpromo_diaII/dia_pc_03.jpg',
        'works/webpromo_diaII/dia_pc_04.jpg',
        'works/webpromo_diaII/dia_pc_05.jpg',
      ]},
      { label: 'MO ver', maxWidth: '720px', images: [
        'works/webpromo_diaII/dia_mo_01.jpg',
        'works/webpromo_diaII/dia_mo_02.jpg',
        'works/webpromo_diaII/dia_mo_03.jpg',
        'works/webpromo_diaII/dia_mo_04.jpg',
        'works/webpromo_diaII/dia_mo_05.jpg',
      ]},
      { label: 'Banner', type: 'banner', images: [
        'works/webpromo_diaII/banner_1.jpg',
        'works/webpromo_diaII/banner_2.jpg',
        'works/webpromo_diaII/banner_3.jpg',
        'works/webpromo_diaII/banner_4.png',
        'works/webpromo_diaII/banner_5.jpg',
        'works/webpromo_diaII/banner_6.jpg',
      ]},
    ],
  },
  'web-02': {
    type: 'viewer',
    cat: 'Web Promotion',
    title: '이환 그랜드 오픈 기념 이벤트',
    sub: '반응형 페이지·배너',
    contribution: '기여도: 디자인·퍼블리싱 100%',
    tools: ['tool-figma', 'tool-ps', 'tool-ai','tool-claude'],
    desc: '이환 그랜드 오픈 기념 PC방 이벤트 반응형 랜딩 페이지 및 배너 디자인입니다.',
    views: [
      { label: 'Landing Page', type: 'iframe', url: 'https://beomjeong.github.io/nte/' },
      { label: 'Banner', type: 'banner', images: [
        'works/webpromo_nte/banner_1.jpg',
        'works/webpromo_nte/banner_2.jpg',
        'works/webpromo_nte/banner_3.jpg',
        'works/webpromo_nte/banner_4.png',
        'works/webpromo_nte/banner_5.jpg',
        'works/webpromo_nte/banner_6.jpg',
      ]},
    ],
  },
  'web-03': {
    type: 'viewer',
    cat: 'Web Promotion',
    title: '카카오페이 첫 결제 할인 프로모션',
    sub: '반응형 페이지·배너',
    contribution: '기여도: 디자인·퍼블리싱 100%',
    tools: ['tool-figma', 'tool-ps','tool-blender','tool-claude'],
    desc: '2026년 06월 카카오페이 첫 결제 할인 프로모션 랜딩 페이지 및 배너 디자인입니다.',
    views: [
      { label: 'Landing Page', type: 'iframe', url: 'https://beomjeong.github.io/kakaopay_202606/' },
      { label: 'Banner', type: 'banner', images: [
        'works/webpromo_kakaopay/banner_1.jpg',
        'works/webpromo_kakaopay/banner_2.jpg',
        'works/webpromo_kakaopay/banner_3.jpg',
        'works/webpromo_kakaopay/banner_4.png',
        'works/webpromo_kakaopay/banner_5.png',
        'works/webpromo_kakaopay/banner_6.jpg',
      ]},
    ],
  },
  'web-04': {
    type: 'viewer',
    cat: 'Web Promotion',
    title: '명일방주: 앤드필드 PC방 플레이 이벤트',
    sub: '반응형 페이지·배너',
    contribution: '디자인·퍼블리싱 100%',
    tools: ['tool-figma', 'tool-ps', 'tool-ai', 'tool-claude'],
    desc: '명일방주: 앤드필드 PC방 플레이 이벤트 반응형 랜딩 페이지 및 배너 디자인입니다.',
    views: [
      { label: 'Landing Page', type: 'iframe', url: 'https://beomjeong.github.io/endfield/' },
      { label: 'Banner', type: 'banner', images: [
        'works/webpromo_endfield/banner_1.jpg',
        'works/webpromo_endfield/banner_2.jpg',
        'works/webpromo_endfield/banner_3.jpg',
        'works/webpromo_endfield/banner_4.jpg',
        'works/webpromo_endfield/banner_5.png',
        'works/webpromo_endfield/banner_6.jpg',
      ]},
    ],
  },
  'web-05': {
    type: 'viewer',
    cat: 'Web Promotion·Information',
    title: '피카플레이 QR로그인 이벤트',
    sub: '이벤트페이지',
    contribution: '디자인·퍼블리싱 100%',
    tools: ['tool-figma', 'tool-ps', 'tool-ai', 'tool-blender', 'tool-claude'],
    desc: '피카 PC방 QR로그인 혜택 및 피카플레이 마일리지 혜택 안내 페이지입니다.',
    views: [
      { label: 'Landing Page', type: 'iframe', url: 'https://beomjeong.github.io/mediaweb_qr_sign_in/' },
      { label: 'Banner', type: 'banner', images: [
        'works/webpromo_qr/banner_1.jpg',
        'works/webpromo_qr/banner_2.jpg',
        'works/webpromo_qr/banner_3.png',
        'works/webpromo_qr/banner_4.png',
        'works/webpromo_qr/banner_5.png',
        'works/webpromo_qr/banner_6.jpg',
      ]},
    ],
  },
  'web-06': {
    type: 'viewer',
    cat: 'Web Promotion',
    title: 'SOL: inchant 그랜드 론칭 기념 프로모션',
    sub: '반응형 페이지·배너',
    contribution: '디자인·퍼블리싱 100%',
    tools: ['tool-figma', 'tool-ps', 'tool-ai', 'tool-claude'],
    desc: 'SOL: inchant 론칭 기념 PC방 이벤트 반응형 랜딩페이지 및 배너입니다.',
    views: [
      { label: 'Landing Page', type: 'iframe', url: 'https://beomjeong.github.io/sol/' },
      { label: 'Banner', type: 'banner', images: [
        'works/webpromo_sol/banner_1.jpg',
        'works/webpromo_sol/banner_2.png',
        'works/webpromo_sol/banner_3.jpg',
        'works/webpromo_sol/banner_4.jpg',
        'works/webpromo_sol/banner_5.jpg',
        'works/webpromo_sol/banner_6.png',
      ]},
    ],
  },
  'web-07': {
    type: 'viewer',
    cat: 'Web Promotion',
    title: '한게임 포커 이벤트',
    sub: '반응형 페이지·배너',
    contribution: '디자인·퍼블리싱 100%',
    tools: ['tool-figma', 'tool-ps', 'tool-ai', 'tool-blender', 'tool-claude'],
    desc: '한게임 포커 PC방 이벤트 반응형 랜딩페이지 및 배너입니다.',
    views: [
      { label: 'Landing Page', type: 'iframe', url: '' },
      { label: 'Banner', type: 'banner', images: [] },
    ],
  },
  'web-08': {
    type: 'viewer',
    cat: 'Branding·Marketing',
    title: '병의원 마케팅 - 위례포에버의원',
    sub: '블로그 카드뉴스',
    contribution: '디자인·기획 100%',
    tools: ['tool-ai', 'tool-ps', 'tool-ae'],
    desc: '위례포에버의원 블로그 마케팅용 이미지카드입니다. \n원장님과 충분한 소통 후 위례포에버의원 브랜드 아이덴티티에 맞춰 기획, 카피라이팅, 디자인을 진행했습니다.',
    views: [
      { label: '병원 소개', type: 'cardnews', images: [
        'works/webpromo_forever/intro_1.jpg',
        'works/webpromo_forever/intro_2.jpg',
        'works/webpromo_forever/intro_3.jpg',
        'works/webpromo_forever/intro_4.jpg',
        'works/webpromo_forever/intro_5.jpg',
        'works/webpromo_forever/intro_6.jpg',
        'works/webpromo_forever/intro_7.jpg',
        'works/webpromo_forever/intro_8.jpg',
        'works/webpromo_forever/intro_9.jpg',
        'works/webpromo_forever/intro_10.jpg',
      ]},
      { label: '시술 소개', type: 'cardnews', images: [
        'works/webpromo_forever/onda_1.jpg',
        'works/webpromo_forever/onda_2.jpg',
        'works/webpromo_forever/onda_3.jpg',
        'works/webpromo_forever/onda_4.jpg',
        'works/webpromo_forever/onda_5.jpg',
      ]},
    ],
  },
  'web-09': {
    type: 'viewer',
    cat: 'Branding·Marketing',
    title: '병의원 마케팅 - 서울베스트치과',
    sub: '상세페이지',
    contribution: '디자인·기획 100%',
    tools: ['tool-ai', 'tool-ps', 'tool-ae'],
    desc: '서울베스트치과 블로그 마케팅용 치과소개 상세페이지 스타일 포스팅 이미지입니다. \n원장님의 니즈에 맞춰 서울베스트치과의 장점을 효과적으로 전달할 수 있도록 기획 및 디자인을 진행했습니다.',
    views: [
      { label: '임플란트', bg: '#ffffff', maxWidth: '680px', images: [
        'works/blog_seoulbest/impl_1.gif',
        'works/blog_seoulbest/impl_2.jpg',
        'works/blog_seoulbest/impl_3.gif',
        'works/blog_seoulbest/impl_4.jpg',
        'works/blog_seoulbest/impl_5.jpg',
        'works/blog_seoulbest/impl_6.jpg',
        'works/blog_seoulbest/impl_7.jpg',
        'works/blog_seoulbest/impl_8.jpg',
        'works/blog_seoulbest/impl_9.gif',
        'works/blog_seoulbest/impl_10.jpg',
        'works/blog_seoulbest/impl_11.jpg',
        'works/blog_seoulbest/impl_12.gif',
        'works/blog_seoulbest/impl_13.gif',
        'works/blog_seoulbest/impl_14.jpg',
        'works/blog_seoulbest/impl_15.jpg',
        'works/blog_seoulbest/impl_16.gif',
        'works/blog_seoulbest/impl_17.jpg',
        'works/blog_seoulbest/impl_18.gif',
        'works/blog_seoulbest/impl_19.jpg',
        'works/blog_seoulbest/impl_20.jpg',
        'works/blog_seoulbest/impl_21.gif',
        'works/blog_seoulbest/impl_22.jpg',
        'works/blog_seoulbest/footer_1.jpg',
        'works/blog_seoulbest/footer_2.gif',
        'works/blog_seoulbest/footer_3.gif',
        'works/blog_seoulbest/footer_4.gif',
        'works/blog_seoulbest/footer_5.gif',
        'works/blog_seoulbest/footer_6.gif',
        'works/blog_seoulbest/footer_7.jpg',
      ]},
      { label: '치아교정', bg: '#ffffff', maxWidth: '680px', images: [
        'works/blog_seoulbest/gyo_1.gif',
        'works/blog_seoulbest/gyo_2.png',
        'works/blog_seoulbest/gyo_3.gif',
        'works/blog_seoulbest/gyo_4.jpg',
        'works/blog_seoulbest/gyo_5.jpg',
        'works/blog_seoulbest/gyo_6.jpg',
        'works/blog_seoulbest/gyo_7.jpg',
        'works/blog_seoulbest/gyo_8.jpg',
        'works/blog_seoulbest/gyo_9.jpg',
        'works/blog_seoulbest/gyo_10.gif',
        'works/blog_seoulbest/gyo_11.jpg',
        'works/blog_seoulbest/gyo_12.jpg',
        'works/blog_seoulbest/gyo_13.jpg',
        'works/blog_seoulbest/gyo_14.jpg',
        'works/blog_seoulbest/gyo_15.jpg',
        'works/blog_seoulbest/gyo_16.gif',
        'works/blog_seoulbest/gyo_17.gif',
        'works/blog_seoulbest/gyo_18.gif',
        'works/blog_seoulbest/gyo_19.jpg',
        'works/blog_seoulbest/gyo_20.jpg',
        'works/blog_seoulbest/footer_1.jpg',
        'works/blog_seoulbest/footer_2.gif',
        'works/blog_seoulbest/footer_3.gif',
        'works/blog_seoulbest/footer_4.gif',
        'works/blog_seoulbest/footer_5.gif',
        'works/blog_seoulbest/footer_6.gif',
        'works/blog_seoulbest/footer_7.jpg',
      ]},
    ],
  },
  'video-01': { cat: 'Video',         title: 'Short Form 타이틀',   sub: 'Shorts / Reels', contribution: '기여도 100%', tools: ['tool-pr','tool-ae'] },
  'video-02': { cat: 'Video',         title: 'PR 영상 타이틀',      sub: 'PR Video',       contribution: '기여도 100%', tools: ['tool-pr','tool-lr'] },
  '3d-01':    { cat: '3D',            title: '3D 에셋 타이틀',      sub: 'Blender',        contribution: '기여도 100%', tools: ['tool-blender'] },
  'print-01': {
    type: 'viewer',
    cat: 'Print Design',
    title: '양양 스파리조트 프로모션 포스터',
    sub: '프로모션 포스터',
    contribution: '디자인·기획 100%',
    tools: ['tool-ai', 'tool-ps', 'tool-lr'],
    desc: '양양 스파리조트 홍보용 프로모션 포스터 시리즈입니다.',
    views: [
      { label: '포스터', type: 'hanging', images: [
        'works/poster_resort/poster_01.jpg',
        'works/poster_resort/poster_02.jpg',
        'works/poster_resort/poster_03.jpg',
        'works/poster_resort/poster_04.jpg',
        'works/poster_resort/poster_05.jpg',
      ]},
    ],
  },
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
  const viewerPanel   = document.getElementById('viewerPanel');
  const viewerToggle  = document.getElementById('viewerToggle');
  const viewerCatEl   = document.getElementById('viewerCat');
  const viewerTitleEl = document.getElementById('viewerTitle');
  const viewerSubEl   = document.getElementById('viewerSub');
  const viewerContEl  = document.getElementById('viewerContrib');
  const viewerToolsEl = document.getElementById('viewerTools');
  const viewerDescEl  = document.getElementById('viewerDesc');
  const viewerTabsEl  = document.getElementById('viewerTabs');

  const viewerImgStack   = document.getElementById('viewerImgStack');
  const viewerImgWrap    = document.getElementById('viewerImgWrap');
  const viewerBannerGrid = document.getElementById('viewerBannerGrid');
  const viewerIframe     = document.getElementById('viewerIframe');

  let viewerTween = null;
  let switchTimer = null;
  let lastScrollTop = 0;
  let cardSTs = [];
  let hangingScrollHandler = null;

  function killCardSTs() {
    cardSTs.forEach(st => st.kill());
    cardSTs = [];
    viewerImgStack.style.paddingBottom = '';
    viewerImgStack.querySelectorAll('.cn-card').forEach(c => {
      gsap.set(c, { clearProps: 'scale,filter' });
    });
  }

  function killHangingST() {
    if (hangingScrollHandler) {
      viewerImgWrap.removeEventListener('scroll', hangingScrollHandler);
      hangingScrollHandler = null;
    }
    viewerImgStack.style.height = '';
    viewerImgStack.classList.remove('is-hanging');
  }

  function initHangingScroll() {
    const scene = viewerImgStack.querySelector('.hanging-scene');
    const track = viewerImgStack.querySelector('.hanging-track');
    if (!scene || !track) return;

    const setup = () => {
      const sceneH  = viewerImgWrap.clientHeight;
      const posterH = Math.max(200, Math.floor(sceneH * 0.62));
      const stringH = Math.max(50, Math.floor(sceneH * 0.10));

      scene.style.height = sceneH + 'px';
      scene.style.setProperty('--poster-h', posterH + 'px');
      scene.style.setProperty('--string-h', stringH + 'px');

      requestAnimationFrame(() => {
        const totalSlide = Math.max(0, track.scrollWidth - viewerImgWrap.clientWidth + 120);
        viewerImgStack.style.height = (sceneH + totalSlide) + 'px';

        hangingScrollHandler = () => {
          const x = Math.min(viewerImgWrap.scrollTop, totalSlide);
          gsap.set(track, { x: -x });
        };
        viewerImgWrap.addEventListener('scroll', hangingScrollHandler, { passive: true });
      });
    };

    const posters = Array.from(track.querySelectorAll('.hs-poster'));
    let remaining = posters.filter(img => !img.complete).length;
    if (remaining === 0) { setup(); return; }
    posters.forEach(img => {
      if (!img.complete) img.addEventListener('load', () => {
        if (--remaining === 0) setup();
      }, { once: true });
    });
  }

  function initCardnewsStack() {
    const cards = Array.from(viewerImgStack.querySelectorAll('.cn-card'));
    cards.forEach((card, i) => {
      if (i >= cards.length - 1) return;
      const st = ScrollTrigger.create({
        trigger: cards[i + 1],
        scroller: viewerImgWrap,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
        onUpdate(self) {
          const p = self.progress;
          gsap.set(card, {
            scale: 1 - p * 0.06,
            // filter: `brightness(${1 - p * 0.12})`
          });
        }
      });
      cardSTs.push(st);
    });
    const lastCard = cards[cards.length - 1];
    const applyPadding = () => {
      const deficit = viewerImgWrap.clientHeight - lastCard.offsetHeight;
      viewerImgStack.style.paddingBottom = Math.max(0, deficit) + 'px';
      ScrollTrigger.refresh();
    };
    const imgs = Array.from(viewerImgStack.querySelectorAll('img'));
    let remaining = imgs.filter(img => !img.complete).length;
    if (remaining === 0) { applyPadding(); return; }
    imgs.forEach(img => {
      if (!img.complete) img.addEventListener('load', () => {
        if (--remaining === 0) applyPadding();
      }, { once: true });
    });
  }



  function onViewerScroll(scrollTop) {
    if (scrollTop === lastScrollTop) return;
    if (viewerPanel.classList.contains('collapsed')) {
      if (scrollTop > lastScrollTop && scrollTop > 40) {
        viewerPanel.classList.add('scroll-hidden');
      } else {
        viewerPanel.classList.remove('scroll-hidden');
      }
    } else {
      viewerPanel.classList.remove('scroll-hidden');
    }
    lastScrollTop = scrollTop;
  }

  viewerImgWrap.addEventListener('scroll', () => {
    onViewerScroll(viewerImgWrap.scrollTop);
  }, { passive: true });

  viewerIframe.addEventListener('load', () => {
    lastScrollTop = 0;
    try {
      const iframeDoc = viewerIframe.contentDocument;
      const style = iframeDoc.createElement('style');
      style.textContent = 'html,body{scrollbar-width:none!important;scrollbar-gutter:auto!important;-ms-overflow-style:none!important;overscroll-behavior:none!important}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none!important;width:0!important}';
      iframeDoc.head.appendChild(style);

      viewerIframe.contentWindow.addEventListener('scroll', () => {
        if (viewerIframe.classList.contains('is-active')) {
          onViewerScroll(viewerIframe.contentWindow.scrollY);
        }
      }, { passive: true });
    } catch (e) {}
  });

  window.addEventListener('message', e => {
    if (e.data && e.data.type === 'scroll' && viewerIframe.classList.contains('is-active')) {
      onViewerScroll(e.data.y);
    }
  });

  function applyImgFadeIn() {
    viewerImgStack.querySelectorAll('img').forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        img.style.opacity = '1';
      } else {
        img.addEventListener('load',  () => { img.style.opacity = '1'; }, { once: true });
        img.addEventListener('error', () => { img.style.opacity = '1'; }, { once: true });
      }
    });
  }

  function setViewerImages(images, animate, maxWidth) {
    clearTimeout(switchTimer);
    viewerImgWrap.scrollTop = 0;
    const html = images.map((src, i) =>
      `<img src="${encodeURI(src)}" alt=""${i > 0 ? ' loading="lazy"' : ''}>`
    ).join('');
    if (animate) {
      viewerImgStack.style.opacity = '0';
      switchTimer = setTimeout(() => {
        viewerImgStack.style.maxWidth = maxWidth || '';
        viewerImgStack.style.margin   = maxWidth ? '0 auto' : '';
        viewerImgStack.innerHTML = html;
        viewerImgStack.style.opacity = '1';
        applyImgFadeIn();
      }, 200);
    } else {
      viewerImgStack.style.maxWidth = maxWidth || '';
      viewerImgStack.style.margin   = maxWidth ? '0 auto' : '';
      viewerImgStack.innerHTML = html;
      viewerImgStack.style.opacity = '1';
      applyImgFadeIn();
    }
  }

  function switchView(view, animate) {
    clearTimeout(switchTimer);
    killCardSTs();
    killHangingST();
    viewerImgStack.classList.remove('is-cardnews');
    viewerImgWrap.style.background = view.bg || '';
    viewerOverlay.classList.toggle('is-light-bg', !!view.bg);
    if (view.type === 'iframe') {
      viewerImgWrap.scrollTop = 0;
      viewerImgStack.classList.add('no-transition');
      viewerImgStack.style.opacity = '0';
      viewerImgStack.innerHTML = '';
      requestAnimationFrame(() => viewerImgStack.classList.remove('no-transition'));
      viewerBannerGrid.classList.remove('is-active');
      viewerIframe.src = view.url;
      viewerIframe.classList.add('is-active');
    } else if (view.type === 'banner') {
      viewerIframe.classList.remove('is-active');
      viewerIframe.src = '';
      viewerImgWrap.scrollTop = 0;
      viewerImgStack.classList.add('no-transition');
      viewerImgStack.style.opacity = '0';
      requestAnimationFrame(() => viewerImgStack.classList.remove('no-transition'));
      viewerBannerGrid.innerHTML = `<div class="banner-inner">${
        view.images.map(src => `<div class="banner-item"><img src="${encodeURI(src)}" alt="" loading="eager"></div>`).join('')
      }</div>`;
      viewerBannerGrid.classList.add('is-active');
    } else if (view.type === 'cardnews') {
      viewerIframe.classList.remove('is-active');
      viewerIframe.src = '';
      viewerBannerGrid.classList.remove('is-active');
      viewerImgWrap.scrollTop = 0;
      viewerImgStack.classList.add('is-cardnews');
      const loadCards = () => {
        viewerImgStack.innerHTML = view.images.map((src, i) =>
          `<div class="cn-card" style="z-index:${i + 1}"><img src="${encodeURI(src)}" alt=""${i > 0 ? ' loading="lazy"' : ''}></div>`
        ).join('');
        viewerImgStack.style.opacity = '1';
        applyImgFadeIn();
        initCardnewsStack();
      };
      if (animate) {
        viewerImgStack.style.opacity = '0';
        switchTimer = setTimeout(loadCards, 200);
      } else {
        loadCards();
      }
    } else if (view.type === 'hanging') {
      viewerIframe.classList.remove('is-active');
      viewerIframe.src = '';
      viewerBannerGrid.classList.remove('is-active');
      viewerImgStack.classList.add('is-hanging');
      const loadHanging = () => {
        viewerImgStack.innerHTML = `<div class="hanging-scene"><div class="hanging-track">${
          view.images.map(src => `<div class="hanging-set">
            <div class="hs-string hs-string-l"></div>
            <div class="hs-string hs-string-r"></div>
            <img class="hs-clip hs-clip-l" src="assets/clip.png" alt="">
            <img class="hs-clip hs-clip-r" src="assets/clip.png" alt="">
            <img class="hs-poster" src="${encodeURI(src)}" alt="">
          </div>`).join('')
        }</div></div>`;
        viewerImgStack.style.opacity = '1';
        applyImgFadeIn();
        initHangingScroll();
      };
      viewerImgWrap.scrollTop = 0;
      if (animate) {
        viewerImgStack.style.opacity = '0';
        switchTimer = setTimeout(loadHanging, 200);
      } else {
        loadHanging();
      }
    } else {
      viewerIframe.classList.remove('is-active');
      viewerIframe.src = '';
      viewerBannerGrid.classList.remove('is-active');
      viewerBannerGrid.scrollTop = 0;
      setViewerImages(view.images, animate, view.maxWidth);
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
        viewerPanel.classList.remove('scroll-hidden');
        lastScrollTop = 0;
        switchView(view, true);
      });
      viewerTabsEl.appendChild(btn);
    });

    viewerPanel.classList.remove('collapsed', 'scroll-hidden');
    lastScrollTop = 0;
    switchView(data.views[0], false);

    viewerOverlay.setAttribute('aria-hidden', 'false');
    viewerOverlay.classList.add('is-open');

    const scrollY = window.scrollY;
    ScrollTrigger.getAll().forEach(st => st.disable(false));
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    if (viewerTween) viewerTween.kill();
    gsap.set(viewerOverlay, { opacity: 0 });
    viewerTween = gsap.to(viewerOverlay, { opacity: 1, duration: 0.35, ease: 'power2.out' });
  }

  function closeViewer() {
    killCardSTs();
    killHangingST();
    if (viewerTween) viewerTween.kill();

    const scrollY = parseInt(document.body.style.top || '0') * -1;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo({ top: scrollY, behavior: 'instant' });
    ScrollTrigger.getAll().forEach(st => st.enable(false));

    viewerTween = gsap.to(viewerOverlay, {
      opacity: 0, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        viewerImgWrap.style.background = '';
        viewerOverlay.classList.remove('is-light-bg');
        viewerOverlay.classList.remove('is-open');
        viewerOverlay.setAttribute('aria-hidden', 'true');
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
