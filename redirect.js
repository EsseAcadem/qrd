const now = new Date();
const nowTime = now.getTime(); 
const halfHour = 30 * 60 * 1000;

const lastScanTimestamp = localStorage.getItem('lastScanTime');
const lastScanTime = lastScanTimestamp ? parseInt(lastScanTimestamp, 10) : null;

const timeSinceScan = lastScanTime ? nowTime - lastScanTime : null;

let goToAttendance = false;

if (!lastScanTime || timeSinceScan > halfHour) {
  goToAttendance = true;
} else {
  goToAttendance = false; 
}

fetch('redirect.json')
  .then(response => response.json())
  .then(data => {
    const encodedUrl = goToAttendance ? data.attendance : data.feedback;
    const targetUrl = atob(encodedUrl); // Decode from Base64

    if (goToAttendance) {
      localStorage.setItem('lastScanTime', nowTime.toString());
    }

    window.location.replace(targetUrl);
  })
  .catch(error => {
    document.body.innerHTML = `<h1>Oops!</h1><p>We couldn’t load your link. Please try again later.</p>`;
    console.error('Redirect failed:', error);
  });
