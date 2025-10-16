const COLOR_SOLID = '#2ECC71';
const COLOR_MEDIUM = '#F1C40F';
const COLOR_RISK = '#E74C3C';
const COLOR_PRIMARY = '#2C82C9';
const COLOR_TEXT = '#2C3E50';

const LABEL_PATTERNS = [
  { key: 'activoCorriente', patterns: ['activo corriente', 'activos corrientes', 'total activo corriente', 'activo circulante', 'activo corriente total'] },
  { key: 'pasivoCorriente', patterns: ['pasivo corriente', 'pasivos corrientes', 'total pasivo corriente', 'pasivo circulante', 'pasivo corriente total'] },
  { key: 'inventarios', patterns: ['inventarios', 'existencias', 'stock'] },
  { key: 'cxcComerciales', patterns: ['cuentas por cobrar comerciales', 'deudores comerciales', 'clientes por cobrar', 'cuentas por cobrar clientes'] },
  { key: 'cxcRelacionadas', patterns: ['cuentas por cobrar relacionadas', 'deudores relacionados', 'cuentas por cobrar partes relacionadas'] },
  { key: 'otrasCxc', patterns: ['otras cuentas por cobrar', 'otros deudores', 'cuentas por cobrar diversas', 'otros activos corrientes', 'otros activos circulantes'] },
  { key: 'cxpComerciales', patterns: ['cuentas por pagar comerciales', 'proveedores', 'acreedores comerciales', 'cuentas por pagar a proveedores'] },
  { key: 'ingresosDiferidos', patterns: ['ingresos diferidos', 'pasivos por ingresos diferidos'] },
  { key: 'pasivosOperativos', patterns: ['pasivos operativos', 'pasivos no financieros', 'otros pasivos operativos'] },
  { key: 'otrosPasivosCorrientes', patterns: ['otros pasivos corrientes', 'otros pasivos circulantes', 'pasivos diversos corrientes'] },
  { key: 'deudaFinancieraCp', patterns: ['deuda financiera corto plazo', 'deuda financiera corriente', 'obligaciones financieras corrientes', 'obligaciones bancarias corrientes', 'deuda financiera cp', 'pasivos financieros corrientes'] },
  { key: 'deudaFinancieraLp', patterns: ['deuda financiera largo plazo', 'deuda financiera no corriente', 'obligaciones financieras no corrientes', 'obligaciones bancarias no corrientes', 'deuda financiera lp', 'pasivos financieros no corrientes'] },
  { key: 'pasivoTotal', patterns: ['pasivo total', 'total pasivo', 'total pasivos', 'pasivos totales'] },
  { key: 'patrimonio', patterns: ['patrimonio', 'patrimonio neto', 'patrimonio total', 'total patrimonio', 'patrimonio atribuible a los propietarios', 'patrimonio atribuible a los dueños'] },
  { key: 'ventas', patterns: ['ventas', 'ingresos de actividades ordinarias', 'ingresos operacionales', 'ingresos por ventas', 'ingresos de explotacion'] },
  { key: 'costoVentas', patterns: ['costo de ventas', 'costos de ventas', 'costo de los productos vendidos', 'costo de ventas y servicios'] },
  { key: 'ebit', patterns: ['resultado operacional', 'resultado de explotacion', 'utilidad operativa', 'ebit', 'ganancia antes de intereses e impuestos'] },
  { key: 'resultadoNeto', patterns: ['resultado neto', 'utilidad neta', 'ganancia neta', 'ganancia (perdida) del ejercicio', 'resultado del ejercicio', 'utilidad (perdida) del ejercicio'] },
  { key: 'totalActivos', patterns: ['total activos', 'activo total', 'total activo', 'activos totales'] },
  { key: 'gastosFinancieros', patterns: ['gastos financieros', 'costos financieros', 'intereses pagados'] },
  { key: 'remuneracionesPorPagar', patterns: ['remuneraciones por pagar', 'sueldos por pagar', 'remuneraciones y beneficios por pagar'] },
  { key: 'cargasSociales', patterns: ['cargas sociales', 'cotizaciones previsionales por pagar', 'obligaciones previsionales'] },
  { key: 'impuestosPorPagar', patterns: ['impuestos por pagar', 'tributos por pagar', 'iva por pagar', 'impuesto a la renta por pagar'] }
];

const FRIENDLY_NAMES = {
  activoCorriente: 'Activo Corriente',
  pasivoCorriente: 'Pasivo Corriente',
  inventarios: 'Inventarios',
  cxcComerciales: 'Cuentas por Cobrar Comerciales',
  cxcRelacionadas: 'Cuentas por Cobrar Relacionadas',
  otrasCxc: 'Otras Cuentas por Cobrar',
  cxpComerciales: 'Cuentas por Pagar Comerciales',
  ingresosDiferidos: 'Ingresos Diferidos',
  pasivosOperativos: 'Pasivos Operativos',
  otrosPasivosCorrientes: 'Otros Pasivos Corrientes',
  deudaFinancieraCp: 'Deuda Financiera CP',
  deudaFinancieraLp: 'Deuda Financiera LP',
  pasivoTotal: 'Pasivo Total',
  patrimonio: 'Patrimonio',
  ventas: 'Ventas',
  costoVentas: 'Costo de Ventas',
  ebit: 'EBIT',
  resultadoNeto: 'Resultado Neto',
  totalActivos: 'Total Activos',
  gastosFinancieros: 'Gastos Financieros',
  remuneracionesPorPagar: 'Remuneraciones por Pagar',
  cargasSociales: 'Cargas Sociales',
  impuestosPorPagar: 'Impuestos por Pagar'
};

const KPI_THRESHOLDS = {
  razonCorriente: value => value == null ? null : value > 1.5 ? 'solido' : value >= 1.0 ? 'medio' : 'riesgoso',
  pruebaAcida: value => value == null ? null : value > 1.2 ? 'solido' : value >= 0.8 ? 'medio' : 'riesgoso',
  pasivoPatrimonio: value => value == null ? null : value < 1 ? 'solido' : value <= 2 ? 'medio' : 'riesgoso',
  margenNeto: value => value == null ? null : value > 0.10 ? 'solido' : value >= 0.05 ? 'medio' : 'riesgoso',
  roe: value => value == null ? null : value > 0.20 ? 'solido' : value >= 0.10 ? 'medio' : 'riesgoso',
  cce: value => value == null ? null : value < 30 ? 'solido' : value <= 60 ? 'medio' : 'riesgoso'
};

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('balance-input');
  const processBtn = document.getElementById('process-btn');
  const clearBtn = document.getElementById('clear-btn');
  const errorBox = document.getElementById('input-error');
  const reportSection = document.getElementById('report');

  if (!input || !processBtn || !clearBtn) return;

  const charts = {
    waterfall: null,
    gaugeRc: null,
    gaugePa: null,
    margins: null,
    doughnut: null
  };

  processBtn.addEventListener('click', () => {
    errorBox.textContent = '';
    const rawText = input.value.trim();
    if (!rawText) {
      errorBox.textContent = 'Ingresa la información financiera para generar el informe.';
      reportSection.classList.add('hidden');
      return;
    }

    const parsed = parseBalanceInput(rawText);
    if (Object.keys(parsed.values).length === 0) {
      errorBox.textContent = 'No se identificaron cifras válidas. Revisa el formato del archivo (dos columnas con etiquetas y montos).';
      reportSection.classList.add('hidden');
      return;
    }

    const result = computeIndicators(parsed.values);
    renderReport(result, parsed.rawLines, charts);
    reportSection.classList.remove('hidden');
    reportSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    errorBox.textContent = '';
    reportSection.classList.add('hidden');
    Object.keys(charts).forEach(key => {
      if (charts[key]) {
        Plotly.purge(charts[key]);
        charts[key] = null;
      }
    });
  });
});

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapLabel(label) {
  const normalized = normalizeText(label);
  for (const { key, patterns } of LABEL_PATTERNS) {
    for (const patternRaw of patterns) {
      const pattern = normalizeText(patternRaw);
      if (!pattern) continue;
      if (normalized === pattern || normalized.includes(pattern)) {
        return key;
      }
    }
  }
  return null;
}

function parseBalanceInput(text) {
  const lines = text.split(/\r?\n/);
  const values = {};
  const rawLines = [];

  for (const line of lines) {
    const clean = line.trim();
    if (!clean) continue;

    const numbers = clean.match(/\(?-?[0-9][0-9.,]*\)?/g);
    if (!numbers || numbers.length === 0) continue;

    const numberToken = numbers[0];
    let numeric = parseAmount(numberToken);
    if (Number.isNaN(numeric)) continue;

    let labelPart = clean.slice(0, clean.indexOf(numberToken)).trim();
    if (!labelPart) {
      const numericIndex = clean.search(/-?[0-9]/);
      labelPart = numericIndex > 0 ? clean.slice(0, numericIndex).trim() : clean;
    }

    const mappedKey = mapLabel(labelPart);
    rawLines.push({ label: labelPart, value: numeric });

    if (!mappedKey) continue;
    if (values[mappedKey] == null) {
      values[mappedKey] = numeric;
    }
  }

  return { values, rawLines };
}

function parseAmount(str) {
  const trimmed = str.trim();
  if (!trimmed) return NaN;
  const isNegative = /^\(.+\)$/.test(trimmed);
  const cleaned = trimmed.replace(/[()]/g, '');
  const normalized = cleaned
    .replace(/[^0-9,.-]/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(/,(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.');
  const value = parseFloat(normalized);
  return isNegative ? -value : value;
}

function computeIndicators(values) {
  const notes = [];
  const warnings = [];

  const get = key => values[key];
  const friendly = key => FRIENDLY_NAMES[key] || key;

  const computeMetric = (label, requiredKeys, formula) => {
    const missing = requiredKeys.filter(key => get(key) == null);
    if (missing.length) {
      notes.push({ label, reason: `Datos faltantes: ${missing.map(friendly).join(', ')}` });
      return null;
    }
    const inputs = requiredKeys.map(key => get(key));
    const result = formula(inputs);
    if (result == null || Number.isNaN(result) || !Number.isFinite(result)) {
      notes.push({ label, reason: 'No se pudo calcular (revisa denominadores en cero o cifras faltantes).' });
      return null;
    }
    return result;
  };

  const activoCorriente = get('activoCorriente');
  const pasivoCorriente = get('pasivoCorriente');
  const inventarios = get('inventarios');
  const cxcComerciales = get('cxcComerciales');
  const cxcRelacionadas = get('cxcRelacionadas') ?? 0;
  const otrasCxc = get('otrasCxc') ?? 0;
  const cxpComerciales = get('cxpComerciales');
  const ingresosDiferidos = get('ingresosDiferidos') ?? 0;
  const pasivosOperativos = get('pasivosOperativos') ?? 0;
  const otrosPasivosCorrientes = get('otrosPasivosCorrientes') ?? 0;
  const deudaFinancieraCp = get('deudaFinancieraCp') ?? null;
  const deudaFinancieraLp = get('deudaFinancieraLp') ?? null;
  const pasivoTotal = get('pasivoTotal');
  const patrimonio = get('patrimonio');
  const ventas = get('ventas');
  const costoVentas = get('costoVentas');
  const ebit = get('ebit');
  const resultadoNeto = get('resultadoNeto');
  const totalActivos = get('totalActivos');
  const gastosFinancieros = get('gastosFinancieros');
  const remuneracionesPorPagar = get('remuneracionesPorPagar');
  const cargasSociales = get('cargasSociales');
  const impuestosPorPagar = get('impuestosPorPagar');

  const razonCorriente = computeMetric('Razón Corriente', ['activoCorriente', 'pasivoCorriente'], ([ac, pc]) => pc === 0 ? null : ac / pc);
  const pruebaAcida = computeMetric('Prueba Ácida', ['activoCorriente', 'pasivoCorriente', 'inventarios'], ([ac, pc, inv]) => pc === 0 ? null : (ac - inv) / pc);
  const fondoManiobra = computeMetric('Fondo de Maniobra', ['activoCorriente', 'pasivoCorriente'], ([ac, pc]) => ac - pc);

  let necesidadesFondo = null;
  if (cxcComerciales == null || inventarios == null || cxpComerciales == null) {
    const missingKeys = [];
    if (inventarios == null) missingKeys.push(friendly('inventarios'));
    if (cxcComerciales == null) missingKeys.push(friendly('cxcComerciales'));
    if (cxpComerciales == null) missingKeys.push(friendly('cxpComerciales'));
    notes.push({ label: 'Necesidades Operativas de Fondo', reason: `Datos faltantes: ${missingKeys.join(', ')}` });
  } else {
    necesidadesFondo = inventarios + cxcComerciales + (get('cxcRelacionadas') ?? 0) + (get('otrasCxc') ?? 0) - (cxpComerciales + (get('ingresosDiferidos') ?? 0) + (get('pasivosOperativos') ?? 0) + (get('otrosPasivosCorrientes') ?? 0));
  }

  let tesoreriaNeta = null;
  if (fondoManiobra == null || necesidadesFondo == null) {
    notes.push({ label: 'Tesorería Neta', reason: 'Requiere Fondo de Maniobra y NOF calculados.' });
  } else {
    tesoreriaNeta = fondoManiobra - necesidadesFondo;
  }

  const pasivoPatrimonio = computeMetric('Pasivo / Patrimonio', ['pasivoTotal', 'patrimonio'], ([pt, patr]) => patr === 0 ? null : pt / patr);
  const pasivoActivo = computeMetric('Pasivo / Activo', ['pasivoTotal', 'totalActivos'], ([pt, ta]) => ta === 0 ? null : pt / ta);

  let deudaFinancieraTotal = null;
  if (deudaFinancieraCp == null && deudaFinancieraLp == null) {
    notes.push({ label: 'Deuda Financiera Total', reason: 'No se identificó deuda financiera de corto ni largo plazo.' });
  } else {
    deudaFinancieraTotal = (deudaFinancieraCp ?? 0) + (deudaFinancieraLp ?? 0);
  }

  let porcentajeDeudaFinancieraPasivo = null;
  if (deudaFinancieraTotal == null || pasivoTotal == null) {
    notes.push({ label: 'Participación de la Deuda Financiera', reason: 'Requiere Deuda Financiera Total y Pasivo Total.' });
  } else if (pasivoTotal === 0) {
    notes.push({ label: 'Participación de la Deuda Financiera', reason: 'Pasivo Total igual a cero.' });
  } else {
    porcentajeDeudaFinancieraPasivo = deudaFinancieraTotal / pasivoTotal;
  }

  const margenBruto = computeMetric('Margen Bruto', ['ventas', 'costoVentas'], ([v, c]) => v === 0 ? null : (v - c) / v);
  const margenOperacional = computeMetric('Margen Operacional', ['ventas', 'ebit'], ([v, e]) => v === 0 ? null : e / v);
  const margenNeto = computeMetric('Margen Neto', ['ventas', 'resultadoNeto'], ([v, rn]) => v === 0 ? null : rn / v);
  const roa = computeMetric('ROA', ['resultadoNeto', 'totalActivos'], ([rn, ta]) => ta === 0 ? null : rn / ta);
  const roe = computeMetric('ROE', ['resultadoNeto', 'patrimonio'], ([rn, patr]) => patr === 0 ? null : rn / patr);

  let coberturaGastosFinancieros = null;
  let coberturaTexto = null;
  if (ebit == null) {
    notes.push({ label: 'Cobertura de Gastos Financieros', reason: 'Falta EBIT.' });
  } else if (gastosFinancieros == null) {
    notes.push({ label: 'Cobertura de Gastos Financieros', reason: 'Faltan Gastos Financieros.' });
  } else if (gastosFinancieros === 0) {
    coberturaTexto = 'No aplica (sin gastos financieros)';
  } else {
    coberturaGastosFinancieros = ebit / gastosFinancieros;
  }

  let riesgoFiscalLaboral = null;
  if (remuneracionesPorPagar == null || cargasSociales == null || impuestosPorPagar == null || pasivoTotal == null) {
    notes.push({ label: 'Pasivos Fiscales y Previsionales', reason: 'Se requieren Remuneraciones, Cargas Sociales, Impuestos por Pagar y Pasivo Total.' });
  } else if (pasivoTotal === 0) {
    notes.push({ label: 'Pasivos Fiscales y Previsionales', reason: 'Pasivo Total igual a cero.' });
  } else {
    riesgoFiscalLaboral = (remuneracionesPorPagar + cargasSociales + impuestosPorPagar) / pasivoTotal;
  }

  const dso = computeMetric('DSO', ['cxcComerciales', 'ventas'], ([cxc, v]) => v === 0 ? null : (cxc / v) * 365);
  const dio = computeMetric('DIO', ['inventarios', 'costoVentas'], ([inv, cv]) => cv === 0 ? null : (inv / cv) * 365);
  const dpo = computeMetric('DPO', ['cxpComerciales', 'costoVentas'], ([cxp, cv]) => cv === 0 ? null : (cxp / cv) * 365);

  let cce = null;
  if (dso == null || dio == null || dpo == null) {
    notes.push({ label: 'Ciclo de Conversión de Efectivo', reason: 'Requiere DSO, DIO y DPO disponibles.' });
  } else {
    cce = dso + dio - dpo;
  }

  if (totalActivos != null && pasivoTotal != null && patrimonio != null) {
    const difference = Math.abs(totalActivos - (pasivoTotal + patrimonio));
    const tolerance = Math.max(Math.abs(totalActivos) * 0.005, 1);
    if (difference > tolerance) {
      warnings.push('Alerta: Total Activos no coincide con Pasivo + Patrimonio. Revisa la consistencia del balance.');
    }
  }

  const indicators = {
    razonCorriente,
    pruebaAcida,
    fondoManiobra,
    necesidadesFondo,
    tesoreriaNeta,
    pasivoPatrimonio,
    pasivoActivo,
    deudaFinancieraTotal,
    porcentajeDeudaFinancieraPasivo,
    margenBruto,
    margenOperacional,
    margenNeto,
    roa,
    roe,
    coberturaGastosFinancieros,
    coberturaTexto,
    riesgoFiscalLaboral,
    dso,
    dio,
    dpo,
    cce,
    activoCorriente,
    pasivoCorriente,
    inventarios,
    cxcComerciales,
    cxcRelacionadas,
    otrasCxc,
    cxpComerciales,
    ingresosDiferidos,
    pasivosOperativos,
    otrosPasivosCorrientes,
    deudaFinancieraCp,
    deudaFinancieraLp,
    pasivoTotal,
    patrimonio,
    ventas,
    costoVentas,
    ebit,
    resultadoNeto,
    totalActivos,
    gastosFinancieros,
    remuneracionesPorPagar,
    cargasSociales,
    impuestosPorPagar
  };

  const levels = {
    razonCorriente: KPI_THRESHOLDS.razonCorriente(indicators.razonCorriente),
    pruebaAcida: KPI_THRESHOLDS.pruebaAcida(indicators.pruebaAcida),
    pasivoPatrimonio: KPI_THRESHOLDS.pasivoPatrimonio(indicators.pasivoPatrimonio),
    margenNeto: KPI_THRESHOLDS.margenNeto(indicators.margenNeto),
    roe: KPI_THRESHOLDS.roe(indicators.roe),
    cce: KPI_THRESHOLDS.cce(indicators.cce)
  };

  return { indicators, notes, warnings, levels };
}

function renderReport(result, rawLines, charts) {
  const { indicators, notes, warnings, levels } = result;

  renderWarnings(warnings);
  renderExecutiveSummary(indicators, levels, warnings);
  renderLiquiditySection(indicators, levels, charts);
  renderDebtSection(indicators, levels, charts);
  renderProfitabilitySection(indicators, charts);
  renderRiskSection(indicators);
  renderConclusion(indicators, levels);
  renderNotes(notes);
}

function renderWarnings(warnings) {
  const warningBox = document.getElementById('warnings');
  if (!warningBox) return;
  if (!warnings || warnings.length === 0) {
    warningBox.classList.add('hidden');
    warningBox.innerHTML = '';
    return;
  }
  warningBox.classList.remove('hidden');
  warningBox.innerHTML = warnings.map(w => `<p>${w}</p>`).join('');
}

function renderExecutiveSummary(indicators, levels, warnings) {
  const list = document.getElementById('executive-summary');
  if (!list) return;
  list.innerHTML = '';
  const bullets = [];

  if (levels.razonCorriente === 'solido') {
    bullets.push(`Liquidez holgada: la razón corriente se ubica en ${formatRatio(indicators.razonCorriente)} con tesorería neta ${formatCurrency(indicators.tesoreriaNeta)}.`);
  } else if (levels.razonCorriente === 'riesgoso') {
    bullets.push(`Liquidez presionada: razón corriente en ${formatRatio(indicators.razonCorriente)}, lo que exige reforzar capital de trabajo.`);
  }

  if (indicators.tesoreriaNeta != null && indicators.tesoreriaNeta < 0) {
    bullets.push(`Brecha de corto plazo: tesorería neta negativa por ${formatCurrency(Math.abs(indicators.tesoreriaNeta))}, se recomienda revisar financiamiento táctico.`);
  } else if (indicators.tesoreriaNeta != null && indicators.tesoreriaNeta > 0) {
    bullets.push(`Liquidez operativa positiva: tesorería neta disponible de ${formatCurrency(indicators.tesoreriaNeta)}.`);
  }

  if (levels.pasivoPatrimonio === 'riesgoso') {
    bullets.push(`Apalancamiento elevado: el pasivo equivale a ${formatRatio(indicators.pasivoPatrimonio)} veces el patrimonio.`);
  } else if (levels.pasivoPatrimonio === 'solido') {
    bullets.push(`Apalancamiento conservador: deuda/patrimonio en ${formatRatio(indicators.pasivoPatrimonio)}.`);
  }

  if (levels.margenNeto === 'riesgoso') {
    bullets.push(`Margen neto debilitado (${formatPercent(indicators.margenNeto)}), urge revisar precios y estructura de costos.`);
  } else if (levels.margenNeto === 'solido') {
    bullets.push(`Rentabilidad final sólida con margen neto de ${formatPercent(indicators.margenNeto)}.`);
  }

  if (levels.roe === 'riesgoso') {
    bullets.push(`Retorno al patrimonio limitado (${formatPercent(indicators.roe)}), ajustar estrategia de rentabilidad.`);
  } else if (levels.roe === 'solido') {
    bullets.push(`ROE competitivo en ${formatPercent(indicators.roe)}, reflejando buena generación de valor.`);
  }

  if (indicators.riesgoFiscalLaboral != null) {
    const porcentaje = indicators.riesgoFiscalLaboral * 100;
    if (porcentaje > 10) {
      bullets.push(`Alerta laboral-fiscal: pasivos previsionales alcanzan ${formatPercent(indicators.riesgoFiscalLaboral)} del pasivo total.`);
    } else {
      bullets.push(`Pasivos previsionales acotados (${formatPercent(indicators.riesgoFiscalLaboral)} del pasivo total).`);
    }
  }

  if (warnings && warnings.length > 0) {
    bullets.push('Se detectaron inconsistencias contables que deben revisarse antes de tomar decisiones.');
  }

  const topBullets = bullets.slice(0, 5);
  topBullets.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  });
}

function renderLiquiditySection(indicators, levels, charts) {
  const text = document.getElementById('liquidity-text');
  if (text) {
    const parts = [];
    if (indicators.fondoManiobra != null) {
      parts.push(`Fondo de maniobra ${formatCurrency(indicators.fondoManiobra)}.`);
    }
    if (indicators.necesidadesFondo != null) {
      const signo = indicators.necesidadesFondo >= 0 ? 'que requiere' : 'que libera';
      parts.push(`Las NOF son ${formatCurrency(Math.abs(indicators.necesidadesFondo))}, ${signo} capital.`);
    }
    if (indicators.tesoreriaNeta != null) {
      const estado = indicators.tesoreriaNeta >= 0 ? 'superávit' : 'déficit';
      parts.push(`Tesorería neta en ${estado} de ${formatCurrency(Math.abs(indicators.tesoreriaNeta))}.`);
    }
    if (parts.length === 0) {
      parts.push('No se pudo interpretar la liquidez por falta de datos clave.');
    }
    text.textContent = parts.join(' ');
  }

  renderWaterfall(indicators, charts);
  renderGauge('gauge-rc', indicators.razonCorriente, {
    title: 'Razón Corriente',
    max: Math.max(2.5, Math.ceil((indicators.razonCorriente || 0) * 1.2)),
    thresholds: [
      { range: [0, 1], color: COLOR_RISK },
      { range: [1, 1.5], color: COLOR_MEDIUM },
      { range: [1.5, undefined], color: COLOR_SOLID }
    ]
  }, charts, 'gaugeRc');

  renderGauge('gauge-pa', indicators.pruebaAcida, {
    title: 'Prueba Ácida',
    max: Math.max(2, Math.ceil((indicators.pruebaAcida || 0) * 1.3)),
    thresholds: [
      { range: [0, 0.8], color: COLOR_RISK },
      { range: [0.8, 1.2], color: COLOR_MEDIUM },
      { range: [1.2, undefined], color: COLOR_SOLID }
    ]
  }, charts, 'gaugePa');
}

function renderWaterfall(indicators, charts) {
  const container = document.getElementById('waterfall-chart');
  if (!container) return;
  if (indicators.fondoManiobra == null || indicators.necesidadesFondo == null || indicators.tesoreriaNeta == null) {
    container.innerHTML = '<div class="nd-placeholder">ND</div>';
    if (charts.waterfall) {
      Plotly.purge(charts.waterfall);
      charts.waterfall = null;
    }
    return;
  }

  const fm = toMillions(indicators.fondoManiobra);
  const nof = toMillions(indicators.necesidadesFondo);
  const tn = toMillions(indicators.tesoreriaNeta);

  const data = [{
    type: 'waterfall',
    measure: ['relative', 'relative', 'total'],
    x: ['Fondo de Maniobra', 'NOF', 'Tesorería Neta'],
    y: [fm, -nof, tn],
    text: [formatCurrency(indicators.fondoManiobra), formatCurrency(indicators.necesidadesFondo), formatCurrency(indicators.tesoreriaNeta)],
    textposition: 'outside',
    connector: { line: { color: '#5D6D7E' } },
    increasing: { marker: { color: COLOR_SOLID } },
    decreasing: { marker: { color: COLOR_RISK } },
    totals: { marker: { color: COLOR_PRIMARY } }
  }];

  const layout = {
    margin: { t: 20, l: 40, r: 20, b: 40 },
    yaxis: {
      title: 'M$',
      tickformat: ',.0f'
    },
    xaxis: {
      automargin: true
    },
    paper_bgcolor: '#f9fbfe',
    plot_bgcolor: '#f9fbfe'
  };

  Plotly.react(container, data, layout, { displayModeBar: false, responsive: true });
  charts.waterfall = container;
}

function renderGauge(containerId, value, options, charts, chartKey) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (value == null) {
    container.innerHTML = '<div class="nd-placeholder">ND</div>';
    if (charts[chartKey]) {
      Plotly.purge(charts[chartKey]);
      charts[chartKey] = null;
    }
    return;
  }

  const max = options.max || Math.max(1, value * 1.2);
  const steps = [];
  let lastStart = 0;
  options.thresholds.forEach(threshold => {
    const end = threshold.range[1] ?? max;
    steps.push({ range: [lastStart, Math.min(end, max)], color: threshold.color });
    lastStart = end;
  });

  const data = [{
    type: 'indicator',
    mode: 'gauge+number',
    value,
    number: { valueformat: '.2f', font: { family: 'Montserrat', size: 26 } },
    gauge: {
      axis: { range: [0, max], tickwidth: 1, tickcolor: '#95A5A6' },
      steps,
      bar: { color: '#34495E' }
    }
  }];

  const layout = {
    margin: { t: 10, b: 10, l: 10, r: 10 },
    paper_bgcolor: '#f9fbfe',
    font: { family: 'Montserrat', color: COLOR_TEXT }
  };

  Plotly.react(container, data, layout, { displayModeBar: false, responsive: true });
  charts[chartKey] = container;
}

function renderDebtSection(indicators, levels, charts) {
  const text = document.getElementById('debt-text');
  if (text) {
    const fragments = [];
    if (indicators.pasivoPatrimonio != null) {
      fragments.push(`Pasivo/Patrimonio en ${formatRatio(indicators.pasivoPatrimonio)}.`);
    }
    if (indicators.pasivoActivo != null) {
      fragments.push(`Pasivo/Activo en ${formatRatio(indicators.pasivoActivo)}.`);
    }
    if (indicators.deudaFinancieraTotal != null && indicators.pasivoTotal != null) {
      fragments.push(`La deuda financiera representa ${formatPercent(indicators.porcentajeDeudaFinancieraPasivo)} del pasivo total.`);
    }
    if (indicators.coberturaGastosFinancieros != null) {
      fragments.push(`Cobertura de gastos financieros: ${formatRatio(indicators.coberturaGastosFinancieros)}x.`);
    } else if (indicators.coberturaTexto) {
      fragments.push(indicators.coberturaTexto);
    }
    if (fragments.length === 0) {
      fragments.push('Sin información suficiente para analizar el apalancamiento.');
    }
    text.textContent = fragments.join(' ');
  }

  renderKpiTable(indicators, levels);
  renderDoughnut(indicators, charts);
}

function renderKpiTable(indicators, levels) {
  const body = document.getElementById('kpi-table-body');
  if (!body) return;
  body.innerHTML = '';

  const rows = [
    { label: 'Razón Corriente', value: formatRatio(indicators.razonCorriente), level: levels.razonCorriente },
    { label: 'Prueba Ácida', value: formatRatio(indicators.pruebaAcida), level: levels.pruebaAcida },
    { label: 'Pasivo / Patrimonio', value: formatRatio(indicators.pasivoPatrimonio), level: levels.pasivoPatrimonio },
    { label: 'Margen Neto', value: formatPercent(indicators.margenNeto), level: levels.margenNeto },
    { label: 'ROE', value: formatPercent(indicators.roe), level: levels.roe },
    { label: 'CCE (días)', value: formatNumber(indicators.cce), level: levels.cce }
  ];

  rows.forEach(row => {
    const tr = document.createElement('tr');
    const tdLabel = document.createElement('td');
    tdLabel.textContent = row.label;
    const tdValue = document.createElement('td');
    tdValue.textContent = row.value;
    const tdLevel = document.createElement('td');
    if (row.level) {
      const span = document.createElement('span');
      span.className = 'kpi-level';
      span.dataset.level = row.level;
      span.textContent = levelLabel(row.level);
      tdLevel.appendChild(span);
    } else {
      tdLevel.textContent = row.value === 'ND' ? 'ND' : '-';
    }
    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);
    tr.appendChild(tdLevel);
    body.appendChild(tr);
  });
}

function renderDoughnut(indicators, charts) {
  const container = document.getElementById('doughnut-chart');
  if (!container) return;

  if (indicators.deudaFinancieraTotal == null || indicators.pasivoTotal == null || indicators.patrimonio == null) {
    container.innerHTML = '<div class="nd-placeholder">ND</div>';
    if (charts.doughnut) {
      Plotly.purge(charts.doughnut);
      charts.doughnut = null;
    }
    return;
  }

  const deudaFin = Math.max(indicators.deudaFinancieraTotal, 0);
  const pasivosOperativos = Math.max(indicators.pasivoTotal - deudaFin, 0);
  const patrimonio = Math.max(indicators.patrimonio, 0);

  const data = [{
    type: 'pie',
    values: [toMillions(deudaFin), toMillions(pasivosOperativos), toMillions(patrimonio)],
    labels: ['Deuda Financiera', 'Pasivos Operativos', 'Patrimonio'],
    hole: 0.55,
    textinfo: 'label+percent',
    marker: {
      colors: ['#34495E', '#95A5A6', COLOR_SOLID]
    }
  }];

  const layout = {
    margin: { t: 20, b: 20, l: 20, r: 20 },
    legend: { orientation: 'h' },
    paper_bgcolor: '#f9fbfe',
    plot_bgcolor: '#f9fbfe'
  };

  Plotly.react(container, data, layout, { displayModeBar: false, responsive: true });
  charts.doughnut = container;
}

function renderProfitabilitySection(indicators, charts) {
  const text = document.getElementById('profitability-text');
  if (text) {
    const pieces = [];
    if (indicators.margenBruto != null) {
      pieces.push(`Margen bruto ${formatPercent(indicators.margenBruto)}.`);
    }
    if (indicators.margenOperacional != null) {
      pieces.push(`Margen operacional ${formatPercent(indicators.margenOperacional)}.`);
    }
    if (indicators.margenNeto != null) {
      pieces.push(`Margen neto ${formatPercent(indicators.margenNeto)}.`);
    }
    if (indicators.roa != null) {
      pieces.push(`ROA ${formatPercent(indicators.roa)}.`);
    }
    if (indicators.roe != null) {
      pieces.push(`ROE ${formatPercent(indicators.roe)}.`);
    }
    if (pieces.length === 0) {
      pieces.push('No se pudo calcular la rentabilidad por falta de datos de ventas o resultados.');
    }
    text.textContent = pieces.join(' ');
  }

  const container = document.getElementById('margin-chart');
  if (!container) return;
  if (indicators.margenBruto == null && indicators.margenOperacional == null && indicators.margenNeto == null) {
    container.innerHTML = '<div class="nd-placeholder">ND</div>';
    if (charts.margins) {
      Plotly.purge(charts.margins);
      charts.margins = null;
    }
    return;
  }

  const labels = [];
  const values = [];
  const textLabels = [];

  if (indicators.margenBruto != null) {
    labels.push('Margen Bruto');
    values.push(indicators.margenBruto * 100);
    textLabels.push(formatPercent(indicators.margenBruto));
  }
  if (indicators.margenOperacional != null) {
    labels.push('Margen Operacional');
    values.push(indicators.margenOperacional * 100);
    textLabels.push(formatPercent(indicators.margenOperacional));
  }
  if (indicators.margenNeto != null) {
    labels.push('Margen Neto');
    values.push(indicators.margenNeto * 100);
    textLabels.push(formatPercent(indicators.margenNeto));
  }

  const data = [{
    type: 'bar',
    orientation: 'h',
    y: labels,
    x: values,
    text: textLabels,
    textposition: 'auto',
    marker: { color: ['#3498DB', '#1ABC9C', '#9B59B6'] }
  }];

  const layout = {
    margin: { l: 150, r: 30, t: 10, b: 40 },
    xaxis: { title: '%', zeroline: true },
    paper_bgcolor: '#f9fbfe',
    plot_bgcolor: '#f9fbfe'
  };

  Plotly.react(container, data, layout, { displayModeBar: false, responsive: true });
  charts.margins = container;
}

function renderRiskSection(indicators) {
  const text = document.getElementById('risk-text');
  if (!text) return;
  if (indicators.riesgoFiscalLaboral == null) {
    text.textContent = 'Sin información suficiente para evaluar el riesgo fiscal y laboral.';
    return;
  }
  const porcentaje = indicators.riesgoFiscalLaboral * 100;
  if (porcentaje > 10) {
    text.innerHTML = `<strong>Alto riesgo preferente:</strong> los pasivos fiscales y previsionales representan ${formatPercent(indicators.riesgoFiscalLaboral)} del pasivo total.`;
  } else {
    text.textContent = `Riesgo contenido: los pasivos fiscales y previsionales equivalen a ${formatPercent(indicators.riesgoFiscalLaboral)} del pasivo total.`;
  }
}

function renderConclusion(indicators, levels) {
  const list = document.getElementById('action-list');
  if (!list) return;
  list.innerHTML = '';

  const actions = [];

  if (levels.razonCorriente === 'riesgoso' || (indicators.tesoreriaNeta != null && indicators.tesoreriaNeta < 0)) {
    actions.push('Reforzar capital de trabajo: negociar plazos con proveedores, acelerar cobranza y evaluar líneas de crédito rotativas (0-30 días).');
  }

  if (levels.pasivoPatrimonio === 'riesgoso') {
    actions.push('Reestructurar pasivos financieros: priorizar amortización o refinanciamiento de deuda bancaria para reducir el apalancamiento (30-60 días).');
  }

  if (levels.margenNeto === 'riesgoso') {
    actions.push('Revisar estrategia comercial: ajustar precios, mix de productos y gastos fijos para recuperar margen neto (60-90 días).');
  }

  if (actions.length < 3 && indicators.riesgoFiscalLaboral != null && indicators.riesgoFiscalLaboral * 100 > 10) {
    actions.push('Regularizar obligaciones laborales y tributarias, priorizando convenios y provisiones específicas (0-30 días).');
  }

  if (actions.length < 3 && indicators.cce != null && indicators.cce > 60) {
    actions.push('Optimizar ciclo de conversión de efectivo mediante políticas de inventario y pagos escalonados (30-60 días).');
  }

  if (actions.length < 3) {
    actions.push('Actualizar presupuesto financiero y escenario de estrés para monitorear indicadores mensualmente (0-90 días).');
  }

  actions.slice(0, 3).forEach(action => {
    const li = document.createElement('li');
    li.textContent = action;
    list.appendChild(li);
  });
}

function renderNotes(notes) {
  const list = document.getElementById('notes-list');
  if (!list) return;
  list.innerHTML = '';
  if (!notes || notes.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Sin observaciones relevantes.';
    list.appendChild(li);
    return;
  }
  notes.forEach(note => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${note.label}:</strong> ${note.reason}`;
    list.appendChild(li);
  });
}

function formatCurrency(value) {
  if (value == null || Number.isNaN(value)) return 'ND';
  const scaled = value / 1_000;
  const formatted = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(Math.round(scaled));
  return `${formatted} M$`;
}

function formatPercent(value) {
  if (value == null || Number.isNaN(value)) return 'ND';
  return `${new Intl.NumberFormat('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value * 100)}%`;
}

function formatRatio(value) {
  if (value == null || Number.isNaN(value)) return 'ND';
  return new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function formatNumber(value) {
  if (value == null || Number.isNaN(value)) return 'ND';
  return new Intl.NumberFormat('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

function toMillions(value) {
  return value / 1_000_000;
}

function levelLabel(level) {
  switch (level) {
    case 'solido':
      return 'Sólido';
    case 'medio':
      return 'Medio';
    case 'riesgoso':
      return 'Riesgoso';
    default:
      return '-';
  }
}
