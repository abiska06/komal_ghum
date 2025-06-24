// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js"; // ✅ Add this

const firebaseConfig = {
  apiKey: "AIzaSyCANb9a0-6_C55qeZ-YY39tqB5B79cZ0BE",
  authDomain: "nyano-kakh.firebaseapp.com",
  projectId: "nyano-kakh",
  storageBucket: "nyano-kakh.appspot.com",
  messagingSenderId: "1073797907279",
  appId: "1:1073797907279:web:7ecbabb467bc7ba8b17b3a",
  measurementId: "G-9Y9V54HVKW"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app); // ✅ Firestore is now available

export { app, analytics, firestore, auth };
