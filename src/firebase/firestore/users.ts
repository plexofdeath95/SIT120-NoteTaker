import  db  from "../firebase";
import { collection, addDoc, getDocs, setDoc, deleteDoc, doc } from "firebase/firestore";

export interface iUser
{
    username: string;
    email: string;
    userID: string;
}

async function createUser(user: iUser) {
    try {
        const docRef = await addDoc(collection(db, "users"), user);
        console.log("Document written with ID: ", docRef.id);
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


export default {createUser, readUsers, updateUser, deleteUser};