import { Observable, map } from 'rxjs';
import { IMessage } from './../interfaces/message.model';
import { IUser } from './../interfaces/user.model';
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, DocumentData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) {}

  addUser(user: IUser) {
    const collectionDatabase = collection(this.firestore, 'users');
    return addDoc(collectionDatabase, user);
  }

  getUsers() {
    const collectionDatabase = collection(this.firestore, 'users');
    return collectionData(collectionDatabase, { idField: 'id' });
  }

  updateUser(id: string, data: Partial<IUser>) {
    const docDatabase = doc(this.firestore, 'users', id);
    return updateDoc(docDatabase, data);
  }

  deleteUser(id: string) {
    const docDatabase = doc(this.firestore, 'users', id);
    return deleteDoc(docDatabase);
  }

  // Messages

  addMessage(message: IMessage){
    const collectionDatabase = collection(this.firestore, 'messages');
    return addDoc(collectionDatabase, message);
  }

  getMessagesByUserId(senderId: string, receiverId: string): Observable<IMessage[]> {
    const collectionDatabase = collection(this.firestore, 'messages');
    
    // Fetch all messages and filter on the client side
    return collectionData(collectionDatabase, { idField: 'id' }).pipe(
      map((messages: (DocumentData | (DocumentData & { id: string; }))[]) => {
        // Explicitly cast each message to IMessage
        return messages.map(message => message as IMessage);
      }),
      map((messages: IMessage[]) => {
        return messages.filter(message => message.senderId === senderId && message.receiverId === receiverId);
      })
    );
  }
}
