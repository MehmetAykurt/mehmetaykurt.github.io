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
    belge.querySelector("main h1")?.textContent.trim() ||
    belge.querySelector("main h2")?.textContent.trim() ||
    temizTitle ||
    adres
  );
}

function anaMetniAl(belge) {
  const siirMetni = belge.querySelector(".metin-icerigi");

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
  const cevap = await fetch("sitemap.xml?v=20260515-6", {
    cache: "no-store"
  });

  if (!cevap.ok) {
    throw new Error("sitemap.xml okunamadı");
  }

  const xmlMetni = await cevap.text();
  const ayristirici = new DOMParser();
  const belge = ayristirici.parseFromString(xmlMetni, "application/xml");

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
  const ayristirici = new DOMParser();
  const belge = ayristirici.parseFromString(htmlMetni, "text/html");

  const baslik = sayfaBasliginiAl(belge, adres);
  const metin = anaMetniAl(belge);

  return {
    adres,
    baslik: fazlaBosluklariTemizle(baslik),
    metin: fazlaBosluklariTemizle(metin)
  };
}

function sonucOlustur(sonuc) {
  const madde = document.createElement("article");
  madde.className = "icerik-karti";

  const baslik = document.createElement("h3");
  const baglanti = document.createElement("a");

  baglanti.href = sonuc.adres;
  baglanti.textContent = sonuc.baslik;

  baslik.appendChild(baglanti);
  madde.appendChild(baslik);

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
        baslik: sayfa.baslik
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
    aramaDurumu.textContent =
      "Henüz bir arama yapılmadı. Arama kutusuna bir ifade yazıp Ara düğmesine basabilirsiniz.";
    return;
  }

  aramaDurumu.textContent = "Sayfalar aranıyor lütfen bekleyin.";

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
    aramaDurumu.textContent =
      "Arama yapılırken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.";
    console.error(hata);
  }
}

function baglantiKopyalamaHazirla() {
  const dugme = document.getElementById("baglanti-kopyala");
  const durum = document.getElementById("kopyalama-durumu");

  if (!dugme || !durum) {
    return;
  }

  dugme.addEventListener("click", async () => {
    const baglanti = dugme.dataset.baglanti;

    if (!baglanti) {
      durum.textContent = "Kopyalanacak bağlantı bulunamadı.";
      return;
    }

    try {
      await navigator.clipboard.writeText(baglanti);
      durum.textContent = "Sayfa bağlantısı panoya kopyalandı.";
    } catch {
      durum.textContent = "Bağlantı kopyalanırken bir sorun oluştu.";
    }
  });
}

function goatCounterHazirla() {
  if (document.querySelector("script[data-goatcounter]")) {
    return;
  }

  const goatCounterBetigi = document.createElement("script");

  goatCounterBetigi.setAttribute(
    "data-goatcounter",
    "https://mehmetaykurt.goatcounter.com/count"
  );

  goatCounterBetigi.async = true;
  goatCounterBetigi.src = "https://gc.zgo.at/count.js";

  document.head.appendChild(goatCounterBetigi);
}

function bugununTarihiniAl() {
  const simdi = new Date();
  const yil = simdi.getFullYear();
  const ay = String(simdi.getMonth() + 1).padStart(2, "0");
  const gun = String(simdi.getDate()).padStart(2, "0");

  return `${yil}-${ay}-${gun}`;
}

async function goatCounterSayisiniAl(parametreler = "") {
  const adres = `https://mehmetaykurt.goatcounter.com/counter/TOTAL.json${parametreler}`;

  const cevap = await fetch(adres, {
    cache: "no-store"
  });

  if (!cevap.ok) {
    throw new Error("Ziyaretçi sayacı okunamadı");
  }

  const veri = await cevap.json();

  return veri.count || "0";
}

async function ziyaretciSayaciniHazirla() {
  const bugunAlani = document.getElementById("ziyaretci-bugun");
  const toplamAlani = document.getElementById("ziyaretci-toplam");

  if (!bugunAlani || !toplamAlani) {
    return;
  }

  try {
    const bugun = bugununTarihiniAl();

    const [bugunSayisi, toplamSayisi] = await Promise.all([
      goatCounterSayisiniAl(`?start=${encodeURIComponent(bugun)}`),
      goatCounterSayisiniAl()
    ]);

    bugunAlani.textContent = bugunSayisi;
    toplamAlani.textContent = toplamSayisi;
  } catch (hata) {
    console.warn(hata.message);

    bugunAlani.textContent = "okunamadı";
    toplamAlani.textContent = "okunamadı";
  }
}

function iletisimFormunuHazirla() {
  const form = document.getElementById("iletisim-formu");
  const durum = document.getElementById("iletisim-formu-durumu");

  if (!form || !durum) {
    return;
  }

  form.addEventListener("submit", async (olay) => {
    olay.preventDefault();

    const gonderDugmesi = form.querySelector("button[type='submit']");

    durum.textContent = "Mesajınız gönderiliyor. Lütfen bekleyin.";

    if (gonderDugmesi) {
      gonderDugmesi.disabled = true;
      gonderDugmesi.textContent = "Gönderiliyor";
    }

    try {
      const formVerisi = new FormData(form);
      const veri = Object.fromEntries(formVerisi.entries());

      const cevap = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(veri)
      });

      if (!cevap.ok) {
        throw new Error("Form gönderilemedi");
      }

      form.reset();

      durum.textContent =
        "Mesajınız başarıyla gönderilmiştir. En kısa süre içerisinde değerlendirilip tarafınıza geri dönüş sağlanacaktır.";
    } catch (hata) {
      console.warn(hata.message);

      durum.textContent =
        "Mesajınız gönderilirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.";
    } finally {
      if (gonderDugmesi) {
        gonderDugmesi.disabled = false;
        gonderDugmesi.textContent = "Gönder";
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  goatCounterHazirla();
  ziyaretciSayaciniHazirla();
  aramaSayfasiniHazirla();
  baglantiKopyalamaHazirla();
  iletisimFormunuHazirla();
});