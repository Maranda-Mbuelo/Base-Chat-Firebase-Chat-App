import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, from, map, switchMap, throwError } from 'rxjs';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, DocumentData, where, getDocs, query, getDoc, DocumentReference, QuerySnapshot, setDoc, increment, docData, arrayRemove } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) { }

  async updateFollowing(currentUserId: string, followerUserId: string): Promise<void> {
    // Get references to the user documents
    const currentUserDocRef = doc(this.firestore, `users/${currentUserId}`);
    const followerUserDocRef = doc(this.firestore, `users/${followerUserId}`);
  
    // Check if the follower is not already in the 'following' array of the current user
    const currentUserSnapshot = await getDoc(currentUserDocRef);
    const followingArray = currentUserSnapshot.data()?.['following'] || [];

    if (!followingArray.includes(followerUserId)) {
        // Update the 'following' array for the current user
        await updateDoc(currentUserDocRef, { following: [...followingArray, followerUserId] });
        
        // Update the 'followers' array for the user being followed
        const followerArray = currentUserSnapshot.data()?.['followers'] || [];
        await updateDoc(followerUserDocRef, { followers: [...followerArray, currentUserId] });
        
        // Update the 'followingCount' for the current user
        await updateDoc(currentUserDocRef, { followingCount: increment(1) });

        // Update the 'followersCount' for the user being followed
        await updateDoc(followerUserDocRef, { followersCount: increment(1) });
    }
}


  // async updateFollowing(currentUserId: string, followingUserId: string): Promise<void> {
  //   const followingCollection = collection(this.firestore, `users/${currentUserId}/following`);

  //   const followingDocRef = doc(followingCollection, followingUserId);
  //   const followingDoc = await getDoc(followingDocRef);

  //   if (!followingDoc.exists()) {
  //     await setDoc(followingDocRef, {});
  //   }
  // }

  getFollowingList(currentUserId: string): Observable<string[]> {
    const currentUserDocRef = doc(this.firestore, `users/${currentUserId}`);
    return docData(currentUserDocRef, { idField: 'id' }).pipe(
        map((data: any) => data.following || [])
    );
  }

  getFollowersList(currentUserId: string): Observable<string[]> {
      const currentUserDocRef = doc(this.firestore, `users/${currentUserId}`);
      return docData(currentUserDocRef, { idField: 'id' }).pipe(
          map((data: any) => data.followers || [])
      );
  }

  async removeUserFromFollowing(currentUserId: string, userIdToRemove: string): Promise<void> {
    // Update the 'followingCount' in the user document
    const currentUserDocRef = doc(this.firestore, `users/${currentUserId}`);
    await updateDoc(currentUserDocRef, { followingCount: increment(-1) });
  
    // Remove the user from the 'following' array
    await updateDoc(currentUserDocRef, { following: arrayRemove(userIdToRemove) });



    const userIdToRemoveDocRef = doc(this.firestore, `users/${userIdToRemove}`);
    await updateDoc(userIdToRemoveDocRef, { followersCount: increment(-1) });
  
    // Remove the user from the 'followers' array
    await updateDoc(userIdToRemoveDocRef, { followers: arrayRemove(userIdToRemove) });
  }
  
  


  async isUserInFollowingList(currentUserId: string, targetUserId: string): Promise<boolean> {
    // Get the user document of the current user
    const currentUserDocRef = doc(this.firestore, `users/${currentUserId}`);
    const currentUserDoc = await getDoc(currentUserDocRef);
  
    if (currentUserDoc.exists()) {
      // Retrieve the 'following' array from the user document
      const followingArray = currentUserDoc.data()?.['following'] || [];
      console.info(...followingArray);
      
      // Check if the targetUserId is present in the 'following' array
      return followingArray.includes(targetUserId);
    }
  
    return false; // Return false if the current user document doesn't exist
  }
  
}
