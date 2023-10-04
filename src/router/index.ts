// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'  // Import the Home component
import LoginView from '../views/LoginView.vue'  // Import the Login component
import RegisterView from '../views/RegisterView.vue'  // Import the Register component
import About from '../views/AboutUs.vue'  // Import the About component

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
    component: HomePage 
  },
  {
    path: '/about',
    name: 'About',
    component: About  // Add the About route
  }
  // ...other routes
]
const router = createRouter({
  history: createWebHistory('/'),
  routes
})


export default router
