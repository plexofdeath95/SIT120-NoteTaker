<script lang="ts">
import { defineComponent, ref, type PropType, computed } from 'vue'
import type { iNote } from '../../firebase/firestore/noteFunctions'
import type { iFolder } from '../../firebase/firestore/folderFunctions'
import watch from 'vue'
export default defineComponent({
  name: 'FolderItem',
  props: {
    folder: {
      type: (Object as PropType<iFolder>) || undefined,
      required: true
    },
    notes: {
      type: (Array as PropType<iNote[]>) || undefined,
      required: false
    },
    isSelected: {
      type: Boolean,
      required: false
    },
    isFolderOpen: {
    type: Boolean,
    required: false,
    default: false
  }
  },
  setup(props) {
    const openedFolders = JSON.parse(localStorage.getItem('openedFolders') || '[]')
    const folderOpen = ref(props.isFolderOpen || openedFolders.includes(props.folder.id));


    const currFolder = ref(props.folder)
    const noteData = ref(props.notes)
    const folderSelected = ref(false)

    function toggleFolderIcon() {
      folderOpen.value = !folderOpen.value

      const openedFolders = JSON.parse(localStorage.getItem('openedFolders') || '[]')
      if (folderOpen.value) {
        openedFolders.push(props.folder.id)
      } else {
        const index = openedFolders.indexOf(props.folder.id)
        if (index > -1) {
          openedFolders.splice(index, 1)
        }
      }
      localStorage.setItem('openedFolders', JSON.stringify(openedFolders))
    }

    function selectFolder() {
      localStorage.setItem('selectedFolder', JSON.stringify(props.folder.id))
    }

    return {
      folderOpen,
      folderSelected,
      currFolder,
      noteData,
      toggleFolderIcon,
      selectFolder
    }
  }
})
</script>
<template>
  <li>
    <div :class="{ selected: isSelected }">
      <span
        @click="
          () => {
            selectFolder()
            $emit('select', currFolder)
          }
        "
      >
        <span class="material-icons folder-icon" @click.stop="toggleFolderIcon">
          {{ folderOpen ? 'folder_open' : 'folder' }}
        </span>
        {{ folder.name }}
      </span>
    </div>
    <transition name="fade-slide">
      <ul v-if="folderOpen" class="indented-list">
        <li v-for="note in noteData" :key="note.id" @click="$emit('selectNote', note)">
          <span class="material-icons note-icon">note</span>
          {{ note.title }}
        </li>
      </ul>
    </transition>
  </li>
</template>


<style scoped>
.folder-icon {
  margin-right: 8px;
  vertical-align: middle;
}

.indented-list {
  margin-left: 24px;
  list-style: none;
}

.note-icon {
  margin-right: 8px;
}
.selected {
    color: #FFF; /* Changing text color to white for better contrast with dark background */
    background-color: #4CAF50; /* A nice green color, you can change it to whatever you want */
    border: 1px solid #388E3C; /* Darker green for the border */
    border-radius: 5px; /* To give rounded corners */
    box-shadow: 0 2px 5px rgba(0,0,0,0.2); /* A subtle shadow to give a raised effect */
    padding: 5px; /* Some padding to give it space */
    transition: background-color 0.3s, box-shadow 0.3s; /* Smooth transition for hover effects */
}

.selected:hover {
    background-color: #388E3C; /* Darken background a bit on hover */
    box-shadow: 0 4px 8px rgba(0,0,0,0.2); /* Increase shadow size a bit on hover */
}


.folder-animation-enter-active,
.folder-animation-leave-active {
  transition:
    max-height 0.5s ease-in-out,
    opacity 0.4s ease-in-out;
  max-height: 1000px; /* assuming a large value to cater for long lists */
}
.folder-animation-enter,
.folder-animation-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
import type { iFolder } from "@/firebase/firestore/iFolder"
../../firebase/firestore/folderFunctions../../firebase/firestore/noteFunctions