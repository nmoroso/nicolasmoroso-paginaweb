let allItems = [];
const getTranslation = (key, fallback) => {
  if (window.t) {
    const translated = window.t(key);
    return translated === key ? fallback : translated;
  }
  return fallback;
};

document.addEventListener('DOMContentLoaded', () => {
  // 1) Carga la tabla completa desde Notion
  fetch('https://notion-api.splitbee.io/v1/table/21294b1ad37b8098b48dc788a148be7b')
    .then(res => res.json())
    .then(data => { allItems = data; })
    .catch(err => console.error('Error cargando Notion:', err));

  const tabs   = document.querySelectorAll('.education-tabs button');
  const secEl  = document.getElementById('section-selectors');
  const contEl = document.getElementById('education-content');

  // 2) Maneja el click en cada pestaña
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      // a) Marca la pestaña activa
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // b) Limpia contenido y categorías
      contEl.innerHTML = '';
      secEl.innerHTML  = '';
      secEl.style.display = 'none';

      // c) Decide recurso vs bancos vs finanzas
      if (btn.dataset.tab === 'recursos') {
        loadResources();
      } else {
        const sectionName = btn.dataset.tab === 'bancos'
          ? 'Aprende de Bancos'
          : 'Aprende de Finanzas';

        // Filtra solo los ítems de esa sección
        const filtered = allItems.filter(it => it.Sección === sectionName);

        // Extrae categorías únicas (y no vacías)
        const subs = Array.from(new Set(filtered.map(it => it.Categoría).filter(s => s)));

        if (!subs.length) return; // nada que mostrar

        // d) Renderiza botones de categoría
        secEl.style.display = 'flex';
        secEl.innerHTML = subs.map(sub =>
          `<button data-sub="${sub}">${sub}</button>`
        ).join('');

        // e) Al hacer click en una categoría, renderiza su contenido
        secEl.querySelectorAll('button').forEach(sb => {
          sb.addEventListener('click', () => {
            secEl.querySelectorAll('button').forEach(x => x.classList.remove('active'));
            sb.classList.add('active');
            const itemsPorCat = filtered.filter(it => it.Categoría === sb.dataset.sub);
            renderEntries(itemsPorCat);
          });
        });

        // ← ¡Elimina cualquier auto-click aquí! El usuario debe elegir.
      }
    });
  });

  // 3) Al iniciar, activa por defecto “Recursos”
  const first = document.querySelector('.education-tabs button[data-tab="recursos"]');
  if (first) {
    first.classList.add('active');
    loadResources();
  }
});


/**
 * Carga y pinta el grid de recursos (simuladores).
 */
function loadResources() {
  fetch('recursos.json')
    .then(res => res.json())
    .then(items => {
      document.getElementById('education-content').innerHTML = `
        <div class="resource-grid">
          ${items.map(it => `
            <a href="${it.link}" class="resource-card">
              <h3>${it.title}</h3>
              <p>${it.description}</p>
            </a>
          `).join('')}
        </div>
      `;
    })
    .catch(err => {
      console.error('Error cargando recursos:', err);
      const errorMessage = getTranslation('education.errors.resources', 'Error al cargar recursos.');
      document.getElementById('education-content').innerHTML =
        `<p>${errorMessage}</p>`;
    });
}


/**
 * Dibuja los acordeones para la lista de items dada.
 */
function renderEntries(items) {
  document.getElementById('education-content').innerHTML = items.map((it,i) => `
    <div class="accordion-item">
      <button class="accordion-title" data-index="${i}">
        <div class="accordion-header">
          ${it.Imagen ? `<img src="${it.Imagen}" class="accordion-img" alt="">` : ''}
          <div class="accordion-title-text">
            <strong>${it.Name}</strong>
            ${it.Categoría ? `<div class="accordion-tag">${it.Categoría}</div>` : ''}
          </div>
        </div>
      </button>
      <div class="accordion-content">${marked.parse(it.Contenido || '')}</div>
    </div>
  `).join('');
  setupAccordion();
}


/**
 * Activa el comportamiento de abrir/cerrar en cada acordeón.
 */
function setupAccordion() {
  const container = document.getElementById('education-content');
  container.querySelectorAll('.accordion-item').forEach(item => {
    const title   = item.querySelector('.accordion-title');
    const content = item.querySelector('.accordion-content');
    content.style.display = 'none';
    title.addEventListener('click', () => {
      const open = item.classList.toggle('active');
      content.style.display = open ? 'block' : 'none';
    });
  });
}
