/* Recepción 24 h · variante "bufete de inmigración" (EE.UU., en español) — demo 100% cliente, sin red.
   Configuración en window.R24_INM (ver build.py de cada firma). Reglas fijas:
   - No da asesoría legal ni opina sobre casos (la pregunta se anota para el abogado).
   - No pide número A, números de caso, SSN ni estatus migratorio detallado; si el usuario los escribe, se retiran del registro.
   - Persona detenida o audiencia cercana (<= 14 días) => pase URGENTE al teléfono real de la firma (tel:) y marca en el resumen.
   - Califica lo mínimo: tipo de caso, estado de residencia, fechas/plazos. Nombre deletreado, contacto, consulta (link placeholder).
   API: R24.open(), R24.openWa(texto), window.R24_SUMMARY(). Pruebas: ?r24now=AAAA-MM-DDTHH:MM (hora de la firma). */
(function () {
  var CFG = window.R24_INM; if (!CFG) return;
  var DOWS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"], DOWL = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var MON = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var MONL = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var TEL = CFG.phone.tel, TELTXT = CFG.phone.txt;
  var CASES = [
    ["asilo", "Asilo"], ["familia", "Residencia / petición familiar"], ["corte", "Corte de inmigración / deportación"],
    ["visau", "Visa U o Visa Juvenil (SIJ)"], ["ciudadania", "Ciudadanía"], ["permisos", "TPS o permiso de trabajo"],
    ["trabajo", "Visas de trabajo o inversión"], ["otra", "Otra área (criminal, familia, accidente, negocio)"], ["nose", "No estoy seguro/a"]
  ];
  function caseName(k) { for (var i = 0; i < CASES.length; i++) if (CASES[i][0] === k) return CASES[i][1]; return k; }
  var STATES = { al: "Alabama", ak: "Alaska", az: "Arizona", ar: "Arkansas", ca: "California", co: "Colorado", ct: "Connecticut", de: "Delaware", dc: "Washington D. C.", fl: "Florida", ga: "Georgia", hi: "Hawái", id: "Idaho", il: "Illinois", "in": "Indiana", ia: "Iowa", ks: "Kansas", ky: "Kentucky", la: "Luisiana", me: "Maine", md: "Maryland", ma: "Massachusetts", mi: "Míchigan", mn: "Minnesota", ms: "Misisipi", mo: "Misuri", mt: "Montana", ne: "Nebraska", nv: "Nevada", nh: "Nuevo Hampshire", nj: "Nueva Jersey", nm: "Nuevo México", ny: "Nueva York", nc: "Carolina del Norte", nd: "Dakota del Norte", oh: "Ohio", ok: "Oklahoma", or: "Oregón", pa: "Pensilvania", pr: "Puerto Rico", ri: "Rhode Island", sc: "Carolina del Sur", sd: "Dakota del Sur", tn: "Tennessee", tx: "Texas", ut: "Utah", vt: "Vermont", va: "Virginia", wa: "Washington", wv: "Virginia Occidental", wi: "Wisconsin", wy: "Wyoming" };
  var ST_ALIAS = { "new york": "ny", "nueva york": "ny", "new jersey": "nj", "nueva jersey": "nj", "north carolina": "nc", "carolina del norte": "nc", "south carolina": "sc", "carolina del sur": "sc", "new mexico": "nm", "nuevo mexico": "nm", "luisiana": "la", "louisiana": "la", "michigan": "mi", "misisipi": "ms", "mississippi": "ms", "misuri": "mo", "missouri": "mo", "hawai": "hi", "hawaii": "hi", "pensilvania": "pa", "pennsylvania": "pa", "oregon": "or", "puerto rico": "pr", "washington dc": "dc", "distrito de columbia": "dc", "denver": "co", "aurora": "co", "lakewood": "co", "miami": "fl", "houston": "tx", "dallas": "tx", "irving": "tx", "salt lake": "ut", "sandy": "ut", "eugene": "or", "south bend": "in", "los angeles": "ca", "chicago": "il" };

  // ---------- tiempo (zona de la firma) ----------
  function nowTz() {
    var qq = (location.search.match(/[?&]r24now=([^&]+)/) || [])[1];
    if (qq) { var p = decodeURIComponent(qq).match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
      if (p) return { y: +p[1], m: +p[2] - 1, d: +p[3], dow: new Date(+p[1], +p[2] - 1, +p[3]).getDay(), min: +p[4] * 60 + +p[5] }; }
    var f = new Intl.DateTimeFormat("en-US", { timeZone: CFG.tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    var o = {}; f.formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    return { y: +o.year, m: +o.month - 1, d: +o.day, dow: new Date(+o.year, +o.month - 1, +o.day).getDay(), min: (+o.hour % 24) * 60 + +o.minute };
  }
  function today() { var n = nowTz(); return new Date(n.y, n.m, n.d); }
  function isOpen(n) { return (CFG.hours[n.dow] || []).some(function (r) { return n.min >= r[0] && n.min < r[1]; }); }
  function fmtTime(min) { return Math.floor(min / 60) + ":" + ("0" + (min % 60)).slice(-2); }
  function nextOpen(n) {
    for (var i = 0; i < 8; i++) { var dt = new Date(n.y, n.m, n.d + i), rs = CFG.hours[dt.getDay()] || [];
      for (var j = 0; j < rs.length; j++) if (i > 0 || rs[j][0] > n.min) return (i === 0 ? "hoy" : i === 1 ? "mañana" : "el " + DOWL[dt.getDay()]) + " a las " + fmtTime(rs[j][0]) + " (" + CFG.tzLabel + ")"; }
    return "";
  }
  function fmtDate(dt) { return DOWL[dt.getDay()] + " " + dt.getDate() + " de " + MONL[dt.getMonth()]; }
  function daysFrom(dt) { return Math.round((dt - today()) / 864e5); }
  function parseDate(t) {
    var n = norm(t), base = today(), m;
    if (/\bpasado manana\b/.test(n)) return new Date(base.getFullYear(), base.getMonth(), base.getDate() + 2);
    if (/\bmanana\b/.test(n)) return new Date(base.getFullYear(), base.getMonth(), base.getDate() + 1);
    if (/\bhoy\b/.test(n)) return base;
    if ((m = n.match(/\ben (\d{1,2}) dias?\b/))) return new Date(base.getFullYear(), base.getMonth(), base.getDate() + +m[1]);
    if (/\b(la )?(proxima|siguiente) semana\b/.test(n)) return new Date(base.getFullYear(), base.getMonth(), base.getDate() + 7);
    function fix(d, mo, y) { var dt = new Date(y || base.getFullYear(), mo, d); if (!y && dt < base) dt = new Date(base.getFullYear() + 1, mo, d); return (dt.getMonth() === mo && dt.getDate() === d) ? dt : null; }
    if ((m = n.match(/\b(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?\b/))) { var y = m[3] ? (+m[3] < 100 ? 2000 + +m[3] : +m[3]) : 0; return fix(+m[1], +m[2] - 1, y); }
    if ((m = n.match(/\b(\d{1,2}) (?:de )?(ene|feb|mar|abr|may|jun|jul|ago|sep|set|oct|nov|dic)[a-z]*(?: (?:de |del )?(\d{4}))?\b/))) { var mi = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"].indexOf(m[2] === "set" ? "sep" : m[2]); return fix(+m[1], mi, m[3] ? +m[3] : 0); }
    for (var i = 0; i < 7; i++) if (new RegExp("\\b(el |este |proximo )?" + norm(DOWL[i]) + "\\b").test(n)) { var k = (i - base.getDay() + 7) % 7 || 7; return new Date(base.getFullYear(), base.getMonth(), base.getDate() + k); }
    return null;
  }

  // ---------- texto ----------
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9@.\/\s-]/g, " ").replace(/\s+/g, " ").trim(); }
  var RX = {
    detained: /\b(detenid[oa]s?|detuv\w*|deten(er|ieron)|arrestad[oa]s?|arrest\w*|la migra|lo agarr[oa]\w*|la agarr[oa]\w*|me agarr[oa]\w*|centro de detencion|esta pres[oa]|en la carcel|se (lo|la) llevo (ice|la migra))\b/,
    court: /\b(audiencia|corte|juez|jueza|juzgado|tribunal|master calendar|hearing|court|cita en (la )?corte)\b/,
    advice: /\b(puedo (pedir|sacar|aplicar|arreglar|salir|viajar|quedarme|trabajar|renovar)|califico|calificaria|tengo (chance|chances|oportunidad|posibilidad|derecho)|me van a (deportar|sacar|negar|aprobar|dar)|me (deportan|aprueban|niegan)|que (hago|debo hacer|me recomiendas|me conviene|me aconsejas)|es posible (que|arreglar)|cuanto (tarda|demora)|cuales son mis opciones|deberia|vale la pena|me conviene|que posibilidades|lo van a (deportar|soltar)|la van a (deportar|soltar)|van a deportar)\b/,
    talk: /\b(hablar con (un|una|el|la|alguien|una persona)|persona real|un humano|abogado ahora|llamar(los|les)?|quiero que me llamen|numero de telefono|telefono)\b/,
    price: /\b(cuanto (cobran|cuesta|sale|vale)|precio|precios|honorarios|costo|cobran|gratis|gratuita|pago|pagos)\b/,
    hours: /\b(horario|abren|abierto|cierran|a que hora)\b/,
    contact: /\b(correo|email|direccion|donde estan|oficina|oficinas)\b/,
    langq: /\b(ingles|english|hablan espanol|bilingue)\b/,
    restart: /^(empezar de nuevo|reiniciar|volver a empezar)$/,
    no: /^(no|nop|ninguna|ninguno|no tengo|nada|no hay|todavia no|aun no|no tengo fechas|nada mas|no gracias)$/,
    yes: /^(si|sip|claro|correcto|esta bien|ok|okay|asi es|perfecto|si esta bien|si, esta bien)$/,
    // datos sensibles que la recepción NO pide ni guarda
    anum: /\b(numero a|numero de extranjero|alien number|a-?number|numero de caso|receipt|numero de recibo|seguro social|ssn|social security)\b/,
    statusX: /\b(sin papeles|indocumentad[oa]s?|no tengo papeles|no tiene papeles|soy ilegal|es ilegal|estamos ilegales|visa vencida|se me vencio la visa|se le vencio la visa|entre sin (visa|papeles|inspeccion)|entramos sin|cruce (la frontera|el rio|ilegal\w*)|overstay|me quede despues)\b/
  };
  var SENS_RAW = /\b[aA][\s#:.-]?\d{3}[\s-]?\d{3}[\s-]?\d{2,3}\b|\b(?:IOE|EAC|WAC|LIN|SRC|MSC|NBC|YSC)\s?\d{8,10}\b|\b\d{3}-\d{2}-\d{4}\b/gi;
  var STATUS_RAW = /(sin papeles|indocumentad[oa]s?|no tengo papeles|no tiene papeles|soy ilegal|es ilegal|estamos ilegales|visa vencida|se me venci[oó] la visa|se le venci[oó] la visa|entr[eé] sin (visa|papeles|inspecci[oó]n)|entramos sin \w+|cruc[eé] (la frontera|el r[ií]o|ilegal\w*)|overstay|me qued[eé] despu[eé]s[^.,;]*)/gi;

  // ---------- estado ----------
  var d, flow, back, body, input, status, panel, launch, opened = false, waMode = false;
  function reset() {
    d = { channel: waMode ? "whatsapp (simulado)" : "chat web", urgent: null, urgentWhy: null, called: false, hearing: null, hearingDays: null,
      caseType: null, guess: null, state: null, stateCode: null, deadline: null, deadlineDays: null, detainedWhere: null, detainedWhen: null,
      story: [], questions: [], advice: 0, sensitiveRemoved: 0, statusOmitted: 0,
      name: null, phone: null, pref: null, email: null, modality: null, office: null, slot: null, slotTxt: null, done: false,
      asked: { aNumber: false, immigrationStatus: false } };
    flow = "urg"; back = null;
  }
  reset();
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  var q = [], busy = false;
  function addBot(t, chips, cls, html) { q.push([t, chips, cls, html]); if (!busy) pump(); }
  function pump() {
    var it = q.shift(); if (!it) { busy = false; return; } busy = true;
    var ty = el("div", "r24-typing", "Escribiendo…"); body.appendChild(ty); scroll();
    setTimeout(function () {
      ty.remove();
      var m = el("div", "r24-msg r24-bot" + (it[2] ? " " + it[2] : ""), it[3] ? it[0] : esc(it[0])); body.appendChild(m);
      if (it[1] && it[1].length) {
        var w = el("div", "r24-chips");
        it[1].forEach(function (c) {
          var b;
          if (c.href) { b = el("a", "r24-chip r24-call", esc(c.t)); b.href = c.href; b.onclick = function () { d.called = true; }; }
          else { b = el("button", "r24-chip" + (c.main ? " r24-main" : ""), esc(c.t)); b.type = "button"; b.onclick = function () { w.remove(); handle(c.v != null ? c.v : c.t, c); }; }
          if (c.k) b.setAttribute("data-k", c.k);
          w.appendChild(b);
        });
        body.appendChild(w);
      }
      scroll(); pump();
    }, Math.min(900, 350 + it[0].length * 2));
  }
  function telA() { return '<a href="tel:' + TEL + '">' + esc(TELTXT) + "</a>"; }

  // ---------- UI ----------
  function statusText() {
    var n = nowTz(), o = isOpen(n); status.className = "r24-status" + (o ? "" : " r24-closed");
    status.textContent = o ? "Oficina abierta ahora · este chat atiende 24/7" : "Oficina cerrada · abre " + nextOpen(n) + " · este chat atiende 24/7";
  }
  function build() {
    var B = CFG.base;
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = B + "recepcion-inmig.css"; document.head.appendChild(css);
    var ban = el("div", "r24-demo-banner", esc(CFG.banner)); ban.setAttribute("role", "note"); document.body.appendChild(ban);
    launch = el("button", "r24-launch"); launch.type = "button";
    launch.innerHTML = '<img class="r24-face" src="' + B + 'avatar.svg" alt=""><span>Consulta gratis · 24/7</span><span class="r24-dot"></span>';
    launch.setAttribute("aria-label", "Abrir la recepción virtual"); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción virtual");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + B + 'avatar.svg" alt=""></div><div class="r24-ht"><b><span class="r24-ttl">Recepción virtual</span> <span class="r24-online">en línea</span></b><small></small></div><button class="r24-x" type="button" aria-label="Cerrar">×</button></div>' +
      '<div class="r24-notice" role="note">⚖️ Asistente automático: <b>no es asesoría legal</b> ni crea una relación abogado-cliente. No compartas tu número A ni documentos aquí.</div>' +
      '<div class="r24-status"></div><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" autocomplete="off" maxlength="400" placeholder="Escribe aquí…"><button class="r24-send" type="submit">Enviar</button></form><div class="r24-legal"></div>';
    document.body.appendChild(panel);
    body = panel.querySelector(".r24-body"); input = panel.querySelector(".r24-in"); status = panel.querySelector(".r24-status");
    launch.onclick = function () { openWeb(); };
    panel.querySelector(".r24-x").onclick = function () { panel.classList.remove("r24-open"); launch.classList.remove("r24-hide"); };
    panel.querySelector("form").onsubmit = function (ev) { ev.preventDefault(); var t = input.value.trim(); if (!t) return; input.value = ""; handle(t); };
    document.addEventListener("click", function (ev) {
      var w = ev.target.closest && ev.target.closest("[data-r24-wa]"); if (w) { ev.preventDefault(); ev.stopPropagation(); openWa(w.getAttribute("data-r24-wa-text")); return; }
      var a = ev.target.closest && ev.target.closest("[data-r24-open]"); if (a) { ev.preventDefault(); ev.stopPropagation(); openWeb(); }
    }, true);
    paintWa();
  }
  function paintWa() {
    panel.classList.toggle("r24-wa", waMode);
    var sub = panel.querySelector(".r24-ht small");
    if (waMode) { panel.querySelector(".r24-ttl").textContent = CFG.firm; panel.querySelector(".r24-online").textContent = ""; sub.textContent = "WhatsApp " + CFG.wa.number + " · simulación"; panel.querySelector(".r24-legal").textContent = "Demo: WhatsApp simulado, no se envía nada. En producción responde en el número de WhatsApp de la firma."; }
    else { panel.querySelector(".r24-ttl").textContent = "Recepción virtual"; panel.querySelector(".r24-online").textContent = "en línea"; sub.textContent = CFG.firm + " · " + CFG.sub; panel.querySelector(".r24-legal").textContent = "Demo privada: no se envía ningún dato. Lo revisa una persona del equipo."; }
  }
  function open() {
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); statusText(); paintWa();
    setTimeout(function () { input.focus(); }, 50);
  }
  function openWeb() {
    if (waMode || !opened) { waMode = false; reset(); body.innerHTML = ""; opened = true; open(); greet(); } else open();
  }
  function openWa(pre) {
    if (!waMode || !opened) { waMode = true; reset(); body.innerHTML = ""; opened = true; open();
      if (pre) { addUser(pre); d.story.push(pre); addBot("¡Hola! 👋 Gracias por escribir a " + CFG.firm + ". Soy el asistente automático: te ayudo a pedir tu consulta gratuita para que el equipo te llame.\n\nNo doy asesoría legal ni opino sobre casos; eso lo hace el abogado."); addBot(urgQ(), urgChips()); }
      else greet();
    } else open();
  }
  function greet() {
    var n = nowTz();
    addBot("¡Hola! Soy la recepción virtual de " + CFG.firm + ". Te ayudo a pedir tu consulta gratuita con el equipo legal, en español y a cualquier hora." + (isOpen(n) ? "" : "\n\nAhora la oficina está cerrada (abre " + nextOpen(n) + "), pero puedes dejar todo listo aquí."));
    addBot("Importante: soy un asistente automático. No doy asesoría legal ni opiniones sobre casos, y esta conversación no crea una relación abogado-cliente. Solo tomo lo necesario para que un abogado te atienda.", null, "r24-rule");
    addBot(urgQ(), urgChips());
  }
  function urgQ() { return "Antes de empezar: ¿hay alguna urgencia?"; }
  function urgChips() { return [{ t: "Hay una persona detenida", v: "__det", k: "det" }, { t: "Tengo audiencia o cita en corte", v: "__court", k: "court" }, { t: "No es urgente, quiero una consulta", v: "__normal", k: "normal", main: true }, { t: "Prefiero llamar", v: "__talk", k: "talk" }]; }

  // ---------- pasos ----------
  function ask(step) {
    flow = step;
    if (step === "urg") addBot(urgQ(), urgChips());
    else if (step === "hearingDate") addBot("¿Qué fecha tiene la audiencia o cita? Por ejemplo: 28/10, «el 5 de noviembre» o «el lunes».", [{ t: "No sé la fecha", v: "__nodate" }]);
    else if (step === "type") addBot("¿Sobre qué tema es tu consulta?" + (d.guess ? "\n(Por lo que cuentas, podría ser «" + caseName(d.guess) + "»; elige la opción que corresponda.)" : ""), CASES.map(function (c) { return { t: c[1], v: "__ct_" + c[0], k: "ct_" + c[0], main: c[0] === d.guess }; }));
    else if (step === "state") addBot(d.urgent === "detenido" ? "¿En qué estado está detenida la persona (o dónde la detuvieron)?" : "¿En qué estado vives?", ["co", "tx", "fl", "ut", "or", "in"].map(function (s) { return { t: STATES[s], v: STATES[s] }; }).concat([{ t: "Otro estado", v: "__otherst" }, { t: "Vivo fuera de EE. UU.", v: "__abroad" }]));
    else if (step === "detWhen") addBot("¿Cuándo fue la detención? (aproximado está bien: «ayer», «el 15/10»…)", [{ t: "No lo sé", v: "__nodate" }]);
    else if (step === "deadline") addBot("¿Tienes alguna fecha importante? Por ejemplo: audiencia en corte, cita con USCIS o ICE, o una carta con fecha límite.", [{ t: "Sí, tengo una fecha", v: "__dlyes" }, { t: "No tengo fechas", v: "__dlno", main: true }, { t: "No estoy seguro/a", v: "__dlns" }]);
    else if (step === "deadlineDate") addBot("¿Qué fecha es y de qué se trata? (por ejemplo: «cita de biometría el 12/11»)");
    else if (step === "story") addBot("En una o dos frases, ¿qué te gustaría que el abogado sepa antes de la consulta? Es opcional.\nPor seguridad, no escribas números A, números de caso ni detalles de documentos.", [{ t: "Nada más, seguimos", v: "__nostory", main: true }]);
    else if (step === "name") addBot(d.urgent === "detenido" ? "Para que te llamen con prioridad: ¿cuál es tu nombre completo? (el de la persona que nos contacta)" : "Perfecto. ¿Cuál es tu nombre completo?");
    else if (step === "spell") addBot("Lo anoté así:\n" + spelled(d.name) + "\n¿Está bien escrito?", [{ t: "Sí, está bien", v: "__spok", main: true }, { t: "Corregir", v: "__spfix" }]);
    else if (step === "phone") addBot("Gracias, " + first() + ". ¿A qué teléfono te llamamos? (de EE. UU. o internacional con +código)");
    else if (step === "pref") addBot("¿Cómo prefieres que te contacten?", [{ t: "Llamada", v: "__pf_llamada", main: true }, { t: "WhatsApp", v: "__pf_whatsapp" }, { t: "Email", v: "__pf_email" }]);
    else if (step === "email") addBot(d.pref === "email" ? "¿Cuál es tu email?" : "¿Tienes un email para enviarte la confirmación? (opcional)", d.pref === "email" ? null : [{ t: "Prefiero no dar email", v: "__noemail" }]);
    else if (step === "modality") addBot("La consulta gratuita puede ser por videollamada (WhatsApp o Zoom) o en persona en una oficina, siempre con cita. ¿Qué prefieres?", [{ t: "Videollamada", v: "__md_video", main: true }, { t: "En persona", v: "__md_office" }]);
    else if (step === "office") addBot("¿En qué oficina?", officesSorted().map(function (o) { return { t: o, v: "__of_" + CFG.offices.indexOf(o) }; }));
    else if (step === "book") { addBot("Elige un horario para tu consulta gratuita (30 min):", [{ t: "Ver horarios disponibles", v: "__book", main: true }, { t: "Que me llamen para coordinar", v: "__nobook" }]); }
  }
  function officesSorted() {
    var st = (d.stateCode || "").toUpperCase(), o = CFG.offices.slice();
    return o.sort(function (a, b) { return (b.indexOf(", " + st) >= 0) - (a.indexOf(", " + st) >= 0); });
  }
  function first() { return (d.name || "").split(" ")[0]; }
  function spelled(name) { return name.split(/\s+/).map(function (w) { return Array.from(w.toLocaleUpperCase("es")).map(function (c) { return c === "-" ? "(guion)" : (c === "'" || c === "’") ? "(apóstrofo)" : c; }).join("-"); }).join("  ·  "); }
  function niceName(t) {
    var nm = t.replace(/^(me llamo|mi nombre es|soy|nombre:?)\s+/i, "").replace(/[.,;!]+$/, "").replace(/\s+/g, " ").trim();
    if (nm === nm.toLowerCase() || nm === nm.toUpperCase()) nm = nm.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, function (m, a, b) { return a + b.toUpperCase(); }).replace(/\b(De|Del|La|Los|Las|Y)\b/g, function (x) { return x.toLowerCase(); });
    return nm;
  }
  function fmtPhone(t) {
    var dg = t.replace(/[^\d+]/g, ""), n = dg.replace(/\D/g, "");
    if (/^\+?1?\d{10}$/.test(dg) && (n.length === 10 || (n.length === 11 && n[0] === "1"))) { n = n.slice(-10); return "+1 (" + n.slice(0, 3) + ") " + n.slice(3, 6) + "-" + n.slice(6); }
    if (dg[0] === "+" && n.length >= 10 && n.length <= 15) return "+" + n;
    return null;
  }
  function findState(t) {
    var n = norm(t), k;
    for (k in ST_ALIAS) if (n.indexOf(k) >= 0) return ST_ALIAS[k];
    for (k in STATES) if (n === k || new RegExp("\\b" + norm(STATES[k]) + "\\b").test(n)) return k;
    var m = n.match(/\b([a-z]{2})\b/); if (m && STATES[m[1]] && n.length <= 3) return m[1];
    return null;
  }
  function guessCase(t) {
    var n = norm(t);
    if (/\basilo\b|persecucion|amenaza/.test(n)) return "asilo";
    if (/visa u\b|victima|sij\b|juvenil|vawa/.test(n)) return "visau";
    if (/deport|corte|audiencia|juez|orden de salida|removal/.test(n)) return "corte";
    if (/ciudadan|naturaliz/.test(n)) return "ciudadania";
    if (/\btps\b|permiso de trabajo|work permit|daca/.test(n)) return "permisos";
    if (/green card|residencia|peticion|esposo|esposa|casad|hijo|hija|mama|papa|familiar/.test(n)) return "familia";
    if (/visa de trabajo|h-?1b|h-?2|inversion|eb-?\d|empleador/.test(n)) return "trabajo";
    if (/accidente|divorcio|custodia|dui|criminal|empresa|llc|negocio/.test(n)) return "otra";
    return null;
  }

  // urgencias
  function urgentCard(why) {
    var n = nowTz(), op = isOpen(n);
    var msg = (why === "detenido" ? "<b>Esto es prioritario.</b> Lo más rápido es llamar ahora al equipo de " + esc(CFG.firm) + " al " + telA() + " (llamada gratuita) y decir que hay una persona detenida."
      : "<b>La fecha es muy cercana" + (d.hearingDays != null ? " (" + (d.hearingDays <= 0 ? "es hoy" : d.hearingDays === 1 ? "es mañana" : "faltan " + d.hearingDays + " días") + ")" : "") + ".</b> Lo marco como URGENTE: lo mejor es llamar hoy al " + telA() + " para que el equipo lo revise cuanto antes.")
      + (op ? "" : "<br><br>Ahora la oficina está cerrada (horario publicado: lun–vie 9:00–18:00, " + esc(CFG.tzLabel) + "; abre " + esc(nextOpen(n)) + "). Puedes llamar y dejar mensaje; aquí dejo tu caso marcado como URGENTE para que te contacten primero.")
      + "<br><br>Si alguien corre peligro inmediato, llama al 911.";
    addBot(msg, [{ t: "📞 Llamar al " + TELTXT, href: "tel:" + TEL, k: "call" }, { t: "Seguir aquí y dejar mis datos", v: "__cont", main: true, k: "cont" }], "r24-urgent", true);
  }
  function setUrgent(why) { if (d.urgent !== "detenido") d.urgent = why; d.urgentWhy = why === "detenido" ? "Persona detenida" : "Audiencia/fecha en " + (d.hearingDays != null ? d.hearingDays + " días (" + fmtDate(d.hearingDate) + ")" : "fecha cercana"); }

  // ---------- reglas globales ----------
  function scrub(t) {
    var out = t, hit = false, st = false;
    out = out.replace(STATUS_RAW, function () { st = true; return "[situación migratoria omitida]"; });
    out = out.replace(SENS_RAW, function () { hit = true; return "[dato retirado]"; });
    if (RX.anum.test(norm(out))) { hit = true; out = out.replace(/(n[uú]mero\s+(a|de extranjero|de caso|de recibo)|a-?number|alien number|receipt|seguro social|ssn|social security)[^.,;\[]*/gi, "[dato retirado] "); }
    out = out.replace(/(\[dato retirado\]\s*)+/g, "[dato retirado] ").replace(/\s+([.,;])/g, "$1").trim();
    return { t: out, hit: hit, st: st };
  }
  function rules(t, n) {
    if (RX.advice.test(n)) {
      d.advice++; d.questions.push(t);
      addBot("Esa es una pregunta para el abogado: no puedo darte asesoría legal ni opinar sobre tu caso. La anoté para que te la respondan en la consulta gratuita.", null, "r24-rule");
      return true;
    }
    return false;
  }
  function sideIntent(n) {
    if (RX.price.test(n) && !/^__/.test(n)) { addBot("La primera consulta es gratuita (así lo publica la firma). Los honorarios dependen del tipo de caso y se confirman en un acuerdo por escrito antes de contratar; hay planes de pago y aceptan tarjetas, Zelle y pago automático."); return true; }
    if (RX.hours.test(n)) { addBot("Horario de oficina publicado: lunes a viernes, 9:00 a 18:00 (en esta demo, hora de Denver, " + CFG.tzLabel + "). Este chat te atiende 24/7 y deja tu consulta pedida."); return true; }
    if (RX.langq.test(n)) { addBot("Sí: el equipo es bilingüe (español e inglés) y la consulta puede ser en español."); return true; }
    if (RX.contact.test(n) && flow !== "email") { addBot("Teléfono (llamada gratuita): " + TELTXT + " · WhatsApp: " + CFG.wa.number + " · Email: " + CFG.email + "\nOficinas: " + CFG.offices.join(" · ") + ". Además, Colombia y México. Las visitas en persona son con cita."); return true; }
    return false;
  }

  // ---------- manejo ----------
  function handle(raw, chip) {
    var isChip = /^__/.test(raw);
    if (!isChip) {
      [].forEach.call(body.querySelectorAll(".r24-chips"), function (w) { if (!w.querySelector("a.r24-call")) w.remove(); });
      var s = scrub(raw); addUser(raw);
      if (s.hit) { d.sensitiveRemoved++; addBot("Gracias, pero por seguridad no guardo números A, números de caso ni de Seguro Social en este chat; lo retiré del registro. Si hace falta, el abogado te lo pedirá en la consulta.", null, "r24-rule"); }
      if (s.st) { d.statusOmitted++; addBot("No hace falta que me cuentes tu situación migratoria por aquí: eso se habla en privado con el abogado. No lo guardé.", null, "r24-rule"); }
      raw = s.t;
    } else if (chip) addUser(chip.t);
    var n = isChip ? raw : norm(raw);
    if (!isChip && RX.restart.test(n)) { reset(); body.innerHTML = ""; greet(); return; }
    // detención: en cualquier paso, si aún no está marcada
    if (!isChip && RX.detained.test(n) && d.urgent !== "detenido") { d.story.push(raw); goDetained(); return; }
    if (!isChip && rules(raw, n)) { if (flow === "urg" || flow === "story") { d.guess = d.guess || guessCase(raw); } setTimeout(function () { ask(flow); }, 250); return; }
    if (!isChip && RX.talk.test(n) && ["phone", "email", "name", "spell"].indexOf(flow) < 0) { talk(); return; }
    if (!isChip && ["name", "phone", "email", "deadlineDate", "hearingDate", "detWhen", "story"].indexOf(flow) < 0 && sideIntent(n)) { setTimeout(function () { ask(flow); }, 250); return; }
    step(raw, n, isChip);
  }
  function talk() {
    var n = nowTz();
    addBot("Claro. Puedes llamar al equipo al " + telA() + " (llamada gratuita)" + (isOpen(n) ? ", la oficina está abierta ahora." : ". Ahora la oficina está cerrada; abre " + esc(nextOpen(n)) + ".") + "<br>Si prefieres, sigo aquí y en 2 minutos dejo tu consulta pedida.", [{ t: "📞 Llamar al " + TELTXT, href: "tel:" + TEL, k: "call" }, { t: "Seguir aquí", v: "__cont", main: true }], null, true);
    back = flow; flow = "talkwait";
  }
  function goDetained() { setUrgent("detenido"); d.caseType = d.caseType || "corte"; urgentCard("detenido"); flow = "urgwait"; back = "state"; }
  function afterUrgent() { var b = back || "type"; back = null; ask(b); }
  function nextAfterCase() { ask("state"); }
  function step(raw, n, isChip) {
    switch (flow) {
      case "talkwait": case "urgwait":
        if (n === "__cont" || RX.yes.test(n)) { if (flow === "urgwait") afterUrgent(); else { var b = back || "urg"; back = null; ask(b); } return; }
        d.story.push(raw); var b2 = flow === "urgwait" ? (back || "type") : (back || "urg"); back = null; ask(b2); return;
      case "urg":
        if (n === "__det") { goDetained(); return; }
        if (n === "__court" || (!isChip && RX.court.test(n))) { if (!isChip) { d.story.push(raw); var dt0 = parseDate(raw); if (dt0) { hearing(dt0); return; } } d.caseType = "corte"; ask("hearingDate"); return; }
        if (n === "__talk") { talk(); return; }
        if (n === "__normal") { ask("type"); return; }
        d.story.push(raw); d.guess = guessCase(raw); ask("type"); return;
      case "hearingDate":
        if (n === "__nodate") { d.hearing = "fecha no indicada"; addBot("Sin problema. Anoto que tienes una audiencia o cita en corte sin fecha confirmada; el equipo te pedirá la fecha cuando te llame."); d.caseType = d.caseType || "corte"; setTimeout(function () { ask("state"); }, 200); return; }
        var dt = parseDate(raw); if (!dt) { addBot("No reconocí la fecha. Escríbela como día/mes (por ejemplo 28/10) o «el 5 de noviembre»."); return; }
        hearing(dt); return;
      case "type":
        var k = n.indexOf("__ct_") === 0 ? n.slice(5) : guessCase(raw);
        if (!k) { d.story.push(raw); addBot("Gracias. Elige la opción que más se parezca (si dudas, «No estoy seguro/a»):", CASES.map(function (c) { return { t: c[1], v: "__ct_" + c[0] }; })); return; }
        d.caseType = k;
        if (k === "otra") addBot("Anotado. Campos también atiende defensa criminal, familia, accidentes y negocios, pero esas áreas se atienden solo en algunos estados (los indicados en cada página de la firma). El equipo te confirma en la consulta si puede llevar tu caso.");
        else if (k === "corte" && !d.hearing) { ask("hearingDate"); return; }
        nextAfterCase(); return;
      case "state":
        if (n === "__otherst") { addBot("¿Cuál? Escribe el nombre del estado."); return; }
        if (n === "__abroad") { d.state = "Fuera de EE. UU."; d.stateCode = null; addBot("Anotado. La firma también tiene oficinas en Colombia y México y atiende consultas por videollamada."); return afterState(); }
        var sc = findState(raw); if (!sc) { addBot("No reconocí el estado. Escribe el nombre (por ejemplo «Colorado» o «Texas»)."); return; }
        d.stateCode = sc; d.state = STATES[sc];
        if (d.caseType !== "otra" && d.urgent !== "detenido") addBot("Gracias. La ley de inmigración es federal, así que la firma atiende casos de inmigración en todo el país (" + d.state + " incluido).");
        afterState(); return;
      case "detWhen":
        d.detainedWhen = n === "__nodate" ? "no lo sabe" : raw; ask("name"); return;
      case "deadline":
        if (n === "__dlno" || RX.no.test(n)) { d.deadline = "Ninguna indicada"; ask("story"); return; }
        if (n === "__dlns") { d.deadline = "No está seguro/a (revisar cartas)"; addBot("Sin problema. Si tienes cartas de USCIS, ICE o de la corte, tenlas a mano para la consulta: ahí el abogado revisa las fechas."); setTimeout(function () { ask("story"); }, 200); return; }
        if (n === "__dlyes") { ask("deadlineDate"); return; }
        deadlineText(raw); return;
      case "deadlineDate": deadlineText(raw); return;
      case "story":
        if (n !== "__nostory" && !RX.no.test(n)) { d.story.push(raw); d.guess = d.guess || guessCase(raw); }
        ask("name"); return;
      case "name":
        var nm = niceName(raw); if (nm.replace(/[^\p{L}]/gu, "").length < 2) { addBot("¿Me escribes tu nombre y apellido?"); return; }
        d.name = nm; ask("spell"); return;
      case "spell":
        if (n === "__spok" || RX.yes.test(n)) { ask("phone"); return; }
        if (n === "__spfix" || RX.no.test(n)) { flow = "name"; addBot("Escríbelo de nuevo, por favor, tal como aparece en tus documentos."); return; }
        d.name = niceName(raw); ask("spell"); return;
      case "phone":
        var ph = fmtPhone(raw); if (!ph) { addBot("Ese número no parece completo. Escribe los 10 dígitos (o +código de país)."); return; }
        d.phone = ph; if (d.urgent === "detenido") { d.pref = "llamada (urgente)"; ask("email"); return; } ask("pref"); return;
      case "pref":
        d.pref = n.indexOf("__pf_") === 0 ? n.slice(5) : (/whats/.test(n) ? "whatsapp" : /mail|correo/.test(n) ? "email" : "llamada");
        ask("email"); return;
      case "email":
        if (n === "__noemail" || /\b(no tengo|prefiero no|no quiero|sin email|no)\b/.test(n)) { if (d.pref === "email") { d.pref = "llamada"; } d.email = null; return afterEmail(); }
        var m = raw.match(/[^\s@]+@[^\s@]+\.[a-z]{2,}/i); if (!m) { addBot("Ese email no parece válido. Revísalo, por favor."); return; }
        d.email = m[0].toLowerCase(); afterEmail(); return;
      case "modality":
        if (n === "__md_office" || /persona|oficina/.test(n)) { d.modality = "En persona"; ask("office"); return; }
        d.modality = "Videollamada (WhatsApp o Zoom)"; ask("book"); return;
      case "office":
        var oi = n.indexOf("__of_") === 0 ? +n.slice(5) : -1;
        if (oi < 0) CFG.offices.forEach(function (o, i) { if (oi < 0 && norm(o).split(/[ ,]+/).some(function (w) { return w.length > 3 && n.indexOf(w) >= 0; })) oi = i; });
        if (oi < 0) { ask("office"); return; }
        d.office = CFG.offices[oi]; ask("book"); return;
      case "book":
        if (n === "__book") { openBooking(); return; }
        d.slotTxt = "Pidió que la llamen para coordinar"; finish(); return;
      case "done":
        d.story.push(raw); addBot("Lo agregué a tu ficha para el abogado. ¿Algo más? Si no, ya está todo listo."); return;
    }
  }
  function hearing(dt) {
    d.hearingDate = dt; d.hearingDays = daysFrom(dt); d.hearing = fmtDate(dt); d.caseType = d.caseType || "corte";
    if (d.hearingDays <= 14) { setUrgent("audiencia"); urgentCard("audiencia"); flow = "urgwait"; back = "state"; }
    else { addBot("Anotado: audiencia o cita el " + d.hearing + " (faltan " + d.hearingDays + " días)."); setTimeout(function () { ask("state"); }, 200); }
  }
  function deadlineText(raw) {
    d.deadline = raw; var dt = parseDate(raw);
    if (dt) { d.deadlineDays = daysFrom(dt); d.deadline = raw + " → " + fmtDate(dt) + " (" + d.deadlineDays + " días)";
      if (d.deadlineDays <= 14 && !d.urgent) { d.hearingDays = d.deadlineDays; d.hearingDate = dt; setUrgent("audiencia"); urgentCard("audiencia"); flow = "urgwait"; back = "story"; return; } }
    addBot("Anotado para el abogado."); setTimeout(function () { ask("story"); }, 200);
  }
  function afterState() {
    if (d.urgent === "detenido") { ask("detWhen"); return; }
    if (d.hearing || d.urgent) { d.deadline = d.deadline || (d.hearing ? "Audiencia/cita: " + d.hearing : null); ask("story"); return; }
    ask("deadline");
  }
  function afterEmail() {
    if (d.urgent === "detenido") { d.slotTxt = "Llamada prioritaria (sin cita: urgente)"; finish(); return; }
    ask("modality");
  }

  // ---------- reserva simulada ----------
  function sheet(html) { var ov = el("div", "r24-ov"), sh = el("div", "r24-sheet", html); ov.appendChild(sh); panel.appendChild(ov); return { ov: ov, sh: sh, close: function () { ov.remove(); } }; }
  function openBooking() {
    var n = nowTz(), days = [], SL = [540, 600, 660, 780, 840, 900, 960, 1020];
    for (var i = 1; days.length < 3 && i < 15; i++) { var dt = new Date(n.y, n.m, n.d + i), w = dt.getDay(); if (CFG.hours[w] && CFG.hours[w].length) days.push(dt); }
    if (d.urgent === "audiencia" && isOpen(n)) days.unshift(new Date(n.y, n.m, n.d));
    var h = "<h4>Consulta gratuita · 30 min · " + esc(d.modality + (d.office ? " · " + d.office : "")) + "</h4><div class=\"r24-ph\">Demo: en producción aquí se abre la agenda real de la firma (" + esc(CFG.links.consult) + ")</div>";
    days.forEach(function (dt, i) { h += '<div class="r24-day">' + esc(DOWS[dt.getDay()] + " " + dt.getDate() + " " + MON[dt.getMonth()]) + ' <small>(' + esc(CFG.tzLabel) + ')</small></div><div class="r24-slots">' + SL.filter(function (m, j) { return (i + j) % 3 !== 2 && (dt.getDate() !== n.d || m > n.min + 60); }).map(function (m) { return '<button type="button" class="r24-slot" data-s="' + i + "|" + m + '">' + fmtTime(m) + "</button>"; }).join("") + "</div>"; });
    h += '<label>Nombre</label><input class="r24-f" readonly value="' + esc(d.name) + '"><label>Teléfono</label><input class="r24-f" readonly value="' + esc(d.phone) + '"><div class="r24-row"><button type="button" class="r24-btn r24-sec" data-a="back">Volver</button><button type="button" class="r24-btn" data-a="ok" disabled>Confirmar</button></div>';
    var s = sheet(h), pick = null, okb = s.sh.querySelector('[data-a="ok"]');
    [].forEach.call(s.sh.querySelectorAll(".r24-slot"), function (b) { b.onclick = function () { [].forEach.call(s.sh.querySelectorAll(".r24-slot"), function (x) { x.classList.remove("r24-sel"); }); b.classList.add("r24-sel"); pick = b.getAttribute("data-s").split("|"); okb.disabled = false; }; });
    s.sh.querySelector('[data-a="back"]').onclick = function () { s.close(); ask("book"); };
    okb.onclick = function () {
      var dt = days[+pick[0]]; d.slot = dt.getFullYear() + "-" + ("0" + (dt.getMonth() + 1)).slice(-2) + "-" + ("0" + dt.getDate()).slice(-2) + "T" + fmtTime(+pick[1]);
      d.slotTxt = fmtDate(dt) + ", " + fmtTime(+pick[1]) + " (" + CFG.tzLabel + ")"; s.close();
      addBot("✅ Listo, " + first() + ": consulta gratuita pedida para el " + d.slotTxt + " · " + d.modality + (d.office ? " en " + d.office : "") + ".\nTe confirmarán por " + (d.pref || "llamada") + (d.email ? " y te llegará un email a " + d.email : "") + ". Enlace para ver o cambiar la cita: " + CFG.links.consult, null, "r24-ok");
      finish();
    };
  }
  function finish() {
    flow = "done"; d.done = true;
    if (d.urgent === "detenido") addBot("Listo, " + first() + ". Dejé el caso marcado como URGENTE (persona detenida) para que el equipo te llame al " + d.phone + " lo antes posible" + (isOpen(nowTz()) ? "." : ", apenas abra la oficina (" + nextOpen(nowTz()) + ").") + "\nSi puedes, llama también al " + TELTXT + ". No necesitas enviar documentos ni el número A por aquí.", null, "r24-ok");
    else if (!d.slot) addBot("Listo, " + first() + ". El equipo te llamará al " + d.phone + " para coordinar tu consulta gratuita.", null, "r24-ok");
    addBot(summaryHtml(), null, "r24-owner", true);
  }
  function summaryHtml() {
    function row(k, v) { return "<div><b>" + esc(k) + ":</b> " + v + "</div>"; }
    var h = "<div><b>📋 Resumen para el abogado</b> · " + esc(CFG.firm) + "</div>";
    h += row("Prioridad", d.urgent ? '<span class="r24-flag">URGENTE</span> ' + esc(d.urgentWhy) + (d.called ? " · tocó «Llamar»" : "") : '<span class="r24-flag r24-norm">Normal</span>');
    h += row("Tipo de caso", esc(d.caseType ? caseName(d.caseType) : "—"));
    h += row(d.urgent === "detenido" ? "Estado (detención)" : "Estado de residencia", esc(d.state || "—"));
    if (d.urgent === "detenido") h += row("Detención", esc(d.detainedWhen || "—"));
    if (d.hearing) h += row("Audiencia / cita", esc(d.hearing + (d.hearingDays != null ? " (" + d.hearingDays + " días)" : "")));
    if (d.deadline && !(d.hearing && /^Audiencia/.test(d.deadline))) h += row("Fechas / plazos", esc(d.deadline));
    if (d.story.length) h += row("Lo que contó", esc(d.story.join(" / ")));
    if (d.questions.length) h += row("Preguntas para el abogado (no respondidas)", d.questions.map(function (x) { return "“" + esc(x) + "”"; }).join(" · "));
    h += row("Nombre", esc(d.name || "—") + (d.name ? " <small>(" + esc(spelled(d.name)) + ")</small>" : ""));
    h += row("Teléfono", esc(d.phone || "—") + (d.pref ? " · prefiere " + esc(d.pref) : ""));
    h += row("Email", esc(d.email || "no dio"));
    h += row("Consulta", esc(d.slotTxt || "—") + (d.modality ? " · " + esc(d.modality) : "") + (d.office ? " · " + esc(d.office) : ""));
    h += row("Canal", esc(d.channel) + " · español");
    h += '<div class="r24-sec-t">Sin asesoría legal ✓ · No se pidió número A ni estatus migratorio ✓' + (d.sensitiveRemoved ? " · datos sensibles retirados: " + d.sensitiveRemoved : "") + (d.statusOmitted ? " · situación migratoria omitida: " + d.statusOmitted : "") + "<br>Siguiente paso: " + (d.urgent ? "<b>llamar de inmediato</b>" : "confirmar la consulta") + "</div>";
    return h;
  }
  window.R24_SUMMARY = function () { return JSON.parse(JSON.stringify(d)); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: function () { openWeb(); }, openWa: function (t) { openWa(t); } };
})();
