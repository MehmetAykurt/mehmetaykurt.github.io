import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const sabitSayfalar = [
  "",
  "hakkimda.html",
  "iletisim.html",
  "siirler.html",
  "videolar.html",
  "videolar/gonul-dedigin.html",
  "gizlilik.html"
];

export const GET: APIRoute = async ({ site }) => {
  const siteAdresi = site ?? new URL("https://mehmetaykurt.com.tr");
  const siirler = await getCollection("siirler", ({ data }) => !data.taslak);
  const yollar = [
    ...sabitSayfalar,
    ...siirler
      .sort((birinci, ikinci) => birinci.data.sira - ikinci.data.sira)
      .map((siir) => `siirler/${siir.id}.html`)
  ];
  const adresler = yollar
    .map((yol) => {
      const adres = new URL(yol, siteAdresi).toString();
      return `<url><loc>${adres}</loc></url>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${adresler}</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8"
      }
    }
  );
};
