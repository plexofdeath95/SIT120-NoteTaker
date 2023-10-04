<script lang="ts">
import { ref, onBeforeMount, onMounted, onUnmounted, watchEffect, defineComponent } from 'vue'
import NavBar from '@/components/NavBar.vue'
import SideNav from '@/components/SideNav.vue'
import MainDisplay from '@/components/MainDisplay.vue'
import { type iUser, readUsers, getUser } from '@/firebase/firestore/users'
import type { iNote } from '@/firebase/firestore/notes'
import { getCurrentUser } from '@/firebase/Auth/AuthFunctions'
import { useRouter } from 'vue-router'

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

    const resizeHandler = () => {
      showSideNav.value = window.innerWidth > 768
      console.log(showSideNav.value)
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

    const handleNoteSelect = (note: iNote) => {
      selectedNote.value = note
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
      rerenderView
    }
  }
})
</script>

<template>
  <div class="container" v-if="ready">
    <NavBar :user="user || undefined" @toggleSideNav="showSideNav = !showSideNav" />
    <div class="main-layout" :class="{ 'hide-sidenav': !showSideNav }">
      <Suspense>
        <SideNav
          v-if="showSideNav"
          :class="{ show: showSideNav }"
          :user="user"
          @selectNote="handleNoteSelect"
          @refreshMain="handleNoteSelect"
          @rerender="rerenderView"
        />
      </Suspense>
      <MainDisplay v-if="!refreshMainView" :note="selectedNote" @rerender="rerenderView" />
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

@media (max-width: 768px) {
  .main-layout.hide-sidenav {
    margin-left: 0;
  }
}
</style>
