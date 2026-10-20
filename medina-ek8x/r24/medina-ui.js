// Demo Medina's Automotive: lo mínimo de su web Duda sin sus scripts (menú desplegable, menú del celular, slider de fotos de Our Team, selector de
// idioma, «Subir foto» y sus 2 formularios) + enganche con la recepción 24 h. La versión por dispositivo (m-*.html) la elige el script del <head>.
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
  // selector de idioma de Duda (bandera): abrir/cerrar al tocar; solo English y Español
  $$('.multilingualWidget').forEach(function (w) {
    var cur = w.querySelector('.current-language a'); if (!cur) return;
    cur.addEventListener('click', function (e) { if (w.querySelector('.other-languages a')) { e.preventDefault(); w.classList.toggle('r24-langopen'); } });
  });
  // «Subir foto» de Quick Estimate: elige una foto en este navegador (no se sube a ningún lado)
  $$('a.fileUploadLink').forEach(function (a) {
    var inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.hidden = true; inp.className = 'r24-upfile'; a.parentNode.appendChild(inp);
    a.setAttribute('href', '#'); a.setAttribute('role', 'button');
    a.addEventListener('click', function (e) { e.preventDefault(); inp.click(); });
    inp.addEventListener('change', function () { var f = inp.files && inp.files[0]; var lb = a.parentNode.querySelector('.fileLabel'); if (f && lb) { lb.textContent = '📷 ' + f.name.slice(0, 40); lb.classList.add('r24-filename'); } var h = a.parentNode.querySelector('.fileName'); if (h && f) h.value = f.name.slice(0, 40); });
  });
  // sus 2 formularios (Quick Estimate y Contact Us de Location): le pasan el pedido a la recepción (no se envía nada)
  $$('form').forEach(function (f) {
    if (!f.querySelector('[name^="dmform-"]')) return;
    f.setAttribute('novalidate', '');
    f.addEventListener('submit', function (e) {
      e.preventDefault(); e.stopImmediatePropagation();
      function v(n) { var x = f.querySelector('[name="' + n + '"]'); return x ? (x.value || '').trim() : ''; }
      var tel = v('dmform-2'), name = v('dmform-0'), err = f.querySelector('.r24-form-err');
      if (!name || tel.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '').length !== 10) {
        if (!err) { err = document.createElement('p'); err.className = 'r24-form-err'; err.style.cssText = 'color:#b91c1c;font:600 14px "Source Sans Pro",system-ui,sans-serif;margin:8px 0 0;text-align:left'; f.appendChild(err); }
        err.textContent = P.es ? 'Escriba al menos su nombre y un teléfono de 10 cifras.' : 'Please enter at least your name and a 10-digit phone number.'; return;
      }
      if (err) err.remove();
      var sb = f.querySelector('[type="submit"]'); if (sb) { sb.value = P.es ? '✓ Enviado a la recepción' : '✓ Sent to the front desk'; sb.classList.add('r24-sent'); }
      var up = f.querySelector('.r24-upfile'), foto = up && up.files && up.files[0] ? up.files[0] : null;
      if (window.R24 && window.R24.fromForm) window.R24.fromForm({ kind: f.getAttribute('data-r24-form'), name: name, tel: tel, email: v('dmform-1'), vehiculo: v('dmform-4'), msg: v('dmform-3'), foto: foto });
    }, true);
  });
})();
// slider de fotos (flexslider de Duda en Our Team: fundido, cambia solo cada 3 s, flechas anterior/siguiente; carga cada foto al mostrarla)
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
