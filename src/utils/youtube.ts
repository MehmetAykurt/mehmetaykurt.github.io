const YOUTUBE_VIDEO_KIMLIGI_DESENI = /^[A-Za-z0-9_-]{11}$/;

export function youtubeVideoKimliginiAl(adres: string) {
  const videoAdresi = new URL(adres);
  const alanAdi = videoAdresi.hostname.toLowerCase().replace(/^www\./, "");
  const yolParcalari = videoAdresi.pathname.split("/").filter(Boolean);

  let videoKimligi: string | null = null;

  if (alanAdi === "youtu.be") {
    videoKimligi = yolParcalari[0] ?? null;
  } else if (
    alanAdi === "youtube.com" ||
    alanAdi.endsWith(".youtube.com") ||
    alanAdi === "youtube-nocookie.com" ||
    alanAdi.endsWith(".youtube-nocookie.com")
  ) {
    if (videoAdresi.pathname === "/watch") {
      videoKimligi = videoAdresi.searchParams.get("v");
    } else if (["embed", "shorts", "live"].includes(yolParcalari[0])) {
      videoKimligi = yolParcalari[1] ?? null;
    }
  }

  if (!videoKimligi || !YOUTUBE_VIDEO_KIMLIGI_DESENI.test(videoKimligi)) {
    throw new Error(`Geçerli bir YouTube video bağlantısı değil: ${adres}`);
  }

  return videoKimligi;
}

export function youtubeAdresiGecerliMi(adres: string) {
  try {
    youtubeVideoKimliginiAl(adres);
    return true;
  } catch {
    return false;
  }
}
