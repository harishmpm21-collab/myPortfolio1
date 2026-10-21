/* Portfolio interactions. The site still works if this file fails to load. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Close the mobile menu after choosing a link */
  var toggle = document.getElementById('menu-toggle');
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    a.addEventListener('click', function () { if (toggle) toggle.checked = false; });
  });

  /* 2. Reveal cards and fill skill bars when they scroll into view */
  var reveals = Array.prototype.filter.call(document.querySelectorAll('.card, .project'), function (el) { return !el.closest('.timeline'); });
  var bars = document.querySelectorAll('.bar');
  reveals.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
    bars.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    bars.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* 2b. Drag the experience timeline sideways with the mouse */
  var track = document.querySelector('.timeline');
  if (track) {
    var down = false, startX = 0, startLeft = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; startX = e.clientX; startLeft = track.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      track.classList.add('is-dragging');
      track.scrollLeft = startLeft - (e.clientX - startX);
    });
    window.addEventListener('pointerup', function () { down = false; track.classList.remove('is-dragging'); });
  }

  /* 3. Highlight the nav link of the section being viewed */
  var links = document.querySelectorAll('.nav__links a[href^="#"]:not(.btn)');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) {
          l.removeAttribute('aria-current');
          if (l.getAttribute('href') === '#' + e.target.id) l.setAttribute('aria-current', 'true');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  if (reduce) return;

  /* 4. Project cards tilt toward the mouse */
  document.querySelectorAll('.project').forEach(function (card) {
    var inner = card.querySelector('.project__inner');
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      inner.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
      inner.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
    });
    card.addEventListener('pointerleave', function () {
      inner.style.removeProperty('--rx');
      inner.style.removeProperty('--ry');
    });
  });

  /* 5. Soft light that follows the mouse in the hero */
  var hero = document.querySelector('.hero');
  if (hero) hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
})();
