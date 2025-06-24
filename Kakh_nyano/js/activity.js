import { app, firestore, auth } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.querySelector('.timeline');

  const q = query(collection(firestore, "activities"), orderBy("timestamp", "desc"));

  onSnapshot(q, (snapshot) => {
    timeline.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.setAttribute('data-type', data.type);

      const timestamp = data.timestamp?.toDate().toLocaleString() || "Just now";

      let messageContent = data.message;

      // If it's a vitals summary, format the message accordingly
      if (data.type === "vitals-summary") {
        messageContent = `
          <strong>Temperature:</strong> ${data.temperature}°C<br>
          <strong>Pulse:</strong> ${data.pulse} BPM<br>
          <strong>SpO₂:</strong> ${data.spo2}%`;
      }

      item.innerHTML = `
        <div class="timeline-icon ${data.type}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="none"/>
          </svg>
        </div>
        <div class="timeline-content">
          <h3>${data.title}</h3>
          <p>${messageContent}</p>
          <span class="timestamp">${timestamp}</span>
        </div>
      `;

      timeline.appendChild(item);
    });
  });
});
