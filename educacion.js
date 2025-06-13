
let allEntries = [], allSections = [], allCategories = [];

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.education-tabs button');
  const container = document.getElementById('education-content');


  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const loaders = {
        recursos: () => { loadResources(); return Promise.resolve(); },
        bancos: () => loadAccordion('educacion/bancos.json'),
        finanzas: () => loadAccordion('educacion/finanzas.json')
      };
      loaders[btn.dataset.tab]().then(() => {
        loadSections(btn.dataset.tab);
      });
    });
  });

  loadCategories();

  function loadCategories() {
    fetch('educacion/categories.json')
      .then(r => r.json())
      .then(data => {
        allCategories = data.categories;
        const el = document.getElementById('category-selectors');
        el.innerHTML = allCategories.map(c =>
          `<button data-category="${c.id}">${c.name}</button>`
        ).join('');
        el.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', () => {
            el.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadSections(btn.dataset.category);
          });
        });
        if (el.firstChild) el.firstChild.click();
      });
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

  function loadAccordion(file) {
    return fetch(file)
      .then(res => res.json())
      .then(data => {
<<<<<<< HEAD
        const items = data.entries;
        container.innerHTML = items.map((it, idx) => {
          const htmlContent = marked.parse(it.content);
          return `\
            <div class="accordion-item">\
              <button class="accordion-title" data-index="${idx}">${it.title}</button>\
              <div class="accordion-content">${htmlContent}</div>\
            </div>`;
        }).join('');
        setupAccordion();
      })
      .catch(err => console.error(err));
=======
        allEntries = data.entries;
        return allEntries;
      });
>>>>>>> 7b37ef29f2dbbd9d4f92d3c6c940ab56d8b8d172
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
    const filtered = allEntries.filter(it => it.section === sectionId);
    renderEntries(filtered);
  }

  function loadSections(categoryId) {
    const container = document.getElementById('section-selectors');
    fetch('educacion/sections.json')
      .then(res => res.json())
      .then(data => {
        const sections = data.sections.filter(s => s.categoryId === categoryId);
        container.innerHTML = sections
          .map(s => `<button data-section="${s.id}">${s.name}</button>`)
          .join('');
        container.style.display = 'flex';
        container.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', () => {
            container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterBySection(btn.dataset.section);
          });
        });
        if (container.firstChild) container.firstChild.click();
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

