import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { auth } from './firebase/firebase'
import App from './App.vue'
import router from './router'

auth.onAuthStateChanged((user) => {
  let app = null
  if (!app) {
    app = createApp(App)

    app.use(createPinia())
    app.use(router)
  }
  if (user) {
    app.mount('#app')
    router.push({ name: 'HomePage' })
  } else {
    app.mount('#app')
  }
})
