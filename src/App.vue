<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import SideNav from './components/SideNav.vue'
import MainDisplay from './components/MainDisplay.vue'
</script>

<template>
  <div class="container">
    <NavBar />
    <div class="main-layout">
      <SideNav />
      <MainDisplay />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}

.main-layout {
  display: flex;
  flex-direction: row;
  width: 100%;
}
</style>
