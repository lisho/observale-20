/**
 * OBSERVALE - Sistema Interactivo y Dinamismo de Scroll
 * Observatorio Municipal para la Inclusión Social de León
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
  initRevealOnScroll();
  initThemeToggle();
  initNavbar();
  initTabs();
  initDocumentExplorer();
});

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
   2. ANIMACIÓN REVEAL ON SCROLL
   ========================================================================== */
function initRevealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
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
   6. REPOSITORIO DE DOCUMENTOS: FILTROS Y BÚSQUEDA EN TIEMPO REAL
   ========================================================================== */
function initDocumentExplorer() {
  const filterBtns = document.querySelectorAll('.doc-pill-btn');
  const searchInput = document.getElementById('docSearchInput');
  const docCards = document.querySelectorAll('.doc-modern-card');

  if (!docCards.length) return;

  function filterDocuments() {
    const activeBtn = document.querySelector('.doc-pill-btn.active');
    const selectedCategory = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    docCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const text = card.textContent.toLowerCase();

      const matchesCategory = (selectedCategory === 'all' || category === selectedCategory);
      const matchesSearch = (!query || text.includes(query));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
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
