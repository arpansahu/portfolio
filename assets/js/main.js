document.getElementById('year').textContent = new Date().getFullYear();

const STACK = [
  "Python", "Django", "Django REST Framework", "PostgreSQL", "Redis",
  "Docker", "Kubernetes", "Jenkins", "GraphQL", "Celery",
  "RabbitMQ", "Kafka", "Nginx", "React", "JavaScript"
];

const badgesEl = document.getElementById('stack-badges');
STACK.forEach((s) => {
  const span = document.createElement('span');
  span.textContent = s;
  badgesEl.appendChild(span);
});

fetch('data/projects.json')
  .then((res) => res.json())
  .then((projects) => {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = '';
    projects.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <img src="assets/img/projects/${p.image}" alt="${p.title}" loading="lazy">
        <h3>${p.title}</h3>
        <ul>${p.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
        <div class="project-links">
          <a href="${p.github}" target="_blank" rel="noopener">GitHub →</a>
          ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener">Live Demo →</a>` : ''}
        </div>
      `;
      grid.appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById('project-grid').textContent =
      'Could not load projects. See github.com/arpansahu for the full list.';
  });
