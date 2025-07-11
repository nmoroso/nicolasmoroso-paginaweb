document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('diagnostico-form');
  const preguntas = form.querySelectorAll('.pregunta');
  const resultado = document.getElementById('resultado');

  // Oculta todas las preguntas excepto la primera
  preguntas.forEach((p, i) => {
    if (i !== 0) p.style.display = 'none';
    p.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => mostrarSiguiente(i));
    });
  });

  function mostrarSiguiente(indice) {
    if (indice < preguntas.length - 1) {
      preguntas[indice].style.display = 'none';
      preguntas[indice + 1].style.display = 'block';
    } else {
      form.style.display = 'none';
      mostrarResultado();
    }
  }

  function mostrarResultado() {
    let puntaje = 0;
    preguntas.forEach((p, idx) => {
      const r = p.querySelector('input[type="radio"]:checked');
      if (r) puntaje += parseInt(r.value);
    });

    let estado = '';
    let plan = '';
    if (puntaje <= 3) {
      estado = 'Supervivencia';
      plan = 'Plan Inicia – Hacia la Estabilidad';
    } else if (puntaje <= 6) {
      estado = 'Estabilidad';
      plan = 'Plan Potencia – Hacia la Tranquilidad';
    } else {
      estado = 'Tranquilidad';
      plan = 'Plan Transforma – Hacia la Proyección';
    }

    resultado.innerHTML =
      `<p>Tu estado financiero actual es <strong>${estado}</strong>. ` +
      `Te recomendamos el <strong>${plan}</strong>.</p>` +
      `<a class="hero-button" href="https://encuadrado.com/p/nicolas-moroso-1/" target="_blank">Agendar</a>`;
    resultado.style.display = 'block';
  }

  // Evita el envío del formulario por defecto
  form.addEventListener('submit', e => e.preventDefault());
});
