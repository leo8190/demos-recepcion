/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Clínica Dental Dra. Díaz Aguilar — Dentalneat (Madrid: Vallecas + Tetuán) — DEMO privada.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Todas las respuestas salen de textos publicados en www.dentalneat.com (oct. 2026). Trato de «usted», como su web.
   Lo que la web no publica (precios, mutuas, si la 1ª visita es gratis, WhatsApp, tipos de ortodoncia…) se deriva a la clínica. */
(function () {
  "use strict";
  var C = {
    nombre: "Clínica Dental Dra. Díaz Aguilar",
    telVal: "910 81 10 35", telValh: "+34910811035",
    telTet: "910 721 864", telTeth: "+34910721864",
    movil: "638 51 07 88", movilh: "+34638510788",
    email: "dentalneat@dentalneat.com",
    dirVal: "C/ Pedro Laborde 69, esquina C/ Lago Calafate 3, 28018 Madrid (Vallecas)",
    mapsVal: "https://www.google.com/maps/search/?api=1&query=Calle+Lago+Calafate+3+28018+Madrid",
    dirTet: "C/ Marqués de Viana 57, Madrid (Metro Tetuán, junto a Bravo Murillo)",
    mapsTet: "https://www.google.com/maps/search/?api=1&query=Calle+Marqu%C3%A9s+de+Viana+57+Madrid"
  };
  // Horario publicado (igual en las dos clínicas). 0 = domingo. Sábado y domingo: cerrado.
  var LV = [[600, 840], [960, 1200]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 0: [], 6: [] };
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var HORARIO_TXT = "Lunes a viernes: 10:00–14:00 y 16:00–20:00\nSábados y domingos: cerrado\n(El mismo horario en Vallecas y en Tetuán.)";


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

  var STOP = "a al algo algun alguna como con cual cuales de del el en es esta este esto estoy hay la las lo los me mi mis o os para pero por que quiero se si sin su sus te tu tus un una uno unos y ya yo vosotros vuestra vuestro usted ustedes le hacer haceis teneis tienen tiene puedo podeis podria saber gustaria hola buenas buenos dias tardes noches favor".split(" ");
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
  var TEL_VAL = { t: "Vallecas " + C.telVal, tel: C.telValh };
  var TEL_TET = { t: "Tetuán " + C.telTet, tel: C.telTeth };
  var MAIL_CHIP = { t: "Escribir email", url: "mailto:" + C.email };
  var MOVIL_CHIP = { t: "Móvil " + C.movil, tel: C.movilh };
  var NO_WA = "La clínica no publica un número de WhatsApp en su web; lo más rápido es el teléfono.";
  var KB = [
    { id: "valoracion", k: ["primera visita", "primera consulta", "consulta gratis", "consulta gratuita", "valoracion", "diagnostico", "radiodiagnostico", "radiografia", "tac", "escaner", "gratis", "gratuito", "gratuita", "sin coste", "presupuesto", "segunda opinion"],
      a: "En su web anuncian radiodiagnóstico y TAC digital gratuitos, y presupuesto sin compromiso.\nSi la primera visita en sí tiene coste no está publicado; se lo confirma la clínica al pedir la cita.", c: [CITA_CHIP, { t: "Financiación", q: "financiación" }] },
    { id: "financiacion", k: ["financiacion", "financian", "financiar", "plazos", "pagar a plazos", "cuotas", "al mes", "mensual", "pago aplazado", "facilidades pago"],
      a: "Sí: la clínica ofrece sistemas de financiación diseñados a medida de cada paciente (publicado en su web).\nLas condiciones concretas (plazos y cuotas) no están publicadas; se las explican con el presupuesto, que es sin compromiso.", c: [CITA_CHIP, TEL_VAL, TEL_TET] },
    { id: "precio", k: ["precio", "precios", "tarifa", "tarifas", "cuanto cuesta", "cuanto vale"],
      a: "La web de la clínica no publica precios de ningún tratamiento, y prefiero no inventármelos.\nLo que sí anuncian: radiodiagnóstico y TAC digital gratuitos, presupuesto sin compromiso y financiación a medida.", c: [CITA_CHIP, TEL_VAL, TEL_TET] },
    { id: "implantes", k: ["implante", "implantes", "dientes fijos", "falta diente", "perdido diente", "reponer diente", "carga inmediata", "protesis", "protesis hibrida", "dentadura", "dentadura postiza", "titanio", "zirconio", "circonio"],
      a: "Sí, hacen implantes y prótesis en Vallecas y Tetuán. En su página de casos reales muestran, por ejemplo:\n• Implantes de titanio con prótesis de zirconio de alta estética.\n• Implantes con prótesis de carga inmediata: el paciente recupera la función y la estética el mismo día de la cirugía.\n• Prótesis híbrida fija sobre implantes, para pérdida total o parcial de piezas.\nEl TAC digital es gratuito y el presupuesto, sin compromiso.", c: [CITA_CHIP, { t: "Ver casos reales", url: "casos-reales.html" }, { t: "¿Precio?", q: "precio implante" }] },
    { id: "ortodoncia", k: ["ortodoncia", "bracket", "brackets", "alinear dientes", "dientes torcidos", "alineador", "alineadores", "invisible", "invisalign", "mordida", "aparato"],
      a: "Sí, hacen ortodoncia. En su web muestran un caso real de unos 18 meses de tratamiento, con controles periódicos para alinear los dientes y corregir la mordida.\nQué tipo de ortodoncia le conviene (brackets, alineadores…) no lo detallan en la web: se valora en consulta, con radiodiagnóstico gratuito.", c: [CITA_CHIP, { t: "Ver casos reales", url: "casos-reales.html" }] },
    { id: "estetica", k: ["estetica", "carilla", "carillas", "blanqueamiento", "blanquear", "dientes blancos", "composite", "sonrisa", "manchas", "diente roto", "diente partido", "desgaste"],
      a: "En estética dental ofrecen blanqueamiento y carillas de composite: una técnica mínimamente invasiva que mejora forma, color y alineación, sin tallados extensos y en pocas sesiones. Va bien para fracturas, cambios de tono o desgastes.\nPrecios: no publicados; se los dan con el presupuesto sin compromiso.", c: [CITA_CHIP, { t: "Ver casos reales", url: "casos-reales.html" }] },
    { id: "periodoncia", k: ["periodoncia", "encia", "encias", "sangran", "sangrado", "piorrea", "dientes se mueven", "inflamacion encia"],
      a: "Sí: la periodoncia es una de sus disciplinas principales. Tratan la inflamación de las encías para conservar bien sujetos los dientes. Si le sangran las encías, conviene revisarlo pronto.", c: [CITA_CHIP] },
    { id: "bruxismo", k: ["bruxismo", "rechinar", "apretar dientes", "ferula", "ferula descarga", "mandibula", "estres"],
      a: "Sí, tratan el bruxismo (apretar o rechinar los dientes) con una férula de descarga personalizada: reparte la fuerza de la mandíbula por la noche y protege el esmalte.", c: [CITA_CHIP] },
    { id: "endodoncia", k: ["endodoncia", "matar nervio", "conducto", "conductos", "nervio diente", "tratamiento conducto"],
      a: "Sí, hacen endodoncias (tratamiento de conductos). La web no publica más detalles ni precio; se lo explican en consulta.", c: [CITA_CHIP, { t: "Me duele una muela", q: "me duele una muela" }] },
    { id: "ninos", k: ["niño", "niños", "hijo", "hija", "infantil", "odontopediatria", "pequeño", "bebe"],
      a: "Sí, ofrecen medicina dental infantil en sus clínicas. Para la edad de la primera revisión y lo que necesite su hijo o hija, se lo indican en consulta.", c: [CITA_CHIP] },
    { id: "urgencia", k: ["urgencia", "urgente", "dolor", "duele muela", "me duele", "emergencia", "flemon", "hinchazon", "infeccion"],
      a: "Si tiene dolor, llame a la clínica: Vallecas 910 81 10 35 · Tetuán 910 721 864 · móvil 638 51 07 88. La web no publica un servicio de urgencias fuera de horario.\nMientras tanto: su analgésico habitual, frío por fuera y evite lo muy frío, caliente o dulce. No se automedique con antibióticos.", urg: true, c: [TEL_VAL, TEL_TET, MOVIL_CHIP, LLAMADA_CHIP] },
    { id: "general", k: ["limpieza", "limpieza dental", "profilaxis", "revision", "revisiones", "empaste", "empastes", "obturacion", "caries", "chequeo", "sarro", "higiene", "extraccion", "extracciones", "sacar muela", "muela juicio"],
      a: "Sí: hacen profilaxis y limpieza dental, obturaciones (empastes de caries), extracciones y revisiones. Su idea es detectar y tratar problemas como la caries en fase temprana. El precio de cada tratamiento no está publicado; se lo confirma la clínica.", c: [CITA_CHIP, TEL_VAL, TEL_TET] },
    { id: "horario", k: ["horario", "hora abren", "abren", "abierto", "cierran", "cierra", "a que hora", "tarde", "mañana abierto", "mediodia", "lunes", "martes", "miercoles", "jueves", "viernes"],
      a: "Horario publicado:\n" + HORARIO_TXT, now: true, c: [CITA_CHIP] },
    { id: "finde", k: ["sabado", "domingo", "fin semana", "festivo", "agosto", "vacaciones"],
      a: "Los sábados y domingos las dos clínicas están cerradas (así lo publica su web). Festivos y vacaciones no aparecen; se lo confirma la clínica.\n\n" + HORARIO_TXT, c: [CITA_CHIP, TEL_VAL] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "como llego", "llegar", "metro", "autobus", "bus", "aparcar", "parking", "calle", "mapa", "zona", "vallecas", "tetuan", "bravo murillo", "sede", "sedes", "clinicas", "tour virtual"],
      a: "Tienen dos clínicas:\n📍 Vallecas: " + C.dirVal + " · tel. " + C.telVal + "\n📍 Tetuán: " + C.dirTet + " · tel. " + C.telTet + "\nEn la página de la clínica de Tetuán hay un tour virtual por dentro.", c: [{ t: "Maps Vallecas", url: C.mapsVal }, { t: "Maps Tetuán", url: C.mapsTet }, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "llamar", "numero", "contacto", "email", "correo", "mail", "whatsapp", "wasap", "movil", "hablar persona", "recepcion", "humano"],
      a: "Contacto publicado:\n• Vallecas: " + C.telVal + "\n• Tetuán: " + C.telTet + "\n• Móvil: " + C.movil + "\n• Email: " + C.email + "\n" + NO_WA, c: [TEL_VAL, TEL_TET, MAIL_CHIP] },
    { id: "equipo", k: ["quien atiende", "doctor", "doctora", "dentista", "diaz aguilar", "experiencia", "opiniones", "equipo", "años", "solomon klein", "franquicia", "cadena"],
      a: "Las clínicas las dirige la Dra. Díaz Aguilar, que ganó experiencia en la prestigiosa clínica Solomon Klein y la pone al servicio de la Clínica Solidaria Cuarto Mundo de Madrid (sin ánimo de lucro).\nLa clínica de Vallecas lleva más de 15 años abierta; la de Tetuán se inauguró en 2020.", c: [CITA_CHIP] },
    { id: "seguros", k: ["seguro", "mutua", "adeslas", "sanitas", "dkv", "asisa", "mapfre", "aseguradora", "poliza", "seguridad social"],
      a: "La web no dice si trabajan con mutuas o seguros dentales. Llame y se lo confirman: Vallecas 910 81 10 35 · Tetuán 910 721 864.", c: [TEL_VAL, TEL_TET] },
    { id: "casos", k: ["casos reales", "antes despues", "fotos", "resultados", "ejemplos"],
      a: "En su web tienen una página de casos reales: implantes con prótesis de zirconio, carga inmediata, prótesis híbrida, carillas de composite y un tratamiento de ortodoncia de unos 18 meses.", c: [{ t: "Ver casos reales", url: "casos-reales.html" }, CITA_CHIP] },
    { id: "gracias", k: ["gracias", "vale gracias", "perfecto", "genial", "adios", "hasta luego"],
      a: "¡A usted! Si necesita algo más, aquí estoy. 😊", c: [CITA_CHIP] }
  ];
  var CITA_K = ["pedir cita", "cita", "reservar", "reserva", "agendar", "pedir hora", "hueco", "turno", "apuntarme", "citarme", "concertar"];

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
      var m = el("div", "r24-msg r24-bot" + (cls ? " " + cls : ""), esc(t).replace(/\b(910 81 10 35|910 721 864|638 51 07 88)\b/g, function (x) {
        return '<a href="tel:+34' + x.replace(/\s/g, "") + '">' + x + "</a>";
      }).replace(/dentalneat@dentalneat\.com/g, '<a href="mailto:dentalneat@dentalneat.com">dentalneat@dentalneat.com</a>'));
      body.appendChild(m);
      if (chips && chips.length) {
        var w = el("div", "r24-chips");
        chips.forEach(function (c) {
          var b;
          if (c.tel) { b = el("a", "r24-chip", "📞 " + esc(c.t)); b.href = "tel:" + c.tel; }
          else if (c.url) { b = el("a", "r24-chip", esc(c.t)); b.href = c.url; if (/^https?:/.test(c.url)) { b.target = "_blank"; b.rel = "noopener"; } }
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
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = "🟢 Abierto ahora: Vallecas y Tetuán"; }
    else { status.className = "r24-status r24-closed"; status.textContent = "🌙 Fuera del horario publicado (abre " + nextOpening(n) + "). Le atiendo igual y dejo su cita solicitada."; }
  }
  function closedNote() { var n = madridNow(); return isOpen(n) ? "" : "\n\nℹ️ Ahora mismo la clínica está fuera de horario; abre " + nextOpening(n) + "."; }
  function build() {
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = (window.R24_BASE || "recepcion/") + "recepcion.css"; document.head.appendChild(css);
    var ban = el("div", "r24-demo-banner", "Demo privada preparada para Clínica Dental Dra. Díaz Aguilar"); ban.setAttribute("role", "note"); document.body.appendChild(ban);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + (window.R24_BASE || "recepcion/") + 'avatar.svg" alt="Recepcionista"><span>Pedir cita 24 h</span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", "Abrir la recepción 24 h"); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + (window.R24_BASE || "recepcion/") + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b>Recepción 24 h <span class="r24-online">● en línea</span></b><small>Dra. Díaz Aguilar · Vallecas y Tetuán</small></div><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" placeholder="Escriba su pregunta…" autocomplete="off" maxlength="300"><button class="r24-send" type="submit">Enviar</button></form><div class="r24-legal">Asistente automático de demostración · sus datos no se envían a ningún sitio</div>';
    document.body.appendChild(panel);
    body = panel.querySelector(".r24-body"); input = panel.querySelector(".r24-in"); status = panel.querySelector(".r24-status");
    launch.onclick = open;
    panel.querySelector(".r24-x").onclick = function () { panel.classList.remove("r24-open"); launch.classList.remove("r24-hide"); };
    panel.querySelector("form").onsubmit = function (ev) { ev.preventDefault(); ev.stopImmediatePropagation(); var t = input.value.trim(); if (!t) return; input.value = ""; handle(t); };
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("[data-r24-open]"); if (a) { ev.preventDefault(); open(); }
    });
  }
  function open() {
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); statusText();
    if (!opened) {
      opened = true;
      addBot("¡Hola! 👋 Soy el asistente virtual con IA de la Clínica Dental Dra. Díaz Aguilar (Vallecas y Tetuán). Puedo dejarle la cita pedida y resolver dudas de tratamientos, horario o cómo llegar.\n¿En qué le ayudo?",
        [CITA_CHIP, { t: "TAC gratuito", q: "tac gratuito" }, { t: "Implantes", q: "implantes" }, { t: "Me duele una muela", q: "me duele una muela" }, { t: "Horario y clínicas", q: "horario" }, LLAMADA_CHIP]);
    }
    setTimeout(function () { input.focus(); }, 50);
  }

  var TRAT = ["Revisión / primera visita", "Limpieza dental", "Implantes y prótesis", "Ortodoncia", "Estética (blanqueamiento, carillas)", "Encías (periodoncia)", "Endodoncia", "Bruxismo / férula", "Niños", "Urgencia / dolor", "Otro"];
  function telSede() { return flow && /tetuan/i.test(norm(flow.d.sede || "")) ? C.telTet : C.telVal; }
  function startCita() {
    flow = { step: "nombre", d: {} };
    addBot("¡Perfecto! Le ayudo a pedir cita en unos pasos.\n¿Cuál es su nombre? (Escriba «cancelar» si quiere salir.)");
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || "Consulta general").slice(0, 120) } };
    addBot("¡Claro! Le llama una persona del equipo de la clínica. Solo necesito dos datos.\n¿Cuál es su nombre? (Escriba «cancelar» si quiere salir.)");
  }
  function ask(step) {
    flow.step = step;
    var n = madridNow();
    if (step === "sede") addBot("Encantados, " + flow.d.nombre + ". ¿En qué clínica prefiere la cita?", [{ t: "Vallecas (C/ Lago Calafate 3)", v: "Vallecas", flow: true }, { t: "Tetuán (C/ Marqués de Viana 57)", v: "Tetuán", flow: true }]);
    else if (step === "tratamiento") addBot("¿Para qué es la cita?", TRAT.map(function (t) { return { t: t, v: t, flow: true }; }));
    else if (step === "dia") addBot("¿Qué día le viene mejor? Atienden de lunes a viernes.",
      nextWorkdays(n, 5).map(function (x) { return { t: x.label, v: x.label, flow: true }; }).concat([{ t: "Lo antes posible", v: "Lo antes posible", flow: true }]));
    else if (step === "franja") addBot("¿Mañana o tarde?", [{ t: "Mañana (10:00–14:00)", v: "Mañana (10:00–14:00)", flow: true }, { t: "Tarde (16:00–20:00)", v: "Tarde (16:00–20:00)", flow: true }, { t: "Me da igual", v: "Mañana o tarde, indiferente", flow: true }]);
    else if (step === "telefono") addBot(flow.d.tipo === "llamada" ? "Perfecto, " + flow.d.nombre + ". ¿A qué teléfono le llamamos?" : "Último paso: ¿a qué teléfono le llamamos para confirmarle la cita?");
    else if (step === "resumen") {
      var d = flow.d;
      if (d.tipo === "llamada") { addBot("Revise su solicitud de llamada:\n👤 Nombre: " + d.nombre + "\n💬 Consulta: " + d.consulta + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿La confirmo?", [{ t: "✅ Confirmar", v: "__ok", flow: true }, { t: "✏️ Corregir", v: "__fix", flow: true }, { t: "Cancelar", v: "cancelar", flow: true }], "r24-sum"); return; }
      addBot("Revise su solicitud:\n👤 Nombre: " + d.nombre + "\n📍 Clínica: " + d.sede + "\n🦷 Motivo: " + d.tratamiento + "\n📅 Día: " + d.dia + "\n🕐 Franja: " + d.franja + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿La confirmo?", [{ t: "✅ Confirmar", v: "__ok", flow: true }, { t: "✏️ Corregir", v: "__fix", flow: true }, { t: "Cancelar", v: "cancelar", flow: true }], "r24-sum");
    }
  }
  function flowInput(t) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo)$/.test(n)) { flow = null; addBot("Sin problema, he cancelado la solicitud. ¿Le ayudo con otra cosa?", [CITA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e, t); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot("¿Me indica su nombre, por favor? (solo el nombre, sin números)"); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" "); if (d.tipo === "llamada") { ask("telefono"); return; } ask("sede"); return;
      case "sede":
        d.sede = /tetuan|viana|bravo/.test(n) ? "Tetuán (C/ Marqués de Viana 57)" : "Vallecas (C/ Lago Calafate 3)"; ask("tratamiento"); return;
      case "tratamiento":
        d.tratamiento = t.slice(0, 80);
        if (/urgen|dolor/.test(n)) {
          addBot("Si tiene mucho dolor, lo más rápido es llamar al " + telSede() + (isOpen(madridNow()) ? " ahora mismo" : " en cuanto abran (" + nextOpening(madridNow()) + ")") + ". Aun así, dejo su solicitud preparada.", [TEL_VAL, TEL_TET]);
          setTimeout(function () { ask("dia"); }, 900); return;
        }
        ask("dia"); return;
      case "dia":
        if (/sabado|domingo/.test(n)) { addBot("Los sábados y domingos las clínicas están cerradas. ¿Le viene bien algún día de lunes a viernes?"); setTimeout(function () { ask("dia"); }, 500); return; }
        d.dia = t.slice(0, 60); ask("franja"); return;
      case "franja":
        if (/noche|21|22|23|mediodia|15/.test(n)) { addBot("Atienden de 10:00 a 14:00 y de 16:00 a 20:00. ¿Mañana o tarde?"); setTimeout(function () { ask("franja"); }, 500); return; }
        d.franja = t.slice(0, 60); ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().-]/g, "").replace(/^0034/, "+34");
        if (!/^(\+34)?[6789]\d{8}$/.test(ph)) { addBot("Ese número no me cuadra. Escríbalo con 9 cifras, por ejemplo 612 345 678."); return; }
        var dg = ph.replace(/^\+34/, ""); d.telefono = dg.slice(0, 3) + " " + dg.slice(3, 6) + " " + dg.slice(6); ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|vale|ok|confirmo|confirmar|correcto)/.test(n)) {
          if (d.tipo === "llamada") { addBot("¡Listo, " + d.nombre.split(" ")[0] + "! ✅ El equipo de la clínica recibe su pedido al instante y le llama al " + d.telefono + "." + closedNote() + "\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [CITA_CHIP, { t: "Otra pregunta", q: "__menu" }]); flow = null; return; }
          addBot("¡Listo, " + d.nombre.split(" ")[0] + "! ✅ Su solicitud de cita en " + d.sede + " está registrada.\nLa recepción le llamará al " + d.telefono + " para confirmarle el hueco exacto." + closedNote() + "\n\nSi prefiere adelantarse, puede llamar al " + telSede() + ". " + NO_WA + "\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [{ t: "Cómo llegar", q: "dirección" }, { t: "Otra pregunta", q: "__menu" }]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|no/.test(n)) { flow.d = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : {}; addBot("De acuerdo, empezamos de nuevo. ¿Cuál es su nombre?"); flow.step = "nombre"; return; }
        ask("resumen"); return;
    }
  }
  function reply(e, raw) {
    var t = e.a;
    if (e.id === "horario" || e.id === "finde") {
      var nr = norm(raw || ""), dn = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
      for (var di = 0; di < 7; di++) if (nr.indexOf(dn[di]) >= 0) {
        t = (di === 0 || di === 6) ? "El " + DIAS[di] + " las dos clínicas están cerradas." : "El " + DIAS[di] + " abren de 10:00 a 14:00 y de 16:00 a 20:00, tanto en Vallecas como en Tetuán.";
        t += "\n\nHorario completo:\n" + HORARIO_TXT; break;
      }
    }
    if (e.now) { var n = madridNow(); t += isOpen(n) ? "\n\n🟢 Ahora mismo las dos clínicas están abiertas." : "\n\n🌙 Ahora mismo están fuera de horario; abren " + nextOpening(n) + "."; }
    if (e.urg && !isOpen(madridNow())) t += "\n\n🌙 Ahora la clínica está fuera de horario (abre " + nextOpening(madridNow()) + "). Si es grave —traumatismo fuerte o hinchazón que dificulta tragar o respirar— no espere: llame al 112.";
    addBot(t, (e.c || []).map(function (c) { return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot("Eso se lo confirma mejor el equipo de la clínica, así tiene el dato exacto. 😊\nLlámeles (Vallecas " + C.telVal + " · Tetuán " + C.telTet + " · móvil " + C.movil + ") o déjenos su teléfono y le llaman ellos." + closedNote(), [TEL_VAL, TEL_TET, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip) {
    if (t === "__menu") { addBot("Claro, ¿qué más quiere saber?", [CITA_CHIP, { t: "Horario", v: "horario" }, { t: "Tratamientos", v: "tratamientos" }, { t: "Cómo llegar", v: "dirección" }, LLAMADA_CHIP]); return; }
    addUser(chip ? chip.t : t);
    if (flow) { flowInput(chip && chip.v ? chip.v : t); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    var n = norm(t);
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot("¡Hola! ¿En qué le puedo ayudar? Puedo pedirle cita o contarle tratamientos, horario y cómo llegar a Vallecas o Tetuán.", [CITA_CHIP, { t: "Horario", v: "horario" }, { t: "Tratamientos", v: "tratamientos" }, LLAMADA_CHIP]); return; }
    if (/tratamientos|que hacen|servicios|especialidades/.test(n)) { addBot("Ofrecen odontología general y estética: profilaxis y limpieza, empastes, periodoncia (encías), bruxismo con férula de descarga, implantes y prótesis, ortodoncia, blanqueamiento y carillas, endodoncia, odontología infantil y extracciones. Radiodiagnóstico y TAC digital gratuitos. ¿Sobre cuál quiere saber más?", [{ t: "Implantes", v: "implantes" }, { t: "Ortodoncia", v: "ortodoncia" }, { t: "Estética", v: "estética" }, CITA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|reserv|agendar|concertar/.test(n))) { startCita(); return; }
    if (price) {
      if (/gratis|gratuit|tac|radiograf|diagnost|presupuesto/.test(n)) { reply(byId("valoracion"), t); return; }
      if (/financ|plazo|mes/.test(n)) { reply(byId("financiacion"), t); return; }
      reply(byId("precio"), t); return;
    }
    if (bi) { reply(bi.e, t); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, isOpen: isOpen, madridNow: madridNow } };
})();
