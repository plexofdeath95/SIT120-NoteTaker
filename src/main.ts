import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { auth } from './firebase/firebase'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)




auth.onAuthStateChanged((user) => {
    if (user) {
        app.mount('#app')
        router.push({ name: 'HomePage' })
    } else {
        app.mount('#app')
    }
    });