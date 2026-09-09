/**
 * dashboard-charts.js
 * Módulo de gráficos interactivos para el Panel de Control Estadístico de León (ObservaLE)
 * Datos oficiales extraídos de informeLeon.pdf (INE / Servicios Sociales 2025-2026)
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initDashboardCharts();
});

function initDashboardTabs() {
  const tabButtons = document.querySelectorAll('.dash-pill-btn');
  const panels = document.querySelectorAll('.dash-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        // Redimensionar gráficos contenidos en el panel activo
        setTimeout(() => {
          const canvases = targetPanel.querySelectorAll('canvas');
          canvases.forEach(canvas => {
            const chartInstance = Chart.getChart(canvas);
            if (chartInstance) {
              chartInstance.resize();
            }
          });
        }, 50);
      }
    });
  });
}

function initDashboardCharts() {
  if (typeof Chart === 'undefined') return;

  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

  const getThemeColors = () => {
    const dark = isDark();
    return {
      textColor: dark ? '#cbd5e1' : '#475569',
      gridColor: dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
      teal: '#0c6a63',
      tealLight: dark ? '#2dd4bf' : '#0f766e',
      carmine: '#8b113e',
      carmineLight: dark ? '#e65c82' : '#be123c',
      indigo: '#1e40af',
      indigoLight: dark ? '#60a5fa' : '#3b82f6',
      amber: '#b45309',
      amberLight: dark ? '#fbbf24' : '#d97706',
      red: '#dc2626',
      redLight: dark ? '#f87171' : '#ef4444'
    };
  };

  let colors = getThemeColors();

  // Gráfico 1: Renta Neta Evolución (Línea)
  const ctxRenta = document.getElementById('chartRentaEvolucion');
  let chartRenta;
  if (ctxRenta) {
    chartRenta = new Chart(ctxRenta, {
      type: 'line',
      data: {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        datasets: [
          {
            label: 'Renta Media Hogar (€)',
            data: [32003, 32074, 32677, 34279, 36332],
            borderColor: colors.tealLight,
            backgroundColor: 'rgba(12, 106, 99, 0.12)',
            fill: true,
            tension: 0.35,
            pointRadius: 6,
            pointHoverRadius: 8,
            borderWidth: 3,
            yAxisID: 'yHogar'
          },
          {
            label: 'Renta Media Persona (€)',
            data: [14286, 14434, 14842, 15737, 16689],
            borderColor: colors.carmineLight,
            backgroundColor: 'transparent',
            tension: 0.35,
            pointRadius: 6,
            pointHoverRadius: 8,
            borderWidth: 3,
            yAxisID: 'yPersona'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: colors.textColor, font: { weight: '600' } } },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('es-ES')} €`
            }
          }
        },
        scales: {
          x: { ticks: { color: colors.textColor }, grid: { color: colors.gridColor } },
          yHogar: {
            type: 'linear',
            position: 'left',
            ticks: { color: colors.textColor, callback: v => v.toLocaleString() + '€' },
            grid: { color: colors.gridColor }
          },
          yPersona: {
            type: 'linear',
            position: 'right',
            ticks: { color: colors.textColor, callback: v => v.toLocaleString() + '€' },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }

  // Gráfico 2: Brecha de Vulnerabilidad y Pobreza Relativa (Barra Global)
  const ctxVulnerabilidad = document.getElementById('chartVulnerabilidad');
  let chartVulnerabilidad;
  if (ctxVulnerabilidad) {
    chartVulnerabilidad = new Chart(ctxVulnerabilidad, {
      type: 'bar',
      data: {
        labels: ['Población Total', 'Hombres', 'Mujeres', 'Menores (<18)', 'Mayores (65+)', 'Españoles', 'Extranjeros'],
        datasets: [{
          label: '% Bajo el 60% de la Mediana (Riesgo Pobreza)',
          data: [18.4, 17.6, 19.0, 28.4, 13.9, 15.0, 63.9],
          backgroundColor: [
            '#0c6a63',
            '#0284c7',
            '#8b113e',
            '#d97706',
            '#059669',
            '#3b82f6',
            '#e11d48'
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Tasa de vulnerabilidad: ${ctx.parsed.y}%`
            }
          }
        },
        scales: {
          x: { ticks: { color: colors.textColor, font: { weight: '600' } }, grid: { display: false } },
          y: {
            ticks: { color: colors.textColor, callback: v => v + '%' },
            grid: { color: colors.gridColor },
            max: 70
          }
        }
      }
    });
  }

  // Gráfico 3: Pobreza Infantil vs Población General (Barras Agrupadas)
  const ctxInfancia = document.getElementById('chartInfanciaPobreza');
  let chartInfancia;
  if (ctxInfancia) {
    chartInfancia = new Chart(ctxInfancia, {
      type: 'bar',
      data: {
        labels: ['Pobreza Severa (<40% Mediana)', 'Pobreza Moderada (<50%)', 'Riesgo Pobreza (<60%)', 'Ingresos <10.000€/año', 'Ingresos <7.500€/año', 'Ingresos <5.000€/año'],
        datasets: [
          {
            label: 'Infancia y Adolescencia (<18 años)',
            data: [14.5, 22.0, 28.4, 23.8, 14.5, 6.8],
            backgroundColor: colors.amberLight,
            borderRadius: 6
          },
          {
            label: 'Población General (Media Municipal)',
            data: [8.6, 12.9, 18.4, 13.8, 8.2, 3.8],
            backgroundColor: colors.tealLight,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: colors.textColor, font: { weight: '600' } } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%`
            }
          }
        },
        scales: {
          x: { ticks: { color: colors.textColor, font: { weight: '600' } }, grid: { display: false } },
          y: { ticks: { color: colors.textColor, callback: v => v + '%' }, grid: { color: colors.gridColor }, max: 35 }
        }
      }
    });
  }

  // Gráfico 3.2: Proporción Interna de Menores en Riesgo de Pobreza (Doughnut)
  const ctxInfanciaProporcion = document.getElementById('chartInfanciaProporcion');
  let chartInfanciaProporcion;
  if (ctxInfanciaProporcion) {
    chartInfanciaProporcion = new Chart(ctxInfanciaProporcion, {
      type: 'doughnut',
      data: {
        labels: [
          'Pobreza Severa (<40% Mediana)',
          'Pobreza Moderada Profunda (40%-50%)',
          'Pobreza Relativa Límite (50%-60%)'
        ],
        datasets: [{
          data: [51.1, 26.4, 22.5],
          backgroundColor: [
            colors.carmineLight,
            colors.amberLight,
            colors.tealLight
          ],
          borderWidth: 2,
          borderColor: 'transparent',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: colors.textColor,
              font: { weight: '600' },
              padding: 16
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}% de los menores vulnerables`
            }
          }
        },
        cutout: '62%'
      }
    });
  }

  // Gráfico 4: Brecha de Género en Mayores de 65 (Barra)
  const ctxMayores = document.getElementById('chartMayoresGenero');
  let chartMayores;
  if (ctxMayores) {
    chartMayores = new Chart(ctxMayores, {
      type: 'bar',
      data: {
        labels: ['<40% Mediana (Severa)', '<50% Mediana', '<60% Mediana (Relativa)', 'Ingresos <10.000€/año', 'Ingresos <5.000€/año'],
        datasets: [
          {
            label: 'Mujeres Mayores (65+)',
            data: [3.8, 6.2, 12.8, 7.1, 1.4],
            backgroundColor: colors.carmineLight,
            borderRadius: 6
          },
          {
            label: 'Hombres Mayores (65+)',
            data: [2.1, 4.3, 8.1, 5.7, 1.0],
            backgroundColor: colors.indigoLight,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: colors.textColor, font: { weight: '600' } } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%`
            }
          }
        },
        scales: {
          x: { ticks: { color: colors.textColor, font: { weight: '600' } }, grid: { display: false } },
          y: { ticks: { color: colors.textColor, callback: v => v + '%' }, grid: { color: colors.gridColor }, max: 16 }
        }
      }
    });
  }

  // Gráfico 5: Brecha Migrante Extranjeros vs Españoles (Barra Comparativa Horizontal)
  const ctxMigrante = document.getElementById('chartBrechaMigrante');
  let chartMigrante;
  if (ctxMigrante) {
    chartMigrante = new Chart(ctxMigrante, {
      type: 'bar',
      data: {
        labels: [
          'Pobreza Severa (<40% Mediana)',
          'Pobreza Moderada (<50% Mediana)',
          'Riesgo Pobreza (<60% Mediana)',
          'Ingresos <5.000 € / año',
          'Ingresos <7.500 € / año',
          'Ingresos <10.000 € / año'
        ],
        datasets: [
          {
            label: 'Población Extranjera (8,4% censo)',
            data: [42.0, 54.4, 63.9, 18.1, 32.5, 48.4],
            backgroundColor: '#e11d48',
            borderRadius: 6
          },
          {
            label: 'Población Española',
            data: [7.9, 11.2, 15.0, 2.7, 6.3, 11.2],
            backgroundColor: colors.tealLight,
            borderRadius: 6
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: colors.textColor, font: { weight: '600' } } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.x}%`
            }
          }
        },
        scales: {
          x: { ticks: { color: colors.textColor, callback: v => v + '%' }, grid: { color: colors.gridColor }, max: 70 },
          y: { ticks: { color: colors.textColor, font: { weight: '600' } }, grid: { display: false } }
        }
      }
    });
  }

  // Gráfico 6: Fuentes de Ingresos (Doughnut)
  const ctxIngresos = document.getElementById('chartFuentesIngresos');
  let chartIngresos;
  if (ctxIngresos) {
    chartIngresos = new Chart(ctxIngresos, {
      type: 'doughnut',
      data: {
        labels: ['Salarios (53,5%)', 'Pensiones (29,2%)', 'Otros Ingresos / Rentas de Capital (11,8%)', 'Otras Prestaciones Sociales (4,3%)', 'Prestaciones por Desempleo (1,2%)'],
        datasets: [{
          data: [53.5, 29.2, 11.8, 4.3, 1.2],
          backgroundColor: [
            colors.tealLight,
            colors.carmineLight,
            colors.indigoLight,
            colors.amberLight,
            '#94a3b8'
          ],
          borderWidth: 2,
          borderColor: isDark() ? '#1e293b' : '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: colors.textColor, boxWidth: 14, padding: 14 } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label.split('(')[0]}: ${ctx.parsed}% del total`
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  // Gráfico 7: Pirámide / Grupos de Edad (Pie)
  const ctxDemografia = document.getElementById('chartDemografia');
  let chartDemografia;
  if (ctxDemografia) {
    chartDemografia = new Chart(ctxDemografia, {
      type: 'pie',
      data: {
        labels: ['Población 15 a 64 años (60,8%)', 'Mayores de 65 años (28,4%)', 'Menores de 15 años (10,8%)'],
        datasets: [{
          data: [60.8, 28.4, 10.8],
          backgroundColor: [colors.tealLight, colors.carmineLight, colors.indigoLight],
          borderColor: isDark() ? '#1e293b' : '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: colors.textColor, padding: 14 } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label.split('(')[0]}: ${ctx.parsed}% de los 124.091 hab.`
            }
          }
        }
      }
    });
  }

  // Gráfico 8: Sectores Económicos (Bar Horizontal)
  const ctxSectores = document.getElementById('chartSectores');
  let chartSectores;
  if (ctxSectores) {
    chartSectores = new Chart(ctxSectores, {
      type: 'bar',
      data: {
        labels: ['Servicios (86,5%)', 'Industria (7,9%)', 'Construcción (4,9%)', 'Agricultura / Pesca (0,7%)'],
        datasets: [{
          label: 'Población Ocupada',
          data: [40946, 3757, 2301, 331],
          backgroundColor: [colors.tealLight, colors.indigoLight, colors.amberLight, colors.carmineLight],
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.x.toLocaleString('es-ES')} trabajadores (${((ctx.parsed.x / 47350) * 100).toFixed(1)}%)`
            }
          }
        },
        scales: {
          x: { ticks: { color: colors.textColor }, grid: { color: colors.gridColor } },
          y: { ticks: { color: colors.textColor, font: { weight: '600' } }, grid: { display: false } }
        }
      }
    });
  }

  // Re-renderizar con el toggle de tema claro / oscuro
  const themeToggle = document.getElementById('themeToggleBtn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTimeout(() => {
        colors = getThemeColors();
        const allCharts = [
          chartRenta, chartVulnerabilidad, chartInfancia, chartInfanciaProporcion, chartMayores,
          chartMigrante, chartIngresos, chartDemografia, chartSectores
        ];
        allCharts.forEach(c => {
          if (c) {
            c.options.plugins.legend.labels.color = colors.textColor;
            if (c.options.scales) {
              if (c.options.scales.x) c.options.scales.x.ticks.color = colors.textColor;
              if (c.options.scales.y) c.options.scales.y.ticks.color = colors.textColor;
              if (c.options.scales.yHogar) c.options.scales.yHogar.ticks.color = colors.textColor;
              if (c.options.scales.yPersona) c.options.scales.yPersona.ticks.color = colors.textColor;
            }
            c.update();
          }
        });
      }, 100);
    });
  }
}
