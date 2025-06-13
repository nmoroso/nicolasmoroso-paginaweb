
let allEntries = [];

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.education-tabs button');
  const container = document.getElementById('education-content');

  const loaders = {
    recursos: loadResources,
    bancos: () => loadAccordion('educacion/bancos.json'),
    finanzas: () => loadAccordion('educacion/finanzas.json')
  };

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.tab;
      if (loaders[key]) loaders[key]();
    });
  });

  loadSections();

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

  function loadAccordion(file) {
    fetch(file)
      .then(res => res.json())
      .then(data => {
        allEntries = data.entries;
        const active = document.querySelector('#section-selectors button.active');
        if (active) {
          filterBySection(active.dataset.section);
        } else {
          renderEntries(allEntries);
        }
      })
      .catch(err => console.error(err));
  }

  function renderEntries(items) {
    container.innerHTML = items.map((it, i) => {
      const htmlContent = marked.parse(it.content);
      return `\
        <div class="accordion-item">\
          <button class="accordion-title" data-index="${i}">${it.title}</button>\
          <div class="accordion-content">${htmlContent}</div>\
        </div>`;
    }).join('');
    setupAccordion();
  }

  function filterBySection(sectionId) {
    renderEntries(allEntries.filter(it => it.section === sectionId));
  }

  function loadSections() {
    fetch('educacion/sections.json')
      .then(r => r.json())
      .then(data => {
        const sel = document.getElementById('section-selectors');
        sel.innerHTML = data.sections.map(s =>
          `<button data-section="${s.id}">${s.name}</button>`
        ).join('');
        sel.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', () => {
            sel.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterBySection(btn.dataset.section);
          });
        });
        if (sel.firstChild) sel.firstChild.click();
      });
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

  // load default
  const first = document.querySelector('.education-tabs button[data-tab="recursos"]');
  if (first) {
    first.classList.add('active');
    loadResources();
  }
});

