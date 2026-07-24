import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { youtubeAdresiGecerliMi } from "./utils/youtube";

const siirler = defineCollection({
  loader: glob({
    pattern: "**/*.yaml",
    base: "./src/content/siirler"
  }),
  schema: z.object({
    baslik: z.string().min(1),
    aciklama: z.string().trim().min(1).max(155).optional(),
    tarih: z.coerce.date(),
    icerikTuru: z.literal("Şiir"),
    anaTema: z.string().min(1),
    konu: z.string().min(1),
    siirTuru: z.string().min(1),
    gelenek: z.string().min(1),
    olcu: z.string().min(1),
    youtubeAdresi: z
      .union([
        z.literal(""),
        z
          .url()
          .refine(
            youtubeAdresiGecerliMi,
            "Geçerli bir YouTube bağlantısı yazın."
          )
      ])
      .optional(),
    siirMetni: z.string().min(1),
    degerlendirme: z.object({
      genelBakis: z.string().min(1),
      temaVeKonu: z.string().min(1),
      dilVeSoylevis: z.string().min(1),
      ahenkVeYapi: z.string().min(1),
      gelenekVeSonuc: z.string().min(1)
    }),
    sira: z.number().int().positive(),
    taslak: z.boolean().default(false),
    yorumKimligi: z.string().min(1).optional()
  })
});

const videoSemasi = z
  .object({
    baslik: z.string().min(1),
    aciklama: z.string().trim().min(1).max(155).optional(),
    icerikTuru: z.literal("Video kaydı"),
    kaynak: z.literal("YouTube"),
    sanatci: z.string().min(1),
    tarih: z.coerce.date(),
    youtubeAdresi: z.union([
      z.literal(""),
      z
        .url()
        .refine(
          youtubeAdresiGecerliMi,
          "Geçerli bir YouTube bağlantısı yazın."
        )
    ]),
    sira: z.number().int().positive(),
    taslak: z.boolean().default(false)
  })
  .superRefine((video, baglam) => {
    if (!video.taslak && !video.youtubeAdresi) {
      baglam.addIssue({
        code: "custom",
        message: "Yayımlanacak video için YouTube bağlantısı yazın.",
        path: ["youtubeAdresi"]
      });
    }
  });

const videolar = defineCollection({
  loader: glob({
    pattern: "**/*.yaml",
    base: "./src/content/videolar"
  }),
  schema: videoSemasi
});

export const collections = { siirler, videolar };
