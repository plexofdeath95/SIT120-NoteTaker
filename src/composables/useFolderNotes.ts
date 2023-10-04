import { ref, type Ref} from 'vue';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import type { iFolder, iNote } from '@/firebase/firestore/notes';
import type { iUser
 } from '@/firebase/firestore/users';

 
 export function useFolderNotes(user: iUser, cleanup: (_cleanup:any) => void = () => {}) {
    const folders: Ref<iFolder[]> = ref([]);
    const notes: Ref<Record<string, iNote[]>> = ref({});

    const unsubscribes: (() => void)[] = [];

    const userFoldersRef = collection(db, "users", user.userID, "folders");

    const folderUnsubscribe = onSnapshot(userFoldersRef, folderSnapshot => {
        if (folderSnapshot.empty) {
            console.log("No folders found");
            return;
        }

        const tempFolders: iFolder[] = [];
        folderSnapshot.forEach(doc => {
            const folderData = doc.data() as iFolder;
            tempFolders.push(folderData);
        });

        folders.value = tempFolders;

        tempFolders.forEach(folder => {
            const notesRef = collection(db, "users", user.userID, "folders", folder.id, "notes");

            const notesUnsubscribe = onSnapshot(notesRef, noteSnapshot => {
                const tempNotes: iNote[] = [];
                noteSnapshot.forEach(doc => {
                    const noteData = doc.data() as iNote;
                    tempNotes.push(noteData);
                });

                notes.value[folder.id] = tempNotes;
        
            });

            unsubscribes.push(notesUnsubscribe);
        });

        unsubscribes.push(folderUnsubscribe);
    });

    // Cleanup function
    cleanup(() => {
        console.log("Cleaning up subscriptions");
        for (const unsubscribe of unsubscribes) {
            unsubscribe();
        }
    });

    return {
        folders,
        notes
    }
}

