/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Medina's Automotive (taller familiar desde 1983, 2 talleres en Phoenix, AZ) — DEMO privada, bilingüe ES/EN.
   Sale de plantilla-widget/recepcion.base.js (reglas del brief 18/10 + R24-HUMANO), en la variante de talleres ES/EN en «usted» (All About Diesel).
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica medinasautomotive.com (revisada el 20/10/2026): Home, Services, Our Team, Location y Quick Estimate (EN y /es).
   - #1 1910 E McDowell Rd, Phoenix, AZ 85003 · 602-252-5454; #2 4508 N 7th Ave, Phoenix, AZ 85013 · 602-286-0405 (la de 7th Ave la dirige Ernesto,
     hijo de Héctor Medina). Email service@medinasautomotive.com. Formularios «Quick Estimate» (presupuesto por email, con foto) y «Contact Us». Sin WhatsApp.
   - Horario (todas sus páginas, el mismo para los 2): lunes a viernes 8:00 AM – 5:00 PM; sábado 8:00 AM – 2:00 PM; domingo cerrado (hora de Arizona,
     America/Phoenix, sin horario de verano).
   - Servicios: frenos, motor, transmisión (automática y manual; remanufacturadas con garantía), aire acondicionado (1234yf), sistema eléctrico,
     suspensión; reparación completa (eléctrica, mecánica y de computadora), cambios de aceite y, en emergencias (batería, llanta pinchada, no arranca),
     «haremos todo lo posible». Familiar desde 1983; Héctor Medina, de los primeros técnicos ASE de Texas.
   Sin precios (la recepción no da ninguno), sin WhatsApp; no promete grúa (solo registra si el vehículo anda, está parado o necesita grúa), alineación,
   venta de llantas, carrocería, condiciones de financiamiento, formas de pago, tiempos, atención sin cita ni nada que su web no liste. Español en «usted». */
(function () {
  "use strict";
  var C = {
    nombre: "Medina's Automotive", corto: "Medina's Automotive",
    s1: { n: "#1 McDowell", dir: "1910 E McDowell Rd, Phoenix, AZ 85003", tel: "602-252-5454", telh: "+16022525454", maps: "https://www.google.com/maps/dir/?api=1&destination=Medina%27s+Automotive+1910+E+McDowell+Rd+Phoenix+AZ+85003" },
    s2: { n: "#2 7th Ave", dir: "4508 N 7th Ave, Phoenix, AZ 85013", tel: "602-286-0405", telh: "+16022860405", maps: "https://www.google.com/maps/dir/?api=1&destination=Medina%27s+Automotive+4508+N+7th+Ave+Phoenix+AZ+85013" }
  };
  C.tel = C.s1.tel; C.telh = C.s1.telh;
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  // Horario publicado (minutos desde las 0:00, hora de Arizona). 0 = domingo: cerrado. Sábado: 8:00 a 2:00.
  var LV = [[480, 1020]], SA = [[480, 840]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 6: SA, 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller, el mismo en los 2 talleres (hora de Arizona):\n• Lunes a viernes: 8:00 a.m. – 5:00 p.m.\n• Sábado: 8:00 a.m. – 2:00 p.m.\n• Domingo: cerrado",
      "Shop hours, same at both locations (Arizona time):\n• Monday–Friday: 8:00 AM – 5:00 PM\n• Saturday: 8:00 AM – 2:00 PM\n• Sunday: closed");
  }
  var HCORTO = { es: "lunes a viernes de 8 a 5 y sábado de 8 a 2", en: "Mon–Fri 8–5, Sat 8–2" };
  function hc() { return HCORTO[lang]; }
  function nowTx() {
    var q = (location.search.match(/[?&]r24now=([^&]+)/) || [])[1];
    if (q) { var p = decodeURIComponent(q).match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
      if (p) return { y: +p[1], m: +p[2] - 1, d: +p[3], dow: new Date(+p[1], +p[2] - 1, +p[3]).getDay(), min: +p[4] * 60 + +p[5] }; }
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Phoenix", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
    var o = {}; f.formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    var y = +o.year, m = +o.month - 1, d = +o.day;
    return { y: y, m: m, d: d, dow: new Date(y, m, d).getDay(), min: (+o.hour % 24) * 60 + +o.minute };
  }
  function hm(min) { var h = Math.floor(min / 60), mm = ("0" + (min % 60)).slice(-2), pm = h >= 12; h = h % 12 || 12; return h + ":" + mm + " " + (lang === "en" ? (pm ? "PM" : "AM") : (pm ? "p.m." : "a.m.")); }
  function isOpen(n) { return (H[n.dow] || []).some(function (r) { return n.min >= r[0] && n.min < r[1]; }); }
  function closeAt(n) { var r = (H[n.dow] || []).filter(function (r) { return n.min >= r[0] && n.min < r[1]; })[0]; return r ? r[1] : 0; }
  function nextOpening(n) {
    for (var i = 0; i < 8; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay(), rs = H[dow] || [];
      for (var j = 0; j < rs.length; j++) if (i > 0 || rs[j][0] > n.min)
        return lang === "en" ? (i === 0 ? "today" : (i === 1 ? "tomorrow (" + DIAS.en[dow] + ")" : DIAS.en[dow])) + " at " + hm(rs[j][0])
          : (i === 0 ? "hoy" : (i === 1 ? "mañana " + DIAS.es[dow] : "el " + DIAS.es[dow])) + " a las " + hm(rs[j][0]);
    }
    return "";
  }
  function dayLabel(dt) { var dn = DIAS[lang][dt.getDay()]; return lang === "en" ? dn + ", " + MESES.en[dt.getMonth()] + " " + dt.getDate() : dn.charAt(0).toUpperCase() + dn.slice(1) + " " + dt.getDate() + " " + MESES.es[dt.getMonth()]; }
  function nextWorkdays(n, k) {
    var out = [];
    if ((H[n.dow] || []).some(function (r) { return n.min < r[0] || (n.min >= r[0] && r[1] - n.min >= 90); })) out.push({ dow: n.dow, label: L("Hoy", "Today") });
    for (var i = 1; out.length < k && i < 14; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay();
      if ((H[dow] || []).length) out.push({ dow: dow, label: dayLabel(dt) });
    }
    return out;
  }

  var STOP = ("a al algo algun alguna como con cual de del el en es esta este esto estoy hay la las lo los me mi mis o para pero por que quiero se si sin su sus te tu un una uno unos y ya yo usted ustedes tienen tiene puedo podria saber gustaria hola buenas buenos dias tardes noches favor le les " +
    "the a an and or to of in on for my me i is are do does you your can could would like want please hi hello hey there it its at with what how which have has get need").split(" ");
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñ$\/\s]/g, " ").replace(/\s+/g, " ").trim(); }
  function stem(w) { if (w.length > 4) w = w.replace(/(es|s)$/, ""); return w; }
  function toks(s) { return norm(s).replace(/\//g, " ").split(" ").filter(function (w) { return w && STOP.indexOf(w) < 0; }).map(stem); }
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
    var pt = toks(ph); if (!pt.length) return 0; var sc = 0;
    for (var i = 0; i < pt.length; i++) {
      if (ut.indexOf(pt[i]) >= 0) { sc += 1; continue; }
      if (!ut.some(function (u) { return tokMatch(pt[i], u); })) return 0;
      sc += 0.7;
    }
    return sc;
  }



  var CITA_CHIP = { a: "cita", get t() { return L("🔧 Presupuesto o cita", "🔧 Estimate or appointment"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen o escriban", "📲 Call or text me back"); } };
  function aviso() { return L("🔔 El taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL1() { return { t: L("Llamar a #1 McDowell", "Call #1 McDowell"), tel: C.s1.telh }; }
  function TEL2() { return { t: L("Llamar a #2 7th Ave", "Call #2 7th Ave"), tel: C.s2.telh }; }
  function MAPS1() { return { t: L("📍 Cómo llegar a #1 McDowell", "📍 Directions to #1 McDowell"), url: C.s1.maps }; }
  function MAPS2() { return { t: L("📍 Cómo llegar a #2 7th Ave", "📍 Directions to #2 7th Ave"), url: C.s2.maps }; }
  function PAGE(es, en, f) { return function () { return { t: L(es, en), url: (lang === "es" ? "es-" : "") + f, self: true }; }; }
  var SERVP = PAGE("Ver la página de servicios", "See the services page", "services.html");
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y direcciones", "🕐 Hours & locations", "horario y direcciones", "hours and locations");
  var PARADO = Q("🚗 Mi carro no arranca", "🚗 My car won't start", "mi carro no arranca", "my car won't start");
  function telsTxt() { return "#1 McDowell: " + C.s1.tel + " · #2 7th Ave: " + C.s2.tel; }
  function dirA() { return L("Tienen 2 talleres en Phoenix:\n📍 #1 McDowell: " + C.s1.dir + " · 📞 " + C.s1.tel + "\n📍 #2 7th Ave: " + C.s2.dir + " · 📞 " + C.s2.tel + "\nLos dos trabajan juntos y tienen el mismo horario.",
    "They have 2 shops in Phoenix:\n📍 #1 McDowell: " + C.s1.dir + " · 📞 " + C.s1.tel + "\n📍 #2 7th Ave: " + C.s2.dir + " · 📞 " + C.s2.tel + "\nBoth work together and keep the same hours."); }
  function horarioA() {
    var n = nowTx(), s = isOpen(n) ? L("🟢 Ahora están abiertos, hasta las " + hm(closeAt(n)) + ".", "🟢 They're open now, until " + hm(closeAt(n)) + ".")
      : L("🌙 Ahora está cerrado" + (n.dow === 0 ? " (domingo)" : "") + "; abre " + nextOpening(n) + ". Igual le tomo el pedido ahora y el taller lo recibe al instante.", "🌙 It's closed right now" + (n.dow === 0 ? " (Sunday)" : "") + "; opens " + nextOpening(n) + ". I can still take your request now and the shop gets it instantly.");
    return horarioTxt() + "\n" + s;
  }
  function serviciosA() {
    return L("Lo que publica el taller (familiar desde 1983, 2 talleres en Phoenix):\n• Frenos (pastillas cerámicas o semimetálicas, discos, cambio de líquido de frenos)\n• Motor (sensores, correas, distribución, presión de aceite)\n• Transmisión automática y manual (también remanufacturadas con garantía, embragues)\n• Aire acondicionado (también refrigerante 1234yf para vehículos nuevos)\n• Sistema eléctrico (alternador, motor de arranque, batería, fusibles, encendido, bujías)\n• Suspensión (suspensión delantera independiente, struts y amortiguadores)\n• Diagnóstico de fallas eléctricas, mecánicas y de computadora (tablero, faros)\n• Cambios de aceite\n¿Qué le pasa a su vehículo?",
      "What the shop lists (family-owned since 1983, 2 shops in Phoenix):\n• Brakes (ceramic or semi-metallic pads, rotors, brake flushes)\n• Engine (sensors, belts, timing, oil pressure)\n• Automatic and manual transmissions (incl. remanufactured units with warranty, clutches)\n• Air conditioning (incl. 1234yf refrigerant for newer vehicles)\n• Electrical (alternators, starters, batteries, fuses, ignition, spark plugs)\n• Suspension (independent front suspension, struts and shocks)\n• Electrical, mechanical and computer diagnostics (instrument cluster, headlights)\n• Oil changes\nWhat's going on with your vehicle?");
  }
  function noListA() {
    return L("Eso no aparece entre los servicios de su web, así que no se lo voy a asegurar. Llame al taller (" + telsTxt() + "; " + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "That isn't among the services on their website, so I won't promise it. Call the shop (" + telsTxt() + "; " + hc() + "), or leave your number and they'll get back to you.");
  }
  function noPubA() {
    return L("Eso su web no lo dice, así que no se lo voy a inventar: se lo confirma el taller. Llame al " + C.s1.tel + " o al " + C.s2.tel + " (" + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "Their site doesn't say, so I won't make it up: the shop will confirm. Call " + C.s1.tel + " or " + C.s2.tel + " (" + hc() + "), or leave your number and they'll get back to you.");
  }
  function S(es, en) { return function () { return L(es, en); }; }
  var KB = [
    { id: "diagnostico", k: ["diagnostico", "computadora", "escaner", "escanear", "check engine", "luz del motor", "luz de motor", "luces del tablero", "tablero", "testigo", "codigo", "codigos", "falla rara", "diagnostic", "diagnostics", "computer", "scan", "check engine light", "code", "codes", "warning light", "dashboard", "instrument cluster"],
      a: S("Sí: diagnóstico. Su web dice que tienen la experiencia para leer rápido los diagramas eléctricos y hacer las pruebas necesarias hasta resolver la falla «sin cambiar piezas a ciegas», sea eléctrica, mecánica o de la computadora (por ejemplo, el tablero de instrumentos o faros que alumbran poco). ¿Le dejo pedida la revisión?",
        "Yes: diagnostics. Their site says they have the expertise to quickly decode wiring diagrams and run a battery of tests to solve the problem \"without simply replacing parts\", whether it's electrical, mechanical or computer-related (e.g. the instrument cluster or dimming headlights). Want me to request a check?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "transmision", k: ["transmision", "caja", "caja de cambios", "patina", "patinando", "no cambia", "cambios duros", "embrague", "clutch", "automatica", "manual", "remanufacturada", "transmission", "slipping", "rough shifting", "won t shift", "remanufactured", "gearbox"],
      a: S("Sí: se especializan en transmisiones. Su web dice que primero leen los códigos de la computadora, revisan la presión y el estado del líquido y, si hace falta, bajan el cárter para ver si hay limaduras. Arreglan automáticas y manuales (varillaje, palanca, embrague, retenes) y tienen transmisiones remanufacturadas con garantía. Qué conviene en su caso se lo dice el taller después de revisarla. ¿Le dejo pedida la revisión?",
        "Yes: they specialize in transmissions. Their site says they first check the computer codes and the fluid pressure and condition and, if needed, pull the pan to look for metal shavings. They fix automatics and manuals (linkage, shifter, clutches, seals) and stock remanufactured transmissions with warranty. What makes sense for you, the shop tells you after checking it. Want me to request a check?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "motor", k: ["motor", "falla", "fallas", "tironea", "tiembla", "pierde fuerza", "sin fuerza", "perdida de potencia", "humo", "correa", "correa de distribucion", "distribucion", "sensor", "cigueñal", "presion de aceite", "se recalienta", "sobrecalienta", "ruido en el motor", "engine", "misfire", "chugging", "shaking", "loss of power", "no power", "smoke", "timing belt", "belt", "crankshaft", "oil pressure", "overheating", "engine noise"],
      a: S("Sí: reparación de motores. Su web explica que el motor depende de muchos sensores, correas, mangueras de vacío y engranajes: por ejemplo, una correa de distribución corrida medio diente hace que el motor tironee y pierda potencia, y un sensor del cigüeñal dañado puede dejarlo sin arrancar sin marcar código. También atienden problemas de presión de aceite y lodo. ¿Le dejo pedida la revisión?",
        "Yes: engine repair. Their site explains the engine relies on many sensors, belts, vacuum hoses and gears: e.g. a timing belt that slips half a tooth causes heavy chugging and power loss, and a bad crankshaft sensor can leave it unable to start without throwing a code. They also handle oil pressure problems and sludge. Want me to request a check?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nomaneja", k: ["no arranca", "no prende", "no enciende", "no anda", "varado", "varada", "me quede", "bateria descargada", "se descargo la bateria", "llanta pinchada", "se pincho", "ponchada", "ponchadura", "emergencia", "urgente", "grua", "remolque", "remolcar", "won t start", "wont start", "no start", "not running", "stranded", "broke down", "dead battery", "flat tire", "emergency", "urgent", "tow", "towing", "tow truck"],
      a: function () { var n = nowTx(); return L("Lo siento. Su web dice que, si tiene una emergencia (batería descargada, llanta pinchada o el carro que no arranca a la mañana), «haremos todo lo posible» para que vuelva a andar y para hacerle lugar. No publica servicio de grúa, así que no se lo voy a prometer; lo que sí hago: le dejo el pedido con el vehículo marcado como parado (o que necesita grúa) y el taller le llama o le escribe." + (isOpen(n) ? " Ahora están abiertos: también puede llamar (" + telsTxt() + ")." : " Ahora está cerrado (abre " + nextOpening(n) + "); su pedido le llega igual al instante."),
        "Sorry to hear that. Their site says that in an emergency (dead battery, flat tire, or a car that won't start in the morning) \"we will try our best\" to get you up and running and squeeze you in. It doesn't list towing, so I won't promise it; what I can do: log your request with the vehicle marked as down (or needing a tow) and the shop calls or texts you back." + (isOpen(n) ? " They're open now: you can also call (" + telsTxt() + ")." : " It's closed now (opens " + nextOpening(n) + "); your request still reaches them instantly.")); }, c: [CITA_CHIP, LLAMADA_CHIP, TEL1, TEL2] },
    { id: "frenos", k: ["freno", "frenos", "balatas", "pastillas", "discos", "rotores", "rechina", "rechinan", "chillan", "pedal blando", "pedal esponjoso", "liquido de frenos", "fuga de liquido", "brake", "brakes", "pads", "rotors", "squeak", "squeal", "grinding", "mushy pedal", "spongy", "brake fluid", "brake flush"],
      a: S("Sí: frenos. Su web dice que ofrecen varias opciones de pastillas y discos de primera calidad (de cerámicas a semimetálicas, y discos de alto rendimiento), además del cambio de líquido de frenos. Si tiene una fuga de líquido o el pedal se siente blando, conviene arreglarlo cuanto antes. ¿Le dejo pedida la revisión?",
        "Yes: brakes. Their site says they offer premium pad and rotor options (ceramic to semi-metallic pads, and performance rotors), plus brake flushes. If you have a fluid leak or a mushy pedal, it's important to take care of it as soon as possible. Want me to request a check?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "electrico", k: ["electrico", "electrica", "electricidad", "cableado", "cables", "alternador", "motor de arranque", "marcha", "solenoide", "bateria", "fusible", "fusibles", "bujias", "encendido", "luces", "faros", "electrical", "wiring", "alternator", "starter", "solenoid", "battery", "fuse", "fuses", "spark plugs", "ignition", "lights", "headlights"],
      a: S("Sí: sistema eléctrico. Su web lista reparación o cambio de alternadores, fallas de motor de arranque, solenoide y batería, revisión de fusibles y cables sueltos, de la correa del alternador, del sistema de encendido y de las bujías. ¿Le dejo pedida la revisión?",
        "Yes: electrical. Their site lists repairing or replacing alternators, starter, solenoid and battery problems, checking fuses and loose wires, the alternator belt, the ignition system and spark plugs. Want me to request a check?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "ac", k: ["aire acondicionado", "aire", "a c", "ac", "clima", "no enfria", "compresor", "recarga", "gas del aire", "freon", "1234yf", "calor", "air conditioning", "not cold", "not cooling", "compressor", "recharge", "refrigerant", "heat"],
      a: S("Sí: aire acondicionado. Su web dice que reparan cualquier falla del aire acondicionado, instalan sistemas nuevos y, al inspeccionarlo, ajustan las conexiones de las mangueras y buscan fugas. Además tienen refrigerante 1234yf y el equipo para los vehículos más nuevos. Con el calor de Phoenix, mejor no esperar. ¿Le dejo pedida la revisión?",
        "Yes: A/C. Their site says they repair any A/C issue, install new systems and, during the inspection, tighten hose connections and test for leaks. They're also equipped with 1234yf refrigerant and the machinery for newer vehicles. With Phoenix heat, best not to wait. Want me to request a check?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "suspension", k: ["suspension", "amortiguadores", "struts", "puntales", "direccion", "se va de lado", "golpetea", "rebota", "shocks", "steering", "front suspension", "bouncy", "clunk"],
      a: S("Sí: suspensión. Su web dice que reparan la suspensión delantera independiente y cambian struts y amortiguadores en todo tipo de vehículos, para que maneje cómodo y con control. ¿Le dejo pedida la revisión?",
        "Yes: suspension. Their site says they repair independent front suspensions and replace struts and shocks on all vehicles, for a comfortable ride and full control. Want me to request a check?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "aceite", k: ["aceite", "cambio de aceite", "sintetico", "filtro", "mantenimiento", "preventivo", "servicio de rutina", "oil", "oil change", "synthetic", "filter", "maintenance", "routine"],
      a: S("Sí: su web dice «venga también para el cambio de aceite»: saben qué grado y tipo de aceite necesita su motor (y que con aceite totalmente sintético un motor puede durar mucho más). Le dejo pedido el día que prefiera; abren de lunes a viernes de 8 a 5 y el sábado de 8 a 2.",
        "Yes: their site says \"you should also come to us for oil changes\": they know the grade and type of oil your engine needs (and that on fully synthetic oil an engine can last much longer). I can request the day you prefer; they're open Mon–Fri 8–5 and Saturday 8–2."), c: [CITA_CHIP, HOR] },
    { id: "llantas", k: ["llanta", "llantas", "neumatico", "neumaticos", "gomas", "alineacion", "alinear", "balanceo", "desgaste de llantas", "rodamiento", "rodamientos", "baleros", "tire", "tires", "alignment", "balance", "wheel bearing", "wheel bearings", "tread"],
      a: S("Su web dice que, al revisar vehículos usados, detectan cosas como rodamientos de rueda dañados, desgaste de llantas y problemas de alineación, y que en una emergencia le ayudan si se le pinchó una llanta. No publica venta de llantas ni un servicio de alineación, así que eso no se lo voy a asegurar: se lo confirma el taller. ¿Le dejo pedida la revisión?",
        "Their site says that when checking used vehicles they spot things like bad wheel bearings, tire tread wear and alignment issues, and that in an emergency they'll help if you have a flat tire. It doesn't list tire sales or an alignment service, so I won't promise that: the shop will confirm. Want me to request a check?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nolist", k: ["carroceria", "hojalateria", "pintura", "choque", "chapisteria", "abolladura", "emisiones", "smog", "moto", "motos", "a domicilio", "mecanico a domicilio", "vidrios", "parabrisas", "polarizado", "body work", "paint", "collision", "dent", "emissions", "motorcycle", "mobile mechanic", "windshield", "tint"], a: noListA, c: [TEL1, TEL2, LLAMADA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "mecanica", "mecanico", "taller", "services", "what do you fix", "what do you do", "repairs", "mechanic"], a: serviciosA, c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "presupuesto gratis", "es gratis", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "free estimate"],
      a: S("Los precios se los da el taller: esta recepción no da precios ni los inventa. Su web dice que tratan de ajustarse a su presupuesto y ofrecen opciones flexibles de repuestos, y que con el formulario «Presupuesto rápido» le mandan el presupuesto por correo. Lo que puedo hacer: dejarle pedido el presupuesto con su vehículo y lo que le pasa, y le contactan.",
        "Pricing comes from the shop: this front desk doesn't quote or make up prices. Their site says they try to fit your budget and offer flexible parts options, and that the \"Quick Estimate\" form gets you an estimate by email. What I can do: request the estimate with your vehicle and what's going on, and they'll get back to you."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "garantia", k: ["garantia", "garantias", "garantizado", "warranty", "warranties", "guarantee"],
      a: S("Su web dice que sus transmisiones remanufacturadas vienen con garantía, igual que las de fábrica. Los detalles (qué cubre, plazos) y la garantía de otros trabajos no los publica: se los confirma el taller.",
        "Their site says their remanufactured transmissions come with warranties just like factory units. The details (coverage, terms) and warranties on other work aren't published: the shop will confirm."), c: [LLAMADA_CHIP, CITA_CHIP] },
    { id: "financiamiento", k: ["financiamiento", "financiar", "financing", "finance", "a plazos", "plan de pagos", "cuotas", "credito", "payment plan", "credit"],
      a: S("Su web tiene botones «Financiamiento» (en inglés «Click for financing») en el menú y en el pie de cada taller, que llevan a la solicitud de financiamiento. Las condiciones no las publica, así que no se las voy a inventar: se las confirma el taller.",
        "Their site has \"Click for financing\" buttons in the menu and in each shop's footer that open the financing application. The terms aren't published, so I won't make them up: the shop will confirm."), c: [LLAMADA_CHIP, CITA_CHIP] },
    { id: "nopub", k: ["zelle", "efectivo", "tarjeta", "formas de pago", "como pago", "cuanto tarda", "cuanto tiempo", "mismo dia", "carro de cortesia", "cash", "card", "payment", "how long", "same day", "loaner"], a: noPubA, c: [TEL1, TEL2, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llegar", "llegar sin avisar", "necesito cita", "dejar el carro", "without appointment", "drop by", "stop by", "drop off", "need an appointment"],
      a: S("Su web no dice si atienden sin cita; lo que publica es «Programe su reparación», el formulario de presupuesto, los teléfonos y el horario (lunes a viernes de 8 a 5, sábado de 8 a 2, domingo cerrado). Para no ir en balde, le dejo aquí pedida la cita y el taller le confirma, o llame (" + telsTxt() + ").",
        "Their site doesn't say whether they take walk-ins; it shows \"Schedule a repair\", the estimate form, the phone numbers and hours (Mon–Fri 8–5, Sat 8–2, closed Sunday). To be safe, I can request the appointment here and the shop confirms, or call (" + telsTxt() + ")."), c: [CITA_CHIP, TEL1, TEL2] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue", "bilingual", "se habla"],
      a: S("Su web tiene versión en español; si en el taller le atienden en español no lo dice, así que se lo confirman ellos. Aquí le atiendo en los dos idiomas (botón EN arriba).", "Their site has a Spanish version; it doesn't say whether staff speak Spanish, so the shop will confirm. I can help you in English or Spanish (ES button at the top)."), c: [CITA_CHIP] },
    { id: "historia", k: ["dueno", "quien", "quienes son", "familia", "familiar", "ase", "certificado", "certificados", "experiencia", "historia", "confianza", "desde cuando", "concesionario", "dealer", "owner", "who", "family", "certified", "experience", "trust", "since when", "dealership"],
      a: S("Medina's Automotive es un taller familiar desde 1983. Su web cuenta que Héctor Medina fue uno de los primeros técnicos certificados por ASE en Texas, que hoy tienen 2 talleres en Phoenix que trabajan juntos (el de la 7th Ave lo dirige su hijo Ernesto) y que su idea es mantener su carro usado andando como nuevo, sin hacerle reparaciones que no necesita.",
        "Medina's Automotive has been family-owned since 1983. Their site says Hector Medina was one of the first ASE certified technicians in Texas, that today they have 2 Phoenix shops working together (the 7th Ave one is run by his son Ernesto) and that their goal is to keep your used car running like new, without repairs you don't need."), c: [CITA_CHIP, PAGE("Ver «Nuestro equipo»", "See \"Our Team\"", "our-team.html")] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "fin de semana", "lunes", "hoy abren", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "direcciones", "ubicacion", "ubicados", "como llego", "llegar", "sede", "sedes", "sucursal", "mcdowell", "7th", "septima", "cual queda mas cerca", "address", "location", "locations", "where", "directions", "located", "closest"],
      a: function () { return dirA() + L("\nSi quiere, le dejo pedido el presupuesto o la cita en el que le quede mejor y el taller le confirma.", "\nI can request the estimate or appointment at whichever is better for you and the shop confirms."); }, c: [MAPS1, MAPS2, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "telefonos", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "formulario", "phone", "number", "call", "text", "contact", "form"],
      a: S("Canales que publica el taller:\n📞 #1 McDowell: " + C.s1.tel + " · #2 7th Ave: " + C.s2.tel + " (lunes a viernes de 8:00 a.m. a 5:00 p.m., sábado de 8:00 a.m. a 2:00 p.m.)\n✉️ Correo: service@medinasautomotive.com\n📝 Los formularios «Presupuesto rápido» (le mandan el presupuesto por correo) y «Contáctenos»\nNo publican WhatsApp. O deje aquí su teléfono y le contactan ellos, por llamada o por texto.",
        "Channels the shop publishes:\n📞 #1 McDowell: " + C.s1.tel + " · #2 7th Ave: " + C.s2.tel + " (Mon–Fri 8:00 AM – 5:00 PM, Sat 8:00 AM – 2:00 PM)\n✉️ Email: service@medinasautomotive.com\n📝 The \"Quick Estimate\" form (they email you an estimate) and \"Contact Us\"\nThey don't list WhatsApp. Or leave your number here and they'll reach out, by call or text."), c: [TEL1, TEL2, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: S("¡Con gusto! Si necesita algo más, aquí estoy. 🔧", "You're welcome! I'm here if you need anything else. 🔧"), c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "estimacion", "agendar", "reservar", "turno", "programar", "llevar el carro", "llevar mi carro", "llevar la camioneta", "llevar mi camioneta", "appointment", "estimate", "quote", "book", "schedule", "bring my car", "bring my truck"];
  function bestIntent(text) {
    var ut = toks(text), best = null, bs = 0;
    if (!ut.length) return null;
    KB.forEach(function (e) {
      var s = 0; e.k.forEach(function (ph) { s = Math.max(s, phraseScore(ph, ut)); });
      if (s > bs) { bs = s; best = e; }
    });
    return bs > 0 ? { e: best, s: bs } : null;
  }
  function isPriceQ(n) { return /\b(precio|precios|cuesta|cuestan|cuanto sale|cuanto cobran|costo|caro|barato|tarifa|price|prices|how much|cost|cheap|cheaper|rates|\$)\b/.test(n); }
  function isWalkinQ(n) { return /\b(walk ?in|sin cita|necesito (una )?cita|hace falta (una )?cita|tengo que (hacer|sacar) cita|need an appointment|appointment needed|no appointment)\b/.test(n); }
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { var pt = toks(ph); return pt.length && pt.every(function (k) { return ut.indexOf(k) >= 0 || (k.length >= 5 && ut.some(function (u) { return u.length >= 5 && u.slice(0, 5) === k.slice(0, 5); })); }); }); }
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "truck", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i", "not", "won", "start"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|auto|camioneta)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|camioneta|troca|precio|horario|donde|necesito|quiero|mi carro|mi camioneta|gracias|cual|frenos|transmision|aceite|arranca)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/602-252-5454/g, '<a href="tel:+16022525454">602-252-5454</a>').replace(/602-286-0405/g, '<a href="tel:+16022860405">602-286-0405</a>'); }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  function addBot(t, chips, cls) {
    var ty = el("div", "r24-typing", L("Escribiendo…", "Typing…")); body.appendChild(ty); scroll();
    chips = chips || [];
    setTimeout(function () {
      ty.remove();
      var m = el("div", "r24-msg r24-bot" + (cls ? " " + cls : ""), linkify(t));
      body.appendChild(m);
      if (chips.length) {
        var w = el("div", "r24-chips");
        chips.forEach(function (c) {
          if (typeof c === "function") c = c();
          var b;
          if (c.tel) { b = el("a", "r24-chip" + (c.cls ? " " + c.cls : ""), "📞 " + esc(c.t)); b.href = "tel:" + c.tel; }
          else if (c.url) { b = el("a", "r24-chip", esc(c.t)); b.href = c.url; if (!c.self) { b.target = "_blank"; b.rel = "noopener"; } }
          else { var tt = c.t; b = el("button", "r24-chip", esc(tt)); b.type = "button"; b.onclick = function () { if (c.foto) { fileIn.click(); return; } w.remove(); handle(c.v || c.q || tt, c, tt); }; }
          w.appendChild(b);
        });
        body.appendChild(w);
      }
      scroll();
    }, 380);
  }
  function statusText() {
    var n = nowTx();
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = L("🟢 Abierto ahora · hasta las " + hm(closeAt(n)) + " · " + C.s1.tel + " / " + C.s2.tel, "🟢 Open now · until " + hm(closeAt(n)) + " · " + C.s1.tel + " / " + C.s2.tel); }
    else { status.className = "r24-status r24-closed"; status.textContent = L("🌙 Fuera de horario (abre " + nextOpening(n) + ") · le atiendo igual y el taller recibe su pedido", "🌙 After hours (opens " + nextOpening(n) + ") · I'll still take your request"); }
  }
  function menuChips() { return [CITA_CHIP, PARADO, SVC, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Phoenix, AZ";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk"));
    banner.textContent = L("Demo privada preparada para Medina's Automotive", "Private demo prepared for Medina's Automotive");
    panel.querySelector(".r24-human").textContent = L("👤 Hablar con una persona", "👤 Talk to a person");
  }
  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    banner = el("div", "r24-demo-banner"); banner.setAttribute("role", "note"); document.body.appendChild(banner);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"><span class="r24-lt"></span><span class="r24-dot"></span>');
    launch.type = "button"; document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b></b><small></small></div><button class="r24-lang" type="button"></button><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><button class="r24-human" type="button"></button><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" autocomplete="off" maxlength="300"><button class="r24-send" type="submit"></button></form><input class="r24-file" type="file" accept="image/*" hidden><div class="r24-legal"></div>';
    document.body.appendChild(panel);
    body = panel.querySelector(".r24-body"); input = panel.querySelector(".r24-in"); status = panel.querySelector(".r24-status"); fileIn = panel.querySelector(".r24-file");
    panel.querySelector(".r24-human").onclick = humano;
    fileIn.onchange = function () { var f = fileIn.files && fileIn.files[0]; if (!f || !flow || flow.step !== "foto") return; fotoRecibida(f); fileIn.value = ""; };
    headTexts();
    launch.onclick = function () { open(); };
    panel.querySelector(".r24-x").onclick = function () { panel.classList.remove("r24-open"); launch.classList.remove("r24-hide"); document.documentElement.classList.remove("r24-panel-open"); };
    panel.querySelector(".r24-lang").onclick = function () { setLang(lang === "en" ? "es" : "en", true); };
    panel.querySelector("form").onsubmit = function (ev) { ev.preventDefault(); ev.stopImmediatePropagation(); var t = input.value.trim(); if (!t) return; input.value = ""; handle(t); };
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("[data-r24-open]"); if (a) { ev.preventDefault(); ev.stopPropagation(); open(a.getAttribute("data-r24-open")); }
    }, true);
  }
  function setLang(l, announce) {
    if (l === lang) return; lang = l; headTexts(); statusText();
    if (announce) addBot(L("Perfecto, seguimos en español. ¿En qué le ayudo?", "Sure, let's continue in English. How can I help?"), flow ? [] : menuChips());
    if (flow && announce) setTimeout(function () { ask(flow.step); }, 600);
  }
  // R24-HUMANO-1018: siempre a la vista; nunca deja al cliente atrapado con el asistente
  function humano() {
    flow = null; addUser(L("👤 Hablar con una persona", "👤 Talk to a person"));
    var n = nowTx(), ab = isOpen(n);
    addBot(L((ab ? "Claro. Ahora están abiertos: llame al taller que prefiera y le atiende una persona (" + telsTxt() + ")." : "Claro. Ahora el taller está cerrado" + (n.dow === 0 ? " (el domingo no abren)" : "") + "; abre " + nextOpening(n) + ". En horario puede llamar a #1 McDowell (" + C.s1.tel + ") o a #2 7th Ave (" + C.s2.tel + ").") + " Si prefiere, le contactan ellos: déjeme su nombre y teléfono y el pedido les llega al instante.",
      (ab ? "Sure. They're open now: call either shop and a person will help you (" + telsTxt() + ")." : "Sure. The shop is closed right now" + (n.dow === 0 ? " (closed on Sunday)" : "") + "; it opens " + nextOpening(n) + ". During business hours you can call #1 McDowell (" + C.s1.tel + ") or #2 7th Ave (" + C.s2.tel + ").") + " Or they can reach out to you: leave your name and number and they get the request instantly."), [TEL1(), TEL2(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy el asistente virtual con IA de Medina's Automotive (taller familiar desde 1983, con 2 talleres en Phoenix: McDowell y 7th Ave). Le ayudo a pedir un presupuesto o una cita, le tomo los datos para que el taller lo llame o le escriba, o le cuento servicios, horario y direcciones, a cualquier hora: también de noche y el domingo, o cuando no pueden atender el teléfono.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the AI virtual assistant for Medina's Automotive (family-owned since 1983, with 2 shops in Phoenix: McDowell and 7th Ave). I can set up an estimate or an appointment, take your details so the shop calls or texts you back, or answer questions about services, hours and locations — any time, including nights and Sundays, or when nobody can pick up the phone.\nHow can I help?"), menuChips());
  }
  function open(mode) {
    if (mode === "es" || mode === "en") { if (lang !== mode) { lang = mode; headTexts(); } mode = null; }
    if (mode === "form") mode = null;
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "cita" && !flow) setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }
  function opts(a) { return a.map(function (t) { return { t: t, v: t, flow: true }; }); }
  // Lo que le pasa, con los servicios que publica su web
  function SINT() { return lang === "en" ? ["Won't start / battery", "Brakes (noise, soft pedal)", "Engine (power loss, check engine)", "Transmission (slipping, won't shift)", "A/C not cooling", "Electrical (alternator, starter, lights)", "Suspension / shocks", "Oil change / maintenance", "Other / not sure"]
    : ["No arranca / batería", "Frenos (ruido, pedal blando)", "Motor (pierde fuerza, check engine)", "Transmisión (patina, no cambia)", "Aire acondicionado no enfría", "Eléctrico (alternador, arranque, luces)", "Suspensión / amortiguadores", "Cambio de aceite / mantenimiento", "Otra cosa / no sé"]; }
  function SEDES() { return opts([L("#1 McDowell (1910 E McDowell Rd)", "#1 McDowell (1910 E McDowell Rd)"), L("#2 7th Ave (4508 N 7th Ave)", "#2 7th Ave (4508 N 7th Ave)"), L("Me da igual / el que tenga lugar", "Either / whichever has room")]); }
  function ESTADO() { return opts([L("✅ Anda, puedo llevarlo", "✅ It runs, I can drive it in"), L("⚠️ Anda, pero con falla", "⚠️ It runs, but barely"), L("⛔ No arranca / está parado", "⛔ Won't start / it's down"), L("🚛 Necesita grúa", "🚛 Needs a tow")]); }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function MEDIO() { return opts([L("📞 Llamada", "📞 Phone call"), L("💬 Mensaje de texto", "💬 Text message")]); }
  function franjas(dow) {
    if (dow === 6) return opts([L("Sábado 8:00 a.m. – 2:00 p.m.", "Saturday 8:00 AM – 2:00 PM")]);
    return opts([L("Mañana (8:00 a.m. – 12:00 p.m.)", "Morning (8:00 AM – 12:00 PM)"), L("Tarde (12:00 – 5:00 p.m.)", "Afternoon (12:00 – 5:00 PM)"), L("Me da igual", "Either is fine")]);
  }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Presupuesto / diagnóstico", "Estimate / diagnosis"), L("Cita para llevar el vehículo", "Appointment to bring the vehicle in")]));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || L("Consulta general", "General question")).slice(0, 120) } };
    addBot(L("¡Claro! Le contacta una persona del taller, por llamada o por mensaje de texto. Solo necesito unos datos.\n¿Cuál es su nombre? (Escriba «cancelar» si quiere salir.)", "Sure! Someone from the shop will reach out by phone call or text. I just need a few details.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function normTel(t) { var ph = String(t || "").replace(/[\s().+-]/g, ""); if (/^1\d{10}$/.test(ph)) ph = ph.slice(1); return /^[2-9]\d{9}$/.test(ph) ? ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6) : ""; }
  function cap(s) { return String(s || "").trim().split(/\s+/).filter(Boolean).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ").slice(0, 60); }
  // Sus formularios «Quick Estimate» y «Contact Us» (Location) le entregan el pedido a la recepción, que confirma al instante y pide lo que falta
  function fromForm(f) {
    f = f || {};
    var est = f.kind === "estimate", nm = cap(f.name);
    var d = { tipo: "cita", form: true, servicio: est ? L("Presupuesto (formulario «Presupuesto rápido»)", "Estimate (\"Quick Estimate\" form)") : L("Consulta (formulario «Contáctenos»)", "Question (\"Contact Us\" form)"),
      nombre: nm.length >= 2 ? nm : "", telefono: normTel(f.tel), email: String(f.email || "").trim().slice(0, 60), vehiculo: String(f.vehiculo || "").trim().slice(0, 60), sintoma: String(f.msg || "").trim().slice(0, 120) };
    if (f.foto && f.foto.name) d.foto = String(f.foto.name).slice(0, 40);
    open("form");
    flow = { step: d.vehiculo ? (d.sintoma ? "sede" : "sintoma") : "vehiculo", d: d };
    addUser((est ? L("📝 Formulario «Presupuesto rápido»", "📝 \"Quick Estimate\" form") : L("📝 Formulario «Contáctenos»", "📝 \"Contact Us\" form")) + "\n" + [nm, f.tel, d.email, d.vehiculo, d.sintoma, d.foto ? "📷 " + d.foto : ""].filter(Boolean).join(" · "));
    addBot(L("¡Recibido" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Su pedido ya le llegó al taller: no se queda esperando " + (est ? "a que le manden el presupuesto por correo" : "a que le respondan «lo antes posible»") + ". " + aviso() + "\nPara dejarlo completo, unas preguntas rápidas.",
      "Got it" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Your request already reached the shop: no waiting " + (est ? "for an estimate by email" : "for them to reply \"as soon as possible\"") + ". " + aviso() + "\nA few quick questions to complete it."));
    setTimeout(function () { ask(flow.step); }, 700);
  }
  function fotoRecibida(f) {
    var d = flow.d; d.foto = f.name.slice(0, 40);
    var m = el("div", "r24-msg r24-user r24-photo"); var im = new Image(); im.alt = "foto"; im.style.cssText = "max-width:160px;max-height:120px;display:block;border-radius:8px;margin-bottom:4px";
    try { im.src = URL.createObjectURL(f); } catch (e) {}
    m.appendChild(im); m.appendChild(document.createTextNode("📷 " + d.foto)); body.appendChild(m); scroll();
    var w = body.querySelectorAll(".r24-chips"); if (w.length) w[w.length - 1].remove();
    addBot(L("📷 Foto recibida (en esta demo no sale de su teléfono).", "📷 Photo received (in this demo it never leaves your phone)."));
    setTimeout(function () { ask("dia"); }, 600);
  }
  function medioTxt(d) { return d.medio || L("Llamada", "Phone call"); }
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del vehículo? (por ejemplo: 2014 Toyota Camry)", "Year, make and model? (e.g. 2014 Toyota Camry)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesita?", "What's going on, or what service do you need?"), opts(SINT()));
    else if (step === "sede") addBot(L("¿En cuál de los 2 talleres le queda mejor? (El mismo horario en los dos.)", "Which of the 2 shops works best for you? (Same hours at both.)"), SEDES());
    else if (step === "estado") addBot(L("¿El vehículo anda o está parado? (Solo lo anoto para el taller; su web no publica servicio de grúa.)", "Does the vehicle run, or is it down? (I just note it for the shop; their site doesn't list towing.)"), ESTADO());
    else if (step === "foto") { if (d.foto) { ask("dia"); return; } addBot(L("¿Tiene una foto (de la luz del tablero, la fuga o la pieza)? Es opcional y ayuda al taller a preparar el presupuesto, como en su formulario «Presupuesto rápido».", "Do you have a photo (the dashboard light, the leak or the part)? It's optional and helps the shop prepare the estimate, like on their \"Quick Estimate\" form."), FOTO()); }
    else if (step === "dia") {
      var days = nextWorkdays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia y el taller se lo confirma. Abren de lunes a viernes de 8:00 a.m. a 5:00 p.m. y el sábado de 8:00 a.m. a 2:00 p.m.; el domingo, cerrado.", "Which day works best? I'll note it as a preference and the shop confirms. They're open Monday–Friday 8:00 AM – 5:00 PM and Saturday 8:00 AM – 2:00 PM; closed Sunday."),
        opts(days.map(function (x) { return x.label; })).concat(opts([L("Lo antes posible", "As soon as possible")])));
    }
    else if (step === "franja") addBot(L("¿En qué franja?", "What time window?"), franjas(d.dow));
    else if (step === "nombre") addBot(L("¿Cuál es su nombre?", "What's your name?"));
    else if (step === "medio") addBot(L("Gracias, " + d.nombre + ". ¿Prefiere que le llamen o que le manden un mensaje de texto?", "Thanks, " + d.nombre + ". Would you rather get a call or a text?"), MEDIO());
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto. ¿A qué teléfono le " + (/texto/i.test(medioTxt(d)) ? "escriben" : "llaman") + "?", "Great. What number should they " + (/text/i.test(medioTxt(d)) ? "text" : "call") + "?") : L("Último paso: ¿a qué teléfono le contactan para confirmar?", "Last step: what number should they use to confirm?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revise su solicitud de contacto:\n👤 Nombre: ", "Please review your contact request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n🏁 Taller: ", "\n🏁 Shop: ") + d.sede + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Vehículo: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n🔧 Qué le pasa: ", "\n🔧 Problem: ") + d.sintoma + L("\n🏁 Taller: ", "\n🏁 Shop: ") + d.sede + L("\n🚦 Estado: ", "\n🚦 Status: ") + d.estado + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + (d.email ? L("\n✉️ Correo: ", "\n✉️ Email: ") + d.email : "") + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
  function sedeDe(t) { return /#1|mcdowell|1910/i.test(t) ? "#1 McDowell" : (/#2|7th|4508|septima/i.test(t) ? "#2 7th Ave" : L("La que tenga lugar", "Whichever has room")); }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop|exit|quit)$/.test(n)) { flow = null; addBot(L("Sin problema, cancelé la solicitud. ¿Le ayudo con otra cosa?", "No problem, I've cancelled the request. Anything else?"), [CITA_CHIP, HOR, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "tipo":
        d.servicio = t.slice(0, 40);
        addBot(/cita|appointment/.test(n) ? L("Bien. Le anoto el día que prefiere y el taller se lo confirma.", "Got it. I'll note your preferred day and the shop confirms.")
          : L("Bien. Aquí no doy precios: el presupuesto se lo da el taller después de ver los datos o el vehículo.", "Got it. I don't quote prices here: the shop gives you the estimate after reviewing the details or the vehicle."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60); if (d.form && d.sintoma) ask("sede"); else ask("sintoma"); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask("sede"); return;
      case "sede":
        d.sede = sedeDe(t);
        if (d.tipo === "llamada") { ask("medio"); return; }
        ask("estado"); return;
      case "estado":
        d.estado = t.slice(0, 50);
        if (/parad|no arranca|grua|down|won.t start|tow/i.test(n)) addBot(L("Anotado: el taller ve en el pedido que el vehículo " + (/grua|tow/i.test(n) ? "necesita grúa" : "no arranca o está parado") + " y le dice cómo llevarlo. No le prometo grúa porque su web no la ofrece.", "Noted: the shop will see the vehicle " + (/grua|tow/i.test(n) ? "needs a tow" : "won't start or is down") + " and tell you how to get it there. I won't promise a tow since their site doesn't offer one."));
        setTimeout(function () { ask("foto"); }, /parad|grua|down|tow|arranca|start/i.test(n) ? 700 : 0); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60); d.dow = flow.days && flow.days[t] != null ? flow.days[t] : -1;
        if (/^(lo antes posible|as soon as possible)$/i.test(t)) { d.franja = L("La primera disponible", "First available"); ask(d.nombre ? "medio" : "nombre"); return; }
        if (/domingo|sunday/i.test(t)) { addBot(L("El domingo el taller está cerrado. ¿Otro día?", "The shop is closed on Sunday. Another day?")); setTimeout(function () { ask("dia"); }, 500); return; }
        if (d.dow === 6) { d.franja = L("Sábado 8:00 a.m. – 2:00 p.m.", "Saturday 8:00 AM – 2:00 PM"); addBot(L("El sábado abren solo de 8:00 a.m. a 2:00 p.m.; lo anoto en esa franja.", "On Saturday they're open only 8:00 AM – 2:00 PM; I'll note that window.")); setTimeout(function () { ask(d.nombre ? "medio" : "nombre"); }, 500); return; }
        ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask(d.nombre ? "medio" : "nombre"); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dice su nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        if (d.tipo === "llamada" && !d.sede) { ask("sede"); return; }
        ask("medio"); return;
      case "medio":
        d.medio = /texto|text|sms|mensaje/i.test(t) ? L("Mensaje de texto", "Text message") : L("Llamada", "Phone call");
        if (d.telefono) ask("resumen"); else ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (con código de área), por ejemplo 602-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 602-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)"), tx = /texto|text/i.test(medioTxt(d));
          var sd = /#2/.test(d.sede) ? MAPS2 : MAPS1;
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le " + (tx ? "escribe" : "llama") + " al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will " + (tx ? "text" : "call") + " you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su solicitud quedó registrada para " + d.sede + ".\nEl taller le " + (tx ? "escribe" : "llama") + " al " + d.telefono + " para confirmar el día y la hora; el presupuesto se lo dan ellos.", "All set, " + nm2 + "! ✅ Your request is in for " + d.sede + ".\nThe shop will " + (tx ? "text" : "call") + " you at " + d.telefono + " to confirm the day and time; the estimate comes from them.") + DEMO, [sd(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|editar|edit|change|^no\b/.test(n)) {
          var keep = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : { tipo: d.tipo, servicio: d.servicio };
          flow.d = keep; addBot(L("De acuerdo, empezamos de nuevo.", "OK, let's start over."));
          setTimeout(function () { if (keep.tipo === "llamada") ask("nombre"); else ask("vehiculo"); }, 500); return;
        }
        ask("resumen"); return;
    }
  }
  function reply(e) {
    var t = typeof e.a === "function" ? e.a() : e.a;
    addBot(t, (e.c || []).map(function (c) { if (typeof c === "function") c = c(); return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot(L("Eso se lo confirma mejor el taller, así tiene el dato exacto. 😊\nLlame al " + C.s1.tel + " o al " + C.s2.tel + " (" + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall " + C.s1.tel + " or " + C.s2.tel + " (" + hc() + "), or leave your number and they'll get back to you."), [TEL1, TEL2, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot(L("Claro, ¿qué más quiere saber?", "Sure, what else would you like to know?"), menuChips()); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué le puedo ayudar? Le pido un presupuesto o una cita, le tomo los datos para que lo llamen o le escriban y le cuento servicios, horario y direcciones.", "Hi! How can I help? I can request an estimate or an appointment, take your details for a call or text back, and tell you about services, hours and locations."), menuChips()); return; }
    if (/^(horario y direcciones|hours and locations)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [CITA_CHIP, MAPS1, MAPS2, LLAMADA_CHIP]); return; }
    if (/\b(que me llamen|llamenme|que me escriban|escribanme|textean|call me back|text me|callback|call back)\b/.test(n)) { startLlamada(); return; }
    if (/\b(persona|humano|alguien real|asesor|person|human|someone real|real person)\b/.test(n)) { humano(); return; }
    if (isWalkinQ(n)) { reply(byId("walkin")); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && !(bi && bi.e && bi.e.id === "precio" && /\?|es gratis|is it free|sin compromiso|no obligation/.test(t)) && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|quote|schedule|book/.test(n))) { startCita(); return; }
    if (price && !(bi && bi.e.id === "nolist")) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, fromForm: function (f) { if (panel) fromForm(f); }, setLang: function (l) { if (panel) setLang(l === "en" ? "en" : "es", opened); }, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
