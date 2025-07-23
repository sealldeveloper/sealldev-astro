import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://seall.dev/",
  integrations: [tailwind(), icon()],
  image: {
    // This automatically optimizes all images, including those in markdown
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }
});