/* Jelas — page router.
   The site is one HTML document holding fourteen screens. Only the screen
   matching the current URL hash is shown. This keeps every screen in one
   file while still giving each a real, linkable address.

   Screens: home, problem, how, banks, research, about,
            d1-d5 (customer recovery flow), b1-b3 (bank dashboard). */

(function () {
  var DEFAULT = 'home';
  var NAV_PAGES = ['home', 'problem', 'how', 'banks', 'research', 'about'];

  function pageFromHash() {
    var id = (location.hash || '').replace(/^#\/?/, '');
    return document.getElementById('page-' + id) ? id : DEFAULT;
  }

  function show(id) {
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
      pages[i].classList.toggle('is-active', pages[i].id === 'page-' + id);
    }

    // The marketing header only belongs on the marketing screens.
    var head = document.querySelector('.site-head');
    var foot = document.querySelector('.site-foot');
    var isMarketing = NAV_PAGES.indexOf(id) !== -1;
    head.hidden = !isMarketing;
    foot.hidden = !isMarketing;

    var links = document.querySelectorAll('.site-nav a');
    for (var j = 0; j < links.length; j++) {
      links[j].classList.toggle(
        'is-current',
        links[j].getAttribute('href') === '#' + id
      );
    }

    document.title = 'Jelas — ' + (document.getElementById('page-' + id)
      .getAttribute('data-title') || 'Access, explained');

    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', function () { show(pageFromHash()); });
  document.addEventListener('DOMContentLoaded', function () { show(pageFromHash()); });

  // Table rows that stand in for links.
  document.addEventListener('click', function (e) {
    var row = e.target.closest ? e.target.closest('tr.clickable') : null;
    if (row && row.getAttribute('data-goto')) {
      location.hash = row.getAttribute('data-goto');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var row = e.target.closest ? e.target.closest('tr.clickable') : null;
    if (row && row.getAttribute('data-goto')) {
      location.hash = row.getAttribute('data-goto');
    }
  });
})();

/* ------------------------------------------------------------------
   Motion. Three behaviours, each tied to something the page is saying:
   scroll reveal, a drifting field of the brand mark on the hero, and
   counters that run up once their figures come into view.
   All of it is skipped when the visitor prefers reduced motion.
   ------------------------------------------------------------------ */
(function () {
  var still = window.matchMedia &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- reveal on scroll --- */
  function observe() {
    var targets = document.querySelectorAll('.reveal, .reveal-group');
    if (still || !('IntersectionObserver' in window)) {
      for (var i = 0; i < targets.length; i++) targets[i].classList.add('in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.remove('out');
          en.target.classList.add('in');
          countUp(en.target);
          spin(en.target);
        } else if (en.target.classList.contains('reveal')) {
          // Landing-page points clear again on the way out, so the page
          // replays as the reader scrolls back up. Grouped content
          // (cards, tiles) stays put once shown.
          en.target.classList.remove('in');
          en.target.classList.add('out');
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.18 });
    for (var j = 0; j < targets.length; j++) io.observe(targets[j]);
  }

  /* --- figures count up once --- */
  function countUp(scope) {
    var nums = scope.querySelectorAll('[data-count]');
    for (var i = 0; i < nums.length; i++) {
      (function (el) {
        var end = parseFloat(el.getAttribute('data-count'));
        var pre = el.getAttribute('data-pre') || '';
        var post = el.getAttribute('data-post') || '';
        var d0 = parseInt(el.getAttribute('data-dec') || '0', 10);
        if (still) { el.textContent = pre + (d0 ? end.toFixed(d0) : end.toLocaleString()) + post; return; }
        var t0 = null, dur = 900;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
          var now = end * eased;
          el.textContent = pre + (dec ? now.toFixed(dec)
                                      : Math.round(now).toLocaleString()) + post;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      })(nums[i]);
    }
  }

  /* --- triage ring fills to its value --- */
  function spin(scope) {
    var rings = scope.querySelectorAll('.ring[data-pct]');
    for (var i = 0; i < rings.length; i++) {
      rings[i].style.setProperty('--pct', rings[i].getAttribute('data-pct') + '%');
    }
  }

  /* --- drifting field of the brand mark behind the hero --- */
  function drift() {
    if (still) return;
    var hosts = document.querySelectorAll('canvas.drift');
    for (var n = 0; n < hosts.length; n++) driftOne(hosts[n]);
  }

  function driftOne(c) {
    var ctx = c.getContext('2d'), bits = [], raf;
    var count = parseInt(c.getAttribute('data-count') || '26', 10);

    function size() {
      var r = c.getBoundingClientRect(), d = window.devicePixelRatio || 1;
      c.width = r.width * d; c.height = r.height * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      return r;
    }
    var box = size();

    for (var i = 0; i < count; i++) {
      bits.push({
        x: Math.random() * box.width,
        y: Math.random() * box.height,
        w: 16 + Math.random() * 30,
        vy: -(0.08 + Math.random() * 0.16),
        vx: (Math.random() - 0.5) * 0.06,
        a: 0.04 + Math.random() * 0.07
      });
    }

    function frame() {
      ctx.clearRect(0, 0, box.width, box.height);
      for (var i = 0; i < bits.length; i++) {
        var b = bits[i];
        b.y += b.vy; b.x += b.vx;
        if (b.y < -10) { b.y = box.height + 10; b.x = Math.random() * box.width; }
        ctx.globalAlpha = b.a;
        ctx.fillStyle = '#0E7C86';
        if (ctx.roundRect) {
          ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, 5, 2.5); ctx.fill();
        } else {
          ctx.fillRect(b.x, b.y, b.w, 5);
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    frame();

    window.addEventListener('resize', function () { box = size(); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { cancelAnimationFrame(raf); } else { frame(); }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    observe();
    drift();
  });
  window.addEventListener('hashchange', function () {
    setTimeout(function () {
      var t = document.querySelectorAll('.page.is-active .reveal, .page.is-active .reveal-group');
      for (var i = 0; i < t.length; i++) {
        t[i].classList.add('in'); countUp(t[i]); spin(t[i]);
      }
    }, 30);
  });
})();
