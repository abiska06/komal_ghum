// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", () => {
    const hamburgerMenu = document.querySelector(".hamburger-menu")
    const sidebar = document.querySelector(".sidebar")
  
    if (hamburgerMenu && sidebar) {
      hamburgerMenu.addEventListener("click", () => {
        sidebar.classList.toggle("open")
      })
  
      // Close sidebar when clicking on a link (mobile only)
      const navLinks = document.querySelectorAll(".nav-links a")
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 768) {
            sidebar.classList.remove("open")
          }
        })
      })
  
      // Close sidebar when clicking outside (mobile only)
      document.addEventListener("click", (event) => {
        if (
          window.innerWidth <= 768 &&
          !sidebar.contains(event.target) &&
          !hamburgerMenu.contains(event.target) &&
          sidebar.classList.contains("open")
        ) {
          sidebar.classList.remove("open")
        }
      })
    }
  
    // Close notification banner
    const closeNotification = document.querySelector(".close-notification")
    const notificationBanner = document.querySelector(".notification-banner")
  
    if (closeNotification && notificationBanner) {
      closeNotification.addEventListener("click", () => {
        notificationBanner.style.display = "none"
      })
    }
  })
  