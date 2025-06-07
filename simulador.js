document.getElementById('tasa').addEventListener('blur', function(e) {
  let val = e.target.value.replace('%', '').trim();
  if (val) {
    e.target.value = parseFloat(val).toFixed(2);
  }
});


// Eliminar puntos (separadores de miles) en el campo "monto" al perder el foco
document.getElementById('monto').addEventListener('blur', function(e) {
  let val = e.target.value.replace(/\./g, '');
  if (val) e.target.value = Number(val).toLocaleString('es-CL');
});

// Función para el cálculo del simulador de Consumo (antes calcularAmortizacion, ahora cconsumoamort)
function cconsumoamort() {
  // 1) Leer datos de entrada
  let montoStr = document.getElementById('monto').value.replace(/\./g, '');
  const MSolicitado = parseFloat(montoStr);
  const numPagos = parseInt(document.getElementById('plazo').value);
  const monthsGrace = parseInt(document.getElementById('gracia').value) || 0;
  const totalMeses = monthsGrace + numPagos;
  if (numPagos <= 0 || monthsGrace < 0) {
    alert("Revisa los valores de plazo y gracia.");
    return;
  }
  const moneda = document.getElementById('monedaSelect').value;

  // 2) Leer la tasa (reemplazar comas por puntos)
  let tasaStr = document.getElementById('tasa').value.replace(',', '.');
  const tasaMensual = parseFloat(tasaStr) / 100;

  // 3) Calcular cargos adicionales:
  const checkSeguro = document.getElementById('checkSeguro').checked;
  const seguroTotal = checkSeguro ? MSolicitado * 0.00088 * numPagos : 0;
  let impuestoTotal = (MSolicitado + seguroTotal) * 0.00066 * numPagos;
  const tope = (MSolicitado + seguroTotal) * 0.008;
  if (impuestoTotal > tope) { impuestoTotal = tope; }

  // 4) Monto Inicial Definitivo para la amortización y CAE:
  const montoInicial = MSolicitado + seguroTotal + impuestoTotal;

  // 5) Monto Inicial Ajustado para el cuadro de pagos (aplicando el período de gracia)
  const MCredito = montoInicial * Math.pow(1 + tasaMensual, monthsGrace);

  // 6) Calcular la cuota (fórmula de amortización francesa) sobre MCredito
  const cuota = MCredito *
    (tasaMensual * Math.pow(1 + tasaMensual, numPagos)) /
    (Math.pow(1 + tasaMensual, numPagos) - 1);

  // 7) Construir el cuadro de amortización
  let saldo = MCredito;
  let tabla = `<table>
                 <tr>
                   <th>Período</th>
                   <th>Cuota</th>
                   <th>Interés</th>
                   <th>Amortización</th>
                   <th>Saldo</th>
                 </tr>`;
  // Meses de gracia: capitaliza el interés sin pago de cuota
  for (let i = 1; i <= monthsGrace; i++) {
    const interes = saldo * tasaMensual;
    saldo += interes;
    tabla += `<tr>
                <td>${i}</td>
                <td>${formatearMoneda(0, moneda)}</td>
                <td>${formatearMoneda(interes, moneda)}</td>
                <td>${formatearMoneda(0, moneda)}</td>
                <td>${formatearMoneda(saldo, moneda)}</td>
              </tr>`;
  }
  // Meses de pago
  let totalPagado = 0;
  for (let i = monthsGrace + 1; i <= totalMeses; i++) {
    const interes = saldo * tasaMensual;
    const amortizacion = cuota - interes;
    saldo -= amortizacion;
    if (saldo < 0) saldo = 0;
    totalPagado += cuota;
    tabla += `<tr>
                <td>${i}</td>
                <td>${formatearMoneda(cuota, moneda)}</td>
                <td>${formatearMoneda(interes, moneda)}</td>
                <td>${formatearMoneda(amortizacion, moneda)}</td>
                <td>${formatearMoneda(saldo, moneda)}</td>
              </tr>`;
  }
  tabla += `</table>`;
  document.getElementById('resultado').innerHTML = tabla;

  // 8) Costo total e intereses
  const costoTotal = totalPagado;
  const totalIntereses = costoTotal - montoInicial;

  // 9) Calcular el CAE (TIR)
  const flows = [];
  flows[0] = -Math.round(MSolicitado);
  for (let i = 1; i <= numPagos; i++) {
    flows[i] = Math.round(cuota);
  }
  const tirMensual = Math.abs(calcularIRR(flows));
  const CAE = (Math.pow(1 + tirMensual, 12) - 1) * 100;

  // 10) Mostrar resultados en el recuadro informativo
  document.querySelector('#infoCAE .info-value').textContent = `${CAE.toFixed(2)}%`;
  document.querySelector('#infoTotalCredito .info-value').textContent = formatearMoneda(costoTotal, moneda);
  document.querySelector('#infoTotalIntereses .info-value').textContent = formatearMoneda(totalIntereses, moneda);
  document.querySelector('#infoSeguro .info-value').textContent = formatearMoneda(seguroTotal, moneda);
  document.querySelector('#infoTimbre .info-value').textContent = formatearMoneda(impuestoTotal, moneda);
  document.querySelector('#infoCuota .info-value').textContent = formatearMoneda(cuota, moneda);
  document.querySelector('#infoPlazo .info-value').textContent = `${totalMeses} meses`;
}

// Función para calcular la TIR (IRR) usando búsqueda binaria
function calcularIRR(flows) {
  let low = 0.0;
  let high = 2.0;
  const precision = 1e-12;
  let irr = 0;
  while ((high - low) > precision) {
    const mid = (low + high) / 2;
    const npv = flows.reduce((acc, flow, index) => acc + flow / Math.pow(1 + mid, index), 0);
    if (npv > 0) { 
      low = mid; 
    } else { 
      high = mid; 
    }
    irr = mid;
  }
  return irr;
}

// Función para formatear valores según la moneda
function formatearMoneda(valor, moneda) {
  if (moneda === 'peso') {
    return "$" + valor.toLocaleString('es-CL', { maximumFractionDigits: 0 });
  } else {
    return "UF " + valor.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

// Función para limpiar la simulación de Consumo
function limpiarSimulacion() {
  document.getElementById('simulador').reset();
  document.getElementById('resultado').innerHTML = "";
  document.querySelector('#infoCAE .info-value').textContent = "--";
  document.querySelector('#infoTotalCredito .info-value').textContent = "--";
  document.querySelector('#infoTotalIntereses .info-value').textContent = "--";
  document.querySelector('#infoSeguro .info-value').textContent = "--";
  document.querySelector('#infoTimbre .info-value').textContent = "--";
  document.querySelector('#infoCuota .info-value').textContent = "--";
  document.querySelector('#infoPlazo .info-value').textContent = "--";
}

// Función para limpiar la simulación Hipotecaria
function limpiarSimulacionHipotecario() {
  // 1) Resetear el formulario
  document.getElementById('formHipotecario').reset();

  // 2) Limpiar la tabla de amortización
  document.getElementById('resultado').innerHTML = "";

  // 3) Restaurar los campos de la sección de resultados a "--"
  document.querySelector('#infoMontoFinanciar .info-value').textContent = "--";
  document.querySelector('#infoCuotaNeta .info-value').textContent = "--";
  document.querySelector('#infoSeguroDesgravamen .info-value').textContent = "--";
  document.querySelector('#infoSeguroIncendio .info-value').textContent = "--";
  document.querySelector('#infoCuotaTotal .info-value').textContent = "--";
}

// Función para mostrar el simulador según el tipo de crédito seleccionado
function mostrarSimulador() {
  limpiarSimulacion();
  limpiarSimulacionHipotecario();

  const tipo = document.getElementById("tipoCredito").value;
  document.getElementById("simuladorConsumo").style.display = tipo === "consumo" ? "flex" : "none";
  document.getElementById("simuladorHipotecario").style.display = tipo === "hipotecario" ? "flex" : "none";
  document.getElementById("simuladorBullet").style.display = tipo === "bullet" ? "flex" : "none";
}

/* =========================
 SECCIÓN PARA SIMULADOR HIPOTECARIO
   ========================= */

// Formatear el campo "valorPropiedad" para mostrar separadores de miles y 2 decimales (en UF)
document.getElementById('valorPropiedad').addEventListener('blur', function(e) {
  let val = e.target.value.replace(/\./g, '');
  if (val) {
    // Puedes ajustar el formateo a 2 decimales, ya que se trabaja en UF.
    e.target.value = Number(val).toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
});

// Formatear el campo "tasaAnual" para mostrar siempre 2 decimales al perder el foco
document.getElementById('tasaAnual').addEventListener('blur', function(e) {
  let val = e.target.value.replace('%', '').trim();
  if (val) {
    e.target.value = parseFloat(val).toFixed(2);
  }
});

// Formatear el campo "financiamiento" para que siempre muestre 2 decimales al perder el foco
document.getElementById('financiamiento').addEventListener('blur', function(e) {
  let val = e.target.value.replace('%', '').trim();
  if (val) {
    e.target.value = parseFloat(val).toFixed(2);
  }
});

/***********************************************
 * Función para formatear números en UF con 2 decimales
 ***********************************************/
function formatearUF(num) {
  return "UF " + parseFloat(num).toLocaleString('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/***********************************************
 * Función para calcular la TIR (IRR) usando búsqueda binaria
 ***********************************************/
function calcularIRR(flows) {
  let low = 0.0;
  let high = 2.0;
  const precision = 1e-12;
  let irr = 0;
  while ((high - low) > precision) {
    const mid = (low + high) / 2;
    const npv = flows.reduce((acc, flow, index) => acc + flow / Math.pow(1 + mid, index), 0);
    if (npv > 0) {
      low = mid;
    } else {
      high = mid;
    }
    irr = mid;
  }
  return irr;
}

/***********************************************
 * Función para el cálculo del simulador Hipotecario
 * con acumulación de seguros en la gracia y actualización
 * del panel de “Información del Crédito”.
 *
 * La tabla mostrará las columnas:
 * N | Saldo Inicial | Amort | Interés | Seg. Desg. | Seg. Inc. | 
 * Cuota Neta | Cuota Total | Saldo Final
 *
 * Además, se calcula el CAE usando flujos de caja reales, donde cada flujo
 * es (cuota + seguro desgravamen + seguro incendio) para el período de pago.
 ***********************************************/
function chipotecarioamort() {
  // 1) Leer datos de entrada
  let valorPropStr = document.getElementById('valorPropiedad').value.replace(/\./g, '');
  const valorPropiedad = parseFloat(valorPropStr);
  const porcentajeFinanciamiento = parseFloat(document.getElementById('financiamiento').value);
  let tasaAnualStr = document.getElementById('tasaAnual').value.replace(',', '.');
  const tasaAnual = parseFloat(tasaAnualStr) / 100;
  const numPagos = parseInt(document.getElementById('plazoHipotecario').value);
  const monthsGrace = parseInt(document.getElementById('graciaHipotecario').value) || 0;
  const totalMeses = monthsGrace + numPagos;
  
  if (numPagos <= 0 || monthsGrace < 0) {
    alert("Revisa los valores de plazo y/o gracia.");
    return;
  }
  
  // 2) Monto a financiar
  const montoFinanciar = valorPropiedad * (porcentajeFinanciamiento / 100);
  
  // 3) Calcular la tasa mensual efectiva a partir de la tasa anual (compuesta mensualmente)
  const tasaMensual = Math.pow(1 + tasaAnual, 1/12) - 1;
  
  // 4) Calcular el capital tras el período de gracia, capitalizando mes a mes
  let saldo = montoFinanciar;
  for (let i = 1; i <= monthsGrace; i++) {
    const interes = saldo * tasaMensual;
    saldo += interes;
  }
  const capitalPago = saldo; // Este es el capital a amortizar en los períodos de pago
  
  // 5) Calcular la cuota mensual (amortización francesa) para los períodos de pago
  const cuota = capitalPago *
    (tasaMensual * Math.pow(1 + tasaMensual, numPagos)) /
    (Math.pow(1 + tasaMensual, numPagos) - 1);
  
  // 6) Definir tasas de seguros mensuales:
  // Seguro Incendio: 0,022% = 0.00022 (sobre el valor de la propiedad)
  // Seguro Desgravamen: 0,0088% = 0.000088 (sobre el saldo insoluto)
  const tasaSegInc = 0.00022;
  const tasaSegDesg = 0.000088;
  
  // 7) Construir la tabla de desarrollo de pagos
  let saldoFinal = montoFinanciar;
  let tabla = `<table>
                 <tr>
                   <th>N</th>
                   <th>Saldo Inicial</th>
                   <th>Amort</th>
                   <th>Interés</th>
                   <th>Seg. Desg.</th>
                   <th>Seg. Inc.</th>
                   <th>Cuota Neta</th>
                   <th>Cuota Total</th>
                   <th>Saldo Final</th>
                 </tr>`;
  
  // Variables para acumular los seguros durante la gracia
  let acumSegDesg = 0;
  let acumSegInc = 0;
  
  for (let i = 1; i <= totalMeses; i++) {
    const saldoInicialPeriodo = saldoFinal;
    const interes = saldoInicialPeriodo * tasaMensual;
    let segDesg = saldoInicialPeriodo * tasaSegDesg;
    let segInc = valorPropiedad * tasaSegInc;
    let amort = 0;
    let cuotaNeta = 0;
    let cuotaTotal = 0;
    
    if (i <= monthsGrace) {
      // Período de gracia: no se paga cuota, se capitaliza solo el interés.
      acumSegDesg += segDesg;
      acumSegInc += segInc;
      cuotaNeta = 0;
      cuotaTotal = 0;
      amort = 0;
      saldoFinal = saldoInicialPeriodo + interes;
    } else {
      // Período de pago:
      if (i === monthsGrace + 1) {
        // En el primer período de pago, se suman los seguros acumulados de la gracia
        segDesg += acumSegDesg;
        segInc += acumSegInc;
      }
      cuotaNeta = cuota;
      amort = cuotaNeta - interes;
      if (amort < 0) amort = 0;
      saldoFinal = saldoInicialPeriodo - amort;
      if (saldoFinal < 0) saldoFinal = 0;
      cuotaTotal = cuotaNeta + segDesg + segInc;
    }
    
    tabla += `<tr>
                <td>${i}</td>
                <td>${formatearUF(saldoInicialPeriodo)}</td>
                <td>${formatearUF(amort)}</td>
                <td>${formatearUF(interes)}</td>
                <td>${formatearUF(segDesg)}</td>
                <td>${formatearUF(segInc)}</td>
                <td>${formatearUF(cuotaNeta)}</td>
                <td>${formatearUF(cuotaTotal)}</td>
                <td>${formatearUF(saldoFinal)}</td>
              </tr>`;
  }
  
  tabla += `</table>`;
  document.getElementById('resultado').innerHTML = tabla;
  
  // 8) Calcular información global para el panel derecho
  // Total pagado en períodos de pago:
  const totalPagado = cuota * numPagos;
  // Total intereses: diferencia entre total pagado y el capital a amortizar (capitalPago)
  const totalIntereses = totalPagado - capitalPago;
  
  // 9) Calcular CAE (TIR) usando flujos de caja reales de la parte de pago:
  // En t=0 se recibe el monto financiado; para cada período de pago se paga:
  // (cuota + seguro desgravamen + seguro incendio) correspondiente a ese período.
  let flows = [];
  flows[0] = -montoFinanciar;
  
  // Para simular los flujos de los períodos de pago, recreamos el calendario de pagos:
  // Primero, recalcular la acumulación de seguros en la gracia:
  let acumSegDesgAux = 0;
  let acumSegIncAux = 0;
  let saldoGracia = montoFinanciar;
  for (let i = 1; i <= monthsGrace; i++) {
    let intGracia = saldoGracia * tasaMensual;
    let segDesgGracia = saldoGracia * tasaSegDesg;
    let segIncGracia = valorPropiedad * tasaSegInc;
    acumSegDesgAux += segDesgGracia;
    acumSegIncAux += segIncGracia;
    saldoGracia = saldoGracia + intGracia;
  }
  
  // Ahora, simular los flujos para los numPagos períodos:
  let saldoAux = capitalPago; // saldo después de la gracia
  for (let j = 1; j <= numPagos; j++) {
    let saldoInicial = saldoAux;
    let interes = saldoInicial * tasaMensual;
    let segDesg = saldoInicial * tasaSegDesg;
    let segInc = valorPropiedad * tasaSegInc;
    if (j === 1) {
      segDesg += acumSegDesgAux;
      segInc += acumSegIncAux;
    }
    let cuotaNeta = cuota;
    let flujo = cuotaNeta + segDesg + segInc;
    flows.push(flujo);
    let amort = cuotaNeta - interes;
    if (amort < 0) amort = 0;
    saldoAux = saldoInicial - amort;
  }
  
  const tirMensual = Math.abs(calcularIRR(flows));
  const CAE = (Math.pow(1 + tirMensual, 12) - 1) * 100;
  
  // 10) Actualizar el panel derecho (usando los IDs con prefijo CHIP)
  document.querySelector('#infoMontoFinanciar .info-value').textContent = formatearUF(montoFinanciar);
  document.querySelector('#infoCuotaNeta .info-value').textContent = formatearUF(cuota);
  document.querySelector('#infoCHIPCAE .info-value').textContent = `${CAE.toFixed(2)}%`;
  document.querySelector('#infoCHIPTotalCredito .info-value').textContent = formatearUF(totalPagado.toFixed(2));
  document.querySelector('#infoCHIPTotalIntereses .info-value').textContent = formatearUF(totalIntereses.toFixed(2));
  document.querySelector('#infoCHIPPlazo .info-value').textContent = `${totalMeses} meses`;
  
  // Además, se muestran los seguros "típicos" mensuales (sin acumulación) para referencia:
  const segDesgMensual = montoFinanciar * (porcentajeFinanciamiento / 100) * tasaSegDesg;
  const segIncMensual = valorPropiedad * tasaSegInc;
  document.querySelector('#infoSeguroDesgravamen .info-value').textContent = formatearUF(segDesgMensual.toFixed(2));
  document.querySelector('#infoSeguroIncendio .info-value').textContent = formatearUF(segIncMensual.toFixed(2));
  const cuotaTotalAprox = parseFloat(cuota) + parseFloat(segDesgMensual) + parseFloat(segIncMensual);
  document.querySelector('#infoCuotaTotal .info-value').textContent = formatearUF(cuotaTotalAprox.toFixed(2));
}

/***********************************************
 * Función para limpiar la simulación Hipotecaria
 ***********************************************/
function limpiarSimulacionHipotecario() {
  document.getElementById('formHipotecario').reset();
  document.getElementById('resultado').innerHTML = "";
  document.querySelector('#infoMontoFinanciar .info-value').textContent = "--";
  document.querySelector('#infoCuotaNeta .info-value').textContent = "--";
  document.querySelector('#infoSeguroDesgravamen .info-value').textContent = "--";
  document.querySelector('#infoSeguroIncendio .info-value').textContent = "--";
  document.querySelector('#infoCuotaTotal .info-value').textContent = "--";
  document.querySelector('#infoCHIPCAE .info-value').textContent = "--";
  document.querySelector('#infoCHIPTotalCredito .info-value').textContent = "--";
  document.querySelector('#infoCHIPTotalIntereses .info-value').textContent = "--";
  document.querySelector('#infoCHIPPlazo .info-value').textContent = "--";
}


/* =========================
       SECCIÓN PARA BULLET
   ========================= */
// Formatear el campo "montoBullet" para mostrar separadores de miles al perder el foco
document.getElementById('montoBullet').addEventListener('blur', function(e) {
  let val = e.target.value.replace(/\./g, '');
  if (val) {
    e.target.value = Number(val).toLocaleString('es-CL');
  }
});

// Formatear el campo "tasaBullet" para mostrar siempre 2 decimales al perder el foco
document.getElementById('tasaBullet').addEventListener('blur', function(e) {
  let val = e.target.value.replace('%', '').trim();
  if (val) {
    e.target.value = parseFloat(val).toFixed(2);
  }
});

// Función para formatear valores según la moneda
function formatearMoneda(valor, moneda) {
  if (moneda === 'peso') {
    return "$" + Number(valor).toLocaleString('es-CL', { maximumFractionDigits: 0 });
  } else {
    return "UF " + Number(valor).toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

// Función para calcular el simulador de Crédito Bullet usando la fórmula propuesta para el CAE
function cbulletamort() {
  // 1) Leer datos del formulario
  let montoStr = document.getElementById('montoBullet').value.replace(/\./g, '');
  const monto = parseFloat(montoStr);
  if (isNaN(monto) || monto <= 0) {
    alert("Ingrese un monto válido.");
    return;
  }
  
  const plazoDias = parseInt(document.getElementById('plazoDiasBullet').value);
  if (isNaN(plazoDias) || plazoDias <= 0) {
    alert("Ingrese un plazo en días válido.");
    return;
  }
  
  let tasaStr = document.getElementById('tasaBullet').value.replace(',', '.');
  const tasaInput = parseFloat(tasaStr);
  if (isNaN(tasaInput) || tasaInput <= 0) {
    alert("Ingrese una tasa de interés válida.");
    return;
  }
  
  const moneda = document.getElementById('monedaSelectBullet').value;
  const incluirSeguro = document.getElementById('checkSeguroBullet').checked;
  
  // 2) Calcular la tasa diaria según la moneda:
  //    - Si moneda es "peso": tasa es mensual y se convierte a diaria
  //    - Si moneda es "uf": tasa es anual y se convierte a diaria
  let tasaDiaria;
  if (moneda === "peso") {
    tasaDiaria = Math.pow(1 + (tasaInput / 100), 1 / 30) - 1;
  } else {
    tasaDiaria = Math.pow(1 + (tasaInput / 100), 1 / 365) - 1;
  }
  
  // 3) Calcular el interés acumulado compuesto diariamente:
  const interesAcumulado = monto * (Math.pow(1 + tasaDiaria, plazoDias) - 1);
  const pagoFinal = monto + interesAcumulado;
  
  // 4) Calcular el costo del seguro de desgravamen:
  // Se aproxima el número de meses como: plazoDias / 30 y se aplica una tasa de 0.00088
  const numMeses = plazoDias / 30;
  const seguroCosto = incluirSeguro ? monto * 0.00088 * numMeses : 0;
  
  // 5) Calcular el costo total del crédito y el total de intereses:
  const totalCredito = monto + interesAcumulado + seguroCosto;
  const totalIntereses = interesAcumulado;
  
  // 6) Calcular el CAE usando la fórmula propuesta:
  // CAE = ((totalCredito/monto)^(365/plazoDias)) - 1
  const CAE = Math.pow(totalCredito / monto, 365 / plazoDias) - 1;
  
  // 7) Actualizar el panel de resultados
  document.querySelector('#infoTotalCreditoBullet .info-value').textContent = formatearMoneda(totalCredito, moneda);
  document.querySelector('#infoTotalInteresesBullet .info-value').textContent = formatearMoneda(totalIntereses, moneda);
  document.querySelector('#infoSeguroDesgravamenBullet .info-value').textContent = formatearMoneda(seguroCosto, moneda);
  document.querySelector('#infoCAE_Bullet .info-value').textContent = (CAE * 100).toFixed(2) + "%";
}

// Función para limpiar el simulador Bullet
function limpiarSimulacionBullet() {
  document.getElementById('formBullet').reset();
  document.querySelector('#infoTotalCreditoBullet .info-value').textContent = "--";
  document.querySelector('#infoTotalInteresesBullet .info-value').textContent = "--";
  document.querySelector('#infoSeguroDesgravamenBullet .info-value').textContent = "--";
  document.querySelector('#infoCAE_Bullet .info-value').textContent = "--";
}

function mostrarSimuladorCategoria(categoria) {
  // Ocultar el contenedor de tarjetas
  document.getElementById('tarjetasSimulador').style.display = 'none';
  
  // Según la categoría, se muestra el simulador correspondiente
  if (categoria === 'credito') {
    document.getElementById('simuladorCredito').style.display = 'block';
    document.getElementById('simuladorInversiones').style.display = 'none';
  } else if (categoria === 'inversiones') {
    document.getElementById('simuladorCredito').style.display = 'none';
    document.getElementById('simuladorInversiones').style.display = 'block';
  }
}


/* =========================
       SECCIÓN PARA MÓVIL
   ========================= */

// Función para el menú móvil
function toggleMenu() {
  document.querySelector(".mobile-menu").classList.toggle("show");
}

document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", function () {
    document.querySelector(".mobile-menu").classList.remove("show");
  });
});

