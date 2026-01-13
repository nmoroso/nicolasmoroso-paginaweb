/* =========================
   SECCIÓN SIMULADOR INVERSIONES
   ========================= */

   let chartInstance;
   const getTranslation = (key, fallback) => {
     if (window.t) {
       const translated = window.t(key);
       return translated === key ? fallback : translated;
     }
     return fallback;
   };

   Chart.defaults.font.family = "'Montserrat', sans-serif";
   Chart.defaults.color = "#2E4057";
   Chart.defaults.font.size = 14;
   
   function formatMoney(input) {
     let value = parseFloat(input.value.replace(/[^0-9.-]+/g, ""));
     if (isNaN(value)) { input.value = ""; return; }
     input.value = value.toLocaleString('es-CL', { maximumFractionDigits: 0 });
   }
   function removeFormatting(input) {
     input.value = input.value.replace(/\./g, "");
   }
   function formatPercentage(input) {
     let value = parseFloat(
       input.value.replace(/[^0-9.,-]+/g, "").replace(",", ".")
     );
     if (isNaN(value)) { input.value = ""; return; }
     input.value = value.toLocaleString('es-CL', {
       minimumFractionDigits: 2,
       maximumFractionDigits: 2
     });
   }
   function removePercentageFormatting(input) {
     input.value = input.value.replace(/,/g, ".");
   }
   
   function calcularInversion() {
     const frecuencia   = document.getElementById('frecuencia').value;
     const plazoInput   = parseFloat(
       document.getElementById('plazo').value.replace(/[^\d.-]/g, '')
     ) || 0;
   
     const tasaInput    = parseFloat(
       document.getElementById('tasa').value
         .replace(/,/g, '.')
         .replace(/[^\d.-]/g, '')
     ) || 0;
   
     // AHORA quitamos **todos** los no-dígitos (puntos incluidos)
     const montoInicial = parseFloat(
       document.getElementById('montoInicial').value.replace(/\D/g, '')
     ) || 0;
   
     const montoMensual = parseFloat(
       document.getElementById('montoMensual').value.replace(/\D/g, '')
     ) || 0;
   
     let inversionTotal = 0;
     const labels            = [];
     const capitalDataPoints = [];
     const interestDataPoints= [];
     const totalDataPoints   = [];
   
     if (frecuencia === 'mensual') {
       const n = plazoInput;
       const tm = tasaInput/100;
       for (let i=0; i<=n; i++) {
         const totalValue =
           montoInicial * Math.pow(1+tm, i) +
           (tm===0
             ? montoMensual*i
             : montoMensual*((Math.pow(1+tm,i)-1)/tm)
           );
         labels.push(`${getTranslation('investments.labels.month', 'Mes')} ${i}`);
         const capital = montoInicial + montoMensual*i;
         const interes = totalValue - capital;
         totalDataPoints.push(+totalValue.toFixed(0));
         capitalDataPoints.push(+capital.toFixed(0));
         interestDataPoints.push(+interes.toFixed(0));
         if (i===n) inversionTotal = totalValue;
       }
     } else {
       const n = plazoInput;
       const ta = tasaInput/100;
       const years = Math.floor(n);
       for (let i=0; i<=years; i++) {
         const totalValue =
           montoInicial * Math.pow(1+ta,i) +
           (ta===0
             ? montoMensual*12*i
             : montoMensual*12*((Math.pow(1+ta,i)-1)/ta)
           );
         labels.push(`${getTranslation('investments.labels.year', 'Año')} ${i}`);
         const capital = montoInicial + montoMensual*12*i;
         const interes = totalValue - capital;
         totalDataPoints.push(+totalValue.toFixed(0));
         capitalDataPoints.push(+capital.toFixed(0));
         interestDataPoints.push(+interes.toFixed(0));
         if (i===years) inversionTotal = totalValue;
       }
       if (n>years) {
         const totalValue =
           montoInicial * Math.pow(1+ta,n) +
           (ta===0
             ? montoMensual*12*n
             : montoMensual*12*((Math.pow(1+ta,n)-1)/ta)
           );
         labels.push(`${getTranslation('investments.labels.year', 'Año')} ${n.toFixed(1)}`);
         const capital = montoInicial + montoMensual*12*n;
         const interes = totalValue - capital;
         totalDataPoints.push(+totalValue.toFixed(0));
         capitalDataPoints.push(+capital.toFixed(0));
         interestDataPoints.push(+interes.toFixed(0));
         inversionTotal = totalValue;
       }
     }
   
     const estimatedLabel = getTranslation('investments.results.estimatedValue', 'Valor estimado al final del plazo:');
     document.getElementById('resultado').innerHTML =
       `${estimatedLabel} <strong>$${Intl.NumberFormat('es-CL',{ maximumFractionDigits:0 }).format(inversionTotal)}</strong>`;
   
     actualizarGrafico(labels, capitalDataPoints, interestDataPoints, totalDataPoints, frecuencia);
   }
   
   function actualizarGrafico(labels, capitalDataPoints, interestDataPoints, totalDataPoints, frecuencia) {
     const ctx = document.getElementById('chart').getContext('2d');
     if (chartInstance) chartInstance.destroy();
     chartInstance = new Chart(ctx, {
       type: 'line',
       data: { labels,
         datasets: [
           { label:getTranslation('investments.chart.capital', 'Capital Invertido'), data:capitalDataPoints, borderColor:'blue', backgroundColor:'rgba(0,0,255,0.1)', fill:false, tension:0.2 },
           { label:getTranslation('investments.chart.interest', 'Intereses Generados'), data:interestDataPoints, borderColor:'green', backgroundColor:'rgba(0,255,0,0.1)', fill:false, tension:0.2 },
           { label:getTranslation('investments.chart.total', 'Total Patrimonio'), data:totalDataPoints, borderColor:'#457B9D', backgroundColor:'rgba(69,123,157,0.1)', fill:false, tension:0.2 }
         ]
       },
       options: {
         responsive: true,
         maintainAspectRatio: false,
         plugins:{ legend:{ display:true, position:'top', labels:{boxWidth:20,boxHeight:20,padding:10} } },
         scales:{
           x:{ title:{ display:true, text: frecuencia==='mensual'
             ? getTranslation('investments.chart.axisMonths', 'Meses')
             : getTranslation('investments.chart.axisYears', 'Años') } },
           y:{ title:{ display:true, text:getTranslation('investments.chart.axisValue', 'Valor (MM$)') },
               ticks:{ callback:v=> (v/1e6).toLocaleString('es-CL',{minimumFractionDigits:1,maximumFractionDigits:1})+` ${getTranslation('investments.chart.suffix', 'MM$')}` }
           }
         }
       }
     });
   }
   
   function limpiarSimulador(){
     ['frecuencia','plazo','tasa','montoInicial','montoMensual'].forEach(id=>{
       const el=document.getElementById(id);
       if(!el)return;
       if(el.tagName.toLowerCase()==='select')el.selectedIndex=0;
       else el.value='';
     });
     const r=document.getElementById('resultado'); if(r)r.innerText='';
     if(chartInstance){ chartInstance.destroy(); chartInstance=null; }
   }
   
/* =====================
   DOMContentLoaded
   ===================== */
document.addEventListener('DOMContentLoaded', () => {
  // Panel de referencia
  const btnOpen  = document.getElementById('toggle-referencia');
  const btnClose = document.getElementById('close-referencia');
  const panel    = document.getElementById('referencia-panel');
  const overlay  = document.createElement('div');
  overlay.className = 'referencia-overlay';
  document.body.appendChild(overlay);

  function openPanel() {
    panel.classList.add('active');
    overlay.classList.add('active');
  }
  function closePanel() {
    panel.classList.remove('active');
    overlay.classList.remove('active');
  }
  btnOpen && btnOpen.addEventListener('click', openPanel);
  btnClose && btnClose.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  // Color del select “frecuencia”
  const frecuenciaSelect = document.getElementById('frecuencia');
  if (frecuenciaSelect) {
    const updateSelectColor = () => {
      frecuenciaSelect.classList.toggle('orange-f', frecuenciaSelect.value === 'mensual');
    };
    frecuenciaSelect.addEventListener('change', updateSelectColor);
    updateSelectColor();
  }

  // Autocompletado de inputs (sin plazo)
  (function(){
    const tasa      = document.getElementById('tasa');
    const montoIni  = document.getElementById('montoInicial');
    const montoMens = document.getElementById('montoMensual');

    // TASA → “X%”
    if (tasa) {
      tasa.addEventListener('focus',  ()=> tasa.value = tasa.value.replace(/[^0-9.,]/g, ''));
      tasa.addEventListener('blur',   ()=>{
        let v = tasa.value.replace(',', '.').replace(/[^0-9.]/g, '');
        tasa.value = v ? `${v}%` : '';
      });
    }

    // MONTO INICIAL → “$1.234.567”
    if (montoIni) {
      montoIni.addEventListener('focus', ()=> montoIni.value = montoIni.value.replace(/\D/g, ''));
      montoIni.addEventListener('blur',  ()=>{
        const num = montoIni.value.replace(/\D/g, '');
        montoIni.value = num ? `$${Number(num).toLocaleString('es-CL')}` : '';
      });
    }

    // MONTO MENSUAL → “$1.234.567”
    if (montoMens) {
      montoMens.addEventListener('focus', ()=> montoMens.value = montoMens.value.replace(/\D/g, ''));
      montoMens.addEventListener('blur',  ()=>{
        const num = montoMens.value.replace(/\D/g, '');
        montoMens.value = num ? `$${Number(num).toLocaleString('es-CL')}` : '';
      });
    }
    
  })();
});
