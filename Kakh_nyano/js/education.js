document.addEventListener("DOMContentLoaded", () => {
    // Category filtering
    const categoryTabs = document.querySelectorAll(".category-tab")
    const resourceCards = document.querySelectorAll(".resource-card")
  
    if (categoryTabs.length > 0 && resourceCards.length > 0) {
      categoryTabs.forEach((tab) => {
        tab.addEventListener("click", function () {
          // Update active state
          categoryTabs.forEach((t) => t.classList.remove("active"))
          this.classList.add("active")
  
          const category = this.getAttribute("data-category")
  
          // Filter resources
          resourceCards.forEach((card) => {
            if (category === "all" || card.getAttribute("data-category") === category) {
              card.style.display = "block"
            } else {
              card.style.display = "none"
            }
          })
        })
      })
    }
  
    // Resource link click handler (in a real app, this would open the resource)
    const resourceLinks = document.querySelectorAll(".resource-link")
  
    if (resourceLinks.length > 0) {
      resourceLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
          e.preventDefault()
  
          const resourceTitle = this.closest(".resource-content").querySelector("h3").textContent
          alert(`Opening resource: ${resourceTitle}`)
        })
      })
    }
  })