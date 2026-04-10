/* ═══════════════════════════════════════════════════════
   Mohammed Essam — Neo-Brutalist Portfolio
   Main JavaScript
═══════════════════════════════════════════════════════ */

'use strict';

// ─── Hero Canvas: Animated Abstract Shapes ───────────────
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animId;
  let shapes = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  const COLORS = ['#FFE600', '#FF5C00', '#FF2D78', '#00E5FF', '#00FF88', '#7C3AED'];

  function randomBetween(a, b) {
    return Math.random() * (b - a) + a;
  }

  function createShape() {
    return {
      x:        randomBetween(0, canvas.width),
      y:        randomBetween(0, canvas.height),
      vx:       randomBetween(-0.4, 0.4),
      vy:       randomBetween(-0.4, 0.4),
      size:     randomBetween(20, 80),
      rotation: randomBetween(0, Math.PI * 2),
      rotSpeed: randomBetween(-0.008, 0.008),
      color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      type:     Math.random() > 0.5 ? 'rect' : 'circle',
      alpha:    randomBetween(0.04, 0.14),
    };
  }

  function initShapes() {
    shapes = [];
    const count = Math.min(22, Math.floor((canvas.width * canvas.height) / 30000));
    for (let i = 0; i < count; i++) {
      shapes.push(createShape());
    }
  }

  function drawShape(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rotation);
    ctx.globalAlpha = s.alpha;
    ctx.strokeStyle = s.color;
    ctx.fillStyle   = s.color;
    ctx.lineWidth   = 2;

    if (s.type === 'rect') {
      // Brutalist rectangle
      ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size);
      if (Math.random() < 0.01) {
        ctx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size);
        ctx.globalAlpha = s.alpha * 0.2;
      }
    } else {
      // Circle
      ctx.beginPath();
      ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function updateShape(s) {
    s.x += s.vx;
    s.y += s.vy;
    s.rotation += s.rotSpeed;

    // Wrap around edges
    const padding = s.size;
    if (s.x < -padding) s.x = canvas.width  + padding;
    if (s.x > canvas.width  + padding) s.x = -padding;
    if (s.y < -padding) s.y = canvas.height + padding;
    if (s.y > canvas.height + padding) s.y = -padding;
  }

  // Mouse interaction
  let mouse = { x: -1000, y: -1000 };
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function applyMouseRepel(s) {
    const dx   = s.x - mouse.x;
    const dy   = s.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120 && dist > 0) {
      const force = (120 - dist) / 120 * 0.8;
      s.vx += (dx / dist) * force;
      s.vy += (dy / dist) * force;
      // Cap velocity
      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      if (speed > 2) {
        s.vx = (s.vx / speed) * 2;
        s.vy = (s.vy / speed) * 2;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(s => {
      applyMouseRepel(s);
      updateShape(s);
      drawShape(s);
    });
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    initShapes();
  });

  resize();
  initShapes();
  draw();
})();


// ─── Navbar: Scroll Effect + Active Link ─────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top    = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    updateNavbar();
    updateActiveLink();
  }, { passive: true });

  updateNavbar();
  updateActiveLink();
})();


// ─── Mobile Menu Toggle ───────────────────────────────────
(function initMobileMenu() {
  const btn        = document.getElementById('menu-btn');
  const menu       = document.getElementById('mobile-menu');
  const icon       = document.getElementById('menu-icon');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!btn || !menu) return;

  function toggleMenu(force) {
    const isOpen = force !== undefined ? force : !menu.classList.contains('open');
    if (isOpen) {
      menu.classList.remove('hidden');
      // Small tick to allow CSS transition
      requestAnimationFrame(() => menu.classList.add('open'));
    } else {
      menu.classList.remove('open');
      // Wait for CSS transition to finish before hiding
      menu.addEventListener('transitionend', () => {
        if (!menu.classList.contains('open')) menu.classList.add('hidden');
      }, { once: true });
    }
    icon.className = isOpen ? 'fas fa-times text-xl' : 'fas fa-bars text-xl';
  }

  btn.addEventListener('click', () => toggleMenu());

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      if (menu.classList.contains('open')) toggleMenu(false);
    }
  });
})();


// ─── Scroll Reveal Animations ─────────────────────────────
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseFloat(el.style.animationDelay) || 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay * 1000);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  });

  revealEls.forEach(el => observer.observe(el));
})();


// ─── Skill Bar Animations ─────────────────────────────────
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar  = entry.target;
        const fill = bar.querySelector('.bar-fill');
        const pct  = bar.dataset.pct || '0';
        if (fill) {
          setTimeout(() => {
            fill.style.width = pct + '%';
          }, 200);
        }
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();


// ─── Counter Animation for Hero Stats ────────────────────
(function initCounters() {
  const statItems = document.querySelectorAll('.stat-item');
  if (!statItems.length) return;

  function animateValue(el, start, end, duration) {
    let startTime = null;
    const suffix  = el.textContent.replace(/[0-9]/g, '').trim();

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
      el.textContent = Math.floor(eased * (end - start) + start) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl  = entry.target.querySelector('span:first-child');
        if (!numEl) return;

        const text   = numEl.textContent.trim();
        const num    = parseInt(text.replace(/\D/g, ''), 10);
        const suffix = text.replace(/[0-9]/g, '');

        if (!isNaN(num)) {
          animateValue(numEl, 0, num, 1500);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statItems.forEach(el => observer.observe(el));
})();


// ─── Portfolio Card Tilt Effect ───────────────────────────
(function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch

  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -5;
      const tiltY  = dx *  5;
      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) translateX(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, box-shadow 0.3s ease, border-color 0.3s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
})();


// ─── Smooth Scroll for All Anchor Links ──────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ─── Cursor Sparkle Effect (desktop) ─────────────────────
(function initSparkle() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const COLORS = ['#FFE600', '#FF5C00', '#FF2D78', '#00E5FF', '#00FF88'];
  let lastSparkle = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkle < 80) return;
    lastSparkle = now;

    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 6px;
      height: 6px;
      background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      border-radius: 0;
      transition: transform 0.4s ease, opacity 0.4s ease;
    `;
    document.body.appendChild(sparkle);

    requestAnimationFrame(() => {
      sparkle.style.transform = `translate(${-10 + Math.random() * 20}px, ${-20 - Math.random() * 30}px) rotate(45deg)`;
      sparkle.style.opacity   = '0';
    });

    setTimeout(() => sparkle.remove(), 500);
  });
})();


// ─── Upcoming Cards: Particle on Hover ───────────────────
(function initUpcomingCards() {
  const cards = document.querySelectorAll('.upcoming-card');
  if (!cards.length || window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Small shake animation
      card.style.transition = 'transform 0.05s ease';
      let count = 0;
      const shake = setInterval(() => {
        if (count >= 4) {
          clearInterval(shake);
          card.style.transform = '';
          return;
        }
        const dir = count % 2 === 0 ? 1 : -1;
        card.style.transform = `translateX(${dir * 2}px)`;
        count++;
      }, 50);
    });
  });
})();


// ─── Init: Noise Overlay ─────────────────────────────────
(function addNoiseOverlay() {
  const noise = document.createElement('div');
  noise.className = 'noise-overlay';
  document.body.appendChild(noise);
})();


// ─── Log ──────────────────────────────────────────────────
console.log('%c🚀 Mohammed Essam Portfolio', 'color:#FFE600;font-size:16px;font-weight:bold;');
console.log('%c📧 mohammedessam.web_growth@zohomail.com', 'color:#00E5FF;');
console.log('%c🌐 https://linktr.ee/Mohammed_Essam1', 'color:#00FF88;');
