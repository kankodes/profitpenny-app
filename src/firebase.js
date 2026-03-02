import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, getDocs, setDoc,
  updateDoc, deleteDoc, doc
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGiQeVoWpJJ-ONGUBUm36hnoVptgm_UlM",
  authDomain: "profitpenny-ab31d.firebaseapp.com",
  projectId: "profitpenny-ab31d",
  storageBucket: "profitpenny-ab31d.firebasestorage.app",
  messagingSenderId: "963854483464",
  appId: "1:963854483464:web:dd8274c8d5d39ab4cb51bd",
  measurementId: "G-PM4SHMFZ4G"
};

const app = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

export const loginUser  = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
export const logoutUser = () => signOut(auth);
export const onAuth     = (cb) => onAuthStateChanged(auth, cb);
export const getCurrentUser = () => auth.currentUser;

// Creates user in Firestore + sends password-reset email so they can set their own password.
// Does NOT use createUserWithEmailAndPassword (that would log the admin out).
// Instead, we just send a password-reset link - if the user doesn't exist yet in Auth,
// the admin must create them via the Firebase Admin Console or the Admin HTML.
export async function inviteUser(email, name) {
  try {
    // Try sending a password reset email (works if user exists in Auth)
    await sendPasswordResetEmail(auth, email, { url: window.location.origin });
    return { sent: true };
  } catch(e) {
    // User doesn't exist in Auth yet — return flag so UI can show manual instructions
    return { sent: false, reason: e.code };
  }
}

export const COLS = {
  TASKS:"tasks", USERS:"users", CLIENTS:"clients", DEPARTMENTS:"departments",
  LEAVES:"leaves", MEETINGS:"meetings", TIMELOGS:"timelogs",
  NOTIFICATIONS:"notifications", ONBOARDING:"onboarding",
};

export async function listDocs(col) {
  const snap = await getDocs(collection(db, col));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createDoc(col, id, data) {
  const clean = strip(data);
  await setDoc(doc(db, col, id), clean);
  return { id, ...clean };
}

export async function updateDoc_(col, id, data) {
  await updateDoc(doc(db, col, id), strip(data));
}

export async function deleteDoc_(col, id) {
  await deleteDoc(doc(db, col, id));
}

function strip(obj) {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(strip);
  if (typeof obj === "object") {
    const out = {};
    for (const [k,v] of Object.entries(obj)) { if (v !== undefined) out[k] = strip(v); }
    return out;
  }
  return obj;
}
