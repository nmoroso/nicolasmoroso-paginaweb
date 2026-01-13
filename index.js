/*SCRIPT TIPEO HERO*/

let typedInstance;

const getTypedStrings = () => {
  const fallbackStrings = [
    "no sabes por dónde empezar?",
    "no tienes tiempo para organizarte?",
    "todo te suena demasiado técnico?",
    "te da miedo cometer errores?",
    "sientes que nunca es buen momento?",
    "ya lo has intentado sin éxito?"
  ];

  if (window.t) {
    const translated = window.t('hero.typed');
    if (Array.isArray(translated) && translated.length) {
      return translated;
    }
  }

  return fallbackStrings;
};

const initTyped = () => {
  const typedTarget = document.getElementById('typedText');
  if (!typedTarget) return;

  if (typedInstance) {
    typedInstance.destroy();
  }

  typedInstance = new Typed('#typedText', {
    strings: getTypedStrings(),
    typeSpeed: 45,
    backSpeed: 30,
    backDelay: 1500,
    startDelay: 500,
    loop: true,
    smartBackspace: true
  });
};

document.addEventListener('DOMContentLoaded', function () {
  initTyped();
});

window.addEventListener('languageChanged', function () {
  initTyped();
});

// Observa la aparición de las secciones
document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('.section');
  const options = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, options);

  sections.forEach(section => observer.observe(section));
});

// Acordeones para estados financieros
document.addEventListener('DOMContentLoaded', function () {
  const items = document.querySelectorAll('.tf-sd .accordion-item, .tf-ii .accordion-item, #faq .accordion-item');
  items.forEach(item => {
    const title = item.querySelector('.accordion-title');
    const content = item.querySelector('.accordion-content');
    if (!title || !content) return;
    content.style.display = 'none';
    title.addEventListener('click', function () {
      const isOpen = item.classList.contains('active');

      // Cerrar todos los items
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherContent = other.querySelector('.accordion-content');
          if (otherContent) {
            otherContent.style.display = 'none';
          }
        }
      });

      // Alternar el actual
      item.classList.toggle('active');
      content.style.display = isOpen ? 'none' : 'block';
    });
  });
});
