const now = new Date();
const nowTime = now.getTime(); // current timestamp in ms
const hour = 60 * 60 * 1000; // 1 hour in ms

// Retrieve previous scan timestamp (if any)
const lastScanTimestamp = localStorage.getItem('lastScanTime');
const lastScanTime = lastScanTimestamp ? parseInt(lastScanTimestamp, 10) : null;

// Calculate time difference (if available)
const timeSinceScan = lastScanTime ? nowTime - lastScanTime : null;

// Determine which link to use
let goToAttendance = false;

if (!lastScanTime || timeSinceScan > 2 * hour) {
  // No scan yet or it's been 2+ hours — treat as new
  goToAttendance = true;
} else if (timeSinceScan <= hour) {
  // Within first hour — still go to Attendance
  goToAttendance = true;
} else {
  // Between 1 and 2 hours — go to Feedback
  goToAttendance = false;
}

fetch('redirect.json')
  .then(response => response.json())
  .then(data => {
    const targetUrl = goToAttendance ? data.attendance : data.feedback;

    if (goToAttendance) {
      localStorage.setItem('lastScanTime', nowTime.toString());
    }

    window.location.replace(targetUrl);
  })
  .catch(error => {
    document.body.innerHTML = `<h1>Oops!</h1><p>We couldn’t load your link. Please try again later.</p>`;
    console.error('Redirect failed:', error);
  });
