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
    <div class="inner-display">
      <div class="note-header">
        <input type="text" v-model="noteTitle" placeholder="Note Title" />
        <button @click="saveNote">
          <span class="material-icons button-icon">save</span>
        </button>
        <button @click="deleteNote">
          <span class="material-icons button-icon">delete</span>
        </button>
      </div>
      <textarea class="note-content" v-model="noteContent" placeholder="Your note..."></textarea>
    </div>
  </div>
</template>

<style scoped>
.main-display {
  flex: 1;
  background-color: var(--primary-bg);
  margin-top: 20px;
  margin-left: 20px;
}

.inner-display {
  padding: 20px;
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
  background-color: var(--secondary-bg);
  color: var(--primary-text);
  border: none;
}

.button-icon {
  vertical-align: middle;
  margin-right: 5px;
}
.note-content {
  width: 95%;
  height: 85vh;
  resize: none;
  font-size: 1em;
  line-height: 1.6;
  border: none;
  background-color: var(--secondary-bg);
  color: var(--primary-text);
}

@media (max-width: 768px) {
  .main-display {
    margin-top: 10px;
    margin-left: 10px;
  }

  .note-header input {
    font-size: 16px;
    margin-right: 10px;
  }

  .note-content {
    min-height: 75vh;
    padding-bottom: 100px; /* Or some suitable value */
  }
}
</style>
