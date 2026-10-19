/* r24/star-ui.js — reemplazo mínimo (sin React) de lo interactivo de www.thestarautoservice.com en la copia estática de la demo:
   menús desplegables de escritorio, menú móvil con sus acordeones (su marcado, capturado abierto), barra «Llama al» que aparece al bajar
   en el celular y el estado «Open · until …» de la barra superior (con su horario publicado: L-V 8:00-18:30, S 8:00-16:00, D cerrado; hora de Texas). */
(function () {
  "use strict";
  var HRS = { 1: [480, 1110], 2: [480, 1110], 3: [480, 1110], 4: [480, 1110], 5: [480, 1110], 6: [480, 960], 0: null };
  var D3 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function hm(m) { var h = Math.floor(m / 60), mm = ("0" + (m % 60)).slice(-2); return (h % 12 || 12) + ":" + mm + (h >= 12 ? " PM" : " AM"); }
  function now() {
    var f = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false });
    var o = {}; f.formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    return { dow: D3.indexOf(o.weekday), min: (+o.hour % 24) * 60 + +o.minute };
  }
  function status() {
    var n = now(), r = HRS[n.dow];
    if (r && n.min >= r[0] && n.min < r[1]) return { open: true, t: "Open · until " + hm(r[1]) };
    for (var i = 0; i < 8; i++) { var d = (n.dow + i) % 7, x = HRS[d]; if (x && (i > 0 || n.min < x[0])) return { open: false, t: "Closed · opens " + (i === 0 ? "" : i === 1 ? "tomorrow " : D3[d] + " ") + hm(x[0]) }; }
    return { open: false, t: "Closed" };
  }
  function ready(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }
  ready(function () {
    // estado abierto/cerrado de la barra superior
    var dot = document.querySelector("header .text-emerald .bg-emerald");
    if (dot) { var sp = dot.parentNode, s = status(); sp.lastChild.textContent = s.t; if (!s.open) { sp.style.color = "#8a3b12"; dot.style.background = "#c2410c"; } sp.setAttribute("data-r24-status", s.open ? "open" : "closed"); }
    // desplegables de escritorio
    var drops = [].slice.call(document.querySelectorAll('header nav .relative > button[aria-haspopup="true"]'));
    function setDrop(b, on) {
      var p = b.parentNode.querySelector(":scope > div.absolute.mt-2, :scope > div.absolute:last-child"); if (!p) return;
      b.setAttribute("aria-expanded", on ? "true" : "false");
      p.style.opacity = on ? "1" : ""; p.style.scale = on ? "1" : ""; p.style.pointerEvents = on ? "auto" : "";
      var ch = b.querySelector("svg"); if (ch) ch.style.transform = on ? "rotate(180deg)" : "";
      [].forEach.call(p.querySelectorAll("a[tabindex]"), function (a) { a.tabIndex = on ? 0 : -1; });
    }
    drops.forEach(function (b) {
      var w = b.parentNode, t;
      w.addEventListener("mouseenter", function () { clearTimeout(t); drops.forEach(function (o) { if (o !== b) setDrop(o, false); }); setDrop(b, true); });
      w.addEventListener("mouseleave", function () { t = setTimeout(function () { setDrop(b, false); }, 120); });
      b.addEventListener("click", function (e) { e.preventDefault(); setDrop(b, b.getAttribute("aria-expanded") !== "true"); });
    });
    document.addEventListener("click", function (e) { if (!e.target.closest || !e.target.closest("header nav .relative")) drops.forEach(function (b) { setDrop(b, false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { drops.forEach(function (b) { setDrop(b, false); }); closeMenu(); } });
    // menú móvil
    var tpl = document.getElementById("r24-mobile-menu"), hb = document.querySelector('header button[aria-controls="mobile-menu"]'), menu = null;
    var ICON_MENU = hb ? hb.innerHTML : "", ICON_X = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
    var es = (document.documentElement.lang || "").slice(0, 2) === "es";
    function closeMenu() { if (!menu) return; menu.remove(); menu = null; document.body.style.overflow = ""; if (hb) { hb.setAttribute("aria-expanded", "false"); hb.setAttribute("aria-label", es ? "Abrir menú" : "Open menu"); hb.innerHTML = ICON_MENU; } }
    function openMenu() {
      if (!tpl || menu) return;
      menu = tpl.content.firstElementChild.cloneNode(true); tpl.parentNode.insertBefore(menu, tpl);
      var hdr = document.querySelector("header.sticky"); if (hdr) menu.style.top = Math.max(0, Math.round(hdr.getBoundingClientRect().bottom)) + "px"; // la franja de la demo empuja la cabecera
      document.body.style.overflow = "hidden"; hb.setAttribute("aria-expanded", "true"); hb.setAttribute("aria-label", es ? "Cerrar menú" : "Close menu"); hb.innerHTML = ICON_X;
      // acordeones: mismos enlaces que los desplegables de escritorio, en el mismo orden
      var lists = drops.map(function (b) { return b.parentNode.querySelectorAll("ul a"); });
      [].forEach.call(menu.querySelectorAll("nav > div > button[aria-expanded]"), function (ab, k) {
        ab.addEventListener("click", function () {
          var on = ab.getAttribute("aria-expanded") !== "true", sub = ab.parentNode.querySelector(".r24-mm-sub");
          ab.setAttribute("aria-expanded", on ? "true" : "false"); var ch = ab.querySelector("svg"); if (ch) ch.style.transform = on ? "rotate(180deg)" : "";
          if (!on) { if (sub) sub.remove(); return; }
          sub = document.createElement("ul"); sub.className = "r24-mm-sub";
          [].forEach.call(lists[k] || [], function (a) { var li = document.createElement("li"), c = a.cloneNode(true); c.removeAttribute("class"); c.removeAttribute("role"); c.removeAttribute("tabindex"); li.appendChild(c); sub.appendChild(li); });
          var all = drops[k] && drops[k].parentNode.querySelector(".border-t a"); if (all) { var li2 = document.createElement("li"), c2 = all.cloneNode(true); c2.removeAttribute("class"); c2.removeAttribute("tabindex"); c2.style.fontWeight = "800"; li2.appendChild(c2); sub.appendChild(li2); }
          ab.parentNode.appendChild(sub);
        });
      });
      menu.addEventListener("click", function (e) { var a = e.target.closest("a"); if (a) closeMenu(); });
    }
    if (hb && tpl) hb.addEventListener("click", function (e) { e.preventDefault(); if (menu) closeMenu(); else openMenu(); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1280) closeMenu(); });
    // barra «Llama al» del celular: aparece al bajar (se puede cerrar)
    var bar = document.querySelector("body > div.md\\:hidden.fixed.inset-x-0.bottom-0"), barOff = false;
    if (bar) {
      var x = bar.querySelector("button"); if (x) x.addEventListener("click", function () { barOff = true; bar.style.translate = ""; });
      var onS = function () { bar.style.translate = (!barOff && window.scrollY > 600) ? "0 0" : ""; };
      window.addEventListener("scroll", onS, { passive: true }); onS();
    }
    // sombra de la cabecera al bajar
    var hd = document.querySelector("header.sticky");
    if (hd) { var sh = function () { hd.style.boxShadow = window.scrollY > 8 ? "0 1px 0 rgba(0,0,0,.06), 0 8px 24px -12px rgba(0,0,0,.18)" : ""; }; window.addEventListener("scroll", sh, { passive: true }); sh(); }
  });
})();
