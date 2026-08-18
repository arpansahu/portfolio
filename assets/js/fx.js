/* ---------- Scroll progress bar ---------- */
const progressBar = document.getElementById('page-progress');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* ---------- Custom cursor (desktop only) ---------- */
const isTouch = matchMedia('(pointer: coarse)').matches;
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (!isTouch && cursorDot && cursorRing) {
  document.body.classList.add('has-custom-cursor');
  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .project-card').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
  });
}

/* ---------- Hero particle field (lightweight canvas, no external 3D libs) ---------- */
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;
  let particles = [];
  let w, h;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const particleCount = isTouch ? 45 : 90;

  function resize() {
    w = canvas.width = hero.clientWidth;
    h = canvas.height = hero.clientHeight;
  }

  function initParticles() {
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  let mouseX = null, mouseY = null;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => { mouseX = null; mouseY = null; });

  function step() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      if (mouseX !== null) {
        const dx = p.x - mouseX, dy = p.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          const force = (140 - dist) / 140 * 0.03;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124, 92, 255, 0.75)';
      ctx.fill();
    }

    // connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 110) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.18 * (1 - dist / 110)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  initParticles();
  window.addEventListener('resize', () => { resize(); initParticles(); });
  step();
}

/* ---------- GSAP scroll-reveal animations ---------- */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.fade-section').forEach((section) => {
    gsap.from(section.querySelectorAll(':scope > h2, :scope > p, :scope > .stack-badges, :scope > .contact-form'), {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 80%' },
    });
  });

  gsap.utils.toArray('.tl-item').forEach((item, i) => {
    gsap.from(item, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      delay: i * 0.05,
      ease: 'power2.out',
      scrollTrigger: { trigger: item, start: 'top 85%' },
    });
  });

  gsap.set('.project-card', { opacity: 0, y: 30 });
  function setupProjectAnim() {
    ScrollTrigger.batch('.project-card', {
      start: 'top 88%',
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }),
      once: true,
    });
  }
  if (document.querySelectorAll('.project-card').length) {
    setupProjectAnim();
  } else {
    document.addEventListener('projects:rendered', () => {
      gsap.set('.project-card', { opacity: 0, y: 30 });
      setupProjectAnim();
      ScrollTrigger.refresh();
    });
  }

  gsap.from('.hero-inner > *', {
    y: 24,
    opacity: 0,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power2.out',
    delay: 0.15,
  });
}
