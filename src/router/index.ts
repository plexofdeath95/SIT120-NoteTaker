// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'  // Import the Home component
import LoginView from '../views/LoginView.vue'  // Import the Login component
import RegisterView from '../views/RegisterView.vue'  // Import the Register component
import About from '../views/AboutUs.vue'  // Import the About component
import { auth } from '@/firebase/firebase'
const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage,
    beforeEnter: (to:any, from:any, next:any) => {
      if (auth.currentUser && auth.currentUser.emailVerified) {
        console.log('user is logged in')
        next()
      } else {
        console.log('user is not logged in')
        next({ name: 'Login' })
      }
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]
const router = createRouter({
  history: createWebHistory('/'),
  routes
})


export default router
