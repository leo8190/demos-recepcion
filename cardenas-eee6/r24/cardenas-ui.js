/* Demo Cardenas Transmission Corp.: reemplaza lo que en su web hace el JavaScript de WordPress/Divi (la copia es HTML estático, sin sus scripts):
   - menú del celular (Divi .mobile_nav), caja lateral «Need Help?» (su avanti-custom-scripts.js), botón «subir» (Scroll Top), reseñas (Trustindex) en fila deslizable;
   - logo del celular: su web muestra ahí el logo de ejemplo de la plantilla («X LOGO», logo-dark-x.png); en la demo va su logo real;
   - su pop-up «Get Your Free Estimate» (Popup Maker): en su web se abre solo a los 10 s, sin recordar que ya lo cerró, y en el celular tapa ~95 % de la
     pantalla con campos sin rótulo visible (rótulos blancos sobre fondo blanco). En la demo, a los 10 s aparece una tarjeta chica que no tapa la web
     (se puede cerrar y no vuelve en la visita) con «Presupuesto por chat» y «Usar el formulario»; el formulario abre en el pop-up, ahora con rótulos y a medida de la pantalla;
   - sus formularios (pop-up, Contact Us, Contacto) le pasan el pedido a la recepción 24 h (en la demo no se envía nada a ningún lado). */
(function () {
  "use strict";
  var ES = document.documentElement.lang === "es";
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function ready(f) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", f); else f(); }
  ready(function () {
    // menú del celular (Divi)
    $$(".mobile_nav").forEach(function (nav) {
      var bar = $(".mobile_menu_bar", nav), ul = $(".et_mobile_menu", nav);
      if (!bar || !ul) return;
      ul.style.display = "none";
      bar.setAttribute("role", "button"); bar.setAttribute("tabindex", "0"); bar.setAttribute("aria-label", ES ? "Menú" : "Menu");
      function tg() { var op = nav.classList.contains("closed"); nav.classList.toggle("closed", !op); nav.classList.toggle("opened", op); ul.style.display = op ? "block" : "none"; document.documentElement.classList.toggle("r24-menu-open", op); }
      bar.addEventListener("click", function (e) { e.preventDefault(); tg(); });
      bar.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tg(); } });
    });
    // logo del celular: el de la plantilla («X LOGO») -> su logo real
    var mv = $(".et_pb_menu__logo img, img.et_multi_view__hover_selector");
    function logo() { if (!mv) return; var tab = innerWidth <= 980; mv.classList.toggle("et_multi_view_hidden_image", !tab); if (tab && !mv.getAttribute("src")) mv.setAttribute("src", mv.getAttribute("data-r24-src")); }
    if (mv) { logo(); addEventListener("resize", logo); }
    // caja «Need Help?»
    $$(".slide-in-label-column-v3").forEach(function (c) { c.addEventListener("click", function () { $$(".slide-in-section-v3").forEach(function (s) { s.classList.toggle("show-slide-in-v3"); }); }); });
    $$(".close-slide-in-v3 a, a[href='#close']").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); $$(".slide-in-section-v3").forEach(function (s) { s.classList.remove("show-slide-in-v3"); }); }); });
    // botón «subir»
    var up = document.getElementById("scrollUp");
    if (!up) { up = document.createElement("a"); up.id = "scrollUp"; up.href = "#top"; up.style.cssText = "position:fixed;z-index:2147483646;display:none"; up.innerHTML = '<span class="scroll-top"><svg width="36px" height="36px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path style="fill:none;stroke:#fff;stroke-linecap:round;stroke-width:1.5px" d="M16.78,14.2l-4.11-4.11a1,1,0,0,0-1.41,0l-4,4"/></g></svg></span>'; document.body.appendChild(up); }
    up.setAttribute("aria-label", ES ? "Subir" : "Back to top");
    up.addEventListener("click", function (e) { e.preventDefault(); scrollTo({ top: 0, behavior: "smooth" }); });
    function onScroll() { up.style.display = scrollY > 300 ? "block" : "none"; }
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    // reseñas (Trustindex): columnas según el ancho, fila deslizable con sus flechas
    $$(".ti-widget-container").forEach(function (w) {
      var wrap = $(".ti-reviews-container-wrapper", w);
      function cols() { var n = innerWidth >= 1024 ? 3 : (innerWidth >= 700 ? 2 : 1); w.className = w.className.replace(/\bti-col-\d\b/, "ti-col-" + n); }
      cols(); addEventListener("resize", cols);
      if (!wrap) return;
      function step(d) { var it = $(".ti-review-item", wrap); wrap.scrollBy({ left: d * (it ? it.getBoundingClientRect().width : 300), behavior: "smooth" }); }
      $$(".ti-next", w).forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); step(1); }); });
      $$(".ti-prev", w).forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); step(-1); }); });
    });
    // sus formularios (Ninja Forms) -> recepción 24 h; no se envía nada
    $$(".nf-form-cont form").forEach(function (f) {
      var isPop = !!f.closest(".pum");
      f.setAttribute("novalidate", "");
      f.addEventListener("submit", function (e) {
        e.preventDefault(); e.stopImmediatePropagation();
        var q = function (s) { var x = f.querySelector(s); return x ? x.value : ""; };
        var tel = q('input[type=tel]'), name = q('.textbox-container input[type=text]'), email = q('input[type=email]'), msg = q('textarea');
        var err = $(".r24-form-err", f);
        if (!err) { err = document.createElement("div"); err.className = "r24-form-err"; err.setAttribute("role", "alert"); var sb = f.querySelector('input[type=submit]'); (sb && sb.closest(".nf-field-container") || f).appendChild(err); }
        if (!name.trim() && !tel.replace(/\D/g, "")) { err.textContent = ES ? "Escriba al menos su nombre o su teléfono." : "Please enter at least your name or phone."; return; }
        err.textContent = "";
        var btn = f.querySelector('input[type=submit]'), old = btn ? btn.value : "";
        if (btn) { btn.value = ES ? "✓ ¡Recibido! Le contestamos en el chat" : "✓ Received! We're replying in the chat"; btn.classList.add("r24-sent"); }
        setTimeout(function () { if (btn) { btn.value = old; btn.classList.remove("r24-sent"); } f.reset(); }, 3500);
        if (isPop) closePop();
        if (window.R24) window.R24.fromForm({ name: name, tel: tel, email: email, msg: msg, src: isPop ? "Get Your Free Estimate" : (ES ? "Ponerse en contacto" : "Get in Touch") });
      }, true);
    });
    // banderas de GTranslate (fixed top:15px): que no tapen la franja de la demo
    var gtw = $(".gt_switcher_wrapper"), strip = $(".r24-strip");
    function gtPos() { if (!gtw || !strip) return; var b = strip.getBoundingClientRect().bottom; gtw.style.setProperty("top", Math.max(15, Math.round(b) + 8) + "px", "important"); }
    gtPos(); window.addEventListener("scroll", gtPos, { passive: true }); window.addEventListener("resize", gtPos);
    // su pop-up «Get Your Free Estimate»
    var pop = document.getElementById("pum-340137"), card = document.getElementById("r24-est");
    function openPop() { if (!pop) return; pop.style.display = "block"; var c = $(".pum-container", pop); if (c) c.style.display = "block"; pop.classList.add("r24-pop-open"); document.documentElement.classList.add("r24-pop"); if (card) card.classList.remove("r24-show"); var i = $("input[type=text]", pop); if (i) setTimeout(function () { i.focus(); }, 60); }
    function closePop() { if (!pop) return; pop.style.display = "none"; pop.classList.remove("r24-pop-open"); document.documentElement.classList.remove("r24-pop"); }
    window.R24POP = { open: openPop, close: closePop };
    if (pop) {
      $$(".pum-close", pop).forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); closePop(); }); });
      pop.addEventListener("click", function (e) { if (e.target === pop) closePop(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePop(); });
    }
    if (card) {
      var KEY = "r24-cardenas-est", delay = +((location.search.match(/[?&]r24pd=(\d+)/) || [])[1] || 10000), seen = false;
      try { seen = sessionStorage.getItem(KEY) === "1"; } catch (e) {}
      function seenNow() { try { sessionStorage.setItem(KEY, "1"); } catch (x) {} }
      $$("[data-r24-form]", card).forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); seenNow(); openPop(); }); });
      $$("[data-r24-open]", card).forEach(function (b) { b.addEventListener("click", function () { seenNow(); card.classList.remove("r24-show"); }); });
      $(".r24-est-x", card).addEventListener("click", function (e) { e.preventDefault(); card.classList.remove("r24-show"); try { sessionStorage.setItem(KEY, "1"); } catch (x) {} });
      if (!seen) setTimeout(function () { if (!document.documentElement.classList.contains("r24-panel-open") && !document.documentElement.classList.contains("r24-pop")) card.classList.add("r24-show"); }, delay);
    }
  });
})();
