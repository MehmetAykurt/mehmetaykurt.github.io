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

function sonucOlustur(sonuc) {
const madde = document.createElement("article");
madde.className = "icerik-karti";

const baslik = document.createElement("h3");
const baglanti = document.createElement("a");

baglanti.href = sonuc.adres;
baglanti.textContent = sonuc.baslik;

baslik.appendChild(baglanti);
madde.appendChild(baslik);

const tur = document.createElement("p");
tur.className = "arama-sonucu-turu";
tur.textContent = sonuc.anaTema
? `${sonuc.tur} · ${sonuc.anaTema}`
: sonuc.tur;
madde.appendChild(tur);

const aciklama = document.createElement("p");
aciklama.className = "arama-sonucu-aciklama";
aciklama.textContent = sonuc.aciklama;
madde.appendChild(aciklama);

return madde;
}

async function aramaDizininiOku() {
const cevap = await fetch("/arama-dizini.json", {
cache: "no-cache"
});

if (!cevap.ok) {
throw new Error("Arama dizini okunamadı");
}

return cevap.json();
}

function eslesmePuaniHesapla(kayit, temizSorgu, arananKelimeler) {
const alanlar = {
baslik: metniTemizle(kayit.baslik),
tur: metniTemizle(kayit.tur),
anaTema: metniTemizle(kayit.anaTema || ""),
konu: metniTemizle(kayit.konu || ""),
aciklama: metniTemizle(kayit.aciklama),
metin: metniTemizle(kayit.metin)
};
const tumMetin = Object.values(alanlar).join(" ");

if (!arananKelimeler.every((kelime) => tumMetin.includes(kelime))) {
return 0;
}

let puan = 1;

if (alanlar.baslik === temizSorgu) {
puan += 1000;
} else if (alanlar.baslik.startsWith(temizSorgu)) {
puan += 800;
} else if (alanlar.baslik.includes(temizSorgu)) {
puan += 600;
}

if (alanlar.anaTema === temizSorgu) {
puan += 500;
} else if (alanlar.anaTema.includes(temizSorgu)) {
puan += 400;
}

if (alanlar.konu.includes(temizSorgu)) {
puan += 300;
}

if (alanlar.tur === temizSorgu) {
puan += 250;
}

if (alanlar.aciklama.includes(temizSorgu)) {
puan += 200;
}

if (alanlar.metin.includes(temizSorgu)) {
puan += 100;
}

arananKelimeler.forEach((kelime) => {
if (alanlar.baslik.includes(kelime)) puan += 40;
if (alanlar.tur.includes(kelime)) puan += 35;
if (alanlar.anaTema.includes(kelime)) puan += 30;
if (alanlar.konu.includes(kelime)) puan += 20;
if (alanlar.aciklama.includes(kelime)) puan += 10;
});

return puan;
}

async function aramaYap(sorgu) {
const temizSorgu = metniTemizle(sorgu).trim();

if (!temizSorgu) {
return [];
}

const arananKelimeler = temizSorgu.split(/\s+/).filter(Boolean);
const aramaDizini = await aramaDizininiOku();

return aramaDizini
.map((kayit) => ({
...kayit,
puan: eslesmePuaniHesapla(kayit, temizSorgu, arananKelimeler)
}))
.filter((kayit) => kayit.puan > 0)
.sort((birinci, ikinci) => {
if (ikinci.puan !== birinci.puan) {
return ikinci.puan - birinci.puan;
}

return birinci.sira - ikinci.sira;
});
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

aramaDurumu.textContent = "Arama yapılıyor, lütfen bekleyin.";

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
