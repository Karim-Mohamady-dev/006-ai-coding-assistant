// Production build through Vite's JS API with an inline config.
// Note: plain `vite build` fails intermittently in this sandbox because
// Vite cannot import its bundled config temp file from
// node_modules/.vite-temp (EPERM under parallel load). The API build with
// configFile: false and the same plugins produces the same output.
// publicDir is disabled because Vite's copyFileSync (copy_file_range)
// fails with EPERM on this overlayfs; public files are copied below
// with plain read/write instead.
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

await build({ configFile: false, plugins: [react(), tailwindcss()], logLevel: 'info', publicDir: false })
mkdirSync('dist', { recursive: true })
for (const f of ['favicon.svg', 'og.svg']) {
  writeFileSync(`dist/${f}`, readFileSync(`public/${f}`))
}
