document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('diagnostico-form');
  const preguntas = Array.from(form.querySelectorAll('.pregunta'));
  const resultado = document.getElementById('resultado');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const progressBar = document.getElementById('progress-bar');

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
      p.style.display = idx === i ? 'block' : 'none';
    });

    prevBtn.style.display = i === 0 ? 'none' : 'inline-block';
    nextBtn.textContent = i === preguntas.length - 1 ? 'Finalizar' : 'Siguiente';
    progressBar.style.width = (i / preguntas.length) * 100 + '%';
  }

  function mostrarResultado() {
    let puntaje = 0;
    preguntas.forEach(p => {
      const r = p.querySelector('input[type="radio"]:checked');
      if (r) puntaje += parseInt(r.value);
    });

    let mensaje = '';
    if (puntaje <= 3) {
      mensaje = `
        <h2>✅ Resultado del diagnóstico financiero personal</h2>
        <p>🔎 Tu estado actual es: <strong>Supervivencia Financiera</strong></p>
        <p>Estás en una etapa donde el ingreso apenas alcanza para cubrir lo básico. Probablemente vives al día, sin margen para ahorrar o responder ante imprevistos. Esto puede generar mucho estrés y una sensación de estar atrapado/a en un ciclo difícil de romper.</p>
        <p>📍 ¿Cómo mejorar?<br>Te recomendamos el plan <strong>Inicia – Hacia la Estabilidad Financiera</strong>, diseñado para ayudarte a tomar el control de tus gastos, ordenar tus finanzas y generar tus primeros ahorros.</p>
        <p>👥 ¿Cómo son las personas que están en el siguiente estado?<br>Son personas que ya logran cubrir sus gastos con cierta holgura, tienen pequeños colchones financieros y comienzan a mirar el mediano plazo. No todo está resuelto, pero ya respiran con más tranquilidad.</p>
        <p>🧭 Con el plan <strong>Inicia</strong>, vamos a sentar las bases para que tú también salgas del modo supervivencia y empieces a construir estabilidad. Paso a paso, sin juicios, pero con dirección.</p>
      `;
    } else if (puntaje <= 6) {
      mensaje = `
        <h2>✅ Resultado del diagnóstico financiero personal</h2>
        <p>🔎 Tu estado actual es: <strong>Estabilidad Financiera</strong></p>
        <p>Tus finanzas están bajo control. Cubres tus necesidades y quizás tienes algo de ahorro, pero todavía falta estrategia. No estás en riesgo, pero tampoco estás sacando el mayor provecho a tu dinero.</p>
        <p>📍 ¿Cómo mejorar?<br>Te recomendamos el plan <strong>Potencia – Hacia la Tranquilidad Financiera</strong>, que te ayudará a optimizar lo que ya lograste: ahorrar con propósito, invertir y planificar tus próximos pasos con intención.</p>
        <p>👥 ¿Cómo son las personas que están en el siguiente estado?<br>Son personas que ya viven con tranquilidad financiera. Tienen fondos de emergencia, ahorros definidos y una planificación clara. Su dinero no solo cubre sus necesidades, también les permite avanzar hacia sus metas.</p>
        <p>🧭 Con el plan <strong>Potencia</strong>, vas a estructurar lo que hasta ahora has manejado de forma más intuitiva. Es momento de que tu dinero trabaje para ti.</p>
      `;
    } else {
      mensaje = `
        <h2>✅ Resultado del diagnóstico financiero personal</h2>
        <p>🔎 Tu estado actual es: <strong>Tranquilidad Financiera</strong></p>
        <p>Has hecho un gran trabajo: tienes tus finanzas ordenadas, ahorras de forma constante y no dependes de deudas para vivir tranquilo. Ya no hay sobresaltos. Pero aún hay espacio para ir más allá.</p>
        <p>📍 ¿Cómo mejorar?<br>Te recomendamos el plan <strong>Transforma – Hacia la Proyección Financiera</strong>, que te permitirá usar tu estabilidad como plataforma para construir patrimonio, invertir estratégicamente y pensar en tu futuro con visión de largo plazo.</p>
        <p>👥 ¿Cómo son las personas que están en el siguiente estado?<br>Son personas que ya no solo piensan en estar bien hoy, sino en construir el mañana. Tienen objetivos financieros de mediano y largo plazo, aprovechan oportunidades para hacer crecer su dinero y proyectan su estilo de vida futuro con intención.</p>
        <p>🧭 Con el plan <strong>Transforma</strong>, vas a pasar del orden al crecimiento. Este es el punto donde se consolida tu tranquilidad y comienza la planificación activa de tu libertad financiera.</p>
      `;
    }

    progressBar.style.width = '100%';
    resultado.innerHTML =
      mensaje +
      `<a class="hero-button" href="https://encuadrado.com/p/nicolas-moroso-1/" target="_blank">Agendar</a>`;
    resultado.style.display = 'block';
  }

  form.addEventListener('submit', e => e.preventDefault());
});
