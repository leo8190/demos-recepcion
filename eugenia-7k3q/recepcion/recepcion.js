/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Clínica Eugenia de Montijo — DEMO privada.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Todas las respuestas salen de textos publicados en clinicaeugenia.com (oct. 2026). */
(function () {
  "use strict";
  var C = {
    nombre: "Clínica Eugenia de Montijo",
    tel1: "608 14 88 95", tel1h: "+34608148895",
    tel2: "914 615 253", tel2h: "+34914615253",
    wa: "34608148895",
    email: "clinicaeugenia@clinicaeugenia.com",
    dir: "C/ Eugenia de Montijo, 57 · 28025 Madrid (Carabanchel)",
    maps: "https://www.google.com/maps?q=Calle+de+Eugenia+de+Montijo+57+Madrid"
  };
  // Horario publicado: L, M, J 10–14 y 16–20:30 · X, V 10–14 y 16–20 · S y D cerrado. (0 = domingo)
  var H = { 1: [[600, 840], [960, 1230]], 2: [[600, 840], [960, 1230]], 3: [[600, 840], [960, 1200]],
            4: [[600, 840], [960, 1230]], 5: [[600, 840], [960, 1200]], 0: [], 6: [] };
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var HORARIO_TXT = "• Lunes, martes y jueves: 10:00–14:00 y 16:00–20:30\n• Miércoles y viernes: 10:00–14:00 y 16:00–20:00\n• Sábados y domingos: cerrado";

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
  var WA_CHIP = { t: "WhatsApp " + C.tel1, wa: true };
  var TEL_CHIP = { t: "Llamar " + C.tel1, tel: C.tel1h };
  var KB = [
    { id: "valoracion", k: ["primera visita", "primera consulta", "valoracion", "diagnostico", "gratis", "gratuita", "sin coste", "coste primera", "presupuesto", "revisar presupuesto", "segunda opinion"],
      a: "Sí: la primera visita de valoración y diagnóstico es gratuita y sin compromiso (0 €).\nEl Dr. Rada te explora, te explica lo que ve con las pruebas delante y te entrega un presupuesto cerrado por escrito, con opciones y financiación si la necesitas. Te lo llevas a casa y decides con calma.\nSi tienes un presupuesto de otra clínica, tráelo y lo revisamos contigo punto por punto.", c: [CITA_CHIP, { t: "Financiación", q: "financiación" }] },
    { id: "financiacion", k: ["financiacion", "financiais", "financiar", "plazos", "pagar a plazos", "cuotas", "al mes", "mensual", "pago aplazado"],
      a: "Sí, financiamos todos los tratamientos a tu medida (sujeto a estudio y aprobación):\n• Implantes: desde 38,63 €/mes\n• Estética dental: desde 30,90 €/mes\n• Ortodoncia e Invisalign: desde 97,85 €/mes\nEl precio final se cierra por escrito tras la valoración, que es gratuita.", c: [CITA_CHIP, { t: "¿La valoración es gratis?", q: "primera visita gratis" }] },
    { id: "precio_implante", k: ["precio implante", "cuesta implante", "vale implante", "coste implante", "implante corona precio", "incluye corona", "presupuesto incluye"],
      a: "Depende de tu caso (número de piezas, hueso y tipo de corona), por eso la web no publica un precio cerrado por implante.\nLo que sí te puedo decir: tras la valoración gratuita te damos un presupuesto cerrado por escrito que detalla qué incluye (implante, pilar y corona), sin letra pequeña, y hay financiación desde 38,63 €/mes (sujeta a estudio y aprobación).", c: [CITA_CHIP] },
    { id: "precio_orto", k: ["precio ortodoncia", "cuesta ortodoncia", "precio invisalign", "cuesta invisalign", "vale invisalign", "precio bracket", "cuesta bracket"],
      a: "La ortodoncia (brackets o Invisalign) tiene financiación desde 97,85 €/mes (sujeto a estudio y aprobación). El precio final se cierra tras la valoración gratuita, según tu caso.", c: [CITA_CHIP] },
    { id: "precio_estetica", k: ["precio carilla", "cuesta carilla", "precio blanqueamiento", "cuesta blanqueamiento", "precio estetica", "cuesta estetica", "precio diseño sonrisa"],
      a: "La estética dental (carillas, blanqueamiento, diseño de sonrisa) tiene financiación desde 30,90 €/mes (sujeto a estudio y aprobación). El precio exacto se da tras la valoración gratuita; el estudio y la simulación de tu nueva sonrisa son sin coste en la primera visita.", c: [CITA_CHIP] },
    { id: "precio_sedacion", k: ["precio sedacion", "cuesta sedacion", "coste sedacion"],
      a: "El precio de la sedación depende del tipo (óxido nitroso, oral o intravenosa) y del tratamiento que necesites. En la valoración te damos un presupuesto claro y sin compromiso, con financiación a tu medida.", c: [CITA_CHIP] },
    { id: "implantes", k: ["implante", "implantes", "carga inmediata", "dientes fijos", "falta diente", "perdido diente", "arcada completa", "reponer diente"],
      a: "Sí, somos especialistas en implantes dentales: desde reponer un solo diente hasta una arcada completa con carga inmediata.\nSe hacen con anestesia local y, si quieres, sedación consciente, para que sea sin dolor ni ansiedad. Te lo valora el Dr. Rada sin compromiso y hay financiación desde 38,63 €/mes.", c: [CITA_CHIP, { t: "¿Cuánto cuesta?", q: "precio implante" }, { t: "¿Duele?", q: "duele implante" }] },
    { id: "duele_implante", k: ["duele implante", "dolor implante", "implante duele"],
      a: "No. Se realiza con anestesia local y, si lo necesitas, con sedación consciente opcional, para que el tratamiento sea totalmente relajado.", c: [{ t: "¿Qué es la sedación?", q: "sedación consciente" }, CITA_CHIP] },
    { id: "dura_implante", k: ["cuanto dura implante", "duracion implante", "implante dura"],
      a: "Con buena higiene y revisiones, un implante puede durar muchísimos años. El mantenimiento y las revisiones periódicas son la clave; te explicamos los cuidados.", c: [CITA_CHIP] },
    { id: "ortodoncia", k: ["ortodoncia", "bracket", "brackets", "alinear dientes", "dientes torcidos", "retenedor", "ortodoncia adulto"],
      a: "Hacemos ortodoncia para todas las edades: brackets e Invisalign (ortodoncia invisible), con seguimiento del Dr. Rada.\nLa mayoría de tratamientos duran entre 12 y 24 meses según la complejidad, y hay financiación desde 97,85 €/mes. En la primera visita valoramos qué te conviene más.", c: [CITA_CHIP, { t: "Invisalign", q: "invisalign" }] },
    { id: "invisalign", k: ["invisalign", "ortodoncia invisible", "alineador", "alineadores", "invisible"],
      a: "Sí, ofrecemos Invisalign. Los alineadores son transparentes y apenas se notan; puedes notar algo de presión los primeros días de cada alineador, pero no duele como un ajuste de brackets.\nFinanciación desde 97,85 €/mes; el precio final se cierra tras la valoración.", c: [CITA_CHIP] },
    { id: "estetica", k: ["estetica", "carilla", "carillas", "blanqueamiento", "blanquear", "diseño sonrisa", "dientes blancos", "composite", "porcelana"],
      a: "En estética dental hacemos carillas (de porcelana o composite), blanqueamiento y diseño de sonrisa, buscando siempre un resultado natural.\nCon el diseño de sonrisa te enseñamos una previsión del resultado antes de tocar nada; el estudio y la simulación son sin coste en tu primera visita. Financiación desde 30,90 €/mes.", c: [CITA_CHIP] },
    { id: "blanq_seguro", k: ["blanqueamiento daña", "blanqueamiento seguro", "blanqueamiento sensibilidad", "estropea esmalte"],
      a: "Realizado por profesionales, el blanqueamiento es seguro. Lo planificamos según tu caso para cuidar el esmalte y evitar sensibilidad.", c: [CITA_CHIP] },
    { id: "sedacion", k: ["sedacion", "sedacion consciente", "dormir", "gas risa", "oxido nitroso", "anestesia", "miedo", "fobia", "pánico", "ansiedad", "nervios", "nauseas"],
      a: "Trabajamos con sedación consciente: te mantiene relajado y consciente, sin ansiedad, y combinada con anestesia local no sientes dolor. Se hace bajo control profesional y monitorización, tras valorar tu historia clínica.\nHay tres tipos: inhalatoria (óxido nitroso, el «gas de la risa»), oral o intravenosa controlada por anestesista.\nSi vienes con miedo acumulado, dilo nada más entrar: la primera visita es solo mirar y hablar.", c: [CITA_CHIP, { t: "¿Puedo conducir después?", q: "conducir después sedación" }, { t: "¿Cuánto cuesta?", q: "precio sedación" }] },
    { id: "conducir", k: ["conducir", "coche despues", "acompañado", "volver casa"],
      a: "Con óxido nitroso la recuperación es muy rápida y normalmente puedes hacer vida normal. Con sedación oral o intravenosa te recomendamos venir acompañado y no conducir ese día.", c: [CITA_CHIP] },
    { id: "urgencia", k: ["urgencia", "urgente", "dolor", "duele muela", "me duele", "emergencia", "roto diente", "partido diente", "protesis rota"],
      a: "Sí, atendemos urgencias dentales. Llama al " + "608 14 88 95 (o al 914 615 253) y te dicen al momento cuándo pueden verte: con dolor no se espera.\nMientras tanto, si te duele mucho una muela: tu analgésico habitual, frío por fuera y evita lo muy frío, caliente o dulce.", urg: true, c: [TEL_CHIP, WA_CHIP, { t: "Se me ha caído un diente", q: "diente caído golpe" }, { t: "Tengo un flemón", q: "flemón" }] },
    { id: "diente_caido", k: ["diente caido", "caido diente", "golpe diente", "se me ha caido", "diente arrancado"],
      a: "Si es un diente definitivo: cógelo por la corona (no por la raíz), enjuágalo sin frotar y vuelve a ponerlo en su sitio o guárdalo en leche o suero. Acude de inmediato: el tiempo es clave. Llama ya al 608 14 88 95.", urg: true, c: [TEL_CHIP] },
    { id: "flemon", k: ["flemon", "hinchazon", "hinchado", "infeccion", "antibiotico"],
      a: "Un flemón no se cura solo: indica una infección que hay que tratar. Frío y analgésico ayudan mientras te atendemos, pero no te automediques con antibióticos. Llama al 608 14 88 95 para que te vean cuanto antes.", urg: true, c: [TEL_CHIP, WA_CHIP] },
    { id: "general", k: ["limpieza", "limpieza dental", "revision", "revisiones", "empaste", "empastes", "caries", "odontologia general", "chequeo", "sarro"],
      a: "Sí: revisiones, limpiezas, empastes, endodoncia y periodoncia durante todo el año. Recomendamos revisión y limpieza al menos una vez al año. La primera valoración es sin coste.\nLa web no publica el precio de la limpieza ni de los empastes; te lo dicen en la valoración o por WhatsApp.", c: [CITA_CHIP, WA_CHIP] },
    { id: "periodoncia", k: ["encia", "encias", "sangran", "sangrado", "periodoncia", "piorrea", "gingivitis", "periodontitis"],
      a: "Si te sangran las encías conviene revisarlo: tratamos la gingivitis y la periodontitis para que no pierdas tus dientes. El diagnóstico es sin coste.", c: [CITA_CHIP] },
    { id: "endodoncia", k: ["endodoncia", "matar nervio", "conductos", "nervio diente"],
      a: "Con la endodoncia (tratamiento de conductos) salvamos tu diente en lugar de extraerlo, y sin dolor.", c: [CITA_CHIP] },
    { id: "cirugia", k: ["extraccion", "sacar muela", "muela juicio", "muelas juicio", "cirugia", "injerto hueso", "quitar diente"],
      a: "En cirugía bucal hacemos extracciones, muelas del juicio e injertos de hueso, con sedación consciente si lo necesitas, sin malos ratos.", c: [CITA_CHIP] },
    { id: "ninos", k: ["niño", "niños", "hijo", "hija", "hijos", "infantil", "odontopediatria", "bebe", "dientes leche", "pequeño"],
      a: "Sí, somos el dentista de muchos niños de Carabanchel, con paciencia y cariño para que no cojan miedo. La 1ª visita infantil es gratis.\n• Primera revisión: hacia el primer año o cuando salen los primeros dientes.\n• Ortodoncia: conviene una primera valoración hacia los 6-7 años.", c: [CITA_CHIP] },
    { id: "horario", k: ["horario", "hora abris", "abris", "abierto", "cerrais", "cierra", "a que hora", "tarde", "mañana abierto"],
      a: "Nuestro horario:\n" + HORARIO_TXT, now: true, c: [CITA_CHIP] },
    { id: "finde", k: ["sabado", "domingo", "fin semana", "festivo"],
      a: "Los sábados y domingos la clínica está cerrada. Horario:\n" + HORARIO_TXT + "\n(La web no detalla el horario en festivos; si lo necesitas, confírmalo con la recepción.)", c: [CITA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "como llego", "llegar", "metro", "autobus", "bus", "aparcar", "aparcamiento", "parking", "calle", "mapa", "zona"],
      a: "Estamos en " + C.dir + ", a un paso del metro Eugenia de Montijo (Línea 5): sales del metro y estás prácticamente en la puerta. Varias líneas de la EMT paran muy cerca y en coche suele ser más fácil aparcar que en el centro.", c: [{ t: "Ver en Google Maps", url: C.maps }, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "llamar", "numero", "contacto", "email", "correo", "mail", "whatsapp", "hablar persona", "recepcion", "humano"],
      a: "Puedes contactar así:\n• Teléfono: " + C.tel1 + " · " + C.tel2 + "\n• WhatsApp: " + C.tel1 + "\n• Email: " + C.email, c: [WA_CHIP, TEL_CHIP] },
    { id: "franquicia", k: ["franquicia", "cadena", "quien atiende", "doctor", "dentista", "rada", "experiencia", "opiniones", "reseñas", "equipo", "años"],
      a: "No somos franquicia: somos una clínica independiente de barrio en Carabanchel. Te atiende el Dr. José Rada (colegiado nº 11.124, COEM), con más de 30 años de experiencia, y el mismo equipo de siempre. Tenemos un 4,6★ con más de 140 opiniones en Google.", c: [CITA_CHIP] },
    { id: "traer", k: ["que traer", "traer", "llevar primera cita", "necesito llevar", "documentacion", "radiografia"],
      a: "No necesitas nada imprescindible, pero si los tienes ayudan: radiografías o pruebas recientes de otra clínica, la lista de medicación que tomas y, si vienes a comparar, el presupuesto de otra clínica.", c: [CITA_CHIP] },
    { id: "seguros", k: ["seguro", "mutua", "adeslas", "sanitas", "dkv", "asisa", "mapfre", "aseguradora", "seguridad social"],
      a: "La web de la clínica no indica si trabaja con seguros o mutuas, así que prefiero no darte un dato incorrecto. Te lo confirman en un momento por WhatsApp o teléfono.", c: [WA_CHIP, TEL_CHIP] },
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
      var m = el("div", "r24-msg r24-bot" + (cls ? " " + cls : ""), esc(t).replace(/\b(608 14 88 95|914 615 253)\b/g, function (x) { return '<a href="tel:+34' + x.replace(/\s/g, "") + '">' + x + "</a>"; }));
      body.appendChild(m);
      if (chips && chips.length) {
        var w = el("div", "r24-chips");
        chips.forEach(function (c) {
          var b;
          if (c.wa) { b = el("a", "r24-chip r24-wa", "💬 " + esc(c.t)); b.href = "https://wa.me/" + C.wa; b.target = "_blank"; b.rel = "noopener"; }
          else if (c.tel) { b = el("a", "r24-chip", "📞 " + esc(c.t)); b.href = "tel:" + c.tel; }
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
    var ban = el("div", "r24-demo-banner", "Demo privada preparada para Clínica Eugenia de Montijo"); ban.setAttribute("role", "note"); document.body.appendChild(ban);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + (window.R24_BASE || "recepcion/") + 'avatar.svg" alt="Recepcionista"><span>Recepción 24 h</span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", "Abrir la recepción 24 h"); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + (window.R24_BASE || "recepcion/") + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b>Recepción 24 h <span class="r24-online">● en línea</span></b><small>Clínica Eugenia de Montijo · Carabanchel</small></div><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" placeholder="Escribe tu pregunta…" autocomplete="off" maxlength="300"><button class="r24-send" type="submit">Enviar</button></form><div class="r24-legal">Asistente automático de demostración · tus datos no se envían a ningún sitio</div>';
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
      addBot("¡Hola! 👋 Soy el asistente virtual con IA de la Clínica Eugenia de Montijo. Te ayudo a pedir cita y a resolver dudas sobre tratamientos, financiación, horario o cómo llegar.\n¿En qué te ayudo?",
        [CITA_CHIP, { t: "Primera visita gratis", q: "primera visita gratis" }, { t: "Financiación", q: "financiación" }, { t: "Miedo al dentista", q: "sedación" }, { t: "Urgencia", q: "urgencia" }, { t: "Horario y dirección", q: "horario" }]);
    }
    setTimeout(function () { input.focus(); }, 50);
  }

  // ---------- Flujo de cita ----------
  var TRAT = ["Primera visita / valoración", "Revisión y limpieza", "Implantes", "Ortodoncia / Invisalign", "Estética dental", "Urgencia / dolor", "Niños", "Otro"];
  function startCita() {
    flow = { step: "nombre", d: {} };
    addBot("¡Perfecto! Te ayudo a pedir cita en 4 pasos. La primera valoración es gratuita y sin compromiso.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)");
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
      var tarde = /mi[eé]rcoles|viernes/i.test(flow.d.dia) ? "Tarde (16:00–20:00)" : (/lunes|martes|jueves/i.test(flow.d.dia) ? "Tarde (16:00–20:30)" : "Tarde (desde las 16:00)");
      addBot("¿Mañana o tarde?", [{ t: "Mañana (10:00–14:00)", v: "Mañana (10:00–14:00)", flow: true }, { t: tarde, v: tarde, flow: true }, { t: "Me da igual", v: "Mañana o tarde, indiferente", flow: true }]);
    }
    else if (step === "telefono") addBot(flow.d.tipo === "llamada" ? "Perfecto, " + flow.d.nombre + ". ¿A qué teléfono te llaman?" : "Último paso: ¿a qué móvil te escribimos por WhatsApp para confirmarte la cita?");
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
        if (/urgen|dolor/.test(n)) { addBot("Si tienes mucho dolor, lo más rápido es llamar al 608 14 88 95" + (isOpen(madridNow()) ? " ahora mismo" : " en cuanto abramos (" + nextOpening(madridNow()) + ")") + ". Aun así, dejo tu solicitud preparada.", [TEL_CHIP]); setTimeout(function () { ask("dia"); }, 900); return; }
        ask("dia"); return;
      case "dia":
        if (/sabado|domingo/.test(n)) { addBot("Los sábados y domingos la clínica está cerrada. ¿Te viene bien algún día de lunes a viernes?"); setTimeout(function () { ask("dia"); }, 500); return; }
        d.dia = t.slice(0, 60); ask("franja"); return;
      case "franja":
        if (/noche|21|22|23/.test(n)) { addBot("Por la tarde atendemos hasta las 20:30 (lunes, martes y jueves) o las 20:00 (miércoles y viernes). ¿Mañana o tarde?"); setTimeout(function () { ask("franja"); }, 500); return; }
        d.franja = (/manana/.test(n) && !/igual|tarde/.test(n)) ? "Mañana (10:00–14:00)" : t.slice(0, 60); ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().-]/g, "").replace(/^0034/, "+34");
        if (!/^(\+34)?[6789]\d{8}$/.test(ph)) { addBot("Ese número no me cuadra. Escríbelo con 9 cifras, por ejemplo 612 345 678."); return; }
        var dg = ph.replace(/^\+34/, ""); d.telefono = dg.slice(0, 3) + " " + dg.slice(3, 6) + " " + dg.slice(6); ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|vale|ok|confirmo|confirmar|correcto)/.test(n)) {
          if (d.tipo === "llamada") { addBot("¡Listo, " + d.nombre.split(" ")[0] + "! ✅ El equipo de la clínica recibe tu pedido al instante y te llama al " + d.telefono + "." + closedNote() + "\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [CITA_CHIP, { t: "Otra pregunta", q: "__menu" }]); flow = null; return; }
          var nm2 = d.nombre.split(" ")[0];
          addBot("¡Listo, " + nm2 + "! ✅ Tu solicitud de cita está lista.\nLa recepción te confirmará la cita por WhatsApp al " + d.telefono + " con el hueco exacto." + closedNote() + "\n\nRecuerda: la primera valoración es gratuita. Si tienes radiografías recientes o un presupuesto de otra clínica, tráelos.\n\n(Versión de demostración: esta solicitud no se ha enviado a la clínica.)", [{ t: "Cómo llegar", q: "dirección" }, { t: "Otra pregunta", q: "__menu" }]);
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
    addBot("Eso te lo confirma mejor el equipo de la clínica, así tienes el dato exacto. 😊\nEscríbeles por WhatsApp al " + C.tel1 + ", llama al " + C.tel2 + " o deja tu teléfono y te llaman ellos." + closedNote(), [WA_CHIP, TEL_CHIP, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip) {
    if (t === "__menu") { addBot("Claro, ¿qué más quieres saber?", [CITA_CHIP, { t: "Financiación", v: "financiación" }, { t: "Horario", v: "horario" }, { t: "Tratamientos", v: "tratamientos" }]); return; }
    addUser(chip ? chip.t : t);
    if (flow) { flowInput(chip && chip.v ? chip.v : t); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    var n = norm(t);
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot("¡Hola! ¿En qué te puedo ayudar? Puedo darte cita, contarte la financiación, el horario o resolver dudas de tratamientos.", [CITA_CHIP, { t: "Financiación", v: "financiación" }, { t: "Horario", v: "horario" }, LLAMADA_CHIP]); return; }
    if (/tratamientos|que haceis|servicios|especialidades/.test(n)) { addBot("Somos una clínica con todas las especialidades: implantes, ortodoncia e Invisalign, estética dental (carillas, blanqueamiento, diseño de sonrisa), odontología general (revisiones, limpiezas, empastes), periodoncia, endodoncia, odontopediatría, cirugía bucal y sedación consciente. ¿Sobre cuál quieres saber más?", [{ t: "Implantes", v: "implantes" }, { t: "Ortodoncia", v: "ortodoncia" }, { t: "Estética", v: "estética dental" }, { t: "Niños", v: "niños" }, CITA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|reserv|agendar/.test(n))) { startCita(); return; }
    if (price) {
      var tbl = [[/implant/, "precio_implante"], [/invisalign|ortodon|bracket|alinead/, "precio_orto"], [/carilla|blanque|estetic|sonrisa/, "precio_estetica"], [/sedac/, "precio_sedacion"], [/primera|valoracion|consulta|visita|diagnost/, "valoracion"], [/financ|plazo|mes/, "financiacion"]];
      for (var i = 0; i < tbl.length; i++) if (tbl[i][0].test(n)) { reply(KB.filter(function (e) { return e.id === tbl[i][1]; })[0], t); return; }
      addBot("La web de la clínica solo publica la financiación (implantes desde 38,63 €/mes, estética desde 30,90 €/mes, ortodoncia desde 97,85 €/mes) y que la primera valoración es gratis (0 €). Del resto de tratamientos no hay precio publicado, así que no te voy a dar una cifra inventada: tras la valoración te dan un presupuesto cerrado por escrito, o te orientan por WhatsApp.", [CITA_CHIP, WA_CHIP]);
      return;
    }
    if (bi) { fails = 0; reply(bi.e, t); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, isOpen: isOpen, madridNow: madridNow } };
})();
