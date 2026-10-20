// Demo International Engines LLC: lo mínimo de su web Squarespace sin sus scripts (menú del celular, cierre del aviso de ofertas, alto de la
// cabecera, videos de Gallery y su formulario «Contact Us») + enganche con la recepción 24 h.
(function () {
  "use strict";
  var P = window.R24_PAGE || {};
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  var hd = document.getElementById('header'), st = document.querySelector('.r24-strip');
  // la cabecera de Squarespace es fija arriba: baja mientras se ve la franja de la demo y la primera sección deja lugar (antes lo calculaba su JS)
  function layout() {
    if (!hd) return;
    var off = st ? Math.max(0, st.offsetHeight - (window.scrollY || 0)) : 0, pos = getComputedStyle(hd).position;
    if (pos === 'fixed') hd.style.top = off + 'px';
    var first = document.querySelector('#page section.page-section, main section.page-section');
    if (first && (pos === 'fixed' || pos === 'absolute')) first.style.paddingTop = Math.round(hd.offsetHeight) + 'px';
  }
  layout(); window.addEventListener('scroll', layout, { passive: true }); window.addEventListener('resize', layout); window.addEventListener('load', layout);
  // aviso de ofertas: la X lo cierra
  $$('.sqs-announcement-bar-close').forEach(function (x) { x.addEventListener('click', function (e) { e.preventDefault(); var b = x.closest('.sqs-announcement-bar-dropzone') || x.closest('.sqs-announcement-bar'); if (b) b.style.display = 'none'; document.body.classList.remove('announcement-bar-reserved-space'); layout(); }); });
  // menú del celular (hamburguesa)
  var bbs = $$('.header-burger-btn'), bb = bbs[0];
  function menu(o) {
    document.body.classList.toggle('header--menu-open', o);
    bbs.forEach(function (x) { x.classList.toggle('burger--active', o); x.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    $$('.js-header-burger-open-title').forEach(function (s) { s.hidden = o; }); $$('.js-header-burger-close-title').forEach(function (s) { s.hidden = !o; });
  }
  bbs.forEach(function (x) { x.addEventListener('click', function (e) { e.preventDefault(); menu(!document.body.classList.contains('header--menu-open')); }); });
  $$('.header-menu a').forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });
  // videos de Gallery: como en su web, sin sonido y en bucle; arrancan al verse
  var vids = $$('video.r24-video');
  if (vids.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { var v = en.target; if (en.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause(); }); }, { threshold: 0.35 });
    vids.forEach(function (v) { io.observe(v); });
  }
  // su formulario «Contact Us» (Home y Contact): le pasa el pedido a la recepción (no se envía nada)
  $$('form[data-r24-form]').forEach(function (f) {
    function q(s) { return f.querySelector(s); }
    function val(s) { var x = q(s); return x ? (x.value || '').trim() : ''; }
    function lbl(sel) { var x = q(sel); if (!x || x.selectedIndex < 1) return ''; var o = x.options[x.selectedIndex]; return o && !o.disabled ? o.text.trim() : ''; }
    f.addEventListener('submit', function (e) {
      e.preventDefault(); e.stopImmediatePropagation();
      var name = (val('input[name="fname"]') + ' ' + val('input[name="lname"]')).trim(), tel = val('.phone input[type="text"], input[autocomplete="tel-national"]'), err = q('.r24-form-err');
      if (!name || tel.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '').length !== 10) {
        if (!err) { err = document.createElement('p'); err.className = 'r24-form-err'; err.style.cssText = 'color:#b91c1c;font:600 14px system-ui,sans-serif;margin:8px 0 0;text-align:left'; (q('.form-button-wrapper') || f).appendChild(err); }
        err.textContent = P.es ? 'Escriba al menos su nombre y un teléfono de 10 cifras.' : 'Please enter at least your name and a 10-digit phone number.'; return;
      }
      if (err) err.remove();
      var sb = q('.form-submit-button-label'); if (sb) sb.textContent = P.es ? '✓ Enviado a la recepción' : '✓ Sent to the front desk';
      var selects = $$('select', f), servicio = '', sede = '';
      selects.forEach(function (s) { var l = (s.getAttribute('aria-label') || '') + ' ' + (s.closest('.form-item') ? s.closest('.form-item').innerText : ''); var t = s.selectedIndex > 0 ? s.options[s.selectedIndex].text.trim() : ''; if (/Location|Sede/i.test(l)) sede = t; else servicio = t; });
      var veh = ''; $$('.form-item.text input', f).forEach(function (i) { if (!veh) veh = (i.value || '').trim(); });
      if (window.R24 && window.R24.fromForm) window.R24.fromForm({ kind: 'contact', name: name, tel: tel, email: val('input[type="email"]'), vehiculo: veh, servicio: servicio, sede: sede, msg: val('textarea') });
    }, true);
  });
})();
