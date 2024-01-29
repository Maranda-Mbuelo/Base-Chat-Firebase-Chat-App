import { Observable, from, map } from 'rxjs';
import { IGetMessages, IMessage } from './../interfaces/message.model';
import { IFetchUser, IUser } from './../interfaces/user.model';
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, DocumentData, where, getDocs, query, getDoc, DocumentReference, QuerySnapshot } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) {}

  async addUser(user: IUser): Promise<string> {
    const collectionDatabase = collection(this.firestore, 'users');

    // Add a new document to the 'users' collection with the user data
    const docRef = await addDoc(collectionDatabase, user);

    // Return the ID of the newly added document
    return docRef.id;
  }

  getUsers() {
    const collectionDatabase = collection(this.firestore, 'users');
    return from(collectionData(collectionDatabase, { idField: 'id' }));
  }

  // getUserById(userId: string): Promise<IUser | null> {
  //   const userDocRef: DocumentReference<DocumentData> = doc(this.firestore, 'users', userId);

  //   return getDoc(userDocRef).then((userSnapshot) => {
  //     // If the user exists, return the user data
  //     if (userSnapshot.exists()) {
  //       return userSnapshot.data() as IUser;
  //     } else {
  //       // If the user does not exist, return null
  //       return null;
  //     }
  //   });
  // }

  async getUserById(userId: string): Promise<IFetchUser | null> {
    const userDocRef = doc(collection(this.firestore, 'users'), userId);

    try {
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as IFetchUser;
        userData.id = userDocRef.id;
        return userData;
      } else {
        console.error('User not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  updateUser(id: string, data: Partial<IUser>) {
    const docDatabase = doc(this.firestore, 'users', id);
    return updateDoc(docDatabase, data);
  }

  updateUserInformation(id: string, data: Partial<IUser>) {
    const docDatabase = doc(this.firestore, 'users', id);
    return updateDoc(docDatabase, data);
  }

  async getUserEmailById(userId: string): Promise<string | null> {
    const userDocRef = doc(collection(this.firestore, 'users'), userId);

    try {
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as IUser;
        return userData.email;
      } else {
        console.error('User not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  async getUserIdByEmail(email: string): Promise<string | null> {
    const collectionDatabase = collection(this.firestore, 'users');
    const q = query(collectionDatabase, where('email', '==', email));
  
    try {
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // Assuming there is only one user with a given email
        const userDoc = querySnapshot.docs[0];
        return userDoc.id;
      } else {
        console.error('User not found from email method');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  deleteUser(id: string) {
    const docDatabase = doc(this.firestore, 'users', id);
    return deleteDoc(docDatabase);
  }

  async uploadImage(file: any, username: string): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, 'profile pictures/' + username);
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    // Return the download URL, actual url for the image
    return downloadURL;
  }
  

  // Messages

  addMessage(message: IMessage, senderId: string, receiverId: string){
    const collectionDatabase = collection(this.firestore, 'messages/' + senderId + '/' + receiverId);
    return addDoc(collectionDatabase, message);
  }

  getMessagesByUserId(senderId: string, receiverId: string): Observable<IMessage[]> {
    const collectionDatabase = collection(this.firestore, 'messages/' + senderId + '/' + receiverId);
    
    // Fetch all messages and filter on the client side
    return collectionData(collectionDatabase, { idField: 'id' }).pipe(
      map((messages: (DocumentData | (DocumentData & { id: string; }))[]) => {
        // Explicitly cast each message to IMessage
        return messages.map(message => message as IGetMessages);
      }),
      map((messages: IGetMessages[]) => {
        return messages.filter(message => message.senderId === senderId && message.receiverId === receiverId);
      })
    );
  }
}
