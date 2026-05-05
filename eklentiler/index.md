---
layout: page
title: "Eklentiler"
permalink: /eklentiler/
---

Bu bölümde geliştirilen veya tanıtılması istenen erişilebilirlik odaklı yazılım ve eklenti çalışmaları listelenir.

<ul class="content-list">
{% assign eklentiler = site.posts | where_exp: "post", "post.categories contains 'eklentiler'" %}
{% for post in eklentiler %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> — {{ post.date | date: "%d.%m.%Y" }}</li>
{% endfor %}
</ul>
