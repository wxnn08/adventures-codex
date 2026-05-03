import { createApp } from 'vue'
import App from './App.vue'
import { getDefaultAdapter } from './storage/index.js'
import { runLegacyMigration } from './storage/migrate.js'

async function boot() {
  await runLegacyMigration(getDefaultAdapter())
  createApp(App).mount('#app')
}

boot()
