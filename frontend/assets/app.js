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

  /* --- drifting field of the brand mark ---------------------------
     One canvas per page header. A hidden page has no width, so each
     canvas is measured and started only once its page is on screen,
     and paused again when the reader leaves it. ------------------- */
  var fields = [];

  function buildField(c) {
    var ctx = c.getContext('2d');
    var count = parseInt(c.getAttribute('data-count') || '26', 10);
    var state = { c: c, ctx: ctx, count: count, bits: [], raf: 0, w: 0, h: 0, seeded: false };

    state.size = function () {
      var r = c.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      var d = window.devicePixelRatio || 1;
      c.width = r.width * d; c.height = r.height * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      state.w = r.width; state.h = r.height;
      return true;
    };

    state.seed = function () {
      state.bits = [];
      for (var i = 0; i < state.count; i++) {
        state.bits.push({
          x: Math.random() * state.w,
          y: Math.random() * state.h,
          w: 16 + Math.random() * 30,
          vy: -(0.08 + Math.random() * 0.16),
          vx: (Math.random() - 0.5) * 0.06,
          a: 0.04 + Math.random() * 0.07
        });
      }
      state.seeded = true;
    };

    state.frame = function () {
      ctx.clearRect(0, 0, state.w, state.h);
      for (var i = 0; i < state.bits.length; i++) {
        var b = state.bits[i];
        b.y += b.vy; b.x += b.vx;
        if (b.y < -10) { b.y = state.h + 10; b.x = Math.random() * state.w; }
        ctx.globalAlpha = b.a;
        ctx.fillStyle = '#2FB4BD';
        if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, 5, 2.5); ctx.fill(); }
        else { ctx.fillRect(b.x, b.y, b.w, 5); }
      }
      ctx.globalAlpha = 1;
      state.raf = requestAnimationFrame(state.frame);
    };

    state.start = function () {
      if (state.raf) return;
      if (!state.size()) return;
      if (!state.seeded) state.seed();
      state.frame();
    };

    state.stop = function () {
      if (!state.raf) return;
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    };

    return state;
  }

  function refreshFields() {
    if (still) return;
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      // offsetParent is null while an ancestor is display:none
      var visible = f.c.offsetParent !== null && !document.hidden;
      if (visible) { f.size(); f.start(); } else { f.stop(); }
    }
  }

  function drift() {
    if (still) return;
    var hosts = document.querySelectorAll('canvas.drift');
    for (var n = 0; n < hosts.length; n++) fields.push(buildField(hosts[n]));
    refreshFields();
  }

  window.addEventListener('resize', refreshFields);
  document.addEventListener('visibilitychange', refreshFields);


  /* --- sticky chapter headings ------------------------------------
     A sentinel sits at the top of each chapter. Once it has scrolled
     past the site header, the chapter's heading is stuck, so it is
     marked pinned and shrinks out of the way. ---------------------- */
  function chapters() {
    var sentinels = document.querySelectorAll('.chapter-sentinel');
    if (!sentinels.length || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var head = en.target.parentElement.querySelector('.chapter-head');
        if (!head) return;
        var past = !en.isIntersecting && en.boundingClientRect.top < 0;
        head.classList.toggle('pinned', past);
      });
    }, { rootMargin: '-69px 0px 0px 0px', threshold: 0 });

    for (var i = 0; i < sentinels.length; i++) io.observe(sentinels[i]);
  }



  /* --- chapter handoff ---------------------------------------------
     Two sticky headings in sequence collide: the second block reaches
     the first and pushes it out of frame. Instead, the outgoing
     heading fades and lifts over the last stretch of its own chapter,
     so it has cleared before the next one arrives. ----------------- */
  function handoff() {
    var chapters = document.querySelectorAll('.chapter');
    if (!chapters.length || still) return;
    var ticking = false;
    var FADE = 130;   // px of scroll over which the heading clears

    function update() {
      for (var i = 0; i < chapters.length; i++) {
        var head = chapters[i].querySelector('.chapter-head');
        if (!head) continue;
        var cr = chapters[i].getBoundingClientRect();
        var stick = 68 + head.offsetHeight;
        var left = cr.bottom - stick;        // room before the chapter ends

        var t = 0;
        if (left < FADE) t = 1 - left / FADE;
        if (t < 0) t = 0;
        if (t > 1) t = 1;

        head.style.opacity = (1 - t).toFixed(3);
        head.style.transform = 'translateY(' + (-t * 14).toFixed(1) + 'px)';
      }
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', function () { setTimeout(update, 50); });
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    observe();
    chapters();
    handoff();
    drift();
  });
  window.addEventListener('hashchange', function () {
    setTimeout(function () {
      refreshFields();
      var t = document.querySelectorAll('.page.is-active .reveal, .page.is-active .reveal-group');
      for (var i = 0; i < t.length; i++) {
        t[i].classList.remove('out');
        t[i].classList.add('in');
        countUp(t[i]); spin(t[i]);
      }
    }, 40);
  });
})();

/* The header scroll cue moves the reader past the opening screen
   rather than navigating anywhere. */
document.addEventListener('click', function (e) {
  var cue = e.target.closest ? e.target.closest('[data-scroll]') : null;
  if (!cue) return;
  var head = cue.closest('.page-head');
  if (!head) return;
  var next = head.nextElementSibling;
  if (!next) return;
  var still = window.matchMedia &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var y = next.getBoundingClientRect().top + window.pageYOffset - 68;
  window.scrollTo({ top: y, behavior: still ? 'auto' : 'smooth' });
});

/* Hide the header scroll cues as soon as the reader starts moving. */
(function () {
  function sync() {
    var gone = window.pageYOffset > 40;
    var cues = document.querySelectorAll('.head-cue');
    for (var i = 0; i < cues.length; i++) cues[i].classList.toggle('gone', gone);
  }
  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('hashchange', function () { setTimeout(sync, 60); });
  document.addEventListener('DOMContentLoaded', sync);
})();
