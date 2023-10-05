import  {db}  from "../firebase"
import type { iFolder } from "./folderFunctions";
import type {iUser} from './users'
import { collection, getDocs, setDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";




export interface iNote
{
    id: string;
    title: string;
    content: string;
    timestamp: Timestamp;
    folder: string;
}

export interface iFolderNoteCollection {
    folders: iFolder[];
    notes: {
      [folderName: string]: iNote[];
    };
  }
  
//create note under a specific user as a subcollection, notes
// are always created under a folder
//they will be created under a default folder if no folder is specified
const createNote = async (note: iNote, folder: iFolder, user: iUser) => {
    // Check if folder exists
    let folderExists = false;
    const querySnapshot = await getDocs(collection(db, "users", user.userID, "folders"));
    querySnapshot.forEach((doc) => {
        if(doc.id === folder.id) {
            folderExists = true;
        }
    });

    // If folder exists, create note under folder
    if(folderExists) {
        try {
            await setDoc(doc(db, "users", user.userID, "folders", folder.id, "notes", note.id), note);
            console.log("Document written with ID: ", note.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    // If folder does not exist, create folder and note under folder
    else {
        try {
            // First, create the folder
            await setDoc(doc(db, "users", user.userID, "folders", folder.id), folder);

            // Then, create the note under that folder
            await setDoc(doc(db, "users", user.userID, "folders", folder.id, "notes", note.id), note);
            console.log("Document written with ID: ", note.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
};


//read all notes under a specific user
const readNotes = async (user: iUser) => {
    const querySnapshot = await getDocs(collection(db, "users", user.userID, "folders"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });

    return querySnapshot;
}

//update note under a specific user
const updateNote = async (id: string, note: iNote, folder: iFolder, user: iUser) => {
    //check if folder exists
    let folderExists = false;
    const querySnapshot = await getDocs(collection(db, "users", user.userID, "folders"));
    querySnapshot.forEach((doc) => {
        if(doc.id === folder.id)
        {
            folderExists = true;
        }
    });

    //if folder exists, update note under folder
    if(folderExists)
    {
        try {
            await setDoc(doc(db, "users", user.userID, "folders", folder.id, "notes", id), note);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    }
    //if folder does not exist, create folder and note under folder
    else
    {
        try {
            await setDoc(doc(db, "users", user.userID, "folders", folder.id, "notes", id), note);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    }
}

const findNoteByID = async (id: string, folder: iFolder, user: iUser): Promise<iNote | null> => {
    const querySnapshot = await getDocs(collection(db, "users", user.userID, "folders", folder.id, "notes"));
  
    for (const doc of querySnapshot.docs) {
      if (doc.id === id) {
        return doc.data() as iNote;
      }
    }
  
    return null;
  }
  
  


  
//delete note under a specific user
const deleteNote = async (id: string, folder: iFolder, user: iUser) => {
    //check if folder exists
    let folderExists = false;
    const querySnapshot = await getDocs(collection(db, "users", user.userID, "folders"));
    querySnapshot.forEach((doc) => {
        if(doc.id === folder.id)
        {
            folderExists = true;
            console.log("found folder to delete from");
        }
    });

    //if folder exists, delete note under folder
    if(folderExists)
    {
        try {
            await deleteDoc(doc(db, "users", user.userID, "folders", folder.id, "notes", id));
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    }
    //if folder does not exist, create folder and note under folder
    else
    {
        try {
            await deleteDoc(doc(db, "users", user.userID, "folders", folder.id, "notes", id));
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    }
}




const generateID = () => {
    return Math.random().toString(36).substring(7);
}

export  {

    createNote, readNotes, updateNote, deleteNote, 
    generateID, findNoteByID, };