import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const siirler = defineCollection({
  loader: glob({
    pattern: "**/*.yaml",
    base: "./src/content/siirler"
  }),
  schema: z.object({
    baslik: z.string().min(1),
    aciklama: z.string().min(1),
    tarih: z.coerce.date(),
    icerikTuru: z.literal("Şiir"),
    anaTema: z.string().min(1),
    konu: z.string().min(1),
    siirTuru: z.string().min(1),
    gelenek: z.string().min(1),
    olcu: z.string().min(1),
    siirMetni: z.string().min(1),
    degerlendirme: z.object({
      genelBakis: z.string().min(1),
      temaVeKonu: z.string().min(1),
      dilVeSoylevis: z.string().min(1),
      ahenkVeYapi: z.string().min(1),
      gelenekVeSonuc: z.string().min(1)
    }),
    sira: z.number().int().positive(),
    oneCikan: z.boolean().default(false),
    taslak: z.boolean().default(false)
  })
});

export const collections = { siirler };

