import  {db}  from "../firebase"
import type {iUser} from './users'
import { collection, addDoc, getDocs, setDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";

export interface iFolder
{
    id: string;
    name: string;
    notes?: iNote[];
}


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
  
  

const getFolderFromID = async (id: string, user: iUser): Promise<iFolder | null> => {
    const querySnapshot = await getDocs(collection(db, "users", user.userID, "folders"));
    
    for (const doc of querySnapshot.docs) {
      if (doc.id === id) {
        console.log("found folder");
        return doc.data() as iFolder;
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


const fetchFolderNoteCollection = async (user: iUser): Promise<iFolderNoteCollection> => {
    const folderNoteCollection: iFolderNoteCollection = {
      folders: [],
      notes: {},
    };
  
    try {
      // Fetch all folders for this user
      const folderSnapshot = await getDocs(collection(db, "users", user.userID, "folders"));
      if (folderSnapshot.empty) {
        console.log("No folders found");
        return folderNoteCollection;
      }
  
      folderSnapshot.forEach((doc) => {
        const folderData = doc.data() as iFolder;
        folderNoteCollection.folders.push(folderData);
      });
  
      console.log("Fetched folders:", folderNoteCollection.folders);
  
      // Fetch all notes for each folder
      for (const folder of folderNoteCollection.folders) {
        const notes: iNote[] = [];
  
        const noteSnapshot = await getDocs(collection(db, "users", user.userID, "folders", folder.id, "notes"));
        if (noteSnapshot.empty) {
          console.log(`No notes found for folder with ID: ${folder.id}`);
          continue;
        }
  
        noteSnapshot.forEach((doc) => {
          const noteData = doc.data() as iNote;
          notes.push(noteData);
        });
  
        console.log(`Fetched notes for folder with ID ${folder.id}:`, notes);
        
        folderNoteCollection.notes[folder.id] = notes;
      }
  
      return folderNoteCollection;
  
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Failed to fetch folder and note collection");
    }
  };
  

const generateID = () => {
    return Math.random().toString(36).substring(7);
}

export {createFolder, 
    readFolders, 
    updateFolder, 
    deleteFolder, 
    createNote, readNotes, updateNote, deleteNote, fetchFolderNoteCollection, 
    generateID, findNoteByID, getFolderFromID};