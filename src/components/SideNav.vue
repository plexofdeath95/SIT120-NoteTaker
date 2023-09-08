<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue'
import FolderItem from '@/components/SideNav/FolderItem.vue' // Adjust the path accordingly

export default defineComponent({
  name: 'SideNav',
  components: {
    FolderItem
  },
  setup() {
    const folders = ref(JSON.parse(localStorage.getItem('folders') || '[]'))
    const selectedFolder = ref(folders.value[0] || '')

    // Update local storage whenever folders change
    watchEffect(() => {
      localStorage.setItem('folders', JSON.stringify(folders.value))
    })

    function addFolder() {
      const newFolder = prompt('Enter folder name:')
      if (newFolder) {
        folders.value.push(newFolder)
      }
    }

    function selectFolder(folder: string) {
      selectedFolder.value = folder
    }

    return {
      folders,
      selectedFolder,
      addFolder,
      selectFolder
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
      <button @click="addTag">
        <span class="material-icons button-icon">local_offer</span>
        <!-- Material Icon for new tag -->
        New Tag
      </button>
    </div>

    <div class="folders">
      <h3>Folders</h3>
      <ul>
        <FolderItem
          v-for="folder in folders"
          :key="folder"
          :name="folder"
          :isSelected="folder === selectedFolder"
          @select="selectFolder"
        />
      </ul>
    </div>

    <div class="tags">
      <h3>Tags</h3>
      <ul>
        <li v-for="tag in tags" :key="tag">{{ tag }}</li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.side-nav {
  width: 250px;
  background-color: var(--secondary-bg);
  padding: 20px;
  color: var(--primary-text);
}

.quick-actions,
.folders,
.tags {
  margin-bottom: 20px;
}

.quick-actions button {
  background-color: var(--accent-1);
  color: white;
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
  border-radius: 10px;
}

.quick-actions button:hover {
  background-color: var(--accent-2);
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
</style>
