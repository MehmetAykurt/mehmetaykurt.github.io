---
layout: page
title: ""
---

## Site İçeriği

<div class="content-list">
{% for post in site.posts limit:5 %}
  <article class="content-card">
    <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>

    <p class="content-date">{{ post.date | date: "%d %B %Y" }}</p>

    <div class="content-excerpt">
      {{ post.excerpt }}
    </div>

    <p><a class="read-more" href="{{ post.url }}">Devamını Oku...</a></p>
  </article>
{% endfor %}
</div>

## En Son Eklenenler

<div class="recent-list">
{% for post in site.posts limit:10 %}
  <p><a href="{{ post.url }}">{{ post.title }}</a></p>
{% endfor %}
</div>
