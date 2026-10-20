// Demo FastGear Auto Repair: lo mínimo de su web sin sus scripts (jQuery + menú «flexiCssMenus» + fixto + smoothscroll):
// cabecera que queda fija en blanco al bajar (como fixto en su web), menú con desplazamiento suave a «About», y en el celular (≤767 px)
// el botón hamburguesa con su panel oscuro de 2 opciones. Sin ShortPixel/Optimole: las imágenes ya vienen con su src real.
// + la cabecera baja cuando está la franja de la demo.
(function () {
  "use strict";
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  var st = document.querySelector('.r24-strip'), ht = document.querySelector('.header-top');
  function layout() { if (st) document.documentElement.style.setProperty('--r24-sh', st.offsetHeight + 'px'); }
  layout(); window.addEventListener('resize', layout); window.addEventListener('load', layout);
  function onScroll() { if (!ht) return; var lim = (st ? st.offsetHeight : 0) + 10; ht.classList.toggle('fixto-fixed', window.scrollY > lim); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  function go(id) { var t = id === '#page' ? null : document.querySelector(id); window.scrollTo({ top: t ? t.getBoundingClientRect().top + window.scrollY - 80 : 0, behavior: 'smooth' }); }
  $$('#drop_mainmenu a, a.skip-link').forEach(function (a) {
    a.addEventListener('click', function (e) { var id = a.getAttribute('href'); if (!id || id.charAt(0) !== '#') return; e.preventDefault(); go(id); });
  });
  // menú del celular, como el de su web (botón hamburguesa + panel oscuro con × )
  var cont = document.getElementById('drop_mainmenu_container');
  if (cont) {
    var btn = document.createElement('a'); btn.className = 'fm2_mobile_button r24-mbtn'; btn.id = 'fm2_drop_mainmenu_mobile_button'; btn.href = '#';
    btn.setAttribute('aria-label', document.documentElement.lang === 'es' ? 'Menú' : 'Menu'); btn.innerHTML = '<span class="caption"></span>';
    cont.parentNode.insertBefore(btn, cont.nextSibling);
    var ov = document.createElement('div'); ov.className = 'r24-mmenu'; ov.setAttribute('role', 'dialog');
    ov.innerHTML = '<div class="r24-mm-in"><button type="button" class="r24-mm-x" aria-label="' + (document.documentElement.lang === 'es' ? 'Cerrar' : 'Close') + '"></button><ul></ul></div>';
    var ul = ov.querySelector('ul');
    $$('#drop_mainmenu > li > a').forEach(function (a) { var li = document.createElement('li'), b = document.createElement('a'); b.href = a.getAttribute('href'); b.textContent = a.textContent; b.onclick = function (e) { e.preventDefault(); ov.classList.remove('r24-on'); go(b.getAttribute('href')); }; li.appendChild(b); ul.appendChild(li); });
    document.body.appendChild(ov);
    btn.onclick = function (e) { e.preventDefault(); ov.classList.add('r24-on'); };
    ov.querySelector('.r24-mm-x').onclick = function () { ov.classList.remove('r24-on'); };
    ov.onclick = function (e) { if (e.target === ov) ov.classList.remove('r24-on'); };
  }
})();
