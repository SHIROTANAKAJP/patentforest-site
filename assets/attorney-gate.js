// "Are you a patent attorney?" gate for the attorney page.
// - On a normal page: links with [data-attorney-gate] ask first, then go.
// - On the attorney page (<body data-attorney-page="<back url>">): asks on load
//   unless already confirmed in this browser session; "No" goes back.
(function () {
  var KEY = 'pf-attorney-ok';
  var ja = document.documentElement.lang === 'ja';
  var T = ja ? {
    q: 'あなたは弁理士ですか？',
    d: 'このページは、弁理士・特許事務所の方に向けた内容です。',
    yes: 'はい、弁理士です',
    no: 'いいえ',
    noteNo: '一般向けのご案内はトップページをご覧ください。'
  } : {
    q: 'Are you a patent attorney?',
    d: 'This page is intended for patent attorneys and patent firms.',
    yes: 'Yes, I am',
    no: 'No',
    noteNo: 'See the home page for general information.'
  };

  function ok() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function remember() { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }

  function ask(onYes, onNo, blocking) {
    var dlg = document.createElement('dialog');
    dlg.className = 'gate';
    dlg.setAttribute('aria-labelledby', 'gate-q');
    dlg.innerHTML =
      '<div class="gate-box">' +
        '<span class="gate-ico" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6.5v5c0 4.6 3.4 8.4 8 9.5 4.6-1.1 8-4.9 8-9.5v-5z"/><path d="m8.8 12.2 2.3 2.3 4.2-4.6"/></svg>' +
        '</span>' +
        '<p class="gate-q" id="gate-q"></p>' +
        '<p class="gate-d"></p>' +
        '<div class="gate-actions"><button type="button" class="btn gate-yes"></button><button type="button" class="gate-no"></button></div>' +
      '</div>';
    dlg.querySelector('.gate-q').textContent = T.q;
    dlg.querySelector('.gate-d').textContent = T.d;
    dlg.querySelector('.gate-yes').textContent = T.yes;
    dlg.querySelector('.gate-no').textContent = T.no;
    document.body.appendChild(dlg);

    function done() { dlg.close(); dlg.remove(); }
    dlg.querySelector('.gate-yes').addEventListener('click', function () { remember(); done(); onYes(); });
    dlg.querySelector('.gate-no').addEventListener('click', function () { done(); onNo(); });
    dlg.addEventListener('cancel', function (e) { if (blocking) { e.preventDefault(); } else { done(); } });
    if (!blocking) dlg.addEventListener('click', function (e) { if (e.target === dlg) done(); });
    dlg.showModal();
    dlg.querySelector('.gate-yes').focus();
  }

  // Entry links on normal pages.
  document.querySelectorAll('[data-attorney-gate]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (ok()) return;
      e.preventDefault();
      var href = a.getAttribute('href');
      ask(function () { location.href = href; }, function () {}, false);
    });
  });

  // The attorney page itself.
  var back = document.body.getAttribute('data-attorney-page');
  if (back !== null && !ok()) {
    document.body.classList.add('gated');
    ask(function () { document.body.classList.remove('gated'); },
        function () { location.href = back || '/'; }, true);
  }
})();
