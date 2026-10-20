/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Clínica Dental Madrid Sur (Vallecas) — DEMO privada.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Todas las respuestas salen de textos publicados en clinicadentalmadridsur.com (oct. 2026). */
(function () {
  "use strict";
  var C = {
    nombre: "Clínica Dental Madrid Sur",
    tel1: "913 800 158", tel1h: "+34913800158",
    tel2: "601 397 854", tel2h: "+34601397854",
    email: "clinicamadridsur@gmail.com",
    dir: "C/ Villalobos 137, 1ºA · 28018 Madrid (Puente de Vallecas)",
    maps: "https://www.google.com/maps?q=Calle+de+Villalobos+137+28018+Madrid"
  };
  // Horario publicado (página de contacto): L–J 10:30–13:30 y 16:00–20:30 · V 10:30–13:30 y 16:00–20:00 · S y D sin horario publicado (cerrado). (0 = domingo)
  var H = { 1: [[630, 810], [960, 1230]], 2: [[630, 810], [960, 1230]], 3: [[630, 810], [960, 1230]],
            4: [[630, 810], [960, 1230]], 5: [[630, 810], [960, 1200]], 0: [], 6: [] };
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var HORARIO_TXT = "• Lunes a jueves: 10:30–13:30 y 16:00–20:30\n• Viernes: 10:30–13:30 y 16:00–20:00\n• Sábados y domingos: cerrado";

  // ---------- Hora de Madrid (con ?r24now=AAAA-MM-DDTHH:MM para pruebas) ----------
  function madridNow() {
    var q = (location.search.match(/[?&]r24now=([^&]+)/) || [])[1];
    if (q) { var p = decodeURIComponent(q).match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
      if (p) return { y: +p[1], m: +p[2] - 1, d: +p[3], dow: new Date(+p[1], +p[2] - 1, +p[3]).getDay(), min: +p[4] * 60 + +p[5] }; }
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
    var o = {}; f.formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    var y = +o.year, m = +o.month - 1, d = +o.day;
    return { y: y, m: m, d: d, dow: new Date(y, m, d).getDay(), min: (+o.hour % 24) * 60 + +o.minute };
  }
  function hhmm(min) { return Math.floor(min / 60) + ":" + ("0" + (min % 60)).slice(-2); }
  function isOpen(n) { return (H[n.dow] || []).some(function (r) { return n.min >= r[0] && n.min < r[1]; }); }
  function nextOpening(n) {
    for (var i = 0; i < 8; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay();
      var rs = H[dow] || [];
      for (var j = 0; j < rs.length; j++) {
        if (i > 0 || rs[j][0] > n.min) {
          var cuando = i === 0 ? "hoy" : (i === 1 ? "mañana " + DIAS[dow] : "el " + DIAS[dow]);
          return cuando + " a las " + hhmm(rs[j][0]);
        }
      }
    }
    return "";
  }
  function nextWorkdays(n, k) {
    var out = [];
    for (var i = 1; out.length < k && i < 14; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay();
      if ((H[dow] || []).length) out.push({ dow: dow, label: DIAS[dow].charAt(0).toUpperCase() + DIAS[dow].slice(1) + " " + dt.getDate() + " " + MESES[dt.getMonth()] });
    }
    return out;
  }

  // ---------- Normalización y coincidencia flexible ----------
  var STOP = "a al algo algun alguna como con cual cuales de del el en es esta este esto estoy hay la las lo los me mi mis o os para pero por que quiero se si sin su sus te tu tus un una uno unos y ya yo vosotros vuestra vuestro hacer haceis teneis tienen tiene puedo podeis podria saber gustaria hola buenas buenos dias tardes noches favor".split(" ");
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñ€\s]/g, " ").replace(/\s+/g, " ").trim(); }
  function stem(w) { if (w.length > 4) w = w.replace(/(es|s)$/, ""); return w; }
  function toks(s) { return norm(s).split(" ").filter(function (w) { return w && STOP.indexOf(w) < 0; }).map(stem); }
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    var dp = []; for (var i = 0; i <= a.length; i++) { dp[i] = [i]; }
    for (var j = 1; j <= b.length; j++) dp[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return dp[a.length][b.length];
  }
  function tokMatch(k, u) {
    if (k === u) return true;
    if (k.length >= 5 && u.length >= 5 && (u.indexOf(k.slice(0, 5)) === 0 || k.indexOf(u.slice(0, 5)) === 0)) return true;
    if (k.length >= 5) return lev(k, u) <= (k.length >= 8 ? 2 : 1);
    return false;
  }
  function phraseScore(ph, ut) {
    var pt = toks(ph); if (!pt.length) return 0;
    for (var i = 0; i < pt.length; i++) if (!ut.some(function (u) { return tokMatch(pt[i], u); })) return 0;
    return pt.length;
  }

  // ---------- Base de conocimiento (solo datos publicados en la web) ----------
  var CITA_CHIP = { t: "Pedir cita", a: "cita" };
  var LLAMADA_CHIP = { t: "📲 Que me llamen", a: "llamada" };
  var AVISO = "🔔 El equipo de la clínica recibe este pedido al instante (en esta demo no se envía nada).";
  var lastQ = "";
  var WA_CHIP = { t: "Llamar al móvil " + C.tel2, tel: C.tel2h };
  var TEL_CHIP = { t: "Llamar " + C.tel1, tel: C.tel1h };
  var KB = [
    { id: "valoracion", k: ["primera visita", "primera consulta", "valoracion", "diagnostico", "gratis", "gratuita", "sin coste", "revision gratis", "presupuesto", "segunda opinion", "radiografia gratis"],
      a: "Sí: la 1ª visita es gratuita e incluye revisión + radiodiagnóstico.\nNuestro equipo de especialistas hace una valoración completa y te da un presupuesto sin compromiso. Aquí no hay comerciales: te atiende siempre un doctor.", c: [CITA_CHIP, { t: "Facilidades de pago", q: "financiación" }] },
    { id: "financiacion", k: ["financiacion", "financiais", "financiar", "plazos", "pagar a plazos", "cuotas", "al mes", "mensual", "pago aplazado", "facilidades pago"],
      a: "Sí, tenemos facilidades de pago adaptadas a cada caso. La web no publica cuotas concretas, así que no te doy una cifra inventada: te las explican junto al presupuesto, que es sin compromiso tras la 1ª visita gratuita.\nEn Invisalign, el pack de regalo (estudio, radiografías, retenedores y limpieza) vale también si financias.", c: [CITA_CHIP, { t: "Precios Invisalign", q: "precio invisalign" }] },
    { id: "precio_orto", k: ["precio ortodoncia", "cuesta ortodoncia", "precio invisalign", "cuesta invisalign", "vale invisalign", "precio alineador", "invisalign express", "invisalign lite", "invisalign full"],
      a: "Invisalign tiene precio cerrado y todo incluido:\n• Express: 1.490 € (casos muy leves; 7 alineadores + 1 refinamiento)\n• Lite: 2.500 € (casos leves, unos 12–14 meses; 14 alineadores + 2 refinamientos)\n• Full: 3.200 € (la mayoría de casos; alineadores ilimitados y 3 refinamientos en hasta 3 años)\nAdemás te regalamos estudio (150 €), radiografías (100 €) y retenedores (400 €), más una limpieza: hasta 650 € de ahorro, pagando de una vez o financiando.\nQué modalidad te toca lo decide la Dra. Allende Randazzo en la 1ª visita, que es gratis.", c: [CITA_CHIP] },
    { id: "precio_otro", k: ["precio implante", "cuesta implante", "vale implante", "precio carilla", "cuesta carilla", "precio blanqueamiento", "precio limpieza", "cuesta limpieza", "precio endodoncia", "precio bracket", "precio protesis"],
      a: "Ese precio no está publicado en la web porque depende de tu caso, y prefiero no inventármelo.\nLo que sí te puedo decir: la 1ª visita es gratis (revisión + radiodiagnóstico), sales con un presupuesto sin compromiso y hay facilidades de pago.", c: [CITA_CHIP, TEL_CHIP] },
    { id: "implantes", k: ["implante", "implantes", "dientes fijos", "falta diente", "perdido diente", "reponer diente", "cirugia guiada", "tac 3d", "regeneracion osea", "poco hueso"],
      a: "Sí. Los implantes los coloca la directora, la Dra. Mercedes Fernández-Gianotti Pisani, especialista en implantología y periodoncia formada en el Hospital La Paz, con más de 17 años de experiencia.\nAntes de empezar hacemos un estudio con radiografía o TAC 3D y, si hace falta, regeneración ósea o cirugía guiada. La 1ª visita con diagnóstico es gratuita.", c: [CITA_CHIP, { t: "¿Cuánto cuesta?", q: "precio implante" }, { t: "Tengo miedo", q: "sedación" }] },
    { id: "ortodoncia", k: ["ortodoncia", "bracket", "brackets", "alinear dientes", "dientes torcidos", "retenedor", "ortodoncia adulto", "ortodoncia infantil"],
      a: "Hacemos ortodoncia para adultos y niños con la Dra. Allende Randazzo (máster en Ortodoncia y Odontopediatría, University of Mississippi): brackets, ortodoncia infantil e Invisalign.\nEn la 1ª visita gratuita te dice qué opción te conviene.", c: [CITA_CHIP, { t: "Invisalign", q: "invisalign" }] },
    { id: "invisalign", k: ["invisalign", "ortodoncia invisible", "alineador", "alineadores", "invisible", "sin brackets"],
      a: "Sí, Invisalign es uno de nuestros fuertes: lo lleva la Dra. Allende Randazzo, Provider Invisalign Diamond APEX. Son alineadores transparentes a medida que te puedes quitar y poner, también aptos para adolescentes.\nPrecio cerrado desde 1.490 €, sin límite de alineadores, revisiones incluidas y retenedores gratis.", c: [{ t: "Ver precios", q: "precio invisalign" }, CITA_CHIP] },
    { id: "estetica", k: ["estetica", "carilla", "carillas", "blanqueamiento", "blanquear", "dientes blancos", "composite", "porcelana", "sonrisa"],
      a: "En estética dental hacemos carillas y blanqueamiento dental, siempre con un plan a medida tras la 1ª visita gratuita. La web no publica precios de estos tratamientos; te los dan en el presupuesto sin compromiso.", c: [CITA_CHIP] },
    { id: "sedacion", k: ["sedacion", "sedacion consciente", "dormir", "anestesia", "miedo", "fobia", "panico", "ansiedad", "nervios"],
      a: "Lo entendemos muy bien: muchos pacientes nos llegan con miedo. Ofrecemos sedación consciente para quien la necesite, y el trato es cercano y sin prisas; en la 1ª visita solo miramos, te explicamos y decides.", c: [CITA_CHIP] },
    { id: "urgencia", k: ["urgencia", "urgente", "dolor", "duele muela", "me duele", "emergencia", "roto diente", "partido diente", "flemon", "hinchazon", "protesis rota"],
      a: "Si tienes dolor, lo más rápido es llamar al 913 800 158 o al móvil 601 397 854 y te dicen cuándo pueden verte.\nMientras tanto: tu analgésico habitual, frío por fuera y evita lo muy frío, caliente o dulce. No te automediques con antibióticos.", urg: true, c: [TEL_CHIP, WA_CHIP, CITA_CHIP] },
    { id: "general", k: ["limpieza", "limpieza dental", "revision", "revisiones", "empaste", "empastes", "caries", "chequeo", "sarro", "higiene"],
      a: "Sí: revisiones, limpiezas dentales y odontología general. La 1ª visita (revisión + radiodiagnóstico) es gratis; el precio de la limpieza no está publicado en la web, te lo dicen en la clínica.", c: [CITA_CHIP, TEL_CHIP] },
    { id: "periodoncia", k: ["encia", "encias", "sangran", "sangrado", "periodoncia", "piorrea", "gingivitis", "periodontitis"],
      a: "Si te sangran las encías conviene mirarlo pronto. La periodoncia es una de nuestras especialidades (Dra. Pisani y Dr. Miguel Ángel Chaparro, máster en Periodoncia e Implantes por la URJC). El diagnóstico va incluido en la 1ª visita gratuita.", c: [CITA_CHIP] },
    { id: "endodoncia", k: ["endodoncia", "matar nervio", "conductos", "nervio diente"],
      a: "Sí, hacemos endodoncias con la Dra. Cristina Herrero, especializada en endodoncia y miembro de la Asociación Española de Endodoncia. Así se salva el diente en lugar de extraerlo.", c: [CITA_CHIP] },
    { id: "cirugia", k: ["extraccion", "sacar muela", "muela juicio", "muelas juicio", "cirugia", "quitar diente"],
      a: "Sí, hacemos extracciones, incluidas las muelas del juicio, con sedación consciente si la necesitas.", c: [CITA_CHIP] },
    { id: "protesis", k: ["protesis", "dentadura", "dentadura postiza", "removible", "puente", "corona"],
      a: "Hacemos prótesis dentales fijas y removibles. Te valoramos sin coste en la 1ª visita y te damos presupuesto sin compromiso.", c: [CITA_CHIP] },
    { id: "bruxismo", k: ["bruxismo", "apretar dientes", "rechinar", "ferula", "descarga"],
      a: "Sí, tratamos el bruxismo (apretar o rechinar los dientes). En la 1ª visita gratuita vemos el desgaste y te proponemos la solución.", c: [CITA_CHIP] },
    { id: "ninos", k: ["niño", "niños", "hijo", "hija", "hijos", "infantil", "odontopediatria", "bebe", "dientes leche", "pequeño"],
      a: "Sí, atendemos a niños: odontopediatría y ortodoncia infantil con la Dra. Allende Randazzo, especializada en ambas. La 1ª visita es gratis.", c: [CITA_CHIP] },
    { id: "horario", k: ["horario", "hora abris", "abris", "abierto", "cerrais", "cierra", "a que hora", "tarde", "mañana abierto"],
      a: "Nuestro horario:\n" + HORARIO_TXT, now: true, c: [CITA_CHIP] },
    { id: "finde", k: ["sabado", "domingo", "fin semana", "festivo"],
      a: "Los fines de semana la clínica está cerrada. Horario:\n" + HORARIO_TXT + "\n(La web no detalla festivos; si lo necesitas, confírmalo con la recepción.)", c: [CITA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "como llego", "llegar", "metro", "autobus", "bus", "aparcar", "aparcamiento", "parking", "calle", "mapa", "zona"],
      a: "Estamos en " + C.dir + ".\nLa web no detalla metro ni aparcamiento, así que te dejo el mapa para que veas la mejor ruta.", c: [{ t: "Ver en Google Maps", url: C.maps }, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "llamar", "numero", "contacto", "email", "correo", "mail", "whatsapp", "hablar persona", "recepcion", "humano"],
      a: "Puedes contactar así:\n• Teléfono: " + C.tel1 + "\n• Móvil: " + C.tel2 + "\n• Email: " + C.email + "\n(La web no indica WhatsApp.)", c: [TEL_CHIP, WA_CHIP] },
    { id: "equipo", k: ["franquicia", "cadena", "quien atiende", "doctor", "dentista", "pisani", "experiencia", "opiniones", "reseñas", "equipo", "años", "comercial"],
      a: "No somos franquicia: somos una clínica familiar de Vallecas fundada en 1990 por la Dra. Pisani, y hoy la dirige su hija, la Dra. Mercedes Fernández-Gianotti Pisani. El equipo son especialistas (implantes y periodoncia, ortodoncia y odontopediatría, endodoncia) y nunca comerciales. Tenemos 4,7★ con 141 reseñas en Google.", c: [CITA_CHIP] },
    { id: "seguros", k: ["seguro", "mutua", "adeslas", "sanitas", "dkv", "asisa", "mapfre", "aseguradora", "seguridad social"],
      a: "La web de la clínica no indica si trabaja con seguros o mutuas, así que prefiero no darte un dato incorrecto. Te lo confirman en un momento por teléfono.", c: [TEL_CHIP, WA_CHIP] },
    { id: "gracias", k: ["gracias", "vale gracias", "perfecto", "genial", "adios", "hasta luego"],
      a: "¡A ti! Si necesitas algo más, aquí estoy. 😊", c: [CITA_CHIP] }
  ];
  var CITA_K = ["pedir cita", "cita", "reservar", "reserva", "agendar", "pedir hora", "hueco", "turno", "apuntarme", "citarme", "consulta disponible"];

  function bestIntent(text) {
    var ut = toks(text), best = null, bs = 0;
    if (!ut.length) return null;
    KB.forEach(function (e) {
      var s = 0; e.k.forEach(function (ph) { s = Math.max(s, phraseScore(ph, ut)); });
      if (s > bs) { bs = s; best = e; }
    });
    return bs > 0 ? { e: best, s: bs } : null;
  }
  function isPriceQ(n) { return /\b(precio|precios|cuesta|cuestan|cuanto vale|cuanto valen|coste|tarifa|tarifas|€|euros|caro|barato)\b/.test(n); }
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { return phraseScore(ph, ut) > 0; }); }

  // ---------- UI ----------
  var root, body, input, status, panel, launch, opened = false, fails = 0;
  var flow = null; // {step, data}

  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  function addBot(t, chips, cls) {
    var ty = el("div", "r24-typing", "Escribiendo…"); body.appendChild(ty); scroll();
    setTimeout(function () {
      ty.remove();
      var m = el("div", "r24-msg r24-bot" + (cls ? " " + cls : ""), esc(t).replace(/\b(913 800 158|601 397 854)\b/g, function (x) { return '<a href="tel:+34' + x.replace(/\s/g, "") + '">' + x + "</a>"; }));
      body.appendChild(m);
      if (chips && chips.length) {
        var w = el("div", "r24-chips");
        chips.forEach(function (c) {
          var b;
          if (c.tel) { b = el("a", "r24-chip", "📞 " + esc(c.t)); b.href = "tel:" + c.tel; }
          else if (c.url) { b = el("a", "r24-chip", esc(c.t)); b.href = c.url; b.target = "_blank"; b.rel = "noopener"; }
          else { b = el("button", "r24-chip", esc(c.t)); b.type = "button"; b.onclick = function () { w.remove(); handle(c.v || c.q || c.t, c); }; }
          w.appendChild(b);
        });
        body.appendChild(w);
      }
      scroll();
    }, 380);
  }

  function statusText() {
    var n = madridNow();
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = "🟢 Clínica abierta ahora · también puedes llamar al " + C.tel1; }
    else { status.className = "r24-status r24-closed"; status.textContent = "🌙 Ahora la clínica está cerrada (abre " + nextOpening(n) + "). Te atiendo igual y dejo tu cita solicitada."; }
  }
  function closedNote() { var n = madridNow(); return isOpen(n) ? "" : "\n\nℹ️ Ahora mismo la clínica está cerrada; abre " + nextOpening(n) + "."; }

  function build() {
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = (window.R24_BASE || "recepcion/") + "recepcion.css"; document.head.appendChild(css);
    var ban = el("div", "r24-demo-banner", "Demo privada preparada para Clínica Dental Madrid Sur"); ban.setAttribute("role", "note"); document.body.appendChild(ban);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + (window.R24_BASE || "recepcion/") + 'avatar.svg" alt="Recepcionista"><span>Recepción 24 h</span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", "Abrir la recepción 24 h"); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + (window.R24_BASE || "recepcion/") + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b>Recepción 24 h <span class="r24-online">● en línea</span></b><small>Clínica Dental Madrid Sur · Vallecas</small></div><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" placeholder="Escribe tu pregunta…" autocomplete="off" maxlength="300"><button class="r24-send" type="submit">Enviar</button></form><div class="r24-legal">Asistente automático de demostración · tus datos no se envían a ningún sitio</div>';
    document.body.appendChild(panel);
    body = panel.querySelector(".r24-body"); input = panel.querySelector(".r24-in"); status = panel.querySelector(".r24-status");
    launch.onclick = open;
    panel.querySelector(".r24-x").onclick = function () { panel.classList.remove("r24-open"); launch.classList.remove("r24-hide"); };
    panel.querySelector("form").onsubmit = function (ev) { ev.preventDefault(); var t = input.value.trim(); if (!t) return; input.value = ""; handle(t); };
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("[data-r24-open]"); if (a) { ev.preventDefault(); open(); }
    });
  }
  function open() {
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); statusText();
    if (!opened) {
      opened = true;
      addBot("¡Hola! 👋 Soy el asistente virtual con IA de la Clínica Dental Madrid Sur. Te ayudo a pedir cita y a resolver dudas sobre tratamientos, precios publicados, horario o cómo llegar.\n¿En qué te ayudo?",
        [CITA_CHIP, { t: "1ª visita gratis", q: "primera visita gratis" }, { t: "Precios Invisalign", q: "precio invisalign" }, { t: "Implantes", q: "implantes" }, { t: "Urgencia", q: "urgencia" }, { t: "Horario y dirección", q: "horario" }]);
    }
    setTimeout(function () { input.focus(); }, 50);
  }

  // ---------- Flujo de cita ----------
  var TRAT = ["1ª visita gratuita", "Revisión y limpieza", "Implantes", "Invisalign / ortodoncia", "Estética (carillas, blanqueamiento)", "Urgencia / dolor", "Niños", "Otro"];
  function startCita() {
    flow = { step: "nombre", d: {} };
    addBot("¡Perfecto! Te ayudo a pedir cita en 4 pasos. La 1ª visita (revisión + radiodiagnóstico) es gratuita.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || "Consulta general").slice(0, 120) } };
    addBot("¡Claro! Te llama una persona del equipo de la clínica. Solo necesito dos datos.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
  }
  function ask(step) {
    flow.step = step;
    var n = madridNow();
    if (step === "tratamiento") addBot("Encantados, " + flow.d.nombre + ". ¿Para qué tratamiento es la cita?", TRAT.map(function (t) { return { t: t, v: t, flow: true }; }));
    else if (step === "dia") addBot("¿Qué día te viene mejor? Atendemos de lunes a viernes.", nextWorkdays(n, 5).map(function (x) { return { t: x.label, v: x.label, flow: true }; }).concat([{ t: "Lo antes posible", v: "Lo antes posible", flow: true }]));
    else if (step === "franja") {
      var tarde = /viernes/i.test(flow.d.dia) ? "Tarde (16:00–20:00)" : (/lunes|martes|mi[eé]rcoles|jueves/i.test(flow.d.dia) ? "Tarde (16:00–20:30)" : "Tarde (desde las 16:00)");
      addBot("¿Mañana o tarde?", [{ t: "Mañana (10:30–13:30)", v: "Mañana (10:30–13:30)", flow: true }, { t: tarde, v: tarde, flow: true }, { t: "Me da igual", v: "Mañana o tarde, indiferente", flow: true }]);
    }
    else if (step === "telefono") addBot(flow.d.tipo === "llamada" ? "Perfecto, " + flow.d.nombre + ". ¿A qué teléfono te llaman?" : "Último paso: ¿a qué teléfono te llamamos para confirmarte la cita?");
    else if (step === "resumen") {
      var d = flow.d;
      if (d.tipo === "llamada") { addBot("Revisa tu solicitud de llamada:\n👤 Nombre: " + d.nombre + "\n💬 Consulta: " + d.consulta + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", [{ t: "✅ Confirmar", v: "__ok", flow: true }, { t: "✏️ Corregir", v: "__fix", flow: true }, { t: "Cancelar", v: "cancelar", flow: true }], "r24-sum"); return; }
      addBot("Revisa tu solicitud:\n👤 Nombre: " + d.nombre + "\n🦷 Tratamiento: " + d.tratamiento + "\n📅 Día: " + d.dia + "\n🕐 Franja: " + d.franja + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", [{ t: "✅ Confirmar", v: "__ok", flow: true }, { t: "✏️ Corregir", v: "__fix", flow: true }, { t: "Cancelar", v: "cancelar", flow: true }], "r24-sum");
    }
  }
  function flowInput(t) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo)$/.test(n)) { flow = null; addBot("Sin problema, he cancelado la solicitud. ¿Te ayudo con otra cosa?", [CITA_CHIP]); return; }
    // Si en mitad del flujo hacen una pregunta clara, la respondemos y seguimos.
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e, t); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot("¿Me dices tu nombre, por favor? (solo el nombre, sin números)"); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" "); if (d.tipo === "llamada") { ask("telefono"); return; } ask("tratamiento"); return;
      case "tratamiento":
        d.tratamiento = t.slice(0, 80);
        if (/urgen|dolor/.test(n)) { addBot("Si tienes mucho dolor, lo más rápido es llamar al 913 800 158" + (isOpen(madridNow()) ? " ahora mismo" : " en cuanto abramos (" + nextOpening(madridNow()) + ")") + ". Aun así, dejo tu solicitud preparada.", [TEL_CHIP]); setTimeout(function () { ask("dia"); }, 900); return; }
        ask("dia"); return;
      case "dia":
        if (/sabado|domingo/.test(n)) { addBot("Los sábados y domingos la clínica está cerrada. ¿Te viene bien algún día de lunes a viernes?"); setTimeout(function () { ask("dia"); }, 500); return; }
        d.dia = t.slice(0, 60); ask("franja"); return;
      case "franja":
        if (/noche|21|22|23/.test(n)) { addBot("Por la tarde atendemos hasta las 20:30 (de lunes a jueves) o las 20:00 (viernes). ¿Mañana o tarde?"); setTimeout(function () { ask("franja"); }, 500); return; }
        d.franja = (/manana/.test(n) && !/igual|tarde/.test(n)) ? "Mañana (10:30–13:30)" : t.slice(0, 60); ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().-]/g, "").replace(/^0034/, "+34");
        if (!/^(\+34)?[6789]\d{8}$/.test(ph)) { addBot("Ese número no me cuadra. Escríbelo con 9 cifras, por ejemplo 612 345 678."); return; }
        var dg = ph.replace(/^\+34/, ""); d.telefono = dg.slice(0, 3) + " " + dg.slice(3, 6) + " " + dg.slice(6); ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|vale|ok|confirmo|confirmar|correcto)/.test(n)) {
          if (d.tipo === "llamada") { addBot("¡Listo, " + d.nombre.split(" ")[0] + "! ✅ El equipo de la clínica recibe tu pedido al instante y te llama al " + d.telefono + "." + closedNote() + "\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [CITA_CHIP, { t: "Otra pregunta", q: "__menu" }]); flow = null; return; }
          var nm2 = d.nombre.split(" ")[0];
          addBot("¡Listo, " + nm2 + "! ✅ Tu solicitud de cita está lista.\nLa recepción te llamará al " + d.telefono + " para confirmarte la cita" + " con el hueco exacto." + closedNote() + "\n\nRecuerda: la 1ª visita es gratuita e incluye revisión + radiodiagnóstico.\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [{ t: "Cómo llegar", q: "dirección" }, { t: "Otra pregunta", q: "__menu" }]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|no/.test(n)) { flow.d = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : {}; addBot("Vale, empezamos de nuevo. ¿Cómo te llamas?"); flow.step = "nombre"; return; }
        ask("resumen"); return;
    }
  }

  // ---------- Respuestas ----------
  function reply(e, raw) {
    var t = e.a;
    if (e.id === "horario" || e.id === "finde") {
      var nr = norm(raw || ""), dn = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
      for (var di = 0; di < 7; di++) if (nr.indexOf(dn[di]) >= 0) {
        var rr = H[di];
        t = (rr.length ? "El " + DIAS[di] + " abrimos de " + rr.map(function (r) { return hhmm(r[0]) + " a " + hhmm(r[1]); }).join(" y de ") + "." : "El " + DIAS[di] + " la clínica está cerrada.") + "\n\nHorario completo:\n" + HORARIO_TXT;
        break;
      }
    }
    if (e.now) { var n = madridNow(); t += isOpen(n) ? "\n\n🟢 Ahora mismo estamos abiertos." : "\n\n🌙 Ahora mismo estamos cerrados; abrimos " + nextOpening(n) + "."; }
    if (e.urg && !isOpen(madridNow())) t += "\n\n🌙 Ahora la clínica está cerrada (abre " + nextOpening(madridNow()) + "). Si es grave —traumatismo fuerte o hinchazón que dificulta tragar o respirar— no esperes: llama al 112.";
    addBot(t, (e.c || []).map(function (c) { return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    fails++;
    addBot("Eso te lo confirma mejor el equipo de la clínica, así tienes el dato exacto. 😊\nLlámales al " + C.tel1 + " o al móvil " + C.tel2 + ", o deja tu teléfono y te llaman ellos." + closedNote(), [TEL_CHIP, WA_CHIP, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip) {
    if (t === "__menu") { addBot("Claro, ¿qué más quieres saber?", [CITA_CHIP, { t: "Precios Invisalign", v: "precio invisalign" }, { t: "Horario", v: "horario" }, { t: "Tratamientos", v: "tratamientos" }]); return; }
    addUser(chip ? chip.t : t);
    if (flow) { flowInput(chip && chip.v ? chip.v : t); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    var n = norm(t);
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot("¡Hola! ¿En qué te puedo ayudar? Puedo darte cita, contarte precios publicados, el horario o resolver dudas de tratamientos.", [CITA_CHIP, { t: "Precios Invisalign", v: "precio invisalign" }, { t: "Horario", v: "horario" }, LLAMADA_CHIP]); return; }
    if (/tratamientos|que haceis|servicios|especialidades/.test(n)) { addBot("Hacemos implantes (con cirugía guiada), periodoncia, ortodoncia e Invisalign, ortodoncia infantil y odontopediatría, carillas, blanqueamiento, limpieza, endodoncia, prótesis fijas y removibles, extracción de muelas del juicio y bruxismo, con sedación consciente si la necesitas. ¿Sobre cuál quieres saber más?", [{ t: "Implantes", v: "implantes" }, { t: "Invisalign", v: "invisalign" }, { t: "Niños", v: "niños" }, { t: "Encías", v: "periodoncia" }, CITA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|reserv|agendar/.test(n))) { startCita(); return; }
    if (price) {
      var tbl = [[/invisalign|ortodon|bracket|alinead/, "precio_orto"], [/primera|valoracion|consulta|visita|diagnost|revision/, "valoracion"], [/financ|plazo|mes/, "financiacion"]];
      for (var i = 0; i < tbl.length; i++) if (tbl[i][0].test(n)) { reply(KB.filter(function (e) { return e.id === tbl[i][1]; })[0], t); return; }
      reply(KB.filter(function (e) { return e.id === "precio_otro"; })[0], t);
      return;
    }
    if (bi) { fails = 0; reply(bi.e, t); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, isOpen: isOpen, madridNow: madridNow } };
})();
