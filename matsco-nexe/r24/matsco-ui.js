// Demo Matsco Transmissions: lo mínimo de su web sin sus scripts (jQuery + Divi scripts.min.js + smoothscroll + reCAPTCHA):
// menú del celular de Divi (☰ MENU que despliega Home / Location), desplazamiento suave a «Location» (#location), la animación
// «slideLeft» de las 3 columnas (et_animated) al aparecer, y su formulario de síntomas: «Other» muestra el campo para explicar el problema
// (en su web nunca aparece) y al enviar le pasa el pedido a la recepción 24 h (no se envía nada: 0 POST).
(function () {
  "use strict";
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  var es = document.documentElement.lang === 'es';
  function go(id) { var t = document.querySelector(id); if (!t) return; window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 10, behavior: 'smooth' }); }
  $$('a[href^="#"]:not([data-r24-open])').forEach(function (a) {
    a.addEventListener('click', function (e) { var id = a.getAttribute('href'); if (!id || id === '#') return; if (!document.querySelector(id)) return; e.preventDefault(); go(id); closeMenu(); });
  });
  // menú del celular (≤980 px): como Divi, clona el menú en ul.et_mobile_menu bajo el botón
  var mn = document.querySelector('.et_pb_menu .mobile_nav'), menu = document.querySelector('#menu-top-navigation'), ul = null;
  function closeMenu() { if (!mn) return; mn.classList.remove('opened'); mn.classList.add('closed'); if (ul) ul.style.display = 'none'; }
  if (mn && menu) {
    ul = document.createElement('ul'); ul.id = 'mobile_menu1'; ul.className = 'et_mobile_menu'; ul.innerHTML = menu.innerHTML;
    var f = ul.querySelector('li'); if (f) f.classList.add('et_first_mobile_item');
    mn.appendChild(ul);
    $$('a', ul).forEach(function (a) { a.addEventListener('click', function (e) { var id = a.getAttribute('href'); if (id && id.charAt(0) === '#') { e.preventDefault(); closeMenu(); go(id); } else closeMenu(); }); });
    var bar = mn.querySelector('.mobile_menu_bar'); bar.setAttribute('role', 'button'); bar.setAttribute('tabindex', '0'); bar.setAttribute('aria-label', es ? 'Menú' : 'Menu');
    bar.addEventListener('click', function (e) { e.preventDefault(); var o = mn.classList.contains('opened'); if (o) closeMenu(); else { mn.classList.remove('closed'); mn.classList.add('opened'); ul.style.display = 'block'; } });
  }
  // animación de entrada (Divi: slideLeft, una vez)
  var an = $$('.et_animated');
  if ('IntersectionObserver' in window) {
    an.forEach(function (x) { x.classList.add('r24-anim'); });
    var io = new IntersectionObserver(function (es2) { es2.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('r24-shown'); io.unobserve(e.target); } }); }, { threshold: 0.1 });
    an.forEach(function (x) { io.observe(x); });
  }
  // su formulario de síntomas
  $$('form[data-r24-form]').forEach(function (fm) {
    var other = fm.querySelector('.r24-other'), cbs = $$('input[type=checkbox]', fm);
    function syncOther() { var on = cbs.some(function (c) { return c.checked && /^Other$/.test(c.value); }); if (other) other.classList.toggle('r24-on', on); }
    cbs.forEach(function (c) { c.addEventListener('change', syncOther); }); syncOther();
    function v(id) { var x = fm.querySelector('#' + id); return x ? x.value.trim() : ''; }
    fm.addEventListener('submit', function (e) {
      e.preventDefault(); e.stopPropagation();
      var name = v('et_pb_contact_name_0'), tel = v('et_pb_contact_phone_0'), err = fm.querySelector('.r24-form-err');
      var digits = tel.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
      if (name.length < 2 || !/^[2-9]\d{9}$/.test(digits)) {
        if (!err) { err = document.createElement('p'); err.className = 'r24-form-err'; fm.querySelector('.et_contact_bottom_container').before(err); }
        err.textContent = es ? 'Escriba su nombre y un teléfono de 10 cifras (con código de área) para que el taller le llame.' : 'Please enter your name and a 10-digit phone number (with area code) so the shop can call you.';
        return;
      }
      if (err) err.remove();
      var sint = cbs.filter(function (c) { return c.checked; }).map(function (c) { var l = fm.querySelector('label[for="' + c.id + '"]'); return l ? l.textContent.trim() : c.value; });
      if (window.R24 && window.R24.fromForm) window.R24.fromForm({ kind: 'sintomas', name: name, tel: tel, email: v('et_pb_contact_email_0'), msg: v('et_pb_contact_message_0'), sintomas: sint, otro: other && other.classList.contains('r24-on') ? v('et_pb_contact_other_0') : '' });
    });
  });
})();
