import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyACmKSN4sBlUzqgf-d_K8u_TxYGvyr1Dvo",
    authDomain: "ielts-react.firebaseapp.com",
    projectId: "ielts-react",
    storageBucket: "ielts-react.appspot.com",
    messagingSenderId: "297500426796",
    appId: "1:297500426796:web:be81be8de8311faa9d0789"
};

let app;

if(firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };

