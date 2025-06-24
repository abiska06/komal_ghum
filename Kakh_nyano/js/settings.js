document.addEventListener("DOMContentLoaded", () => {
    // Range input value display
    const rangeInputs = document.querySelectorAll('input[type="range"]')
  
    if (rangeInputs.length > 0) {
      rangeInputs.forEach((input) => {
        const valueDisplay = input.nextElementSibling
  
        // Update value display on input change
        input.addEventListener("input", function () {
          let displayValue = this.value
  
          // Add appropriate unit
          if (this.id === "temp-threshold") {
            displayValue += "°C"
          } else if (this.id === "heart-threshold") {
            displayValue += " BPM"
          } else if (this.id === "spo2-threshold") {
            displayValue += "%"
          }
  
          valueDisplay.textContent = displayValue
        })
      })
    }
  
    // Form submission
    const settingsForm = document.querySelector(".settings-form")
  
    if (settingsForm) {
      settingsForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // In a real app, this would save the settings to a server
        // For now, just show a success message
        alert("Settings saved successfully!")
      })
    }
  
    // Toggle conditional fields
    const smsToggle = document.getElementById("sms-notifications")
    const phoneField = document.getElementById("phone-number")
    const emailToggle = document.getElementById("email-notifications")
    const emailField = document.getElementById("email")
  
    if (smsToggle && phoneField) {
      smsToggle.addEventListener("change", function () {
        phoneField.disabled = !this.checked
        if (!this.checked) {
          phoneField.parentElement.classList.add("disabled")
        } else {
          phoneField.parentElement.classList.remove("disabled")
        }
      })
    }
  
    if (emailToggle && emailField) {
      emailToggle.addEventListener("change", function () {
        emailField.disabled = !this.checked
        if (!this.checked) {
          emailField.parentElement.classList.add("disabled")
        } else {
          emailField.parentElement.classList.remove("disabled")
        }
      })
    }
  })