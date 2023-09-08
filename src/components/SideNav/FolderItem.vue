<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'FolderItem',
  props: {
    name: {
      type: String,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectFolder() {
      this.$emit('select', this.name)
    }
  }
})
</script>

<template>
  <li @click="selectFolder">
    <span class="material-icons folder-icon">
      <!-- Use 'folder_open' if selected, otherwise 'folder' -->
      {{ isSelected ? 'folder_open' : 'folder' }}
    </span>
    {{ name }}
    <span v-if="isSelected" class="material-icons selected-icon">check_circle</span>
  </li>
</template>

<style scoped>
/* Your styles here, you can copy the ones you used for folder icons and selected icons */
.folder-icon {
  margin-right: 8px;
  vertical-align: middle;
}

.selected-icon {
  margin-left: 8px;
  vertical-align: middle;
  color: green;
}
</style>
