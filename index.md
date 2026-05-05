---
layout: page
title: "Mehmet Aykurt - Kişisel Web Sitesi"
permalink: /
---

## Hoş Geldiniz

Bu site; şiirlerimi, edebî çalışmalarımı, erişilebilirlik alanındaki üretimlerimi ve kişisel notlarımı düzenli biçimde yayımlamak amacıyla hazırlanmıştır.

## Ana Menü

<div class="home-section home-menu" markdown="1">

- [Ana Sayfa]({{ '/' | relative_url }})
- [Hakkımızda]({{ '/hakkimizda/' | relative_url }})
- [İletişim]({{ '/iletisim/' | relative_url }})
- [Şiirlerim]({{ '/siirler/' | relative_url }})
- [Eklentiler]({{ '/eklentiler/' | relative_url }})

</div>

## Site İçi Arama

<form class="search-form" action="{{ '/search/' | relative_url }}" method="get">
  <label for="site-search">Aranacak kelime veya başlık</label>
  <input id="site-search" name="q" type="search" autocomplete="off" placeholder="Aranacak ifadeyi yazınız">
  <br>
  <button type="submit">Ara</button>
</form>

## Site İçeriği

Aşağıdaki alan, ana sayfada görünmesi istenen beş şiirin ilk kıtaları için hazırlanmıştır. Şiir metinlerinizi ilgili başlıkların altına doğrudan yazabilirsiniz.

<div class="poem-preview" markdown="1">

### Birinci Şiir

Buraya birinci şiirin ilk kıtası yazılacak.  
Dize sonlarında iki boşluk bırakılırsa satır düzeni korunur.  
Bu bölüm ana sayfada kısa bir tanıtım metni olarak görünür.

</div>

<div class="poem-preview" markdown="1">

### İkinci Şiir

Buraya ikinci şiirin ilk kıtası yazılacak.  
Şiirin tamamı için ayrıca Şiirlerim bölümünde bağımsız bir içerik oluşturulabilir.  
Ana sayfa yalnızca ilk kıtayı gösterecek şekilde düzenlenmiştir.

</div>

<div class="poem-preview" markdown="1">

### Üçüncü Şiir

Buraya üçüncü şiirin ilk kıtası yazılacak.  
Kıta metni kısa tutulursa ana sayfa daha sade görünür.  
Başlık ve dize düzeni sonradan kolayca değiştirilebilir.

</div>

<div class="poem-preview" markdown="1">

### Dördüncü Şiir

Buraya dördüncü şiirin ilk kıtası yazılacak.  
Bu satırlar örnek amaçlıdır.  
Kendi şiir metninizle değiştirilmelidir.

</div>

<div class="poem-preview" markdown="1">

### Beşinci Şiir

Buraya beşinci şiirin ilk kıtası yazılacak.  
Yayımlanacak metin hazır olduğunda yalnızca bu bölüm düzenlenir.  
Başka dosya değiştirmeniz gerekmez.

</div>

## Son Eklenenler

<div class="home-section" markdown="1">

{% if site.posts.size > 0 %}
<ol class="latest-list">
{% for post in site.posts limit:10 %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> — {{ post.date | date: "%d.%m.%Y" }}</li>
{% endfor %}
</ol>
{% else %}
Henüz içerik eklenmemiştir.
{% endif %}

</div>
