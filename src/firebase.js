import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

const hasConfig = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);

let db = null;
let auth = null;

if (hasConfig && getApps().length === 0) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export const isFirebaseConfigured = hasConfig;

export function getAuthInstance() {
  return auth;
}

export function signInWithGoogle() {
  if (!auth) return Promise.reject('Firebase not configured');
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export function signOutUser() {
  if (!auth) return Promise.reject('Firebase not configured');
  return signOut(auth);
}

export function observeAuthState(callback) {
  if (!auth) return;
  return onAuthStateChanged(auth, callback);
}

export async function fetchStoriesFromDb() {
  if (!db) return [];

  const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function createStoryInDb(storyData, userId, displayName) {
  if (!db) return null;

  const payload = {
  ...storyData,

  category: storyData.category || "Conspiracy",
  intensity: storyData.intensity || "Medium",
  readTime: storyData.readTime || "5 min",

  creatorId: userId,
  creatorName: displayName || "Anonymous",
  createdAt: new Date().toISOString(),

  upvotes: 0,
  upvoters: []
};

  const docRef = await addDoc(collection(db, 'stories'), payload);
  return { id: docRef.id, ...payload };
}

export async function updateStoryInDb(storyId, storyData) {
  if (!db) return null;

  const storyRef = doc(db, 'stories', storyId);
  await updateDoc(storyRef, storyData);
  return { id: storyId, ...storyData };
}

export async function updateStoryUpvotes(storyId, upvotes, upvoters) {
  if (!db) return null;

  const storyRef = doc(db, 'stories', storyId);
  await updateDoc(storyRef, { upvotes, upvoters });
  return true;
}

export async function deleteStoryFromDb(storyId) {
  if (!db) return false;

  await deleteDoc(doc(db, 'stories', storyId));
  return true;
}

export async function seedDummyStories(userId, displayName) {
  if (!db) return [];

  const dummyStories = [
    {
      title: "Three Six Nine",
      content: "A mysterious story that invites readers to think beyond the visible world. The numbers hold secrets, patterns, and connections that only the most curious minds will uncover.",
      upvotes: 0,
      upvoters: [],
      Imgurl: "https://imgs.search.brave.com/XYVqd-t9QpThao7KT6j2F_IWnr_S174H3lerhbH5OMg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9zZWNy/ZXQtdW5pdmVyc2Ut/bnVtYmVycy1zZWNy/ZXQtdW5pdmVyc2Ut/bnVtYmVycy1zZWNy/ZXQtdW5pdmVyc2Ut/bnVtYmVycy1zZWNy/ZXQtdW5pdmVyc2Ut/bnVtYmVycy0yNzgz/OTMyMDguanBn"
    },
    {
      title: "Illuminati",
      content: "A deep dive into hidden symbols, power, and influence across history. Explore the intersections of coincidence and conspiracy, truth and myth, in this mind-bending tale.",
      Imgurl: "https://imgs.search.brave.com/wxsrZJVhuKy96OoJAGFm-e26gNyyeC9DlPc5XGrmOs0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzE5LzU4LzQzLzM1/LzM2MF9GXzE5NTg0/MzM1MzVfcFBDNzlC/STBNb0FBMk1Jc0lU/cUxlMHBocHJLWlZE/TGIuanBn",
      upvotes: 0,
      upvoters: []
    },
  
      {
    title: "Dark Forest Theory",

    category: "Theory",

    intensity: "High",

    readTime: "8 min",

    content: "...",

    Imgurl: "...",

    upvotes:0,
    upvoters:[]
},
    {
      title: "The Void",
      content: "Sometimes the answers we seek are found in emptiness. This philosophical journey explores what lies between existence and nothingness.",
      Imgurl: "",
      upvotes: 0,
      upvoters: []
    },
    {
      title: "Whispers of Tomorrow",
      content: "A story about futures yet to be written and choices that echo through time. Every decision branches into infinite possibilities.",
      Imgurl: "",
      upvotes: 0,
      upvoters: []
    }
  ];

  try {
    const createdStories = [];
    
    for (const story of dummyStories) {
      const docRef = await addDoc(collection(db, 'stories'), {
        ...story,
        creatorId: userId,
        creatorName: displayName || 'Admin',
        createdAt: new Date().toISOString()
      });
      createdStories.push({ id: docRef.id, ...story });
    }
    
    return createdStories;
  } catch (error) {
    console.error('Error seeding dummy stories:', error);
    return [];
  }
}
