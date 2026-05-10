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

function adresiYolaCevir(adres) {
  try {
    const url = new URL(adres);
    let yol = url.pathname;

    if (yol === "/") {
      return "index.html";
    }

    if (yol.startsWith("/")) {
      yol = yol.slice(1);
    }

    return yol;
  } catch {
    return adres;
  }
}

function sayfaBasliginiAl(belge, adres) {
  const title = belge.querySelector("title")?.textContent || "";
  const temizTitle = fazlaBosluklariTemizle(title);

  if (adres === "index.html") {
    return "Ana Sayfa";
  }

  if (temizTitle.includes("|")) {
    return temizTitle.split("|")[0].trim();
  }

  return (
    belge.querySelector("main h2")?.textContent.trim() ||
    temizTitle ||
    adres
  );
}

function anaMetniAl(belge) {
  const siirMetni = belge.querySelector(".siir-metni");

  if (siirMetni) {
    return siirMetni.textContent || "";
  }

  const main = belge.querySelector("main");

  if (!main) {
    return belge.body?.textContent || "";
  }

  const kopya = main.cloneNode(true);

  kopya
    .querySelectorAll(
      "#siir-gezinme-basligi, [aria-labelledby='siir-gezinme-basligi']"
    )
    .forEach((oge) => oge.remove());

  return kopya.textContent || "";
}

async function sitemapOku() {
  const cevap = await fetch("sitemap.xml?v=20260509-2", {
    cache: "no-store"
  });

  if (!cevap.ok) {
    throw new Error("sitemap.xml okunamadı");
  }

  const xmlMetni = await cevap.text();
  const ayrıştırıcı = new DOMParser();
  const belge = ayrıştırıcı.parseFromString(xmlMetni, "application/xml");

  const adresler = Array.from(belge.querySelectorAll("url loc"))
    .map((loc) => loc.textContent.trim())
    .filter(Boolean)
    .map(adresiYolaCevir)
    .filter((adres) => !adres.includes("arama.html"));

  return adresler;
}

async function sayfaOku(adres) {
  const cevap = await fetch(adres, {
    cache: "no-store"
  });

  if (!cevap.ok) {
    throw new Error(`${adres} okunamadı`);
  }

  const htmlMetni = await cevap.text();
  const ayrıştırıcı = new DOMParser();
  const belge = ayrıştırıcı.parseFromString(htmlMetni, "text/html");

  const baslik = sayfaBasliginiAl(belge, adres);
  const metin = anaMetniAl(belge);

  return {
    adres,
    baslik: fazlaBosluklariTemizle(baslik),
    metin: fazlaBosluklariTemizle(metin)
  };
}

function kisaOzetOlustur(metin, sorgu) {
  const temizMetin = fazlaBosluklariTemizle(metin);
  const temizMetinArama = metniTemizle(temizMetin);
  const temizSorgu = metniTemizle(sorgu);

  const bulunanYer = temizMetinArama.indexOf(temizSorgu);

  if (bulunanYer === -1) {
    return temizMetin.slice(0, 160);
  }

  const baslangic = Math.max(0, bulunanYer - 55);
  const bitis = Math.min(temizMetin.length, bulunanYer + temizSorgu.length + 95);

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

function listeSayfasiMi(adres) {
  return adres === "index.html" || adres === "siirler.html";
}

async function aramaYap(sorgu) {
  const temizSorgu = metniTemizle(sorgu).trim();

  if (!temizSorgu) {
    return [];
  }

  const sayfaAdresleri = await sitemapOku();
  const sonuclar = [];

  for (const adres of sayfaAdresleri) {
    try {
      const sayfa = await sayfaOku(adres);

      const baslikteVar = metniTemizle(sayfa.baslik).includes(temizSorgu);
      const metindeVar = metniTemizle(sayfa.metin).includes(temizSorgu);

      if (!baslikteVar && !metindeVar) {
        continue;
      }

      if (listeSayfasiMi(sayfa.adres) && !baslikteVar) {
        continue;
      }

      sonuclar.push({
        adres: sayfa.adres,
        baslik: sayfa.baslik,
        ozet: kisaOzetOlustur(sayfa.metin, sorgu)
      });
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

  aramaDurumu.textContent = "Sitemap okunuyor ve sayfalar aranıyor lütfen bekleyin.";

  try {
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
  } catch (hata) {
    aramaDurumu.textContent = "Arama yapılırken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.";
    console.error(hata);
  }
}

document.addEventListener("DOMContentLoaded", aramaSayfasiniHazirla);