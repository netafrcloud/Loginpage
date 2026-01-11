import fs from "node:fs"
import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

const adsPlugin = () => {
  const virtualModuleId = "virtual:ads"
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  return {
    name: "vite-ads-manifest",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
      return null
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) {
        return null
      }

      const adsDir = path.resolve(process.cwd(), "public", "ads")
      let files = []

      try {
        files = fs.readdirSync(adsDir)
      } catch (error) {
        files = []
      }

      const allowedExtensions = new Set([".png", ".jpg", ".jpeg", ".svg"])
      const images = files
        .filter((file) => allowedExtensions.has(path.extname(file).toLowerCase()))
        .sort()
        .map((file) => `/ads/${file}`)

      return `export default ${JSON.stringify(images)}`
    },
  }
}

export default defineConfig({
  plugins: [react(), adsPlugin()],
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(process.cwd(), "index.html"),
        login: path.resolve(process.cwd(), "login.html"),
        alogin: path.resolve(process.cwd(), "alogin.html"),
        redirect: path.resolve(process.cwd(), "redirect.html"),
        logout: path.resolve(process.cwd(), "logout.html"),
        status: path.resolve(process.cwd(), "status.html"),
      },
    },
  },
})
