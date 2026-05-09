---
layout: page
title: "Şiirler"
permalink: /siirler/
---

# Şiirler

Bu bölümde Mehmet Aykurt’a ait geleneksel Türk halk şiiri anlayışıyla kaleme alınmış şiirler yer almaktadır.

## Tüm Şiirler

<ul>
{% for post in site.categories.siir %}
<li>
<a href="{{ post.url }}">{{ post.title }}</a>
</li>
{% endfor %}
</ul>
