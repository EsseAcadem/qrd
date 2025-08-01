const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
const lastScan = localStorage.getItem('lastScanDate');

fetch('redirect.json')
  .then(response => response.json())
  .then(data => {
    const isRepeat = lastScan === today;
    const targetUrl = isRepeat ? data.feedback : data.attendance;

    if (!isRepeat) {
      localStorage.setItem('lastScanDate', today);
    }

    window.location.replace(targetUrl);
  })
  .catch(error => {
    document.body.innerHTML = `<h1>Oops!</h1><p>We couldn’t load your link. Please try again later.</p>`;
    console.error('Redirect failed:', error);
  });
