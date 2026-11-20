import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ATLAS Glamping",
    short_name: "ATLAS",
    start_url: "/ru",
    display: "standalone",
    background_color: "#0a0d0b",
    theme_color: "#0a0d0b",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  }
}
