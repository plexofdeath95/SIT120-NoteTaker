<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import SideNav from './components/SideNav.vue'
import MainDisplay from './components/MainDisplay.vue'
import readUsers, { type iUser } from './firebase/firestore/users'
import { onBeforeMount, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import type { iNote } from './firebase/firestore/notes'

const showSideNav = ref(window.innerWidth > 768)
const user = ref<iUser>()
const refreshMainView = ref(false)
const ready = ref(false)
const selectedNote = ref<iNote>()
let resizeHandler: () => void
onMounted(() => {
  resizeHandler = () => {
    showSideNav.value = window.innerWidth > 768
  }

  window.addEventListener('resize', resizeHandler)
})

onBeforeMount(async () => {
  const users = await readUsers.readUsers()
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
const handleNoteSelect = (note: iNote) => {
  selectedNote.value = note
  localStorage.setItem('selectedNote', JSON.stringify(note))
}
onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
})

const rerenderView = () =>
{
  refreshMainView.value = true
  ready.value = false
  //wait a render tick
  setTimeout(() => {
    refreshMainView.value = false
    ready.value = true
  }, 0)
}

watchEffect(() => {
  if (selectedNote.value) {
    refreshMainView.value = true
    //wait a render tick
    setTimeout(() => {
      refreshMainView.value = false
    }, 0)
  }
})

</script>

<template>
  <div class="container" v-if="ready">
    <NavBar :user="user || undefined" @toggleSideNav="showSideNav = !showSideNav" />
    <div class="main-layout" :class="{ 'hide-sidenav': !showSideNav }">
      <Suspense>
      <SideNav v-if="showSideNav" :class="{ show: showSideNav }" :user="user" @selectNote="handleNoteSelect" @refreshMain="handleNoteSelect"/>
      </Suspense>
      <MainDisplay v-if="!refreshMainView" :note="selectedNote" @rerender="rerenderView"/>
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
