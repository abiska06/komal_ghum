export async function raiseForException(temperature, pulse, spo2) {
  const notyf = new Notyf({
    duration: 5000,
    position: {
      x: 'right',
      y: 'top'   
      
    
    }
  });

  let messages = [];

  if (temperature >= 37) {
    const msg = '🚨 The temperature is above 60°C.';
    messages.push(msg);
    notyf.error(msg);
  }

  if (pulse >= 120) {
    const msg = '❤️ The heart rate is above 120 BPM.';
    messages.push(msg);
    notyf.error(msg);
  }

  if (spo2 >= 95) {
    const msg = '🫁 The pulse rate (SpO2) is above 95%.';
    messages.push(msg);
    notyf.error(msg);
  }
}
