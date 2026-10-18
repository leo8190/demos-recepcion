/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Clínica Dental Medics Dr. Ferrer (Madrid Chamberí + Murcia) — DEMO privada.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Todas las respuestas salen de textos publicados en www.dentalmedics.es (oct. 2026). */
(function () {
  "use strict";
  var C = {
    nombre: "Clínica Dental Medics Dr. Ferrer",
    telMad: "91 441 80 42", telMadh: "+34914418042",
    telMur: "968 13 50 89", telMurh: "+34968135089",
    wa: "648 41 80 42", wah: "+34648418042",
    email: "clinica@dentalmedics.es",
    dirMad: "Calle de Ramiro II, 10, Chamberí, 28003 Madrid",
    mapsMad: "https://maps.app.goo.gl/84JevVfX32156RaXA",
    dirMur: "C. Donantes de Sangre, 3, 30007 Santiago y Zaraíche, Murcia",
    mapsMur: "https://maps.app.goo.gl/WRpfXGEGWEhWw3Ct9"
  };
  // Horario publicado (schema + páginas de sedes): L–V 10:00–20:00 · S y D cerrado. (0 = domingo)
  var H = { 1: [[600, 1200]], 2: [[600, 1200]], 3: [[600, 1200]], 4: [[600, 1200]], 5: [[600, 1200]], 0: [], 6: [] };
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var HORARIO_TXT = "• Lunes a viernes: 10:00–20:00 (Madrid y Murcia)\n• Sábados y domingos: cerrado";

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

  var CITA_CHIP = { t: "Pedir cita", a: "cita" };
  var LLAMADA_CHIP = { t: "📲 Que me llamen", a: "llamada" };
  var AVISO = "🔔 El equipo de la clínica recibe este pedido al instante (en esta demo no se envía nada).";
  var lastQ = "";
  var WA_CHIP = { t: "WhatsApp " + C.wa, url: "https://wa.me/34648418042" };
  var TEL_MAD = { t: "Llamar Madrid " + C.telMad, tel: C.telMadh };
  var TEL_MUR = { t: "Llamar Murcia " + C.telMur, tel: C.telMurh };
  var KB = [
    { id: "valoracion", k: ["primera visita", "primera consulta", "valoracion", "diagnostico", "gratis", "gratuita", "sin coste", "revision gratis", "presupuesto", "segunda opinion", "radiografia gratis"],
      a: "Sí: la 1ª visita es gratuita y sin compromiso. Incluye valoración por el odontólogo, radiografía panorámica y presupuesto / plan de tratamiento.\n(Publicado en su página de Precios: esos tres conceptos figuran como «Gratuito».)", c: [CITA_CHIP, { t: "Facilidades de pago", q: "financiación" }] },
    { id: "financiacion", k: ["financiacion", "financiais", "financiar", "plazos", "pagar a plazos", "cuotas", "al mes", "mensual", "pago aplazado", "facilidades pago"],
      a: "Sí: facilitan el pago con planes de financiación sin intereses hasta 24 meses (o plazos más amplios). En Invisalign publican financiación desde 74 €/mes.\nEl detalle de cuotas lo cierran con el presupuesto tras la 1ª visita gratuita.", c: [CITA_CHIP, { t: "Precios Invisalign", q: "precio invisalign" }] },
    { id: "precio_orto", k: ["precio ortodoncia", "cuesta ortodoncia", "precio invisalign", "cuesta invisalign", "vale invisalign", "precio alineador", "invisalign 12", "invisalign 18", "invisalign 24"],
      a: "Invisalign (precios publicados en Precios / Tarifas):\n• 12 meses: 3.700 € (estudio/ClinCheck 200 € + alineadores 3.500 €; revisiones y retenedores finales incluidos)\n• 18 meses: 4.200 €\n• 24 meses: 4.700 €\nFinanciación publicada desde 74 €/mes.\nBrackets metálicos (total publicado): desde 2.400 € (12 meses) / 2.700 € (18) / 3.000 € (24).\nQué modalidad te corresponde lo decide el especialista en la 1ª visita gratuita.", c: [CITA_CHIP] },
    { id: "precio_implante", k: ["precio implante", "cuesta implante", "vale implante", "precio implantes"],
      a: "Precios de implante (unidad, publicados en Precios / Implantes):\n• Implante JDentalCare: 380 €\n• Implante Nobel Biocare: 680 €\n• Implante Straumann: 680 €\nLas coronas y complementos (injerto, elevación de seno, etc.) tienen tarifas aparte en la misma página. La 1ª valoración es gratuita.", c: [CITA_CHIP, { t: "Ver más tratamientos", q: "implantes" }] },
    { id: "precio_otro", k: ["precio carilla", "cuesta carilla", "precio blanqueamiento", "precio limpiez", "cuesta limpiez", "precio endodoncia", "precio bracket", "precio protesis", "precio extraccion", "tarifa"],
      a: "Tienen una página completa de Precios/Tarifas. Algunos ejemplos publicados:\n• Blanqueamiento LED: 250 € · en casa: 350 € · combinado: 450 €\n• Carillas cerámicas / zirconio: 500 € por diente · microcarillas composite: 250 €\n• Limpieza / otros: te los confirman en la 1ª visita gratuita si no los ves en la lista.\nSi me dices el tratamiento concreto (implante, Invisalign…) te doy la cifra publicada.", c: [CITA_CHIP, { t: "Precios Invisalign", q: "precio invisalign" }, { t: "Precio implante", q: "precio implante" }] },
    { id: "implantes", k: ["implante", "implantes", "dientes fijos", "falta diente", "perdido diente", "reponer diente", "carga inmediata", "injerto", "poco hueso", "nobel", "straumann"],
      a: "Sí. Hacen implantes (unitario, carga inmediata, injerto, puentes y prótesis sobre implantes) en Madrid y Murcia. En el equipo: Dr. Jorge Ferrer y Dra. Paloma Ferrer (implantología), bajo la dirección del Dr. Francisco Ferrer (desde 1984).\nUsa marcas publicadas: JDentalCare, Nobel Biocare y Straumann. La valoración de implantes es gratuita.", c: [CITA_CHIP, { t: "¿Cuánto cuesta?", q: "precio implante" }] },
    { id: "ortodoncia", k: ["ortodoncia", "bracket", "brackets", "alinear dientes", "dientes torcidos", "retenedor", "ortodoncia adulto", "ortodoncia infantil"],
      a: "Hacen ortodoncia: Invisalign, brackets metálicos y estéticos, ortodoncia infantil y retenedores. La Dra. Paloma Ferrer figura como especialista en ortodoncia / Invisalign.\nLa 1ª visita es gratuita.", c: [CITA_CHIP, { t: "Invisalign", q: "invisalign" }, { t: "Precios", q: "precio invisalign" }] },
    { id: "invisalign", k: ["invisalign", "ortodoncia invisible", "alineador", "alineadores", "invisible", "sin brackets", "clincheck"],
      a: "Sí, son especialistas en Invisalign (alineadores transparentes a medida con planificación ClinCheck). Lo lleva la Dra. Paloma Ferrer.\nPrecios totales publicados: 3.700 € (12 meses), 4.200 € (18) o 4.700 € (24), con financiación desde 74 €/mes.", c: [{ t: "Ver precios", q: "precio invisalign" }, CITA_CHIP] },
    { id: "estetica", k: ["estetica", "carilla", "carillas", "blanqueamiento", "blanquear", "dientes blancos", "composite", "porcelana", "sonrisa", "bichectomia"],
      a: "En estética publican, entre otros: carillas (composite 250 € / cerámica o zirconio 500 € por diente), blanqueamiento LED 250 €, en casa 350 €, combinado 450 €, y bichectomía 900 €.\nTe lo confirman con presupuesto tras la 1ª visita gratuita.", c: [CITA_CHIP] },
    { id: "sedacion", k: ["sedacion", "sedacion consciente", "dormir", "anestesia", "miedo", "fobia", "panico", "ansiedad", "nervios"],
      a: "Publican sedación consciente (desde 980 € en su tabla de tarifas de servicios asociados a implantes). En la 1ª visita gratuita te explican si te conviene y el detalle del presupuesto.", c: [CITA_CHIP] },
    { id: "urgencia", k: ["urgencia", "urgente", "dolor", "duele muela", "me duele", "emergencia", "roto diente", "partido diente", "flemon", "hinchazon", "protesis rota"],
      a: "Si tienes dolor, lo más rápido es llamar a Madrid 91 441 80 42, a Murcia 968 13 50 89 o por WhatsApp al 648 41 80 42.\nMientras tanto: tu analgésico habitual, frío por fuera y evita lo muy frío, caliente o dulce. No te automediques con antibióticos.", urg: true, c: [TEL_MAD, TEL_MUR, WA_CHIP, CITA_CHIP] },
    { id: "general", k: ["limpieza", "limpieza dental", "revision", "revisiones", "empaste", "empastes", "caries", "chequeo", "sarro", "higiene"],
      a: "Sí: odontología general, limpiezas, empastes, revisiones… La 1ª visita (valoración + panorámica + presupuesto) es gratuita. El precio concreto de la limpieza no lo cito si no está aislado en la web; te lo dan en clínica.", c: [CITA_CHIP, TEL_MAD] },
    { id: "periodoncia", k: ["encia", "encias", "sangran", "sangrado", "periodoncia", "piorrea", "gingivitis", "periodontitis"],
      a: "Sí, tienen sección de periodoncia (encías). Si te sangran las encías conviene valorarlo pronto. El diagnóstico va en la 1ª visita gratuita.", c: [CITA_CHIP] },
    { id: "endodoncia", k: ["endodoncia", "matar nervio", "conductos", "nervio diente"],
      a: "Sí, hacen endodoncias. Te valoran en la 1ª visita gratuita y te dan presupuesto sin compromiso.", c: [CITA_CHIP] },
    { id: "cirugia", k: ["extraccion", "sacar muela", "muela juicio", "muelas juicio", "cirugia", "quitar diente"],
      a: "Sí, cirugía oral: extracciones (incluida muela del juicio; publican tarifas desde 90 € simple / 170–210 € según inclusión), alargamiento coronario, etc. La valoración previa es gratuita.", c: [CITA_CHIP] },
    { id: "protesis", k: ["protesis", "dentadura", "dentadura postiza", "removible", "puente", "corona"],
      a: "Hacen prótesis fijas y removibles, coronas y puentes (con y sin implantes). Hay tarifas publicadas en Precios; te orientan tras la 1ª visita gratuita.", c: [CITA_CHIP] },
    { id: "horario", k: ["horario", "hora abris", "abris", "abierto", "cerrais", "cierra", "a que hora", "tarde", "mañana abierto"],
      a: "Horario (ambas sedes):\n" + HORARIO_TXT, now: true, c: [CITA_CHIP] },
    { id: "finde", k: ["sabado", "domingo", "fin semana", "festivo"],
      a: "Los fines de semana la clínica está cerrada. Horario:\n" + HORARIO_TXT + "\n(La web no detalla festivos; confírmalo con recepción si lo necesitas.)", c: [CITA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "como llego", "llegar", "metro", "autobus", "bus", "aparcar", "aparcamiento", "parking", "calle", "mapa", "zona", "chamberi", "madrid", "murcia", "sede", "sedes"],
      a: "Tenéis dos sedes:\n• Madrid (Chamberí): " + C.dirMad + " · tel. " + C.telMad + "\n• Murcia (Santiago y Zaraíche): " + C.dirMur + " · tel. " + C.telMur + "\nHorario en ambas: L–V 10:00–20:00.", c: [{ t: "Maps Madrid", url: C.mapsMad }, { t: "Maps Murcia", url: C.mapsMur }, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "llamar", "numero", "contacto", "email", "correo", "mail", "whatsapp", "hablar persona", "recepcion", "humano"],
      a: "Contacto publicado:\n• Madrid: " + C.telMad + "\n• Murcia: " + C.telMur + "\n• WhatsApp: " + C.wa + "\n• Email: " + C.email, c: [TEL_MAD, TEL_MUR, WA_CHIP] },
    { id: "equipo", k: ["franquicia", "cadena", "quien atiende", "doctor", "dentista", "ferrer", "experiencia", "opiniones", "reseñas", "equipo", "años", "comercial", "1984"],
      a: "Clínica familiar desde 1984 (no franquicia), dirigida por el Dr. Francisco Ferrer (médico estomatólogo). En el equipo también: Dr. Jorge Ferrer y Dra. Paloma Ferrer (implantología / ortodoncia), Dra. Amanda Sánchez y Dra. María Munuera (conservadora). Sedes en Madrid Chamberí y Murcia.", c: [CITA_CHIP] },
    { id: "seguros", k: ["seguro", "mutua", "adeslas", "sanitas", "dkv", "asisa", "mapfre", "aseguradora", "seguridad social", "poliza"],
      a: "En la web invitan a pedir una valoración gratuita para comparar con tu póliza dental, pero no listan mutuas concretas. Te lo confirman por teléfono o WhatsApp.", c: [TEL_MAD, WA_CHIP] },
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

  var root, body, input, status, panel, launch, opened = false, fails = 0;
  var flow = null;

  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  function addBot(t, chips, cls) {
    var ty = el("div", "r24-typing", "Escribiendo…"); body.appendChild(ty); scroll();
    setTimeout(function () {
      ty.remove();
      var m = el("div", "r24-msg r24-bot" + (cls ? " " + cls : ""), esc(t).replace(/\b(91 441 80 42|968 13 50 89|648 41 80 42)\b/g, function (x) {
        var href = x.indexOf("648") === 0 ? "https://wa.me/34648418042" : ("tel:+34" + x.replace(/\s/g, ""));
        return '<a href="' + href + '">' + x + "</a>";
      }));
      body.appendChild(m);
      if (chips && chips.length) {
        var w = el("div", "r24-chips");
        chips.forEach(function (c) {
          var b;
          if (c.tel) { b = el("a", "r24-chip", "📞 " + esc(c.t)); b.href = "tel:" + c.tel; }
          else if (c.url) { b = el("a", "r24-chip" + (c.url.indexOf("wa.me") >= 0 ? " r24-wa" : ""), esc(c.t)); b.href = c.url; b.target = "_blank"; b.rel = "noopener"; }
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
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = "🟢 Clínica abierta ahora · Madrid " + C.telMad + " · Murcia " + C.telMur; }
    else { status.className = "r24-status r24-closed"; status.textContent = "🌙 Ahora la clínica está cerrada (abre " + nextOpening(n) + "). Te atiendo igual y dejo tu cita solicitada."; }
  }
  function closedNote() { var n = madridNow(); return isOpen(n) ? "" : "\n\nℹ️ Ahora mismo la clínica está cerrada; abre " + nextOpening(n) + "."; }

  function build() {
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = (window.R24_BASE || "recepcion/") + "recepcion.css"; document.head.appendChild(css);
    var ban = el("div", "r24-demo-banner", "Demo privada preparada para Clínica Dental Medics Dr. Ferrer"); ban.setAttribute("role", "note"); document.body.appendChild(ban);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + (window.R24_BASE || "recepcion/") + 'avatar.svg" alt="Recepcionista"><span>Recepción 24 h</span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", "Abrir la recepción 24 h"); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + (window.R24_BASE || "recepcion/") + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b>Recepción 24 h <span class="r24-online">● en línea</span></b><small>Medics Dr. Ferrer · Madrid y Murcia</small></div><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" placeholder="Escribe tu pregunta…" autocomplete="off" maxlength="300"><button class="r24-send" type="submit">Enviar</button></form><div class="r24-legal">Asistente automático de demostración · tus datos no se envían a ningún sitio</div>';
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
      addBot("¡Hola! 👋 Soy la recepción virtual de Clínica Dental Medics Dr. Ferrer (Madrid Chamberí y Murcia). Te ayudo con citas, precios publicados, horario o cómo llegar.\n¿En qué te ayudo?",
        [CITA_CHIP, { t: "1ª visita gratis", q: "primera visita gratis" }, { t: "Precios Invisalign", q: "precio invisalign" }, { t: "Implantes", q: "implantes" }, { t: "Urgencia", q: "urgencia" }, { t: "Horario y sedes", q: "horario" }]);
    }
    setTimeout(function () { input.focus(); }, 50);
  }

  var TRAT = ["1ª visita gratuita", "Revisión y limpieza", "Implantes", "Invisalign / ortodoncia", "Estética (carillas, blanqueamiento)", "Urgencia / dolor", "Otro"];
  function startCita() {
    flow = { step: "nombre", d: {} };
    addBot("¡Perfecto! Te ayudo a pedir cita en unos pasos. La 1ª visita es gratuita (valoración + panorámica + presupuesto).\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || "Consulta general").slice(0, 120) } };
    addBot("¡Claro! Te llama una persona del equipo de la clínica. Solo necesito dos datos.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
  }
  function ask(step) {
    flow.step = step;
    var n = madridNow();
    if (step === "sede") addBot("Encantados, " + flow.d.nombre + ". ¿En qué sede?", [{ t: "Madrid (Chamberí)", v: "Madrid (Chamberí)", flow: true }, { t: "Murcia", v: "Murcia", flow: true }]);
    else if (step === "tratamiento") addBot("¿Para qué tratamiento es la cita?", TRAT.map(function (t) { return { t: t, v: t, flow: true }; }));
    else if (step === "dia") addBot("¿Qué día te viene mejor? Atendemos de lunes a viernes (10:00–20:00).", nextWorkdays(n, 5).map(function (x) { return { t: x.label, v: x.label, flow: true }; }).concat([{ t: "Lo antes posible", v: "Lo antes posible", flow: true }]));
    else if (step === "franja") addBot("¿Mañana o tarde?", [{ t: "Mañana (10:00–14:00)", v: "Mañana (10:00–14:00)", flow: true }, { t: "Tarde (14:00–20:00)", v: "Tarde (14:00–20:00)", flow: true }, { t: "Me da igual", v: "Mañana o tarde, indiferente", flow: true }]);
    else if (step === "telefono") addBot(flow.d.tipo === "llamada" ? "Perfecto, " + flow.d.nombre + ". ¿A qué teléfono te llaman?" : "Último paso: ¿a qué teléfono te llamamos para confirmarte la cita?");
    else if (step === "resumen") {
      var d = flow.d;
      if (d.tipo === "llamada") { addBot("Revisa tu solicitud de llamada:\n👤 Nombre: " + d.nombre + "\n💬 Consulta: " + d.consulta + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", [{ t: "✅ Confirmar", v: "__ok", flow: true }, { t: "✏️ Corregir", v: "__fix", flow: true }, { t: "Cancelar", v: "cancelar", flow: true }], "r24-sum"); return; }
      addBot("Revisa tu solicitud:\n👤 Nombre: " + d.nombre + "\n📍 Sede: " + d.sede + "\n🦷 Tratamiento: " + d.tratamiento + "\n📅 Día: " + d.dia + "\n🕐 Franja: " + d.franja + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", [{ t: "✅ Confirmar", v: "__ok", flow: true }, { t: "✏️ Corregir", v: "__fix", flow: true }, { t: "Cancelar", v: "cancelar", flow: true }], "r24-sum");
    }
  }
  function flowInput(t) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo)$/.test(n)) { flow = null; addBot("Sin problema, he cancelado la solicitud. ¿Te ayudo con otra cosa?", [CITA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e, t); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot("¿Me dices tu nombre, por favor? (solo el nombre, sin números)"); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" "); if (d.tipo === "llamada") { ask("telefono"); return; } ask("sede"); return;
      case "sede":
        d.sede = /murcia/i.test(t) ? "Murcia" : "Madrid (Chamberí)"; ask("tratamiento"); return;
      case "tratamiento":
        d.tratamiento = t.slice(0, 80);
        if (/urgen|dolor/.test(n)) {
          var tel = /murcia/i.test(d.sede) ? C.telMur : C.telMad;
          addBot("Si tienes mucho dolor, lo más rápido es llamar al " + tel + " o por WhatsApp al " + C.wa + (isOpen(madridNow()) ? " ahora mismo" : " en cuanto abramos (" + nextOpening(madridNow()) + ")") + ". Aun así, dejo tu solicitud preparada.", [TEL_MAD, TEL_MUR, WA_CHIP]);
          setTimeout(function () { ask("dia"); }, 900); return;
        }
        ask("dia"); return;
      case "dia":
        if (/sabado|domingo/.test(n)) { addBot("Los sábados y domingos la clínica está cerrada. ¿Te viene bien algún día de lunes a viernes?"); setTimeout(function () { ask("dia"); }, 500); return; }
        d.dia = t.slice(0, 60); ask("franja"); return;
      case "franja":
        if (/noche|21|22|23/.test(n)) { addBot("Atendemos de 10:00 a 20:00. ¿Mañana o tarde?"); setTimeout(function () { ask("franja"); }, 500); return; }
        d.franja = (/manana/.test(n) && !/igual|tarde/.test(n)) ? "Mañana (10:00–14:00)" : t.slice(0, 60); ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().-]/g, "").replace(/^0034/, "+34");
        if (!/^(\+34)?[6789]\d{8}$/.test(ph)) { addBot("Ese número no me cuadra. Escríbelo con 9 cifras, por ejemplo 612 345 678."); return; }
        var dg = ph.replace(/^\+34/, ""); d.telefono = dg.slice(0, 3) + " " + dg.slice(3, 6) + " " + dg.slice(6); ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|vale|ok|confirmo|confirmar|correcto)/.test(n)) {
          if (d.tipo === "llamada") { addBot("¡Listo, " + d.nombre.split(" ")[0] + "! ✅ El equipo de la clínica recibe tu pedido al instante y te llama al " + d.telefono + "." + closedNote() + "\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [CITA_CHIP, { t: "Otra pregunta", q: "__menu" }]); flow = null; return; }
          var nm2 = d.nombre.split(" ")[0];
          addBot("¡Listo, " + nm2 + "! ✅ Tu solicitud de cita en " + d.sede + " está lista.\nLa recepción te llamará al " + d.telefono + " para confirmarte la cita con el hueco exacto." + closedNote() + "\n\nRecuerda: la 1ª visita es gratuita (valoración + panorámica + presupuesto).\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [{ t: "Cómo llegar", q: "dirección" }, { t: "Otra pregunta", q: "__menu" }]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|no/.test(n)) { flow.d = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : {}; addBot("Vale, empezamos de nuevo. ¿Cómo te llamas?"); flow.step = "nombre"; return; }
        ask("resumen"); return;
    }
  }

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
    addBot("Eso te lo confirma mejor el equipo de la clínica, así tienes el dato exacto. 😊\nEscríbeles por WhatsApp al " + C.wa + ", llama (Madrid " + C.telMad + " · Murcia " + C.telMur + ") o deja tu teléfono y te llaman ellos." + closedNote(), [WA_CHIP, TEL_MAD, TEL_MUR, LLAMADA_CHIP]);
  }
  function handle(t, chip) {
    if (t === "__menu") { addBot("Claro, ¿qué más quieres saber?", [CITA_CHIP, { t: "Precios Invisalign", v: "precio invisalign" }, { t: "Horario", v: "horario" }, { t: "Tratamientos", v: "tratamientos" }]); return; }
    addUser(chip ? chip.t : t);
    if (flow) { flowInput(chip && chip.v ? chip.v : t); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    var n = norm(t);
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot("¡Hola! ¿En qué te puedo ayudar? Puedo darte cita, contarte precios publicados, el horario o las sedes.", [CITA_CHIP, { t: "Precios Invisalign", v: "precio invisalign" }, { t: "Horario", v: "horario" }, LLAMADA_CHIP]); return; }
    if (/tratamientos|que haceis|servicios|especialidades/.test(n)) { addBot("Hacen implantes, prótesis, Invisalign y brackets, estética (carillas, blanqueamiento), endodoncia, periodoncia, limpiezas, cirugía oral y odontopediatría, en Madrid y Murcia. ¿Sobre cuál quieres saber más?", [{ t: "Implantes", v: "implantes" }, { t: "Invisalign", v: "invisalign" }, { t: "Estética", v: "estética" }, CITA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|reserv|agendar/.test(n))) { startCita(); return; }
    if (price) {
      var tbl = [[/invisalign|ortodon|bracket|alinead/, "precio_orto"], [/implante/, "precio_implante"], [/primera|valoracion|consulta|visita|diagnost|revision/, "valoracion"], [/financ|plazo|mes/, "financiacion"]];
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
