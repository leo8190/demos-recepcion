// Demo Forrest Collision Center: lo mínimo sin sus scripts (su web solo tiene GTM, el monitor de GoDaddy, la redirección al celular —que en la
// demo va en línea en el <head>— y el formulario de HubSpot, que en la demo no se carga). Aquí: el enlace «Click here for a print format of the
// Forrest Collision Tips» imprime la página (en su web es href="#", no hace nada).
(function () {
  "use strict";
  [].slice.call(document.querySelectorAll('a[data-r24-print]')).forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); try { window.print(); } catch (x) {} });
  });
})();
