/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · All About Diesel (taller diésel familiar; 12509 SW 130th St, Miami, FL 33186) — DEMO privada, bilingüe ES/EN.
   Sale de plantilla-widget/recepcion.base.js (reglas del brief 18/10 + R24-HUMANO), en la variante de talleres ES/EN en «usted» (Cardenas).
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica all-about-diesel.com (revisada el 19/10/2026): Home, Services y sus 12 páginas de servicio,
   Hummer, Jasper, About, ASE Certified, Reviews, Contact y su formulario «Book Online» (/book-now, solo enlazado desde Reviews).
   - Teléfono 305-457-2304 (el único; también publican fax 800-918-4838). No publican WhatsApp ni email. «Se habla español».
   - Horario (todas sus páginas): lunes a viernes 9:30 AM – 6:30 PM; sábado 9:30 AM – 1:30 PM; domingo cerrado (hora de Florida, Eastern).
   - Servicios: diagnóstico por computadora, inyectores, turbos, reparación y reconstrucción de motores, head studs, suspensión y dirección,
     tren motriz (transmisión, diferencial, cardán/crucetas), frenos, eléctrico, aire acondicionado, camiones de carga mediana, Hummer diésel,
     instalador Jasper (motores, transmisiones, diferenciales, combustible y aire); cambios de aceite y mantenimiento de rutina (About).
     Motores: Ford PowerStroke 7.3/6.0/6.4/6.7, Dodge Cummins 5.9/6.7, Chevy Duramax 6.6 y 6.5/6.2; medianos International, Cummins, Caterpillar, Isuzu.
   - Negocio familiar, técnicos ASE, trabajan con la mayoría de las garantías extendidas y con flotillas; área: Miami, Cayos, sur de Florida, Maple.
   Sin precios (su web no publica ninguno), sin WhatsApp; no promete grúa (solo registra si el vehículo anda, está parado o necesita grúa),
   llantas, alineación, carrocería, financiamiento, formas de pago, tiempos, atención sin cita ni nada que su web no liste. Español en «usted». */
(function () {
  "use strict";
  var C = {
    nombre: "All About Diesel", corto: "All About Diesel",
    tel: "305-457-2304", telh: "+13054572304",
    dir: "12509 SW 130th St, Miami, FL 33186", maps: "https://www.google.com/maps/dir/?api=1&destination=All+About+Diesel+12509+SW+130th+St+Miami+FL+33186"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  // Horario publicado (minutos desde las 0:00, hora de Florida/Eastern). 0 = domingo, 6 = sábado: cerrados.
  // Horario publicado (minutos desde las 0:00, hora de Florida/Eastern). 0 = domingo: cerrado. Sábado: 9:30 a 1:30.
  var LV = [[570, 1110]], SA = [[570, 810]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 6: SA, 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller (hora de Florida):\n• Lunes a viernes: 9:30 a.m. – 6:30 p.m.\n• Sábado: 9:30 a.m. – 1:30 p.m.\n• Domingo: cerrado",
      "Shop hours (Florida time):\n• Monday–Friday: 9:30 AM – 6:30 PM\n• Saturday: 9:30 AM – 1:30 PM\n• Sunday: closed");
  }
  var HCORTO = { es: "lunes a viernes de 9:30 a 6:30 y sábado de 9:30 a 1:30", en: "Mon–Fri 9:30–6:30, Sat 9:30–1:30" };
  function hc() { return HCORTO[lang]; }
  function nowTx() {
    var q = (location.search.match(/[?&]r24now=([^&]+)/) || [])[1];
    if (q) { var p = decodeURIComponent(q).match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
      if (p) return { y: +p[1], m: +p[2] - 1, d: +p[3], dow: new Date(+p[1], +p[2] - 1, +p[3]).getDay(), min: +p[4] * 60 + +p[5] }; }
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
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
    // hoy: si está abierto y quedan al menos 90 min, o si todavía no abrió (por ejemplo, martes a las 9:00)
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
  function TEL() { return { t: L("Llamar al ", "Call ") + C.tel, tel: C.telh }; }
  function MAPS() { return { t: L("Cómo llegar (Google Maps)", "Directions (Google Maps)"), url: C.maps }; }
  function PAGE(es, en, f, esOk) { return function () { return { t: L(es, en), url: (lang === "es" && esOk !== false ? "es-" : "") + f, self: true }; }; }
  var SERVP = PAGE("Ver la página de servicios", "See the services page", "services.html");
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios diésel", "🛠️ Diesel services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & address", "horario y direccion", "hours and address");
  var PARADO = Q("🚚 Mi camioneta está parada", "🚚 My truck is down", "mi camioneta esta parada", "my truck is down");
  function dirA() { return L("📍 " + C.dir + " (SW 130th St, cerca de SW 125th Ave)\n📞 " + C.tel + "\nAtienden Miami, los Cayos, el sur de Florida y Maple.", "📍 " + C.dir + " (SW 130th St near SW 125th Ave)\n📞 " + C.tel + "\nThey serve Miami, the Keys, South Florida and Maple."); }
  function horarioA() {
    var n = nowTx(), s = isOpen(n) ? L("🟢 Ahora están abiertos, hasta las " + hm(closeAt(n)) + ".", "🟢 They're open now, until " + hm(closeAt(n)) + ".")
      : L("🌙 Ahora está cerrado" + (n.dow === 0 ? " (domingo)" : "") + "; abre " + nextOpening(n) + ". Igual le tomo el pedido ahora y el taller lo recibe al instante.", "🌙 It's closed right now" + (n.dow === 0 ? " (Sunday)" : "") + "; opens " + nextOpening(n) + ". I can still take your request now and the shop gets it instantly.");
    return horarioTxt() + "\n" + s;
  }
  function serviciosA() {
    return L("Lo que publica el taller (taller diésel familiar en Miami, técnicos certificados ASE):\n• Diagnóstico por computadora (ECU, códigos, luces del tablero)\n• Inyectores (diagnóstico, reparación y reemplazo)\n• Turbos (diagnóstico, limpieza y reemplazo)\n• Reparación de motores y reconstrucción completa\n• Head studs (incl. ARP) y juntas de culata quemadas\n• Suspensión y dirección (también kits de nivelación y amortiguadores)\n• Tren motriz: transmisión, diferencial, cardán y crucetas\n• Frenos · Sistema eléctrico (cableado, alternador, motor de arranque, baterías, sensores) · Aire acondicionado\n• Cambios de aceite y mantenimiento de rutina\n• Camiones de carga mediana · Hummer diésel · Instalador Jasper®\nMotores: Ford PowerStroke, Dodge Cummins y Chevy Duramax. ¿Qué le pasa a su vehículo?",
      "What the shop lists (family-owned diesel shop in Miami, ASE certified technicians):\n• Computer diagnostics (ECU, codes, dashboard lights)\n• Injectors (diagnosis, repair and replacement)\n• Turbos (diagnosis, cleaning and replacement)\n• Engine repairs and full engine rebuilds\n• Head studs (incl. ARP) and blown head gaskets\n• Suspension & steering (incl. leveling kits and shocks)\n• Drive train: transmission, differential, driveshaft and u-joints\n• Brakes · Electrical (wiring, alternators, starters, batteries, sensors) · A/C\n• Oil changes and routine maintenance\n• Medium duty trucks · Hummer diesel · JASPER® installer\nEngines: Ford PowerStroke, Dodge Cummins and Chevy Duramax. What's going on with your vehicle?");
  }
  function noListA() {
    return L("Eso no aparece entre los servicios de su web, así que no se lo voy a asegurar. Llame al " + C.tel + " (" + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "That isn't among the services on their website, so I won't promise it. Call " + C.tel + " (" + hc() + "), or leave your number and they'll get back to you.");
  }
  function noPubA() {
    return L("Eso su web no lo dice, así que no se lo voy a inventar: se lo confirma el taller. Llame al " + C.tel + " (" + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "Their site doesn't say, so I won't make it up: the shop will confirm. Call " + C.tel + " (" + hc() + "), or leave your number and they'll get back to you.");
  }
  function S(es, en) { return function () { return L(es, en); }; }
  var KB = [
    { id: "diagnostico", k: ["diagnostico", "computadora", "escaner", "escanear", "check engine", "luz del motor", "luz de motor", "luces del tablero", "testigo", "codigo", "codigos", "ecu", "computadora del motor", "diagnostic", "diagnostics", "computer", "scan", "check engine light", "code", "codes", "warning light"],
      a: S("Sí: diagnóstico por computadora. Su web explica que se conectan a la computadora del motor (ECU), leen los códigos de error y los datos del motor, la transmisión, los frenos y más, y con eso ubican el problema rápido y con precisión. ¿Le dejo pedida la revisión?",
        "Yes: computer diagnostics. Their site explains they connect to the engine computer (ECU), pull the error codes and data from the engine, transmission, brakes and more, and use that to pinpoint the problem quickly and accurately. Want me to request it?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "inyectores", k: ["inyector", "inyectores", "inyeccion", "solenoide", "tapado", "gotea diesel", "injector", "injectors", "injection", "solenoid", "clogged"],
      a: S("Sí: inyectores. Su web dice que los diagnostican con equipo avanzado (tapados, con fugas o con solenoides que fallan), los reparan y, si ya no tienen arreglo, los reemplazan por inyectores de fabricantes de confianza.",
        "Yes: injectors. Their site says they diagnose them with advanced equipment (clogging, leaks or failing solenoids), repair them and, if they're beyond repair, replace them with injectors from trusted manufacturers."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "turbo", k: ["turbo", "turbos", "turbocargador", "silbido", "actuador", "turbocharger", "whistle", "actuator", "boost"],
      a: S("Sí: turbos. Su web dice que con el uso pueden perder potencia, echar humo de más o hacer ruidos raros; los diagnostican, los limpian de carbón y, si no tienen arreglo, los reemplazan por turbos de fabricantes de confianza.",
        "Yes: turbos. Their site says over time they can lose power, smoke too much or make unusual noises; they diagnose them, clean out carbon deposits and, if they're beyond repair, replace them with turbos from trusted manufacturers."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "headstuds", k: ["head stud", "head studs", "esparrago", "esparragos", "culata", "junta de culata", "empaque de cabeza", "arp", "pierde refrigerante", "aceite en el refrigerante", "agua en el aceite", "head gasket", "blown head gasket", "coolant loss", "oil in coolant", "water in oil"],
      a: S("Sí: head studs y juntas de culata. Su web dice que instalan head studs reforzados (incluidos ARP), los reemplazan si se quemó la junta de culata y recomiendan revisarlos y verificar el torque cada tanto. Entre los síntomas que atienden: pérdida de refrigerante, aceite o diésel en el refrigerante y agua en el aceite.",
        "Yes: head studs and head gaskets. Their site says they install upgraded head studs (including ARP), replace them after a blown head gasket and recommend periodic inspection and torque checks. Symptoms they handle include loss of coolant, oil or diesel in coolant and water in oil."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "reconstruccion", k: ["reconstruccion", "reconstruir", "rebuild", "rebuilt", "overhaul", "reconstruir motor", "motor nuevo", "cambiar motor", "remanufacturado", "jasper", "reemplazo de motor", "engine replacement", "remanufactured", "replace engine"],
      a: S("Sí: reconstrucción de motores (desarmado e inspección, limpieza, cambio de pistones, anillos, cojinetes y juntas, maquinado si hace falta, armado y pruebas de compresión y presión de aceite). Y para reemplazos de motor, transmisión o diferencial son instaladores JASPER®, que es lo que recomiendan. Qué conviene en su caso se lo dice el taller después de revisar el vehículo.",
        "Yes: engine rebuilds (teardown and inspection, cleaning, new pistons, rings, bearings and gaskets, machining if needed, reassembly and compression/oil-pressure testing). For engine, transmission or differential replacements they're a JASPER® installer, which is what they recommend. What makes sense for you, the shop tells you after checking the vehicle."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "transmision", k: ["transmision", "caja", "caja de cambios", "patina", "patinando", "no cambia", "cambios duros", "diferencial", "cardan", "flecha", "crucetas", "4x4", "doble traccion", "transmission", "slipping", "rough shifting", "differential", "driveshaft", "u joint", "u-joint", "4wd", "four wheel drive"],
      a: S("Sí: tren motriz. Su web lista la transmisión (si patina, cambia brusco o hace ruidos: diagnóstico y reparación, del servicio al reemplazo), el diferencial (cambio de líquido, retenes y reparación) y el cardán, las crucetas y las juntas homocinéticas. En los Hummer también el sistema 4x4. ¿Le dejo pedida la revisión?",
        "Yes: drive train. Their site lists the transmission (slipping, rough shifting or noises: diagnosis and repair, from servicing to replacement), the differential (fluid changes, seals and repairs) and the driveshaft, u-joints and CV joints. On Hummers, the 4WD system too. Want me to request a check?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "motor", k: ["motor", "falla", "fallas", "tiembla", "pierde fuerza", "sin fuerza", "falta de potencia", "humo", "humo blanco", "humo negro", "cascabelea", "golpeteo", "ruido en el motor", "explosiones", "petardea", "se recalienta", "sobrecalienta", "bomba de combustible", "engine", "misfire", "shaking", "lack of power", "no power", "smoke", "white smoke", "knocking", "popping", "overheating", "fuel pump"],
      a: S("Sí: reparación de motores diésel, de lo menor a lo mayor, y el sistema de combustible (bomba e inyectores). En su web listan síntomas como falta de potencia, falla de encendido o temblor con carga, humo blanco al arrancar o en ralentí, recalentamiento, pérdida de refrigerante y explosiones en la admisión: «Si hay una solución, la vamos a encontrar». ¿Le dejo pedida la revisión?",
        "Yes: diesel engine repair, minor to major, plus the fuel system (pump and injectors). Their site lists symptoms like lack of power, misfire or shaking under load, white smoke at start-up or idle, overheating, loss of coolant and popping from the intake: \"If there is a solution we will find it.\" Want me to request a check?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nomaneja", k: ["parada", "parado", "esta parada", "no arranca", "no prende", "no enciende", "no camina", "no anda", "varado", "varada", "me quede", "tarda en arrancar", "no arranca en caliente", "grua", "remolque", "remolcar", "down", "truck is down", "won t start", "wont start", "no start", "not running", "stranded", "broke down", "tow", "towing", "tow truck", "extended cranking"],
      a: function () { var n = nowTx(); return L("Lo siento. «No arranca» y «no arranca en caliente» están entre los síntomas que atienden. Su web no publica servicio de grúa, así que no se lo voy a prometer; lo que sí hago: le dejo el pedido con el vehículo marcado como parado (o que necesita grúa) y el taller le llama o le escribe para ver cómo llevarlo." + (isOpen(n) ? " Ahora están abiertos: también puede llamar al " + C.tel + "." : " Ahora está cerrado (abre " + nextOpening(n) + "); su pedido le llega igual al instante."),
        "Sorry to hear that. \"No start\" and \"no start when hot\" are among the symptoms they handle. Their site doesn't list towing, so I won't promise it; what I can do: log your request with the vehicle marked as down (or needing a tow) and the shop calls or texts you about getting it there." + (isOpen(n) ? " They're open now: you can also call " + C.tel + "." : " It's closed now (opens " + nextOpening(n) + "); your request still reaches them instantly.")); }, c: [CITA_CHIP, LLAMADA_CHIP, TEL] },
    { id: "frenos", k: ["freno", "frenos", "balatas", "pastillas", "discos", "rotores", "calipers", "rechina", "rechinan", "vibra al frenar", "liquido de frenos", "brake", "brakes", "pads", "rotors", "squeak", "squeal", "grinding", "brake fluid"],
      a: S("Sí: frenos. Su web lista inspección completa (pastillas, discos, calipers, líneas y líquido), cambio de pastillas, rectificado o cambio de discos y cambio de líquido de frenos. Si hacen ruido, vibran o frenan menos, mejor revisarlos pronto.",
        "Yes: brakes. Their site lists full inspection (pads, rotors, calipers, lines and fluid), pad replacement, rotor resurfacing or replacement and brake fluid flush. If they're noisy, vibrating or stopping worse, get them checked soon."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "electrico", k: ["electrico", "electrica", "electricidad", "cableado", "cables", "alternador", "motor de arranque", "marcha", "bateria", "baterias", "sensor", "sensores", "luces", "electrical", "wiring", "alternator", "starter", "battery", "batteries", "lights"],
      a: S("Sí: reparaciones eléctricas. Su web lista pruebas de diagnóstico del sistema eléctrico (cableado, conectores, sensores), reparación de cableado y cambio de alternador, motor de arranque, baterías o sensores. En los Hummer, sistemas de 12 y 24 voltios.",
        "Yes: electrical repairs. Their site lists diagnostic testing of the electrical system (wiring, connectors, sensors), wiring repairs and replacing alternators, starters, batteries or sensors. On Hummers, 12-volt and 24-volt systems."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "ac", k: ["aire acondicionado", "aire", "a c", "ac", "clima", "no enfria", "compresor", "recarga", "gas del aire", "freon", "air conditioning", "not cold", "compressor", "recharge", "refrigerant"],
      a: S("Sí: aire acondicionado. Su web lista diagnóstico del sistema (nivel de refrigerante, compresor, condensador, evaporador y blower), recarga de refrigerante y reparación o cambio de piezas. En Miami, con este calor, se agradece.",
        "Yes: A/C repair. Their site lists system diagnostics (refrigerant level, compressor, condenser, evaporator and blower motor), refrigerant recharge and component repair or replacement. In Miami's heat, worth it."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "suspension", k: ["suspension", "direccion", "amortiguadores", "struts", "kit de nivelacion", "nivelacion", "levantar", "volante", "se va de lado", "desgaste de llantas", "steering", "shocks", "leveling kit", "lift", "front end", "uneven tire wear"],
      a: S("Sí: suspensión y dirección. Su web lista diagnóstico, reparación de componentes y mejoras como kits de nivelación y amortiguadores reforzados, para que la camioneta se maneje firme y con control.",
        "Yes: suspension & steering. Their site lists diagnosis, component repairs and upgrades like leveling kits and upgraded shocks and struts, so the truck handles with precision and control."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "aceite", k: ["aceite", "cambio de aceite", "filtro", "filtros", "mantenimiento", "preventivo", "servicio de rutina", "oil", "oil change", "filter", "maintenance", "routine", "service"],
      a: S("Sí: su web dice que hacen «de todo, desde cambios de aceite y mantenimiento de rutina hasta la reconstrucción completa del motor» (cambio de aceite y filtros e inspecciones). Le dejo pedido el día que prefiera; abren " + "de lunes a viernes de 9:30 a 6:30 y el sábado de 9:30 a 1:30.",
        "Yes: their site says they handle \"everything from oil changes and routine maintenance to full engine rebuilds\" (oil and filter changes and inspections). I can request the day you prefer; they're open Mon–Fri 9:30–6:30 and Saturday 9:30–1:30."), c: [CITA_CHIP, HOR] },
    { id: "mediano", k: ["camion", "camiones", "carga mediana", "box truck", "international", "isuzu", "caterpillar", "cat", "fuso", "sprinter", "flotilla", "flota", "flotillas", "medium duty", "truck fleet", "fleet", "fleets", "commercial"],
      a: S("Sí: camiones de carga mediana (motores International, Cummins, Caterpillar e Isuzu): diagnóstico, motor, mantenimiento, transmisión, frenos y más. Y dan servicio a vehículos de flotilla. Si es para una empresa, déjeme los datos y el taller le contacta.",
        "Yes: medium duty trucks (International, Cummins, Caterpillar and Isuzu power): diagnostics, engine, maintenance, transmission, brakes and more. They also service fleet vehicles. If it's for a business, leave your details and the shop will reach out."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "hummer", k: ["hummer", "humvee", "h1", "militar", "24 voltios", "24v", "military", "24 volt"],
      a: S("Sí: «Conocemos los Hummer». Civil o militar, sistema de 12 o 24 voltios, motor diésel 6.2L, 6.5L o 6.6L: motor, sistema de combustible, suspensión, dirección y sistema 4x4, y consiguen las piezas correctas.",
        "Yes: \"We know Hummers.\" Civilian or military, 12-volt or 24-volt system, 6.2L, 6.5L or 6.6L diesel: engine, fuel system, suspension, steering and the 4WD system, and they source the correct parts."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "marcas", k: ["powerstroke", "power stroke", "ford", "f250", "f-250", "f350", "f-350", "excursion", "6.0", "6.4", "6.7", "7.3", "cummins", "dodge", "ram", "duramax", "chevy", "chevrolet", "silverado", "gmc", "6.6", "6.5", "6.2", "que motores", "que marcas", "which engines", "brands", "my truck"],
      a: S("Se especializan en Ford PowerStroke (7.3, 6.0, 6.4 y 6.7), Dodge Cummins (5.9 y 6.7) y Chevy Duramax (6.6, y los más antiguos 6.5 y 6.2), además de camiones medianos International, Cummins, Caterpillar e Isuzu. Si me dice el año y el modelo, le dejo pedida la revisión.",
        "They specialize in Ford PowerStroke (7.3, 6.0, 6.4 and 6.7), Dodge Cummins (5.9 and 6.7) and Chevy Duramax (6.6, plus the older 6.5 and 6.2), plus International, Cummins, Caterpillar and Isuzu medium duty trucks. Tell me the year and model and I'll request a check."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "gasolina", k: ["gasolina", "carro normal", "auto a gasolina", "no es diesel", "gas engine", "gasoline", "not diesel", "regular car"],
      a: S("Su web se centra en diésel (camionetas livianas y camiones de carga mediana). Para un vehículo a gasolina no se lo voy a asegurar: confírmelo con el taller al " + C.tel + ", o déjeme su teléfono y le contactan.",
        "Their site focuses on diesel (light and medium duty trucks). For a gas vehicle I won't promise it: please confirm with the shop at " + C.tel + ", or leave your number and they'll get back to you."), c: [TEL, LLAMADA_CHIP] },
    { id: "nolist", k: ["carroceria", "hojalateria", "pintura", "choque", "chapisteria", "llanta", "llantas", "neumatico", "gomas", "alineacion", "alinear", "balanceo", "emisiones", "inspeccion", "moto", "motos", "a domicilio", "mecanico a domicilio", "vidrios", "parabrisas", "body work", "paint", "collision", "tire", "tires", "alignment", "emissions", "inspection sticker", "motorcycle", "mobile mechanic", "windshield"], a: noListA, c: [TEL, LLAMADA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "mecanica", "mecanico", "diesel", "services", "what do you fix", "what do you do", "repairs", "mechanic"], a: serviciosA, c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "presupuesto gratis", "es gratis", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "free estimate"],
      a: S("Los precios se los da el taller, y su web no publica ninguno (habla de «precios justos» y «trabajo de calidad a precios accesibles», sin cifras); tampoco dice si el presupuesto es gratis. Lo que puedo hacer: dejarle pedido el presupuesto con su vehículo y lo que le pasa, y le contactan.",
        "Pricing comes from the shop, and their site doesn't publish any (it mentions \"fair prices\" and \"quality work at affordable prices\", no numbers); it also doesn't say whether estimates are free. What I can do: request the estimate with your vehicle and what's going on, and they'll get back to you."), c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "garantia", k: ["garantia", "garantias", "garantia extendida", "aseguradora", "warranty", "warranties", "extended warranty"],
      a: S("Su web dice que trabajan con la mayoría de las garantías extendidas, y en tren motriz menciona el reemplazo de transmisión «con garantía». Los detalles de su caso (qué cubre, plazos) no los publica: se los confirma el taller.",
        "Their site says they work with most extended warranties, and on the drive train page it mentions transmission replacement \"with warranty\". The details for your case (coverage, terms) aren't published: the shop will confirm."), c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "nopub", k: ["financiamiento", "financiar", "a plazos", "plan de pagos", "credito", "zelle", "efectivo", "tarjeta", "formas de pago", "como pago", "cuanto tarda", "cuanto tiempo", "mismo dia", "carro de cortesia", "financing", "payment plan", "credit", "cash", "card", "payment", "how long", "same day", "loaner"], a: noPubA, c: [TEL, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llegar", "llegar sin avisar", "necesito cita", "dejar la camioneta", "dejar el carro", "without appointment", "drop by", "stop by", "drop off", "need an appointment"],
      a: S("Su web no dice si atienden sin cita; lo que publica es «Schedule Service Now!», el teléfono y el horario (" + "lunes a viernes de 9:30 a 6:30, sábado de 9:30 a 1:30, domingo cerrado). Para no ir en balde, le dejo aquí pedida la cita y el taller le confirma, o llame al " + C.tel + ".",
        "Their site doesn't say whether they take walk-ins; it says \"Schedule Service Now!\" and lists the phone and hours (Mon–Fri 9:30–6:30, Sat 9:30–1:30, closed Sunday). To be safe, I can request the appointment here and the shop confirms, or call " + C.tel + "."), c: [CITA_CHIP, TEL] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue", "bilingual", "se habla"],
      a: S("Sí: su web dice «Se habla español» y que hablan español con fluidez. Aquí le atiendo en los dos idiomas (botón EN arriba).", "Yes: their site says \"Se habla español\" and that they're fluent in Spanish. I can help you in English or Spanish (ES button at the top)."), c: [CITA_CHIP] },
    { id: "historia", k: ["dueno", "quien", "quienes son", "familia", "familiar", "ase", "certificado", "certificados", "experiencia", "historia", "resenas", "opiniones", "confianza", "owner", "who", "family", "certified", "experience", "reviews", "trust"],
      a: S("All About Diesel es un taller diésel familiar en Miami, con técnicos certificados ASE e instalador JASPER®. En Google tienen 4.9 estrellas con 205 reseñas (widget de su web). Su lema: «No deje que le digan que no tiene arreglo. Si hay una solución, la vamos a encontrar».",
        "All About Diesel is a family-owned diesel shop in Miami with ASE certified technicians and a JASPER® installer. On Google they have 4.9 stars from 205 reviews (widget on their site). Their line: \"Don't let someone tell you it can't be fixed. If there is a solution we will find it.\""), c: [CITA_CHIP, PAGE("Ver reseñas", "See reviews", "reviews.html")] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "fin de semana", "lunes", "hoy abren", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, MAPS] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "130th", "kendall", "cayos", "keys", "zona", "area", "address", "location", "where", "directions", "located", "service area"],
      a: function () { return dirA() + L("\nSi quiere, le dejo pedido el presupuesto o la cita desde aquí y el taller le confirma.", "\nI can request the estimate or appointment from here and the shop confirms."); }, c: [MAPS, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "fax", "formulario", "phone", "number", "call", "text", "contact", "form"],
      a: S("Canales que publica el taller:\n📞 Teléfono: " + C.tel + " (lunes a viernes de 9:30 a.m. a 6:30 p.m., sábado de 9:30 a.m. a 1:30 p.m.)\n📠 Fax: 800-918-4838\n📝 El formulario «Book Online» (en la página de reseñas), que dice que le contactan para ver horarios disponibles\nNo publican WhatsApp ni email. O deje aquí su teléfono y le contactan ellos, por llamada o por texto.",
        "Channels the shop publishes:\n📞 Phone: " + C.tel + " (Mon–Fri 9:30 AM – 6:30 PM, Sat 9:30 AM – 1:30 PM)\n📠 Fax: 800-918-4838\n📝 The \"Book Online\" form (on the Reviews page), which says they'll get back to you with available times\nThey don't list WhatsApp or email. Or leave your number here and they'll reach out, by call or text."), c: [TEL, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: S("¡Con gusto! Si necesita algo más, aquí estoy. 🔧", "You're welcome! I'm here if you need anything else. 🔧"), c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "agendar", "reservar", "turno", "llevar la camioneta", "llevar mi camioneta", "llevar el carro", "llevar mi carro", "llevar la troca", "llevar el camion", "appointment", "estimate", "quote", "book", "schedule", "bring my truck", "bring my car"];
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
  // estricto (exacto o mismo comienzo de 5 letras, sin distancia de edición): «turbo» no es «turno»
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { var pt = toks(ph); return pt.length && pt.every(function (k) { return ut.indexOf(k) >= 0 || (k.length >= 5 && ut.some(function (u) { return u.length >= 5 && u.slice(0, 5) === k.slice(0, 5); })); }); }); }
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "truck", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i", "not", "won", "start"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|auto|camioneta)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|camioneta|troca|precio|horario|donde|necesito|quiero|mi carro|mi camioneta|gracias|cual|frenos|transmision|aceite|inyectores|arranca)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/305-457-2304/g, '<a href="tel:+13054572304">305-457-2304</a>'); }
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
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = L("🟢 Abierto ahora · hasta las " + hm(closeAt(n)) + " · " + C.tel, "🟢 Open now · until " + hm(closeAt(n)) + " · " + C.tel); }
    else { status.className = "r24-status r24-closed"; status.textContent = L("🌙 Fuera de horario (abre " + nextOpening(n) + ") · le atiendo igual y el taller recibe su pedido", "🌙 After hours (opens " + nextOpening(n) + ") · I'll still take your request"); }
  }
  function menuChips() { return [CITA_CHIP, PARADO, SVC, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Miami, FL";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk"));
    banner.textContent = L("Demo privada preparada para All About Diesel", "Private demo prepared for All About Diesel");
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
    addBot(L((ab ? "Claro. Ahora están abiertos: llame al " + C.tel + " y le atiende una persona del taller (se habla español)." : "Claro. Ahora el taller está cerrado" + (n.dow === 0 ? " (el domingo no abren)" : "") + "; abre " + nextOpening(n) + ". Puede llamar al " + C.tel + " en horario.") + " Si prefiere, le contactan ellos: déjeme su nombre y teléfono y el pedido les llega al instante.",
      (ab ? "Sure. They're open now: call " + C.tel + " and a person from the shop will help you." : "Sure. The shop is closed right now" + (n.dow === 0 ? " (closed on Sunday)" : "") + "; it opens " + nextOpening(n) + ". You can call " + C.tel + " during business hours.") + " Or they can reach out to you: leave your name and number and they get the request instantly."), [TEL(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy el asistente virtual con IA de All About Diesel (taller diésel en SW 130th St, Miami). Le ayudo a pedir un presupuesto o una cita, le tomo los datos para que el taller lo llame o le escriba, o le cuento servicios y horario, a cualquier hora: también de noche y el domingo, o cuando no pueden atender el teléfono.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the AI virtual assistant for All About Diesel (diesel shop on SW 130th St, Miami). I can set up an estimate or an appointment, take your details so the shop calls or texts you back, or answer questions about services and hours — any time, including nights and Sundays, or when nobody can pick up the phone.\nHow can I help?"), menuChips());
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
  // Lo que le pasa, con los servicios y síntomas que publica su web
  function SINT() { return lang === "en" ? ["No start / hard start", "Lack of power / smoke", "Overheating / loss of coolant", "Check engine / diagnostics", "Injectors / turbo", "Transmission / differential", "Brakes / suspension", "Electrical / A/C", "Maintenance / oil change", "Other / not sure"]
    : ["No arranca / tarda en arrancar", "Sin fuerza / humo", "Se recalienta / pierde refrigerante", "Luz de check engine / diagnóstico", "Inyectores / turbo", "Transmisión / diferencial", "Frenos / suspensión", "Eléctrico / aire acondicionado", "Mantenimiento / cambio de aceite", "Otra cosa / no sé"]; }
  function ESTADO() { return opts([L("✅ Anda, puedo llevarla", "✅ It runs, I can drive it in"), L("⚠️ Anda, pero con falla", "⚠️ It runs, but barely"), L("⛔ Está parada / no arranca", "⛔ It's down / won't start"), L("🚛 Necesita grúa", "🚛 Needs a tow")]); }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function MEDIO() { return opts([L("📞 Llamada", "📞 Phone call"), L("💬 Mensaje de texto", "💬 Text message")]); }
  function franjas(dow) {
    if (dow === 6) return opts([L("Sábado 9:30 a.m. – 1:30 p.m.", "Saturday 9:30 AM – 1:30 PM")]);
    return opts([L("Mañana (9:30 a.m. – 12:00 p.m.)", "Morning (9:30 AM – 12:00 PM)"), L("Tarde (12:00 – 6:30 p.m.)", "Afternoon (12:00 – 6:30 PM)"), L("Me da igual", "Either is fine")]);
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
  // Su formulario «Book Online» (página de reseñas, /book-now) le entrega el pedido a la recepción, que confirma al instante y pide lo que falta
  function fromForm(f) {
    f = f || {};
    var nm = cap(f.name), d = { tipo: "cita", form: true, servicio: L("Cita (formulario Book Online)", "Appointment (Book Online form)"), nombre: nm.length >= 2 ? nm : "", telefono: normTel(f.tel),
      email: String(f.email || "").trim().slice(0, 60), vehiculo: String(f.vehiculo || "").trim().slice(0, 60), sintoma: String(f.msg || "").trim().slice(0, 120) };
    if (f.fecha) d.diaForm = String(f.fecha).slice(0, 40) + (f.hora ? " " + String(f.hora).slice(0, 10) : "");
    open("form");
    flow = { step: d.vehiculo ? (d.sintoma ? "estado" : "sintoma") : "vehiculo", d: d };
    addUser(L("📝 Formulario «Book Online»", "📝 \"Book Online\" form") + "\n" + [nm, f.tel, d.email, d.vehiculo, d.sintoma, d.diaForm].filter(Boolean).join(" · "));
    addBot(L("¡Recibido" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Su pedido ya le llegó al taller: no se queda esperando a que le contesten «para ver horarios disponibles». " + aviso() + "\nPara dejarlo completo, unas preguntas rápidas.",
      "Got it" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Your request already reached the shop: no waiting for them to \"get back to you for available times\". " + aviso() + "\nA few quick questions to complete it."));
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
    if (step === "vehiculo") addBot(L("¿Año, marca, modelo y motor del vehículo? (por ejemplo: 2006 Ford F-250 6.0 PowerStroke)", "Year, make, model and engine? (e.g. 2006 Ford F-250 6.0 PowerStroke)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesita?", "What's going on, or what service do you need?"), opts(SINT()));
    else if (step === "estado") addBot(L("¿El vehículo anda o está parado? (Solo lo anoto para el taller; su web no publica servicio de grúa.)", "Does the vehicle run, or is it down? (I just note it for the shop; their site doesn't list towing.)"), ESTADO());
    else if (step === "foto") addBot(L("¿Tiene una foto (de la luz del tablero, del humo, de la fuga o de la pieza)? Es opcional y ayuda al taller a preparar el presupuesto.", "Do you have a photo (the dashboard light, the smoke, the leak or the part)? It's optional and helps the shop prepare the estimate."), FOTO());
    else if (step === "dia") {
      var days = nextWorkdays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia y el taller se lo confirma. Abren de lunes a viernes de 9:30 a.m. a 6:30 p.m. y el sábado de 9:30 a.m. a 1:30 p.m.; el domingo, cerrado.", "Which day works best? I'll note it as a preference and the shop confirms. They're open Monday–Friday 9:30 AM – 6:30 PM and Saturday 9:30 AM – 1:30 PM; closed Sunday.") + (d.diaForm ? L("\n(En el formulario puso: " + d.diaForm + ".)", "\n(On the form you wrote: " + d.diaForm + ".)") : ""),
        opts(days.map(function (x) { return x.label; })).concat(opts([L("Lo antes posible", "As soon as possible")])));
    }
    else if (step === "franja") addBot(L("¿En qué franja?", "What time window?"), franjas(d.dow));
    else if (step === "nombre") addBot(L("¿Cuál es su nombre?", "What's your name?"));
    else if (step === "medio") addBot(L("Gracias, " + d.nombre + ". ¿Prefiere que le llamen o que le manden un mensaje de texto?", "Thanks, " + d.nombre + ". Would you rather get a call or a text?"), MEDIO());
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto. ¿A qué teléfono le " + (/texto/i.test(medioTxt(d)) ? "escriben" : "llaman") + "?", "Great. What number should they " + (/text/i.test(medioTxt(d)) ? "text" : "call") + "?") : L("Último paso: ¿a qué teléfono le contactan para confirmar?", "Last step: what number should they use to confirm?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revise su solicitud de contacto:\n👤 Nombre: ", "Please review your contact request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚚 Vehículo: ", "\n🚚 Vehicle: ") + d.vehiculo + L("\n🔧 Qué le pasa: ", "\n🔧 Problem: ") + d.sintoma + L("\n🚦 Estado: ", "\n🚦 Status: ") + d.estado + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
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
          : L("Bien. Su web no publica precios: el presupuesto se lo da el taller después de revisar el vehículo.", "Got it. Their site doesn't publish prices: the shop gives you the estimate after checking the vehicle."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60); if (d.form && d.sintoma) ask("estado"); else ask("sintoma"); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask("estado"); return;
      case "estado":
        d.estado = t.slice(0, 50);
        if (/parad|no arranca|grua|down|won.t start|tow/i.test(n)) addBot(L("Anotado: el taller ve en el pedido que el vehículo " + (/grua|tow/i.test(n) ? "necesita grúa" : "está parado") + " y le dice cómo llevarlo. No le prometo grúa porque su web no la ofrece.", "Noted: the shop will see the vehicle " + (/grua|tow/i.test(n) ? "needs a tow" : "is down") + " and tell you how to get it there. I won't promise a tow since their site doesn't offer one."));
        setTimeout(function () { ask("foto"); }, /parad|grua|down|tow|arranca|start/i.test(n) ? 700 : 0); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60); d.dow = flow.days && flow.days[t] != null ? flow.days[t] : -1;
        if (/^(lo antes posible|as soon as possible)$/i.test(t)) { d.franja = L("La primera disponible", "First available"); ask(d.nombre ? "medio" : "nombre"); return; }
        if (/domingo|sunday/i.test(t)) { addBot(L("El domingo el taller está cerrado. ¿Otro día?", "The shop is closed on Sunday. Another day?")); setTimeout(function () { ask("dia"); }, 500); return; }
        if (d.dow === 6) { d.franja = L("Sábado 9:30 a.m. – 1:30 p.m.", "Saturday 9:30 AM – 1:30 PM"); addBot(L("El sábado abren solo de 9:30 a.m. a 1:30 p.m.; lo anoto en esa franja.", "On Saturday they're open only 9:30 AM – 1:30 PM; I'll note that window.")); setTimeout(function () { ask(d.nombre ? "medio" : "nombre"); }, 500); return; }
        ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask(d.nombre ? "medio" : "nombre"); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dice su nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        ask("medio"); return;
      case "medio":
        d.medio = /texto|text|sms|mensaje/i.test(t) ? L("Mensaje de texto", "Text message") : L("Llamada", "Phone call");
        if (d.telefono) ask("resumen"); else ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (con código de área), por ejemplo 305-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 305-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)"), tx = /texto|text/i.test(medioTxt(d));
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le " + (tx ? "escribe" : "llama") + " al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will " + (tx ? "text" : "call") + " you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su solicitud quedó registrada.\nEl taller le " + (tx ? "escribe" : "llama") + " al " + d.telefono + " para confirmar el día y la hora; el presupuesto se lo dan ellos después de revisar el vehículo.", "All set, " + nm2 + "! ✅ Your request is in.\nThe shop will " + (tx ? "text" : "call") + " you at " + d.telefono + " to confirm the day and time; the estimate comes from them after checking the vehicle.") + DEMO, [MAPS(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
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
    addBot(L("Eso se lo confirma mejor el taller, así tiene el dato exacto. 😊\nLlame al " + C.tel + " (" + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall " + C.tel + " (" + hc() + "), or leave your number and they'll get back to you."), [TEL, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot(L("Claro, ¿qué más quiere saber?", "Sure, what else would you like to know?"), menuChips()); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué le puedo ayudar? Le pido un presupuesto o una cita, le tomo los datos para que lo llamen o le escriban y le cuento servicios, horario y dirección.", "Hi! How can I help? I can request an estimate or an appointment, take your details for a call or text back, and tell you about services, hours and location."), menuChips()); return; }
    if (/^(horario y direccion|hours and address)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [CITA_CHIP, MAPS, LLAMADA_CHIP]); return; }
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
