/*SCRIPT TIPEO HERO*/

document.addEventListener('DOMContentLoaded', function () {
  new Typed('#typedText', {
    strings: [
      "no sabes por dónde empezar?",
      "no tienes tiempo para organizarte?",
      "todo te suena demasiado técnico?",
      "te da miedo cometer errores?",
      "sientes que nunca es buen momento?",
      "ya lo has intentado sin éxito?"
    ],
    typeSpeed: 45,
    backSpeed: 30,
    backDelay: 1500,
    startDelay: 500,
    loop: true,
    smartBackspace: true
  });
});

// Observa la aparición de las secciones
document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('.section');
  const options = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // Solo ejecutar una vez por sección
      }
    });
  }, options);

  sections.forEach(section => observer.observe(section));
});
