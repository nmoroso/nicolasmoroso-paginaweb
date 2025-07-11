document.getElementById("diagnostico-form").addEventListener("submit", function(e) {
  e.preventDefault();
  
  let puntaje = 0;
  for (let i = 1; i <= 5; i++) {
    const respuesta = document.querySelector(`input[name="p${i}"]:checked`);
    if (respuesta) {
      puntaje += parseInt(respuesta.value);
    }
  }

  let resultadoTexto = "";
  if (puntaje <= 3) {
    resultadoTexto = "Tu estado financiero actual es **Supervivencia**. Te recomendamos el <strong>Plan Inicia – Hacia la Estabilidad</strong>.";
  } else if (puntaje <= 6) {
    resultadoTexto = "Tu estado financiero actual es **Estabilidad**. Te recomendamos el <strong>Plan Potencia – Hacia la Tranquilidad</strong>.";
  } else {
    resultadoTexto = "Tu estado financiero actual es **Tranquilidad**. Te recomendamos el <strong>Plan Transforma – Hacia la Proyección</strong>.";
  }

  document.getElementById("resultado").innerHTML = resultadoTexto;
});
