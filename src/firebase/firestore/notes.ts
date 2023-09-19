import  db  from "../firebase"
import type {iUser} from './users'
import { collection, addDoc, getDocs, setDoc, deleteDoc, doc } from "firebase/firestore";

export interface iFolder
{
    id: string;
    name: string;
}


export interface iNote
{
    id: string;
    title: string;
    content: string;
    timestamp: number;
    folder: string;
}

export interface iFolderNoteCollection {
    folders: iFolder[];
    notes: {
      [folderName: string]: iNote[];
    };
  }
  

//create folder under a specific user as a subcollection
const createFolder = async (folder: string, user?: iUser) => {
    try {
        if(!user)
        {
            throw new Error("User not logged in");
        }
        const newFolder: iFolder = {
            id: "",
            name: folder
        }
        //generate an id for the folder
        newFolder.id = Math.random().toString(36).substring(7);
        //create new document with the id
        await setDoc(doc(db, "users", user.userID, "folders", newFolder.id), newFolder);
        console.log("Document written with ID: ");
        return newFolder;
    } catch (e) {
        console.error("Error adding document: ", e);
        return null;
    }
}

//read all folders under a specific user
const readFolders = async (user: iUser) => {
    const querySnapshot = await getDocs(collection(db, "users", user.userID, "folders"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
    });

    return querySnapshot;
}

//update folder under a specific user
const updateFolder = async (id: string, folder: iFolder, user: iUser) => {
    try {
        await setDoc(doc(db, "users", user.userID, "folders", id), folder);
    } catch (e) {
        console.error("Error updating document: ", e);
    }


}

//delete folder under a specific user
const deleteFolder = async (id: string, user: iUser) => {
    try {
        await deleteDoc(doc(db, "users", user.userID, "folders", id));
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
}

//create note under a specific user as a subcollection, notes
// are always created under a folder
//they will be created under a default folder if no folder is specified
const createNote = async (note: iNote, folder: iFolder, user: iUser) => {
    //check if folder exists
    let folderExists = false;
    const querySnapshot = await getDocs(collection(db, "users", user.userID, "folders"));
    querySnapshot.forEach((doc) => {
        if(doc.id === folder.name)
        {
            folderExists = true;
        }
    });

    //if folder exists, create note under folder
    if(folderExists)
    {
        try {
            const docRef = await addDoc(collection(db, "users", user.userID, "folders", folder.name, "notes"), note);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    //if folder does not exist, create folder and note under folder
    else
    {
        try {
            const docRef = await addDoc(collection(db, "users", user.userID, "folders", folder.name, "notes"), note);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}

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
        if(doc.id === folder.name)
        {
            folderExists = true;
        }
    });

    //if folder exists, update note under folder
    if(folderExists)
    {
        try {
            await setDoc(doc(db, "users", user.userID, "folders", folder.name, "notes", id), note);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    }
    //if folder does not exist, create folder and note under folder
    else
    {
        try {
            await setDoc(doc(db, "users", user.userID, "folders", folder.name, "notes", id), note);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    }
}

//delete note under a specific user
const deleteNote = async (id: string, folder: iFolder, user: iUser) => {
    //check if folder exists
    let folderExists = false;
    const querySnapshot = await getDocs(collection(db, "users", user.userID, "folders"));
    querySnapshot.forEach((doc) => {
        if(doc.id === folder.name)
        {
            folderExists = true;
        }
    });

    //if folder exists, delete note under folder
    if(folderExists)
    {
        try {
            await deleteDoc(doc(db, "users", user.userID, "folders", folder.name, "notes", id));
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    }
    //if folder does not exist, create folder and note under folder
    else
    {
        try {
            await deleteDoc(doc(db, "users", user.userID, "folders", folder.name, "notes", id));
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    }
}

const fetchFolderNoteCollection = async (user: iUser): Promise<iFolderNoteCollection> => {
  const folderNoteCollection: iFolderNoteCollection = {
    folders: [],
    notes: {},
  };

  // Fetch all folders for this user
  const folderSnapshot = await getDocs(collection(db, "users", user.userID, "folders"));
  folderSnapshot.forEach((doc) => {
    const folderData = doc.data() as iFolder;
    folderNoteCollection.folders.push(folderData);
  });

  // Fetch all notes for each folder
  for (const folder of folderNoteCollection.folders) {
    const notes: iNote[] = [];

    const noteSnapshot = await getDocs(collection(db, "users", user.userID, "folders", folder.name, "notes"));
    noteSnapshot.forEach((doc) => {
      const noteData = doc.data() as iNote;
      notes.push(noteData);
    });

    folderNoteCollection.notes[folder.name] = notes;
  }

  return folderNoteCollection;
};


export default {createFolder, readFolders, updateFolder, deleteFolder, createNote, readNotes, updateNote, deleteNote, fetchFolderNoteCollection};