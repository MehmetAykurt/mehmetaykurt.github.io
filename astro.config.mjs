import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://mehmetaykurt.com.tr",
  output: "static",
  build: {
    format: "file"
  }
});
