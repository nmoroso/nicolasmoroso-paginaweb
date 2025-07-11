document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('diagnostico-form');
  const preguntas = Array.from(form.querySelectorAll('.pregunta'));
  const resultado = document.getElementById('resultado');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');

  let indice = 0;
  mostrarPregunta(indice);

  prevBtn.addEventListener('click', () => {
    if (indice > 0) {
      indice--;
      mostrarPregunta(indice);
    }
  });

  nextBtn.addEventListener('click', () => {
    const current = preguntas[indice];
    const checked = current.querySelector('input[type="radio"]:checked');
    if (!checked) {
      alert('Selecciona una opción');
      return;
    }

    if (indice < preguntas.length - 1) {
      indice++;
      mostrarPregunta(indice);
    } else {
      form.style.display = 'none';
      mostrarResultado();
    }
  });

  function mostrarPregunta(i) {
    preguntas.forEach((p, idx) => {
      p.classList.toggle('active', idx === i);
    });

    prevBtn.style.display = i === 0 ? 'none' : 'inline-block';
    nextBtn.textContent = i === preguntas.length - 1 ? 'Finalizar' : 'Siguiente';
    progressBar.style.width = (i / preguntas.length) * 100 + '%';
    progressText.textContent = `Pregunta ${i + 1} de ${preguntas.length}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function mostrarResultado() {
    let puntaje = 0;
    preguntas.forEach(p => {
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

    progressBar.style.width = '100%';
    progressText.textContent = 'Autodiagnóstico completado';
    resultado.innerHTML =
      `<p>Tu estado financiero actual es <strong>${estado}</strong>. ` +
      `Te recomendamos el <strong>${plan}</strong>.</p>` +
      `<a class="hero-button" href="https://encuadrado.com/p/nicolas-moroso-1/" target="_blank">Agendar</a>`;
    resultado.style.display = 'block';
  }

  form.addEventListener('submit', e => e.preventDefault());
});
