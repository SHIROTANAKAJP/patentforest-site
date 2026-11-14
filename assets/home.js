// Patentforest home (v2): hero "patent forest" network, reveal on scroll, count-up numbers.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── hero canvas: drifting nodes linked when close, like a patent map ──
  var cv = document.querySelector('.h-hero canvas');
  if (cv && cv.getContext) {
    var ctx = cv.getContext('2d'), nodes = [], W = 0, H = 0, dpr = 1, run = true, raf = 0;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(110, Math.max(36, W * H / 16000)));
      nodes = [];
      for (var i = 0; i < n; i++) {
        nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, r: Math.random() < .12 ? 2.4 : 1.4 });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var L = Math.min(150, Math.max(90, W / 10));
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < L) {
            ctx.strokeStyle = 'rgba(95,224,211,' + (0.22 * (1 - d / L)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var p = nodes[k];
        ctx.fillStyle = p.r > 2 ? 'rgba(127,227,216,.95)' : 'rgba(160,200,255,.55)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    function step() {
      for (var i = 0; i < nodes.length; i++) {
        var p = nodes[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
      }
      draw();
      if (run) raf = requestAnimationFrame(step);
    }
    size(); draw();
    window.addEventListener('resize', function () { size(); draw(); });
    if (!reduce) {
      raf = requestAnimationFrame(step);
      // pause when the hero is off screen or the tab is hidden
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            var on = e.isIntersecting && !document.hidden;
            if (on && !run) { run = true; raf = requestAnimationFrame(step); }
            if (!on) { run = false; cancelAnimationFrame(raf); }
          });
        }).observe(cv);
      }
    }
  }

  // ── count-up for the big numbers ──
  function count(el) {
    var to = +el.getAttribute('data-count'), t0 = null, dur = 1400;
    var unit = el.querySelector('small');
    function tick(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.firstChild.nodeValue = String(Math.round(to * e));
      if (k < 1) requestAnimationFrame(tick);
    }
    if (unit) requestAnimationFrame(tick);
  }

  // ── reveal on scroll ──
  var items = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(count);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
})();
