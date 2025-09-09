const now = new Date();
const nowTime = now.getTime(); // Current timestamp in ms

const halfHour = 30 * 60 * 1000;
const sixHours = 6 * 60 * 60 * 1000; // Changed from 2h to 6h

const lastScanTimestamp = localStorage.getItem('lastScanTime');
const lastScanTime = lastScanTimestamp ? parseInt(lastScanTimestamp, 10) : null;

let target = "attendance"; // default
let shouldUpdateTimestamp = false;

if (lastScanTime) {
  const timeSinceScan = nowTime - lastScanTime;

  if (timeSinceScan < halfHour) {
    // Within 30 mins → Attendance
    target = "attendance";
  } else if (timeSinceScan < sixHours) {
    // Between 30 mins and 6 hours → Feedback
    target = "feedback";
  } else {
    // 6+ hours → reset to Attendance and update timestamp
    target = "attendance";
    shouldUpdateTimestamp = true;
  }
} else {
  // No previous scan → Attendance
  target = "attendance";
  shouldUpdateTimestamp = true;
}

// Fetch links and redirect
fetch('redirect.json')
  .then(res => res.json())
  .then(data => {
    const encodedUrl = data[target];
    const targetUrl = decodeBase64(encodedUrl);

    if (target === "attendance" && shouldUpdateTimestamp) {
      localStorage.setItem('lastScanTime', nowTime.toString());
    }

    window.location.replace(targetUrl);
  })
  .catch(err => {
    document.body.innerHTML = `<h1>Oops!</h1><p>Couldn’t load the redirect link.</p>`;
    console.error('Redirect error:', err);
  });

// Base64 decoder
function decodeBase64(str) {
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}
