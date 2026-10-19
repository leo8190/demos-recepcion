/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Marin Auto Repair and Transmissions (taller del dueño, Ernesto Marin; 13595 Floyd Cir, Suite 100, Dallas TX 75243) — DEMO privada, bilingüe ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica marinautorepair.org (EN y /es, oct. 2026): inicio, servicios, 5 páginas de servicio (transmisiones, frenos,
   cambio de aceite, motor, mantenimiento y diagnóstico), nosotros, opiniones, financiamiento, contacto y sus preguntas frecuentes.
   - Teléfono (214) 335-7710: llamada o texto (su barra del celular dice «Call · Text · Directions»). Formulario «Request a free quote» en Contacto:
     «We call or text back within one business day» (dentro del horario del taller). No publican WhatsApp ni email.
   - Horario (en todas sus páginas y en sus datos para Google): lunes a sábado 9 AM – 6 PM, domingo cerrado (hora de Texas).
     Walk-ins bienvenidos; casi siempre lo revisan el mismo día si llama en la mañana. La mayoría de los trabajos salen el mismo día o a la mañana siguiente.
   - Servicios: reparación de transmisiones (automáticas y estándar, su especialidad), motor, mantenimiento y diagnóstico por computadora, frenos,
     cambio de aceite; además suspensión, A/C, alineación y cuentas de flota. Inspección antes de comprar un usado.
   - Presupuesto gratis y por escrito antes de empezar; garantía por escrito (según la pieza y el trabajo); planes de pago Affirm, Klarna, Cash App en
     reparaciones grandes. Más de 20 años de experiencia; taller propio desde 2017 (Oak Cliff), en Floyd Circle desde 2019. 5.0 en Google. Se habla español.
   Sin precios (su web no publica ninguno), sin WhatsApp; no promete grúa, llantas, verificación estatal, carrocería ni nada que su web no liste. Español en «usted», como su web. */
(function () {
  "use strict";
  var C = {
    nombre: "Marin Auto Repair and Transmissions", corto: "Marin Auto Repair",
    tel: "(214) 335-7710", telh: "+12143357710",
    dir: "13595 Floyd Cir, Suite 100, Dallas, TX 75243", maps: "https://www.google.com/maps/search/?api=1&query=Marin%20Auto%20Repair%20and%20Transmissions%2013595%20Floyd%20Cir%20Suite%20100%20Dallas%20TX%2075243"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  var ES = /(^|\/)es-[^\/]*$/.test(location.pathname);
  // Horario publicado (minutos desde las 0:00, hora de Texas/Central). 0 = domingo.
  var LS = [[540, 1080]];
  var H = { 1: LS, 2: LS, 3: LS, 4: LS, 5: LS, 6: LS, 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller (en todas sus páginas):\n• Lunes a sábado: 9:00 a.m. – 6:00 p.m.\n• Domingo: cerrado\nPuede llegar sin cita; su web dice que si llama o pide su cotización antes, lo atienden más rápido.",
      "Shop hours (on every page of their site):\n• Monday–Saturday: 9:00 AM – 6:00 PM\n• Sunday: closed\nWalk-ins are welcome; their site says a quick call or quote request ahead of time gets you in and out faster.");
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
  function SMS() { return { t: "💬 " + L("Mandar texto al ", "Text ") + C.tel, url: "sms:" + C.telh, self: true }; }
  function MAPS() { return { t: L("Cómo llegar (Google Maps)", "Directions (Google Maps)"), url: C.maps }; }
  function PAGE(es, en, f) { return function () { return { t: L(es, en), url: (lang === "es" ? "es-" : "") + f, self: true }; }; }
  var SERVP = PAGE("Ver la página de servicios", "See the services page", "services.html");
  var TRANP = PAGE("Ver reparación de transmisiones", "See transmission repair", "transmission-repair.html");
  var FINP = PAGE("Ver financiamiento", "See financing", "financing.html");
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & address", "horario y direccion", "hours and address");
  var TRANS = Q("⚙️ Transmisión", "⚙️ Transmission", "transmision", "transmission");
  function dirA() { return L("📍 " + C.dir + ", justo dentro de la LBJ (I-635), cerca de la US-75, en el complejo automotriz de Floyd Circle junto a Midpark Road. Su web dice: busque los portones abiertos; el estacionamiento para clientes está justo enfrente.",
    "📍 " + C.dir + ", just inside LBJ (I-635) near US-75, in the automotive complex on Floyd Circle off Midpark Road. Their site says: look for the open bay doors; customer parking is right in front."); }
  function horarioA() {
    var n = nowTx(), s = isOpen(n) ? L("🟢 Ahora están abiertos, hasta las " + hm(closeAt(n)) + ".", "🟢 They're open now, until " + hm(closeAt(n)) + ".") : L("🌙 Ahora está cerrado; abre " + nextOpening(n) + ". Igual le tomo el pedido ahora y el taller lo recibe al instante.", "🌙 It's closed right now; opens " + nextOpening(n) + ". I can still take your request now and the shop gets it instantly.");
    return horarioTxt() + "\n" + s;
  }
  function serviciosA() {
    return L("Lo que publica el taller:\n• Reparación de transmisiones (automáticas y estándar): su especialidad, «el trabajo que lleva nuestro nombre»\n• Reparación de motor (luz de check engine, afinación, bobinas, bujías, sensores, bandas, bomba de agua, termostato, juntas, enfriamiento)\n• Mantenimiento y diagnóstico por computadora (servicios de 30k/60k/90k, inspección antes de comprar un usado)\n• Frenos (balatas, discos, calipers, líquido)\n• Cambio de aceite (convencional, semisintético o sintético, con filtro nuevo)\n• También: suspensión, A/C, alineación y cuentas de flota\nPresupuesto gratis y por escrito antes de empezar. ¿Qué le pasa a su carro?",
      "What the shop lists:\n• Transmission repair (automatics and manuals): their specialty, \"the job we are named for\"\n• Engine repair (check engine light, tune-ups, coils, spark plugs, sensors, belts, water pumps, thermostats, gaskets, cooling)\n• Maintenance & computer diagnostics (30k/60k/90k services, pre-purchase inspections)\n• Brakes (pads, rotors, calipers, fluid)\n• Oil change (conventional, blend or full synthetic, new filter)\n• Also: suspension, A/C, wheel alignment and fleet accounts\nFree written estimate before any work. What's going on with your car?");
  }
  function noListA() {
    return L("Eso no aparece entre los servicios de su web, así que no se lo voy a asegurar. Su web dice que si es algo que no manejan, le recomiendan a alguien de confianza. Llame o mande texto al " + C.tel + ", o déjeme su teléfono y le contactan ellos.",
      "That isn't among the services on their website, so I won't promise it. Their site says that if it's something they don't handle, they'll point you to someone trustworthy. Call or text " + C.tel + ", or leave your number and they'll get back to you.");
  }
  var KB = [
    { id: "transmision", k: ["transmision", "transmisiones", "caja", "caja de cambios", "cambios", "patina", "patinando", "jalonea", "no entra el cambio", "aceite de caja", "liquido rojo", "clutch", "embrague", "estandar", "automatica", "solenoide", "transmission", "slipping", "slips", "jerky", "hard shift", "shifting", "red fluid", "gear oil", "manual", "automatic", "rebuild"],
      a: function () { return L("Sí: es su especialidad («el trabajo que lleva nuestro nombre»). Automáticas y estándar: diagnóstico con prueba de manejo y escáner (su web dice que muchos «problemas de transmisión» son sensores o líquido), servicio de líquido y filtro, fugas, solenoides y sensores, y reparación mayor cuando de verdad hace falta; en estándar, clutch, aceite de caja y problemas de cambios. Presupuesto gratis por escrito, casi siempre el mismo día. Si patina, su web aconseja revisarla pronto. ¿Le dejo pedido el presupuesto?",
        "Yes, it's their specialty (\"the job we are named for\"). Automatics and manuals: diagnosis with a road test and computer scan (their site says many \"transmission problems\" are sensors or fluid), fluid and filter service, leak repairs, solenoids and sensors, and major repair work when it's truly needed; on manuals, clutches, gear oil and shift problems. Free written estimate, usually the same day. If it's slipping, their site advises getting it looked at early. Want me to set up the estimate?"); }, c: [CITA_CHIP, TRANP, LLAMADA_CHIP] },
    { id: "frenos", k: ["freno", "frenos", "balatas", "pastillas", "discos", "calipers", "rechina", "rechinan", "chillan", "pedal", "liquido de frenos", "brake", "brakes", "pads", "rotors", "squeak", "squeal", "grinding", "caliper"],
      a: function () { return L("Sí: frenos (balatas, discos, calipers, mangueras y cambio de líquido cuando de verdad hace falta). Su web dice que la revisión de frenos es gratis con cualquier visita, que miden el desgaste y se lo muestran, que casi siempre los cambian el mismo día y que hacen prueba de manejo antes de entregarle las llaves. Si rechinan en metal, no lo maneje: llame al " + C.tel + ".",
        "Yes: brakes (pads, rotors, calipers, hoses and fluid flushes when genuinely needed). Their site says the brake inspection is free with any visit, they measure wear and show you, most jobs are done the same day, and they test-drive after every brake job. If it's grinding metal on metal, don't drive it: call " + C.tel + "."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "aceite", k: ["aceite", "cambio de aceite", "sintetico", "semisintetico", "filtro", "luz de aceite", "oil", "oil change", "synthetic", "blend", "filter", "oil light"],
      a: function () { return L("Sí: cambio de aceite con el aceite correcto para su motor (convencional, semisintético o sintético), filtro nuevo siempre y una revisión rápida de bandas, mangueras, líquidos y llantas mientras escurre. No necesita cita: pase en horario (lunes a sábado 9:00 a.m. – 6:00 p.m.); si llama antes, lo sacan más rápido.",
        "Yes: oil changes with the right oil for your engine (conventional, blend or full synthetic), a new filter every time and a quick check of belts, hoses, fluids and tires while it drains. No appointment needed: swing by during shop hours (Mon–Sat 9:00 AM – 6:00 PM); call ahead and they'll get you out even faster."); }, c: [CITA_CHIP, HOR] },
    { id: "motor", k: ["motor", "check engine", "luz del motor", "luz de motor", "luz de check engine", "testigo", "falla", "fallas", "tiembla", "pierde fuerza", "humo", "cascabelea", "golpeteo", "afinacion", "bujias", "bobinas", "junta", "turbo", "engine", "check engine light", "misfire", "rough idle", "knocking", "smoke", "tune up", "spark plugs", "coil", "gasket", "losing power"],
      a: function () { return L("Sí: reparación de motor. Su web dice que una luz de check engine no siempre significa una cuenta grande (a veces es un sensor, una bobina o una fuga de vacío): la escanean, buscan la causa real y le dan presupuesto gratis por escrito antes de tocar nada. Hacen afinación, bobinas, bujías, sensores, bandas, bomba de agua, termostato, juntas y también trabajos de desempeño (un cliente cambió el turbo). Si la luz parpadea, deje de manejar y llame al " + C.tel + ".",
        "Yes: engine repair. Their site says a check engine light doesn't automatically mean a big bill (often it's a sensor, a coil or a vacuum leak): they scan it, find the real cause and give you a free written estimate before touching anything. Tune-ups, ignition coils, spark plugs, sensors, belts, water pumps, thermostats, gaskets, and performance work too (one customer had a turbo swap). If the light is flashing, stop driving and call " + C.tel + "."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "calienta", k: ["se calienta", "sobrecalienta", "calentando", "radiador", "anticongelante", "termostato", "bomba de agua", "manguera", "pierde agua", "overheat", "overheating", "radiator", "coolant", "thermostat", "water pump", "hose"],
      a: function () { return L("Sí: su web dice que, atendido a tiempo, un motor que se calienta muchas veces es termostato, manguera o bomba de agua, y que hacen reparación del sistema de enfriamiento. Si ve subir la aguja, tráigalo rápido; si no se puede manejar, llame al " + C.tel + " y le ayudan a ver la forma más fácil de llevarlo.",
        "Yes: their site says that, caught early, overheating is often a thermostat, hose or water pump, and they do cooling-system repair. If you see the gauge climb, get it in fast; if it isn't drivable, call " + C.tel + " and they'll help you figure out the easiest way to get it there."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "diagnostico", k: ["diagnostico", "escaneo", "escaner", "codigo", "codigos", "mantenimiento", "servicio de millas", "30 mil", "60 mil", "90 mil", "luz del tablero", "testigos", "diagnostic", "diagnostics", "scan", "code", "maintenance", "30k", "60k", "90k", "warning light", "dashboard light", "road trip"],
      a: function () { return L("Sí: mantenimiento programado (líquidos, filtros, bujías, bandas, mangueras, afinación, servicios de 30k/60k/90k) y diagnóstico completo por computadora con un mecánico que interpreta los datos, no solo el código. Le dan una lista honesta de lo que urge, lo que puede esperar y lo que está bien. Y su web aclara que no tiene que ir a la agencia para no perder la garantía de fábrica: guarde sus recibos.",
        "Yes: scheduled maintenance (fluids, filters, spark plugs, belts, hoses, tune-ups, 30k/60k/90k services) and full computer diagnostics with a mechanic reading the data, not just the code. You get an honest list of what needs doing now, what can wait and what's fine. Their site also notes dealer maintenance isn't required to keep your factory warranty: keep your receipts."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "usado", k: ["comprar un usado", "carro usado", "auto usado", "revisar antes de comprar", "inspeccion antes de comprar", "pre compra", "used car", "pre purchase", "pre-purchase", "buying a car"],
      a: function () { return L("Sí: inspección antes de comprar un usado, para saber qué es en realidad ese carro antes de pagarlo. Su web dice que encontrar una transmisión goteando o un choque escondido antes de comprar puede ahorrarle mucho o darle poder para negociar.",
        "Yes: pre-purchase inspections, so you know what a used car really is before you pay for it. Their site says finding a leaking transmission or hidden crash damage before you buy can save you a lot or give you negotiating power."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "otros", k: ["suspension", "amortiguadores", "alineacion", "alinear", "a c", "ac", "aire acondicionado", "aire", "no enfria", "flota", "flotilla", "camionetas de trabajo", "baleros", "balero", "suspension", "shocks", "struts", "alignment", "wheel alignment", "air conditioning", "not cold", "fleet", "work truck", "wheel bearing"],
      a: function () { return L("Sí: además de sus 5 servicios principales, su web dice que también hacen suspensión, A/C, alineación y cuentas de flota, y muchos otros trabajos que no tienen página propia. Lo mejor es contarles qué le pasa: si es algo que no manejan, le recomiendan a alguien de confianza. ¿Le dejo pedido el presupuesto?",
        "Yes: besides their 5 main services, their site says they also handle suspension, A/C, wheel alignment and fleet accounts, plus plenty of other jobs that don't get their own page. Best to describe what's going on: if it's something they don't handle, they'll point you to someone trustworthy. Want me to set up the estimate?"); }, c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "nolist", k: ["grua", "remolque", "remolcar", "llanta", "llantas", "ponchada", "neumatico", "verificacion", "inspeccion estatal", "sticker", "emisiones", "carroceria", "hojalateria", "pintura", "choque", "moto", "motos", "motocicleta", "diesel", "trailer", "traila", "electrico", "tesla", "a domicilio", "mecanico movil", "vidrios", "parabrisas", "tow", "towing", "tire", "tires", "flat", "state inspection", "inspection sticker", "emissions test", "body shop", "paint", "collision", "motorcycle", "semi", "electric car", "ev", "mobile mechanic", "windshield", "boat", "rv"], a: noListA, c: [TEL, SMS, LLAMADA_CHIP] },
    { id: "nomaneja", k: ["no arranca", "no prende", "no camina", "no se puede manejar", "varado", "quedado", "won t start", "wont start", "not drivable", "stranded", "broke down"],
      a: function () { return L("Su web dice: si el carro no se puede manejar, llámeles al " + C.tel + " y le ayudan a ver la forma más fácil de llevarlo al taller (no publican servicio de grúa propio). También puede dejarme su teléfono y le contactan ellos.",
        "Their site says: if the car isn't drivable, call " + C.tel + " and they'll help you figure out the easiest way to get it to the shop (they don't list their own towing). You can also leave your number and they'll reach out."); }, c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "services", "what do you fix", "what do you do", "repairs"], a: serviciosA, c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "price", "prices", "how much", "cost", "cheap", "rates", "discount"],
      a: function () { return L("Los precios se los da el taller, y su web no publica ninguno. Lo que sí dice: el presupuesto es gratis y por escrito, usted aprueba el precio antes de que empiecen, y si encuentran algo más le llaman primero. Lo que puedo hacer: dejarle pedido el presupuesto con su vehículo y lo que le pasa, y le contactan.",
        "Pricing comes from the shop, and their site doesn't publish any. What it does say: the estimate is free and in writing, you approve the price before any work begins, and if they find something else they call you first. What I can do: request the estimate with your vehicle and what's going on, and they'll get back to you."); }, c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "presupuesto", k: ["presupuesto gratis", "cotizacion gratis", "es gratis", "sin costo", "por escrito", "free estimate", "free quote", "written estimate", "is it free"],
      a: function () { return L("Sí: su web dice «presupuestos gratis, siempre»: el precio por escrito antes de empezar, y si encuentran algo más le llaman primero (sin sorpresas al recogerlo). Le dejo pedido el suyo en un minuto.",
        "Yes: their site says \"free estimates, always\": the price in writing before any work starts, and if they find something else they call you first (no surprises at pickup). I can request yours in a minute."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "financiamiento", k: ["financiamiento", "financiar", "a plazos", "pagos", "plan de pagos", "credito", "affirm", "klarna", "cash app", "financing", "payment plan", "payments", "credit"],
      a: function () { return L("Sí: en reparaciones grandes (transmisión, motor) ofrecen planes de pago con Affirm, Klarna o Cash App; se pregunta al aprobar el presupuesto. Su web dice que preguntar por opciones de pago no cambia el precio (solo cuándo paga) y que lo que acuerden queda por escrito con el presupuesto. Para lo de rutina, como aceite y frenos, cobran normal.",
        "Yes: on larger repairs (transmission, engine) they offer payment plans through Affirm, Klarna or Cash App; ask when you approve the estimate. Their site says asking about payment options never changes your price (only when you pay), and whatever you agree is put in writing with the estimate. Routine work like oil changes and brakes is paid the regular way."); }, c: [CITA_CHIP, FINP, LLAMADA_CHIP] },
    { id: "garantia", k: ["garantia", "garantizan", "warranty", "guarantee"],
      a: function () { return L("Su web dice que cada reparación tiene garantía por escrito; los términos dependen de la pieza y del trabajo, y vienen en su presupuesto. (Y el mantenimiento con ellos no le quita la garantía de fábrica: guarde sus recibos.)",
        "Their site says every repair is backed by a written warranty; terms depend on the part and the job, spelled out on your estimate. (And maintenance with them doesn't void your factory warranty: keep your receipts.)"); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "tiempo", k: ["cuanto tarda", "cuanto tiempo", "cuantas horas", "cuantos dias", "rapido", "mismo dia", "hoy mismo", "para hoy", "how long", "how fast", "turnaround", "same day", "today"],
      a: function () { return L("Su web dice que casi siempre lo revisan el mismo día si llama en la mañana (le dicen con honestidad si alcanzan), y que la mayoría de los trabajos quedan el mismo día o a la mañana siguiente; los frenos, casi siempre en unas horas.",
        "Their site says they can usually look at it the same day if you call in the morning (they'll tell you honestly), and most jobs are done same-day or next morning; brake jobs usually in hours."); }, c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llegar", "llegar sin avisar", "necesito cita", "without appointment", "drop by", "stop by", "need an appointment"],
      a: function () { return L("Sí: su web dice que puede llegar sin cita, pero que si llama o pide su cotización antes, lo atienden más rápido, sobre todo en trabajos grandes. Abren de lunes a sábado de 9:00 a.m. a 6:00 p.m. Si quiere, le dejo el pedido listo aquí.",
        "Yes: their site says walk-ins are welcome, but a quick call or quote request ahead of time gets you in and out faster, especially for bigger jobs. They're open Monday–Saturday 9:00 AM – 6:00 PM. I can set up your request here if you like."); }, c: [CITA_CHIP, MAPS] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue"],
      a: function () { return L("Sí: «Se habla español». Su web dice que puede preguntar en inglés o en español y recibe las mismas respuestas directas. Aquí le atiendo en los dos (botón EN arriba).", "Yes: \"Se habla español\". Their site says you can ask in English or Spanish and get the same straight answers. I can help you in either one (ES button at the top)."); }, c: [CITA_CHIP] },
    { id: "historia", k: ["dueno", "ernesto", "marin", "quien", "desde cuando", "cuantos anos", "experiencia", "historia", "resenas", "opiniones", "calificacion", "owner", "who", "experience", "how long in business", "reviews", "rating", "rated"],
      a: function () { return L("Es el taller de Ernesto Marin, con más de 20 años en el oficio: abrió su propio taller en 2017 (primero en Oak Cliff) y desde 2019 está en Floyd Circle. Su web dice que usted habla con la persona que de verdad arregla su carro, sin asesores a comisión. Calificación 5.0 en Google.",
        "It's Ernesto Marin's shop, with over 20 years in the trade: he opened his own shop in 2017 (first in Oak Cliff) and has been on Floyd Circle since 2019. Their site says you talk to the person actually fixing your car, no commissioned service advisors. Rated 5.0 on Google."); }, c: [CITA_CHIP] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "lunes", "hoy abren", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, MAPS] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "floyd", "address", "location", "where", "directions", "located"],
      a: function () { return dirA() + L("\nSi quiere, le dejo pedido el presupuesto o la cita desde aquí y el taller le confirma.", "\nI can request the estimate or appointment from here and the shop confirms."); }, c: [MAPS, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "facebook", "phone", "number", "call", "text", "contact"],
      a: function () { return L("Canales que publica el taller:\n📞 Teléfono, por llamada o mensaje de texto: " + C.tel + " (su web dice que contesta una persona, no una grabadora)\n📝 El formulario de Contacto (le llaman o escriben en menos de un día hábil, en horario)\nNo publican WhatsApp ni email. O deje aquí su teléfono y le contactan ellos.",
        "Channels the shop publishes:\n📞 Phone, call or text: " + C.tel + " (their site says you get a person, not a phone tree)\n📝 The Contact form (they call or text back within one business day, during shop hours)\nThey don't list WhatsApp or email. Or leave your number here and they'll reach out."); }, c: [TEL, SMS, LLAMADA_CHIP] },
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
  function linkify(s) { return esc(s).replace(/\(214\) 335-7710/g, '<a href="tel:+12143357710">(214) 335-7710</a>'); }
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
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Dallas, TX";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk"));
    banner.textContent = L("Demo privada preparada para Marin Auto Repair and Transmissions", "Private demo prepared for Marin Auto Repair and Transmissions");
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
    addBot(L((ab ? "Claro. Ahora están abiertos: llame o mande texto al " + C.tel + " y le atiende una persona del taller (o pase directo: aceptan walk-ins)." : "Claro. Ahora el taller está cerrado (abre " + nextOpening(n) + "); puede llamar o mandar texto al " + C.tel + " en horario.") + " Si prefiere, le contactan ellos: déjeme su nombre y teléfono y el pedido les llega al instante.",
      (ab ? "Sure. They're open now: call or text " + C.tel + " and a person from the shop will help you (or just stop by: walk-ins welcome)." : "Sure. The shop is closed right now (opens " + nextOpening(n) + "); you can call or text " + C.tel + " during business hours.") + " Or they can reach out to you: leave your name and number and they get the request instantly."), [TEL(), SMS(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy la recepción virtual de Marin Auto Repair and Transmissions (Floyd Circle, Dallas). Le ayudo a pedir su presupuesto gratis o una cita, le tomo los datos para que el taller lo llame o le escriba, o le cuento servicios y horario, a cualquier hora: sin esperar un día hábil.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the virtual front desk for Marin Auto Repair and Transmissions (Floyd Circle, Dallas). I can set up your free estimate or an appointment, take your details so the shop calls or texts you back, or answer questions about services and hours — any time, no waiting a business day.\nHow can I help?"), menuChips());
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
  // Lo que le pasa, con los servicios que publica su web
  function SINT() { return lang === "en" ? ["Transmission (slipping / shifting)", "Check engine light / engine", "Brakes (noise / pedal)", "Oil change / maintenance", "Overheating", "Diagnostics / warning light", "Suspension / A/C / alignment", "Other / not sure"]
    : ["Transmisión (patina / cambios)", "Luz de check engine / motor", "Frenos (ruido / pedal)", "Cambio de aceite / mantenimiento", "Se calienta", "Diagnóstico / luz del tablero", "Suspensión / A/C / alineación", "Otra cosa / no sé"]; }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function MEDIO() { return opts([L("📞 Llamada", "📞 Phone call"), L("💬 Mensaje de texto", "💬 Text message")]); }
  function franjas(dow) {
    return opts([L("Mañana (9:00 a.m. – 12:00 p.m.)", "Morning (9:00 AM – 12:00 PM)"), L("Tarde (12:00 – 6:00 p.m.)", "Afternoon (12:00 – 6:00 PM)"), L("Me da igual", "Either is fine")]);
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
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del vehículo? (por ejemplo: 2016 Honda Civic)", "Year, make and model? (e.g. 2016 Honda Civic)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesita?", "What's going on, or what service do you need?"), opts(SINT()));
    else if (step === "foto") addBot(L("¿Tiene una foto (de la luz del tablero, de la fuga o de la pieza)? Es opcional y ayuda al taller a preparar el presupuesto.", "Do you have a photo (the dashboard light, the leak or the part)? It's optional and helps the shop prepare the estimate."), FOTO());
    else if (step === "dia") {
      var days = nextWorkdays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia y el taller se lo confirma (también aceptan sin cita). Abren de lunes a sábado de 9:00 a.m. a 6:00 p.m.; el domingo está cerrado.", "Which day works best? I'll note it as a preference and the shop confirms (walk-ins welcome too). They're open Monday–Saturday 9:00 AM – 6:00 PM; closed Sunday."),
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
        d.vehiculo = t.slice(0, 60); ask("sintoma"); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask("foto"); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60); d.dow = flow.days && flow.days[t] != null ? flow.days[t] : -1;
        if (/^(lo antes posible|as soon as possible)$/i.test(t)) { d.franja = L("La primera disponible", "First available"); ask("nombre"); return; }
        ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask("nombre"); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dice su nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        ask("medio"); return;
      case "medio":
        d.medio = /texto|text|sms|mensaje/i.test(t) ? L("Mensaje de texto", "Text message") : L("Llamada", "Phone call");
        ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (con código de área), por ejemplo 214-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 214-555-0123.")); return; }
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
    addBot(L("Eso se lo confirma mejor el taller, así tiene el dato exacto. 😊\nLlame o mande texto al " + C.tel + ", o déjeme su teléfono y le contactan ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall or text " + C.tel + ", or leave your number and they'll get back to you."), [TEL, LLAMADA_CHIP, CITA_CHIP]);
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
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|quote|schedule|book/.test(n))) { startCita(); return; }
    if (price && !(bi && bi.e.id === "nolist")) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, setLang: function (l) { if (panel) setLang(l === "en" ? "en" : "es", opened); }, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
