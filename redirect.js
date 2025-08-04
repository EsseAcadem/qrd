(function () {
  const _0x1d4c9e = Date;
  const _0x3a1d95 = new _0x1d4c9e();
  const _0x4a2cce = _0x3a1d95.getTime();
  const _0x3fc63d = 60 * 60 * 1000;
  const _0x3dd32f = localStorage.getItem('lastScanTime');
  const _0x209f6f = _0x3dd32f ? parseInt(_0x3dd32f, 10) : null;
  const _0x573f26 = _0x209f6f ? _0x4a2cce - _0x209f6f : null;
  let _0x5d44b2 = false;

  if (!_0x209f6f || _0x573f26 > 2 * _0x3fc63d) {
    _0x5d44b2 = true;
  } else if (_0x573f26 <= _0x3fc63d) {
    _0x5d44b2 = true;
  } else {
    _0x5d44b2 = false;
  }

  fetch('redirect.json')
    .then(_0x4bc0b5 => _0x4bc0b5.json())
    .then(_0x106250 => {
      const _0x54c0d6 = _0x5d44b2 ? _0x106250.attendance : _0x106250.feedback;
      if (_0x5d44b2) {
        localStorage.setItem('lastScanTime', _0x4a2cce.toString());
      }
      window.location.replace(_0x54c0d6);
    })
    .catch(_0x31c30d => {
      document.body.innerHTML = '<h1>Oops!</h1><p>We couldn’t load your link. Please try again later.</p>';
      console.error('Redirect failed:', _0x31c30d);
    });
})();
