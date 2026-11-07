// Small example thumbnails open full size in a dialog.
(function () {
  var dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.innerHTML = '<div class="box"><div class="media"></div><div class="bar"><span class="cap-text"></span><button class="close" type="button"></button></div></div>';
  document.body.appendChild(dlg);
  var media = dlg.querySelector('.media'), text = dlg.querySelector('.cap-text'), close = dlg.querySelector('.close');
  close.textContent = document.documentElement.lang === 'ja' ? '閉じる' : 'Close';
  function shut() { var v = media.querySelector('video'); if (v) v.pause(); dlg.close(); media.innerHTML = ''; }
  close.addEventListener('click', shut);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) shut(); });
  dlg.addEventListener('cancel', function () { var v = media.querySelector('video'); if (v) v.pause(); media.innerHTML = ''; });
  document.querySelectorAll('[data-popup]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var src = el.getAttribute('data-popup');
      if (/\.mp4$/.test(src)) {
        media.innerHTML = '<video controls autoplay playsinline poster="' + (el.getAttribute('data-poster') || '') + '"><source src="' + src + '" type="video/mp4"></video>';
      } else {
        media.innerHTML = '<img alt="">';
        media.querySelector('img').src = src;
        media.querySelector('img').alt = el.getAttribute('data-caption') || '';
      }
      text.textContent = el.getAttribute('data-caption') || '';
      dlg.showModal();
    });
  });
})();

// Case video in the Verify card plays in place, at the size it is shown.
(function () {
  document.querySelectorAll('[data-inline]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = document.createElement('div');
      box.className = btn.className + ' is-playing';
      var v = document.createElement('video');
      v.controls = true; v.autoplay = true; v.playsInline = true;
      v.poster = btn.getAttribute('data-poster') || '';
      v.setAttribute('aria-label', btn.getAttribute('data-caption') || '');
      var s = document.createElement('source');
      s.src = btn.getAttribute('data-inline'); s.type = 'video/mp4';
      v.appendChild(s); box.appendChild(v);
      btn.replaceWith(box);
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    });
  });
})();
