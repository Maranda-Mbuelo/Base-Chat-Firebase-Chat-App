import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Injectable, NgZone } from '@angular/core';
import { Observable, combineLatest, forkJoin, map, switchMap} from 'rxjs';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, DocumentData, getDoc, setDoc, increment, query } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { IMediaPost, IMiniUser, IPost, IPostWithUser } from '../interfaces/others.model';
import { deleteObject } from '@angular/fire/storage';
import { IFetchUser, IUser } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private firestore: Firestore, private ngZone: NgZone) {}

  getPostOwnerByPostId(postId: string): Observable<IUser | undefined> {
    return this.getAllUsers().pipe(
      switchMap((users) => {
        const userObservables: Observable<IUser | undefined>[] = [];
        users.forEach((user) => {
          const userPost$ = this.getUserPosts(user.id).pipe(
            map((posts) => posts.find((post) => post.id === postId))
          );
  
          const userMediaPost$ = this.getUserMediaPosts(user.id).pipe(
            map((mediaPosts) => mediaPosts.find((mediaPost) => mediaPost.id === postId))
          );
  
          const combined$ = combineLatest([userPost$, userMediaPost$]).pipe(
            map(([post, mediaPost]) => {
              if (post || mediaPost) {
                console.log(user);
                return user;
              } else {
                return undefined;
              }
            })
          );            
        });
        return forkJoin(userObservables).pipe(
          map((users) => users.find((user) => user !== undefined))
        );
      })
    );
  }  

  getAllPosts(): Observable<(IPost | IMediaPost)[]> {
    return this.getAllUsers().pipe(
      map((users) => {
        const allPosts: (IPost | IMediaPost)[] = [];
 
        users.forEach((user) => {
          const userRegularPosts$ = this.getUserPosts(user.id);
          const userMediaPosts$ = this.getUserMediaPosts(user.id);

          combineLatest([userRegularPosts$, userMediaPosts$]).subscribe(
            ([regularPosts, mediaPosts]) => {
              allPosts.push(...regularPosts, ...mediaPosts);
            } 
          );
        });

        return allPosts;
      })
    );
  }

  getAllUsers() {
    const collectionDatabase = collection(this.firestore, 'users');
    return collectionData(collectionDatabase, { idField: 'id' });
  }

  async addPost(post: IPost, userId: string, user: IFetchUser): Promise<string> {
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

    // Update the 'postsCount' count in moreuserinfo for the user being followed
    const postsCount = doc(this.firestore, `users/${userId}`);
    await updateDoc(postsCount, { postsCount: increment(1) });

    if(user.id){
      const miniUser: IMiniUser = {
        id : user.id,
        username : user.username,
        image: user.image
      }
      this.addToAllPost(post, miniUser, docRef.id);
    }

    
    return docRef.id;
  }

  async addToAllPost(post: IMediaPost | IPost, user: IMiniUser, id: string): Promise<string> {
    try {
      const collectionDatabase = collection(this.firestore, `allPosts`);
  
      // Add a new document to the 'allPosts' collection with the provided ID and combined data
      const combinedData = { post, user };
      const docRef = doc(collectionDatabase, id);
      await setDoc(docRef, combinedData);
  
      // Return the provided ID
      return id;
    } catch (error) {
      // Handle any errors here
      console.error('Error adding to allPosts:', error);
      throw error; // Re-throw the error for the caller to handle
    }
  }

  getAllPostsWithUsers(): Observable<(IPostWithUser)[]> {
    const collectionDatabase = collection(this.firestore, 'allPosts');

    return collectionData(query(collectionDatabase)).pipe(
      map((posts: (DocumentData | (DocumentData & {}))[]) => {
        return posts.map(post => post as IPostWithUser);
      })
    );
  }
  
  

  async addMediaPost(post: IMediaPost, userId: string, user: IFetchUser): Promise<string> {
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

    // Update the 'postsCount' count in moreuserinfo for the user being followed
    // Inside your function where you update the value
    this.ngZone.run(async () => {
      // Update the 'postsCount' count in moreuserinfo for the user being followed
      const postsCount = doc(this.firestore, `users/${userId}`);
      await updateDoc(postsCount, { postsCount: increment(1) });
    });

    // Return the ID of the newly added document
    if(user.id){
      const miniUser: IMiniUser = {
        id : user.id,
        username : user.username,
        image: user.image
      }
  
      this.addToAllPost(post, miniUser, docRef.id);
    }
    return docRef.id;
  }

  

  updatePostById(userId: string, id: string, data: Partial<IPost>) {
    const docDatabase = doc(this.firestore, `users/${userId}/post`, id);
    return updateDoc(docDatabase, data);
  }


  updateMediaPostById(userId: string, id: string, data: Partial<IMediaPost>) {
    const docDatabase = doc(this.firestore, `users/${userId}/mediapost`, id);
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
  

  async getPostById(userId: string, postId: string): Promise<IPost | IMediaPost | null> {
    const postDocRef = doc(collection(this.firestore, `users/${userId}/post`), postId);

    try {
      const postSnapshot = await getDoc(postDocRef);

      if (postSnapshot.exists()) {
        const postData = postSnapshot.data() as IPost;
        return postData;
      } else {
        const postDocRef = doc(collection(this.firestore, `users/${userId}/mediapost`), postId);
        try {
          const postSnapshot = await getDoc(postDocRef);
    
          if (postSnapshot.exists()) {
            const postData = postSnapshot.data() as IMediaPost;
            return postData;
          } else{
            console.error('Post not found');
          }
        } catch(error) {
          console.error('Error fetching post data:', error);
        }
        return null;
      }
    } catch (error) {
      console.error('Error fetching post data:', error);
      return null;
    }
  }

  // deletePost(id: string, userId: string, type: string) {
  //   // Check if userId is undefined or null
  //   if (!userId) {
  //     console.error('Invalid userId:', userId);
  //   }
  
  //   const docPath = (type === 'post')
  //     ? `users/${userId}/post/${id}`
  //     : (type === 'mediapost')
  //       ? `users/${userId}/mediapost/${id}`
  //       : null;
  
  //   // Check if docPath is null
  //   if (!docPath) {
  //     console.error('Invalid document path:', docPath);
  //   }
  
  //   const docDatabase = doc(this.firestore, docPath);
  
  //   deleteDoc(docDatabase);
  // }

  deleteMediaPost(id: string, userId: string): Promise<void> {
    const docDatabase = doc(this.firestore, `/users/${userId}/mediapost`, id);
  
    return deleteDoc(docDatabase).then(() => {
      this.ngZone.run(async () => {
        // Update the 'postsCount' count in moreuserinfo for the user being followed
        const postsCount = doc(this.firestore, `users/${userId}`);
        await updateDoc(postsCount, { postsCount: increment(-1) });
      });
      console.log('Media post deleted successfully');
    }).catch((err) => {
      console.log('Error deleting media post:', err);
      throw err; // Rethrow the error to propagate it
    });
  }
  


  deletePost(id: string, userId: string): Promise<void> {
    const docDatabase = doc(this.firestore, `users/${userId}/post`, id);
    
    return deleteDoc(docDatabase).then(() => {
      this.ngZone.run(async () => {
        const postsCount = doc(this.firestore, `users/${userId}`);
        await updateDoc(postsCount, { postsCount: increment(-1) });
      });
      console.log('data deleted');
    }).catch((err) => {
      console.log(err);
    })
  }
 
  

  async deleteImageByUrl(imageUrl: string): Promise<void> {
    const storage = getStorage();
    
    const storageRef = ref(storage, imageUrl);
  
    try {
      await deleteObject(storageRef);
      console.log('File Deleted');
    } catch (error: any) {
      // Handle errors
      console.error('Error deleting image:', error.message);
      throw error;
    }
  }


  
}
