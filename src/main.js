import { createApp } from 'vue'
import App from './App.vue'
import { getDefaultAdapter } from './storage/index.js'
import { ensureInitialAdventure, runLegacyMigration } from './storage/migrate.js'

async function boot() {
  const adapter = getDefaultAdapter()
  await runLegacyMigration(adapter)
  await ensureInitialAdventure(adapter)
  createApp(App).mount('#app')
}

boot()
