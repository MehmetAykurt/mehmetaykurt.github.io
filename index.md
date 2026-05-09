---
layout: page
title: ""
---

# Mehmet Aykurt Kişisel Web Sitesi

Hoş Geldiniz

## Ana Menü

- [Ana Sayfa](/)
- [Hakkımızda](/hakkimizda/)
- [İletişim](/iletisim/)
- [Şiirler](/siirler/)
- [NVDA Eklenti Projeleri](/nvda-eklenti-projeleri/)

---

## Site İçi Arama

<form action="/search/">
<input type="search" name="q" placeholder="Site içinde ara">
<button type="submit">Ara</button>
</form>

---

## Şiirlerden Seçmeler

### Sessizliğin İçinden

Bir umut saklıdır gecenin koynunda  
Yıldızlar ağlarken gönlüm oyununda  
Yollar tükenmiş de olsa sonunda  
İnsan yine düşer kendi izine

[Devamını Oku...](/siirler/sessizligin-icinden/)

---

### Kırık Zamanlar

Bir saat sustu içimde bugün  
Takvimler dağıldı eski bir hüzün  
Kelimeler yorgun, geceler uzun  
Hatıralar kaldı avuçlarımda

[Devamını Oku...](/siirler/kirik-zamanlar/)

---

### Yalnızlık Türküsü

Rüzgâr dokunur sessiz camlara  
Bir türkü yayılır eski diyarlara  
Karanlık çökerken hatıralara  
Yüreğim susmayı öğreniyor

[Devamını Oku...](/siirler/yalnizlik-turkusu/)

---

### İçimdeki Yolcu

Bir yol büyür insanın içinde  
Sessiz adımlarla gece boyunca  
Kırılmış aynalar gibi zamanca  
Her yüz başka bir hikâye saklar

[Devamını Oku...](/siirler/icimdeki-yolcu/)

---

### Sonbahar Gecesi

Yapraklar düşerken eski bahçeye  
Bir hüzün siniyor bütün şehre  
Gece usulca iner pencereme  
Ve ben seni düşünürüm yine

[Devamını Oku...](/siirler/sonbahar-gecesi/)

---

## En Son Eklenenler

<ul>
{% for post in site.posts limit:10 %}
<li>
<a href="{{ post.url }}">{{ post.title }}</a>
</li>
{% endfor %}
</ul>

---

## Telif Bildirimi

Bu internet sitesinde yer alan tüm şiirler, yazılar, projeler ve içerikler Mehmet Aykurt’a aittir.

İzinsiz kopyalanamaz, çoğaltılamaz veya yayımlanamaz.
