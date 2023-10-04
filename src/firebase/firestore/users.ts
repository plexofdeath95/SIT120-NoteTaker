import  {db}  from "../firebase";
import { collection, addDoc, getDocs, setDoc, deleteDoc, doc, getDoc } from "firebase/firestore";

export interface iUser
{
    username: string;
    email: string;
    userID: string;
}

async function createUser(user: iUser) {
    try {
        // Use the setDoc function, and create a reference to the document with user.userID as its ID
        await setDoc(doc(db, "users", user.userID), user);
        console.log("Document written with ID: ", user.userID);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function readUsers(): Promise<iUser[]> {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: iUser[] = [];
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        const user = doc.data() as iUser;
        users.push(user);
    });
    return users;
}


async function getUser(id: string): Promise<iUser | null> {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return docSnap.data() as iUser;
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null;
    }
}

async function updateUser(id: string, user: iUser) {
    try {
        await setDoc(doc(db, "users", id), user);
    } catch (e) {
        console.error("Error updating document: ", e);
    }
}

async function deleteUser(id: string) {
    try {
        await deleteDoc(doc(db, "users", id));
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
}


export {createUser, readUsers, updateUser, deleteUser, getUser};