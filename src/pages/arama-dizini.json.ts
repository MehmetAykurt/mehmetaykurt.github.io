import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
  siirAciklamasiOlustur,
  videoAciklamasiOlustur
} from "../utils/aciklama";
import { siirYayindaMi } from "../utils/yayin";

interface AramaKaydi {
  baslik: string;
  adres: string;
  tur: string;
  aciklama: string;
  anaTema?: string;
  konu?: string;
  metin: string;
  sira: number;
}

const sabitSayfalar: AramaKaydi[] = [
  {
    baslik: "Ana Sayfa",
    adres: "/index.html",
    tur: "Sayfa",
    aciklama:
      "Mehmet Aykurt’un şiir, edebiyat ve müzik çalışmalarını bir araya getiren resmî web sitesi.",
    metin:
      "Mehmet Aykurt resmî web sitesi, öne çıkan içerikler ve son eklenen eserler.",
    sira: 1
  },
  {
    baslik: "Hakkımda",
    adres: "/hakkimda.html",
    tur: "Sayfa",
    aciklama:
      "Mehmet Aykurt’un yaşamı, edebiyat anlayışı, şiirleri ve müzik çalışmaları hakkında bilgiler.",
    metin:
      "Mehmet Aykurt, yaşamı, edebiyat anlayışı, halk şiiri, âşık edebiyatı, şiir ve müzik çalışmaları.",
    sira: 2
  },
  {
    baslik: "İletişim",
    adres: "/iletisim.html",
    tur: "Sayfa",
    aciklama:
      "Görüş, öneri, düşünce ve iletişim taleplerinizi Mehmet Aykurt’a iletebileceğiniz iletişim sayfası.",
    metin:
      "İletişim formu, ad soyad, e-posta, konu, mesaj, görüş ve öneriler.",
    sira: 3
  },
  {
    baslik: "Şiirler",
    adres: "/siirler.html",
    tur: "Bölüm",
    aciklama:
      "Mehmet Aykurt’un halk şiiri geleneğinden beslenen şiirlerinin yer aldığı bölüm.",
    metin:
      "Şiir listesi, sevda, hasret, ayrılık, gurbet, Anadolu, memleket, inanç, sabır ve fanilik.",
    sira: 4
  },
  {
    baslik: "Videolar",
    adres: "/videolar.html",
    tur: "Bölüm",
    aciklama:
      "Mehmet Aykurt’un şiir ve müzik çalışmalarına ait videoların yer aldığı bölüm.",
    metin: "Video listesi, müzik çalışmaları, şiirlerin bestelenmiş yorumları.",
    sira: 5
  },
  {
    baslik: "Gizlilik, Veri Kullanımı ve Telif Beyanı",
    adres: "/gizlilik.html",
    tur: "Sayfa",
    aciklama:
      "Sitenin gizlilik, kişisel veri kullanımı, haricî hizmetler ve telif hakları hakkında açıklamalar.",
    metin:
      "Gizlilik, kişisel veriler, çerezler, FormSubmit, Cusdis, GoatCounter, YouTube, telif hakları ve iletişim.",
    sira: 7
  }
];

export const GET: APIRoute = async () => {
  const videolar = (
    await getCollection("videolar", ({ data }) => !data.taslak)
  ).sort((birinci, ikinci) => birinci.data.sira - ikinci.data.sira);

  const siirler = (
    await getCollection("siirler", ({ data }) => siirYayindaMi(data))
  ).sort((birinci, ikinci) => birinci.data.sira - ikinci.data.sira);

  const videoKayitlari: AramaKaydi[] = videolar.map((video) => ({
    baslik: video.data.baslik,
    adres: `/videolar/${video.id}.html`,
    tur: video.data.icerikTuru,
    aciklama: videoAciklamasiOlustur(
      video.data.baslik,
      video.data.aciklama
    ),
    metin: [
      video.data.baslik,
      video.data.kaynak,
      video.data.sanatci,
      "video müzik izle dinle YouTube"
    ].join(" "),
    sira: 50 + video.data.sira
  }));

  const siirKayitlari: AramaKaydi[] = siirler.map((siir) => ({
    baslik: siir.data.baslik,
    adres: `/siirler/${siir.id}.html`,
    tur: siir.data.icerikTuru,
    aciklama: siirAciklamasiOlustur(
      siir.data.baslik,
      siir.data.aciklama
    ),
    anaTema: siir.data.anaTema,
    konu: siir.data.konu,
    metin: [
      siir.data.siirTuru,
      siir.data.gelenek,
      siir.data.olcu,
      siir.data.siirMetni,
      siir.data.degerlendirme.genelBakis,
      siir.data.degerlendirme.temaVeKonu,
      siir.data.degerlendirme.dilVeSoylevis,
      siir.data.degerlendirme.ahenkVeYapi,
      siir.data.degerlendirme.gelenekVeSonuc
    ].join(" "),
    sira: 100 + siir.data.sira
  }));

  return new Response(
    JSON.stringify([...sabitSayfalar, ...videoKayitlari, ...siirKayitlari]),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
  );
};
