/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import { MotionPlugin } from '@vueuse/motion'

// Components
import App from './App.vue'
// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'

const app = createApp(App)
app.use(MotionPlugin)
registerPlugins(app)
app.mount('#app')
