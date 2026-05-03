import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'adventures-codex'
const base = process.env.GITHUB_PAGES === 'true' ? `/${repoName}/` : '/'

export default defineConfig({
  base,
  plugins: [vue()],
})
