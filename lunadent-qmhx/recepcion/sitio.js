/* Lunadent (copia estática de su web Hostinger): sustituye lo mínimo del JS original que no se copia.
   - Menú móvil (hamburguesa) abre/cierra el desplegable.
   - Animaciones de entrada: los bloques empiezan con opacity:0 hasta que el JS los marca activos. */
(function () {
  "use strict";
  function ready(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }
  ready(function () {
    /* las imágenes con animación solo tienen regla de "oculto"; el JS original las mostraba: aquí, al activarse */
    var st = document.createElement("style");
    st.textContent = "[data-animation-role=image][data-animation-state=active]{opacity:1!important;transform:none!important;transition:opacity .65s ease .1s,transform .65s ease .1s}";
    document.head.appendChild(st);
    document.querySelectorAll("button.burger").forEach(function (b) {
      b.addEventListener("click", function () {
        var hd = b.closest("header") || document, dd = hd.querySelector(".block-header-layout-mobile__dropdown");
        var open = !b.classList.contains("burger--open");
        b.classList.toggle("burger--open", open);
        if (dd) dd.classList.toggle("block-header-layout-mobile__dropdown--open", open);
      });
    });
    var els = document.querySelectorAll("[data-animation-role], .transition--slide, .transition--fade, .transition--scale");
    function act(e) { e.setAttribute("data-animation-state", "active"); }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { act(x.target); io.unobserve(x.target); } }); }, { rootMargin: "0px 0px -5% 0px" });
      els.forEach(function (e) { io.observe(e); });
      setTimeout(function () { els.forEach(act); }, 4000); /* por si acaso: todo visible a los 4 s */
    } else els.forEach(act);
  });
})();
