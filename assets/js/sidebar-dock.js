/**
 * ObservaLE - Sidebar Dock Universal Mobile & Desktop Controller
 * Gestiona la barra lateral colapsable para que en dispositivos móviles (<992px)
 * permanezca 100% colapsada fuera de pantalla y se despliegue como drawer con backdrop.
 */
(function() {
  function initSidebarDock() {
    const sidebar = document.getElementById('statsSidebarDock');
    if (!sidebar) return;

    // 1. Crear backdrop si no existe
    let backdrop = document.querySelector('.sidebar-mobile-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-mobile-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }

    // 2. Crear botón flotante (FAB) para móviles si no existe
    let fab = document.querySelector('.sidebar-mobile-fab');
    if (!fab) {
      fab = document.createElement('button');
      fab.type = 'button';
      fab.className = 'sidebar-mobile-fab';
      fab.setAttribute('aria-label', 'Abrir menú de navegación');
      fab.setAttribute('title', 'Navegación del Espacio Estadístico');
      fab.innerHTML = '<i class="fa-solid fa-bars"></i>';
      document.body.appendChild(fab);
    }

    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const toggleIcon = document.getElementById('sidebarToggleIcon');

    function openSidebar() {
      sidebar.classList.add('expanded');
      backdrop.classList.add('active');
      if (toggleIcon) {
        toggleIcon.className = 'fa-solid fa-xmark';
      }
      if (fab) {
        fab.setAttribute('aria-expanded', 'true');
      }
    }

    function closeSidebar() {
      sidebar.classList.remove('expanded');
      backdrop.classList.remove('active');
      if (toggleIcon) {
        toggleIcon.className = 'fa-solid fa-bars';
      }
      if (fab) {
        fab.setAttribute('aria-expanded', 'false');
      }
    }

    function toggleSidebar() {
      if (sidebar.classList.contains('expanded')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    }

    // Eventos
    if (toggleBtn) {
      // Reemplazamos listener anterior clonando el nodo para evitar duplicados si ya había listener
      const newToggleBtn = toggleBtn.cloneNode(true);
      toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
      newToggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
      });
    }

    fab.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
    });

    backdrop.addEventListener('click', function() {
      closeSidebar();
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidebar.classList.contains('expanded')) {
        closeSidebar();
      }
    });

    // En móviles, cerrar el sidebar al pulsar cualquier enlace del menú
    sidebar.querySelectorAll('a.sidebar-square-btn').forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth < 992) {
          closeSidebar();
        }
      });
    });

    // Ajuste responsive al redimensionar ventana
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 992) {
        backdrop.classList.remove('active');
      } else if (!sidebar.classList.contains('expanded')) {
        backdrop.classList.remove('active');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebarDock);
  } else {
    initSidebarDock();
  }
})();
