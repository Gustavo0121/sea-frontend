import { type Plugin, type ResolvedConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Injeta o Content-Security-Policy apenas no build de produção: em dev o
// preâmbulo inline do React Fast Refresh violaria script-src 'self'.
function cspPlugin(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'sea-csp',
    apply: 'build',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    transformIndexHtml(html) {
      const apiUrl = config.env.VITE_API_URL
      if (!apiUrl) {
        throw new Error(
          'VITE_API_URL não definida: necessária para montar o Content-Security-Policy (connect-src) no build de produção.',
        )
      }

      const csp = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        `connect-src 'self' ${apiUrl}`,
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ')

      return html.replace(
        '<meta name="referrer"',
        `<meta http-equiv="Content-Security-Policy" content="${csp}" />\n    <meta name="referrer"`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cspPlugin()],
  build: {
    // Não expor o código-fonte original no bundle de produção.
    sourcemap: false,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
