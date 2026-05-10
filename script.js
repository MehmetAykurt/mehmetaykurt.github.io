const aranacakSayfalar = [
  "index.html",
  "hakkimda.html",
  "iletisim.html",
  "siirler.html",
  "nvda-projeleri.html",
  "siirler/haberin-olmaz.html",
  "siirler/yaylada-bir-guzel-gordum.html",
  "siirler/ariyor.html",
  "siirler/ne-guzel-uymus.html",
  "siirler/yaralama-gel-beni.html",
  "siirler/ask-hesabi.html",
  "siirler/sevgi-dedigin.html",
  "siirler/var.html",
  "siirler/insanin-gonlune-sevda-duserse.html",
  "siirler/oldurur-beni.html"
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

function fazlaBosluklariTemizle(metin) {
  return String(metin).replace(/\s+/g, " ").trim();
}

function kisaOzetOlustur(metin, sorgu) {
  const temizMetin = fazlaBosluklariTemizle(metin);
  const temizMetinArama = metniTemizle(temizMetin);
  const temizSorgu = metniTemizle(sorgu);

  const bulunanYer = temizMetinArama.indexOf(temizSorgu);

  if (bulunanYer === -1) {
    return temizMetin.slice(0, 180);
  }

  const baslangic = Math.max(0, bulunanYer - 70);
  const bitis = Math.min(temizMetin.length, bulunanYer + temizSorgu.length + 120);

  let ozet = temizMetin.slice(baslangic, bitis);

  if (baslangic > 0) {
    ozet = "..." + ozet;
  }

  if (bitis < temizMetin.length) {
    ozet = ozet + "...";
  }

  return ozet;
}

function sonucOlustur(sonuc) {
  const madde = document.createElement("article");
  madde.className = "siir-ozeti";

  const baslik = document.createElement("h3");
  const baglanti = document.createElement("a");

  baglanti.href = sonuc.adres;
  baglanti.textContent = sonuc.baslik;

  baslik.appendChild(baglanti);

  const aciklama = document.createElement("p");
  aciklama.textContent = sonuc.ozet;

  madde.appendChild(baslik);
  madde.appendChild(aciklama);

  return madde;
}

async function sayfaOku(adres) {
  const cevap = await fetch(adres, { cache: "no-store" });

  if (!cevap.ok) {
    throw new Error(`${adres} okunamadı`);
  }

  const htmlMetni = await cevap.text();
  const ayrıştırıcı = new DOMParser();
  const belge = ayrıştırıcı.parseFromString(htmlMetni, "text/html");

  const baslik =
    belge.querySelector("main h2")?.textContent ||
    belge.querySelector("title")?.textContent ||
    adres;

  const anaIcerik =
    belge.querySelector("main")?.textContent ||
    belge.body?.textContent ||
    "";

  return {
    adres,
    baslik: fazlaBosluklariTemizle(baslik),
    metin: fazlaBosluklariTemizle(anaIcerik)
  };
}

async function aramaYap(sorgu) {
  const temizSorgu = metniTemizle(sorgu).trim();

  if (!temizSorgu) {
    return [];
  }

  const sonuclar = [];

  for (const adres of aranacakSayfalar) {
    try {
      const sayfa = await sayfaOku(adres);
      const aranacakMetin = metniTemizle(`${sayfa.baslik} ${sayfa.metin}`);

      if (aranacakMetin.includes(temizSorgu)) {
        sonuclar.push({
          adres: sayfa.adres,
          baslik: sayfa.baslik,
          ozet: kisaOzetOlustur(sayfa.metin, sorgu)
        });
      }
    } catch (hata) {
      console.warn(hata.message);
    }
  }

  return sonuclar;
}

async function aramaSayfasiniHazirla() {
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

  aramaDurumu.textContent = "Sayfalar aranıyor lütfen bekleyin.";

  const sonuclar = await aramaYap(sorgu);

  aramaSonuclari.innerHTML = "";

  if (sonuclar.length === 0) {
    aramaDurumu.textContent = `"${sorgu}" araması için sonuç bulunamadı.`;
    return;
  }

  aramaDurumu.textContent = `"${sorgu}" araması için ${sonuclar.length} sonuç bulundu.`;

  sonuclar.forEach((sonuc) => {
    aramaSonuclari.appendChild(sonucOlustur(sonuc));
  });
}

document.addEventListener("DOMContentLoaded", aramaSayfasiniHazirla);