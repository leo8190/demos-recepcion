/* Marin Auto Repair and Transmissions · demo estática: reemplaza lo poco que en su web hace React (Next.js), con su mismo marcado y clases.
   1) Menú móvil: su panel lateral (capturado abierto en su web, guardado en <template id="r24-mobile-menu">) se agrega al final del body como en su web;
      se cierra con la X, tocando el fondo, con Escape o con el mismo botón; bloquea el scroll mientras está abierto (igual que su web) y oculta
      el botón de la recepción mientras tanto.
   2) Contacto: su botón «Load map / Cargar mapa» muestra un mapa estático con el pin en 13595 Floyd Cir (OpenStreetMap) que abre Google Maps,
      en lugar de cargar el iframe de Google (sin peticiones externas). */
(function () {
  "use strict";
  var es = (document.documentElement.lang || "").slice(0, 2) === "es";
  var BURGER = "M4 7h16M4 12h16M4 17h16", CROSS = "M6 6l12 12M18 6L6 18";
  function menu() {
    var btn = document.querySelector("header button[aria-controls]"), tpl = document.getElementById("r24-mobile-menu");
    if (!btn || !tpl) return;
    var openLbl = btn.getAttribute("aria-label"), closeLbl = es ? "Cerrar menú" : "Close menu", node = null;
    function icon(d) { var p = btn.querySelector("svg path"); if (p) p.setAttribute("d", d); }
    function close() {
      if (!node) return; node.remove(); node = null;
      btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", openLbl); icon(BURGER); document.body.style.overflow = ""; document.documentElement.classList.remove("r24-menu-open");
    }
    function open() {
      node = tpl.content.firstElementChild.cloneNode(true); document.body.appendChild(node);
      btn.setAttribute("aria-expanded", "true"); btn.setAttribute("aria-label", closeLbl); icon(CROSS); document.body.style.overflow = "hidden"; document.documentElement.classList.add("r24-menu-open");
      node.querySelectorAll("button[aria-label]").forEach(function (b) { b.addEventListener("click", close); });
      node.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setTimeout(close, 0); }); });
    }
    btn.addEventListener("click", function () { node ? close() : open(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    window.addEventListener("resize", function () { if (innerWidth >= 1024) close(); });
  }
  function mapa() {
    document.querySelectorAll("button[data-r24-map]").forEach(function (b) {
      b.addEventListener("click", function () {
        var box = b.closest(".h-80"); if (!box) return;
        var a = document.createElement("a");
        a.className = "r24-map-real"; a.href = b.getAttribute("data-r24-map"); a.target = "_blank"; a.rel = "noopener";
        a.setAttribute("aria-label", es ? "Abrir Marin Auto Repair and Transmissions en Google Maps" : "Open Marin Auto Repair and Transmissions in Google Maps");
        a.innerHTML = '<img src="r24/mapa-marin.jpg" alt="' + (es ? "Mapa: 13595 Floyd Cir, Suite 100, Dallas, TX 75243" : "Map: 13595 Floyd Cir, Suite 100, Dallas, TX 75243") + '"><span>📍 ' + (es ? "Abrir en Google Maps" : "Open in Google Maps") + "</span>";
        box.replaceWith(a);
      });
    });
  }
  function init() { menu(); mapa(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
