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
  const apiUrl = `https://api.github.com/repos/${repo}/contents/nodisp/blog?ref=${branch}`;

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
        // Netlify CMS can provide the image as an object or a string
        let imageUrl = '';
        if (meta.image && typeof meta.image === 'object' && meta.image.src) {
          imageUrl = meta.image.src;
        } else if (typeof meta.image === 'string') {
          // If the image value is just a file name, prepend the imgblog path
          if (!meta.image.includes('/')) {
            imageUrl = `/imgblog/${meta.image}`;
          } else {
            imageUrl = meta.image;
          }
        }
        console.log('📸 URL de imagen detectada:', imageUrl);

        let resolvedImageUrl = imageUrl;
        if (imageUrl && imageUrl.startsWith('/')) {
          resolvedImageUrl = window.location.origin + imageUrl;
        }

        // Format date to DD/MM/YYYY if present
        let formattedDate = '';
        if (meta.date) {
          const dateObj = new Date(meta.date);
          const day = String(dateObj.getDate()).padStart(2, '0');
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const year = dateObj.getFullYear();
          formattedDate = `${day}/${month}/${year}`;
        }

        const html = marked.parse(content);

        const wrapper = document.createElement('div');
        wrapper.className = 'blog-post-wrapper';

        wrapper.innerHTML = `
          <div class="blog-header">
            <h1 class="blog-title">${meta.title || ''}</h1>
            <p class="blog-date">${formattedDate}</p>
          </div>
          ${imageUrl ? `<div class="blog-image-wrapper"><img src="${resolvedImageUrl}" alt="Imagen del post" class="blog-image" onerror="this.style.display='none'; console.warn('⚠️ No se pudo cargar la imagen:', this.src);"></div>` : ''}
          <div class="blog-content">${html}</div>
        `;

        container.appendChild(wrapper);
      });
    })
    .catch(err => console.error('Error cargando posts', err));
});
