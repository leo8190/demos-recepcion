/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Lunadent (València, L'Eixample) — DEMO privada.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Todas las respuestas salen de textos publicados en lunadentvalencia.com (oct. 2026). Trato de «tú», como su web.
   Lo que la web no publica (precios, financiación, mutuas, urgencias, WhatsApp, sábados…) se deriva al teléfono. */
(function () {
  "use strict";
  var C = {
    nombre: "Lunadent",
    tel1: "963 23 78 07", tel1h: "+34963237807",
    movil: "699 140 445", movilh: "+34699140445",
    email: "lunadentvalencia@gmail.com",
    dir: "Av. de Peris y Valero, 149 (L'Eixample), València",
    maps: "https://www.google.com/maps/search/?api=1&query=Lunadent+Av.+de+Peris+y+Valero+149+Val%C3%A8ncia"
  };
  // Horario publicado (página Contacto): «Lun-Vie 9:30-13:00/ 17:00-20:00». Fin de semana: no figura. (0 = domingo)
  var LV = [[570, 780], [1020, 1200]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 0: [], 6: [] };
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var HORARIO_TXT = "Lunes a viernes: 9:30–13:00 y 17:00–20:00 (cierran a mediodía)\nSábados y domingos: no figuran en su horario";

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
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay(), rs = H[dow] || [];
      for (var j = 0; j < rs.length; j++) if (i > 0 || rs[j][0] > n.min) {
        return (i === 0 ? "hoy" : (i === 1 ? "mañana " + DIAS[dow] : "el " + DIAS[dow])) + " a las " + hhmm(rs[j][0]);
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
  var TEL1 = { t: "Llamar " + C.tel1, tel: C.tel1h };
  var TELM = { t: "Móvil " + C.movil, tel: C.movilh };
  var NO_WA = "Su web no publica WhatsApp; lo más rápido es llamar al " + C.tel1 + " o al móvil " + C.movil + ".";
  var KB = [
    { id: "valoracion", k: ["primera visita", "primera cita", "primera consulta", "consulta gratis", "consulta gratuita", "valoracion", "diagnostico", "gratis", "gratuito", "gratuita", "sin coste", "presupuesto", "plan tratamiento", "ortopantomografia", "radiografia", "panoramica"],
      a: "Sí: la primera visita es gratuita. Incluye ortopantomografía (la radiografía panorámica de la boca) y tu plan de tratamiento.\nEs justo lo que anuncian en su web: «PRIMERA VISITA GRATUITA».", c: [CITA_CHIP, { t: "Tratamientos", q: "tratamientos" }] },
    { id: "financiacion", k: ["financiacion", "financiais", "financiar", "plazos", "pagar a plazos", "cuotas", "al mes", "mensual", "pago aplazado", "facilidades", "formas pago", "opciones pago", "tarjeta"],
      a: "Su web no detalla formas de pago ni financiación. Te lo explican con tu plan de tratamiento en la primera visita, que es gratuita, o por teléfono en el " + C.tel1 + ".", c: [CITA_CHIP, TEL1, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "tarifa", "tarifas", "cuanto cuesta", "cuanto vale"],
      a: "Los precios no están publicados en su web, así que mejor no te doy una cifra a ojo.\nLo que sí ofrecen: primera visita gratuita con ortopantomografía y plan de tratamiento, donde ves tu caso y su presupuesto.", c: [CITA_CHIP, TEL1, LLAMADA_CHIP] },
    { id: "implantes", k: ["implante", "implantes", "implantologia", "dientes fijos", "falta diente", "perdido diente", "reponer diente", "rehabilitacion", "titanio"],
      a: "Sí: «colocamos implantes dentales con precisión para recuperar tu sonrisa y funcionalidad». Los doctores Javier y Diego Carrillo Luna están especializados en implantología, periodoncia y cirugía oral.\nEn la primera visita (gratuita, con ortopantomografía) te dicen qué solución encaja en tu caso.", c: [CITA_CHIP, { t: "¿Precio?", q: "precio implante" }, { t: "Periodoncia", q: "periodoncia" }] },
    { id: "periodoncia", k: ["periodoncia", "periodontitis", "piorrea", "encia", "encias", "sangran", "sangrado", "gingivitis", "dientes se mueven", "movilidad"],
      a: "Sí, es una de sus especialidades: «tratamos enfermedades de las encías para mantener tu salud bucal y prevenir complicaciones». Los dos doctores están especializados en periodoncia.", c: [CITA_CHIP, { t: "Implantes", q: "implantes" }] },
    { id: "cirugia", k: ["cirugia", "cirugia oral", "cirujano", "extraccion", "extracciones", "sacar muela", "muela juicio", "cordal", "quitar diente"],
      a: "Hacen cirugía oral: los doctores Javier y Diego Carrillo Luna son odontólogos especializados en periodoncia, implantología y cirugía oral. Tu caso concreto te lo valoran en la primera visita, que es gratuita.", c: [CITA_CHIP, { t: "Implantes", q: "implantes" }] },
    { id: "ortodoncia", k: ["ortodoncia", "ortodoncia invisible", "invisible", "invisalign", "alineador", "alineadores", "bracket", "brackets", "alinear dientes", "dientes torcidos", "mordida", "aparato", "aparatos"],
      a: "Sí, hacen ortodoncia: «mejora la función y la estética con la ortodoncia más cómoda para ti».\nQué tipo te conviene (y si es con alineadores o brackets) no lo detallan en la web: te lo explican en la primera visita gratuita.", c: [CITA_CHIP, { t: "¿Precio?", q: "precio ortodoncia" }] },
    { id: "estetica", k: ["estetica", "carilla", "carillas", "blanqueamiento", "blanquear", "dientes blancos", "diseño sonrisa", "sonrisa", "manchas", "composite"],
      a: "Hacen estética dental: «mejora la estética de tu sonrisa para que puedas sonreír sin complejos».\nQué tratamiento concreto te conviene (y su precio) no está publicado: te lo explican en la primera visita, que es gratuita.", c: [CITA_CHIP] },
    { id: "limpieza", k: ["limpieza", "limpieza bucal", "limpieza dental", "higiene", "revision", "revisiones", "chequeo", "sarro", "cada cuanto", "cuando debo venir", "prevencion"],
      a: "Sí: hacen limpieza bucal y revisiones. En su web recomiendan «revisiones cada seis meses para mantener tu salud bucal».\nEl precio de una limpieza no está publicado; te lo confirma la clínica.", c: [CITA_CHIP, TEL1] },
    { id: "ninos", k: ["niño", "niños", "nino", "ninos", "hijo", "hija", "hijos", "infantil", "odontopediatria", "pequeño", "bebe", "familia", "edades", "mayores"],
      a: "Sí: «tratamos a pacientes de todas las edades con especial cariño». Lunadent es una clínica dental familiar, con tratamientos personalizados para toda la familia.", c: [CITA_CHIP] },
    { id: "urgencia", k: ["urgencia", "urgente", "dolor", "duele muela", "me duele", "emergencia", "flemon", "hinchazon", "infeccion", "se me ha roto", "diente roto"],
      a: "Lo siento. Su web no detalla un servicio de urgencias, así que lo más rápido es llamar al " + C.tel1 + " o al móvil " + C.movil + " para que te den el primer hueco.\nMientras tanto: tu analgésico habitual, frío por fuera y evita lo muy frío, caliente o dulce. No te automediques con antibióticos.", urg: true, c: [TEL1, LLAMADA_CHIP, CITA_CHIP] },
    { id: "horario", k: ["horario", "hora abris", "abris", "abierto", "cerrais", "cierra", "a que hora", "tarde", "mediodia", "lunes", "martes", "miercoles", "jueves", "viernes"],
      a: "Horario publicado:\n" + HORARIO_TXT, now: true, c: [CITA_CHIP] },
    { id: "finde", k: ["sabado", "domingo", "fin semana", "festivo", "agosto", "vacaciones"],
      a: "El horario que publica su web es de lunes a viernes; sábados, domingos y festivos no aparecen. Te lo confirman en el " + C.tel1 + ".\n\n" + HORARIO_TXT, c: [CITA_CHIP, TEL1] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "como llego", "llegar", "metro", "autobus", "bus", "aparcar", "aparcamiento", "parking", "calle", "mapa", "zona", "eixample", "ensanche", "peris", "valero", "valencia"],
      a: "La clínica está en " + C.dir + ".\nTransporte y aparcamiento no están detallados en su web; si lo necesitas, te orientan por teléfono.", c: [{ t: "Abrir en Maps", url: C.maps }, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "llamar", "numero", "contacto", "email", "correo", "mail", "whatsapp", "wasap", "movil", "hablar persona", "recepcion", "humano"],
      a: "Contacto publicado:\n• Teléfono: " + C.tel1 + "\n• Móvil: " + C.movil + "\n• Email: " + C.email + "\n" + NO_WA, c: [TEL1, TELM, LLAMADA_CHIP] },
    { id: "equipo", k: ["quien atiende", "doctor", "doctora", "dentista", "carrillo", "javier", "diego", "hermanos", "experiencia", "opiniones", "equipo", "especialista", "especialistas"],
      a: "Lunadent es una clínica dental familiar dirigida por los hermanos Javier y Diego Carrillo Luna, odontólogos especializados en periodoncia, implantología y cirugía oral.\nEn su web cuentan más de 15 años de experiencia y más de 10.500 pacientes.", c: [CITA_CHIP] },
    { id: "digital", k: ["digital", "tecnologia", "escaner", "tac", "3d", "moderno", "equipos"],
      a: "En su web dicen que utilizan «tecnología avanzada para diagnósticos y tratamientos precisos», y en la primera visita te hacen una ortopantomografía. Qué equipos concretos usan no está detallado.", c: [CITA_CHIP] },
    { id: "seguros", k: ["seguro", "mutua", "adeslas", "sanitas", "dkv", "asisa", "mapfre", "aseguradora", "poliza", "seguridad social"],
      a: "Su web no dice si trabajan con mutuas o seguros dentales. Te lo confirman en un momento por teléfono, o dejas tu número y te llaman.", c: [TEL1, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "vale gracias", "perfecto", "genial", "adios", "hasta luego"],
      a: "¡A ti! Si necesitas algo más, aquí estoy. 😊", c: [CITA_CHIP] }
  ];
  var CITA_K = ["pedir cita", "cita", "reservar", "reserva", "agendar", "pedir hora", "hueco", "turno", "apuntarme", "citarme", "coger cita"];

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
      var m = el("div", "r24-msg r24-bot" + (cls ? " " + cls : ""), esc(t).replace(/\b(963 23 78 07|699 140 445)\b/g, function (x) {
        return '<a href="tel:+34' + x.replace(/\s/g, "") + '">' + x + "</a>";
      }));
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
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = "🟢 Abierto ahora · hasta las " + hhmm(closeAt(n)) + " · " + C.tel1; }
    else { status.className = "r24-status r24-closed"; status.textContent = "🌙 Fuera del horario publicado (abre " + nextOpening(n) + "). Te atiendo igual y dejo tu cita solicitada."; }
  }
  function closeAt(n) { var r = (H[n.dow] || []).filter(function (r) { return n.min >= r[0] && n.min < r[1]; })[0]; return r ? r[1] : 0; }
  function closedNote() { var n = madridNow(); return isOpen(n) ? "" : "\n\nℹ️ Ahora mismo la clínica está fuera de horario; abre " + nextOpening(n) + "."; }

  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    var ban = el("div", "r24-demo-banner", "Demo privada preparada para Lunadent"); ban.setAttribute("role", "note"); document.body.appendChild(ban);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"><span>Recepción 24 h</span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", "Abrir la recepción 24 h"); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b>Recepción 24 h <span class="r24-online">● en línea</span></b><small>Lunadent · Clínica dental familiar · L\'Eixample</small></div><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" placeholder="Escribe tu pregunta…" autocomplete="off" maxlength="300"><button class="r24-send" type="submit">Enviar</button></form><div class="r24-legal">Asistente automático de demostración · tus datos no se envían a ningún sitio</div>';
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
      addBot("¡Hola! 👋 Soy la recepción virtual de Lunadent, tu clínica dental familiar en L'Eixample. Te ayudo a pedir cita (la primera visita es gratuita) y con dudas de tratamientos, horario o cómo llegar.\n¿En qué te ayudo?",
        [CITA_CHIP, { t: "1ª visita gratuita", q: "primera visita gratuita" }, { t: "Implantes", q: "implantes" }, { t: "Horario", q: "horario" }, LLAMADA_CHIP]);
    }
    setTimeout(function () { input.focus(); }, 50);
  }

  // Motivos = servicios publicados en su web
  var TRAT = ["1ª visita gratuita", "Revisión / limpieza", "Implantes", "Periodoncia (encías)", "Ortodoncia", "Estética", "Cirugía oral", "Para un niño/a", "Dolor / urgencia", "Otro"];
  function startCita() {
    flow = { step: "nombre", d: {} };
    addBot("¡Perfecto! Te ayudo a pedir cita en unos pasos. Si es tu primera visita, es gratuita (con ortopantomografía y plan de tratamiento).\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || "Consulta general").slice(0, 120) } };
    addBot("¡Claro! Te llama una persona del equipo de la clínica. Solo necesito dos datos.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
  }
  function ask(step) {
    flow.step = step;
    var n = madridNow();
    if (step === "tratamiento") addBot("Encantados, " + flow.d.nombre + ". ¿Cuál es el motivo de la cita?", TRAT.map(function (t) { return { t: t, v: t, flow: true }; }));
    else if (step === "dia") addBot("¿Qué día te viene mejor? Atienden de lunes a viernes, de 9:30 a 13:00 y de 17:00 a 20:00.",
      nextWorkdays(n, 5).map(function (x) { return { t: x.label, v: x.label, flow: true }; }).concat([{ t: "Lo antes posible", v: "Lo antes posible", flow: true }]));
    else if (step === "franja") addBot("¿En qué franja?", [{ t: "Mañana (9:30–13:00)", v: "Mañana (9:30–13:00)", flow: true }, { t: "Tarde (17:00–20:00)", v: "Tarde (17:00–20:00)", flow: true }, { t: "Me da igual", v: "Mañana o tarde, indiferente", flow: true }]);
    else if (step === "telefono") addBot(flow.d.tipo === "llamada" ? "Perfecto, " + flow.d.nombre + ". ¿A qué teléfono te llaman?" : "Último paso: ¿a qué teléfono te llamamos para confirmarte la cita?");
    else if (step === "resumen") {
      var d = flow.d, B = [{ t: "✅ Confirmar", v: "__ok", flow: true }, { t: "✏️ Corregir", v: "__fix", flow: true }, { t: "Cancelar", v: "cancelar", flow: true }];
      if (d.tipo === "llamada") { addBot("Revisa tu solicitud de llamada:\n👤 Nombre: " + d.nombre + "\n💬 Consulta: " + d.consulta + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", B, "r24-sum"); return; }
      addBot("Revisa tu solicitud:\n👤 Nombre: " + d.nombre + "\n🦷 Motivo: " + d.tratamiento + "\n📅 Día: " + d.dia + "\n🕐 Franja: " + d.franja + "\n📱 Teléfono: " + d.telefono + "\n\n" + AVISO + "\n\n¿Lo confirmo?", B, "r24-sum");
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
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        if (d.tipo === "llamada") { ask("telefono"); return; } ask("tratamiento"); return;
      case "tratamiento":
        d.tratamiento = t.slice(0, 80);
        if (/urgen|dolor/.test(n)) {
          var op = isOpen(madridNow());
          addBot("Si te duele, lo más rápido es llamar al " + C.tel1 + " o al móvil " + C.movil + (op ? " ahora mismo" : " en cuanto abran (" + nextOpening(madridNow()) + ")") + ". Aun así, dejo tu solicitud preparada.", [TEL1, TELM]);
          setTimeout(function () { ask("dia"); }, 900); return;
        }
        ask("dia"); return;
      case "dia":
        if (/sabado|domingo/.test(n)) { addBot("Su horario publicado es solo de lunes a viernes. ¿Te viene bien alguno de esos días?"); setTimeout(function () { ask("dia"); }, 500); return; }
        d.dia = t.slice(0, 60); ask("franja"); return;
      case "franja":
        if (/noche|\b(21|22|23|14|15|16)\b|madrugada|mediodia|comer/.test(n)) { addBot("Atienden de 9:30 a 13:00 y de 17:00 a 20:00 (a mediodía cierran). ¿Mañana o tarde?"); setTimeout(function () { ask("franja"); }, 500); return; }
        d.franja = t.slice(0, 60); ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().-]/g, "").replace(/^0034/, "+34");
        if (!/^(\+34)?[6789]\d{8}$/.test(ph)) { addBot("Ese número no me cuadra. Escríbelo con 9 cifras, por ejemplo 612 345 678."); return; }
        var dg = ph.replace(/^\+34/, ""); d.telefono = dg.slice(0, 3) + " " + dg.slice(3, 6) + " " + dg.slice(6); ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|vale|ok|confirmo|confirmar|correcto)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0];
          if (d.tipo === "llamada") { addBot("¡Listo, " + nm2 + "! ✅ El equipo de la clínica recibe tu pedido al instante y te llama al " + d.telefono + "." + closedNote() + "\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [CITA_CHIP, { t: "Otra pregunta", q: "__menu" }]); flow = null; return; }
          addBot("¡Listo, " + nm2 + "! ✅ Tu solicitud de cita está registrada.\nLa recepción te llamará al " + d.telefono + " para confirmarte el hueco exacto." + closedNote() + "\n\nSi prefieres adelantarte, puedes llamar al " + C.tel1 + " o al móvil " + C.movil + "." + "\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [{ t: "Cómo llegar", q: "dirección" }, { t: "Otra pregunta", q: "__menu" }]);
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
        t = (di === 0 || di === 6) ? "El " + DIAS[di] + " no figura en su horario publicado (es de lunes a viernes); te lo confirman en el " + C.tel1 + "." : "El " + DIAS[di] + " abren de 9:30 a 13:00 y de 17:00 a 20:00 (a mediodía cierran).";
        t += "\n\nHorario completo:\n" + HORARIO_TXT; break;
      }
    }
    if (e.now) { var n = madridNow(); t += isOpen(n) ? "\n\n🟢 Ahora mismo la clínica está abierta: " + C.tel1 + "." : "\n\n🌙 Ahora mismo está fuera de horario; abre " + nextOpening(n) + "."; }
    if (e.urg && !isOpen(madridNow())) t += "\n\n🌙 Ahora la clínica está fuera de horario (abre " + nextOpening(madridNow()) + "): llama en cuanto abra o deja tu teléfono y te llaman. Si es grave —traumatismo fuerte o hinchazón que dificulta tragar o respirar— no esperes: llama al 112.";
    addBot(t, (e.c || []).map(function (c) { return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot("Eso te lo confirma mejor el equipo de la clínica, así tienes el dato exacto. 😊\nLlámales al " + C.tel1 + " o al móvil " + C.movil + " (L–V 9:30–13:00 y 17:00–20:00), o deja tu teléfono y te llaman ellos." + closedNote(), [TEL1, TELM, LLAMADA_CHIP]);
  }
  function handle(t, chip) {
    if (t === "__menu") { addBot("Claro, ¿qué más quieres saber?", [CITA_CHIP, { t: "Horario", v: "horario" }, { t: "Tratamientos", v: "tratamientos" }, { t: "Cómo llegar", v: "dirección" }]); return; }
    addUser(chip ? chip.t : t);
    if (flow) { flowInput(chip && chip.v ? chip.v : t); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    var n = norm(t);
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot("¡Hola! ¿En qué te puedo ayudar? Puedo pedirte cita o contarte tratamientos, horario y cómo llegar.", [CITA_CHIP, { t: "Horario", v: "horario" }, { t: "Tratamientos", v: "tratamientos" }, LLAMADA_CHIP]); return; }
    if (/^tratamientos?$|que tratamientos|que haceis|servicios|especialidades/.test(n)) { addBot("Tratamientos personalizados para toda la familia, con tecnología avanzada:\n• Periodoncia (encías)\n• Implantología y cirugía oral\n• Ortodoncia\n• Estética\n• Limpieza bucal, revisiones y rehabilitación\nTratamiento multidisciplinar y primera visita gratuita (ortopantomografía + plan de tratamiento). ¿Sobre cuál quieres saber más?", [{ t: "Implantes", v: "implantes" }, { t: "Periodoncia", v: "periodoncia" }, { t: "Ortodoncia", v: "ortodoncia" }, CITA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && !/sin coste|gratis|gratuit|primera/.test(n) && (!bi || bi.s < 2 || /cita|reserv|agendar/.test(n))) { startCita(); return; }
    if (price) {
      if (/gratis|gratuit|primera|sin coste|valoracion|presupuesto/.test(n)) { reply(byId("valoracion"), t); return; }
      if (/financ|plazo|mes|pago/.test(n)) { reply(byId("financiacion"), t); return; }
      reply(byId("precio"), t); return;
    }
    if (bi) { reply(bi.e, t); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, isOpen: isOpen, madridNow: madridNow } };
})();
