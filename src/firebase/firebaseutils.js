// src/firebaseutils.js
import { auth, db } from './firebase';
import {
  collection, doc, setDoc, getDocs, updateDoc,
  onSnapshot, serverTimestamp
} from 'firebase/firestore';

export async function fetchAllUsers(currentUid) {
  const usersCol = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCol);
  const usersList = usersSnapshot.docs
    .map(doc => ({ uid: doc.id, ...doc.data() }))
    .filter(user => user.uid !== currentUid); // exclude current user if needed
  return usersList;
}

export async function sendFriendRequest(fromUid, toUid) {
  const ref = doc(db, `users/${toUid}/requests`, fromUid);
  await setDoc(ref, {
    from: fromUid,
    status: 'pending',
    sentAt: serverTimestamp(),
  });
}

export function listenToFriendRequests(userUid, setRequests) {
  return onSnapshot(
    collection(db, `users/${userUid}/requests`),
    snapshot => {
      const pending = snapshot.docs
        .map(doc => ({ uid: doc.id, ...doc.data() }))
        .filter(r => r.status === 'pending');
      setRequests(pending);
    }
  );
}

export async function respondToRequest(meUid, fromUid, accept) {
  const reqRef = doc(db, `users/${meUid}/requests`, fromUid);
  await updateDoc(reqRef, { status: accept ? 'accepted' : 'rejected' });

  if (accept) {
    const myFriendRef = doc(db, `users/${meUid}/friends`, fromUid);
    const theirFriendRef = doc(db, `users/${fromUid}/friends`, meUid);
    await setDoc(myFriendRef, { since: serverTimestamp() });
    await setDoc(theirFriendRef, { since: serverTimestamp() });
  }
}

export function listenToFriends(userUid, setFriends) {
  return onSnapshot(
    collection(db, `users/${userUid}/friends`),
    snapshot => {
      const list = snapshot.docs.map(doc => doc.id);
      setFriends(list);
    }
  );
}
