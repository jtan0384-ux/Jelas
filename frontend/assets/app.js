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
