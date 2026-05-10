const siteIcerikleri = [
  {
    baslik: "Ana Sayfa",
    adres: "index.html",
    aciklama: "Mehmet Aykurt Kişisel Web Sitesi ana sayfası. Hoş geldiniz bölümü, son şiirlerden seçmeler ve son eklenen içerikler.",
    anahtarKelimeler: "ana sayfa hoş geldiniz son şiirler son eklenen içerikler mehmet aykurt"
  },
  {
    baslik: "Hakkımda",
    adres: "hakkimda.html",
    aciklama: "Mehmet Aykurt hakkında kısa tanıtım. Şiir yolculuğu, erişilebilirlik çalışmaları ve sitenin amacı.",
    anahtarKelimeler: "hakkımda mehmet aykurt 1981 kayseri şiir edebiyat erişilebilirlik site amacı"
  },
  {
    baslik: "İletişim",
    adres: "iletisim.html",
    aciklama: "Siteyle ilgili görüş, öneri ve mesajlar için hazırlanan iletişim sayfası. Google Form daha sonra eklenecektir.",
    anahtarKelimeler: "iletişim mesaj öneri görüş google form telif izin bildirim"
  },
  {
    baslik: "Şiirler",
    adres: "siirler.html",
    aciklama: "Mehmet Aykurt’un geleneksel Türk halk şiiri çizgisinde kaleme aldığı şiirlerin yer alacağı bölüm.",
    anahtarKelimeler: "şiir şiirler geleneksel türk halk şiiri türkhalk halk şiiri dize kıta gönül memleket ayrılık umut"
  },
  {
    baslik: "NVDA Projeleri",
    adres: "nvda-projeleri.html",
    aciklama: "Ekran okuyucu kullanan bireyler için hazırlanan kişisel erişilebilirlik çalışmaları, belgeler ve kullanım notları.",
    anahtarKelimeler: "nvda projeleri erişilebilirlik ekran okuyucu görme engelli belge kullanım notları çalışma"
  }
];

function metniTemizle(metin) {
  return String(metin)
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ü", "u");
}

function parametreAl(ad) {
  const adresParametreleri = new URLSearchParams(window.location.search);
  return adresParametreleri.get(ad) || "";
}

function aramaYap(sorgu) {
  const temizSorgu = metniTemizle(sorgu).trim();

  if (!temizSorgu) {
    return [];
  }

  return siteIcerikleri.filter((icerik) => {
    const aranacakMetin = metniTemizle(
      `${icerik.baslik} ${icerik.aciklama} ${icerik.anahtarKelimeler}`
    );

    return aranacakMetin.includes(temizSorgu);
  });
}

function sonucOlustur(icerik) {
  const madde = document.createElement("article");
  madde.className = "siir-ozeti";

  const baslik = document.createElement("h3");
  const baglanti = document.createElement("a");

  baglanti.href = icerik.adres;
  baglanti.textContent = icerik.baslik;

  baslik.appendChild(baglanti);

  const aciklama = document.createElement("p");
  aciklama.textContent = icerik.aciklama;

  madde.appendChild(baslik);
  madde.appendChild(aciklama);

  return madde;
}

function aramaSayfasiniHazirla() {
  const aramaKutusu = document.getElementById("arama-kutusu");
  const aramaDurumu = document.getElementById("arama-durumu");
  const aramaSonuclari = document.getElementById("arama-sonuclari");

  if (!aramaKutusu || !aramaDurumu || !aramaSonuclari) {
    return;
  }

  const sorgu = parametreAl("q").trim();

  aramaKutusu.value = sorgu;

  aramaSonuclari.innerHTML = "";

  if (!sorgu) {
    aramaDurumu.textContent = "Henüz bir arama yapılmadı. Arama kutusuna bir ifade yazıp Ara düğmesine basabilirsiniz.";
    return;
  }

  const sonuclar = aramaYap(sorgu);

  if (sonuclar.length === 0) {
    aramaDurumu.textContent = `"${sorgu}" araması için sonuç bulunamadı.`;
    return;
  }

  aramaDurumu.textContent = `"${sorgu}" araması için ${sonuclar.length} sonuç bulundu.`;

  sonuclar.forEach((icerik) => {
    aramaSonuclari.appendChild(sonucOlustur(icerik));
  });
}

document.addEventListener("DOMContentLoaded", aramaSayfasiniHazirla);