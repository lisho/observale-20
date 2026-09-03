/**
 * OBSERVALE - Espacio Estadístico e Interactividad
 * Observatorio Municipal para la Inclusión Social de León
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initCounters();
  initCharts();
  initDocumentExplorer();
  initTabs();
  initDataExports();
});

/* ==========================================================================
   1. MODO CLARO / OSCURO ACCESIBLE
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
    updateChartsTheme(newTheme);
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
   2. NAVBAR STICKY & MENÚ MÓVIL
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

    // Close mobile menu on clicking any link
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
   3. ANIMACIÓN DE CONTADORES NUMÉRICOS (INTERSECTION OBSERVER)
   ========================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('.kpi-counter');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target') || '0');
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        animateValue(el, 0, target, 1600, decimals);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach(el => observer.observe(el));
}

function animateValue(obj, start, end, duration, decimals) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Easing out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = (easeProgress * (end - start) + start).toFixed(decimals);
    obj.textContent = currentVal;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = end.toFixed(decimals);
    }
  };
  window.requestAnimationFrame(step);
}

/* ==========================================================================
   4. GRÁFICOS INTERACTIVOS (CHART.JS)
   ========================================================================== */
let exclusionChartInstance = null;
let digitalDivideChartInstance = null;

function initCharts() {
  if (typeof Chart === 'undefined') return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  // Chart 1: Dimensiones de la Exclusión Social en León (Radar / Polar)
  const ctx1 = document.getElementById('chartExclusionDimensions')?.getContext('2d');
  if (ctx1) {
    exclusionChartInstance = new Chart(ctx1, {
      type: 'radar',
      data: {
        labels: [
          'Vulnerabilidad Laboral',
          'Acceso a Vivienda',
          'Brecha Digital',
          'Salud y Dependencia',
          'Aislamiento Relacional',
          'Nivel Formativo'
        ],
        datasets: [{
          label: 'Municipio de León (Media)',
          data: [68, 54, 72, 42, 48, 59],
          fill: true,
          backgroundColor: 'rgba(122, 12, 46, 0.22)',
          borderColor: '#8B1E3F',
          pointBackgroundColor: '#8B1E3F',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#8B1E3F',
          borderWidth: 2
        }, {
          label: 'Zonas de Intervención Prioritaria',
          data: [84, 76, 88, 62, 69, 78],
          fill: true,
          backgroundColor: 'rgba(15, 76, 129, 0.18)',
          borderColor: '#0f4c81',
          pointBackgroundColor: '#0f4c81',
          pointBorderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: gridColor },
            grid: { color: gridColor },
            pointLabels: {
              color: textColor,
              font: { size: 11, weight: '600' }
            },
            ticks: {
              backdropColor: 'transparent',
              color: textColor,
              stepSize: 20
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { weight: '600' } }
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${context.raw} pts (sobre 100)`
            }
          }
        }
      }
    });
  }

  // Chart 2: Brecha Digital por Tramos de Edad
  const ctx2 = document.getElementById('chartDigitalDivide')?.getContext('2d');
  if (ctx2) {
    digitalDivideChartInstance = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['16-29 años', '30-49 años', '50-64 años', '65-74 años', '75+ años'],
        datasets: [{
          label: 'Dificultad trámites online (%)',
          data: [14.2, 28.6, 52.4, 71.8, 86.5],
          backgroundColor: '#8B1E3F',
          borderRadius: 6
        }, {
          label: 'Carencia de equipamiento PC/Fibra (%)',
          data: [8.5, 16.2, 34.0, 58.7, 74.2],
          backgroundColor: '#0f4c81',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { weight: '600' } }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor, callback: v => v + '%' },
            suggestedMax: 100
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { weight: '600' } }
          }
        }
      }
    });
  }

  // Event listeners for chart filter buttons
  document.querySelectorAll('[data-chart-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parentCard = btn.closest('.chart-card');
      parentCard.querySelectorAll('[data-chart-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterMode = btn.getAttribute('data-chart-filter');
      if (btn.closest('#chartCardExclusion') && exclusionChartInstance) {
        if (filterMode === 'global') {
          exclusionChartInstance.data.datasets[0].hidden = false;
          exclusionChartInstance.data.datasets[1].hidden = false;
        } else if (filterMode === 'municipio') {
          exclusionChartInstance.data.datasets[0].hidden = false;
          exclusionChartInstance.data.datasets[1].hidden = true;
        } else if (filterMode === 'edis') {
          exclusionChartInstance.data.datasets[0].hidden = true;
          exclusionChartInstance.data.datasets[1].hidden = false;
        }
        exclusionChartInstance.update();
      }
    });
  });
}

function updateChartsTheme(theme) {
  if (!exclusionChartInstance && !digitalDivideChartInstance) return;
  const isDark = theme === 'dark';
  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  [exclusionChartInstance, digitalDivideChartInstance].forEach(chart => {
    if (!chart) return;
    if (chart.options.plugins?.legend?.labels) {
      chart.options.plugins.legend.labels.color = textColor;
    }
    if (chart.options.scales?.r) {
      chart.options.scales.r.pointLabels.color = textColor;
      chart.options.scales.r.grid.color = gridColor;
      chart.options.scales.r.ticks.color = textColor;
    }
    if (chart.options.scales?.x) {
      chart.options.scales.x.ticks.color = textColor;
    }
    if (chart.options.scales?.y) {
      chart.options.scales.y.ticks.color = textColor;
      chart.options.scales.y.grid.color = gridColor;
    }
    chart.update();
  });
}

/* ==========================================================================
   5. REPOSITORIO DOCUMENTAL CON BÚSQUEDA Y FILTRADO EN VIVO
   ========================================================================== */
function initDocumentExplorer() {
  const filterBtns = document.querySelectorAll('.doc-filter-btn');
  const searchInput = document.getElementById('docSearchInput');
  const docCards = document.querySelectorAll('.doc-card');

  if (!docCards.length) return;

  function filterDocuments() {
    const activeBtn = document.querySelector('.doc-filter-btn.active');
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

/* ==========================================================================
   6. PESTAÑAS INTERACTIVAS PARA EJES DE DESARROLLO
   ========================================================================== */
function initTabs() {
  const tabBtns = document.querySelectorAll('.feature-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. EXPORTACIÓN DE DATOS (CSV Y METODOLOGÍA)
   ========================================================================== */
function initDataExports() {
  const btnExportCsv = document.getElementById('btnExportCsv');
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', (e) => {
      e.preventDefault();
      const csvData = [
        ['Dimension', 'Media_Municipio_Leon', 'Zonas_Prioritarias_EDIS', 'Unidad'],
        ['Vulnerabilidad Laboral', '68.0', '84.0', 'Indice 0-100'],
        ['Acceso a Vivienda', '54.0', '76.0', 'Indice 0-100'],
        ['Brecha Digital', '72.0', '88.0', 'Indice 0-100'],
        ['Salud y Dependencia', '42.0', '62.0', 'Indice 0-100'],
        ['Aislamiento Relacional', '48.0', '69.0', 'Indice 0-100'],
        ['Nivel Formativo', '59.0', '78.0', 'Indice 0-100']
      ];

      const csvContent = "data:text/csv;charset=utf-8," + 
        csvData.map(row => row.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "observale_leon_indicadores_exclusion.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}
