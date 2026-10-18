/* Copia estática de clinicadentalruzafa.es (123inventatuweb/BaseKit) — DEMO privada.
   Sustituye lo poco interactivo que hacían los scripts de BaseKit (eliminados: analítica, cookies, editor):
   menú móvil, carrusel de la home y destinos de los botones del constructor. */
(function () {
  "use strict";
  function ready(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }
  ready(function () {
    // Menú móvil (mismo comportamiento que su script en línea: alterna body.navigation-open)
    document.querySelectorAll(".navigation-toggle").forEach(function (b) {
      b.addEventListener("click", function () { document.body.classList.toggle("navigation-open"); });
    });
    // Botones del constructor con destino interno
    document.addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("[data-href]");
      if (b) { ev.preventDefault(); location.href = b.getAttribute("data-href"); }
    });
    // Carrusel (responsiveslideshow): flechas + avance automático cada 6 s
    document.querySelectorAll(".responsiveslideshow").forEach(function (ss) {
      var items = ss.querySelectorAll(".slide-item"); if (items.length < 2) return;
      var i = 0; [].forEach.call(items, function (it, k) { if (it.classList.contains("current")) i = k; });
      function go(n) { items[i].classList.remove("current"); i = (n + items.length) % items.length; items[i].classList.add("current"); }
      var prev = ss.querySelector(".js-btn-prev"), next = ss.querySelector(".js-btn-next");
      if (prev) prev.addEventListener("click", function (e) { e.preventDefault(); go(i - 1); });
      if (next) next.addEventListener("click", function (e) { e.preventDefault(); go(i + 1); });
      setInterval(function () { if (!document.hidden) go(i + 1); }, 6000);
    });
  });
})();
