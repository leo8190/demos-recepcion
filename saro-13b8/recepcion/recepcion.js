/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · SA & RO Auto Repair (taller familiar de Henry y Brandon Sánchez, 10208 Garland Rd, Dallas, TX 75218) — DEMO privada, bilingüe ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica saroautorepair.com (una sola página EN/ES con su botón de idioma, revisada el 19/10/2026):
   - Teléfonos: Henry Sanchez 214-324-3588 y Brandon Sanchez 469-879-1349. No publican email. Su formulario «Cotización gratis» dice que
     «uno de nuestros miembros del equipo se pondrá en contacto contigo pronto».
   - Horario (barra superior, Contacto y pie): lunes a sábado 8:00 AM – 7:00 PM; domingo con cita previa (hora de Dallas, Texas).
   - Servicios (los 7 de su web): diagnósticos computarizados; frenos (inspección, pastillas, rectificado de discos, sistema hidráulico);
     A/C (diagnóstico, recarga de refrigerante, compresor, climatización); motor (afinaciones, juntas, reconstrucción); transmisiones automáticas
     y manuales (diagnóstico, fluidos, reconstrucción, reemplazo); suspensión (amortiguadores, struts, brazos de control, alineación de ruedas);
     fallas eléctricas (cableado, fusibles, batería, alternador, motor de arranque).
   - Estimado gratis y sin compromiso (su web dice «100%»; la recepción no repite cifras); presupuesto claro antes de empezar; sin cargos ocultos; tú apruebas antes de que trabajen.
     La mayoría de las reparaciones, el mismo día o al día siguiente si las piezas lo permiten. Pago: efectivo y Zelle. Equipo bilingüe.
     Taller familiar; más de 10 años; más de 5,000 autos reparados.
   Sin precios (su web no publica ninguno), sin WhatsApp; no promete grúa, llantas, carrocería, cambio de aceite, emisiones, financiamiento, garantía
   ni nada que su web no liste. Español en «tú», como su web. */
(function () {
  "use strict";
  var C = {
    nombre: "SA & RO Auto Repair", corto: "SA & RO Auto Repair",
    dir: "10208 Garland Rd, Dallas, TX 75218",
    maps: "https://www.google.com/maps/dir/?api=1&destination=10208+Garland+Rd+Dallas+TX+75218",
    he: { tel: "214-324-3588", telh: "+12143243588" }, br: { tel: "469-879-1349", telh: "+14698791349" }
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  function HEN() { return L("Henry Sánchez", "Henry Sanchez"); }
  function BRA() { return L("Brandon Sánchez", "Brandon Sanchez"); }
  function TELS() { return HEN() + " " + C.he.tel + " · " + BRA() + " " + C.br.tel; }
  // Horario publicado (minutos desde las 0:00, hora de Dallas/Central). 0 = domingo: solo con cita previa (no se cuenta como «abierto»).
  var LS = [[480, 1140]];
  var H = { 1: LS, 2: LS, 3: LS, 4: LS, 5: LS, 6: LS, 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller (hora de Dallas, Texas):\n• Lunes a sábado: 8:00 a.m. – 7:00 p.m.\n• Domingo: con cita previa",
      "Shop hours (Dallas, Texas time):\n• Monday–Saturday: 8:00 AM – 7:00 PM\n• Sunday: by appointment");
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
  // Días que se pueden pedir: lunes a sábado (horario) y domingo marcado «con cita previa», como dice su web
  function nextWorkdays(n, k) {
    var out = [];
    if (isOpen(n) && closeAt(n) - n.min >= 90) out.push({ dow: n.dow, label: L("Hoy", "Today") });
    for (var i = 1; out.length < k && i < 14; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay();
      if ((H[dow] || []).length) out.push({ dow: dow, label: dayLabel(dt) });
      else if (dow === 0) out.push({ dow: 0, label: dayLabel(dt) + L(" (con cita previa)", " (by appointment)") });
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

  var CITA_CHIP = { a: "cita", get t() { return L("🔧 Cotización gratis o cita", "🔧 Free quote or appointment"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen o escriban", "📲 Call or text me back"); } };
  function aviso() { return L("🔔 El taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TELHE() { return { t: L("Llamar a Henry ", "Call Henry ") + C.he.tel, tel: C.he.telh }; }
  function TELBR() { return { t: L("Llamar a Brandon ", "Call Brandon ") + C.br.tel, tel: C.br.telh }; }
  function MAPA() { return { t: L("📍 Cómo llegar · Google Maps", "📍 Directions · Google Maps"), url: C.maps }; }
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & address", "horario y direccion", "hours and address");
  var PAGO = Q("💵 Formas de pago", "💵 Payment", "formas de pago", "payment options");
  function dirA() { return L("📍 " + C.dir + "\n📞 " + TELS(), "📍 " + C.dir + "\n📞 " + TELS()); }
  function statusLine(n) {
    if (isOpen(n)) return L("🟢 Ahora están abiertos, hasta las " + hm(closeAt(n)) + ".", "🟢 They're open now, until " + hm(closeAt(n)) + ".");
    if (n.dow === 0) return L("📅 Hoy es domingo: atienden solo con cita previa (el horario normal vuelve " + nextOpening(n) + "). Te tomo el pedido ahora y el taller te confirma.", "📅 It's Sunday: by appointment only (regular hours resume " + nextOpening(n) + "). I can take your request now and the shop confirms.");
    return L("🌙 Ahora están cerrados; abren " + nextOpening(n) + ". Igual te tomo el pedido ahora y el taller lo recibe al instante.", "🌙 They're closed right now; they open " + nextOpening(n) + ". I can still take your request now and the shop gets it instantly.");
  }
  function horarioA() { return horarioTxt() + "\n" + statusLine(nowTx()); }
  function serviciosA() {
    return L("Los 7 servicios que publica el taller:\n• Diagnósticos (computarizado, para encontrar el problema exacto)\n• Frenos (inspección, pastillas, rectificado de discos, sistema hidráulico)\n• Aire acondicionado (diagnóstico, recarga de refrigerante, compresor, climatización)\n• Reparación de motor (afinaciones, juntas, reconstrucción completa)\n• Transmisiones automáticas y manuales (diagnóstico, fluidos, reconstrucción, reemplazo)\n• Suspensión (amortiguadores, brazos de control, alineación de ruedas)\n• Fallas eléctricas (cableado, fusibles, batería, alternador, motor de arranque)\nEstimado gratis y sin compromiso. ¿Qué le pasa a tu auto?",
      "The 7 services the shop lists:\n• Diagnostics (computerized, to pinpoint the exact issue)\n• Brakes (inspection, pads, rotor resurfacing, hydraulic repairs)\n• A/C (diagnostics, refrigerant recharge, compressor, climate control)\n• Engine repair (tune-ups, gaskets, full rebuilds)\n• Automatic and manual transmissions (diagnostics, fluid service, rebuilds, replacements)\n• Suspension (shocks, struts, control arms, wheel alignments)\n• Electrical (wiring, fuses, battery, alternator, starter)\nFree, no-obligation estimates. What's going on with your car?");
  }
  function noListA() {
    return L("Eso no aparece entre los servicios de su web, así que no te lo voy a asegurar. Llama al taller (" + TELS() + ") o déjame tu teléfono y te contactan ellos.",
      "That isn't among the services on their website, so I won't promise it. Call the shop (" + TELS() + ") or leave your number and they'll get back to you.");
  }
  function noPubA() {
    return L("Eso su web no lo dice, así que no te lo voy a inventar: te lo confirma el taller. Llama (" + TELS() + ") o déjame tu teléfono y te contactan ellos.",
      "Their site doesn't say, so I won't make it up: the shop will confirm. Call (" + TELS() + ") or leave your number and they'll get back to you.");
  }
  var KB = [
    { id: "transmision", k: ["transmision", "transmisiones", "caja", "caja de cambios", "cambios", "patina", "patinando", "jalonea", "no entra el cambio", "reconstruir transmision", "automatica", "estandar", "manual", "clutch", "embrague", "transmission", "slipping", "slips", "hard shift", "shifting", "gearbox", "transmission fluid"],
      a: function () { return L("Sí: transmisiones automáticas y manuales: diagnóstico, cambio de fluidos, reconstrucción y reemplazo, para que cambie suave y confiable. Te dan un presupuesto claro antes de empezar y tú decides.",
        "Yes: automatic and manual transmissions: diagnostics, fluid service, rebuilds and replacements for smooth, reliable shifting. You get a clear estimate before any work begins, and you decide."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "frenos", k: ["freno", "frenos", "balatas", "pastillas", "discos", "rectificado", "rechina", "rechinan", "chillan", "pedal", "hidraulico", "brake", "brakes", "pads", "rotors", "squeak", "squeal", "grinding", "hydraulic"],
      a: function () { return L("Sí: inspección completa de frenos, cambio de pastillas, rectificado de discos y reparación del sistema hidráulico. Te dan el presupuesto claro antes de empezar (estimado gratis) y tú apruebas antes de que trabajen.",
        "Yes: complete brake inspection, pad replacement, rotor resurfacing and hydraulic brake repairs. You get a clear estimate before any work (free) and you approve before they start."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "diagnostico", k: ["diagnostico", "diagnosticos", "check engine", "luz del motor", "luz de motor", "luz de check engine", "testigo", "codigo", "codigos", "escaner", "computadora", "falla", "fallas", "que tiene", "diagnostic", "diagnostics", "check engine light", "code", "scan", "warning light"],
      a: function () { return L("Sí: diagnóstico computarizado de última generación para encontrar el problema exacto de tu vehículo, rápido y con precisión. Su web dice que primero identifican el problema real antes de tocar tu auto, para ahorrarte reparaciones innecesarias.",
        "Yes: state-of-the-art computerized diagnostics to pinpoint the exact issue quickly and accurately. Their site says they find the real problem before touching your car, saving you unnecessary repairs."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "motor", k: ["motor", "fuga de aceite", "oil leak", "afinacion", "afinar", "junta", "juntas", "empaque", "empaques", "reconstruir motor", "reconstruccion de motor", "tiembla", "pierde fuerza", "humo", "cascabelea", "engine", "tune up", "tune-up", "gasket", "engine rebuild", "misfire", "rough idle", "knocking", "smoke"],
      a: function () { return L("Sí: reparación de motor, desde afinaciones menores y cambio de juntas hasta reconstrucciones completas de motor. Primero hacen el diagnóstico correcto y te dan un presupuesto claro antes de comenzar.",
        "Yes: engine repair, from minor tune-ups and gasket replacements to major engine rebuilds. They diagnose it right first and give you a clear estimate before any work begins."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "ac", k: ["aire acondicionado", "aire", "a c", "ac", "clima", "climatizacion", "no enfria", "compresor", "recarga", "refrigerante", "gas del aire", "air conditioning", "not cold", "compressor", "recharge", "refrigerant", "freon", "climate control"],
      a: function () { return L("Sí: diagnóstico completo de aire acondicionado, recarga de refrigerante, reparación del compresor y restauración del sistema de climatización.",
        "Yes: full A/C diagnostics, refrigerant recharge, compressor repair and climate control system restoration."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "suspension", k: ["suspension", "amortiguadores", "struts", "brazos de control", "brazo de control", "alineacion", "alinear", "alineado", "tren delantero", "truena", "rebota", "shocks", "control arms", "alignment", "wheel alignment", "front end", "bouncy"],
      a: function () { return L("Sí: suspensión: amortiguadores, struts, brazos de control, alineación de ruedas e inspección completa de suspensión, para un manejo suave y cómodo.",
        "Yes: suspension: shocks, struts, control arms, wheel alignments and full suspension inspections for a smooth, comfortable ride."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "electrico", k: ["bateria", "electrico", "electrica", "fallas electricas", "sistema electrico", "alternador", "motor de arranque", "marcha", "fusible", "fusibles", "cableado", "luces", "no carga", "battery", "electrical", "starter", "alternator", "wiring", "fuse", "fuses", "lights", "charging"],
      a: function () { return L("Sí: fallas eléctricas: cableado, fusibles, batería, alternador, motor de arranque y diagnóstico completo del sistema eléctrico.",
        "Yes: electrical: wiring, fuses, battery, alternator, starter and full electrical system troubleshooting and repair."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "calienta", k: ["se calienta", "sobrecalienta", "calentando", "radiador", "anticongelante", "termostato", "bomba de agua", "pierde agua", "overheat", "overheating", "radiator", "coolant", "thermostat", "water pump"],
      a: function () { return L("Su web no lista por separado el sistema de enfriamiento (radiador, bomba de agua, termostato), así que no te lo voy a asegurar. Lo que sí hacen: diagnóstico computarizado y reparación de motor, para encontrar la causa. Te confirma el taller (" + TELS() + "), o déjame tu teléfono y te contactan.",
        "Their site doesn't list the cooling system separately (radiator, water pump, thermostat), so I won't promise it. What they do list: computerized diagnostics and engine repair, to find the cause. The shop will confirm (" + TELS() + "), or leave your number and they'll reach out."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nolist", k: ["grua", "remolque", "remolcar", "llanta", "llantas", "ponchada", "neumatico", "neumaticos", "carroceria", "hojalateria", "pintura", "choque", "cambio de aceite", "aceite", "escape", "mofle", "emisiones", "inspeccion estatal", "verificacion", "sticker", "moto", "motos", "motocicleta", "a domicilio", "mecanico movil", "parabrisas", "vidrios", "tow", "towing", "tire", "tires", "flat", "body shop", "paint", "collision", "oil change", "oil", "exhaust", "muffler", "emissions", "state inspection", "inspection sticker", "motorcycle", "mobile mechanic", "windshield"], a: noListA, c: [TELHE, TELBR, LLAMADA_CHIP] },
    { id: "nomaneja", k: ["no arranca", "no prende", "no camina", "no se puede manejar", "varado", "quedado", "won t start", "wont start", "not drivable", "stranded", "broke down"],
      a: function () { return L("Su web no publica servicio de grúa. Si no arranca, puede ser la batería, el alternador o el motor de arranque, y eso sí lo revisan (fallas eléctricas). Llama a " + TELS() + ", o déjame tu teléfono y te contactan ellos para decirte cómo llevarlo.",
        "Their site doesn't list towing. If it won't start, it may be the battery, alternator or starter, and those they do check (electrical). Call " + TELS() + ", or leave your number and they'll reach out about getting it there."); }, c: [TELHE, TELBR, LLAMADA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "services", "what do you fix", "what do you do", "repairs"], a: serviciosA, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "price", "prices", "how much", "cost", "cheap", "rates", "discount"],
      a: function () { return L("Los precios te los da el taller, y su web no publica ninguno. Lo que sí dice: estimado gratis y sin compromiso, un presupuesto claro antes de empezar, sin cargos ocultos ni sorpresas, y tú apruebas antes de que trabajen. Lo que puedo hacer: dejarte pedida la cotización con tu vehículo y lo que le pasa, y te contactan.",
        "Pricing comes from the shop, and their site doesn't publish any. What it does say: free, no-obligation estimates, a clear estimate before any work, no hidden or surprise charges, and you approve before they start. What I can do: request your quote with your vehicle and what's going on, and they'll get back to you."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "presupuesto", k: ["cotizacion gratis", "presupuesto gratis", "estimado gratis", "es gratis", "sin costo", "sin compromiso", "free estimate", "free quote", "is it free"],
      a: function () { return L("Sí: su web dice que el estimado es gratis y sin compromiso. Te dan un presupuesto claro antes de empezar y tú decides. Te dejo pedida la tuya en un minuto.",
        "Yes: their site says the estimate is free, with no obligation. You get a clear estimate before any work and you decide. I can request yours in a minute."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "pago", k: ["zelle", "efectivo", "tarjeta", "tarjetas", "formas de pago", "metodos de pago", "como pago", "pagar", "pago", "cash", "card", "credit card", "debit", "payment", "payment options", "pay"],
      a: function () { return L("Su web dice: efectivo y Zelle («Contáctanos para más opciones»). Si quieres pagar de otra forma, confírmalo con el taller (" + TELS() + ").",
        "Their site says: cash and Zelle (\"Contact us for more options\"). For any other method, check with the shop (" + TELS() + ")."); }, c: [TELHE, TELBR, CITA_CHIP] },
    { id: "nopub", k: ["financiamiento", "financiar", "a plazos", "plan de pagos", "credito", "garantia", "garantizan", "financing", "payment plan", "credit", "warranty", "guarantee"], a: noPubA, c: [TELHE, TELBR, LLAMADA_CHIP] },
    { id: "tiempo", k: ["cuanto tarda", "cuanto tiempo", "cuantas horas", "cuantos dias", "rapido", "mismo dia", "hoy mismo", "para hoy", "para manana", "how long", "how fast", "turnaround", "same day", "next day"],
      a: function () { return L("Su web dice que la mayoría de las reparaciones se completan el mismo día o al día siguiente, cuando las piezas lo permiten. Cuánto tarda el tuyo te lo dice el taller después del diagnóstico. Si quieres, te dejo pedido que te llamen o escriban.",
        "Their site says most repairs are completed same-day or next-day whenever parts allow. How long yours takes, the shop tells you after the diagnosis. I can have them call or text you."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llegar", "llegar sin avisar", "necesito cita", "dejar el carro", "dejar el auto", "without appointment", "drop by", "stop by", "drop off", "need an appointment"],
      a: function () { return L("Su web no dice si atienden sin cita; lo que publica es el horario: lunes a sábado de 8:00 a.m. a 7:00 p.m., y el domingo con cita previa. Para no ir en balde, te dejo aquí pedida la cita o la cotización y el taller te confirma, o llama a " + TELS() + ".",
        "Their site doesn't say whether they take walk-ins; what it lists are the hours: Monday–Saturday 8:00 AM – 7:00 PM, and Sunday by appointment. To be safe, I can request the appointment or quote here and the shop confirms, or call " + TELS() + "."); }, c: [CITA_CHIP, TELHE, TELBR] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue", "bilingual"],
      a: function () { return L("Sí: su equipo es bilingüe y atiende en español e inglés. Aquí te atiendo en los dos (botón EN arriba).", "Yes: their team is bilingual (\"Hablamos español\"). I can help you in English or Spanish (ES button at the top)."); }, c: [CITA_CHIP] },
    { id: "vehiculos", k: ["arreglan trocas", "reparan trocas", "arreglan camionetas", "reparan camionetas", "trabajan trocas", "fix trucks", "work on trucks", "troca", "trocas", "camioneta", "camionetas", "pickup", "van", "vans", "suv", "diesel", "flotilla", "flota", "camion", "truck", "trucks", "fleet", "what cars", "que carros", "que autos", "marcas"],
      a: function () { return L("Su web no detalla marcas ni tipos de vehículo; dice que ningún trabajo es demasiado grande o pequeño y que tratan cada vehículo como si fuera suyo. Déjame el año, marca y modelo y el taller te confirma.",
        "Their site doesn't list makes or vehicle types; it says no job is too big or too small and they treat every vehicle like their own. Leave me the year, make and model and the shop will confirm."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "historia", k: ["dueno", "duenos", "quien", "quienes son", "henry", "brandon", "sanchez", "familiar", "familia", "desde cuando", "experiencia", "historia", "confianza", "owner", "owners", "who", "family", "experience", "trust"],
      a: function () { return L("SA & RO Auto Repair es un taller familiar en Dallas, fundado por Henry y Brandon Sánchez, que asumen responsabilidad personal por cada reparación. Su web habla de más de 10 años de experiencia y más de 5,000 autos reparados, con diagnósticos honestos, trabajo de calidad y precios justos.",
        "SA & RO Auto Repair is a family-owned shop in Dallas, founded by Henry and Brandon Sanchez, who take personal responsibility for every repair. Their site mentions 10+ years of experience and 5K+ cars repaired, with honest diagnostics, quality work and fair prices."); }, c: [CITA_CHIP, TELHE, TELBR] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "lunes", "hoy abren", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "garland", "address", "where", "directions", "located", "location"],
      a: function () { return dirA() + L("\nSi quieres, te dejo pedida la cotización o la cita desde aquí y el taller te confirma.", "\nI can request the quote or appointment from here and the shop confirms."); }, c: [MAPA, CITA_CHIP] },
    { id: "whatsapp", k: ["whatsapp", "wasap", "watsap", "whats", "wpp"],
      a: function () { return L("En su web, el ícono de WhatsApp lleva al número de " + BRA() + " (" + C.br.tel + "). Desde aquí no te paso a WhatsApp: puedes llamar a Henry (" + C.he.tel + ") o a Brandon (" + C.br.tel + "), o dejarme tu teléfono y te contactan ellos, por llamada o mensaje de texto.",
        "On their site, the WhatsApp icon goes to " + BRA() + "'s number (" + C.br.tel + "). I don't hand you off to WhatsApp from here: you can call Henry (" + C.he.tel + ") or Brandon (" + C.br.tel + "), or leave your number and they'll reach out by call or text."); }, c: [TELHE, TELBR, LLAMADA_CHIP] },
    { id: "contacto", k: ["telefono", "numero", "llamar", "contacto", "correo", "email", "mail", "texto", "mensaje de texto", "sms", "facebook", "instagram", "phone", "number", "call", "text", "contact"],
      a: function () { return L("Teléfonos que publica el taller:\n📞 " + HEN() + ": " + C.he.tel + "\n📞 " + BRA() + ": " + C.br.tel + "\nNo publican email. O deja aquí tu teléfono y te contactan ellos, por llamada o mensaje de texto.",
        "Phone numbers the shop lists:\n📞 " + HEN() + ": " + C.he.tel + "\n📞 " + BRA() + ": " + C.br.tel + "\nThey don't list an email. Or leave your number here and they'll reach out by call or text."); }, c: [TELHE, TELBR, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: function () { return L("¡Con gusto! Si necesitas algo más, aquí estoy. 🔧", "You're welcome! I'm here if you need anything else. 🔧"); }, c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "agendar", "reservar", "turno", "visita", "llevar el carro", "llevar mi carro", "llevar el auto", "llevar mi auto", "llevar la troca", "appointment", "estimate", "quote", "book", "schedule", "visit", "bring my car", "bring my truck"];
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
  function isWalkinQ(n) { return /\b(walk ?in|walk ?ins|sin cita|necesito (una )?cita|hace falta (una )?cita|tengo que (hacer|sacar) cita|need an appointment|appointment needed|no appointment)\b/.test(n); }
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { return phraseScore(ph, ut) > 0; }); }
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "truck", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i", "not"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|auto)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|precio|horario|donde|necesito|quiero|mi carro|mi auto|gracias|cual|frenos|transmision|aceite)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/214-324-3588/g, '<a href="tel:+12143243588">214-324-3588</a>').replace(/469-879-1349/g, '<a href="tel:+14698791349">469-879-1349</a>'); }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t, cls) { var m = el("div", "r24-msg r24-user" + (cls ? " " + cls : "")); m.textContent = t; body.appendChild(m); scroll(); }
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
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = L("🟢 Abiertos ahora · hasta las " + hm(closeAt(n)), "🟢 Open now · until " + hm(closeAt(n))); }
    else if (n.dow === 0) { status.className = "r24-status r24-closed"; status.textContent = L("📅 Domingo: solo con cita previa · te tomo el pedido y el taller te confirma", "📅 Sunday: by appointment only · I'll take your request and the shop confirms"); }
    else { status.className = "r24-status r24-closed"; status.textContent = L("🌙 Fuera de horario (abren " + nextOpening(n) + ") · te atiendo igual y el taller recibe tu pedido", "🌙 After hours (they open " + nextOpening(n) + ") · I'll still take your request"); }
  }
  function menuChips() { return [CITA_CHIP, SVC, HOR, PAGO, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Dallas, TX";
    panel.querySelector(".r24-in").placeholder = L("Escribe tu pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · tus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk"));
    banner.textContent = L("Demo privada preparada para SA & RO Auto Repair", "Private demo prepared for SA & RO Auto Repair");
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
    // su botón EN/ES (setLang de su página) también cambia el idioma de la recepción (ver el puente en la página)
  }
  function setLang(l, announce) {
    if (l === lang) return; lang = l; headTexts(); statusText();
    if (announce) addBot(L("Perfecto, seguimos en español. ¿En qué te ayudo?", "Sure, let's continue in English. How can I help?"), flow ? [] : menuChips());
    if (flow && announce) setTimeout(function () { ask(flow.step); }, 600);
  }
  // R24-HUMANO-1018: siempre a la vista; nunca deja al cliente atrapado con el asistente
  function humano() {
    flow = null; addUser(L("👤 Hablar con una persona", "👤 Talk to a person"));
    var n = nowTx(), ab = isOpen(n), dom = n.dow === 0;
    addBot(L((ab ? "Claro. Ahora están abiertos: llama y te atiende una persona — " + HEN() + " " + C.he.tel + " o " + BRA() + " " + C.br.tel + "."
        : (dom ? "Claro. Hoy domingo atienden solo con cita previa (el horario normal vuelve " + nextOpening(n) + "); " : "Claro. Ahora el taller está cerrado (abre " + nextOpening(n) + "); ") + "en horario puedes llamar a " + HEN() + " " + C.he.tel + " o a " + BRA() + " " + C.br.tel + ".") + " Si prefieres, te contactan ellos: déjame tu nombre y teléfono y el pedido les llega al instante.",
      (ab ? "Sure. They're open now: call and a person will help — " + HEN() + " " + C.he.tel + " or " + BRA() + " " + C.br.tel + "."
        : (dom ? "Sure. Today is Sunday, by appointment only (regular hours resume " + nextOpening(n) + "); " : "Sure. The shop is closed right now (it opens " + nextOpening(n) + "); ") + "during business hours you can call " + HEN() + " " + C.he.tel + " or " + BRA() + " " + C.br.tel + ".") + " Or they can reach out to you: leave your name and number and they get the request instantly."), [TELHE(), TELBR(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy la recepción virtual de SA & RO Auto Repair (Dallas). Te ayudo a pedir tu cotización gratis o una cita, te tomo los datos para que el taller te llame o te escriba, o te cuento servicios y horario, a cualquier hora: aunque nadie pueda contestar el teléfono.\n¿En qué te ayudo?",
      "Hi! 👋 I'm the virtual front desk for SA & RO Auto Repair (Dallas). I can set up your free quote or an appointment, take your details so the shop calls or texts you back, or answer questions about services and hours — any time, even when nobody can pick up the phone.\nHow can I help?"), menuChips());
  }
  function open(mode) {
    if (mode === "es" || mode === "en") { if (lang !== mode) { lang = mode; headTexts(); } mode = null; }
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; if (mode !== "form") greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "cita" && !flow) setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }
  function opts(a) { return a.map(function (t) { return { t: t, v: t, flow: true }; }); }
  // Lo que le pasa, con los 7 servicios de su web (los mismos de su formulario) + «otro»
  function SINT() { return lang === "en" ? ["Diagnostics / check engine light", "Brakes", "A/C", "Engine", "Transmission", "Suspension / alignment", "Electrical / battery / won't start", "Other / not sure"]
    : ["Diagnóstico / luz de check engine", "Frenos", "Aire acondicionado", "Motor", "Transmisión", "Suspensión / alineación", "Eléctrico / batería / no arranca", "Otra cosa / no sé"]; }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function MEDIO() { return opts([L("📞 Llamada", "📞 Phone call"), L("💬 Mensaje de texto", "💬 Text message")]); }
  function franjas() { return opts([L("Mañana (8:00 a.m. – 12:00 p.m.)", "Morning (8:00 AM – 12:00 PM)"), L("Tarde (12:00 – 7:00 p.m.)", "Afternoon (12:00 – 7:00 PM)"), L("Me da igual", "Either is fine")]); }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos te dejo el pedido listo para el taller. (Escribe «cancelar» si quieres salir.)\n¿Qué necesitas?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Cotización gratis", "Free quote"), L("Cita para llevar el auto", "Appointment to bring the car")]));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || L("Consulta general", "General question")).slice(0, 120) } };
    addBot(L("¡Claro! Te contacta una persona del taller, por llamada o por mensaje de texto. Solo necesito unos datos.\n¿Cuál es tu nombre? (Escribe «cancelar» si quieres salir.)", "Sure! Someone from the shop will reach out by phone call or text. I just need a few details.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function normTel(t) { var ph = String(t || "").replace(/[\s().+-]/g, ""); if (/^1\d{10}$/.test(ph)) ph = ph.slice(1); return /^[2-9]\d{9}$/.test(ph) ? ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6) : ""; }
  function cap(s) { return String(s || "").trim().split(/\s+/).filter(Boolean).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" "); }
  // Su formulario «Cotización gratis» (en su web solo muestra «¡Solicitud Enviada!» y no manda nada): en la demo el pedido llega a la recepción,
  // que confirma al instante y completa lo que falta (foto, día, franja, llamada o texto)
  function fromForm(f) {
    f = f || {};
    var nm = cap([f.fname, f.lname].join(" ")), veh = [f.year, f.car].map(function (x) { return String(x || "").trim(); }).filter(Boolean).join(" ").slice(0, 60);
    var d = { tipo: "cita", form: true, servicio: L("Cotización gratis (formulario)", "Free quote (form)"), nombre: nm, telefono: normTel(f.tel), email: String(f.email || "").trim().slice(0, 60),
      vehiculo: veh, sintoma: [f.svc, String(f.issue || "").trim()].filter(Boolean).join(" · ").slice(0, 120) };
    open("form");
    flow = { step: "foto", d: d };
    addUser(L("📝 Formulario «Cotización gratis»", "📝 \"Free Quote\" form") + "\n" + [nm, f.tel, d.email, veh, d.sintoma].filter(Boolean).join(" · "), "r24-formsum");
    addBot(L("¡Recibido" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Tu pedido de cotización ya le llegó al taller, no se queda esperando. " + aviso() + "\nPara dejarlo completo, unas preguntas rápidas.",
      "Got it" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Your quote request already reached the shop, it doesn't just sit there. " + aviso() + "\nA few quick questions to complete it."));
    setTimeout(function () { ask(d.vehiculo ? "foto" : "vehiculo"); }, 700);
  }
  function fotoRecibida(f) {
    var d = flow.d; d.foto = f.name.slice(0, 40);
    var m = el("div", "r24-msg r24-user r24-photo"); var im = new Image(); im.alt = "foto"; im.style.cssText = "max-width:160px;max-height:120px;display:block;border-radius:8px;margin-bottom:4px";
    try { im.src = URL.createObjectURL(f); } catch (e) {}
    m.appendChild(im); m.appendChild(document.createTextNode("📷 " + d.foto)); body.appendChild(m); scroll();
    var w = body.querySelectorAll(".r24-chips"); if (w.length) w[w.length - 1].remove();
    addBot(L("📷 Foto recibida (en esta demo no sale de tu teléfono).", "📷 Photo received (in this demo it never leaves your phone)."));
    setTimeout(function () { ask("dia"); }, 600);
  }
  function medioTxt(d) { return d.medio || L("Llamada", "Phone call"); }
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del vehículo? (por ejemplo: 2018 Toyota Camry)", "Year, make and model? (e.g. 2018 Toyota Camry)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesitas?", "What's going on, or what service do you need?"), opts(SINT()));
    else if (step === "foto") addBot(L("¿Tienes una foto (de la luz del tablero, de la fuga o de la pieza)? Es opcional y ayuda al taller a preparar la cotización.", "Do you have a photo (the dashboard light, the leak or the part)? It's optional and helps the shop prepare the quote."), FOTO());
    else if (step === "dia") {
      var days = nextWorkdays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día te queda mejor? Lo anoto como preferencia y el taller te lo confirma. Abren de lunes a sábado de 8:00 a.m. a 7:00 p.m.; el domingo, con cita previa.", "Which day works best? I'll note it as a preference and the shop confirms. They're open Monday–Saturday 8:00 AM – 7:00 PM; Sunday by appointment."),
        opts(days.map(function (x) { return x.label; })).concat(opts([L("Lo antes posible", "As soon as possible")])));
    }
    else if (step === "franja") addBot(d.dow === 0 ? L("El domingo atienden solo con cita previa: lo anoto y el taller te confirma si hay lugar y a qué hora. ¿Qué franja prefieres?", "Sunday is by appointment only: I'll note it and the shop confirms availability and time. Which window do you prefer?") : L("¿En qué franja?", "What time window?"), franjas());
    else if (step === "nombre") addBot(L("¿Cuál es tu nombre?", "What's your name?"));
    else if (step === "medio") addBot(L("Gracias, " + d.nombre + ". ¿Prefieres que te llamen o que te manden un mensaje de texto?", "Thanks, " + d.nombre + ". Would you rather get a call or a text?"), MEDIO());
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto. ¿A qué teléfono te " + (/texto/i.test(medioTxt(d)) ? "escriben" : "llaman") + "?", "Great. What number should they " + (/text/i.test(medioTxt(d)) ? "text" : "call") + "?") : L("Último paso: ¿a qué teléfono te contactan para confirmar?", "Last step: what number should they use to confirm?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revisa tu solicitud de contacto:\n👤 Nombre: ", "Please review your contact request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revisa tu solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Vehículo: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n🔧 Qué le pasa: ", "\n🔧 Problem: ") + (d.sintoma || L("a revisar", "to be checked")) + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + (d.email ? "\n📧 Email: " + d.email : "") + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
  function afterFranja(d) { if (!d.nombre) ask("nombre"); else ask("medio"); }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop|exit|quit)$/.test(n)) { flow = null; addBot(L("Sin problema, cancelé la solicitud. ¿Te ayudo con otra cosa?", "No problem, I've cancelled the request. Anything else?"), [CITA_CHIP, HOR, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "tipo":
        d.servicio = t.slice(0, 40);
        addBot(/cita|appointment/.test(n) ? L("Bien. Te anoto el día y la franja que prefieres, y el taller te lo confirma.", "Got it. I'll note your preferred day and time window, and the shop confirms.")
          : L("Bien. Su web no publica precios: el estimado es gratis y sin compromiso, te dan un presupuesto claro antes de empezar y tú decides.", "Got it. Their site doesn't publish prices: the estimate is free with no obligation, you get a clear quote before any work, and you decide."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60); if (d.form && d.sintoma) ask("foto"); else ask("sintoma"); return;
      case "sintoma":
        d.sintoma = t.slice(0, 100); ask("foto"); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60); d.dow = flow.days && flow.days[t] != null ? flow.days[t] : -1;
        if (/^(lo antes posible|as soon as possible)$/i.test(t)) { d.franja = L("La primera disponible", "First available"); afterFranja(d); return; }
        ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); afterFranja(d); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dices tu nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = cap(nm);
        ask("medio"); return;
      case "medio":
        d.medio = /texto|text|sms|mensaje/i.test(t) ? L("Mensaje de texto", "Text message") : L("Llamada", "Phone call");
        if (d.telefono) ask("resumen"); else ask("telefono"); return;
      case "telefono":
        var ph = normTel(t);
        if (!ph) { addBot(L("Ese número no me cuadra. Escríbelo con 10 cifras (con código de área), por ejemplo 214-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 214-555-0123.")); return; }
        d.telefono = ph;
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)"), tx = /texto|text/i.test(medioTxt(d));
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe tu pedido al instante y te " + (tx ? "escribe" : "llama") + " al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will " + (tx ? "text" : "call") + " you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Tu solicitud quedó registrada.\nEl taller te " + (tx ? "escribe" : "llama") + " al " + d.telefono + " para confirmar el día y la hora; la cotización te la dan ellos después de revisar el vehículo.", "All set, " + nm2 + "! ✅ Your request is in.\nThe shop will " + (tx ? "text" : "call") + " you at " + d.telefono + " to confirm the day and time; the quote comes from them after checking the vehicle.") + DEMO, [MAPA(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
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
    addBot(L("Eso te lo confirma mejor el taller, así tienes el dato exacto. 😊\nLlama a " + HEN() + " " + C.he.tel + " o a " + BRA() + " " + C.br.tel + ", o déjame tu teléfono y te contactan ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall " + HEN() + " " + C.he.tel + " or " + BRA() + " " + C.br.tel + ", or leave your number and they'll get back to you."), [TELHE, TELBR, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot(L("Claro, ¿qué más quieres saber?", "Sure, what else would you like to know?"), menuChips()); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué te puedo ayudar? Te pido una cotización gratis o una cita, te tomo los datos para que te llamen o te escriban y te cuento servicios, horario y dirección.", "Hi! How can I help? I can request a free quote or an appointment, take your details for a call or text back, and tell you about services, hours and location."), menuChips()); return; }
    if (/^(horario y direccion|hours and address)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [CITA_CHIP, MAPA, LLAMADA_CHIP]); return; }
    if (/\b(que me llamen|llamenme|que me escriban|escribanme|call me back|text me|callback|call back)\b/.test(n)) { startLlamada(); return; }
    if (/\b(persona|humano|alguien real|asesor|person|human|someone real|real person)\b/.test(n)) { humano(); return; }
    if (isWalkinQ(n)) { reply(byId("walkin")); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|quote|schedule|book/.test(n))) { startCita(); return; }
    if (price && !(bi && bi.e.id === "nolist")) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, fromForm: function (f) { if (panel) fromForm(f); }, setLang: function (l) { if (panel) setLang(l === "en" ? "en" : "es", opened); }, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
