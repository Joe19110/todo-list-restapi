import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCzqSuw0HeIc6Ufqjwvzs492S0Z9S3SiPM",
    authDomain: "wads-todolist.firebaseapp.com",
    projectId: "wads-todolist",
    storageBucket: "wads-todolist.firebasestorage.app",
    messagingSenderId: "40402209430",
    appId: "1:40402209430:web:e9a2ea596a8d2e1f0090b7",
    measurementId: "G-T539JLHTHY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, db, googleProvider, githubProvider };