let allItems = [];

document.addEventListener('DOMContentLoaded', () => {
  const tabs       = document.querySelectorAll('.education-tabs button');
  const sectionEl  = document.getElementById('section-selectors');
  const contentEl  = document.getElementById('education-content');

  // 1) Cargo la tabla entera de Notion y la normalizo
  fetch('https://notion-api.splitbee.io/v1/table/21294b1ad37b8098b48dc788a148be7b')
    .then(r => r.json())
    .then(data => {
      allItems = data.map(e => ({
        name:    e.Name,
        section: e.Sección,
        sub:     e.Categoría || e.Categoria || 'Sin categoría',
        img:     e.Imagen,
        content: e.Contenido
      }));
      initTabs();
    })
    .catch(err => {
      console.error('Error cargando Notion:', err);
      contentEl.innerHTML = '<p>Error al cargar los contenidos de Educación.</p>';
    });

  function initTabs() {
    tabs.forEach(btn => btn.addEventListener('click', onTabClick));
    // al entrar, simular click en “Recursos”
    tabs[0].click();
  }

  function onTabClick(e) {
    const tab = e.currentTarget;
    const mode = tab.dataset.tab; // "recursos"|"bancos"|"finanzas"

    // 1) pestaña activa
    tabs.forEach(b => b.classList.remove('active'));
    tab.classList.add('active');

    // 2) limpio sub-secciones y contenido
    sectionEl.innerHTML = '';
    sectionEl.style.display = 'none';
    contentEl.innerHTML = '';

    if (mode === 'recursos') {
      renderResources();
    } else {
      // 3) filtro items de la sección elegida
      const sectionName = mode === 'bancos'
        ? 'Aprende de Bancos'
        : 'Aprende de Finanzas';

      const itemsInSec = allItems.filter(i => i.section === sectionName);

      // 4) obtengo subcategorías únicas
      const subs = Array.from(new Set(itemsInSec.map(i => i.sub)));

      // 5) muestro botones de subcategoría
      sectionEl.style.display = 'flex';
      sectionEl.innerHTML = subs.map(sub => `
        <button data-sub="${sub}">${sub}</button>
      `).join('');

      // 6) listener a cada sub
      sectionEl.querySelectorAll('button').forEach(b => {
        b.addEventListener('click', onSubClick);
      });

      // 7) activo la primera sub
      sectionEl.querySelector('button').click();
    }
  }

  function onSubClick(e) {
    const btn = e.currentTarget;
    const sub = btn.dataset.sub;

    // marca activa
    sectionEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // vuelvo a filtrar por sección + subcategoría
    const activeTab = document.querySelector('.education-tabs button.active').dataset.tab;
    const sectionName = activeTab === 'bancos'
      ? 'Aprende de Bancos'
      : 'Aprende de Finanzas';

    const filtered = allItems.filter(i =>
      i.section === sectionName && i.sub === sub
    );

    renderAccordion(filtered);
  }

  function renderResources() {
    fetch('recursos.json')
      .then(r => r.json())
      .then(items => {
        contentEl.innerHTML = `
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
        console.error('Error al cargar recursos:', err);
        contentEl.innerHTML = '<p>Error al cargar recursos.</p>';
      });
  }

  function renderAccordion(items) {
    contentEl.innerHTML = items.map((it,i) => `
      <div class="accordion-item">
        <button class="accordion-title" data-index="${i}">
          <div class="accordion-header">
            ${it.img ? `<img src="${it.img}" class="accordion-img">` : ''}
            <div class="accordion-title-text">
              <strong>${it.name}</strong>
              ${it.sub ? `<div class="accordion-tag">${it.sub}</div>` : ''}
            </div>
          </div>
        </button>
        <div class="accordion-content">${marked.parse(it.content || '')}</div>
      </div>
    `).join('');
    setupAccordion();
  }

  function setupAccordion() {
    const items = contentEl.querySelectorAll('.accordion-item');
    items.forEach(item => {
      const title   = item.querySelector('.accordion-title');
      const content = item.querySelector('.accordion-content');
      content.style.display = 'none';
      title.addEventListener('click', () => {
        const open = item.classList.toggle('active');
        content.style.display = open ? 'block' : 'none';
      });
    });
  }
});
