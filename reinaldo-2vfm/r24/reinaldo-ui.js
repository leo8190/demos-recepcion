/* Demo Reinaldo Paint & Body Shop: reemplaza lo que en su web hace el JavaScript de WordPress/Elementor (la copia es HTML estático, sin sus scripts):
   - menú hamburguesa (Elementor Pro nav-menu, cabecera y pie) con sus submenús «Servicios» y «Acerca de nosotros»; se cierra al elegir una sección;
   - slider del inicio (Swiper, fundido) que va alternando sus 3 diapositivas;
   - reseñas de Google (Widget Google Reviews) en fila deslizable con sus flechas;
   - su formulario «Selecciona tu servicio / Select your service need» (Elementor Forms): en su web pide email obligatorio y un reCAPTCHA «No soy un robot»;
     en la demo le pasa el pedido a la recepción 24 h (no se envía nada a ningún lado). */
(function () {
  "use strict";
  var ES = document.documentElement.lang === "es";
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function ready(f) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", f); else f(); }
  ready(function () {
    // menú hamburguesa
    $$(".elementor-menu-toggle").forEach(function (tg) {
      var nav = tg.nextElementSibling; if (!nav || !nav.classList.contains("elementor-nav-menu__container")) return;
      var w = tg.closest(".elementor-widget") || tg.parentNode;
      function place() { var r = w.getBoundingClientRect(), t = tg.getBoundingClientRect(); nav.style.left = (-r.left) + "px"; nav.style.width = document.documentElement.clientWidth + "px"; nav.style.top = (t.bottom - r.top) + "px"; }
      function set(op) { tg.classList.toggle("elementor-active", op); tg.setAttribute("aria-expanded", op ? "true" : "false"); nav.setAttribute("aria-hidden", op ? "false" : "true"); $$("a", nav).forEach(function (a) { a.tabIndex = op ? 0 : -1; }); if (op) place(); document.documentElement.classList.toggle("r24-menu-open", op); }
      tg.addEventListener("click", function (e) { e.preventDefault(); set(!tg.classList.contains("elementor-active")); });
      tg.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(!tg.classList.contains("elementor-active")); } });
      $$("a", nav).forEach(function (a) {
        a.addEventListener("click", function (e) {
          if (a.classList.contains("has-submenu") || (a.getAttribute("href") === "#" && a.nextElementSibling && a.nextElementSibling.classList.contains("sub-menu"))) {
            e.preventDefault(); var li = a.parentNode, op = !li.classList.contains("r24-sub-open"); li.classList.toggle("r24-sub-open", op); a.setAttribute("aria-expanded", op ? "true" : "false"); return;
          }
          set(false);
        });
      });
      addEventListener("resize", function () { if (tg.classList.contains("elementor-active")) place(); });
    });
    // slider del inicio
    $$(".elementor-slides-wrapper").forEach(function (sw) {
      var sl = $$(".swiper-slide", sw); if (!sl.length) return; var i = 0;
      sl.forEach(function (s, k) { s.classList.toggle("r24-on", k === 0); s.classList.remove("swiper-slide-active", "swiper-slide-next", "swiper-slide-prev", "swiper-slide-duplicate-next", "swiper-slide-duplicate-prev"); });
      if (sl.length > 1) setInterval(function () { sl[i].classList.remove("r24-on"); i = (i + 1) % sl.length; sl[i].classList.add("r24-on"); }, 5000);
    });
    // reseñas de Google
    $$(".wp-gr").forEach(function (g) {
      var wrap = $(".grw-reviews", g), row = $(".grw-row", g); if (!wrap) return;
      function size() { if (!row) return; var w = g.getBoundingClientRect().width, c = w < 510 ? "xs" : w < 750 ? "x" : w < 1000 ? "s" : w < 1450 ? "m" : "l"; row.className = row.className.replace(/\bgrw-row-(xs|x|s|m|l|xl)\b/, "grw-row-" + c); }
      size(); addEventListener("resize", size);
      function step(d) { var it = $(".grw-review", wrap), wd = it ? it.getBoundingClientRect().width : 300; if (d > 0 && wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 4) wrap.scrollTo({ left: 0, behavior: "smooth" }); else wrap.scrollBy({ left: d * wd, behavior: "smooth" }); }
      var hold = false; g.addEventListener("mouseenter", function () { hold = true; }); g.addEventListener("mouseleave", function () { hold = false; });
      setInterval(function () { if (!hold && !document.hidden) step(1); }, 6000);
      $$(".grw-next", g).forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); step(1); }); });
      $$(".grw-prev", g).forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); step(-1); }); });
    });
    // su formulario -> recepción 24 h; no se envía nada
    $$("form.elementor-form").forEach(function (f) {
      f.setAttribute("novalidate", ""); f.removeAttribute("action");
      f.addEventListener("submit", function (e) {
        e.preventDefault(); e.stopImmediatePropagation();
        var q = function (s) { var x = f.querySelector(s); return x ? x.value : ""; };
        var name = q('input[name="form_fields[field_e200a53]"]'), tel = q('input[type=tel]'), email = q('input[type=email]'), msg = q('textarea');
        var serv = $$('input[type=checkbox]:checked', f).map(function (c) { return c.value; });
        var err = $(".r24-form-err", f);
        if (!err) { err = document.createElement("div"); err.className = "r24-form-err"; err.setAttribute("role", "alert"); var sb = f.querySelector('button[type=submit]'); (sb && sb.closest(".elementor-field-group") || f).appendChild(err); }
        if (!name.trim() && !tel.replace(/\D/g, "")) { err.textContent = ES ? "Escribe al menos tu nombre o tu teléfono." : "Please enter at least your name or phone."; return; }
        err.textContent = "";
        var btn = f.querySelector('button[type=submit]'), bt = btn && btn.querySelector(".elementor-button-text"), old = bt ? bt.textContent : "";
        if (bt) { bt.textContent = ES ? "✓ ¡Recibido! Te contestamos en el chat" : "✓ Received! We're replying in the chat"; btn.classList.add("r24-sent"); }
        setTimeout(function () { if (bt) { bt.textContent = old; btn.classList.remove("r24-sent"); } f.reset(); }, 3500);
        if (window.R24) window.R24.fromForm({ name: name, tel: tel, email: email, msg: msg, servicios: serv });
      }, true);
    });
  });
})();
