---
layout: home
title: "Hoş Geldiniz"
---

## Site İçeriği

Burada en son paylaştığım 5 çalışmamın özeti yer almaktadır.

{% for post in site.posts limit:5 %}
### {{ post.title }}
{{ post.excerpt }}
[Şiirin Tamamını Oku]({{ post.url }})
---
{% endfor %}

## Son Eklenenler

Aşağıda siteme eklenen son 10 içeriğin başlığı listelenmektedir.

{% for post in site.posts limit:10 %}
* [{{ post.title }}]({{ post.url }})
{% endfor %}