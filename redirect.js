const now = new Date();
const nowTime = now.getTime();

const fiveMinutes = 5 * 60 * 1000;
const fifteenMinutes = 15 * 60 * 1000;

const lastScanTimestamp = localStorage.getItem('lastScanTime');
const lastScanTime = lastScanTimestamp ? parseInt(lastScanTimestamp, 10) : null;

let target = "attendance"; // default
let shouldUpdateTimestamp = false;

if (lastScanTime) {
  const timeSinceScan = nowTime - lastScanTime;

  if (timeSinceScan < fiveMinutes) {
    // Within 5 mins → Attendance
    target = "attendance";
  } else if (timeSinceScan < fifteenMinutes) {
    // Between 5 and 15 mins → Feedback
    target = "feedback";
  } else {
    // 15+ mins → Reset to Attendance
    target = "attendance";
    shouldUpdateTimestamp = true;
  }
} else {
  // No scan history → Attendance
  target = "attendance";
  shouldUpdateTimestamp = true;
}

// Fetch and redirect
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
