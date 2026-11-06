const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.nav-list a');
const themeToggle = document.querySelector('.theme-toggle');
const backToTopButton = document.getElementById('back-to-top');
const revealElements = document.querySelectorAll('.reveal');
const sections = document.querySelectorAll('main section[id]');
const typedText = document.querySelector('.typed-text');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

function setTheme(theme) {
  const isLight = theme === 'light';
  body.classList.toggle('light-theme', isLight);
  themeToggle.innerHTML = isLight ? '<span aria-hidden="true">🌙</span>' : '<span aria-hidden="true">☀️</span>';
  themeToggle.setAttribute('aria-label', isLight ? 'Ativar tema escuro' : 'Ativar tema claro');
  localStorage.setItem('portfolio-theme', theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  const theme = savedTheme || 'dark';
  setTheme(theme);
}

function closeMenu() {
  if (!siteNav || !navToggle) {
    return;
  }

  siteNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  body.classList.remove('nav-open');
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    body.classList.toggle('nav-open', isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 760) {
        closeMenu();
      }
    });
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
    setTheme(nextTheme);
  });
}

function updateActiveLink() {
  const scrollPosition = window.scrollY + 120;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-list a[href="#${id}"]`);

    if (!link) {
      return;
    }

    if (scrollPosition >= top && scrollPosition < bottom) {
      navLinks.forEach((item) => {
        item.classList.remove('active');
        item.setAttribute('aria-current', 'false');
      });

      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function typeText(element) {
  if (!element || prefersReducedMotion) {
    if (element) {
      element.textContent = element.dataset.text || '';
    }
    return;
  }

  const text = element.dataset.text || '';
  let charIndex = 0;

  element.textContent = '';

  const typingInterval = window.setInterval(() => {
    element.textContent = text.slice(0, charIndex + 1);
    charIndex += 1;

    if (charIndex >= text.length) {
      window.clearInterval(typingInterval);
    }
  }, 32);
}

if (typeof IntersectionObserver !== 'undefined') {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

function handleScroll() {
  if (backToTopButton) {
    backToTopButton.classList.toggle('visible', window.scrollY > 420);
  }
  updateActiveLink();
}

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    const scrollOptions = prefersReducedMotion ? { top: 0 } : { top: 0, behavior: 'smooth' };
    window.scrollTo(scrollOptions);
  });
}

if (!isTouchDevice && !prefersReducedMotion) {
  const depthTargets = document.querySelectorAll('.skill-depth');

  depthTargets.forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty('--x', `${x}%`);
      element.style.setProperty('--y', `${y}%`);
      element.style.transform = 'translateY(-4px) scale(1.01)';
    });

    element.addEventListener('pointerleave', () => {
      element.style.transform = '';
    });
  });
}

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('load', () => {
  updateActiveLink();
  handleScroll();
  typeText(typedText);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

initTheme();
