let allItems = [];

document.addEventListener('DOMContentLoaded', () => {
  // cargar tabla de Notion completa
  fetch('https://notion-api.splitbee.io/v1/table/21294b1ad37b8098b48dc788a148be7b')
    .then(r => r.json())
    .then(data => allItems = data);

  const tabs = document.querySelectorAll('.education-tabs button');
  const container = document.getElementById('education-content');

  tabs.forEach(btn => btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (btn.dataset.tab === 'recursos') {
      loadResources();
      document.getElementById('section-selectors').innerHTML = '';
    } else {
      const sectionName = btn.dataset.tab === 'bancos' ? 'Aprende de Bancos' : 'Aprende de Finanzas';
      const filtered = allItems.filter(it => it.Sección === sectionName);
      const cats = [...new Set(filtered.map(it => it.Subcategoría))];
      const secEl = document.getElementById('section-selectors');
      secEl.style.display = 'flex';
      secEl.innerHTML = cats.map(c => `<button data-cat="${c}">${c}</button>`).join('');
      secEl.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        secEl.querySelectorAll('button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        const itemsPorCat = filtered.filter(it => it.Subcategoría === b.dataset.cat);
        renderEntries(itemsPorCat);
      }));
      if (secEl.firstChild) secEl.firstChild.click();
    }
  }));

  function renderEntries(items) {
    const container = document.getElementById('education-content');
    container.innerHTML = items.map((it,i)=>`
      <div class="accordion-item">
        <button class="accordion-title" data-index="${i}">
          <div class="accordion-header">
            ${it.Imagen?`<img src="${it.Imagen}" class="accordion-img">`:''}
            <div class="accordion-title-text">
              <strong>${it.Name}</strong>
              ${it.Subcategoría?`<div class="accordion-tag">${it.Subcategoría}</div>`:''}
            </div>
          </div>
        </button>
        <div class="accordion-content">${marked.parse(it.Contenido||'')}</div>
      </div>`).join('');
    setupAccordion();
  }

  function loadResources() {
    fetch('recursos.json')
      .then(res => res.json())
      .then(items => {
        container.innerHTML =
          '<div class="resource-grid">' +
          items.map(it => {
            return `<a href="${it.link}" class="resource-card">` +
                   `<h3>${it.title}</h3>` +
                   `<p>${it.description}</p>` +
                   `</a>`;
          }).join('') +
          '</div>';
      })
      .catch(err => console.error(err));
  }

  function setupAccordion() {
    const items = container.querySelectorAll('.accordion-item');
    items.forEach(item => {
      const title = item.querySelector('.accordion-title');
      const content = item.querySelector('.accordion-content');
      content.style.display = 'none';
      title.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        item.classList.toggle('active');
        content.style.display = isActive ? 'none' : 'block';
      });
    });
  }

  const first = document.querySelector('.education-tabs button[data-tab="recursos"]');
  if (first) {
    first.classList.add('active');
    loadResources();
  }
});
