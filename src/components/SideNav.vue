<script lang="ts">
import { defineComponent, ref, watchEffect, type PropType } from 'vue'
import FolderItem from '@/components/SideNav/FolderItem.vue' // Adjust the path accordingly
import type { iFolder, iFolderNoteCollection, iNote } from '../firebase/firestore/notes'
import noteFunctions from '../firebase/firestore/notes'
import { onBeforeMount, onMounted, onUnmounted, watch } from 'vue'
import type { iUser } from '@/firebase/firestore/users'


export default defineComponent({
  name: 'SideNav',
  props: {
    user: {
      type: Object as PropType<iUser> || undefined,
      required: false
    }
  },
  components: {
    FolderItem
  },
  async setup(props) {
    const folders = ref<iFolder[]>([])
    const selectedFolder = ref<string>('')
    const notes = ref<iNote[]>([])
    const FolderNote = ref<iFolderNoteCollection>()
    const folderSelectedArray = ref<boolean[]>([])
    const user = ref<iUser>()
    const ready = ref(false)
    if (props.user) {
      user.value = props.user
      if(user.value)
       await refreshFolders(user.value)
      ready.value = true
    }

    //check if we have folders and notes within folders,
    //populate folders and notes in a tree structure for display
    if (FolderNote.value) {
      //get folders
      FolderNote.value.folders.forEach((folder) => {
        folders.value.push(folder)
        folderSelectedArray.value.push(false)

      })

      //use folder names as keys to get notes
      folders.value.forEach((folder) => {
        const noteData = FolderNote.value?.notes[folder.id]
        console.log(noteData)
        if (noteData) {
          folder.notes = []
          noteData.forEach((note) => {
            if(folder.notes)
              folder.notes.push(note)
            console.log("Hello!")
            console.log(note)
          })
        }
      })
    }

   async function refreshFolders(user: iUser)
   {
      ready.value = false
      FolderNote.value = await noteFunctions.fetchFolderNoteCollection(user)
      ready.value = true
   }
   async function addFolder() {
      const newFolder = prompt('Enter folder name:')
      console.log(props.user)
      if (newFolder) {
        await noteFunctions.createFolder( newFolder, props.user)
      }
      if(user.value)
        await refreshFolders(user.value)
    }

    function selectFolder(folder: iFolder) {
      localStorage.setItem('selectedFolder', JSON.stringify(folder.id))
      const index = findFolderIndexByID(folder.id)
      //toggle all to false
      folderSelectedArray.value.forEach((folder, index) => {
        folderSelectedArray.value[index] = false
      })
      if (index !== -1) {
        folderSelectedArray.value[index] = true
      }
    }

    function findFolderIndexByID(id: string) {
      return folders.value.findIndex((folder) => folder.id === id)
    }
    
    function returnFolderIsSelectedByType(folder: iFolder) {
      const index = findFolderIndexByID(folder.id)
      if (index !== -1) {
        return folderSelectedArray.value[index]
      }
      return false
    }

    return {
      folders,
      selectedFolder,
      ready,
      addFolder,
      selectFolder,
      returnFolderIsSelectedByType
    }
  }
})
</script>

<template>
  <aside class="side-nav">
    <div class="quick-actions">
      <button @click="addFolder">
        <span class="material-icons button-icon">create_new_folder</span>
        <!-- Material Icon for new folder -->
        New Folder
      </button>
    </div>

    <div class="folders" v-if=ready>
      <h3>Folders</h3>
      <ul>
        <FolderItem
          v-for="folder in folders"
          :key="folder.id"
          :folder="folder"
          :isSelected="returnFolderIsSelectedByType(folder)"
          @select="{selectFolder}"
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
