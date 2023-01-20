import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import { getStorage, getDownloadURL, list, ref } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { getFirestore, doc, getDoc, getDocs, collection, query, limit, orderBy } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseappConfig = {
  apiKey: "AIzaSyB9S-lwz4yOHcajjQmFD8Qj9AynV-wZ0A0",
  authDomain: "ndhcs-361bf.firebaseapp.com",
  projectId: "ndhcs-361bf",
  storageBucket: "ndhcs-361bf.appspot.com",
  messagingSenderId: "644967053944",
  appId: "1:644967053944:web:ff6463c5e53ed7c0c5cb8d",
  measurementId: "G-4QGDHBZP09"
};

const app = initializeApp(firebaseappConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage, list, ref, getDownloadURL, db, collection, query, limit, orderBy, doc, getDoc, getDocs };