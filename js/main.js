gsap.registerPlugin(ScrollTrigger);

/* ── Header: transparent → white on scroll ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Hero entrance animation ── */
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTl
  .to('.hero-label', { opacity: 1, y: 0, duration: 0.8 }, 0.2)
  .to('.name-line', {
    opacity: 1,
    y: '0%',
    duration: 0.9,
    stagger: 0.12,
  }, 0.5)
  .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.8 }, 1.1)
  .to('.hero-scroll',  { opacity: 1, duration: 0.6 }, 1.5);

/* ── Scroll-triggered section reveals ── */
gsap.utils.toArray('.section-head, .career-item').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    }
  );
});

/* ── Works cards: staggered reveal ── */
function revealVisibleCards() {
  const visible = document.querySelectorAll('.work-card.visible');
  gsap.fromTo(visible,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
  );
}

/* ── Tab filter ── */
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

/* Initial reveal for all cards (all tab active by default) */
ScrollTrigger.create({
  trigger: '#worksGrid',
  start: 'top 85%',
  once: true,
  onEnter: () => {
    cards.forEach(c => c.classList.add('visible'));
    revealVisibleCards();
  }
});

/* ── Tool bars: animate width on scroll ── */
ScrollTrigger.create({
  trigger: '.tools-list',
  start: 'top 85%',
  once: true,
  onEnter: () => {
    document.querySelectorAll('.tool-fill').forEach(bar => {
      const level = bar.dataset.level;
      bar.style.width = level + '%';
    });
  }
});

/* ── About section elements ── */
gsap.utils.toArray('.about-headline, .about-desc, .skills-wrap').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity: 0, y: 25 },
    {
      opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    }
  );
});
