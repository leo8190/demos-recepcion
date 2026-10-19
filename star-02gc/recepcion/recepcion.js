/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · The Star Auto Service (taller familiar, NAPA Auto Care, 900 E Belt Line Rd, Richardson TX 75081) — DEMO privada, bilingüe ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos.
   Respuestas sacadas solo de lo que publica www.thestarautoservice.com (EN y /es/, oct. 2026): home, servicios, el taller, contacto, agendar,
   preguntas frecuentes (18) y garantía.
   - Teléfono (972) 231-2886. No publican WhatsApp. El email solo figura en los datos ocultos para Google (no visible en la web): la demo no lo ofrece.
   - Horario publicado (pie, contacto, agendar, FAQ): lunes a viernes 8:00 AM – 6:30 PM, sábado 8:00 AM – 4:00 PM, domingo cerrado (hora de Texas).
     Sin cita «siempre» en ese horario; buzón para dejar el auto fuera de horario (llaman en la mañana antes de empezar).
   - 12 servicios: frenos, aceite y lubricación, diagnóstico de motor, reparación/reemplazo de motor, transmisión, eléctrico, A/C y calefacción,
     llantas, verificación estatal de Texas, enfriamiento, inyección de combustible, batería. Nacionales e importados, gasolina e híbridos.
   - Centro NAPA Auto Care: garantía nacional 24 meses / 24,000 millas en reparaciones que califican (más de 17,000 talleres). ASE. Bilingüe.
     Familiar desde 1998 (Miguel Ibarra). 4.5★ en 136 reseñas de Google. Pago: efectivo, crédito y débito. Sin financiamiento propio.
     Aventones de cortesía dentro de Richardson cuando la agenda lo permite. La cuota de diagnóstico se descuenta de la reparación.
   Sin precios (su web tiene una página de precios: la demo no los repite), sin WhatsApp. Español en «tú», como su web. */
(function () {
  "use strict";
  var C = {
    nombre: "The Star Auto Service", corto: "The Star Auto Service",
    tel: "(972) 231-2886", telh: "+19722312886",
    dir: "900 E Belt Line Rd, Richardson, TX 75081", maps: "https://maps.google.com/?q=The+Star+Auto+Service,+900+E+Belt+Line+Rd,+Richardson,+TX+75081"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  // Horario publicado (minutos desde las 0:00, hora de Texas). 0 = domingo.
  var LV = [[480, 1110]];
  var HR = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 6: [[480, 960]], 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario del taller (así lo publica su web):\n• Lunes a viernes: 8:00 AM – 6:30 PM\n• Sábado: 8:00 AM – 4:00 PM\n• Domingo: cerrado\nAceptan clientes sin cita en ese horario, y tienen un buzón para dejar el auto fuera de horario (te llaman en la mañana antes de empezar cualquier trabajo).",
      "Shop hours (as posted on their website):\n• Monday–Friday: 8:00 AM – 6:30 PM\n• Saturday: 8:00 AM – 4:00 PM\n• Sunday: closed\nWalk-ins are welcome during those hours, and there's an after-hours drop box (they call you in the morning before any work starts).");
  }
  function nowTx() {
    var q = (location.search.match(/[?&]r24now=([^&]+)/) || [])[1];
    if (q) { var p = decodeURIComponent(q).match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
      if (p) return { y: +p[1], m: +p[2] - 1, d: +p[3], dow: new Date(+p[1], +p[2] - 1, +p[3]).getDay(), min: +p[4] * 60 + +p[5] }; }
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
    var o = {}; f.formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    var y = +o.year, m = +o.month - 1, d = +o.day;
    return { y: y, m: m, d: d, dow: new Date(y, m, d).getDay(), min: (+o.hour % 24) * 60 + +o.minute };
  }
  function hm(min) { var h = Math.floor(min / 60), mm = ("0" + (min % 60)).slice(-2), ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return h + ":" + mm + " " + ap; }
  function isOpen(n) { return (HR[n.dow] || []).some(function (r) { return n.min >= r[0] && n.min < r[1]; }); }
  function closeAt(n) { var r = (HR[n.dow] || []).filter(function (r) { return n.min >= r[0] && n.min < r[1]; })[0]; return r ? r[1] : 0; }
  function nextOpening(n) {
    for (var i = 0; i < 8; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay(), rs = HR[dow] || [];
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
      if ((HR[dow] || []).length) out.push({ dow: dow, label: dayLabel(dt) });
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

  var CITA_CHIP = { a: "cita", get t() { return L("📅 Agendar o cotizar", "📅 Book or get a quote"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen", "📲 Call me back"); } };
  function aviso() { return L("🔔 El equipo del taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop team gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL() { return { t: L("Llamar al ", "Call ") + C.tel, tel: C.telh }; }
  function MAPS() { return { t: L("Cómo llegar (Google Maps)", "Directions (Google Maps)"), url: C.maps }; }
  function PAGE(es, en, ues, uen) { return function () { return { t: L(es, en), url: lang === "en" ? uen : ues, self: true }; }; }
  var FAQP = PAGE("Ver preguntas frecuentes", "See the FAQ", "es-faq.html", "faq.html");
  var SVCP = PAGE("Ver los 12 servicios", "See all 12 services", "es-services.html", "services.html");
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & address", "horario y direccion", "hours and address");
  var GAR = Q("🛡️ Garantía NAPA", "🛡️ NAPA warranty", "garantia", "warranty");
  function estadoLinea(n) {
    return isOpen(n)
      ? L("🟢 Ahora mismo está abierto (hasta las " + hm(closeAt(n)) + "): puedes llamar al " + C.tel + " o pasar sin cita.", "🟢 Open right now (until " + hm(closeAt(n)) + "): call " + C.tel + " or just walk in.")
      : L("🌙 Ahora mismo está cerrado (abre " + nextOpening(n) + "). Igual te atiendo: deja aquí tu cita, tu cotización o tu «que me llamen» y el taller lo recibe al instante.",
        "🌙 Closed right now (opens " + nextOpening(n) + "). I can still help: leave your appointment, quote or call-back request here and the shop gets it instantly.");
  }
  function horarioA() { return horarioTxt() + "\n\n" + estadoLinea(nowTx()); }
  function dirA() { return L("📍 " + C.dir + ", sobre E Belt Line Road, con acceso fácil desde la US-75 y el Dallas North Tollway.", "📍 " + C.dir + ", on E Belt Line Road, easy access from US-75 and the Dallas North Tollway."); }
  function serviciosA() {
    return L("Las 12 categorías de servicio que publica el taller:\n• Frenos · Cambio de aceite y lubricación · Diagnóstico de motor (luz check engine)\n• Reparación y reemplazo de motor · Servicio de transmisión · Sistemas eléctricos\n• Aire acondicionado y calefacción · Llantas · Verificación estatal de Texas (sin cita)\n• Sistema de enfriamiento · Inyección de combustible · Batería\nNacionales e importados, gasolina e híbridos. ¿Qué le pasa a tu auto?",
      "The 12 service categories the shop lists:\n• Brakes · Oil change & lube · Engine diagnostics (check engine light)\n• Engine repair & replacement · Transmission service · Electrical systems\n• HVAC / AC repair · Tires · Texas state inspections (walk-in)\n• Cooling system · Fuel injection · Battery service\nDomestic and import, gas and hybrid. What's going on with your car?");
  }
  function noListA() {
    return L("Eso no aparece entre los servicios de su web (trabajan autos nacionales e importados, de gasolina e híbridos), así que no te lo voy a asegurar. Llama al " + C.tel + " o déjame tu teléfono y te llaman ellos.",
      "That isn't among the services on their website (they work on domestic and import cars, gas and hybrid), so I won't promise it. Call " + C.tel + " or leave your number and they'll call you.");
  }
  var KB = [
    { id: "frenos", k: ["freno", "frenos", "pastillas", "balatas", "discos", "rechina", "chilla", "abs", "brake", "brakes", "pads", "rotors", "squeak", "grinding"],
      a: function () { return L("Sí: frenos (pastillas, discos, calipers, líquido de frenos y diagnóstico de ABS). Su web dice que la mayoría de los trabajos de frenos los hacen el mismo día, siempre que las refacciones estén en stock.", "Yes: brakes (pads, rotors, calipers, brake fluid and ABS diagnosis). Their site says most brake jobs are done the same day, provided the parts are in stock."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "aceite", k: ["aceite", "cambio de aceite", "sintetico", "filtro", "lubricacion", "mantenimiento", "oil", "oil change", "synthetic", "filter", "lube", "maintenance"],
      a: function () { return L("Sí: cambio de aceite convencional, semisintético o full sintético, reemplazo de filtro y relleno de fluidos. Puedes pasar sin cita en horario o dejarlo agendado aquí.", "Yes: conventional, synthetic-blend or full-synthetic oil changes, filter replacement and fluid top-off. You can walk in during business hours or book it here."); }, c: [CITA_CHIP, HOR] },
    { id: "diagnostico", k: ["check engine", "luz del motor", "luz de motor", "testigo", "diagnostico", "escaneo", "codigo", "falla", "jalonea", "tironea", "pierde fuerza", "diagnostic", "diagnosis", "scan", "code", "light on", "misfire"],
      a: function () { return L("Sí: diagnóstico de motor por computadora (luz check engine, escaneo de códigos, desempeño, sensores y emisiones). Su web dice que la cuota de diagnóstico se descuenta de la reparación: si lo encuentran, pagas una sola vez.", "Yes: computer engine diagnostics (check engine light, code scan, performance, sensors and emissions). Their site says the diagnostic fee is credited toward the repair: once they find it, you pay once."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "motor", k: ["motor", "junta de cabeza", "banda de tiempo", "cadena de tiempo", "soportes", "humo", "engine", "head gasket", "timing belt", "timing chain", "smoke", "rebuild"],
      a: function () { return L("Sí: reparación y reemplazo de motor, desde reparaciones menores hasta motor completo (reconstrucción, banda o cadena de tiempo, junta de cabeza, soportes), con técnicos certificados ASE.", "Yes: engine repair and replacement, from minor repairs to a full engine (rebuilds, timing belt or chain, head gasket, motor mounts), by ASE-certified technicians."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "transmision", k: ["transmision", "caja", "cambios", "patina", "clutch", "embrague", "convertidor", "transmission", "slipping", "shifting", "torque converter"],
      a: function () { return L("Sí: servicio de transmisión automática y estándar: cambio de fluido, reparación, clutch, convertidor de torque y reconstrucción.", "Yes: automatic and manual transmission service: fluid change, repair, clutch, torque converter and rebuilds."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "electrico", k: ["electrico", "alternador", "marcha", "motor de arranque", "instalacion", "luces", "no arranca", "no prende", "electrical", "alternator", "starter", "wiring", "won t start", "wont start"],
      a: function () { return L("Sí: sistemas eléctricos (alternador, marcha, instalación y diagnóstico eléctrico) y servicio de batería (prueba de carga, reemplazo, sistema de carga, terminales y cables). Si no arranca, llama al " + C.tel + " o déjame los datos y te llaman.", "Yes: electrical systems (alternator, starter, wiring and electrical diagnosis) and battery service (load test, replacement, charging system, terminals and cables). If it won't start, call " + C.tel + " or leave your details and they'll call you."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "bateria", k: ["bateria", "battery", "dead battery", "bateria descargada"],
      a: function () { return L("Sí: servicio de batería: prueba de carga, reemplazo, revisión del sistema de carga, limpieza de terminales y reemplazo de cables.", "Yes: battery service: load test, replacement, charging-system check, terminal cleaning and cable replacement."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "ac", k: ["aire acondicionado", "aire", "a c", "ac", "clima", "no enfria", "calefaccion", "calefactor", "compresor", "air conditioning", "heater", "heat", "not cold", "compressor", "hvac"],
      a: function () { return L("Sí: aire acondicionado y calefacción: recarga de A/C, compresor, calefactor, detección de fugas de refrigerante y diagnóstico del control de clima.", "Yes: AC and heating: AC recharge, compressor, heater repair, refrigerant leak detection and climate-control diagnosis."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "llantas", k: ["llanta", "llantas", "neumatico", "ponchada", "pinchada", "rotacion", "balanceo", "rines", "tpms", "tire", "tires", "flat", "rotation", "balance", "wheel"],
      a: function () { return L("Sí: llantas: rotación, balanceo, reparación de llanta ponchada, reemplazo y servicio de TPMS.", "Yes: tires: rotation, balancing, flat repair, replacement and TPMS service."); }, c: [CITA_CHIP, HOR] },
    { id: "inspeccion", k: ["verificacion", "inspeccion", "inspeccion estatal", "emisiones", "sticker", "state inspection", "inspection", "emissions"],
      a: function () { return L("Sí: son estación autorizada de verificación estatal de Texas (inspección de seguridad y prueba de emisiones). Su web dice que la atienden sin cita: lunes a viernes 8:00 AM – 6:30 PM y sábado 8:00 AM – 4:00 PM.", "Yes: they're a state-authorized Texas inspection station (safety inspection and emissions test). Their site says it's walk-in: Mon–Fri 8:00 AM – 6:30 PM and Saturday 8:00 AM – 4:00 PM."); }, c: [HOR, MAPS, CITA_CHIP] },
    { id: "enfriamiento", k: ["enfriamiento", "radiador", "anticongelante", "termostato", "bomba de agua", "manguera", "se calienta", "sobrecalienta", "cooling", "radiator", "coolant", "antifreeze", "thermostat", "water pump", "overheat", "overheating"],
      a: function () { return L("Sí: sistema de enfriamiento: anticongelante, radiador, termostato, bomba de agua y mangueras. Si se está calentando, mejor no manejarlo mucho: llama al " + C.tel + " o déjame tus datos.", "Yes: cooling system: coolant, radiator, thermostat, water pump and hoses. If it's overheating, better not to drive it much: call " + C.tel + " or leave your details."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "inyeccion", k: ["inyeccion", "inyectores", "gasolina", "bomba de gasolina", "cuerpo de aceleracion", "fuel injection", "injector", "fuel pump", "throttle body", "mpg"],
      a: function () { return L("Sí: inyección de combustible: limpieza de inyectores, filtro y bomba de combustible, y limpieza del cuerpo de aceleración.", "Yes: fuel injection: injector cleaning, fuel filter and fuel pump service, and throttle-body cleaning."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "hibrido", k: ["hibrido", "hybrid", "prius"],
      a: function () { return L("Sí: su FAQ dice que sus técnicos certificados ASE dan servicio a vehículos híbridos junto a los de gasolina, nacionales e importados.", "Yes: their FAQ says their ASE-certified technicians service hybrid vehicles alongside conventional gas, domestic and import."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "garantia", k: ["garantia", "napa", "warranty", "guarantee"],
      a: function () { return L("Son Centro NAPA Auto Care: las reparaciones que califican tienen garantía nacional de 24 meses o 24,000 millas (lo que llegue primero), en refacciones y mano de obra, válida en más de 17,000 talleres NAPA del país. Guarda tu factura; ellos también la tienen en archivo.", "They're a NAPA Auto Care Center: qualifying repairs carry a nationwide 24-month / 24,000-mile warranty (whichever comes first) on parts and labor, honored at over 17,000 NAPA shops. Keep your invoice; they keep a copy on file too."); }, c: [CITA_CHIP, FAQP] },
    { id: "marcas", k: ["marca", "marcas", "importado", "toyota", "honda", "ford", "chevrolet", "chevy", "gmc", "ram", "nissan", "hyundai", "kia", "mazda", "subaru", "bmw", "mercedes", "audi", "volkswagen", "lexus", "acura", "infiniti", "make", "makes", "model", "import", "domestic"],
      a: function () { return L("Su FAQ dice: cada marca y modelo común, nacionales e importados, gasolina e híbridos: Toyota, Honda, Ford, Chevrolet, GMC, Ram, Nissan, Hyundai, Kia, Mazda, Subaru, BMW, Mercedes-Benz, Audi, Volkswagen, Lexus, Acura, Infiniti y muchas más.", "Their FAQ says: every common make and model, domestic and import, gas and hybrid: Toyota, Honda, Ford, Chevrolet, GMC, Ram, Nissan, Hyundai, Kia, Mazda, Subaru, BMW, Mercedes-Benz, Audi, Volkswagen, Lexus, Acura, Infiniti and many more."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nolist", k: ["moto", "motos", "motocicleta", "camion pesado", "trailer", "traila", "diesel", "electrico tesla", "tesla", "carro electrico", "auto electrico", "grua", "remolque", "a domicilio", "mecanico movil", "carroceria", "pintura", "choque", "hojalateria", "motorcycle", "semi", "electric car", "ev", "tow", "towing", "mobile mechanic", "body shop", "paint", "collision", "boat", "rv"], a: noListA, c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "services", "what do you fix", "what do you do", "repairs"], a: serviciosA, c: [CITA_CHIP, SVCP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "presupuesto gratis", "cotizacion gratis", "sin costo", "gratis", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "free estimate", "free quote"],
      a: function () { return L("Los precios te los da el taller: su web dice que trabajan con evaluaciones honestas y cotizaciones claras desde el principio, y que platican contigo lo que probablemente cuesta antes de mover una sola herramienta. Lo que sí hago: te dejo pedida la cotización con tu auto y lo que le pasa, y te llaman.", "Pricing comes from the shop: their site says they work with honest assessments and upfront quotes, and talk through what it likely costs before any wrench turns. What I can do: request the quote with your car and what's going on, and they'll call you."); }, c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "financiamiento", k: ["financiamiento", "financiar", "pagos", "a plazos", "credito", "financing", "payment plan"],
      a: function () { return L("Su FAQ dice que no manejan un programa propio de financiamiento, pero trabajan contigo en las cotizaciones, priorizan las reparaciones por seguridad y te ayudan a escalonar lo que no tiene que hacerse todo de una vez.", "Their FAQ says they don't run their own financing program, but they work with you on quotes, prioritize repairs by safety and help you sequence work that doesn't all need to happen at once."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "pago", k: ["forma de pago", "formas de pago", "tarjeta", "efectivo", "debito", "pagar", "payment", "pay", "card", "cash", "debit", "credit card"],
      a: function () { return L("Aceptan efectivo, tarjeta de crédito y de débito (según su FAQ).", "They accept cash, credit and debit cards (per their FAQ)."); }, c: [CITA_CHIP] },
    { id: "aventon", k: ["aventon", "raite", "ride", "auto prestado", "carro prestado", "cortesia", "loaner", "courtesy", "shuttle"],
      a: function () { return L("Su FAQ dice que ofrecen aventones de cortesía dentro de Richardson cuando la agenda lo permite; conviene avisar antes. Lo anoto en tu pedido si quieres.", "Their FAQ says they offer courtesy rides within Richardson when the schedule allows; best to ask ahead. I can note it in your request."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "buzon", k: ["dejar el auto", "dejar mi auto", "dejar el carro", "fuera de horario", "buzon", "llaves", "drop off", "drop box", "after hours", "leave my car", "keys"],
      a: function () { return L("Sí: tienen un buzón para entregar fuera de horario. Te estacionas en el lote, llenas el sobre, dejas las llaves y te llaman en la mañana antes de empezar cualquier trabajo. Si quieres, te dejo el pedido listo aquí para que ya sepan qué le pasa.", "Yes: they have an after-hours drop box. Park in the lot, fill out the envelope, drop your keys, and they call you in the morning before any work starts. If you like, I can leave your request here so they already know what's going on."); }, c: [CITA_CHIP, MAPS] },
    { id: "tiempo", k: ["cuanto tarda", "cuanto tiempo", "cuantas horas", "cuantos dias", "rapido", "mismo dia", "hoy mismo", "how long", "how fast", "turnaround", "same day", "today"],
      a: function () { return L("Su web dice que hacen lo posible por revisarte el mismo día, y que la mayoría de los trabajos de frenos salen el mismo día si hay refacciones en stock. Para trabajos más grandes les ayuda que avises antes, para tener las refacciones a la mano.", "Their site says they do their best to look at your car the same day, and most brake jobs are same-day if parts are in stock. For bigger jobs a heads-up helps them have parts on hand."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llegar", "llegar sin avisar", "without appointment", "drop by", "stop by"],
      a: function () { return L("Sí: su web dice que aceptan clientes sin cita «siempre», lunes a viernes 8:00 AM – 6:30 PM y sábado 8:00 AM – 4:00 PM. Para trabajos grandes les ayuda que avises; te lo dejo agendado aquí si quieres.", "Yes: their site says walk-ins are \"always\" welcome, Mon–Fri 8:00 AM – 6:30 PM and Saturday 8:00 AM – 4:00 PM. For bigger jobs a heads-up helps; I can book it here if you like."); }, c: [CITA_CHIP, MAPS] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue"],
      a: function () { return L("Sí: servicio bilingüe en inglés y español. Aquí te atiendo en los dos (botón EN arriba).", "Yes: bilingual service in English and Spanish. I can help you in either one (ES button at the top)."); }, c: [CITA_CHIP] },
    { id: "zonas", k: ["garland", "plano", "allen", "murphy", "wylie", "sachse", "lake highlands", "dallas", "zona", "zonas", "atienden", "lejos", "area", "serve"],
      a: function () { return L("Están sobre E Belt Line Road en Richardson y atienden regularmente a conductores de Garland, Plano, Allen, Murphy, Wylie, Sachse, Lake Highlands y el norte de Dallas.", "They're on E Belt Line Road in Richardson and regularly serve drivers from Garland, Plano, Allen, Murphy, Wylie, Sachse, Lake Highlands and north Dallas."); }, c: [MAPS, CITA_CHIP] },
    { id: "historia", k: ["desde cuando", "cuantos anos", "familia", "dueno", "miguel", "ibarra", "historia", "resenas", "opiniones", "how long in business", "owner", "family", "reviews", "rating"],
      a: function () { return L("Taller familiar desde 1998: Miguel Ibarra lo abrió sobre E Belt Line Road con una sola regla, no recomendar una reparación que el auto no necesite. Técnicos certificados ASE, Centro NAPA Auto Care y 4.5★ en 136 reseñas de Google.", "Family-owned since 1998: Miguel Ibarra opened it on E Belt Line Road with one rule, never recommend a repair the car doesn't need. ASE-certified technicians, NAPA Auto Care Center and 4.5★ across 136 Google reviews."); }, c: [CITA_CHIP] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "lunes", "hoy abren", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, MAPS] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "belt line", "address", "location", "where", "directions", "located"],
      a: function () { return dirA() + L("\nSi quieres, te dejo agendada la cita desde aquí y el taller te confirma.", "\nI can book the appointment from here and the shop confirms."); }, c: [MAPS, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "sms", "phone", "number", "call", "text", "contact"],
      a: function () { return L("El canal que publica el taller es el teléfono:\n📞 " + C.tel + "\nNo publican WhatsApp. En su web también hay un formulario (te contestan en un día hábil). O deja aquí tu teléfono y te llaman ellos.", "The channel the shop publishes is the phone:\n📞 " + C.tel + "\nThey don't list WhatsApp. Their site also has a form (they reply within one business day). Or leave your number here and they'll call you."); }, c: [TEL, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: function () { return L("¡Con gusto! Si necesitas algo más, aquí estoy. ⭐", "You're welcome! I'm here if you need anything else. ⭐"); }, c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "agendar", "agenda", "cotizacion", "cotizar", "presupuesto", "estimado", "reservar", "turno", "revisar mi auto", "revisar mi carro", "revisen", "llevar el auto", "llevar el carro", "appointment", "estimate", "quote", "book", "schedule", "bring my car"];
  function bestIntent(text) {
    var ut = toks(text), best = null, bs = 0;
    if (!ut.length) return null;
    KB.forEach(function (e) {
      var s = 0; e.k.forEach(function (ph) { s = Math.max(s, phraseScore(ph, ut)); });
      if (s > bs) { bs = s; best = e; }
    });
    return bs > 0 ? { e: best, s: bs } : null;
  }
  function isPriceQ(n) { return /\b(precio|precios|cuesta|cuestan|cuanto sale|cuanto cobran|costo|caro|barato|price|prices|how much|cost|cheap|rates|\$)\b/.test(n); }
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { return phraseScore(ph, ut) > 0; }); }
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i", "not"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|auto)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|precio|horario|donde|necesito|quiero|mi carro|mi auto|gracias|cual|frenos|llanta)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/\(972\) 231-2886/g, '<a href="tel:+19722312886">(972) 231-2886</a>'); }
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
          if (c.tel) { b = el("a", "r24-chip", "📞 " + esc(c.t)); b.href = "tel:" + c.tel; }
          else if (c.url) { b = el("a", "r24-chip", esc(c.t)); b.href = c.url; if (!c.self) { b.target = "_blank"; b.rel = "noopener"; } }
          else { var tt = c.t; b = el("button", "r24-chip", esc(tt)); b.type = "button"; b.onclick = function () { w.remove(); handle(c.v || c.q || tt, c, tt); }; }
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
    else { status.className = "r24-status r24-closed"; status.textContent = L("🌙 Cerrado ahora (abre " + nextOpening(n) + ") · te atiendo igual y el taller recibe tu pedido", "🌙 Closed now (opens " + nextOpening(n) + ") · I'll still take your request"); }
  }
  function menuChips() { return [CITA_CHIP, SVC, HOR, GAR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Richardson, TX";
    panel.querySelector(".r24-in").placeholder = L("Escribe tu pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · tus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    banner.textContent = L("Demo privada preparada para The Star Auto Service", "Private demo prepared for The Star Auto Service");
    panel.querySelector(".r24-human").textContent = L("👤 Hablar con una persona", "👤 Talk to a person");
  }
  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    banner = el("div", "r24-demo-banner"); banner.setAttribute("role", "note"); document.body.appendChild(banner);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"><span class="r24-lt"></span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk")); document.body.appendChild(launch);
    panel = el("div", "r24-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Recepción 24 h");
    panel.innerHTML = '<div class="r24-head"><div class="r24-av"><img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"></div><div class="r24-ht"><b></b><small></small></div><button class="r24-lang" type="button"></button><button class="r24-x" type="button" aria-label="Cerrar">×</button></div><div class="r24-status"></div><button class="r24-human" type="button"></button><div class="r24-body" aria-live="polite"></div><form class="r24-foot"><input class="r24-in" type="text" autocomplete="off" maxlength="300"><button class="r24-send" type="submit"></button></form><div class="r24-legal"></div>';
    document.body.appendChild(panel);
    body = panel.querySelector(".r24-body"); input = panel.querySelector(".r24-in"); status = panel.querySelector(".r24-status");
    panel.querySelector(".r24-human").onclick = humano;
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
    if (announce) addBot(L("Perfecto, seguimos en español. ¿En qué te ayudo?", "Sure, let's continue in English. How can I help?"), flow ? [] : menuChips());
    if (flow && announce) setTimeout(function () { ask(flow.step); }, 600);
  }
  // R24-HUMANO-1018: siempre a la vista; nunca deja al cliente atrapado con el asistente
  function humano() {
    flow = null; addUser(L("👤 Hablar con una persona", "👤 Talk to a person"));
    var n = nowTx();
    addBot(isOpen(n) ? L("Claro. El taller está abierto ahora (hasta las " + hm(closeAt(n)) + "): llama al " + C.tel + " y te atiende una persona del equipo, en español o inglés. Si prefieres, te llaman ellos: déjame tu nombre y teléfono.", "Sure. The shop is open now (until " + hm(closeAt(n)) + "): call " + C.tel + " and a person on the team will help you, in English or Spanish. Or they can call you: just leave your name and number.")
      : L("Claro. Ahora está cerrado (abre " + nextOpening(n) + "). Déjame tu nombre y teléfono y una persona del taller te llama; el pedido le llega al instante. También puedes llamar al " + C.tel + " en horario.", "Sure. It's closed right now (opens " + nextOpening(n) + "). Leave your name and number and someone from the shop will call you; they get the request instantly. You can also call " + C.tel + " during business hours."), [TEL(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy la recepción virtual de The Star Auto Service (Belt Line, Richardson). Te ayudo a agendar o cotizar, te cuento servicios, horario y garantía NAPA, o hago que te llamen, a cualquier hora, también de noche y el domingo.\n¿En qué te ayudo?",
      "Hi! 👋 I'm the virtual front desk for The Star Auto Service (Belt Line, Richardson). I can book an appointment or quote, answer questions about services, hours and the NAPA warranty, or have someone call you — any time, even at night and on Sunday.\nHow can I help?"), menuChips());
  }
  function open(mode) {
    if (mode === "es" || mode === "en") { if (lang !== mode) { lang = mode; headTexts(); } mode = null; }
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "cita" && !flow) setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }
  function opts(a) { return a.map(function (t) { return { t: t, v: t, flow: true }; }); }
  function SINT() { return lang === "en" ? ["Brakes", "Oil change", "Check engine light / diagnostics", "Engine", "Transmission", "Electrical / battery", "AC / heating", "Tires", "State inspection", "Overheating / cooling", "Other / not sure"]
    : ["Frenos", "Cambio de aceite", "Luz check engine / diagnóstico", "Motor", "Transmisión", "Eléctrico / batería", "A/C / calefacción", "Llantas", "Verificación estatal", "Se calienta / enfriamiento", "Otra cosa / no sé"]; }
  function franjas(dow) {
    var sat = dow === 6, wd = dow == null;
    return opts([L("Mañana (8:00 AM – 12:00 PM)", "Morning (8:00 AM – 12:00 PM)"),
      sat ? L("Tarde (12:00 – 4:00 PM)", "Afternoon (12:00 – 4:00 PM)") : wd ? L("Tarde (desde las 12:00 PM)", "Afternoon (from 12:00 PM)") : L("Tarde (12:00 – 6:30 PM)", "Afternoon (12:00 – 6:30 PM)"),
      L("Me da igual", "Either is fine")]);
  }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos te dejo el pedido listo para el taller. (Escribe «cancelar» si quieres salir.)\n¿Qué necesitas?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Agendar una cita", "Book an appointment"), L("Una cotización", "A quote"), L("Las dos cosas", "Both")]));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || L("Consulta general", "General question")).slice(0, 120) } };
    addBot(L("¡Claro! Te llama una persona del taller. Solo necesito dos datos.\n¿Cómo te llamas? (Escribe «cancelar» si quieres salir.)", "Sure! Someone from the shop will call you. I just need two things.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del auto? (por ejemplo: 2017 Toyota Camry)", "Year, make and model? (e.g. 2017 Toyota Camry)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesitas? Puedes elegir o escribirlo con tus palabras.", "What's going on, or what service do you need? Pick one or describe it in your own words."), opts(SINT()));
    else if (step === "dia") {
      var days = nextWorkdays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día te queda mejor? Te muestro solo días con el taller abierto (domingo cerrado). Lo anoto como preferencia y el taller te confirma.", "Which day works best? I'm only showing days the shop is open (closed Sunday). I'll note it as a preference and the shop confirms."),
        opts(days.map(function (x) { return x.label; })).concat(opts([L("Lo antes posible", "As soon as possible")])));
    }
    else if (step === "franja") addBot(L("¿En qué franja?", "What time window?"), franjas(flow.dow));
    else if (step === "nombre") addBot(L("¿Cómo te llamas?", "What's your name?"));
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto, " + d.nombre + ". ¿A qué teléfono te llaman?", "Great, " + d.nombre + ". What number should they call?")
      : L("Último paso: ¿a qué teléfono te llaman para confirmar?", "Last step: what number should they call to confirm?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?");
      if (d.tipo === "llamada") { addBot(L("Revisa tu solicitud de llamada:\n👤 Nombre: ", "Please review your call-back request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revisa tu solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Auto: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n🔧 Qué le pasa: ", "\n🔧 What's going on: ") + d.sintoma + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop|exit|quit)$/.test(n)) { flow = null; addBot(L("Sin problema, cancelé la solicitud. ¿Te ayudo con otra cosa?", "No problem, I've cancelled the request. Anything else?"), [CITA_CHIP, LLAMADA_CHIP, HOR]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "tipo":
        d.servicio = t.slice(0, 40);
        addBot(L("Bien. Dato de su web: la cuota de diagnóstico se descuenta de la reparación, y en trabajos grandes les ayuda saber antes qué necesitas para tener las refacciones a la mano.", "Got it. From their site: the diagnostic fee is credited toward the repair, and for bigger jobs it helps them to know ahead so they have parts on hand."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60); ask("sintoma"); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask("dia"); return;
      case "dia": d.dia = t.slice(0, 60); flow.dow = flow.days && flow.days.hasOwnProperty(t) ? flow.days[t] : null; ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask("nombre"); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dices tu nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbelo con 10 cifras (con código de área), por ejemplo 972-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 972-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)"), nn = nowTx();
          var cuando = isOpen(nn) ? L("en cuanto se libere alguien (hoy están abiertos hasta las " + hm(closeAt(nn)) + ")", "as soon as someone's free (open today until " + hm(closeAt(nn)) + ")") : L("cuando abran (" + nextOpening(nn) + ")", "when they open (" + nextOpening(nn) + ")");
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe tu pedido al instante y te llama al " + d.telefono + " " + cuando + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will call you at " + d.telefono + " " + cuando + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Tu solicitud quedó registrada.\nEl taller te llama al " + d.telefono + " " + cuando + " para confirmar el día y la hora; la cotización te la dan ellos.", "All set, " + nm2 + "! ✅ Your request is in.\nThe shop will call you at " + d.telefono + " " + cuando + " to confirm the day and time; the quote comes from them.") + DEMO, [MAPS(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
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
    addBot(L("Eso te lo confirma mejor el taller, así tienes el dato exacto. 😊\nLlama al " + C.tel + " o déjame tu teléfono y te llaman ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall " + C.tel + " or leave your number and they'll call you."), [TEL, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot(L("Claro, ¿qué más quieres saber?", "Sure, what else would you like to know?"), menuChips()); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué te puedo ayudar? Te agendo citas o cotizaciones, hago que te llamen y te cuento servicios, horario, garantía y dirección.", "Hi! How can I help? I can book appointments or quotes, have someone call you, and tell you about services, hours, warranty and location."), menuChips()); return; }
    if (/^(horario y direccion|hours and address)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [MAPS, CITA_CHIP, LLAMADA_CHIP]); return; }
    if (/\b(que me llamen|llamenme|me llaman|call me|call me back)\b/.test(n)) { startLlamada(); return; }
    if (/\b(persona|humano|alguien real|asesor|person|human|someone real|real person)\b/.test(n)) { humano(); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (/\bsin cita\b|walk ?in|without (an )?appointment|no appointment|sin avisar/.test(n)) { reply(byId("walkin")); return; }
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|agendar|cotiz|presupuesto|appointment|estimate|quote|schedule|book/.test(n))) { startCita(); return; }
    if (price && !(bi && bi.e.id === "nolist")) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
