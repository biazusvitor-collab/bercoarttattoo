/* Berço Art Tattoo & Piercing — interações do site */
(function () {
  'use strict';

  var WHATSAPP = '351923374359';
  var MENSAGENS = {
    tatuagem: {
      titulo: 'Marcar horário para tatuagem',
      texto: 'Olá! Queria fazer um orçamento de uma tatuagem.'
    },
    piercing: {
      titulo: 'Marcar horário para piercing',
      texto: 'Olá! Queria fazer um orçamento de um piercing.'
    }
  };

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Entrada do hero ---------- */
  function startHero() { root.classList.add('is-loaded'); }
  if (document.readyState === 'complete') { requestAnimationFrame(startHero); }
  else { window.addEventListener('load', startHero); setTimeout(startHero, 1800); }

  /* ---------- Vídeo de fundo (sempre sem som) ---------- */
  var video = document.querySelector('.hero__video');
  if (video) {
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.setAttribute('muted', '');
    if (reduceMotion) {
      video.removeAttribute('autoplay');
      video.pause();
    } else {
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* o poster fica visível */ });
      // poupar recursos quando o hero não está visível
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { var q = video.play(); if (q && q.catch) q.catch(function () {}); }
            else video.pause();
          });
        }, { threshold: 0.05 }).observe(video);
      }
    }
  }

  /* ---------- Navegação ---------- */
  var nav = document.getElementById('nav');
  var toggle = nav.querySelector('.nav__toggle');
  var fab = document.querySelector('.fab');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('is-solid', y > 40);
    if (fab) fab.classList.toggle('is-shown', y > window.innerHeight * 0.7);
    updateSteps();
  }

  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.querySelector('.sr-only').textContent = open ? 'Abrir menu' : 'Fechar menu';
    nav.classList.toggle('is-open', !open);
  });
  nav.querySelectorAll('.nav__menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('.sr-only').textContent = 'Abrir menu';
      nav.classList.remove('is-open');
    });
  });

  // link ativo conforme a secção visível
  var links = {};
  nav.querySelectorAll('.nav__menu ul a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && links[e.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('is-current'); });
          links[e.target.id].classList.add('is-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) secObs.observe(s); });
  }

  /* ---------- Animações ao fazer scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-wipe, .reveal-img, .flourish');
  if ('IntersectionObserver' in window && !reduceMotion) {
    // Elementos totalmente recortados (clip-path) não são detetados pelo observador,
    // por isso observamos o elemento-pai e revelamos os filhos associados.
    var targets = new Map();
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          (targets.get(e.target) || []).forEach(function (t) { t.classList.add('is-visible'); });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) {
      var watch = el.matches('.reveal-wipe, .reveal-img') ? el.parentElement : el;
      if (!targets.has(watch)) { targets.set(watch, []); obs.observe(watch); }
      targets.get(watch).push(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Linha dourada dos passos (ligada ao scroll) ---------- */
  var stepsList = document.getElementById('steps-list');
  var stepItems = stepsList ? stepsList.querySelectorAll('li') : [];
  function updateSteps() {
    if (!stepsList) return;
    var r = stepsList.getBoundingClientRect();
    var vh = window.innerHeight;
    var start = vh * 0.85, end = vh * 0.35;
    var mid = r.top + r.height / 2;
    var p = reduceMotion ? 1 : Math.min(1, Math.max(0, (start - mid) / (start - end)));
    stepsList.style.setProperty('--p', p.toFixed(3));
    var n = stepItems.length;
    stepItems.forEach(function (li, i) {
      li.classList.toggle('is-lit', p >= (n === 1 ? 0 : i / (n - 1)) - 0.001 && p > 0);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); }
  }, { passive: true });
  window.addEventListener('resize', updateSteps);
  onScroll();

  /* ---------- Marcação pelo WhatsApp (2 passos) ---------- */
  var dlg = document.getElementById('booking');
  var step1 = dlg.querySelector('[data-step="1"]');
  var step2 = dlg.querySelector('[data-step="2"]');
  var step2Title = dlg.querySelector('[data-step2-title]');
  var msgEl = dlg.querySelector('[data-message]');
  var whatsBtn = dlg.querySelector('[data-whats]');
  var lastTrigger = null;

  function linkWhatsApp(texto) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
  }

  function showStep(n) {
    step1.hidden = n !== 1;
    step2.hidden = n !== 2;
  }

  function openBooking(trigger) {
    lastTrigger = trigger || null;
    showStep(1);
    whatsBtn.removeAttribute('href'); // o link só é libertado depois de escolher o serviço
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    var first = step1.querySelector('.opt');
    if (first) first.focus();
  }

  function closeDialog(d) {
    if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
  }

  document.querySelectorAll('[data-booking]').forEach(function (el) {
    el.addEventListener('click', function (ev) { ev.preventDefault(); openBooking(el); });
  });

  dlg.querySelectorAll('[data-service]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var s = MENSAGENS[btn.getAttribute('data-service')];
      step2Title.textContent = s.titulo;
      msgEl.textContent = s.texto;
      whatsBtn.href = linkWhatsApp(s.texto);
      showStep(2);
      whatsBtn.focus();
    });
  });

  dlg.querySelector('[data-back]').addEventListener('click', function () {
    whatsBtn.removeAttribute('href');
    showStep(1);
    var first = step1.querySelector('.opt');
    if (first) first.focus();
  });

  whatsBtn.addEventListener('click', function () {
    setTimeout(function () { closeDialog(dlg); }, 400);
  });

  document.querySelectorAll('dialog [data-close]').forEach(function (b) {
    b.addEventListener('click', function () { closeDialog(b.closest('dialog')); });
  });

  // fechar ao clicar fora da caixa
  [dlg, document.getElementById('lightbox')].forEach(function (d) {
    if (!d) return;
    d.addEventListener('click', function (ev) {
      if (ev.target !== d) return;
      if (d.id === 'lightbox') { closeDialog(d); return; }
      var r = d.getBoundingClientRect();
      var inside = ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
      if (!inside) closeDialog(d);
    });
  });

  dlg.addEventListener('close', function () {
    if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
  });

  /* ---------- Galeria em ecrã inteiro ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('[data-lightbox-img]');
  document.querySelectorAll('.g__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var img = b.querySelector('img');
      lbImg.src = b.getAttribute('data-full');
      lbImg.alt = img ? img.alt : '';
      if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
    });
  });
  lbImg.addEventListener('click', function () { closeDialog(lb); });

  /* ---------- Ano no rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
