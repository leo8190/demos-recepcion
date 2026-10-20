/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Cardenas Transmission Corp. (taller de Ricardo Cruz; 1410 Palm Ave, Hialeah, FL 33010) — DEMO privada, bilingüe ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica cardenastransmissionshop.com (revisada el 19/10/2026): Home, About Us, Services, Contact Us,
   su pop-up «Get Your Free Estimate» y sus páginas en español (Hogar, Sobre nosotros, Servicios, Contacto).
   - Teléfono (305) 939-4585 (el único que publica). Formulario de Contact Us / Contacto y el del pop-up. No publican WhatsApp; la recepción no da email.
   - Horario (pie de todas sus páginas): lunes a viernes 8:00 AM – 5:00 PM; sábado y domingo cerrado (hora de Florida, Eastern).
   - Servicios (su página Services): transmisiones (manuales, automáticas y semiautomáticas), A/C y climatización, frenos, diagnóstico por
     computadora (OBD, luz de check engine / service engine), sistema de enfriamiento, reparación y mantenimiento de motor, cambio de aceite
     y filtro, dirección y suspensión, servicio de llantas, afinación (tune-up) y alineación. Inicio: «Transmission Repair · Auto Repair · Computer Diagnostics».
   - Pop-up: «Fill out the form and our team will get back to you with a free, no-obligation estimate» (presupuesto gratis y sin compromiso).
   - Ricardo Cruz, dueño, reconocido como «Top Gun» de talleres de transmisión y mecánica del condado de Miami-Dade (County Advisory Board).
   Sin precios (su web no publica ninguno), sin WhatsApp; no promete grúa, carrocería, financiamiento, garantía, formas de pago, atención sin cita
   ni nada que su web no liste. Cerrajería y arranque de batería solo aparecen en sus páginas viejas en español: no los asegura. Español en «usted». */
(function () {
  "use strict";
  var C = {
    nombre: "Cardenas Transmission Corp.", corto: "Cardenas Transmission",
    tel: "(305) 939-4585", telh: "+13059394585",
    dir: "1410 Palm Ave, Hialeah, FL 33010", maps: "https://www.google.com/maps/dir/?api=1&destination=1410+Palm+Ave+Hialeah+FL+33010"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  // Horario publicado (minutos desde las 0:00, hora de Florida/Eastern). 0 = domingo, 6 = sábado: cerrados.
  var LV = [[480, 1020]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 6: [], 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller (hora de Florida):\n• Lunes a viernes: 8:00 a.m. – 5:00 p.m.\n• Sábado y domingo: cerrado",
      "Shop hours (Florida time):\n• Monday–Friday: 8:00 AM – 5:00 PM\n• Saturday & Sunday: closed");
  }
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
    if (isOpen(n) && closeAt(n) - n.min >= 90) out.push({ dow: n.dow, label: L("Hoy", "Today") });
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


  var CITA_CHIP = { a: "cita", get t() { return L("🔧 Presupuesto gratis o cita", "🔧 Free estimate or appointment"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen o escriban", "📲 Call or text me back"); } };
  function aviso() { return L("🔔 El taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL() { return { t: L("Llamar al ", "Call ") + C.tel, tel: C.telh }; }
  function MAPS() { return { t: L("Cómo llegar (Google Maps)", "Directions (Google Maps)"), url: C.maps }; }
  function PAGE(es, en, f) { return function () { return { t: L(es, en), url: (lang === "es" ? "es-" : "") + f, self: true }; }; }
  var SERVP = PAGE("Ver la página de servicios", "See the services page", "services.html");
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & address", "horario y direccion", "hours and address");
  var TRANS = Q("⚙️ Transmisión", "⚙️ Transmission", "transmision", "transmission");
  function dirA() { return L("📍 " + C.dir + " (Palm Avenue, Hialeah)\n📞 " + C.tel, "📍 " + C.dir + " (Palm Avenue, Hialeah)\n📞 " + C.tel); }
  function horarioA() {
    var n = nowTx(), s = isOpen(n) ? L("🟢 Ahora están abiertos, hasta las " + hm(closeAt(n)) + ".", "🟢 They're open now, until " + hm(closeAt(n)) + ".")
      : L("🌙 Ahora está cerrado" + (n.dow === 0 || n.dow === 6 ? " (fin de semana)" : "") + "; abre " + nextOpening(n) + ". Igual le tomo el pedido ahora y el taller lo recibe al instante.", "🌙 It's closed right now" + (n.dow === 0 || n.dow === 6 ? " (weekend)" : "") + "; opens " + nextOpening(n) + ". I can still take your request now and the shop gets it instantly.");
    return horarioTxt() + "\n" + s;
  }
  function serviciosA() {
    return L("Lo que publica el taller (taller de transmisiones y mecánica en Hialeah):\n• Transmisiones: manuales, automáticas y semiautomáticas (su especialidad)\n• Diagnóstico por computadora (luz de check engine / service engine)\n• Reparación y mantenimiento de motor, de lo menor a lo mayor\n• Afinación (tune-up): filtros, bujías, bandas, mangueras y líquidos\n• Cambio de aceite y filtro\n• Frenos\n• Aire acondicionado y climatización\n• Sistema de enfriamiento (radiador, bomba de agua, termostato, ventilador)\n• Dirección y suspensión\n• Servicio de llantas y alineación\nPresupuesto gratis y sin compromiso. ¿Qué le pasa a su carro?",
      "What the shop lists (transmission & auto repair shop in Hialeah):\n• Transmissions: manual, automatic and semi-automatic (their specialty)\n• Computer diagnostics (check engine / service engine light)\n• Engine repair & maintenance, minor to major\n• Tune-ups: filters, spark plugs, belts, hoses and fluids\n• Oil & filter changes\n• Brakes\n• A/C & climate control\n• Cooling system (radiator, water pump, thermostat, fan)\n• Steering & suspension\n• Tire service and wheel alignments\nFree, no-obligation estimate. What's going on with your car?");
  }
  function noListA() {
    return L("Eso no aparece entre los servicios de su web, así que no se lo voy a asegurar. Llame al " + C.tel + " (lunes a viernes de 8 a 5), o déjeme su teléfono y le contactan ellos.",
      "That isn't among the services on their website, so I won't promise it. Call " + C.tel + " (Mon–Fri 8–5), or leave your number and they'll get back to you.");
  }
  function noPubA() {
    return L("Eso su web no lo dice, así que no se lo voy a inventar: se lo confirma el taller. Llame al " + C.tel + " (lunes a viernes de 8 a 5), o déjeme su teléfono y le contactan ellos.",
      "Their site doesn't say, so I won't make it up: the shop will confirm. Call " + C.tel + " (Mon–Fri 8–5), or leave your number and they'll get back to you.");
  }
  var KB = [
    { id: "transmision", k: ["transmision", "transmisiones", "caja", "caja de cambios", "cambios", "patina", "patinando", "jalonea", "no entra el cambio", "no cambia", "reconstruir", "reconstruccion", "clutch", "embrague", "estandar", "automatica", "semiautomatica", "transmission", "slipping", "slips", "jerky", "hard shift", "shifting", "gearbox", "manual", "automatic", "rebuild", "rebuilt"],
      a: function () { return L("Sí: es su especialidad («Transmission Shop & Auto Repair in Hialeah»). Su web dice que la transmisión es el enlace entre el motor y las ruedas y que, sea manual, automática o semiautomática, es clave para el desempeño y la confiabilidad del vehículo. Primero se revisa el carro y el presupuesto es gratis y sin compromiso. ¿Le dejo pedido el presupuesto?",
        "Yes, it's their specialty (\"Transmission Shop & Auto Repair in Hialeah\"). Their site says the transmission is the link between the engine and the wheels and, whether manual, automatic or semi-automatic, it's key to your vehicle's performance and reliability. They check the car first, and the estimate is free with no obligation. Want me to set it up?"); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "diagnostico", k: ["diagnostico", "diagnosticos", "computadora", "escaner", "check engine", "luz del motor", "luz de motor", "luz de check engine", "service engine", "testigo", "codigo", "codigos", "luz del tablero", "diagnostic", "diagnostics", "computer", "scan", "check engine light", "code", "warning light"],
      a: function () { return L("Sí: diagnóstico por computadora. Su web explica que todo vehículo desde 1996 tiene un sistema de diagnóstico a bordo (OBD) que vigila el motor, y que cuando se prende la luz de «check engine» o «service engine» lo siguiente es un diagnóstico o una afinación. ¿Le dejo pedida la revisión?",
        "Yes: computer diagnostics. Their site explains that every vehicle since 1996 has an On-Board Diagnostics system monitoring the engine, and that when the \"check engine\" or \"service engine\" light comes on, the next step is an engine diagnostic or a tune-up. Want me to request it?"); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "motor", k: ["motor", "falla", "fallas", "tiembla", "pierde fuerza", "humo", "cascabelea", "golpeteo", "fuga de aceite", "mantenimiento", "preventivo", "engine", "misfire", "rough idle", "knocking", "smoke", "losing power", "maintenance", "preventive"],
      a: function () { return L("Sí: reparación y mantenimiento de motor, «de lo menor a lo mayor», y todo el mantenimiento preventivo, que su web describe como proteger el carro contra reparaciones grandes antes de que pasen. Le dan el presupuesto gratis y sin compromiso.",
        "Yes: engine repair and maintenance, \"from minor to major\", plus all your preventive maintenance, which their site describes as protecting your vehicle against major repairs before they happen. Free, no-obligation estimate."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "afinacion", k: ["afinacion", "afinar", "tune up", "tune-up", "tuneup", "bujias", "bandas", "mangueras", "filtros", "spark plugs", "belts", "hoses", "filters"],
      a: function () { return L("Sí: afinación (tune-up). Su web dice que normalmente consiste en revisar el motor y limpiar, arreglar o cambiar lo que haga falta: filtros, bujías, bandas y mangueras, y líquidos.",
        "Yes: tune-ups. Their site says a tune-up generally means checking the engine for parts that need cleaning, fixing or replacing: filters, spark plugs, belts and hoses, and fluids."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "aceite", k: ["aceite", "cambio de aceite", "filtro de aceite", "oil", "oil change", "oil filter", "lube"],
      a: function () { return L("Sí: cambio de aceite y filtro, uno de los mantenimientos preventivos que su web recomienda para el desempeño y la vida del motor. Abren de lunes a viernes de 8:00 a.m. a 5:00 p.m.; le dejo pedido el día que prefiera.",
        "Yes: oil & filter changes, one of the preventive services their site recommends for performance and engine life. They're open Monday–Friday 8:00 AM – 5:00 PM; I can request the day you prefer."); }, c: [CITA_CHIP, HOR] },
    { id: "frenos", k: ["freno", "frenos", "balatas", "pastillas", "discos", "rechina", "rechinan", "chillan", "pedal", "brake", "brakes", "pads", "rotors", "squeak", "squeal", "grinding"],
      a: function () { return L("Sí: frenos. Su web dice que un sistema de frenos en buen estado es clave para su seguridad, la de sus pasajeros y la de los demás. Si rechinan o el pedal se siente raro, mejor revisarlos pronto: le dejo pedida la cita o llame al " + C.tel + ".",
        "Yes: brakes. Their site says a fully functioning brake system is crucial to your safety, your passengers' and other drivers'. If they squeal or the pedal feels off, get them checked soon: I can request an appointment, or call " + C.tel + "."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "ac", k: ["aire acondicionado", "aire", "a c", "ac", "clima", "climatizacion", "calefaccion", "no enfria", "compresor", "recarga", "freon", "air conditioning", "not cold", "compressor", "recharge", "climate control", "heat", "heater"],
      a: function () { return L("Sí: aire acondicionado y climatización. Su web dice que es un sistema complejo, hecho de varios sistemas más chicos, que necesita mantenimiento de rutina para enfriar bien en verano.",
        "Yes: A/C & climate control. Their site says it's a complex system made of several smaller ones, and it needs routine maintenance for reliable seasonal performance."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "calienta", k: ["se calienta", "sobrecalienta", "calentando", "radiador", "anticongelante", "termostato", "bomba de agua", "ventilador", "pierde agua", "enfriamiento", "overheat", "overheating", "radiator", "coolant", "thermostat", "water pump", "cooling", "fan"],
      a: function () { return L("Sí: sistema de enfriamiento (ventilador, bomba de agua, termostato, radiador, núcleo y válvula de la calefacción y demás piezas), que es lo que evita que el motor se recaliente. Si ve subir la aguja, no lo fuerce: llame al " + C.tel + " o déjeme su teléfono.",
        "Yes: cooling system (fan, water pump, thermostat, radiator, heater core, heater valve and the rest), which is what keeps the engine from overheating. If the gauge is climbing, don't push it: call " + C.tel + " or leave your number."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "suspension", k: ["suspension", "direccion", "amortiguadores", "struts", "tren delantero", "truena", "rebota", "volante", "alineacion", "alinear", "alineado", "se va de lado", "steering", "shocks", "front end", "bouncy", "alignment", "wheel alignment", "pulls"],
      a: function () { return L("Sí: dirección y suspensión, y también alineación. Su web dice que la alineación pone todas las ruedas paralelas entre sí y perpendiculares al piso, y que ayuda a gastar menos llantas y gasolina y a manejar más seguro.",
        "Yes: steering & suspension, and wheel alignments too. Their site says an alignment sets all wheels parallel to each other and perpendicular to the ground, for less tire wear, better gas mileage and safer driving."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "llantas", k: ["llanta", "llantas", "neumatico", "neumaticos", "goma", "gomas", "ponchada", "pinchada", "tire", "tires", "flat"],
      a: function () { return L("Sí: servicio de llantas. Su web dice que las llantas son la conexión entre el carro y el camino, y una parte clave de la suspensión. Para saber qué necesita la suya, le dejo pedida la revisión o llame al " + C.tel + ".",
        "Yes: tire service. Their site says tires are the connection between your vehicle and the road, and a critical part of the suspension. To see what yours needs, I can request a check, or call " + C.tel + "."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "viejo", k: ["cerrajero", "cerrajeria", "llave", "llaves", "me quede afuera", "bateria", "salto de bateria", "pasar corriente", "arranque de bateria", "locksmith", "locked out", "keys", "battery", "jump start", "jumpstart"],
      a: function () { return L("Eso (cerrajería de autos o batería) aparece en sus páginas viejas en español, pero no en su lista de servicios actual, así que no se lo voy a asegurar. Se lo confirma el taller: llame al " + C.tel + " (lunes a viernes de 8 a 5), o déjeme su teléfono y le contactan ellos.",
        "That (auto locksmith or battery service) shows up on their older Spanish pages but not on their current services list, so I won't promise it. The shop will confirm: call " + C.tel + " (Mon–Fri 8–5), or leave your number and they'll reach out."); }, c: [TEL, LLAMADA_CHIP] },
    { id: "nolist", k: ["grua", "remolque", "remolcar", "carroceria", "hojalateria", "pintura", "choque", "chapisteria", "emisiones", "inspeccion estatal", "moto", "motos", "motocicleta", "a domicilio", "mecanico a domicilio", "vidrios", "parabrisas", "tow", "towing", "body work", "paint", "collision", "emissions", "motorcycle", "mobile mechanic", "windshield"], a: noListA, c: [TEL, LLAMADA_CHIP] },
    { id: "nomaneja", k: ["no arranca", "no prende", "no camina", "no se puede manejar", "varado", "me quede", "quedado", "won t start", "wont start", "not drivable", "stranded", "broke down"],
      a: function () { return L("Lo siento. Su web no publica servicio de grúa. Llame al " + C.tel + " (lunes a viernes de 8:00 a.m. a 5:00 p.m.) y le dicen cómo llevarlo, o déjeme su teléfono y le contactan ellos apenas abran.",
        "Sorry to hear that. Their site doesn't list towing. Call " + C.tel + " (Mon–Fri 8:00 AM – 5:00 PM) and they'll tell you how to get it there, or leave your number and they'll reach out as soon as they open."); }, c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "mecanica", "mecanico", "services", "what do you fix", "what do you do", "repairs", "auto repair", "mechanic"], a: serviciosA, c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "price", "prices", "how much", "cost", "cheap", "rates", "discount"],
      a: function () { return L("Los precios se los da el taller, y su web no publica ninguno. Lo que sí dice: el presupuesto es gratis y sin compromiso. Lo que puedo hacer: dejarle pedido el presupuesto con su vehículo y lo que le pasa, y le contactan.",
        "Pricing comes from the shop, and their site doesn't publish any. What it does say: the estimate is free with no obligation. What I can do: request the estimate with your vehicle and what's going on, and they'll get back to you."); }, c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "presupuesto", k: ["presupuesto gratis", "cotizacion gratis", "estimado gratis", "es gratis", "sin costo", "sin compromiso", "consulta gratis", "free estimate", "free quote", "no obligation", "is it free"],
      a: function () { return L("Sí: su web dice que el presupuesto es gratis y sin compromiso («Get Your Free Estimate · Fast. Simple. No Obligation.»). Le dejo pedido el suyo en un minuto, sin llenar el formulario.",
        "Yes: their site says the estimate is free with no obligation (\"Get Your Free Estimate · Fast. Simple. No Obligation.\"). I can request yours in a minute, no form to fill out."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nopub", k: ["financiamiento", "financiar", "a plazos", "plan de pagos", "credito", "garantia", "garantizan", "zelle", "efectivo", "tarjeta", "formas de pago", "como pago", "cuanto tarda", "cuanto tiempo", "mismo dia", "financing", "payment plan", "credit", "warranty", "guarantee", "cash", "card", "payment", "how long", "same day"], a: noPubA, c: [TEL, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llegar", "llegar sin avisar", "necesito cita", "dejar el carro", "without appointment", "drop by", "stop by", "drop off", "need an appointment"],
      a: function () { return L("Su web no dice si atienden sin cita; lo que publica es «Make an appointment · Schedule Your Service Today» y el horario: lunes a viernes de 8:00 a.m. a 5:00 p.m. (sábado y domingo cerrado). Para no ir en balde, le dejo aquí pedida la cita y el taller le confirma, o llame al " + C.tel + ".",
        "Their site doesn't say whether they take walk-ins; it says \"Make an appointment · Schedule Your Service Today\" and lists the hours: Monday–Friday 8:00 AM – 5:00 PM (closed Saturday & Sunday). To be safe, I can request the appointment here and the shop confirms, or call " + C.tel + "."); }, c: [CITA_CHIP, TEL] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue", "bilingual"],
      a: function () { return L("Su web tiene páginas en español y muchas de sus reseñas de Google son en español. Aquí le atiendo en los dos idiomas (botón EN arriba).", "Their site has Spanish pages and many of their Google reviews are in Spanish. I can help you in English or Spanish (ES button at the top)."); }, c: [CITA_CHIP] },
    { id: "historia", k: ["dueno", "ricardo", "cruz", "quien", "quienes son", "top gun", "reconocimiento", "experiencia", "historia", "resenas", "opiniones", "confianza", "owner", "who", "experience", "reviews", "trust", "award"],
      a: function () { return L("Cardenas Transmission Corp. es un taller de transmisiones y mecánica en Hialeah. Su dueño, Ricardo Cruz, fue reconocido por el County Advisory Board como «Top Gun» de talleres de transmisión y mecánica del condado de Miami-Dade. Su lema: «Lo difícil lo hacemos fácil. Resolvemos lo imposible también.»",
        "Cardenas Transmission Corp. is a transmission and auto repair shop in Hialeah. Its owner, Ricardo Cruz, was recognized by the County Advisory Board as a Miami-Dade County \"Top Gun\" transmission and auto repair shop. Their motto: \"The difficult we make easy. We solve the impossible too.\""); }, c: [CITA_CHIP] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "fin de semana", "lunes", "hoy abren", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, MAPS] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "palm", "hialeah", "address", "location", "where", "directions", "located"],
      a: function () { return dirA() + L("\nSi quiere, le dejo pedido el presupuesto o la cita desde aquí y el taller le confirma.", "\nI can request the estimate or appointment from here and the shop confirms."); }, c: [MAPS, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "phone", "number", "call", "text", "contact"],
      a: function () { return L("Canales que publica el taller:\n📞 Teléfono: " + C.tel + " (lunes a viernes de 8:00 a.m. a 5:00 p.m.)\n📝 El formulario de Contact Us / Contacto\nNo publican WhatsApp. O deje aquí su teléfono y le contactan ellos, por llamada o por texto.",
        "Channels the shop publishes:\n📞 Phone: " + C.tel + " (Monday–Friday 8:00 AM – 5:00 PM)\n📝 The Contact Us form\nThey don't list WhatsApp. Or leave your number here and they'll reach out, by call or text."); }, c: [TEL, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: function () { return L("¡Con gusto! Si necesita algo más, aquí estoy. 🔧", "You're welcome! I'm here if you need anything else. 🔧"); }, c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "agendar", "reservar", "turno", "llevar el carro", "llevar mi carro", "llevar el auto", "llevar mi auto", "llevar la troca", "appointment", "estimate", "quote", "book", "schedule", "bring my car", "bring my truck"];
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
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { return phraseScore(ph, ut) > 0; }); }
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "truck", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i", "not"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|auto)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|precio|horario|donde|necesito|quiero|mi carro|mi auto|gracias|cual|frenos|transmision|aceite)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/\(305\) 939-4585/g, '<a href="tel:+13059394585">(305) 939-4585</a>'); }
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
  function menuChips() { return [CITA_CHIP, TRANS, SVC, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Hialeah, FL";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk"));
    banner.textContent = L("Demo privada preparada para Cardenas Transmission Corp.", "Private demo prepared for Cardenas Transmission Corp.");
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
    addBot(L((ab ? "Claro. Ahora están abiertos: llame al " + C.tel + " y le atiende una persona del taller." : "Claro. Ahora el taller está cerrado" + (n.dow === 0 || n.dow === 6 ? " (sábado y domingo no abren)" : "") + "; abre " + nextOpening(n) + ". Puede llamar al " + C.tel + " en horario.") + " Si prefiere, le contactan ellos: déjeme su nombre y teléfono y el pedido les llega al instante.",
      (ab ? "Sure. They're open now: call " + C.tel + " and a person from the shop will help you." : "Sure. The shop is closed right now" + (n.dow === 0 || n.dow === 6 ? " (closed Saturday & Sunday)" : "") + "; it opens " + nextOpening(n) + ". You can call " + C.tel + " during business hours.") + " Or they can reach out to you: leave your name and number and they get the request instantly."), [TEL(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy la recepción virtual de Cardenas Transmission Corp. (Palm Ave, Hialeah). Le ayudo a pedir su presupuesto gratis o una cita, le tomo los datos para que el taller lo llame o le escriba, o le cuento servicios y horario, a cualquier hora: también de noche y el fin de semana, cuando el taller está cerrado.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the virtual front desk for Cardenas Transmission Corp. (Palm Ave, Hialeah). I can set up your free estimate or an appointment, take your details so the shop calls or texts you back, or answer questions about services and hours — any time, including nights and weekends, when the shop is closed.\nHow can I help?"), menuChips());
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
  function SINT() { return lang === "en" ? ["Transmission (slipping / shifting)", "Check engine light / diagnostics", "Engine / tune-up", "Brakes", "A/C / overheating", "Steering, suspension / alignment", "Oil change / tires", "Other / not sure"]
    : ["Transmisión (patina / cambios)", "Luz de check engine / diagnóstico", "Motor / afinación", "Frenos", "Aire acondicionado / se calienta", "Dirección, suspensión / alineación", "Cambio de aceite / llantas", "Otra cosa / no sé"]; }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function MEDIO() { return opts([L("📞 Llamada", "📞 Phone call"), L("💬 Mensaje de texto", "💬 Text message")]); }
  function franjas(dow) {
    return opts([L("Mañana (8:00 a.m. – 12:00 p.m.)", "Morning (8:00 AM – 12:00 PM)"), L("Tarde (12:00 – 5:00 p.m.)", "Afternoon (12:00 – 5:00 PM)"), L("Me da igual", "Either is fine")]);
  }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Presupuesto gratis", "Free estimate"), L("Cita para llevar el carro", "Appointment to bring the car")]));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || L("Consulta general", "General question")).slice(0, 120) } };
    addBot(L("¡Claro! Le contacta una persona del taller, por llamada o por mensaje de texto. Solo necesito unos datos.\n¿Cuál es su nombre? (Escriba «cancelar» si quiere salir.)", "Sure! Someone from the shop will reach out by phone call or text. I just need a few details.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function normTel(t) { var ph = String(t || "").replace(/[\s().+-]/g, ""); if (/^1\d{10}$/.test(ph)) ph = ph.slice(1); return /^[2-9]\d{9}$/.test(ph) ? ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6) : ""; }
  function cap(s) { return String(s || "").trim().split(/\s+/).filter(Boolean).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ").slice(0, 60); }
  // Su formulario (pop-up «Get Your Free Estimate», Contact Us y Contacto) le entrega el pedido a la recepción, que confirma al instante y pide lo que falta
  function fromForm(f) {
    f = f || {};
    var nm = cap(f.name), d = { tipo: "cita", form: true, servicio: L("Presupuesto gratis (formulario)", "Free estimate (form)"), nombre: nm.length >= 2 ? nm : "", telefono: normTel(f.tel),
      email: String(f.email || "").trim().slice(0, 60), sintoma: String(f.msg || "").trim().slice(0, 120) };
    open("form");
    flow = { step: "vehiculo", d: d };
    addUser(L("📝 Formulario «" + (f.src || "Contacto") + "»", "📝 \"" + (f.src || "Contact Us") + "\" form") + "\n" + [nm, f.tel, d.email, d.sintoma].filter(Boolean).join(" · "));
    addBot(L("¡Recibido" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Su pedido de presupuesto ya le llegó al taller, no se queda esperando. " + aviso() + "\nPara dejarlo completo, unas preguntas rápidas.",
      "Got it" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Your estimate request already reached the shop, it doesn't just sit there. " + aviso() + "\nA few quick questions to complete it."));
    setTimeout(function () { ask("vehiculo"); }, 700);
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
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del vehículo? (por ejemplo: 2015 Toyota Camry)", "Year, make and model? (e.g. 2015 Toyota Camry)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesita?", "What's going on, or what service do you need?"), opts(SINT()));
    else if (step === "foto") addBot(L("¿Tiene una foto (de la luz del tablero, de la fuga o de la pieza)? Es opcional y ayuda al taller a preparar el presupuesto.", "Do you have a photo (the dashboard light, the leak or the part)? It's optional and helps the shop prepare the estimate."), FOTO());
    else if (step === "dia") {
      var days = nextWorkdays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia y el taller se lo confirma. Abren de lunes a viernes de 8:00 a.m. a 5:00 p.m.; sábado y domingo, cerrado.", "Which day works best? I'll note it as a preference and the shop confirms. They're open Monday–Friday 8:00 AM – 5:00 PM; closed Saturday & Sunday."),
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
      addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Vehículo: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n🔧 Qué le pasa: ", "\n🔧 Problem: ") + d.sintoma + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum");
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
          : L("Bien. Su web no publica precios: el presupuesto es gratis y por escrito, y usted lo aprueba antes de que empiecen.", "Got it. Their site doesn't publish prices: the estimate is free and in writing, and you approve it before any work starts."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60); if (d.form && d.sintoma) ask("foto"); else ask("sintoma"); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask("foto"); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60); d.dow = flow.days && flow.days[t] != null ? flow.days[t] : -1;
        if (/^(lo antes posible|as soon as possible)$/i.test(t)) { d.franja = L("La primera disponible", "First available"); ask(d.nombre ? "medio" : "nombre"); return; }
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
    addBot(L("Eso se lo confirma mejor el taller, así tiene el dato exacto. 😊\nLlame al " + C.tel + " (lunes a viernes de 8 a 5), o déjeme su teléfono y le contactan ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall " + C.tel + " (Mon–Fri 8–5), or leave your number and they'll get back to you."), [TEL, LLAMADA_CHIP, CITA_CHIP]);
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
    if (wantsCita(n) && !price && !(bi && bi.e && bi.e.id === "presupuesto" && /\?|es gratis|is it free|sin compromiso|no obligation/.test(t)) && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|quote|schedule|book/.test(n))) { startCita(); return; }
    if (price && !(bi && bi.e.id === "nolist")) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, fromForm: function (f) { if (panel) fromForm(f); }, setLang: function (l) { if (panel) setLang(l === "en" ? "en" : "es", opened); }, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
