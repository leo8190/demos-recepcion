/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Bronco Auto Repair (2 talleres independientes en Dallas TX: West Dallas, 2720 Coombsville Ave 75212, (214) 272-9778;
   Oak Cliff, 1022 S Hampton Rd 75208, (214) 941-0023) — DEMO privada, bilingüe ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica broncoautorepair.com (EN en / y ES en /es/, oct. 2026; una sola página: servicios, «lo que no hacemos»,
   los 2 talleres, cómo funciona una visita, pie) y de sus datos para Google (JSON-LD).
   - Solo teléfono: (214) 272-9778 West Dallas y (214) 941-0023 Oak Cliff (su barra del celular: «Llamar West Dallas · Llamar Oak Cliff»).
     Su web no tiene formularios ni publica email, WhatsApp ni mensajes de texto.
   - Horario (igual en los 2 talleres, en la página, el pie y sus datos para Google): lunes a sábado 8:00 AM – 6:00 PM, domingo cerrado (hora de Dallas).
     Se aceptan sin cita; puedes dejar el carro durante el horario de atención; llamar antes te atiende más rápido; «llama antes si necesitas el
     trabajo el mismo día».
   - Servicios (los 2 talleres, autos, camionetas, vans y SUVs; flotillas pequeñas): diagnóstico de check engine, frenos, A/C y calefacción,
     suspensión y dirección, aceite/líquidos/filtros, baterías y eléctrico, enfriamiento, reparación de motor, escape y preparación para emisiones
     (condado de Dallas), inspecciones antes de comprar. NO reparan transmisiones: la revisan con escáner, te dicen lo que ven y te recomiendan un
     especialista de confianza.
   - Presupuestos gratis: precio de piezas y mano de obra antes de tocar el carro; nada sin tu autorización; si encuentran algo más te llaman
     primero; si no vale la pena repararlo, te lo dicen. Hablan español e inglés.
   Sin precios (su web no publica ninguno), sin WhatsApp; no promete transmisiones, grúa, llantas, alineación, carrocería, financiamiento, garantía ni
   nada que su web no diga. Español en «tú», como su web. */
(function () {
  "use strict";
  var C = {
    nombre: "Bronco Auto Repair", corto: "Bronco Auto Repair",
    wd: { k: "wd", n: "West Dallas", tel: "(214) 272-9778", telh: "+12142729778", dir: "2720 Coombsville Ave, Dallas, TX 75212", maps: "https://www.google.com/maps/dir/?api=1&destination=2720+Coombsville+Ave+Dallas+TX+75212" },
    oc: { k: "oc", n: "Oak Cliff", tel: "(214) 941-0023", telh: "+12149410023", dir: "1022 S Hampton Rd, Dallas, TX 75208", maps: "https://www.google.com/maps/dir/?api=1&destination=1022+S+Hampton+Rd+Dallas+TX+75208" }
  };
  var TELS = "West Dallas " + C.wd.tel + " · Oak Cliff " + C.oc.tel;
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  // Horario publicado (minutos desde las 0:00, hora de Dallas/Central), igual en los 2 talleres. 0 = domingo.
  var LS = [[480, 1080]];
  var H = { 1: LS, 2: LS, 3: LS, 4: LS, 5: LS, 6: LS, 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller (el mismo en los 2 talleres, West Dallas y Oak Cliff):\n• Lunes a sábado: 8:00 a.m. – 6:00 p.m.\n• Domingo: cerrado\nSe aceptan sin cita y puedes dejar el carro durante el horario de atención; su web dice que llamar antes te atiende más rápido.",
      "Shop hours (the same at both shops, West Dallas and Oak Cliff):\n• Monday–Saturday: 8:00 AM – 6:00 PM\n• Sunday: closed\nWalk-ins welcome and drop-off is available during open hours; their site says calling ahead gets you in faster.");
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
  function aviso(d) { var s = d && d.sede ? sedeName(d.sede) : ""; return L("🔔 El taller recibe este pedido al instante" + (s ? " (" + s + ")" : "") + " (en esta demo no se envía nada).", "🔔 The shop gets this request instantly" + (s ? " (" + s + ")" : "") + " (nothing is sent in this demo)."); }
  var lastQ = "";
  function TELWD() { return { t: L("Llamar a West Dallas ", "Call West Dallas ") + C.wd.tel, tel: C.wd.telh }; }
  function TELOC() { return { t: L("Llamar a Oak Cliff ", "Call Oak Cliff ") + C.oc.tel, tel: C.oc.telh }; }
  function MAPWD() { return { t: L("Cómo llegar a West Dallas", "Directions to West Dallas"), url: C.wd.maps }; }
  function MAPOC() { return { t: L("Cómo llegar a Oak Cliff", "Directions to Oak Cliff"), url: C.oc.maps }; }
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y talleres", "🕐 Hours & shops", "horario y talleres", "hours and shops");
  var TRANS = Q("⚙️ ¿Transmisión?", "⚙️ Transmission?", "transmision", "transmission");
  function dirA() { return L("Son 2 talleres independientes, con el mismo estándar de trabajo y los mismos servicios:\n📍 West Dallas: " + C.wd.dir + " · 📞 " + C.wd.tel + "\n📍 Oak Cliff: " + C.oc.dir + " · 📞 " + C.oc.tel + "\nElige el más cercano. Su web dice: llama antes si necesitas el trabajo el mismo día.",
    "There are 2 independent shops, same work standard and same services:\n📍 West Dallas: " + C.wd.dir + " · 📞 " + C.wd.tel + "\n📍 Oak Cliff: " + C.oc.dir + " · 📞 " + C.oc.tel + "\nPick the one closer to you. Their site says: call ahead if you need same-day work."); }
  function horarioA() {
    var n = nowTx(), s = isOpen(n) ? L("🟢 Ahora están abiertos los 2 talleres, hasta las " + hm(closeAt(n)) + ".", "🟢 Both shops are open now, until " + hm(closeAt(n)) + ".") : L("🌙 Ahora están cerrados; abren " + nextOpening(n) + ". Igual te tomo el pedido ahora y el taller lo recibe al instante.", "🌙 They're closed right now; they open " + nextOpening(n) + ". I can still take your request now and the shop gets it instantly.");
    return horarioTxt() + "\n" + s;
  }
  function serviciosA() {
    return L("Lo que publica el taller (los 2 talleres, en autos, camionetas, vans y SUVs):\n• Diagnóstico de check engine (códigos, datos en vivo y la causa real)\n• Frenos (balatas, discos, calipers, mangueras, líneas, líquido)\n• Aire acondicionado y calefacción\n• Suspensión y dirección (amortiguadores, struts, rótulas, flechas CV, baleros)\n• Aceite, líquidos y filtros\n• Baterías y sistema eléctrico (marchas, alternadores, sensores, cableado)\n• Sistema de enfriamiento\n• Reparación de motor (bandas y cadenas de tiempo, empaques de cabeza, fugas)\n• Escape y preparación para emisiones\n• Inspecciones antes de comprar; flotillas pequeñas bienvenidas\n⚠️ No reparan transmisiones.\nPresupuestos gratis. ¿Qué le pasa a tu carro?",
      "What the shop lists (both shops, on cars, trucks, vans and SUVs):\n• Check-engine diagnostics (code pull, live data and the real cause)\n• Brakes (pads, rotors, calipers, hoses, lines, fluid)\n• A/C and heat\n• Suspension and steering (shocks, struts, ball joints, CV axles, wheel bearings)\n• Oil, fluids and filters\n• Batteries and electrical (starters, alternators, sensors, wiring)\n• Cooling system\n• Engine repair (timing belts and chains, head gaskets, oil leaks)\n• Exhaust and emissions prep\n• Pre-purchase inspections; small fleets welcome\n⚠️ No transmission work.\nFree estimates. What's going on with your car?");
  }
  function noListA() {
    return L("Eso no aparece entre los servicios de su web, así que no te lo voy a asegurar. Llama al taller (" + TELS + ") o déjame tu teléfono y te contactan ellos.",
      "That isn't among the services on their website, so I won't promise it. Call the shop (" + TELS + ") or leave your number and they'll get back to you.");
  }
  function noPubA() {
    return L("Eso su web no lo dice, así que no te lo voy a inventar: te lo confirma el taller. Llama (" + TELS + ") o déjame tu teléfono y te contactan ellos.",
      "Their site doesn't say, so I won't make it up: the shop will confirm. Call (" + TELS + ") or leave your number and they'll get back to you.");
  }
  var KB = [
    { id: "transmision", k: ["transmision", "transmisiones", "caja", "caja de cambios", "cambios", "patina", "patinando", "jalonea", "no entra el cambio", "reconstruir", "clutch", "embrague", "transmission", "slipping", "slips", "hard shift", "shifting", "rebuild", "gearbox"],
      a: function () { return L("No: ninguno de los 2 talleres repara transmisiones (ni reconstrucción, ni reemplazo, ni reparación interna); su web dice que prefieren rechazar el trabajo antes que hacerlo a medias. Lo que sí hacen: si los síntomas apuntan a la transmisión, igual la conectan al escáner, te dicen con claridad lo que ven y te recomiendan a un especialista en transmisiones de confianza. ¿Te dejo pedida esa revisión?",
        "No: neither shop does transmission work (no rebuilds, replacements or internal repair); their site says they'd rather turn the job down than do it halfway. What they do: if your symptoms point at the transmission, they'll still put it on the scanner, tell you straight what they see, and send you to a transmission specialist they trust. Want me to request that check?"); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "frenos", k: ["freno", "frenos", "balatas", "pastillas", "discos", "calipers", "rechina", "rechinan", "chillan", "pedal", "liquido de frenos", "brake", "brakes", "pads", "rotors", "squeak", "squeal", "grinding", "caliper"],
      a: function () { return L("Sí, en los 2 talleres: balatas, discos, calipers, mangueras, líneas y servicio de líquido de frenos. Encuentran la causa y te dan el precio de piezas y mano de obra antes de tocar el carro (presupuesto gratis), y no hacen nada sin tu autorización.",
        "Yes, at both shops: pads, rotors, calipers, hoses, lines and brake fluid service. They find the cause and give you the price for parts and labor before any wrench turns (free estimate), and nothing gets done without your OK."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "aceite", k: ["aceite", "cambio de aceite", "sintetico", "filtro", "filtros", "liquidos", "afinacion", "mantenimiento", "oil", "oil change", "synthetic", "filter", "fluids", "tune up", "maintenance"],
      a: function () { return L("Sí: cambio de aceite convencional y sintético, filtros y líquidos (anticongelante, líquido de frenos y de dirección hidráulica), bandas, mangueras y afinaciones. Puedes llegar sin cita en horario (lunes a sábado, 8:00 a.m. – 6:00 p.m.); si llamas antes, te atienden más rápido.",
        "Yes: conventional and synthetic oil changes, filters and fluids (coolant, brake and power steering fluid), belts, hoses and tune-ups. Walk-ins welcome during shop hours (Mon–Sat 8:00 AM – 6:00 PM); calling ahead gets you in faster."); }, c: [CITA_CHIP, HOR] },
    { id: "motor", k: ["motor", "check engine", "luz del motor", "luz de motor", "luz de check engine", "testigo", "codigo", "codigos", "escaner", "diagnostico", "falla", "fallas", "tiembla", "pierde fuerza", "humo", "cascabelea", "banda de tiempo", "cadena de tiempo", "empaque", "fuga de aceite", "engine", "check engine light", "diagnostic", "code", "misfire", "rough idle", "knocking", "smoke", "timing belt", "timing chain", "head gasket", "oil leak"],
      a: function () { return L("Sí: diagnóstico de check engine con lectura de códigos, datos en vivo y la causa real («no una adivinanza ni una factura de piezas»), y reparación de motor: bandas y cadenas de tiempo, empaques de cabeza, fugas de aceite, fallos de encendido, bandas y poleas. Te dan el precio antes de tocar el carro y, si no vale la pena repararlo, te lo dicen con honestidad.",
        "Yes: check-engine diagnostics with a code pull, live data and the real cause (\"not a guess and a parts bill\"), plus engine repair: timing belts and chains, head gaskets, oil leaks, misfires, belts and pulleys. You get the price before any work, and if it isn't worth fixing, they'll say so."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "ac", k: ["aire acondicionado", "aire", "a c", "ac", "clima", "no enfria", "calefaccion", "compresor", "recarga", "air conditioning", "not cold", "heat", "heater", "compressor", "recharge", "blower"],
      a: function () { return L("Sí: aire acondicionado y calefacción en los 2 talleres: revisión de fugas, evacuación y recarga, compresores, condensadores y motores de ventilador.",
        "Yes: A/C and heat at both shops: leak check, evacuate and recharge, compressors, condensers and blower motors."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "suspension", k: ["suspension", "amortiguadores", "struts", "rotulas", "brazos de control", "terminales", "direccion hidraulica", "flechas", "flecha cv", "baleros", "balero", "tren delantero", "truena", "shocks", "ball joints", "control arms", "tie rods", "cv axle", "wheel bearing", "steering", "front end"],
      a: function () { return L("Sí: suspensión y dirección: amortiguadores, struts, brazos de control, rótulas, terminales de dirección, flechas CV, baleros de rueda y trabajo de tren delantero.",
        "Yes: suspension and steering: shocks, struts, control arms, ball joints, tie rods, CV axles, wheel bearings and front-end work."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "electrico", k: ["bateria", "electrico", "sistema electrico", "marcha", "alternador", "luces", "cableado", "sensores", "no carga", "battery", "electrical", "starter", "alternator", "wiring", "lights", "charging"],
      a: function () { return L("Sí: baterías y sistema eléctrico: marchas, alternadores, pruebas del sistema de carga, sensores, cableado e iluminación, y localización de fallas eléctricas.",
        "Yes: batteries and electrical: starters, alternators, charging system tests, sensors, wiring and lighting, and electrical troubleshooting."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "calienta", k: ["se calienta", "sobrecalienta", "calentando", "radiador", "anticongelante", "termostato", "bomba de agua", "manguera", "ventilador", "pierde agua", "overheat", "overheating", "radiator", "coolant", "thermostat", "water pump", "hose", "fan"],
      a: function () { return L("Sí: sistema de enfriamiento: radiadores, bombas de agua, termostatos, mangueras, ventiladores y diagnóstico de sobrecalentamiento.",
        "Yes: cooling system: radiators, water pumps, thermostats, hoses, fans and overheating diagnosis."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "emisiones", k: ["escape", "mofle", "mofles", "tubo de escape", "emisiones", "verificacion", "inspeccion estatal", "sticker", "smog", "exhaust", "muffler", "emissions", "state inspection", "inspection sticker"],
      a: function () { return L("Sí: escape y preparación para emisiones: mofles, tubos y sensores, y te dejan listo para la verificación de emisiones del condado de Dallas. Su web habla de preparación para emisiones; si necesitas la inspección estatal en sí, confírmalo con el taller (" + TELS + ").",
        "Yes: exhaust and emissions prep: mufflers, pipes and sensors, and getting you ready for Dallas County emissions. Their site talks about emissions prep; if you need the state inspection itself, confirm with the shop (" + TELS + ")."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "usado", k: ["comprar un usado", "carro usado", "auto usado", "revisar antes de comprar", "inspeccion antes de comprar", "pre compra", "used car", "pre purchase", "pre-purchase", "buying a car"],
      a: function () { return L("Sí: hacen inspecciones antes de comprar un carro usado, en los 2 talleres.", "Yes: they do pre-purchase inspections on used cars, at both shops."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "flota", k: ["flota", "flotilla", "flotillas", "camioneta", "camionetas", "troca", "trocas", "van", "vans", "suv", "fleet", "truck", "trucks"],
      a: function () { return L("Sí: trabajan en la mayoría de autos, camionetas, vans y SUVs, y su web dice que las flotillas pequeñas son bienvenidas.", "Yes: they work on most cars, trucks, vans and SUVs, and their site says small fleets are welcome."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nolist", k: ["grua", "remolque", "remolcar", "llanta", "llantas", "ponchada", "neumatico", "alineacion", "alinear", "balanceo", "carroceria", "hojalateria", "pintura", "choque", "moto", "motos", "motocicleta", "trailer", "traila", "carro electrico", "auto electrico", "tesla", "a domicilio", "mecanico movil", "vidrios", "parabrisas", "tow", "towing", "tire", "tires", "flat", "alignment", "body shop", "paint", "collision", "motorcycle", "semi", "electric car", "ev", "mobile mechanic", "windshield", "boat", "rv"], a: noListA, c: [TELWD, TELOC, LLAMADA_CHIP] },
    { id: "nomaneja", k: ["no arranca", "no prende", "no camina", "no se puede manejar", "varado", "quedado", "won t start", "wont start", "not drivable", "stranded", "broke down"],
      a: function () { return L("Su web no publica servicio de grúa. Llama al taller más cercano (" + TELS + ") y te dicen cómo llevarlo, o déjame tu teléfono y te contactan ellos. Si es la batería, la marcha o el alternador, eso sí lo revisan.",
        "Their site doesn't list towing. Call the shop closest to you (" + TELS + ") and they'll tell you how to get it there, or leave your number and they'll reach out. If it's the battery, starter or alternator, that they do check."); }, c: [TELWD, TELOC, LLAMADA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "services", "what do you fix", "what do you do", "repairs"], a: serviciosA, c: [CITA_CHIP, TRANS, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "price", "prices", "how much", "cost", "cheap", "rates", "discount"],
      a: function () { return L("Los precios te los da el taller, y su web no publica ninguno. Lo que sí dice: presupuestos gratis, te dan el precio de piezas y mano de obra antes de tocar el carro, no hacen nada sin tu autorización y, si encuentran algo más, te llaman primero. Lo que puedo hacer: dejarte pedido el presupuesto con tu vehículo y lo que le pasa, y te contactan.",
        "Pricing comes from the shop, and their site doesn't publish any. What it does say: free estimates, the price for parts and labor before any wrench turns, nothing done without your OK, and if they find something else they call you first. What I can do: request the estimate with your vehicle and what's going on, and they'll get back to you."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "presupuesto", k: ["presupuesto gratis", "cotizacion gratis", "es gratis", "sin costo", "free estimate", "free quote", "is it free"],
      a: function () { return L("Sí: su web dice «presupuestos gratis». Diagnostican, te dan el precio antes de tocar el carro y tú apruebas el trabajo. Te dejo pedido el tuyo en un minuto.",
        "Yes: their site says \"free estimates\". They diagnose, give you the price before any work, and you approve the job. I can request yours in a minute."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nopub", k: ["financiamiento", "financiar", "a plazos", "plan de pagos", "credito", "garantia", "garantizan", "tarjeta", "efectivo", "formas de pago", "financing", "payment plan", "credit", "warranty", "guarantee", "card", "cash", "payment"], a: noPubA, c: [TELWD, TELOC, LLAMADA_CHIP] },
    { id: "tiempo", k: ["cuanto tarda", "cuanto tiempo", "cuantas horas", "cuantos dias", "rapido", "mismo dia", "hoy mismo", "para hoy", "how long", "how fast", "turnaround", "same day", "today"],
      a: function () { return L("Su web dice: llama antes si necesitas el trabajo el mismo día. Cuánto tarda te lo dice el taller cuando encuentra la causa. Si quieres, te dejo pedido que te llamen o escriban.",
        "Their site says: call ahead if you need same-day work. How long it takes, the shop tells you once they find the cause. I can have them call or text you."); }, c: [TELWD, TELOC, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llegar", "llegar sin avisar", "necesito cita", "dejar el carro", "dejarlo", "without appointment", "drop by", "stop by", "drop off", "need an appointment"],
      a: function () { return L("Sí: se aceptan sin cita y puedes dejar el carro durante el horario de atención (lunes a sábado, 8:00 a.m. – 6:00 p.m.); su web dice que llamar antes te atiende más rápido. Si quieres, te dejo el pedido listo aquí.",
        "Yes: walk-ins welcome and drop-off is available during open hours (Mon–Sat 8:00 AM – 6:00 PM); their site says calling ahead gets you in faster. I can set up your request here if you like."); }, c: [CITA_CHIP, MAPWD, MAPOC] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue"],
      a: function () { return L("Sí: en los 2 talleres hablan español e inglés. Aquí te atiendo en los dos (botón EN arriba).", "Yes: both shops speak Spanish and English (\"Se habla español\"). I can help you in either one (ES button at the top)."); }, c: [CITA_CHIP] },
    { id: "sedes", k: ["sede", "sedes", "sucursal", "sucursales", "cual taller", "cual me queda", "mas cerca", "diferencia", "west dallas", "oak cliff", "coombsville", "hampton", "which shop", "closest", "nearest", "location", "locations", "difference"], a: function () { return dirA(); }, c: [MAPWD, MAPOC, CITA_CHIP] },
    { id: "historia", k: ["dueno", "quien", "desde cuando", "experiencia", "historia", "honestos", "confianza", "owner", "who", "experience", "honest", "trust"],
      a: function () { return L("Bronco Auto Repair son 2 talleres mecánicos independientes en West Dallas y Oak Cliff, con el mismo estándar de trabajo. Su lema: «Arreglamos tu carro. No te vendemos de más.» Su web dice que hacen un diagnóstico real y que, si no vale la pena repararlo, te lo dicen con honestidad.",
        "Bronco Auto Repair is 2 independent shops in West Dallas and Oak Cliff, same crew standard. Their line: \"Your car gets fixed. Not upsold.\" Their site says you get a real diagnosis, and if it isn't worth fixing, they'll say so."); }, c: [CITA_CHIP] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "lunes", "hoy abren", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "address", "where", "directions", "located"],
      a: function () { return dirA() + L("\nSi quieres, te dejo pedido el presupuesto o la cita desde aquí y el taller te confirma.", "\nI can request the estimate or appointment from here and the shop confirms."); }, c: [MAPWD, MAPOC, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "facebook", "phone", "number", "call", "text", "contact"],
      a: function () { return L("Canales que publica el taller: solo teléfono.\n📞 West Dallas: " + C.wd.tel + "\n📞 Oak Cliff: " + C.oc.tel + "\nNo publican WhatsApp, email ni formulario. O deja aquí tu teléfono y te contactan ellos, por llamada o mensaje de texto.",
        "Channels the shop publishes: phone only.\n📞 West Dallas: " + C.wd.tel + "\n📞 Oak Cliff: " + C.oc.tel + "\nThey don't list WhatsApp, email or a contact form. Or leave your number here and they'll reach out by call or text."); }, c: [TELWD, TELOC, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: function () { return L("¡Con gusto! Si necesitas algo más, aquí estoy. 🔧", "You're welcome! I'm here if you need anything else. 🔧"); }, c: [CITA_CHIP] }
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
  function sedeName(k) { return k === "wd" ? "West Dallas" : (k === "oc" ? "Oak Cliff" : L("el que atienda antes", "whichever is sooner")); }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/\(214\) 272-9778/g, '<a href="tel:+12142729778">(214) 272-9778</a>').replace(/\(214\) 941-0023/g, '<a href="tel:+12149410023">(214) 941-0023</a>'); }
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
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = L("🟢 Abiertos ahora (2 talleres) · hasta las " + hm(closeAt(n)), "🟢 Open now (both shops) · until " + hm(closeAt(n))); }
    else { status.className = "r24-status r24-closed"; status.textContent = L("🌙 Fuera de horario (abren " + nextOpening(n) + ") · te atiendo igual y el taller recibe tu pedido", "🌙 After hours (they open " + nextOpening(n) + ") · I'll still take your request"); }
  }
  function menuChips() { return [CITA_CHIP, SVC, HOR, TRANS, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + L(" · 2 talleres, Dallas", " · 2 shops, Dallas");
    panel.querySelector(".r24-in").placeholder = L("Escribe tu pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · tus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk"));
    banner.textContent = L("Demo privada preparada para Bronco Auto Repair", "Private demo prepared for Bronco Auto Repair");
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
    // su botón EN/ES de la cabecera lleva a la página gemela: la recepción la sigue en ese idioma
  }
  function setLang(l, announce) {
    if (l === lang) return; lang = l; headTexts(); statusText();
    if (announce) addBot(L("Perfecto, seguimos en español. ¿En qué te ayudo?", "Sure, let's continue in English. How can I help?"), flow ? [] : menuChips());
    if (flow && announce) setTimeout(function () { ask(flow.step); }, 600);
  }
  // R24-HUMANO-1018: siempre a la vista; nunca deja al cliente atrapado con el asistente
  function humano() {
    flow = null; addUser(L("👤 Hablar con una persona", "👤 Talk to a person"));
    var n = nowTx(), ab = isOpen(n);
    addBot(L((ab ? "Claro. Ahora están abiertos: llama al taller que te quede más cerca y te atiende una persona — West Dallas " + C.wd.tel + " u Oak Cliff " + C.oc.tel + " (o pasa directo: se aceptan sin cita)." : "Claro. Ahora los talleres están cerrados (abren " + nextOpening(n) + "); puedes llamar en horario a West Dallas " + C.wd.tel + " o a Oak Cliff " + C.oc.tel + ".") + " Si prefieres, te contactan ellos: déjame tu nombre y teléfono y el pedido les llega al instante.",
      (ab ? "Sure. They're open now: call the shop closer to you and a person will help — West Dallas " + C.wd.tel + " or Oak Cliff " + C.oc.tel + " (or just stop by: walk-ins welcome)." : "Sure. The shops are closed right now (they open " + nextOpening(n) + "); you can call West Dallas " + C.wd.tel + " or Oak Cliff " + C.oc.tel + " during business hours.") + " Or they can reach out to you: leave your name and number and they get the request instantly."), [TELWD(), TELOC(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy la recepción virtual de Bronco Auto Repair (West Dallas y Oak Cliff). Te ayudo a pedir tu presupuesto gratis o una cita en cualquiera de los 2 talleres, te tomo los datos para que el taller te llame o te escriba, o te cuento servicios y horario, a cualquier hora: aunque nadie pueda contestar el teléfono.\n¿En qué te ayudo?",
      "Hi! 👋 I'm the virtual front desk for Bronco Auto Repair (West Dallas and Oak Cliff). I can set up your free estimate or an appointment at either shop, take your details so the shop calls or texts you back, or answer questions about services and hours — any time, even when nobody can pick up the phone.\nHow can I help?"), menuChips());
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
  // Lo que le pasa, con los servicios que publica su web (sin transmisiones: no las reparan)
  function SINT() { return lang === "en" ? ["Check engine light / engine", "Brakes (noise / pedal)", "A/C or heat", "Suspension / steering", "Battery / electrical / won't start", "Overheating", "Oil change / maintenance", "Exhaust / emissions prep", "Other / not sure"]
    : ["Luz de check engine / motor", "Frenos (ruido / pedal)", "Aire acondicionado o calefacción", "Suspensión / dirección", "Batería / eléctrico / no arranca", "Se calienta", "Cambio de aceite / mantenimiento", "Escape / preparación para emisiones", "Otra cosa / no sé"]; }
  function SEDES() { return opts([L("West Dallas · 2720 Coombsville Ave", "West Dallas · 2720 Coombsville Ave"), L("Oak Cliff · 1022 S Hampton Rd", "Oak Cliff · 1022 S Hampton Rd"), L("El que me atienda antes", "Whichever is sooner")]); }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function MEDIO() { return opts([L("📞 Llamada", "📞 Phone call"), L("💬 Mensaje de texto", "💬 Text message")]); }
  function franjas() { return opts([L("Mañana (8:00 a.m. – 12:00 p.m.)", "Morning (8:00 AM – 12:00 PM)"), L("Tarde (12:00 – 6:00 p.m.)", "Afternoon (12:00 – 6:00 PM)"), L("Me da igual", "Either is fine")]); }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos te dejo el pedido listo para el taller. (Escribe «cancelar» si quieres salir.)\n¿Qué necesitas?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Presupuesto gratis", "Free estimate"), L("Cita para llevar el carro", "Appointment to bring the car")]));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || L("Consulta general", "General question")).slice(0, 120) } };
    addBot(L("¡Claro! Te contacta una persona del taller, por llamada o por mensaje de texto. Solo necesito unos datos.\n¿Cuál es tu nombre? (Escribe «cancelar» si quieres salir.)", "Sure! Someone from the shop will reach out by phone call or text. I just need a few details.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function fotoRecibida(f) {
    var d = flow.d; d.foto = f.name.slice(0, 40);
    var m = el("div", "r24-msg r24-user r24-photo"); var im = new Image(); im.alt = "foto"; im.style.cssText = "max-width:160px;max-height:120px;display:block;border-radius:8px;margin-bottom:4px";
    try { im.src = URL.createObjectURL(f); } catch (e) {}
    m.appendChild(im); m.appendChild(document.createTextNode("📷 " + d.foto)); body.appendChild(m); scroll();
    var w = body.querySelectorAll(".r24-chips"); if (w.length) w[w.length - 1].remove();
    addBot(L("📷 Foto recibida (en esta demo no sale de tu teléfono).", "📷 Photo received (in this demo it never leaves your phone)."));
    setTimeout(function () { ask("sede"); }, 600);
  }
  function medioTxt(d) { return d.medio || L("Llamada", "Phone call"); }
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del vehículo? (por ejemplo: 2016 Honda Civic)", "Year, make and model? (e.g. 2016 Honda Civic)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesitas?", "What's going on, or what service do you need?"), opts(SINT()));
    else if (step === "foto") addBot(L("¿Tienes una foto (de la luz del tablero, de la fuga o de la pieza)? Es opcional y ayuda al taller a preparar el presupuesto.", "Do you have a photo (the dashboard light, the leak or the part)? It's optional and helps the shop prepare the estimate."), FOTO());
    else if (step === "sede") addBot(d.tipo === "llamada" ? L("¿De cuál de los 2 talleres quieres que te contacten?", "Which of the 2 shops should reach out?") : L("¿A cuál de los 2 talleres lo llevarías? Los dos hacen el mismo trabajo y tienen el mismo horario.", "Which of the 2 shops would you take it to? Both do the same work and keep the same hours."), SEDES());
    else if (step === "dia") {
      var days = nextWorkdays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día te queda mejor? Lo anoto como preferencia y el taller te lo confirma (también se aceptan sin cita). Abren de lunes a sábado de 8:00 a.m. a 6:00 p.m.; el domingo cierran.", "Which day works best? I'll note it as a preference and the shop confirms (walk-ins welcome too). They're open Monday–Saturday 8:00 AM – 6:00 PM; closed Sunday."),
        opts(days.map(function (x) { return x.label; })).concat(opts([L("Lo antes posible", "As soon as possible")])));
    }
    else if (step === "franja") addBot(L("¿En qué franja?", "What time window?"), franjas());
    else if (step === "nombre") addBot(L("¿Cuál es tu nombre?", "What's your name?"));
    else if (step === "medio") addBot(L("Gracias, " + d.nombre + ". ¿Prefieres que te llamen o que te manden un mensaje de texto?", "Thanks, " + d.nombre + ". Would you rather get a call or a text?"), MEDIO());
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto. ¿A qué teléfono te " + (/texto/i.test(medioTxt(d)) ? "escriben" : "llaman") + "?", "Great. What number should they " + (/text/i.test(medioTxt(d)) ? "text" : "call") + "?") : L("Último paso: ¿a qué teléfono te contactan para confirmar?", "Last step: what number should they use to confirm?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revisa tu solicitud de contacto:\n👤 Nombre: ", "Please review your contact request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n📍 Taller: ", "\n📍 Shop: ") + sedeName(d.sede) + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso(d) + q, B, "r24-sum"); return; }
      addBot(L("Revisa tu solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Vehículo: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n🔧 Qué le pasa: ", "\n🔧 Problem: ") + d.sintoma + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📍 Taller: ", "\n📍 Shop: ") + sedeName(d.sede) + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso(d) + q, B, "r24-sum");
    }
  }
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
        addBot(/cita|appointment/.test(n) ? L("Bien. Te anoto el taller y el día que prefieres, y el taller te lo confirma.", "Got it. I'll note your shop and preferred day, and the shop confirms.")
          : L("Bien. Su web no publica precios: el presupuesto es gratis, te dan el precio antes de tocar el carro y tú apruebas el trabajo.", "Got it. Their site doesn't publish prices: the estimate is free, you get the price before any work, and you approve the job."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60); ask("sintoma"); return;
      case "sintoma":
        d.sintoma = t.slice(0, 100);
        if (/transmis|caja|patina|clutch|embrague|slipping|shifting/.test(n)) { addBot(L("Ojo: los 2 talleres no reparan transmisiones, pero sí la conectan al escáner, te dicen lo que ven y te recomiendan un especialista de confianza. Lo anoto así.", "Heads-up: neither shop does transmission work, but they'll scan it, tell you what they see and refer you to a specialist they trust. I'll note it that way.")); setTimeout(function () { ask("foto"); }, 700); return; }
        ask("foto"); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("sede"); return;
      case "sede":
        d.sede = /west|coombsville/.test(n) ? "wd" : (/oak|cliff|hampton/.test(n) ? "oc" : "any");
        if (d.tipo === "llamada") ask("medio"); else ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60); d.dow = flow.days && flow.days[t] != null ? flow.days[t] : -1;
        if (/^(lo antes posible|as soon as possible)$/i.test(t)) { d.franja = L("La primera disponible", "First available"); ask("nombre"); return; }
        ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask("nombre"); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dices tu nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        if (d.tipo === "llamada") ask("sede"); else ask("medio"); return;
      case "medio":
        d.medio = /texto|text|sms|mensaje/i.test(t) ? L("Mensaje de texto", "Text message") : L("Llamada", "Phone call");
        ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbelo con 10 cifras (con código de área), por ejemplo 214-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 214-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)"), tx = /texto|text/i.test(medioTxt(d));
          var sd = d.sede === "any" ? L("El taller", "The shop") : L("El taller de " + sedeName(d.sede), "The " + sedeName(d.sede) + " shop");
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ " + sd + " recibe tu pedido al instante y te " + (tx ? "escribe" : "llama") + " al " + d.telefono + ".", "All set, " + nm2 + "! ✅ " + sd + " gets your request instantly and will " + (tx ? "text" : "call") + " you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Tu solicitud quedó registrada.\n" + sd + " te " + (tx ? "escribe" : "llama") + " al " + d.telefono + " para confirmar el día y la hora; el presupuesto te lo dan ellos después de revisar el vehículo.", "All set, " + nm2 + "! ✅ Your request is in.\n" + sd + " will " + (tx ? "text" : "call") + " you at " + d.telefono + " to confirm the day and time; the estimate comes from them after checking the vehicle.") + DEMO, [d.sede === "oc" ? MAPOC() : MAPWD(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
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
    addBot(L("Eso te lo confirma mejor el taller, así tienes el dato exacto. 😊\nLlama a West Dallas " + C.wd.tel + " o a Oak Cliff " + C.oc.tel + ", o déjame tu teléfono y te contactan ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall West Dallas " + C.wd.tel + " or Oak Cliff " + C.oc.tel + ", or leave your number and they'll get back to you."), [TELWD, TELOC, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot(L("Claro, ¿qué más quieres saber?", "Sure, what else would you like to know?"), menuChips()); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué te puedo ayudar? Te pido un presupuesto o una cita en cualquiera de los 2 talleres, te tomo los datos para que te llamen o te escriban y te cuento servicios, horario y direcciones.", "Hi! How can I help? I can request an estimate or an appointment at either shop, take your details for a call or text back, and tell you about services, hours and locations."), menuChips()); return; }
    if (/^(horario y talleres|hours and shops)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [CITA_CHIP, MAPWD, MAPOC, LLAMADA_CHIP]); return; }
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
  window.R24 = { open: open, setLang: function (l) { if (panel) setLang(l === "en" ? "en" : "es", opened); }, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
