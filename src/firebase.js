
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth  } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA2kNDtIrR2yEKQUsmPJZ_yTVQifsLMbhk",
    authDomain: "testforfirestore-2554e.firebaseapp.com",
    projectId: "testforfirestore-2554e",
    storageBucket: "testforfirestore-2554e.firebasestorage.app",
    messagingSenderId: "987522820136",
    appId: "1:987522820136:web:bdb50bb633ca6ae3066d1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
export const db = getFirestore(app);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);

export const storage = getStorage(app);
