
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.education-tabs button');
  const container = document.getElementById('education-content');

  const loaders = {
    recursos: loadResources,
    bancos: () => loadAccordion('bancos.json'),
    finanzas: () => loadAccordion('finanzas.json')
  };

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.tab;
      if (loaders[key]) loaders[key]();
    });
  });

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
      .then(items => {
        container.innerHTML = items.map((it, idx) => {
          return `\
            <div class="accordion-item">\
              <button class="accordion-title" data-index="${idx}">${it.title}</button>\
              <div class="accordion-content">${it.content}</div>\
            </div>`;
        }).join('');
        setupAccordion();
      })
      .catch(err => console.error(err));
  }

  function setupAccordion() {
    const titles = container.querySelectorAll('.accordion-title');
    titles.forEach(t => {
      const content = t.nextElementSibling;
      content.style.display = 'none';
      t.addEventListener('click', () => {
        const visible = content.style.display === 'block';
        content.style.display = visible ? 'none' : 'block';
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

