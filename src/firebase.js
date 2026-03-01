import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, getDocs, addDoc, setDoc,
  updateDoc, deleteDoc, doc, serverTimestamp
} from "firebase/firestore";

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
export const db = getFirestore(app);

// ── helpers ───────────────────────────────────────────────────────────────────
export const COLS = {
  TASKS:         "tasks",
  USERS:         "users",
  CLIENTS:       "clients",
  DEPARTMENTS:   "departments",
  LEAVES:        "leaves",
  MEETINGS:      "meetings",
  TIMELOGS:      "timelogs",
  NOTIFICATIONS: "notifications",
  ONBOARDING:    "onboarding",
};

// Get all docs from a collection, returns array with id field
export async function listDocs(col) {
  const snap = await getDocs(collection(db, col));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Create doc with custom ID
export async function createDoc(col, id, data) {
  const clean = stripUndefined(data);
  await setDoc(doc(db, col, id), clean);
  return { id, ...clean };
}

// Update doc by ID
export async function updateDoc_(col, id, data) {
  const clean = stripUndefined(data);
  await updateDoc(doc(db, col, id), clean);
}

// Delete doc
export async function deleteDoc_(col, id) {
  await deleteDoc(doc(db, col, id));
}

// Strip undefined values (Firestore doesn't accept them)
function stripUndefined(obj) {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(stripUndefined);
  if (typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) out[k] = stripUndefined(v);
    }
    return out;
  }
  return obj;
}
