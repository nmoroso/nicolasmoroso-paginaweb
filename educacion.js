// educacion.js

document.addEventListener('DOMContentLoaded', () => {
  const tabs       = document.querySelectorAll('.education-tabs button');
  const contentEl  = document.getElementById('education-content');
  const sectionEl  = document.getElementById('section-selectors');

  // Variable para almacenar datos de Notion
  let allEntries = [];

  // Oculta contenido y secciones
  function hideAll() {
    contentEl.innerHTML = '';
    sectionEl.innerHTML = '';
    sectionEl.style.display = 'none';
  }

  // Carga el grid de recursos desde recursos.json
  function loadResources() {
    return fetch('recursos.json')
      .then(res => res.json())
      .then(items => {
        contentEl.innerHTML = `
          <div class="resource-grid">
            ${items.map(it => `
              <a href="${it.link}" class="resource-card">
                <h3>${it.title}</h3>
                <p>${it.description}</p>
              </a>
            `).join('')}
          </div>`;
      })
      .catch(err => {
        console.error('Error cargando recursos:', err);
        contentEl.innerHTML = '<p>Error al cargar recursos.</p>';
      });
  }

  // Descarga y filtra la tabla de Notion
  function loadNotion(sectionName) {
    return fetch('https://notion-api.splitbee.io/v1/table/21294b1ad37b8098b48dc788a148be7b')
      .then(res => res.json())
      .then(data => {
        allEntries = data
          .filter(e => e.Sección === sectionName)
          .map(e => ({
            name:    e.Name,
            sub:     e.Subcategoría,
            content: e.Contenido,
            img:     Array.isArray(e.Imagen) && e.Imagen.length
                      ? (e.Imagen[0].external?.url || e.Imagen[0].file?.url || '')
                      : ''
          }));
      })
      .catch(err => {
        console.error('Error cargando Notion:', err);
        allEntries = [];
      });
  }

  // Genera los acordeones en #education-content
  function renderEntries(items) {
    contentEl.innerHTML = items.map((it,i) => `
      <div class="accordion-item">
        <button class="accordion-title" data-index="${i}">
          <div class="accordion-header">
            ${ it.img ? `<img src="${it.img}" class="accordion-img" alt="${it.name}">` : '' }
            <div class="accordion-title-text">
              <strong>${it.name}</strong>
              <div class="accordion-tag">${it.sub}</div>
            </div>
          </div>
        </button>
        <div class="accordion-content">${ marked.parse(it.content || '') }</div>
      </div>
    `).join('');
    setupAccordion();
  }

  // Añade la lógica abrir/cerrar acordeón
  function setupAccordion() {
    const items = contentEl.querySelectorAll('.accordion-item');
    items.forEach(item => {
      const btn = item.querySelector('.accordion-title');
      const cnt = item.querySelector('.accordion-content');
      cnt.style.display = 'none';
      btn.addEventListener('click', () => {
        const open = item.classList.toggle('active');
        cnt.style.display = open ? 'block' : 'none';
      });
    });
  }

  // Construye y muestra las sub-categorías
  function loadSections() {
    const uniques = [...new Set(allEntries.map(e => e.sub))];
    sectionEl.innerHTML = uniques.map(sub => `<button data-sub="${sub}">${sub}</button>`).join('');
    sectionEl.style.display = 'flex';

    sectionEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        sectionEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filtered = allEntries.filter(e => e.sub === btn.dataset.sub);
        renderEntries(filtered);
      });
    });

    // Dispara la primera sub-categoría
    if (uniques.length) {
      sectionEl.querySelector('button').click();
    }
  }

  // Maneja el clic en cada pestaña
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hideAll();

      if (btn.dataset.tab === 'recursos') {
        // Mostrar recursos
        loadResources();
        contentEl.style.display = 'block';
      } else {
        // Bancos o Finanzas
        const sectionName = btn.dataset.tab === 'bancos'
                             ? 'Aprende de Bancos'
                             : 'Aprende de Finanzas';
        loadNotion(sectionName)
          .then(() => loadSections());
      }
    });
  });

  // Al cargar la página, ocultamos todo hasta el primer clic
  hideAll();
});
