<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainDisplay',
  setup() {
    const noteTitle = ref('Sample Title')
    const noteContent = ref('This is a sample note content.')

    function saveNote() {
      // Logic to save the note
      console.log(`Saved: ${noteTitle.value}, ${noteContent.value}`)
    }

    function deleteNote() {
      // Logic to delete the note
      console.log(`Deleted: ${noteTitle.value}`)
    }

    return {
      noteTitle,
      noteContent,
      saveNote,
      deleteNote
    }
  }
})
</script>

<template>
  <div class="main-display">
    <div class="note-header">
      <input type="text" v-model="noteTitle" placeholder="Note Title" />
      <button @click="saveNote">Save</button>
      <button @click="deleteNote">Delete</button>
    </div>
    <textarea class="note-content" v-model="noteContent" placeholder="Your note..."></textarea>
  </div>
</template>

<style scoped>
.main-display {
  flex: 1;
  background-color: var(--primary-bg);
  margin-top: 20px;
  margin-left: 20px;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 95%;
}

.note-header input {
  flex: 1;
  font-size: 1.2em;
  padding: 5px;
  margin-right: 20px;
}

.note-content {
  width: 95%;
  height: 85vh;
  resize: none;
  font-size: 1em;
  line-height: 1.6;
  border: none;
}
</style>
