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
        let imageUrl = '';
        const imgMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
        if (imgMatch) {
          imageUrl = imgMatch[1];
          content = content.replace(imgMatch[0], '');
        }

        const html = marked.parse(content);

        const wrapper = document.createElement('div');
        wrapper.className = 'blog-post-wrapper';

        wrapper.innerHTML = `
          <div class="blog-header">
            <h1 class="blog-title">${meta.title || ''}</h1>
            <p class="blog-date">${meta.date || ''}</p>
          </div>
          ${imageUrl ? `<div class="blog-image-wrapper"><img src="${imageUrl}" alt="Imagen del post" class="blog-image"></div>` : ''}
          <div class="blog-content">${html}</div>
        `;

        container.appendChild(wrapper);
      });
    })
    .catch(err => console.error('Error cargando posts', err));
});
