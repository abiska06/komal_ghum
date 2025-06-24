export default function history(vital) {
// document.addEventListener("DOMContentLoaded", () => {
  // Canvas setup
  const canvas = document.getElementById("vitalsChart")
  const ctx = canvas.getContext("2d")
  const tooltip = document.getElementById("tooltip")

  // Set canvas dimensions to match container
  function resizeCanvas() {
    const container = canvas.parentElement
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight
  }

  resizeCanvas()
  window.addEventListener("resize", resizeCanvas)

  // Sample data for the chart
const vitals = vital.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));

const data = {
  temperature: vitals.map(v => ({
    time: formatTime(v.timestamp),
    value: v.temperature,
    status: getTemperatureStatus(v.temperature),
  })),
  heartRate: vitals.map(v => ({
    time: formatTime(v.timestamp),
    value: v.pulse,
    status: getPulseStatus(v.pulse),
  })),
  spo2: vitals.map(v => ({
    time: formatTime(v.timestamp),
    value: v.spo2,
    status: getSpo2Status(v.spo2),
  })),
};

  // Chart configuration
  const chartConfig = {
    temperature: {
      min: 10.0,
      max: 40.0,
      step:5,
      color: "#E2856E", // Primary
      title: "Temperature History (Last 24 Hours)",
      unit: "°C",
    },
    heartRate: {
      min: 60,
      max: 160,
      step: 20,
      color: "#F1C8A3", // Secondary
      title: "Heart Rate History (Last 24 Hours)",
      unit: " BPM",
    },
    spo2: {
      min:30,
      max: 100,
      step: 5,
      color: "#88A8A3", // Tertiary
      title: "SpO2 History (Last 24 Hours)",
      unit: "%",
    },
  }

  // Current vital type
  let currentVital = "temperature"

  // Store data points for hover detection
  let dataPoints = []

  // Draw the chart
  function drawChart() {
    const vitalData = data[currentVital]
    const config = chartConfig[currentVital]

    // Clear canvas and data points
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    dataPoints = []

    // Chart dimensions
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#E0E0E0"
    ctx.lineWidth = 1

    // X-axis
    ctx.moveTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)

    // Y-axis
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.stroke()

    // Draw Y-axis labels and grid lines
    const yRange = config.max - config.min
    const yStep = config.step
    const ySteps = yRange / yStep
    const yPixelsPerStep = chartHeight / ySteps

    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.font = "12px Nunito"
    ctx.fillStyle = "#666666"

    for (let i = 0; i <= ySteps; i++) {
      const y = canvas.height - padding - i * yPixelsPerStep
      const value = config.min + i * yStep

      // Grid line
      ctx.beginPath()
      ctx.strokeStyle = "#F0F0F0"
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()

      // Label
      ctx.fillText(value.toString(), padding - 10, y)
    }

    // Draw X-axis labels
    const xStep = chartWidth / (vitalData.length - 1)

    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    vitalData.forEach((item, index) => {
      const x = padding + index * xStep

      // Only show every other label to avoid crowding
      if (index % 2 === 0) {
        ctx.fillText(item.time, x, canvas.height - padding + 10)
      }
    })

    // Draw line graph
    ctx.beginPath()
    ctx.strokeStyle = config.color
    ctx.lineWidth = 3
    ctx.lineJoin = "round"

    // Store points for drawing and hover detection
    const points = vitalData.map((item, index) => {
      const x = padding + index * xStep
      const normalizedValue = (item.value - config.min) / yRange
      const y = canvas.height - padding - normalizedValue * chartHeight
      return { x, y, data: item }
    })

    // Draw the line
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.stroke()

    // Draw data points
    points.forEach((point) => {
      // Draw point
      ctx.beginPath()
      ctx.fillStyle = config.color
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2)
      ctx.fill()

      // Draw outer circle for hover effect
      ctx.beginPath()
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2)
      ctx.fill()

      // Store the point data for hover detection
      dataPoints.push({
        x: point.x,
        y: point.y,
        radius: 10, // Slightly larger than visual for easier hover
        data: point.data,
      })
    })
  }

  // Handle mouse movement for tooltips
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    let hoverPoint = null

    // Check if mouse is over a data point
    for (const point of dataPoints) {
      const distance = Math.sqrt(Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2))
      if (distance <= point.radius) {
        hoverPoint = point
        break
      }
    }

    if (hoverPoint) {
      const config = chartConfig[currentVital]
      tooltip.style.display = "block"
      tooltip.style.left = ${hoverPoint.x}px
      tooltip.style.top = ${hoverPoint.y - 40}px
      tooltip.innerHTML = `
                  <strong>${hoverPoint.data.time}</strong><br>
                  ${hoverPoint.data.value}${config.unit}<br>
                  <span class="status">${hoverPoint.data.status}</span>
              `
    } else {
      tooltip.style.display = "none"
    }
  })

  canvas.addEventListener("mouseleave", () => {
    tooltip.style.display = "none"
  })

  // Update table with data
  function updateTable() {
    const tableBody = document.getElementById("tableBody")
    const vitalData = data[currentVital]
    const config = chartConfig[currentVital]

    // Clear table
    tableBody.innerHTML = ""

    // Add rows
    vitalData.forEach((item) => {
      const row = document.createElement("tr")

      const timeCell = document.createElement("td")
      timeCell.textContent = item.time

      const valueCell = document.createElement("td")
      valueCell.textContent = ${item.value}${config.unit}

      const statusCell = document.createElement("td")
      const statusBadge = document.createElement("div")
      statusBadge.className = status-badge ${getStatusClass(item.status)}
      statusBadge.textContent = item.status
      statusCell.appendChild(statusBadge)

      row.appendChild(timeCell)
      row.appendChild(valueCell)
      row.appendChild(statusCell)

      tableBody.appendChild(row)
    })
  }

  function getStatusClass(status) {
    if (status === "Normal") return "green"
    if (status === "Slightly Elevated" || status === "Slightly Low") return "yellow"
    if (status === "Elevated" || status === "Low") return "red"
    return "gray"
  }

  // Handle vital type selection
  const vitalButtons = document.querySelectorAll(".vital-button")

  vitalButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Update active state
      vitalButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Update current vital
      currentVital = this.getAttribute("data-vital")

      // Update chart title
      document.querySelector(".graph-title").textContent = chartConfig[currentVital].title

      // Redraw chart
      drawChart()

      // Update table
      updateTable()
    })
  })

  // Export functionality
  const exportButton = document.querySelector(".export-button")

  if (exportButton) {
    exportButton.addEventListener("click", () => {
      alert("Vital history data export initiated. Your file will be ready for download shortly.")
    })
  }

  // Initial draw
  drawChart()
  updateTable()
// })
  function getTemperatureStatus(value) {
        if (value < 36.0 ){
           return "Low"; 
        } 
        else if (value > 38.0) {
            return "High";
        } 
        else{
            return "Normal"
        }
    }
    function getPulseStatus(value){
       if (value < 80.0 ){
           return "Low"; 
        } 
        else if (value > 160.0) {
            return "High";
        } 
        else{
            return "Normal"
        }
    }
    function getSpo2Status(value){
        if (value < 90.0 ){
            return "Low"; 
          } 
          else if (value > 100.0) {
              return "High";
          } 
          else{
              return "Normal"
          }
    }
    function formatTime(time){
        var timestamp = time.seconds * 1000; // Convert Firestore timestamp to milliseconds
        var formattedTime = new Date(timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kathmandu' });
        return formattedTime;
    }


}