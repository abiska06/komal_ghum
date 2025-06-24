import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getFirestore, collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { raiseForException } from "./common.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCANb9a0-6_C55qeZ-YY39tqB5B79bZ0BE",
  authDomain: "nyano-kakh.firebaseapp.com",
  databaseURL: "https://nyano-kakh-default-rtdb.firebaseio.com",
  projectId: "nyano-kakh",
  storageBucket: "nyano-kakh.firebasestorage.app",
  messagingSenderId: "1073797907279",
  appId: "1:1073797907279:web:7ecbabb467bc7ba8b17b3a",
  measurementId: "G-9Y9V54HVKW"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and Firestore
const database = getDatabase(app);
const firestore = getFirestore(app);

// Track last pushed time bucket to avoid duplicate entries
let lastTimeBucketPushed = null;

// Fetch health data from Realtime Database and push updates to Firestore
export function fetchVitalsFromFirebase() {
  const healthDataRef = ref(database, 'baby');

  onValue(healthDataRef, async (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();

      // Display data in UI
      document.getElementById('tempValue').textContent = `${data.temperature}°C`;
      document.getElementById('pulseValue').textContent = `${data.pulse} BPM`;
      document.getElementById('oxValue').textContent = `${data.spo2}%`;

      raiseForException(data.temperature, data.pulse, data.oxValue);

      updateStatusBadge('tempStatus', data.temperature, 36.5, 37.5);
      updateStatusBadge('pulseStatus', data.pulse, 100, 120);
      updateStatusBadge('oxStatus', data.oxValue, 97, 100);

      // Generate time bucket ID (updated every 10 minutes)
      const now = new Date();
      const minutes = Math.floor(now.getMinutes() / 10) * 10;
      const timeBucketId = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}-${minutes}`;

      if (timeBucketId !== lastTimeBucketPushed) {
        lastTimeBucketPushed = timeBucketId;

        // Push combined vitals to Firestore
        const activityDoc = {
          id: timeBucketId,
          type: "vitals-summary",
          title: "Vitals Monitoring Update",
          message: `Temperature: ${data.temperature}°C, Pulse: ${data.pulse} BPM, SpO2: ${data.spo2}%`,
          temperature: data.temperature,
          pulse: data.pulse,
          spo2: data.spo2,
          timestamp: Timestamp.now()
        };

        try {
          const docRef = doc(firestore, "activities", timeBucketId); // 👈 this is a valid document reference
          await setDoc(docRef, activityDoc);
        } catch (error) {
          console.error("Failed to set vitals summary document:", error);
        }
      }

    } else {
      console.warn("No data found in Firebase Realtime Database.");
    }
  }, (error) => {
    console.error("Error fetching data from Realtime DB:", error);
  });
}

function updateStatusBadge(id, value, min, max) {
  const badge = document.getElementById(id);
  if (!badge) return;

  badge.className = "status-badge";

  if (value < min) {
    badge.classList.add("red");
    badge.textContent = "Low";
  } else if (value > max) {
    badge.classList.add("yellow");
    badge.textContent = "Elevated";
  } else {
    badge.classList.add("green");
    badge.textContent = "Normal";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchVitalsFromFirebase();
});
