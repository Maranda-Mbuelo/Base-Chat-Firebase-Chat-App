import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, DocumentData, where, getDocs, query, getDoc, DocumentReference, QuerySnapshot, setDoc } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { IMediaPost, IPost } from '../interfaces/others.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  

  constructor(private firestore: Firestore) {}

  async addPost(post: IPost, userId: string): Promise<string> {
    const collectionDatabase = collection(this.firestore, `users/${userId}/post`);
    // Add a new document to the 'users' collection with the user data
    const docRef = await addDoc(collectionDatabase, post);
    const newPost: Partial<IPost> = {
      id: docRef.id,
      content: post.content,
      timestamp: post.timestamp,
      likes: 0
    }
    const docDatabase = doc(this.firestore, `users/${userId}/post`, docRef.id);
    updateDoc(docDatabase, newPost);
    // Return the ID of the newly added document
    return docRef.id;
  }

  async addMediaPost(post: IMediaPost, userId: string): Promise<string> {
    const collectionDatabase = collection(this.firestore, `users/${userId}/mediapost`);
    
    // Add a new document to the 'users' collection with the user data
    const docRef = await addDoc(collectionDatabase, post);

    const newPost: Partial<IMediaPost> = {
        id: docRef.id, // Use the ID from the docRef
        content: post.content,
        timestamp: post.timestamp,
        likes: post.likes,
        images: post.images
    };

    // Update the document with the newly created post
    await updateDoc(doc(collectionDatabase, docRef.id), newPost);

    // Return the ID of the newly added document
    return docRef.id;
}

  

  updatePostId(userId: string, id: string, data: Partial<IPost>) {
    const docDatabase = doc(this.firestore, `users/${userId}/post`, id);
    return updateDoc(docDatabase, data);
  }

  getUserPosts(userId: string): Observable<IPost[]> {
    const collectionDatabase = collection(this.firestore, `users/${userId}/post`);
    return collectionData(collectionDatabase).pipe(
      map((posts: (DocumentData | (DocumentData & {}))[]) => {
        return posts.map(post => post as IPost); // Explicitly cast each post to IPost
      })
    );
  }

  getUserMediaPosts(userId: string): Observable<IMediaPost[]> {
    const collectionDatabase = collection(this.firestore, `users/${userId}/mediapost`);
    return collectionData(collectionDatabase).pipe(
      map((posts: (DocumentData | (DocumentData & {}))[]) => {
        return posts.map(post => post as IMediaPost); // Explicitly cast each post to IPost
      })
    );
  }

  // uploadImage(file: any, userID: string): Observable<string> {
  //   if (!file || !userID) {
  //     return throwError('Invalid file or userID');
  //   }
  
  //   const storage = getStorage();
  //   // Append a timestamp or a unique identifier to the image name
  //   const imageName = `post-image_${new Date().getTime()}_${Math.random()}`;
  
  //   const storageRef = ref(storage, `post-images/${userID}/${imageName}`);
  
  //   return from(uploadBytes(storageRef, file)).pipe(
  //     switchMap(snapshot => from(getDownloadURL(snapshot.ref))),
  //     catchError(error => {
  //       console.error('Error uploading image:', error);
  //       return throwError('Image upload failed');
  //     })
  //   );
  // }
  

  async uploadImage(file: any, userID: string): Promise<string> {
    const storage = getStorage();
    // Append a timestamp or a unique identifier to the image name
    const imageName = `post-image_${new Date().getTime()}_${Math.random()}`;

    const storageRef = ref(storage, `post-images/${userID}/${imageName}`);
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    // Return the download URL, actual url for the image
    return downloadURL;
  }
  

  async getPostById(userId: string, postId: string): Promise<IPost | null> {
    const postDocRef = doc(collection(this.firestore, `users/${userId}/post`), postId);

    try {
      const postSnapshot = await getDoc(postDocRef);

      if (postSnapshot.exists()) {
        const postData = postSnapshot.data() as IPost;
        return postData;
      } else {
        console.error('Post not found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching post data:', error);
      return null;
    }
  }

  deletePost(id: string, userId: string) {
    const docDatabase = doc(this.firestore, `users/${userId}/post`, id);
    return deleteDoc(docDatabase);
  }
  
}
