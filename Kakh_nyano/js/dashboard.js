import { fetchVitalsFromFirebase } from "./dataService.js";
import {raiseForException} from "./common.js"

document.addEventListener("DOMContentLoaded", () => {
  // Handle blanket heating toggle
  const blanketToggle = document.getElementById("blanket-toggle");
  const toggleLabel = document.querySelector(".toggle-label");

  if (blanketToggle && toggleLabel) {
    blanketToggle.addEventListener("change", function () {
      toggleLabel.textContent = this.checked ? "ON" : "OFF";
    });
  }

  // Fetch real-time vitals from Firebase
  fetchVitalsFromFirebase();

  // Simulated data update function (for testing without Firebase)
  function simulateDataUpdates() {
    const temperature = +(Math.random() * 0.5 + 36.8).toFixed(1);
    const pulse = Math.floor(Math.random() * 20 + 110);
    const spo2 = Math.floor(Math.random() * 3 + 96);


    raiseForException(temperature, pulse, spo2)


    
    if (temperature >= 60){
      toastr.success('This is a success message!', 'Success');
    } else if (pulse >= 120){
      toastr.success('This is a success message!', 'Success');
    } else if (spo2 >= 95) {
      toastr.success('This is a success message!', 'Success');  
    }

    updateVitalUI("tempValue", "tempStatus", temperature, "°C", 36.5, 37.5);
    updateVitalUI("pulseValue", "pulseStatus", pulse, "BPM", 100, 140);
    updateVitalUI("oxValue", "oxStatus", spo2, "", 97, 100);
  }

  // Helper function to update DOM elements and badge based on value range
  function updateVitalUI(valueId, badgeId, value, unit, min, max) {
    const valueElem = document.getElementById(valueId);
    const badgeElem = document.getElementById(badgeId);

    if (valueElem) valueElem.textContent = `${value} ${unit}`;
    if (!badgeElem) return;

    badgeElem.className = "status-badge";

    if (value < min) {
      badgeElem.classList.add("red");
      badgeElem.textContent = "Low";
    } else if (value > max) {
      badgeElem.classList.add("yellow");
      badgeElem.textContent = "Elevated";
    } else {
      badgeElem.classList.add("green");
      badgeElem.textContent = "Normal";
    }
  }

  // Uncomment below line to enable simulated updates (useful for testing UI)
  // setInterval(simulateDataUpdates, 5000);
});
