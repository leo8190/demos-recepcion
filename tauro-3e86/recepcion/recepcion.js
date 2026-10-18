/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Clínica Dental Tauro (Madrid Carabanchel + Pozuelo de Alarcón) — DEMO privada.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Todas las respuestas salen de textos publicados en www.clinicadentaltauro.com (oct. 2026).
   Lo que la web no publica (sábados, mutuas concretas, precios salvo endodoncia, WhatsApp…) se deriva a la clínica. */
(function () {
  "use strict";
  var C = {
    nombre: "Clínica Dental Tauro",
    telCar: "91 525 02 56", telCarh: "+34915250256",
    telPoz: "91 715 67 55", telPozh: "+34917156755",
    email: "clinicadentaltauro@gmail.com",
    dirCar: "C/ Pingüino, 23 (local), 28047 Madrid — Carabanchel, barrio Eugenia de Montijo",
    mapsCar: "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Dental+Tauro+Calle+Ping%C3%BCino+23+28047+Madrid",
    dirPoz: "Avda. Monteclaro s/n, C. C. Monteclaro, locales 4 y 5 (Ctra. M-515 Pozuelo–Majadahonda, km 2,6), 28223 Pozuelo de Alarcón",
    mapsPoz: "https://www.google.com/maps/search/?api=1&query=Centro+Comercial+Monteclaro+Pozuelo+de+Alarc%C3%B3n"
  };
  // Horario publicado en /contactar/ (0 = domingo). Sábado y domingo: la web no indica horario.
  var HS = {
    car: { 1: [[660, 840], [960, 1200]], 2: [[660, 840], [960, 1200]], 3: [[660, 840], [960, 1200]], 4: [[960, 1200]], 5: [[660, 840], [960, 1200]], 0: [], 6: [] },
    poz: { 1: [[1020, 1200]], 2: [[1020, 1200]], 3: [[1020, 1200]], 4: [], 5: [[1020, 1200]], 0: [], 6: [] }
  };
  var H = HS.car; // Pozuelo queda dentro del horario de Carabanchel: la unión de ambas = Carabanchel
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var HORARIO_TXT = "📍 Carabanchel (91 525 02 56)\n• Lunes, martes, miércoles y viernes: 11:00–14:00 y 16:00–20:00\n• Jueves: 16:00–20:00\n📍 Pozuelo (91 715 67 55)\n• Lunes, martes, miércoles y viernes: 17:00–20:00\n• Jueves: cerrado\nSábados y domingos: la web no indica horario; confírmalo con la clínica.";

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
  function isOpen(n, hs) { return ((hs || H)[n.dow] || []).some(function (r) { return n.min >= r[0] && n.min < r[1]; }); }
  function nextOpening(n, hs) {
    hs = hs || H;
    for (var i = 0; i < 8; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay();
      var rs = hs[dow] || [];
      for (var j = 0; j < rs.length; j++) {
        if (i > 0 || rs[j][0] > n.min) {
          var cuando = i === 0 ? "hoy" : (i === 1 ? "mañana " + DIAS[dow] : "el " + DIAS[dow]);
          return cuando + " a las " + hhmm(rs[j][0]);
        }
      }
    }
    return "";
  }
  function nextWorkdays(n, k, hs) {
    var out = [];
    for (var i = 1; out.length < k && i < 14; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay();
      if (((hs || H)[dow] || []).length) out.push({ dow: dow, label: DIAS[dow].charAt(0).toUpperCase() + DIAS[dow].slice(1) + " " + dt.getDate() + " " + MESES[dt.getMonth()] });
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
  var TEL_CAR = { t: "Llamar Carabanchel " + C.telCar, tel: C.telCarh };
  var TEL_POZ = { t: "Llamar Pozuelo " + C.telPoz, tel: C.telPozh };
  var MAIL_CHIP = { t: "Escribir email", url: "mailto:" + C.email };
  var NO_WA = "La clínica no publica un número de WhatsApp en su web; lo más rápido es el teléfono.";
  var KB = [
    { id: "valoracion", k: ["primera visita", "primera consulta", "consulta gratis", "consulta gratuita", "valoracion", "diagnostico", "gratis", "gratuita", "sin coste", "presupuesto", "segunda opinion"],
      a: "Sí: en su web anuncian la primera consulta gratuita («Ven a conocernos si no has estado ya antes con nosotros. Consulta gratuita»).\nEn esa visita el dentista te valora y te explica el tratamiento y el presupuesto.", c: [CITA_CHIP, { t: "Financiación", q: "financiación" }] },
    { id: "financiacion", k: ["financiacion", "financiais", "financiar", "plazos", "pagar a plazos", "cuotas", "al mes", "mensual", "pago aplazado", "facilidades pago"],
      a: "Sí: la clínica ofrece financiación sin intereses (publicado en su web).\nLas condiciones concretas (plazos y cuotas) no están publicadas: te las confirma la clínica con el presupuesto.", c: [CITA_CHIP, TEL_CAR] },
    { id: "precio_endo", k: ["precio endodoncia", "cuesta endodoncia", "vale endodoncia", "precio conducto", "cuesta conducto", "precio matar nervio"],
      a: "Precio publicado en su página de Endodoncia: entre 150 y 200 €, según la pieza y el número de conductos (1, 2 o más).\nSi vienes por un seguro dental, cada sociedad tiene su propio baremo.", c: [CITA_CHIP, { t: "Seguros / sociedades", q: "seguro" }] },
    { id: "precio_otro", k: ["precio", "precios", "tarifa", "tarifas", "cuanto cuesta", "cuanto vale"],
      a: "El único precio que publican en su web es el de la endodoncia (150–200 € según conductos). Del resto de tratamientos (implantes, ortodoncia, fundas, blanqueamiento…) no hay precios publicados y prefiero no inventármelos.\nLo bueno: la primera consulta es gratuita y ahí te dan el presupuesto, con financiación sin intereses.", c: [CITA_CHIP, TEL_CAR, TEL_POZ] },
    { id: "implantes", k: ["implante", "implantes", "dientes fijos", "falta diente", "perdido diente", "reponer diente", "carga inmediata", "injerto", "poco hueso", "titanio"],
      a: "Sí, hacen implantes dentales en Carabanchel y Pozuelo, con garantía de 5 años en los implantes con los que trabajan.\n• Implantes de titanio; según el caso, se puede colocar el implante el mismo día de la extracción y salir con un diente provisional.\n• Si falta hueso, hacen injerto (normalmente hueso sintético).\n• Están especializados en implantes y prótesis para personas mayores.\nEl tratamiento habitual tiene 2 fases (la prótesis definitiva a los 3–4 meses).", c: [CITA_CHIP, { t: "¿Duele?", q: "implante duele" }, { t: "¿Precio?", q: "precio implante" }] },
    { id: "implante_dolor", k: ["implante duele", "duele implante", "postoperatorio", "dolor implante"],
      a: "Según explican en su web, la colocación de un implante no debe causar dolor; el postoperatorio depende de los cuidados (te dan recomendaciones, como evitar el tabaco las primeras horas). Lo habitual es que no haya molestias importantes.", c: [CITA_CHIP] },
    { id: "endodoncia", k: ["endodoncia", "matar nervio", "conductos", "nervio diente", "tratamiento conducto"],
      a: "Sí, hacen endodoncias (tratamiento de conductos) con limas mecanizadas: una sesión suele durar entre media hora y una hora, y no debe doler.\nPrecio publicado: 150–200 € según el número de conductos. También tratan a niños.", c: [CITA_CHIP, { t: "Me duele una muela", q: "me duele una muela" }] },
    { id: "ortodoncia", k: ["ortodoncia", "bracket", "brackets", "alinear dientes", "dientes torcidos", "alineador", "alineadores", "invisible", "invisalign", "ortodoncia adulto", "mordida"],
      a: "Hacen ortodoncia para niños (desde los 3 años) y adultos: brackets metálicos, brackets estéticos y alineadores invisibles.\nEn Carabanchel la lleva la Dra. Marta Villani, ortodoncista y odontopediatra (más de 30 años en el barrio).\nLa primera consulta es gratuita.", c: [CITA_CHIP, { t: "Ortodoncia infantil", q: "niños" }] },
    { id: "ninos", k: ["niño", "niños", "hijo", "hija", "infantil", "odontopediatria", "pequeño", "bebe"],
      a: "Sí, atienden a niños: la Dra. Marta Villani es especialista en odontopediatría y ortodoncia. Recomiendan una primera revisión de ortodoncia a partir de los 3 años para valorar cómo crecen los dientes y los huesos.", c: [CITA_CHIP] },
    { id: "estetica", k: ["estetica", "carilla", "carillas", "blanqueamiento", "blanquear", "dientes blancos", "composite", "porcelana", "sonrisa", "manchas"],
      a: "En estética dental hacen:\n• Blanqueamiento en clínica (peróxido al 35 %; normalmente basta 1 sesión y, si no se llega al color, repiten otra sin coste extra), en casa con férulas (2–3 semanas) o combinado.\n• Carillas de composite y de porcelana.\n• Coronas de porcelana y de zirconio.\nPrecios: no publicados; te los dan en la primera consulta gratuita.", c: [CITA_CHIP, { t: "Fundas de zirconio", q: "fundas de zirconio" }] },
    { id: "zirconio", k: ["zirconio", "circonio", "funda", "fundas", "corona", "coronas", "puente", "diente roto", "diente partido"],
      a: "Sí: fundas (coronas) de zirconio, sin metal, muy estéticas y resistentes. Se colocan sobre diente o sobre implante, sueltas o unidas en puente. Las hace el Dr. Adrián Cevey en Carabanchel.\nIdeales si el diente está roto, manchado o tiene endodoncia.", c: [CITA_CHIP] },
    { id: "mayores", k: ["mayores", "persona mayor", "abuelo", "abuela", "anciano", "movilidad reducida", "silla ruedas", "discapacidad", "dentadura", "protesis", "dentadura postiza"],
      a: "Sí. La clínica cuida especialmente a las personas mayores (implantes y prótesis) y tiene las instalaciones adaptadas para pacientes con movilidad reducida o discapacidad; el Ayuntamiento les premió por esa labor.", c: [CITA_CHIP, TEL_CAR] },
    { id: "urgencia", k: ["urgencia", "urgente", "dolor", "duele muela", "me duele", "emergencia", "flemon", "hinchazon", "infeccion"],
      a: "Si tienes dolor, llama a la clínica: Carabanchel 91 525 02 56 · Pozuelo 91 715 67 55. La web no publica un servicio de urgencias fuera de horario.\nMientras tanto: tu analgésico habitual, frío por fuera y evita lo muy frío, caliente o dulce. No te automediques con antibióticos.", urg: true, c: [TEL_CAR, TEL_POZ, CITA_CHIP] },
    { id: "general", k: ["limpieza", "limpieza dental", "revision", "revisiones", "empaste", "empastes", "caries", "chequeo", "sarro", "higiene", "halitosis", "mal aliento", "encia", "encias", "sangran"],
      a: "Sí: ofrecen todas las especialidades (revisiones, limpiezas, empastes, encías…). La primera consulta es gratuita. El precio de la limpieza no está publicado; te lo confirma la clínica.", c: [CITA_CHIP, TEL_CAR] },
    { id: "horario", k: ["horario", "hora abris", "abris", "abierto", "cerrais", "cierra", "a que hora", "tarde", "mañana abierto", "jueves", "lunes", "martes", "miercoles", "viernes"],
      a: "Horario publicado:\n" + HORARIO_TXT, now: true, c: [CITA_CHIP] },
    { id: "finde", k: ["sabado", "domingo", "fin semana", "festivo", "agosto", "vacaciones"],
      a: "La web solo publica horario de lunes a viernes; no indica horario de sábados, domingos ni festivos. Te lo confirma la clínica en el 91 525 02 56.\n\n" + HORARIO_TXT, c: [TEL_CAR, CITA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "como llego", "llegar", "metro", "autobus", "bus", "aparcar", "aparcamiento", "parking", "calle", "mapa", "zona", "carabanchel", "pozuelo", "monteclaro", "sede", "sedes", "clinicas"],
      a: "Tienen dos clínicas:\n📍 Carabanchel: " + C.dirCar + " · tel. " + C.telCar + "\nMetro Eugenia de Montijo (L5) · Bus 121, 131, 139, 482, 491, 492, 493, 34, 35.\n📍 Pozuelo: " + C.dirPoz + " · tel. " + C.telPoz + "\nBus 561, 561B, 657, N60, N61 · el centro comercial tiene parking gratuito.", c: [{ t: "Maps Carabanchel", url: C.mapsCar }, { t: "Maps Pozuelo", url: C.mapsPoz }, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "llamar", "numero", "contacto", "email", "correo", "mail", "whatsapp", "wasap", "hablar persona", "recepcion", "humano"],
      a: "Contacto publicado:\n• Carabanchel: " + C.telCar + "\n• Pozuelo: " + C.telPoz + "\n• Email: " + C.email + "\n" + NO_WA, c: [TEL_CAR, TEL_POZ, MAIL_CHIP] },
    { id: "equipo", k: ["franquicia", "cadena", "quien atiende", "doctor", "doctora", "dentista", "experiencia", "opiniones", "equipo", "años", "familia", "1991", "villani", "cevey"],
      a: "Es una clínica familiar (no franquicia), en el sector dental desde 1991: abrió en Carabanchel (barrio Eugenia de Montijo) y lleva más de 25 años también en Pozuelo.\nEn su web aparecen la Dra. Marta Villani (ortodoncia y odontopediatría) y el Dr. Adrián Cevey (fundas de zirconio / estética).", c: [CITA_CHIP] },
    { id: "seguros", k: ["seguro", "mutua", "adeslas", "sanitas", "dkv", "asisa", "mapfre", "aseguradora", "sociedad", "sociedades", "poliza", "seguridad social"],
      a: "La web dice que atienden sociedades y que trabajan con distintos seguros dentales (cada uno con su baremo), pero no publica la lista de mutuas. Llama y te confirman si está la tuya.", c: [TEL_CAR, TEL_POZ] },
    { id: "gracias", k: ["gracias", "vale gracias", "perfecto", "genial", "adios", "hasta luego"],
      a: "¡A ti! Si necesitas algo más, aquí estoy. 😊", c: [CITA_CHIP] }
  ];
  var CITA_K = ["pedir cita", "cita", "reservar", "reserva", "agendar", "pedir hora", "hueco", "turno", "apuntarme", "citarme"];

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
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, opened = false;
  var flow = null;

  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  function addBot(t, chips, cls) {
    var ty = el("div", "r24-typing", "Escribiendo…"); body.appendChild(ty); scroll();
    setTimeout(function () {
      ty.remove();
      var m = el("div", "r24-msg r24-bot" + (cls ? " " + cls : ""), esc(t).replace(/\b(91 525 02 56|91 715 67 55)\b/g, function (x) {
        return '<a href="tel:+34' + x.replace(/\s/g, "") + '">' + x + "</a>";
      }).replace(/clinicadentaltauro@gmail\.com/g, '<a href="mailto:clinicadentaltauro@gmail.com">clinicadentaltauro@gmail.com</a>'));
      body.appendChild(m);
      if (chips && chips.length) {
        var w = el("div", "r24-chips");
        chips.forEach(function (c) {
          var b;
          if (c.tel) { b = el("a", "r24-chip", "📞 " + esc(c.t)); b.href = "tel:" + c.tel; }
          else if (c.url) { b = el("a", "r24-chip", esc(c.t)); b.href = c.url; if (c.url.indexOf("mailto:") < 0) { b.target = "_blank"; b.rel = "noopener"; } }
          else { b = el("button", "r24-chip", esc(c.t)); b.type = "button"; b.onclick = function () { w.remove(); handle(c.v || c.q || c.t, c); }; }
          w.appendChild(b);
        });
        body.appendChild(w);
      }
      scroll();
    }, 380);
  }

  function statusText() {
    var n = madridNow(), oc = isOpen(n, HS.car), op = isOpen(n, HS.poz);
    if (oc || op) { status.className = "r24-status"; status.textContent = "🟢 Abierto ahora: " + (oc && op ? "Carabanchel y Pozuelo" : (oc ? "Carabanchel " + C.telCar : "Pozuelo " + C.telPoz)); }
    else { status.className = "r24-status r24-closed"; status.textContent = "🌙 Fuera del horario publicado (abre " + nextOpening(n) + "). Te atiendo igual y dejo tu cita solicitada."; }
  }
  function closedNote() { var n = madridNow(); return isOpen(n) ? "" : "\n\nℹ️ Ahora mismo estamos fuera del horario publicado; la clínica abre " + nextOpening(n) + "."; }

  function build() {
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = (window.R24_BASE || "recepcion/") + "recepcion.css"; document.head.appendChild(css);
    var ban = el("div", "r24-demo-banner", "Demo privada preparada para Clínica Dental Tauro"); ban.setAttribute("role", "note"); document.body.appendChild(ban);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + (window.R24_BASE || "recepcion/") + 'avatar.svg" alt="Recepcionista"><span>Recepción 24 h</span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", "Abrir la recepción 24 h"); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + (window.R24_BASE || "recepcion/") + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b>Recepción 24 h <span class="r24-online">● en línea</span></b><small>Clínica Dental Tauro · Carabanchel y Pozuelo</small></div><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" placeholder="Escribe tu pregunta…" autocomplete="off" maxlength="300"><button class="r24-send" type="submit">Enviar</button></form><div class="r24-legal">Asistente automático de demostración · tus datos no se envían a ningún sitio</div>';
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
      addBot("¡Hola! 👋 Soy la recepción virtual de Clínica Dental Tauro (Carabanchel y Pozuelo). Te ayudo a pedir cita y con dudas de tratamientos, horario o cómo llegar.\n¿En qué te ayudo?",
        [CITA_CHIP, { t: "1ª consulta gratis", q: "primera consulta gratis" }, { t: "Implantes", q: "implantes" }, { t: "Ortodoncia", q: "ortodoncia" }, { t: "Me duele una muela", q: "me duele una muela" }, { t: "Horario y clínicas", q: "horario" }]);
    }
    setTimeout(function () { input.focus(); }, 50);
  }

  var TRAT = ["1ª consulta gratuita", "Revisión y limpieza", "Implantes", "Ortodoncia / brackets", "Endodoncia", "Estética (blanqueamiento, carillas)", "Fundas de zirconio", "Urgencia / dolor", "Otro"];
  function sedeKey() { return flow && /pozuelo/i.test(flow.d.sede || "") ? "poz" : "car"; }
  function startCita() {
    flow = { step: "nombre", d: {} };
    addBot("¡Perfecto! Te ayudo a pedir cita en unos pasos. Si es tu primera vez, la consulta es gratuita.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || "Consulta general").slice(0, 120) } };
    addBot("¡Claro! Te llama una persona del equipo de la clínica. Solo necesito dos datos.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
  }
  function ask(step) {
    flow.step = step;
    var n = madridNow(), hs = HS[sedeKey()];
    if (step === "sede") addBot("Encantados, " + flow.d.nombre + ". ¿En qué clínica?", [{ t: "Carabanchel (C/ Pingüino 23)", v: "Carabanchel", flow: true }, { t: "Pozuelo (C. C. Monteclaro)", v: "Pozuelo", flow: true }]);
    else if (step === "tratamiento") addBot("¿Para qué tratamiento es la cita?", TRAT.map(function (t) { return { t: t, v: t, flow: true }; }));
    else if (step === "dia") addBot(sedeKey() === "poz" ? "¿Qué día te viene mejor? En Pozuelo atienden lunes, martes, miércoles y viernes de 17:00 a 20:00." : "¿Qué día te viene mejor? En Carabanchel atienden de lunes a viernes (los jueves solo por la tarde).",
      nextWorkdays(n, 5, hs).map(function (x) { return { t: x.label, v: x.label, flow: true }; }).concat([{ t: "Lo antes posible", v: "Lo antes posible", flow: true }]));
    else if (step === "franja") addBot("¿Mañana o tarde?", [{ t: "Mañana (11:00–14:00)", v: "Mañana (11:00–14:00)", flow: true }, { t: "Tarde (16:00–20:00)", v: "Tarde (16:00–20:00)", flow: true }, { t: "Me da igual", v: "Mañana o tarde, indiferente", flow: true }]);
    else if (step === "telefono") addBot(flow.d.tipo === "llamada" ? "Perfecto, " + flow.d.nombre + ". ¿A qué teléfono te llaman?" : "Último paso: ¿a qué teléfono te llamamos para confirmarte la cita?");
    else if (step === "resumen") {
      var d = flow.d;
      if (d.tipo === "llamada") { addBot("Revisa tu solicitud de llamada:\n👤 Nombre: " + d.nombre + "\n💬 Consulta: " + d.consulta + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", [{ t: "✅ Confirmar", v: "__ok", flow: true }, { t: "✏️ Corregir", v: "__fix", flow: true }, { t: "Cancelar", v: "cancelar", flow: true }], "r24-sum"); return; }
      addBot("Revisa tu solicitud:\n👤 Nombre: " + d.nombre + "\n📍 Clínica: " + d.sede + "\n🦷 Tratamiento: " + d.tratamiento + "\n📅 Día: " + d.dia + "\n🕐 Franja: " + d.franja + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", [{ t: "✅ Confirmar", v: "__ok", flow: true }, { t: "✏️ Corregir", v: "__fix", flow: true }, { t: "Cancelar", v: "cancelar", flow: true }], "r24-sum");
    }
  }
  function afterDia() {
    var d = flow.d, n = norm(d.dia);
    if (sedeKey() === "poz") { d.franja = "Tarde (17:00–20:00)"; addBot("En Pozuelo solo hay horario de tarde, así que lo anoto de 17:00 a 20:00."); setTimeout(function () { ask("telefono"); }, 500); return; }
    if (/jueves/.test(n)) { d.franja = "Tarde (16:00–20:00)"; addBot("Los jueves Carabanchel abre solo por la tarde, así que lo anoto de 16:00 a 20:00."); setTimeout(function () { ask("telefono"); }, 500); return; }
    ask("franja");
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
        d.sede = /pozuelo|monteclaro/i.test(t) ? "Pozuelo (C. C. Monteclaro)" : "Carabanchel (C/ Pingüino 23)"; ask("tratamiento"); return;
      case "tratamiento":
        d.tratamiento = t.slice(0, 80);
        if (/urgen|dolor/.test(n)) {
          var tel = sedeKey() === "poz" ? C.telPoz : C.telCar, hs = HS[sedeKey()];
          addBot("Si tienes mucho dolor, lo más rápido es llamar al " + tel + (isOpen(madridNow(), hs) ? " ahora mismo" : " en cuanto abran (" + nextOpening(madridNow(), hs) + ")") + ". Aun así, dejo tu solicitud preparada.", [TEL_CAR, TEL_POZ]);
          setTimeout(function () { ask("dia"); }, 900); return;
        }
        ask("dia"); return;
      case "dia":
        if (/sabado|domingo/.test(n)) { addBot("La web no publica horario de sábados ni domingos, así que no puedo reservarlo. ¿Te viene bien algún día entre semana?"); setTimeout(function () { ask("dia"); }, 500); return; }
        if (sedeKey() === "poz" && /jueves/.test(n)) { addBot("Los jueves la clínica de Pozuelo está cerrada. ¿Otro día, o prefieres Carabanchel (jueves de 16:00 a 20:00)?"); setTimeout(function () { ask("dia"); }, 500); return; }
        d.dia = t.slice(0, 60); afterDia(); return;
      case "franja":
        if (/noche|21|22|23/.test(n)) { addBot("Atienden hasta las 20:00. ¿Mañana o tarde?"); setTimeout(function () { ask("franja"); }, 500); return; }
        d.franja = (/manana/.test(n) && !/igual|tarde/.test(n)) ? "Mañana (11:00–14:00)" : t.slice(0, 60); ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().-]/g, "").replace(/^0034/, "+34");
        if (!/^(\+34)?[6789]\d{8}$/.test(ph)) { addBot("Ese número no me cuadra. Escríbelo con 9 cifras, por ejemplo 612 345 678."); return; }
        var dg = ph.replace(/^\+34/, ""); d.telefono = dg.slice(0, 3) + " " + dg.slice(3, 6) + " " + dg.slice(6); ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|vale|ok|confirmo|confirmar|correcto)/.test(n)) {
          if (d.tipo === "llamada") { addBot("¡Listo, " + d.nombre.split(" ")[0] + "! ✅ El equipo de la clínica recibe tu pedido al instante y te llama al " + d.telefono + "." + closedNote() + "\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [CITA_CHIP, { t: "Otra pregunta", q: "__menu" }]); flow = null; return; }
          var nm2 = d.nombre.split(" ")[0], telc = sedeKey() === "poz" ? C.telPoz : C.telCar;
          addBot("¡Listo, " + nm2 + "! ✅ Tu solicitud de cita en " + d.sede + " está lista.\nLa recepción te llamará al " + d.telefono + " para confirmarte el hueco exacto." + closedNote() + "\n\nSi prefieres adelantarte, puedes llamar al " + telc + ". " + NO_WA + "\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [{ t: "Cómo llegar", q: "dirección" }, { t: "Otra pregunta", q: "__menu" }]);
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
        var fr = function (rr) { return rr.length ? rr.map(function (r) { return hhmm(r[0]) + " a " + hhmm(r[1]); }).join(" y de ") : null; };
        var a1 = fr(HS.car[di]), a2 = fr(HS.poz[di]);
        if (di === 0 || di === 6) t = "La web no publica horario para el " + DIAS[di] + "; confírmalo llamando al " + C.telCar + ".";
        else t = "El " + DIAS[di] + ":\n• Carabanchel: " + (a1 ? "de " + a1 : "cerrado") + "\n• Pozuelo: " + (a2 ? "de " + a2 : "cerrado");
        t += "\n\nHorario completo:\n" + HORARIO_TXT;
        break;
      }
    }
    if (e.now) { var n = madridNow(), oc = isOpen(n, HS.car), op = isOpen(n, HS.poz); t += (oc || op) ? "\n\n🟢 Ahora mismo está abierta " + (oc && op ? "cualquiera de las dos clínicas." : (oc ? "la clínica de Carabanchel." : "la clínica de Pozuelo.")) : "\n\n🌙 Ahora mismo estamos fuera del horario publicado; abre " + nextOpening(n) + " (Carabanchel)."; }
    if (e.urg && !isOpen(madridNow())) t += "\n\n🌙 Ahora la clínica está fuera de horario (abre " + nextOpening(madridNow()) + "). Si es grave —traumatismo fuerte o hinchazón que dificulta tragar o respirar— no esperes: llama al 112.";
    addBot(t, (e.c || []).map(function (c) { return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot("Eso te lo confirma mejor el equipo de la clínica, así tienes el dato exacto. 😊\nLlámales (Carabanchel " + C.telCar + " · Pozuelo " + C.telPoz + ") o deja tu teléfono y te llaman ellos." + closedNote(), [TEL_CAR, TEL_POZ, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip) {
    if (t === "__menu") { addBot("Claro, ¿qué más quieres saber?", [CITA_CHIP, { t: "Horario", v: "horario" }, { t: "Tratamientos", v: "tratamientos" }, { t: "Cómo llegar", v: "dirección" }]); return; }
    addUser(chip ? chip.t : t);
    if (flow) { flowInput(chip && chip.v ? chip.v : t); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    var n = norm(t);
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot("¡Hola! ¿En qué te puedo ayudar? Puedo pedirte cita o contarte tratamientos, horario y cómo llegar a Carabanchel o Pozuelo.", [CITA_CHIP, { t: "Horario", v: "horario" }, { t: "Tratamientos", v: "tratamientos" }, LLAMADA_CHIP]); return; }
    if (/tratamientos|que haceis|servicios|especialidades/.test(n)) { addBot("Ofrecen todas las especialidades: implantes (garantía 5 años), endodoncia, ortodoncia (brackets y alineadores, niños y adultos), estética (blanqueamiento, carillas), fundas de zirconio, prótesis y atención especial a personas mayores. ¿Sobre cuál quieres saber más?", [{ t: "Implantes", v: "implantes" }, { t: "Ortodoncia", v: "ortodoncia" }, { t: "Estética", v: "estética" }, CITA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|reserv|agendar/.test(n))) { startCita(); return; }
    if (price) {
      if (/endodon|conducto|nervio/.test(n)) { reply(byId("precio_endo"), t); return; }
      if (/primera|consulta|visita|valoracion|diagnost/.test(n)) { reply(byId("valoracion"), t); return; }
      if (/financ|plazo|mes/.test(n)) { reply(byId("financiacion"), t); return; }
      reply(byId("precio_otro"), t); return;
    }
    if (bi) { reply(bi.e, t); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, isOpen: isOpen, madridNow: madridNow } };
})();
