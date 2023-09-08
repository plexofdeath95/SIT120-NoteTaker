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
