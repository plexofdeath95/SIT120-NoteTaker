<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import SideNav from './components/SideNav.vue'
import MainDisplay from './components/MainDisplay.vue'
import readUsers, { type iUser } from './firebase/firestore/users'
import { onBeforeMount, onMounted, onUnmounted, ref, watchEffect } from 'vue'

const showSideNav = ref(window.innerWidth > 768)
const user = ref<iUser>()
const ready = ref(false)
let resizeHandler: () => void
onMounted(() => {
  resizeHandler = () => {
    showSideNav.value = window.innerWidth > 768
  }

  window.addEventListener('resize', resizeHandler)
})

onBeforeMount(async () => {
  const users = await readUsers.readUsers()
  console.log(users)
  //get first user, store into local storage
  localStorage.setItem('user', JSON.stringify(users[0]))
  //check if array is greater than 0
  if (users.length > 0) {
    user.value = users[0]
  } else {
    const tempUser: iUser = {
      username: '',
      email: '',
      userID: '',
    }
    user.value = tempUser
  }
  ready.value = true
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <div class="container" v-if="ready">
    <NavBar :user="user || undefined" @toggleSideNav="showSideNav = !showSideNav" />
    <div class="main-layout" :class="{ 'hide-sidenav': !showSideNav }">
      <Suspense>
      <SideNav v-if="showSideNav" :class="{ show: showSideNav }" :user="user" />
      </Suspense>
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
