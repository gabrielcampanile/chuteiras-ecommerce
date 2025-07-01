import { doc, setDoc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  role: "admin" | "seller" | "customer";
  createdAt: Date;
}

const USERS_COLLECTION = "users";

export async function createUserProfile({ uid, email, name, role }: Omit<UserProfile, "createdAt">) {
  await setDoc(doc(db, USERS_COLLECTION, uid), {
    uid,
    email,
    name: name || "",
    role,
    createdAt: new Date(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

export async function listAllUsers(): Promise<UserProfile[]> {
  const usersCol = collection(db, USERS_COLLECTION);
  const snapshot = await getDocs(usersCol);
  return snapshot.docs.map((doc) => doc.data() as UserProfile);
}

export async function updateUserRole(uid: string, role: "admin" | "seller" | "customer") {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, { role });
}

export async function updateUserProfile(uid: string, data: { name?: string; numero?: string; endereco?: string }) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, data);
} 