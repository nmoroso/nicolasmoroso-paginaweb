function parseFrontMatter(md) {
  const match = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match) {
    const metaLines = match[1].split('\n');
    const meta = {};
    metaLines.forEach(line => {
      const idx = line.indexOf(':');
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        meta[key] = value.replace(/^"|"$/g, '');
      }
    });
    return { meta, content: match[2] };
  }
  return { meta: {}, content: md };
}

document.addEventListener('DOMContentLoaded', function() {
  fetch('posts.json')
    .then(r => r.json())
    .then(posts => {
      const container = document.getElementById('blog-posts');
      posts.forEach(post => {
        fetch(post.file)
          .then(res => res.text())
          .then(md => {
            const { meta, content } = parseFrontMatter(md);
            const article = document.createElement('article');
            const html = marked.parse(content);
            article.innerHTML = `<h2>${meta.title || ''}</h2>\n<div class="date">${meta.date || ''}</div>\n${html}`;
            container.appendChild(article);
          })
          .catch(err => console.error(err));
      });
    })
    .catch(err => console.error('Error cargando posts', err));
});
