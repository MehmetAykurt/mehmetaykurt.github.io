---
layout: page
title: "Şiirlerim"
permalink: /siirler/
---

Bu bölümde yayımlanan şiir içerikleri listelenir.

<ul class="content-list">
{% assign siirler = site.posts | where_exp: "post", "post.categories contains 'siirler'" %}
{% for post in siirler %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> — {{ post.date | date: "%d.%m.%Y" }}</li>
{% endfor %}
</ul>

Yeni bir şiir eklemek için `_posts` klasörüne tarih ile başlayan yeni bir Markdown dosyası ekleyiniz. Dosyanın kategori alanında `siirler` bulunmalıdır.
