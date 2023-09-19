<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue'
import type { iFolder, iNote } from '../firebase/firestore/notes'
import noteFunctions from '../firebase/firestore/notes'
import type { iUser } from '@/firebase/firestore/users'

export default defineComponent({
  name: 'MainDisplay',
  props:
  {
    note: {
      type: Object as PropType<iNote> || undefined,
      required: false
    }
  },
  setup(props) {
    const noteTitle = ref('Sample Title')
    const noteContent = ref('This is a sample note content.')
    const noteID = ref('')
    const user = ref<iUser>()

    user.value = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : undefined
    if(props.note)
    {
      noteTitle.value = props.note.title
      noteContent.value = props.note.content
      noteID.value = props.note.id
      console.log(noteID.value)
    }
    else
    {
      //generate a new noteID
      noteID.value = noteFunctions.generateID()
    }

    async function saveNote() {
      // Logic to save the note
      //get user from local storage
      const user:iUser = JSON.parse(localStorage.getItem('user') || '{}')
      if(user)
      {
        console.log(user)
        //get current folderID
        const folderID = JSON.parse(localStorage.getItem('selectedFolder') || '{}')
        if(folderID)
        {
          console.log(folderID)
          //get folder from folderID
          const folder = await noteFunctions.getFolderFromID(folderID, user)
          console.log(folder)
          if(folder)
          {
            console.log("Found Folder")
            //get note from noteTitle
            const note = await noteFunctions.findNoteByID(noteID.value, folder, user)
            if(note !== null)
            {
              //update note content
              note.content = noteContent.value
              //update folder
              noteFunctions.updateFolder(folderID, folder, user)
              noteFunctions.updateNote(noteID.value, note, folder, user)
            }
            else
            {
              //create new note
              const newNoteData:iNote = {
                id: noteID.value,
                title: noteTitle.value,
                content: noteContent.value,
                timestamp: new Date(),
                folder: folderID
              }
              noteFunctions.createNote(newNoteData, folder, user)
            }
          }
        }
      }
      //get the current selected folder, if none, create a new default folder

    }

    async function deleteNote() {
      // Logic to delete the note
      console.log(`Deleted: ${noteTitle.value}`)
      const user:iUser = JSON.parse(localStorage.getItem('user') || '{}')
      if(props.note){
        const folder = await noteFunctions.getFolderFromID(props.note.folder, user)
        if(folder)
          await noteFunctions.deleteNote(noteID.value, folder, user)
      }
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
        <button @click="{saveNote(); $emit('rerender')}">
          <span class="material-icons button-icon">save</span>
        </button>
        <button @click="{deleteNote();  $emit('rerender')}">
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
