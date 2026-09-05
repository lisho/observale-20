document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
  initRevealOnScroll();
  initThemeToggle();
  initNavbar();
  initTabs();
  initDocumentExplorer();
  initOrganicAmbientBackground();
  initScrollParallax();
  initGerminaModal();
});

/* ==========================================================================
   1. FONDO ORGÁNICO DINÁMICO (TRANSICIÓN DE COLOR AL HACER SCROLL)
   ========================================================================== */
function initOrganicAmbientBackground() {
  const meshBg = document.getElementById('ambientMeshBg');
  if (!meshBg) return;

  const sectionColorMap = {
    'home': {
      light: ['rgba(139, 17, 62, 0.15)', 'rgba(15, 118, 110, 0.14)', 'rgba(30, 41, 59, 0.08)'],
      dark:  ['rgba(230, 92, 130, 0.22)', 'rgba(45, 212, 191, 0.18)', 'rgba(15, 23, 42, 0.35)']
    },
    'about': {
      light: ['rgba(139, 17, 62, 0.10)', 'rgba(15, 118, 110, 0.15)', 'rgba(203, 213, 225, 0.2)'],
      dark:  ['rgba(230, 92, 130, 0.16)', 'rgba(45, 212, 191, 0.22)', 'rgba(26, 34, 54, 0.4)']
    },
    'features': {
      light: ['rgba(15, 118, 110, 0.18)', 'rgba(180, 83, 9, 0.12)', 'rgba(139, 17, 62, 0.08)'],
      dark:  ['rgba(45, 212, 191, 0.25)', 'rgba(245, 158, 11, 0.16)', 'rgba(230, 92, 130, 0.12)']
    },
    'experience': {
      light: ['rgba(30, 41, 59, 0.12)', 'rgba(139, 17, 62, 0.15)', 'rgba(15, 118, 110, 0.12)'],
      dark:  ['rgba(15, 23, 42, 0.4)', 'rgba(230, 92, 130, 0.2)', 'rgba(45, 212, 191, 0.16)']
    },
    'portfolio': {
      light: ['rgba(180, 83, 9, 0.12)', 'rgba(15, 118, 110, 0.15)', 'rgba(139, 17, 62, 0.1)'],
      dark:  ['rgba(245, 158, 11, 0.18)', 'rgba(45, 212, 191, 0.2)', 'rgba(230, 92, 130, 0.15)']
    },
    'publicaciones': {
      light: ['rgba(15, 118, 110, 0.14)', 'rgba(230, 92, 130, 0.09)', 'rgba(241, 245, 249, 0.3)'],
      dark:  ['rgba(45, 212, 191, 0.2)', 'rgba(230, 92, 130, 0.14)', 'rgba(21, 29, 48, 0.5)']
    },
    'contact': {
      light: ['rgba(15, 118, 110, 0.2)', 'rgba(139, 17, 62, 0.18)', 'rgba(11, 17, 32, 0.25)'],
      dark:  ['rgba(45, 212, 191, 0.26)', 'rgba(230, 92, 130, 0.24)', 'rgba(10, 15, 29, 0.55)']
    }
  };

  function applyColors(sectionId) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const profile = sectionColorMap[sectionId] || sectionColorMap['home'];
    const colors = isDark ? profile.dark : profile.light;

    document.documentElement.style.setProperty('--ambient-color-1', colors[0]);
    document.documentElement.style.setProperty('--ambient-color-2', colors[1]);
    document.documentElement.style.setProperty('--ambient-color-3', colors[2]);
  }

  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        applyColors(id);
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '-10% 0px -40% 0px'
  });

  sections.forEach(s => sectionObserver.observe(s));

  // Escuchar cambios de tema para re-aplicar
  const themeToggle = document.getElementById('themeToggleBtn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTimeout(() => {
        let activeSection = 'home';
        sections.forEach(s => {
          const rect = s.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.2) {
            activeSection = s.getAttribute('id');
          }
        });
        applyColors(activeSection);
      }, 50);
    });
  }
}

/* ==========================================================================
   2. MOTOR DE PARALLAX SUAVE AL HACER SCROLL
   ========================================================================== */
function initScrollParallax() {
  const heroBg = document.getElementById('heroParallaxBg');
  const heroContent = document.querySelector('.hero-creative-content');
  const euBanner = document.querySelector('.original-eu-banner');
  const aboutPhoto = document.querySelector('.about-photo-card');

  let ticking = false;
  let lastScrollY = window.scrollY;

  function updateParallax() {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;

    // Solo calcular si estamos en rango visible del hero
    if (scrollY <= heroHeight * 1.3) {
      if (heroBg) {
        heroBg.style.transform = `translate3d(0, ${scrollY * 0.32}px, 0)`;
      }
      if (heroContent) {
        const contentOffset = scrollY * -0.14;
        const opacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.85)));
        heroContent.style.transform = `translate3d(0, ${contentOffset}px, 0)`;
        heroContent.style.opacity = opacity.toFixed(2);
      }
      if (euBanner) {
        euBanner.style.transform = `translate3d(0, ${scrollY * 0.16}px, 0)`;
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // Efecto 3D Tilt interactivo en la imagen de "¿Qué es?"
  if (aboutPhoto) {
    aboutPhoto.addEventListener('mousemove', (e) => {
      const rect = aboutPhoto.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      aboutPhoto.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    aboutPhoto.addEventListener('mouseleave', () => {
      aboutPhoto.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }
}

/* ==========================================================================
   1. BARRA DE PROGRESO DE SCROLL DINÁMICO
   ========================================================================== */
function initScrollProgressBar() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (height > 0) ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  });
}

/* ==========================================================================
   2. ANIMACIÓN REVEAL ON SCROLL REVERSIBLE Y DINÁMICA
   ========================================================================== */
function initRevealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-stagger-children');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
      } else {
        // Al salir de pantalla, revierte el estado para re-ejecutar en el próximo scroll
        entry.target.classList.remove('reveal-visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. MODO CLARO / OSCURO ACCESIBLE
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('observale-theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('observale-theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggleBtn i');
  if (!icon) return;
  if (theme === 'dark') {
    icon.className = 'fa fa-sun-o';
    icon.setAttribute('title', 'Cambiar a modo claro');
  } else {
    icon.className = 'fa fa-moon-o';
    icon.setAttribute('title', 'Cambiar a modo oscuro');
  }
}

/* ==========================================================================
   4. NAVBAR STICKY & MENÚ MÓVIL
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.modern-navbar');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }
}

/* ==========================================================================
   5. PESTAÑAS INTERACTIVAS (EJES)
   ========================================================================== */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn-modern');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. REPOSITORIO DE DOCUMENTOS: ANIMACIÓN DE MAZO Y FILTROS EN TIEMPO REAL
   ========================================================================== */
function initDocumentExplorer() {
  const grid = document.querySelector('.docs-innovative-grid');
  const filterBtns = document.querySelectorAll('.doc-pill-btn');
  const searchInput = document.getElementById('docSearchInput');
  const docCards = document.querySelectorAll('.doc-modern-card');

  if (!docCards.length) return;

  function dealVisibleCards() {
    let visibleIndex = 0;
    docCards.forEach(card => {
      if (card.style.display !== 'none') {
        card.classList.remove('deck-card-dealt');
        card.style.transitionDelay = `${(visibleIndex * 0.08).toFixed(2)}s`;
        void card.offsetWidth;
        card.classList.add('deck-card-dealt');
        visibleIndex++;
      }
    });
  }

  // Observer reversible para activar y recoger el mazo en scroll
  if (grid) {
    const deckObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          dealVisibleCards();
        } else {
          // Al salir de la vista, las cartas vuelven al mazo apilado
          docCards.forEach(card => {
            card.classList.remove('deck-card-dealt');
          });
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    deckObserver.observe(grid);
  }

  function filterDocuments() {
    const activeBtn = document.querySelector('.doc-pill-btn.active');
    const selectedCategory = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    let visibleIndex = 0;
    docCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const text = card.textContent.toLowerCase();

      const matchesCategory = (selectedCategory === 'all' || category === selectedCategory);
      const matchesSearch = (!query || text.includes(query));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.classList.remove('deck-card-dealt');
        card.style.transitionDelay = `${(visibleIndex * 0.08).toFixed(2)}s`;
        void card.offsetWidth;
        card.classList.add('deck-card-dealt');
        visibleIndex++;
      } else {
        card.style.display = 'none';
        card.classList.remove('deck-card-dealt');
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterDocuments();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterDocuments);
  }
}

/* ==========================================================================
   7. MODAL LIGHTBOX DE PONENCIAS GERMINA
   ========================================================================== */
function initGerminaModal() {
  const modal = document.getElementById('germinaModal');
  if (!modal) return;

  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const closeBtn = modal.querySelector('.modal-close-btn');
  const backdrop = modal.querySelector('.modal-backdrop');
  const triggers = document.querySelectorAll('.open-germina-modal');

  function openModal(imgSrc, title, desc) {
    if (modalImg) modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const img = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title') || 'Ponencia Magistral';
      const desc = btn.getAttribute('data-desc') || '';
      if (img) {
        openModal(img, title, desc);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
