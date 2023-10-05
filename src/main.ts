import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { auth } from './firebase/firebase'
import App from './App.vue'
import router from './router'
let app:any;


auth.onAuthStateChanged(async (user) => {

    if(!app)
    {
        app = createApp(App)
        app.use(createPinia())
        app.use(router)
        if(user && user.emailVerified)
        {
            await router.push({ name: 'HomePage' })
        }
        else
        {
            await router.push({ name: 'Login' })
        }
        app.mount('#app')
    }
    else
    {
        if(user && user.emailVerified)
        {
            await router.push({ name: 'HomePage' })
        }
        else
        {
            await router.push({ name: 'Login' })
        }
    }
})
