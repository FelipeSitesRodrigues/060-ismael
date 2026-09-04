(function () {
  'use strict';

  // ---------------------------------------------------------------
  // CONFIG: trocar pelo número real e textos confirmados com o Ismael
  // ---------------------------------------------------------------
  var WHATSAPP_NUMBER = '5500000000000'; // TODO: colocar o número real, com DDI e DDD, só números
  var WHATSAPP_MESSAGE = 'Olá! Vim pelo site e quero entrar na comunidade Ismaelfodaa.';

  var waLink = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE);
  var whatsappFloat = document.getElementById('whatsappFloat');
  if (whatsappFloat) whatsappFloat.setAttribute('href', waLink);


  // ---------------------------------------------------------------
  // Header: sombra/fundo mais forte ao rolar
  // ---------------------------------------------------------------
  var header = document.getElementById('header');
  var lastScroll = 0;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (y > 20) header.style.background = 'rgba(10,10,10,.92)';
    else header.style.background = 'rgba(10,10,10,.7)';
    lastScroll = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------------------------------------------------------------
  // Menu mobile
  // ---------------------------------------------------------------
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // ---------------------------------------------------------------
  // Accordion (objeções + FAQ)
  // ---------------------------------------------------------------
  var triggers = document.querySelectorAll('.accordion__trigger');

  function setPanelHeight(panel, expanded) {
    if (expanded) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = '0px';
    }
  }

  triggers.forEach(function (trigger) {
    var panel = trigger.nextElementSibling;
    var expanded = trigger.getAttribute('aria-expanded') === 'true';
    setPanelHeight(panel, expanded);

    trigger.addEventListener('click', function () {
      var isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isExpanded));
      setPanelHeight(panel, !isExpanded);
    });
  });

  // Recalcula altura dos painéis abertos ao redimensionar (texto pode quebrar diferente)
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      triggers.forEach(function (trigger) {
        if (trigger.getAttribute('aria-expanded') === 'true') {
          setPanelHeight(trigger.nextElementSibling, true);
        }
      });
    }, 150);
  });

  // ---------------------------------------------------------------
  // Carrossel de depoimentos
  // ---------------------------------------------------------------
  var track = document.getElementById('testimonialsTrack');
  var dotsWrap = document.getElementById('testimonialsDots');
  var prevBtn = document.getElementById('testiPrev');
  var nextBtn = document.getElementById('testiNext');

  if (track && dotsWrap) {
    var cards = Array.prototype.slice.call(track.children);
    cards.forEach(function (card, i) {
      var dot = document.createElement('span');
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () {
        card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function updateActiveDot() {
      var scrollLeft = track.scrollLeft;
      var closest = 0;
      var minDist = Infinity;
      cards.forEach(function (card, i) {
        var dist = Math.abs(card.offsetLeft - scrollLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === closest); });
    }

    var scrollTimer;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateActiveDot, 100);
    }, { passive: true });

    function scrollByCard(direction) {
      var card = cards[0];
      var amount = card.getBoundingClientRect().width + 20;
      track.scrollBy({ left: direction * amount, behavior: 'smooth' });
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { scrollByCard(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollByCard(1); });
  }

  // ---------------------------------------------------------------
  // Scroll reveal (respeita prefers-reduced-motion)
  // O atraso é contado dentro de cada bloco, não na página inteira,
  // senão o card do meio de uma grade herda o atraso da seção anterior.
  // ---------------------------------------------------------------
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

    revealEls.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentNode.children, function (n) {
        return n.classList && n.classList.contains('reveal');
      });
      var i = siblings.indexOf(el);
      el.style.transitionDelay = (Math.min(i, 7) * 0.055) + 's';
      observer.observe(el);
    });
  }

})();
