<script lang="ts">
import { defineComponent, ref, watchEffect, type PropType, computed, onMounted } from 'vue'
import FolderItem from '@/components/SideNav/FolderItem.vue' // Adjust the path accordingly
import type {  iFolderNoteCollection, iNote } from '../firebase/firestore/noteFunctions'
import { type iFolder, createFolder } from '@/firebase/firestore/folderFunctions'
import type { iUser } from '@/firebase/firestore/users'
import { useFolderNotes } from '@/composables/useFolderNotes'

export default defineComponent({
  name: 'SideNav',
  props: {
    user: {
      type: Object as PropType<iUser>,
      required: true
    }
  },
  components: {
    FolderItem
  },
  setup(props) {
    // --- REFS & COMPUTEDS ---

    const selectedFolder = ref(localStorage.getItem('selectedFolder') || '')
    const FolderNote = ref<iFolderNoteCollection>({ folders: [], notes: {} })
    const folderSelectedArray = ref<boolean[]>([])
    const ready = ref(false)

    const addingFolder = ref(false)
    const newFolderName = ref('')

    const openedFolders = computed(() => {
      try {
        const storedValue = localStorage.getItem('openedFolders')
        return storedValue ? JSON.parse(storedValue) : []
      } catch (error) {
        console.error('Error parsing openedFolders from localStorage:', error)
        return []
      }
    })

    const cleanup = () => {
      console.log('Cleaning up real-time listeners')
    }

    const { folders, notes } = useFolderNotes(props.user, cleanup)

    // --- FUNCTIONS ---
    const rerender = () => {
      console.log('rerendering')
      ready.value = false
      setTimeout(() => {
        ready.value = true
      }, 0)
    }

    const addFolder = async () => {
      const newFolder = prompt('Enter folder name:')
      if (newFolder) {
        await createFolder(newFolder, props.user)
      }
    }

    const startAddingFolder = () => {
      addingFolder.value = true
    }

    const finishAddingFolder = async () => {
      if (newFolderName.value.trim()) {
        await createFolder(newFolderName.value.trim(), props.user)
        newFolderName.value = ''
        addingFolder.value = false
      }
    }

    const selectFolder = (folder: iFolder) => {
      localStorage.setItem('selectedFolder', JSON.stringify(folder.id))
      const index = findFolderIndexByID(folder.id)
      folderSelectedArray.value.fill(false)
      if (index !== -1) {
        console.log(index)
        folderSelectedArray.value[index] = true
        console.log(folderSelectedArray.value)
      }
      selectedFolder.value = folder.id
    }

    const findFolderIndexByID = (id: string) => {
      return folders.value.findIndex((folder) => folder.id === id)
    }

    const returnFolderIsSelectedByType = (folder: iFolder) => {
      const index = findFolderIndexByID(folder.id)
      return index !== -1 ? folderSelectedArray.value[index] : false
    }

    // --- WATCH EFFECTS ---

    watchEffect(() => {
      ready.value = false
      FolderNote.value.folders = folders.value

      const newNotes: { [key: string]: iNote[] } = {}
      folders.value.forEach((folder) => {
        newNotes[folder.id] = notes.value[folder.id] || []
      })
      FolderNote.value.notes = newNotes

      //check if folderSelectedArray is the same length as folders, if not, add or remove items
      if (folderSelectedArray.value.length !== folders.value.length) {
        if (folderSelectedArray.value.length < folders.value.length) {
          //add items
          const diff = folders.value.length - folderSelectedArray.value.length
          for (let i = 0; i < diff; i++) {
            folderSelectedArray.value.push(false)
          }
        } else {
          //remove items
          const diff = folderSelectedArray.value.length - folders.value.length
          for (let i = 0; i < diff; i++) {
            folderSelectedArray.value.pop()
          }
        }
      }
      ready.value = true
      rerender()
    })

    // --- RETURN ---

    return {
      folders,
      selectedFolder,
      ready,
      FolderNote,
      openedFolders,
      newFolderName,
      addingFolder,
      addFolder,
      selectFolder,
      returnFolderIsSelectedByType,
      startAddingFolder,
      finishAddingFolder
    }
  }
})
</script>

<template>
  <aside class="side-nav">
    <div class="quick-actions">
      <button @click="startAddingFolder">
        <span class="material-icons button-icon">create_new_folder</span>
        New Folder
      </button>
    </div>

    <div class="folders" v-if="ready">
      <h3>Folders</h3>
      <ul>
        <li v-if="addingFolder">
          <input
            v-model="newFolderName"
            @keyup.enter="finishAddingFolder"
            placeholder="Enter folder name..."
            autofocus
          />
        </li>
        <FolderItem
          v-for="folder in folders"
          :key="folder.id"
          :folder="folder"
          :notes="FolderNote.notes[folder.id]"
          :isSelected="returnFolderIsSelectedByType(folder)"
          :isFolderOpen="openedFolders.includes(folder.id)"
          @select="(folder) => selectFolder(folder)"
          @refreshMain="$emit('refreshMain', $event)"
          @selectNote="$emit('selectNote', $event)"
        />
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.side-nav {
  width: 250px;
  background-color: var(--primary-bg);
  padding: 20px;
  color: var(--primary-text);
}

.quick-actions,
.folders {
  margin-bottom: 20px;
}

.button-icon {
  vertical-align: middle;
  margin-right: 5px;
}

.account-info {
  position: absolute;
  bottom: 20px;
  width: calc(100% - 40px);
}

li {
  list-style: none;
  margin-bottom: 5px;
  cursor: pointer;
}

ul {
  padding-left: 0;
}
@media (max-width: 768px) {
  .side-nav {
    position: fixed;
    width: 250px;
    height: 100vh;
    overflow-y: auto;
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    transform: translateX(-100%);
  }
  .side-nav.show {
    transform: translateX(0);
  }
  .quick-actions button {
    padding: 3px 7px;
    font-size: 12px;
  }

  .quick-actions,
  .folders,
  .tags {
    margin-bottom: 10px;
  }
}
</style>
import type { iFolder } from "@/firebase/firestore/iFolder"
@/firebase/firestore/folderFunctions../firebase/firestore/noteFunctions