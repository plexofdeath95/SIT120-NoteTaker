<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import SideNav from './components/SideNav.vue'
import MainDisplay from './components/MainDisplay.vue'
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'

const showSideNav = ref(window.innerWidth > 768)
let resizeHandler: () => void
onMounted(() => {
  resizeHandler = () => {
    showSideNav.value = window.innerWidth > 768
  }

  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <div class="container">
    <NavBar @toggleSideNav="showSideNav = !showSideNav" />
    <div class="main-layout" :class="{ 'hide-sidenav': !showSideNav }">
      <SideNav v-if="showSideNav" :class="{ show: showSideNav }" />
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

/* Hide SideNav in Mobile View */
@media (max-width: 768px) {
  .main-layout.hide-sidenav {
    margin-left: 0;
  }
}
</style>
