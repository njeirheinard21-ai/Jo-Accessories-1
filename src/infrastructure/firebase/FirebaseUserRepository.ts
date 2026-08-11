import { doc, getDoc, getDocs, collection, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { User } from '../../core/domain/User';
import { IUserRepository } from '../../core/repositories/IUserRepository';

const COLLECTION_NAME = 'users';

export class FirebaseUserRepository implements IUserRepository {
  async getUser(uid: string): Promise<User | null> {
    const docRef = doc(db, COLLECTION_NAME, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as User;
    }
    return null;
  }

  async getUsers(): Promise<User[]> {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map(doc => doc.data() as User);
  }

  async updateUser(uid: string, updates: Partial<User>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, uid);
    await updateDoc(docRef, updates);
  }

  async createUser(user: User): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, user.uid);
    await setDoc(docRef, user);
  }
}
