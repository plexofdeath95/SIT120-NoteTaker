<script lang="ts">
import { defineComponent, ref, type PropType, computed } from 'vue'
import type { iFolder, iNote } from '../../firebase/firestore/notes'

export default defineComponent({
  name: 'FolderItem',
  props: {
    folder: {
      type: Object as PropType<iFolder> || undefined,
      required: true
    },
    notes: {
      type: Array as PropType<iNote[]> || undefined,
      required: false
    },
    isSelected: {
      type: Boolean,
      required: false
    }
  },
  setup(props)
  {
    const folderOpen = ref(false)
    const currFolder = ref(props.folder)
    const folderSelected = ref(false)
    function toggleFolderIcon() {
      folderOpen.value = !folderOpen.value
    }

    function selectFolder() {
      localStorage.setItem('selectedFolder', JSON.stringify(props.folder.id))
    }

    return {
      folderOpen,
      folderSelected,
      currFolder,
      toggleFolderIcon,
      selectFolder
    }
  }
})
</script>

<template>
  <li>
    <span @click="() => {selectFolder(); $emit('select', currFolder); $emit('refreshMain', currFolder)}" :class="{selected: isSelected}">
      <span class="material-icons folder-icon" @click="toggleFolderIcon">
        {{ folderOpen ? 'folder_open' : 'folder' }}
      </span>
      {{ folder.name }}
    </span>
    <ul v-if="folderOpen" class="indented-list">
      <li v-for="note in currFolder.notes" :key="note.id" @click="$emit('selectNote', note)">
        <span class="material-icons note-icon">note</span>
        {{ note.title }}
      </li>
    </ul>
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
  color: green;
}
</style>

