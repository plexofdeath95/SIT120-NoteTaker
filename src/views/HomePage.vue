<script lang="ts">
import { ref, onBeforeMount, onMounted, onUnmounted, watchEffect, defineComponent } from 'vue'
import NavBar from '@/components/NavBar.vue'
import SideNav from '@/components/SideNav.vue'
import MainDisplay from '@/components/MainDisplay.vue'
import { type iUser, getUser } from '@/firebase/firestore/users'
import type { iNote } from '@/firebase/firestore/noteFunctions'
import { getCurrentUser } from '@/firebase/Auth/AuthFunctions'
import { useRouter } from 'vue-router'
import { getFolderFromID } from '@/firebase/firestore/folderFunctions'
export default defineComponent({
  name: 'HomePage',
  components: {
    NavBar,
    SideNav,
    MainDisplay
  },
  setup() {
    const showSideNav = ref(window.innerWidth > 768)

    const user = ref<iUser>({
      username: '',
      email: '',
      userID: ''
    })
    const refreshMainView = ref(false)
    const ready = ref(false)
    const selectedNote = ref<iNote>()
    const router = useRouter()
    const showSearchModal = ref(false)

    const resizeHandler = () => {
      showSideNav.value = window.innerWidth > 768
      console.log(showSideNav.value)
    }
    const openSearchModal = () => {
      showSearchModal.value = true
    }
    const closeSearchModal = () => {
      showSearchModal.value = false
    }

    onMounted(() => {
      window.addEventListener('resize', resizeHandler)
    })

    onBeforeMount(async () => {
      const res = await getCurrentUser()

      if (res) {
        console.log(user)
        const userData = await getUser(res.userID)
        if (userData) {
          user.value = userData
          ready.value = true
        }
      } else {
        router.push('/')
      }
    })

    const handleNoteSelect = async (note: iNote) => {
      selectedNote.value = note
      if (user.value) {
        const res = await getFolderFromID(note.folder, user.value)
      }
      localStorage.setItem('selectedNote', JSON.stringify(note))
    }

    onUnmounted(() => {
      window.removeEventListener('resize', resizeHandler)
    })

    const rerenderView = () => {
      refreshMainView.value = true
      ready.value = false
      setTimeout(() => {
        refreshMainView.value = false
        ready.value = true
      }, 0)
    }

    watchEffect(() => {
      if (selectedNote.value) {
        refreshMainView.value = true
        setTimeout(() => {
          refreshMainView.value = false
        }, 0)
      }
    })

    return {
      showSideNav,
      user,
      refreshMainView,
      ready,
      selectedNote,
      handleNoteSelect,
      rerenderView,
      openSearchModal,
      closeSearchModal,
      showSearchModal
    }
  }
})
</script>

<template>
  <div class="container" v-if="ready">
    <KeepAlive>
      <NavBar
        :user="user"
        @showSearchModal="openSearchModal"
        @toggleSideNav="showSideNav = !showSideNav"
        @openNote="handleNoteSelect"
      />
    </KeepAlive>
    <div class="main-layout" :class="{ 'hide-sidenav': !showSideNav }">
      <SideNav
        v-if="showSideNav"
        :class="{ show: showSideNav }"
        :user="user"
        @selectNote="handleNoteSelect"
        @refreshMain="handleNoteSelect"
        @rerender="rerenderView"
      />

      <MainDisplay
        v-if="!refreshMainView"
        :note="selectedNote"
        :user="user"
        @rerender="rerenderView"
      />
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

/* Styling for the modal backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
}
@media (max-width: 768px) {
  .main-layout.hide-sidenav {
    margin-left: 0;
  }
}
</style>

