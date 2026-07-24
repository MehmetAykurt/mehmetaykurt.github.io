export const ACIKLAMA_EN_UZUN_KARAKTER = 155;

function metniKisalt(metin: string, enFazlaKarakter: number) {
  const temizMetin = metin.replace(/\s+/g, " ").trim();

  if (temizMetin.length <= enFazlaKarakter) {
    return temizMetin;
  }

  const kesilmisMetin = temizMetin.slice(0, enFazlaKarakter - 1);
  const sonBosluk = kesilmisMetin.lastIndexOf(" ");
  const guvenliMetin =
    sonBosluk > enFazlaKarakter * 0.7
      ? kesilmisMetin.slice(0, sonBosluk)
      : kesilmisMetin;

  return `${guvenliMetin.trimEnd()}…`;
}

export function siirAciklamasiOlustur(
  baslik: string,
  ozelAciklama?: string
) {
  const otomatikAciklama =
    `Mehmet Aykurt’a ait “${baslik}” adlı şiirin metni, künyesi ` +
    "ve edebî değerlendirmesi.";

  return metniKisalt(
    ozelAciklama?.trim() || otomatikAciklama,
    ACIKLAMA_EN_UZUN_KARAKTER
  );
}
