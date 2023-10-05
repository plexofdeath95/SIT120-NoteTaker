<script lang="ts">
import { defineComponent, ref, type PropType, onBeforeMount, watch } from 'vue'
import {
  generateID,
  createNote,
  findNoteByID,
  updateNote,
  deleteNote,
  type iNote
} from '../firebase/firestore/noteFunctions'

import { getFolderFromID, updateFolder, type iFolder } from '@/firebase/firestore/folderFunctions'
import type { iUser } from '@/firebase/firestore/users'

import { Timestamp } from 'firebase/firestore'

export default defineComponent({
  name: 'MainDisplay',
  props: {
    note: {
      type: (Object as PropType<iNote>) || undefined,
      required: false
    },
    user: {
      type: Object as PropType<iUser>,
      required: true
    }
  },
  setup(props) {
    const noteTitle = ref('Untitled Note')
    const noteContent = ref('This is a sample note content.')
    const noteID = ref('')
    const user = ref<iUser>(props.user)
    const currFolder = ref<iFolder>({
      id: '',
      name: ''
    })

    const noteData = ref<iNote>({
      id: '',
      title: noteTitle.value,
      content: noteContent.value,
      timestamp: Timestamp.now(),
      folder: ''
    })
    const previousNoteData = ref<iNote | null>(noteData.value)

    user.value = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : undefined

    const isNoteSaved = ref(true)

    // Watch for changes in noteTitle or noteContent
    watch([noteTitle, noteContent], () => {
      isNoteSaved.value = false
    })
    onBeforeMount(async () => {
      if (props.note) {
        noteTitle.value = props.note.title
        noteContent.value = props.note.content
        noteID.value = props.note.id
        noteData.value = props.note
        const res = await getFolderFromID(props.note.folder, user.value)
        if (res) {
          currFolder.value = res
        }
      } else {
        //generate a new noteID
        noteID.value = generateID()
      }
    })
    async function newNote() {
      // Logic to create a new note
      //get user from local storage
      noteID.value = generateID()
      const user: iUser = JSON.parse(localStorage.getItem('user') || '{}')
      if (user) {
        //get current folderID
        const folderID = JSON.parse(localStorage.getItem('selectedFolder') || '{}')
        if (folderID) {
          //get folder from folderID
          const folder = await getFolderFromID(folderID, user)
          if (noteContent.value === undefined) {
            noteContent.value = ''
          }
          if (folder) {
            //check if note title empty
            if (noteTitle.value === '') {
              noteTitle.value = 'Untitled note'
            }

            //create new note
            const newNoteData: iNote = {
              id: noteID.value,
              title: noteTitle.value,
              content: noteContent.value,
              timestamp: Timestamp.now(),
              folder: folderID
            }
            createNote(newNoteData, folder, user)
          }
        }
      }
    }
    async function saveNote() {
      // Logic to save the note
      //get user from local storage
      const user: iUser = JSON.parse(localStorage.getItem('user') || '{}')
      if (user) {
        //get current folderID
        const folderID = JSON.parse(localStorage.getItem('selectedFolder') || '{}')
        if (folderID) {
          //get folder from folderID
          const folder = await getFolderFromID(folderID, user)

          if (folder) {
            //get note from noteTitle
            const note = await findNoteByID(noteID.value, folder, user)
            if (note !== null) {
              //update note content
              note.content = noteContent.value
              note.title = noteTitle.value
              note.timestamp = Timestamp.now()
              //update folder
              updateFolder(folderID, folder, user)
              updateNote(noteID.value, note, folder, user)
            } else {
              //create new note
              const newNoteData: iNote = {
                id: noteID.value,
                title: noteTitle.value,
                content: noteContent.value,
                timestamp: Timestamp.now(),
                folder: folderID
              }
              createNote(newNoteData, folder, user)
            }
          }
        }
      }
      isNoteSaved.value = true
    }
    const toggleSave = () => {
      isNoteSaved.value = false
    }
    async function deleteItem() {
      // Logic to delete the note

      const user: iUser = JSON.parse(localStorage.getItem('user') || '{}')
      if (props.note) {
        const folder = await getFolderFromID(props.note.folder, user)
        if (folder) {
          await deleteNote(noteID.value, folder, user)
          noteContent.value = ''
          noteTitle.value = ''
          noteID.value = generateID()

          currFolder.value = folder
          noteData.value = {
            id: noteID.value,
            title: '',
            content: '',
            timestamp: Timestamp.now(),
            folder: folder.id
          }
        }
      }
    }

    return {
      noteTitle,
      noteContent,
      noteData,
      currFolder,
      isNoteSaved,
      toggleSave,
      saveNote,
      deleteItem,
      newNote
    }
  }
})
</script>

<template>
  <div class="main-display">
    <div class="inner-display">
      <div class="current-note-display">
        <span>Current File: {{ currFolder.name }}/{{ noteTitle }}</span>
        <span v-if="!isNoteSaved" class="unsaved-indicator">*</span>
        <div class="note-details">
          <span>{{ noteData.timestamp.toDate() }}</span>
        </div>
      </div>
      <div class="note-header">
        <input type="text" v-model="noteTitle" placeholder="Note Title" />

        <button @click="newNote">
          <span class="material-icons button-icon">add</span>
        </button>
        <button @click="saveNote">
          <span class="material-icons button-icon">save</span>
        </button>
        <button @click="deleteItem">
          <span class="material-icons button-icon">delete</span>
        </button>
      </div>

      <div class="note-textarea">
        <div class="line-numbers"></div>
        <textarea
          class="note-content"
          v-model="noteContent"
          placeholder="Your note..."
          @input="toggleSave"
        ></textarea>
      </div>
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

.current-note-display {
  margin-bottom: 20px;
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
import { getFolderFromID } from "@/firebase/firestore/getFolderFromID" import type { iFolder } from
"@/firebase/firestore/iFolder"
@/firebase/firestore/folderFunctions../firebase/firestore/noteFunctions../firebase/firestore/noteFunctions