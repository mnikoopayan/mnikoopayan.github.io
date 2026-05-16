/* ═══════════════════════════════════════════════════════════
   PARTICLE BACKGROUND
═══════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.8 + 0.4;
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96,165,250,${this.a})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 90 }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(96,165,250,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    animId = requestAnimationFrame(loop);
  }

  init();
  loop();
  window.addEventListener('resize', () => { resize(); });
})();

/* ═══════════════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════════════ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'intelligent ML systems',
    'deep learning pipelines',
    'agentic AI workflows',
    'probabilistic forecasters',
    'RAG-powered applications',
    'data-driven solutions',
  ];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 2000); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 45 : 80);
  }
  tick();
})();

/* ═══════════════════════════════════════════════════════════
   NAVBAR SCROLL + ACTIVE LINK
═══════════════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  // Hamburger
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('nav-links');
  btn.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
})();

/* ═══════════════════════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  let fired = false;

  function animateAll() {
    if (fired) return;
    const hero = document.getElementById('hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      fired = true;
      counters.forEach(el => {
        const target = +el.dataset.target;
        const duration = 1800;
        const start = performance.now();
        function step(now) {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(ease * target);
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  }
  window.addEventListener('scroll', animateAll, { passive: true });
  animateAll();
})();

/* ═══════════════════════════════════════════════════════════
   SKILL BARS ANIMATION
═══════════════════════════════════════════════════════════ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill[data-width]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
})();

/* ═══════════════════════════════════════════════════════════
   TIMELINE REVEAL
═══════════════════════════════════════════════════════════ */
(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 120);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => observer.observe(item));
})();

/* ═══════════════════════════════════════════════════════════
   RADAR CHART
═══════════════════════════════════════════════════════════ */
(function initRadar() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;

  let chartCreated = false;
  function createChart() {
    if (typeof Chart === 'undefined') { setTimeout(createChart, 100); return; }
    if (chartCreated) return;
    chartCreated = true;
    new Chart(canvas, {
        type: 'radar',
        data: {
          labels: [
            'Deep Learning',
            'Time-Series\nForecasting',
            'Agentic AI\n& LLMs',
            'Data\nEngineering',
            'Statistical\nAnalysis',
            'ML\nDeployment',
            'Research &\nPublications',
          ],
          datasets: [{
            label: 'Proficiency',
            data: [94, 96, 88, 90, 87, 83, 90],
            backgroundColor: 'rgba(37,99,235,0.18)',
            borderColor: 'rgba(96,165,250,0.9)',
            borderWidth: 2,
            pointBackgroundColor: '#60a5fa',
            pointBorderColor: '#fff',
            pointRadius: 5,
            pointHoverRadius: 7,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          animation: { duration: 1400, easing: 'easeInOutQuart' },
          scales: {
            r: {
              min: 0, max: 100,
              ticks: {
                stepSize: 20,
                color: 'rgba(148,163,184,0.6)',
                backdropColor: 'transparent',
                font: { size: 10 },
              },
              grid: { color: 'rgba(255,255,255,0.07)' },
              angleLines: { color: 'rgba(255,255,255,0.07)' },
              pointLabels: {
                color: '#94a3b8',
                font: { size: 11, family: 'Inter' },
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ` ${ctx.raw}%`,
              },
              backgroundColor: 'rgba(10,15,30,0.9)',
              borderColor: 'rgba(37,99,235,0.5)',
              borderWidth: 1,
              titleColor: '#fff',
              bodyColor: '#94a3b8',
            },
          },
        },
      });
  }
  // Create chart after page load
  if (document.readyState === 'complete') {
    createChart();
  } else {
    window.addEventListener('load', createChart);
  }
})();

/* ═══════════════════════════════════════════════════════════
   SMOOTH SCROLL FOR ANCHOR LINKS
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   CARD HOVER GLOW EFFECT
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.project-card, .award-card, .timeline-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(37,99,235,0.08) 0%, transparent 60%), var(--navy-card)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});
