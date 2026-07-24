export const YAYIN_SAAT_DILIMI = "Europe/Istanbul";

interface SiirYayinBilgisi {
  taslak: boolean;
  tarih: Date;
}

interface TarihliIcerik {
  tarih: Date;
  sira: number;
}

export function istanbulTarihiniYilAyGunOlarakAl(tarih = new Date()) {
  const parcalar = new Intl.DateTimeFormat("en", {
    timeZone: YAYIN_SAAT_DILIMI,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(tarih);

  const yil = parcalar.find((parca) => parca.type === "year")?.value;
  const ay = parcalar.find((parca) => parca.type === "month")?.value;
  const gun = parcalar.find((parca) => parca.type === "day")?.value;

  if (!yil || !ay || !gun) {
    throw new Error("Türkiye tarihi belirlenemedi.");
  }

  return `${yil}-${ay}-${gun}`;
}

export function siirYayindaMi(
  siir: SiirYayinBilgisi,
  bugun = istanbulTarihiniYilAyGunOlarakAl()
) {
  const yayinTarihi = siir.tarih.toISOString().slice(0, 10);

  return !siir.taslak && yayinTarihi <= bugun;
}

export function tariheGoreYenidenEskiye(
  birinci: TarihliIcerik,
  ikinci: TarihliIcerik
) {
  const tarihFarki = ikinci.tarih.getTime() - birinci.tarih.getTime();

  return tarihFarki || ikinci.sira - birinci.sira;
}
