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
  const repo = 'nmoroso/nicolasmoroso-paginaweb';
  const branch = 'main';
  const apiUrl = `https://api.github.com/repos/${repo}/contents/blog?ref=${branch}`;

  fetch(apiUrl)
    .then(r => r.json())
    .then(files => files.filter(f => f.name.endsWith('.md')))
    .then(files => Promise.all(files.map(f => fetch(f.download_url).then(res => res.text()))))
    .then(markdowns => {
      const container = document.getElementById('blog-posts');
      const posts = markdowns.map(md => parseFrontMatter(md));

      posts.sort((a, b) => {
        const dateA = new Date(a.meta.date || 0);
        const dateB = new Date(b.meta.date || 0);
        return dateB - dateA;
      });

      posts.forEach(({ meta, content }) => {
        const article = document.createElement('article');
        const html = marked.parse(content);
        article.innerHTML = `<h2>${meta.title || ''}</h2>\n<div class="date">${meta.date || ''}</div>\n${html}`;
        container.appendChild(article);
      });
    })
    .catch(err => console.error('Error cargando posts', err));
});
