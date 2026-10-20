// Demo Roger's Motors: lo mínimo de su web sin sus scripts (main.js: desplazamiento suave con el menú y la navegación lateral que aparece desde
// «About» y marca la sección actual; sin GSAP: el contenido se ve igual, sin la animación de entrada) + la cabecera baja cuando está la franja.
(function () {
  "use strict";
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  var st = document.querySelector('.r24-strip');
  function layout() { if (st) document.documentElement.style.setProperty('--r24-sh', st.offsetHeight + 'px'); }
  layout(); window.addEventListener('resize', layout); window.addEventListener('load', layout);
  $$('.main-nav a, .vertical-nav a, a.btn-call-now[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (!id || id.charAt(0) !== '#') return;
      var t = document.querySelector(id); if (!t) return;
      e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
    });
  });
  var secs = $$('.section'), vn = document.querySelector('.vertical-nav'), items = $$('.vertical-nav .nav-item'), about = document.getElementById('about');
  function onScroll() {
    if (about && vn) vn.style.display = window.scrollY >= about.offsetTop - 200 ? 'flex' : 'none';
    var cur = ''; secs.forEach(function (s) { if (window.scrollY >= s.offsetTop - 200) cur = s.id; });
    items.forEach(function (i) { i.classList.toggle('active', i.getAttribute('data-section') === cur); });
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();
