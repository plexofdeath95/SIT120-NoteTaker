<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue'
import type { iUser } from '../firebase/firestore/users'
import { RouterLink } from 'vue-router'
import { logoutUser } from '@/firebase/Auth/AuthFunctions'
import { useRouter } from 'vue-router'
import { useFolderNotes } from '@/composables/useFolderNotes'
import type { iNote } from '@/firebase/firestore/notes'
export default defineComponent({
  name: 'NavBar',
  props: {
    user: {
      type: Object as PropType<iUser>,
      required: true
    },
    hideHam: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props, {emit}) {
    const searchQuery = ref('')
    const showSideNav = ref(false)
    const searchResults = ref<iNote[]>([])

    const router = useRouter()

    const { folders, notes } = useFolderNotes(props.user)

    function simpleFuzzySearch(query: string, notesRecord: Record<string, iNote[]>): iNote[] {
      const lowercasedQuery = query.toLowerCase()
      let matchedNotes: iNote[] = []

      for (const key in notesRecord) {
        const folderNotes = notesRecord[key]
        const filteredNotes = folderNotes.filter((note) => {
          const title = note.title.toLowerCase()
          const content = note.content.toLowerCase()
          return title.includes(lowercasedQuery) || content.includes(lowercasedQuery)
        })

        matchedNotes = [...matchedNotes, ...filteredNotes]
      }

      return matchedNotes
    }

    function performSearch() {
      if (searchQuery.value) {
        searchResults.value = simpleFuzzySearch(searchQuery.value, notes.value)
      } else {
        searchResults.value = []
      }
    }

    function toggleSideNav() {
      showSideNav.value = !showSideNav.value
    }

    const logout = async () => {
      localStorage.removeItem('user')
      await logoutUser()
      router.push('/')
    }

    const goToNote = (Note: iNote) => {
      searchQuery.value = ''
      searchResults.value = []
      emit('openNote', Note)
    }
    
    const getFolderByID = (folderID: string) => {
      return folders.value.find((folder) => folder.id === folderID)
    }

    return {
      searchQuery,
      performSearch,
      showSideNav,
      searchResults,
      toggleSideNav,
      logout,
      getFolderByID,
      goToNote
    }
  }
})
</script>

<template>
  <header>
    <nav>
      <div class="left-actions">
        <button class="hamburger-button" @click="$emit('toggleSideNav')" v-if="!hideHam">
          <span class="material-icons">menu</span>
        </button>
        <div v-if="showSideNav">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </div>
      </div>
      <div class="search" :class="{ 'modal-open': searchResults.length > 0 }">
        <input
          type="text"
          placeholder="Search notes..."
          v-model="searchQuery"
          @input="performSearch"
        />
        <div class="modal">
          <div class="modal-content">
            <div class="dropdown-results">
              <input
                type="text"
                placeholder="Search notes..."
                v-model="searchQuery"
                @input="performSearch"
                class="searchInput"
              />
              <hr>
              <div v-for="result in searchResults" :key="result.id" @click="goToNote(result)" class="searchItem">
                {{getFolderByID(result.folder)?.name}} / {{result.title}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-actions">
        <div class="user">Hello {{ user?.username || 'Guest' }}</div>
        <div>
          <button @click="logout">Logout</button>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--primary-bg);
  color: #fff;
  height: 60px;
  padding: 0 20px;
}

.left-actions {
  position: relative;
  display: flex;
  align-items: center;
}

.left-actions > div {
  display: none; /* Hidden by default on mobile */
  flex-direction: column;
  align-items: flex-start;
}

.showMobileNav .left-actions > div {
  display: flex;
}

.search {
  margin: 0 auto;
}

.search input {
  padding: 5px;
  border-radius: 5px;
  margin:10px;
  min-width: 300px;
  background-color: var(--secondary-bg);
  color: var(--primary-text);
  border: none;
}

.searchInput {
  padding: 5px;
  border-radius: 5px;
  margin:10px;
  min-width: 300px;
  background-color: var(--secondary-bg);
  color: var(--primary-text);
  border: none;
  width:90%;
  align-self: center;
}
.searchItem {
  padding: 5px;
  border-radius: 5px;
  background-color: var(--secondary-bg);
  color: var(--primary-text);
  border: none;
  width: 100%;
}

.searchItem:hover {
  background-color: var(--primary-bg);
  color: var(--secondary-text);
}

a {
  color: #fff;
  text-decoration: none;
  margin: 20px;
}

a:hover {
  color: #fff;
  text-decoration: underline;
}

.hamburger-button {
  background: none;
  border: none;
  font-size: 2em;
  color: #fff;
  cursor: pointer;
}

hr {
  border: 1px solid #ddd;
  width: 100%;
}

.dropdown-results {
  max-height: 300px;
  overflow-y: auto;
  background-color: var(--secondary-bg);
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 10px;
  width:60vw;
  z-index: 1000;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display:flex;
  flex-direction:column;
  align-items: flex-start;
}
.search.modal-open .modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
}

/* Style the modal content */
.modal-content {
  border-radius: 5px;
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Style the modal dropdown results */
.dropdown-results {
  max-height: 100%;
  overflow-y: auto;
}

/* Hide the modal by default */
.search .modal {
  display: none;
}
@media (max-width: 768px) {
  .search {
    margin: 0;
  }
  .search input {
    min-width: 200px;
  }

  .hamburger-button {
    display: inline;
  }

  .left-actions > RouterLink {
    display: none;
  }
  .user {
    display: none;
  }

  .left-actions.showSideNav > RouterLink {
    display: block;
  }

  .modal-content {
    width:90vw;
    min-width: 0px;
  }
}
</style>
