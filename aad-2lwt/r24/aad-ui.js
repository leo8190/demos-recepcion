// Demo All About Diesel: lo mínimo de su web Duda sin sus scripts (menú desplegable, menú del celular, slider de servicios, reseñas, formulario
// «Book Online») + enganche con la recepción 24 h. La versión por dispositivo (m-*.html) la elige el script del <head>.
(function () {
  "use strict";
  var P = window.R24_PAGE || {};
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  // menú de escritorio: abrir/cerrar al tocar (en hover lo hace el CSS)
  $$('.unifiednav__item-wrap').forEach(function (w) {
    var a = w.querySelector(':scope>.unifiednav__item_has-sub-nav'); if (!a) return;
    var ic = a.querySelector('.icon');
    (ic || a).addEventListener('click', function (e) {
      if (!ic && !P.mob) return;
      e.preventDefault(); e.stopPropagation(); w.classList.toggle('r24-subopen');
    });
  });
  // menú del celular (hamburguesa)
  var hb = document.getElementById('layout-drawer-hamburger'), dr = document.getElementById('mobile-hamburger-drawer') || document.getElementById('hamburger-drawer');
  var rmc = document.querySelector('.runtime-module-container');
  function drawer(o) {
    if (!dr) return;
    if (o) { dr.setAttribute('open', ''); dr.removeAttribute('inert'); dr.setAttribute('aria-hidden', 'false'); } else { dr.removeAttribute('open'); dr.setAttribute('inert', ''); dr.setAttribute('aria-hidden', 'true'); }
    if (rmc) rmc.classList.toggle('layout-drawer_open', o);
    if (hb) { hb.setAttribute('aria-expanded', o ? 'true' : 'false'); hb.classList.toggle('opened', o); }
    document.documentElement.classList.toggle('r24-drawer', o);
  }
  if (hb && dr) {
    hb.addEventListener('click', function (e) { e.preventDefault(); drawer(!dr.hasAttribute('open')); });
    $$('.layout-drawer-overlay').forEach(function (o) { o.addEventListener('click', function () { drawer(false); }); });
    $$('a', dr).forEach(function (a) { a.addEventListener('click', function (e) { if (a.classList.contains('unifiednav__item_has-sub-nav') && e.target.closest('.icon')) return; drawer(false); }); });
  }
  // slider de servicios (Duda «ssrimageslider»): flechas anterior/siguiente
  $$('[data-element-type="ssrimageslider"]').forEach(function (sl) {
    var film = sl.querySelector('[data-auto="slider-filmRole"]'); if (!film) return;
    var slides = $$('[data-auto^="slideSlot"]', film); if (slides.length < 2) return;
    var per = Math.max(1, Math.round(film.parentNode.getBoundingClientRect().width / (slides[0].getBoundingClientRect().width || 1)));
    var i = 0, max = Math.max(0, slides.length - per);
    function go(k) { i = Math.max(0, Math.min(max, k)); film.style.transition = 'transform .45s'; film.style.transform = 'translateX(' + (-i * slides[0].getBoundingClientRect().width) + 'px)'; }
    var btns = $$('[data-auto="slider-prev-button"],[data-auto="slider-next-button"],[aria-label="Previous"],[aria-label="Next"],button[class*="arrow"]', sl);
    btns.forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); var nx = /next/i.test((b.getAttribute('data-auto') || '') + (b.getAttribute('aria-label') || '') + b.className); go(nx ? (i >= max ? 0 : i + 1) : (i <= 0 ? max : i - 1)); }); });
    sl.r24go = go;
  });
  // reseñas (Trustindex): «Read more» y flechas
  document.addEventListener('click', function (e) {
    var rm = e.target.closest && e.target.closest('.ti-read-more, .ti-read-more-active');
    if (rm) { e.preventDefault(); var it = rm.closest('.ti-review-item'); if (it) it.classList.toggle('r24-ti-open'); return; }
    var nx = e.target.closest && e.target.closest('.ti-next, .ti-prev');
    if (nx) { var w = nx.closest('.ti-reviews-container'); var c = w && w.querySelector('.ti-reviews-container-wrapper'); if (!c) return;
      var items = $$('.ti-review-item', c); if (!items.length) return;
      if (nx.classList.contains('ti-next')) c.appendChild(items[0]); else c.insertBefore(items[items.length - 1], items[0]);
      var pv = w.querySelector('.ti-prev'); if (pv) pv.style.display = ''; }
    var lm = e.target.closest && e.target.closest('.ti-load-more-reviews-button');
    if (lm) { e.preventDefault(); $$('.ti-review-item').forEach(function (x) { x.style.display = ''; }); lm.style.display = 'none'; }
  }, true);
  // su formulario «Book Online» (/book-now): le pasa el pedido a la recepción (no se envía nada)
  $$('form').forEach(function (f) {
    if (!f.querySelector('[name^="dmform-"]')) return;
    f.setAttribute('novalidate', '');
    f.addEventListener('submit', function (e) {
      e.preventDefault(); e.stopImmediatePropagation();
      function v(n) { var x = f.querySelector('[name="' + n + '"]'); return x ? (x.value || '').trim() : ''; }
      var tel = v('dmform-2'), first = v('dmform-0'), err = f.querySelector('.r24-form-err');
      if (!first || tel.replace(/\D/g, '').length < 10) {
        if (!err) { err = document.createElement('p'); err.className = 'r24-form-err'; err.style.cssText = 'color:#b91c1c;font:600 13px Poppins,system-ui,sans-serif;margin:8px 0 0'; f.appendChild(err); }
        err.textContent = P.es ? 'Escriba al menos su nombre y un teléfono de 10 cifras.' : 'Please enter at least your first name and a 10-digit phone number.'; return;
      }
      if (err) err.remove();
      var sb = f.querySelector('[type="submit"]'); if (sb) { sb.value = P.es ? '✓ Enviado a la recepción' : '✓ Sent to the front desk'; sb.classList.add('r24-sent'); }
      var other = v('dmform-64733'), extra = v('dmform-64734');
      if (window.R24 && window.R24.fromForm) window.R24.fromForm({ name: (first + ' ' + v('dmform-4')).trim(), tel: tel, email: v('dmform-1'), vehiculo: v('dmform-64731'),
        msg: [v('dmform-64732'), other, extra].filter(Boolean).join(' · '), fecha: v('dmform-64735'), hora: v('dmform-64736') });
    }, true);
  });
})();
// slider de fotos (flexslider de Duda en Services: fundido, cambia solo cada 3 s, flechas anterior/siguiente; carga cada foto al mostrarla)
(function () {
  [].forEach.call(document.querySelectorAll('.flexslider'), function (fx) {
    var ul = fx.querySelector('ul.slides'); if (!ul) return;
    var lis = [].filter.call(ul.children, function (x) { return x.tagName === 'LI'; }); if (lis.length < 2) return;
    var i = 0, timer = null;
    function load(k) { var li = lis[(k + lis.length) % lis.length], u = li.getAttribute('data-r24-bg'); if (u) { li.style.backgroundImage = 'url("' + u + '")'; li.removeAttribute('data-r24-bg'); } }
    function show(k) {
      i = (k + lis.length) % lis.length; load(i); load(i + 1);
      lis.forEach(function (li, j) { li.style.transition = 'opacity .6s'; li.style.opacity = j === i ? '1' : '0'; li.style.zIndex = j === i ? '2' : '1'; li.style.display = 'block'; li.classList.toggle('flex-active-slide', j === i); });
    }
    function play() { clearInterval(timer); timer = setInterval(function () { show(i + 1); }, 3000); }
    var pv = fx.querySelector('.flex-prev'), nx = fx.querySelector('.flex-next');
    if (pv) pv.addEventListener('click', function (e) { e.preventDefault(); show(i - 1); play(); });
    if (nx) nx.addEventListener('click', function (e) { e.preventDefault(); show(i + 1); play(); });
    fx.addEventListener('mouseenter', function () { clearInterval(timer); }); fx.addEventListener('mouseleave', play);
    show(0); play();
  });
})();
// celular: su cabecera es fija arriba; mientras se ve la franja de la demo, la cabecera baja para no quedar tapada
(function () {
  var st = document.querySelector('.r24-strip'); if (!st || !document.body.classList.contains('dmMobileBody')) return;
  function upd() { document.documentElement.style.setProperty('--r24-off', Math.max(0, st.offsetHeight - (window.scrollY || 0)) + 'px'); }
  upd(); window.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd);
})();
