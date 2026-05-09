---
layout: page
title: "Site İçi Arama"
permalink: /search/
---

# Site İçi Arama

<input type="search" id="search-input" placeholder="Aramak istediğiniz kelimeyi yazın" style="width:100%; padding:10px;">

<div id="search-results"></div>

<script>
async function loadSearch() {
  const response = await fetch('/search.json');
  const data = await response.json();

  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');

  input.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();

    if (!query) {
      results.innerHTML = '';
      return;
    }

    const filtered = data.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      results.innerHTML = '<p>Sonuç bulunamadı.</p>';
      return;
    }

    results.innerHTML = filtered.map(item => `
      <p>
        <a href="${item.url}">${item.title}</a>
      </p>
    `).join('');
  });
}

loadSearch();
</script>
