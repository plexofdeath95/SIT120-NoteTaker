// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'  // Import the Home component
import About from '../views/AboutUs.vue'  // Import the About component

const routes = [
  {
    path: '/',
    name: 'Home',
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
