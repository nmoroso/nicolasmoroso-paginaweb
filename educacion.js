
let allEntries = [], allSections = [], allCategories = [];

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.education-tabs button');
  const container = document.getElementById('education-content');


  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const catBtn = document.querySelector('#category-selectors button.active');
      const secBtn = document.querySelector('#section-selectors button.active');
      if (catBtn && secBtn) {
        loadPosts(catBtn.dataset.category, secBtn.dataset.section);
      }
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
      .then(data => { allEntries = data.entries; });
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

  function filterAndRender(sectionId) {
    const items = allEntries.filter(it => it.section === sectionId);
    renderEntries(items);
  }

  function loadSections(categoryId) {
    fetch('educacion/sections.json')
      .then(r => r.json())
      .then(data => {
        allSections = data.sections.filter(s => s.categoryId === categoryId);
        const el = document.getElementById('section-selectors');
        el.innerHTML = allSections.map(s =>
          `<button data-section="${s.id}">${s.name}</button>`
        ).join('');
        el.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('click', () => {
            el.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadPosts(categoryId, btn.dataset.section);
          });
        });
        if (el.firstChild) el.firstChild.click();
      });
  }

  function loadPosts(categoryId, sectionId) {
    const loader = {
      recursos: loadResources,
      bancos: () => loadAccordion('educacion/bancos.json'),
      finanzas: () => loadAccordion('educacion/finanzas.json')
    };
    const tab = document.querySelector('.education-tabs button.active').dataset.tab;
    loader[tab]().then(() => {
      filterAndRender(sectionId);
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

