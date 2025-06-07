document.addEventListener('DOMContentLoaded', function() {
    // Selecciona los elementos necesarios para el menú principal y el overlay
    const menuIcon = document.querySelector('.menu-wrapper i.fa-bars');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');
    const menuWrapper = document.querySelector('.menu-wrapper');
  
    // Verifica que todos los elementos existan
    if (!menuIcon || !mobileMenu || !overlay || !menuWrapper) {
      console.error("Faltan elementos requeridos para la funcionalidad del menú");
      return;
    }
  
    // Al hacer clic en el ícono de menú, alterna la clase "active" en el menú y en el overlay
    menuIcon.addEventListener('click', function(event) {
      event.stopPropagation(); // Evita que el clic se propague al listener global
      mobileMenu.classList.toggle('active');
      overlay.classList.toggle('active');
    });
  
    // Cierra el menú y el overlay al hacer clic sobre el overlay
    overlay.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      // Cierra cualquier submenú abierto
      document.querySelectorAll('.simulador-dropdown.active')
        .forEach(el => el.classList.remove('active'));
    });
  
    // Listener para cerrar el menú al hacer clic en un enlace dentro del menú,
    // excepto el enlace que activa el submenú "Simulador".
    document.querySelectorAll('.mobile-menu a').forEach(link => {
      link.addEventListener('click', function(e) {
        // Si el enlace es el toggle del submenú (verifica si su contenedor padre tiene la clase simulador-dropdown)
        if (this.parentElement.classList.contains('simulador-dropdown')) {
          // Evita la acción por defecto y no cierra el menú principal,
          // ya que se encargará de mostrar el submenú mediante otro listener.
          e.preventDefault();
          return;
        }
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        // Cierra cualquier submenú activo
        document.querySelectorAll('.simulador-dropdown.active')
          .forEach(el => el.classList.remove('active'));
      });
    });
  
    // Listener global: cierra el menú, overlay y cualquier submenú si se hace clic fuera de .mobile-menu y .menu-wrapper
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.mobile-menu') && !event.target.closest('.menu-wrapper')) {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        // Cierra todos los submenús abiertos (elementos con clase simulador-dropdown que tengan active)
        document.querySelectorAll('.simulador-dropdown.active')
          .forEach(el => el.classList.remove('active'));
      }
    });
  
    // Listener para el toggle del submenú "Simulador"
    const simuladorLinks = document.querySelectorAll('.simulador-dropdown > a');
    simuladorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Evita la navegación predeterminada
        e.preventDefault();
        // Alterna la clase "active" en el contenedor padre (.simulador-dropdown)
        this.parentElement.classList.toggle('active');
      });
    });
  });
  