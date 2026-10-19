/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Poblano's Tire Mechanic & Muffler Shop (llantera, mofles y mecánica, 1502 Rock Island Rd, Irving TX 75060) — DEMO privada, bilingüe ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica poblanosrepair.com (oct. 2026; en inglés con botón «Español»): home, About Us, Services, Reviews, Contact.
   - Teléfono (214) 245-9086, «Call or Text» (llamada o mensaje de texto). Facebook y ficha de Google. No publican WhatsApp ni email. No tienen formularios.
   - Horario (en todas sus páginas): lunes a viernes 8:30 am – 8:00 pm, sábado 8:30 am – 6:00 pm, domingo cerrado. Walk-ins siempre bienvenidos, sin cita.
   - Taller familiar y bilingüe («Se habla español»). Servicios: mofles y escapes (catalizador, emisiones, escapes de desempeño), llantas nuevas y usadas,
     reparación de ponchaduras, montaje, balanceo y rotación, venta de rines, frenos, A/C, suspensión, cambio de aceite y de aceite de transmisión,
     inspección estatal de Texas (DPS, seguridad y emisiones OBD, 15–30 min promedio, sin cita), diagnóstico / luz del motor, afinación y mantenimiento.
     Atienden Irving, Grand Prairie, Las Colinas, Euless, Bedford, Carrollton, Farmers Branch y Dallas.
   Sin precios (la web no publica ninguno; sí «Call for a Free Estimate» y «presupuesto claro antes de empezar»), sin WhatsApp, sin grúa, sin carrocería. Español en «usted». */
(function () {
  "use strict";
  var C = {
    nombre: "Poblano's Tire Mechanic & Muffler Shop", corto: "Poblano's",
    tel: "(214) 245-9086", telh: "+12142459086",
    dir: "1502 Rock Island Rd, Irving, TX 75060", maps: "https://share.google/he3KBBujRYdQ4nc73"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  var ES = /(^|\/)es-[^\/]*$/.test(location.pathname);
  // Horario (minutos desde las 0:00, hora de Texas/Central). 0 = domingo.
  var LV = [[510, 1200]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 6: [[510, 1080]], 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller (en todas sus páginas):\n• Lunes a viernes: 8:30 am – 8:00 pm\n• Sábado: 8:30 am – 6:00 pm\n• Domingo: cerrado\nNo hace falta cita: su web dice que los walk-ins siempre son bienvenidos.",
      "Shop hours (on every page of their site):\n• Monday–Friday: 8:30 am – 8:00 pm\n• Saturday: 8:30 am – 6:00 pm\n• Sunday: closed\nNo appointment needed: their site says walk-ins are always welcome.");
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
  function hm(min) { var h = Math.floor(min / 60), mm = ("0" + (min % 60)).slice(-2), ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return h + ":" + mm + " " + ap; }
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

  var CITA_CHIP = { a: "cita", get t() { return L("🔧 Presupuesto o cita", "🔧 Estimate or appointment"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen o escriban", "📲 Call or text me back"); } };
  function aviso() { return L("🔔 El equipo del taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop team gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL() { return { t: L("Llamar al ", "Call ") + C.tel, tel: C.telh }; }
  function SMS() { return { t: "💬 " + L("Mandar texto al ", "Text ") + C.tel, url: "sms:" + C.telh, self: true }; }
  function MAPS() { return { t: L("Cómo llegar (Google Maps)", "Directions (Google Maps)"), url: C.maps }; }
  function PAGE(es, en, f) { return function () { return { t: L(es, en), url: (ES ? "es-" : "") + f, self: true }; }; }
  var SERVP = PAGE("Ver la página de servicios", "See the services page", "services.html");
  var CONTP = PAGE("Ver la página de contacto", "See the contact page", "contact.html");
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & address", "horario y direccion", "hours and address");
  var INSP = Q("🚦 Inspección estatal (sin cita)", "🚦 State inspection (walk-in)", "inspeccion estatal", "state inspection");
  function dirA() { return L("📍 " + C.dir + ", cerca del cruce de Rock Island Rd y Rogers Rd. Su web dice que se llega fácil desde Irving Blvd y la SH-183, a minutos del aeropuerto DFW y de Las Colinas, y que atienden a Irving, Grand Prairie, Las Colinas, Euless, Bedford, Carrollton, Farmers Branch y Dallas.",
    "📍 " + C.dir + ", near the Rock Island Rd and Rogers Rd intersection. Their site says it's easy to reach from Irving Blvd and SH-183, minutes from DFW Airport and Las Colinas, and that they serve Irving, Grand Prairie, Las Colinas, Euless, Bedford, Carrollton, Farmers Branch and Dallas."); }
  function horarioA() {
    var n = nowTx(), s = isOpen(n) ? L("🟢 Ahora están abiertos, hasta las " + hm(closeAt(n)) + ".", "🟢 They're open now, until " + hm(closeAt(n)) + ".") : L("🌙 Ahora está cerrado; abre " + nextOpening(n) + ". Igual le tomo el pedido ahora y el taller lo recibe al instante.", "🌙 It's closed right now; opens " + nextOpening(n) + ". I can still take your request now and the shop gets it instantly.");
    return horarioTxt() + "\n" + s;
  }
  function serviciosA() {
    return L("Lo que publica el taller (familiar y bilingüe, para todas las marcas):\n• Mofles y escapes (catalizador, fallas de emisiones, escapes de desempeño)\n• Llantas nuevas y usadas, reparación de ponchaduras, montaje, balanceo, rotación y venta de rines\n• Frenos\n• Aire acondicionado (A/C)\n• Suspensión\n• Cambio de aceite y de aceite de transmisión\n• Inspección estatal de Texas (seguridad y emisiones)\n• Diagnóstico y luz del motor, afinación y mantenimiento\n¿Qué le pasa a su auto?",
      "What the shop lists (family-owned and bilingual, all makes):\n• Mufflers & exhaust (catalytic converters, emissions failures, performance exhaust)\n• New & used tires, flat repair, mounting, balancing, rotation and rim sales\n• Brakes\n• Auto A/C\n• Suspension\n• Oil changes and transmission oil changes\n• Texas state inspection (safety & emissions)\n• Diagnostics & check engine light, tune-ups and maintenance\nWhat's going on with your car?");
  }
  function noListA() {
    return L("Eso no aparece entre los servicios de su web, así que no se lo voy a asegurar. Llame o mande texto al " + C.tel + ", o déjeme su teléfono y le contactan ellos para confirmarlo.",
      "That isn't among the services on their website, so I won't promise it. Call or text " + C.tel + ", or leave your number and they'll get back to you to confirm.");
  }
  var KB = [
    { id: "escape", k: ["mofle", "mofles", "escape", "silenciador", "catalizador", "catalitico", "convertidor catalitico", "suena fuerte", "ruido fuerte", "truena", "emisiones", "muffler", "mufflers", "exhaust", "catalytic", "catalytic converter", "loud", "rattling", "emissions"],
      a: function () { return L("Sí: es de lo que más hacen. Su web dice que reparan y cambian mofles, tubos de escape, catalizadores y sistemas de escape completos para todo tipo de vehículo (también mofles a medida y escapes de desempeño). Si el auto suena muy fuerte, vibra por abajo o no pasó la prueba de emisiones de Texas, lo diagnostican. ¿Le dejo pedido el presupuesto?", "Yes, it's one of their main services. Their site says they repair and replace mufflers, exhaust pipes, catalytic converters and complete exhaust systems for all vehicle types (plus custom mufflers and performance exhaust). If your car is too loud, rattling underneath or failed the Texas emissions test, they diagnose it. Want me to set up an estimate?"); }, c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "llantas", k: ["llanta", "llantas", "ponchada", "ponchadura", "pinchazo", "pinchada", "neumatico", "gomas", "balanceo", "balancear", "rotacion", "rines", "rin", "llantas usadas", "tire", "tires", "flat", "flat tire", "used tires", "balancing", "rotation", "rims", "wheels", "plug", "patch"],
      a: function () { return L("Sí: venden llantas nuevas y usadas para todas las marcas y medidas, y también rines. Reparan ponchaduras (tapón o parche; su web dice que casi siempre se arregla en minutos sin quitar la llanta del auto) y hacen montaje, balanceo y rotación. Para saber si tienen su medida, su web pide llamar al " + C.tel + "; o le dejo el pedido y le avisan ellos.", "Yes: they sell new and used tires for all makes and sizes, plus rims. They fix flats (plug or patch; their site says most are done in minutes without taking the tire off the car) and do mounting, balancing and rotation. To check if they have your size, their site says to call " + C.tel + "; or I can leave a request and they'll let you know."); }, c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "alineacion", k: ["alineacion", "alinear", "alineado", "se va de lado", "alignment", "align", "pulls to one side"],
      a: function () { return L("Su web la menciona solo de pasada (en la sección de llantas, en español, dice «balanceo, alineación y rines»), pero no está en su lista de servicios, así que no se lo voy a asegurar. Mejor que se lo confirme el taller: llame o mande texto al " + C.tel + ", o le contactan ellos.", "Their site only mentions it in passing (the Spanish line in the tire section says \"balanceo, alineación y rines\"), but it isn't in their list of services, so I won't promise it. Best to confirm with the shop: call or text " + C.tel + ", or they can get back to you."); }, c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "frenos", k: ["freno", "frenos", "balatas", "pastillas", "discos", "rotores", "calipers", "rechinan", "chillan", "truenan los frenos", "pedal suave", "liquido de frenos", "abs", "brake", "brakes", "pads", "rotors", "caliper", "squeak", "squealing", "grinding", "soft pedal"],
      a: function () { return L("Sí: hacen frenos. Su web dice que revisan todo el sistema (balatas, discos, calipers, líneas y líquido) y le dan una evaluación honesta antes de tocar nada: balatas y zapatas, rectificado o cambio de discos, calipers, cambio de líquido de frenos y revisión del ABS. ¿Le dejo pedido el presupuesto?", "Yes, they do brakes. Their site says they inspect the whole system (pads, rotors, calipers, lines and fluid) and give you an honest assessment before touching anything: pads and shoes, rotor resurfacing or replacement, calipers, brake fluid flush and ABS inspection. Want me to set up an estimate?"); }, c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "ac", k: ["aire", "aire acondicionado", "ac", "a/c", "no enfria", "echa aire caliente", "clima", "freon", "gas del aire", "compresor", "air conditioning", "air conditioner", "not cold", "not cooling", "blowing warm", "blowing hot", "compressor", "refrigerant", "recharge"],
      a: function () { return L("Sí: reparan el aire acondicionado de autos, trocas y SUVs. Su web dice que hacen diagnóstico, recarga de refrigerante (freón), reparación o cambio del compresor, evaporador y condensador, y detección y reparación de fugas, y que con el calor de Texas lo atienden como prioridad.", "Yes: they repair A/C on cars, trucks and SUVs. Their site lists diagnosis, refrigerant (freon) recharge, compressor repair or replacement, evaporator and condenser service, and leak detection and repair, and says that in the Texas heat they treat it as a priority."); }, c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "suspension", k: ["suspension", "amortiguador", "amortiguadores", "struts", "rotulas", "terminales", "brazo de control", "flecha", "eje cv", "golpea", "golpeteo", "rebota", "brinca", "shocks", "shock", "strut", "ball joint", "tie rod", "control arm", "cv axle", "bouncing", "clunk", "clunking"],
      a: function () { return L("Sí: hacen suspensión. Su web dice que revisan y reparan amortiguadores, struts, rótulas, terminales, brazos de control y ejes/flechas CV; si el auto rebota mucho, se va de lado o golpea en los baches, conviene revisarlo. ¿Le dejo pedido el presupuesto?", "Yes, they do suspension. Their site says they inspect and repair shocks, struts, ball joints, tie rods, control arms and CV axles; if your car bounces a lot, pulls to one side or clunks over bumps, it's worth checking. Want me to set up an estimate?"); }, c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "aceite", k: ["aceite", "cambio de aceite", "sintetico", "filtro de aceite", "aceite de transmision", "oil", "oil change", "synthetic", "oil filter", "transmission fluid", "transmission oil"],
      a: function () { return L("Sí: cambio de aceite convencional y sintético, filtro, revisión de niveles y presión de llantas, y también cambio de aceite de transmisión. Su web dice que cada cambio de aceite incluye una inspección de cortesía de varios puntos y que no hace falta cita (walk-ins bienvenidos).", "Yes: conventional and full synthetic oil changes, filter, fluid top-off and tire pressure check, plus transmission oil changes. Their site says every oil change includes a complimentary multi-point inspection and no appointment is needed (walk-ins welcome)."); }, c: [CITA_CHIP, HOR, LLAMADA_CHIP] },
    { id: "inspeccion", k: ["inspeccion", "inspeccion estatal", "inspeccion del estado", "sticker", "calcomania", "verificacion", "prueba de emisiones", "state inspection", "inspection", "dps", "emissions test", "safety inspection"],
      a: function () { return L("Sí: son estación oficial de inspección vehicular certificada por el DPS de Texas: seguridad y emisiones (OBD) para autos, trocas, SUVs y motos. No hace falta cita (walk-ins); su web dice que tarda 15–30 min en promedio y que, si el vehículo no pasa, muchas veces lo reparan y lo vuelven a inspeccionar en la misma visita. Para saber cuánto hay que esperar, su web pide llamar al " + C.tel + ".", "Yes: they're an official Texas DPS certified vehicle inspection station: safety and emissions (OBD) for cars, trucks, SUVs and motorcycles. No appointment needed (walk-ins); their site says it takes 15–30 min on average and that if your vehicle fails, they can often repair it and re-inspect it the same visit. To check the wait time, their site says to call " + C.tel + "."); }, c: [TEL, HOR, LLAMADA_CHIP] },
    { id: "diagnostico", k: ["luz del motor", "check engine", "testigo", "diagnostico", "escaneo", "escanear", "falla", "ruido", "humo", "se calienta", "radiador", "afinacion", "bujias", "filtro de aire", "bandas", "mangueras", "mantenimiento", "motor", "engine", "check engine light", "diagnosis", "diagnostic", "noise", "smoke", "overheating", "radiator", "tune up", "tune-up", "spark plugs", "belts", "hoses", "maintenance"],
      a: function () { return L("Sí: su web dice que leen los códigos con herramientas profesionales de diagnóstico y le explican el problema (en español o inglés) antes de recomendar cualquier reparación. También hacen afinación (bujías, filtros de aire y combustible, encendido), mantenimiento general, sistema de enfriamiento y radiador, y revisión de bandas y mangueras.", "Yes: their site says they read the codes with professional diagnostic tools and explain the problem (in English or Spanish) before recommending any repair. They also do tune-ups (spark plugs, air and fuel filters, ignition), general maintenance, cooling system and radiator service, and belt and hose inspection."); }, c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "transmision", k: ["transmision", "caja", "caja de cambios", "reconstruir transmision", "transmission", "transmission repair", "transmission rebuild", "gearbox"],
      a: function () { return L("Su web publica el cambio de aceite de transmisión y, en la página principal, menciona «transmission service» dentro de la mecánica general. Reparaciones mayores o reconstrucción de transmisión no las detalla, así que eso se lo confirma el taller: llame o mande texto al " + C.tel + ", o le contactan ellos.", "Their site lists transmission oil changes, and the homepage mentions \"transmission service\" under general mechanic work. It doesn't detail major transmission repairs or rebuilds, so the shop should confirm that: call or text " + C.tel + ", or they can get back to you."); }, c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "marcas", k: ["marca", "marcas", "toyota", "honda", "ford", "chevrolet", "chevy", "nissan", "hyundai", "kia", "jeep", "dodge", "ram", "gmc", "camioneta", "troca", "pickup", "suv", "make", "makes", "model", "truck"],
      a: function () { return L("Sí: su web habla de servicio para todas las marcas y modelos, y de autos, trocas y SUVs.", "Yes: their site talks about service for all makes and models, and for cars, trucks and SUVs."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "confianza", k: ["garantia", "confianza", "honestos", "experiencia", "familia", "familiar", "warranty", "guarantee", "honest", "experience", "family"],
      a: function () { return L("Su web dice que es un taller familiar, con mecánicos con experiencia que lo arreglan bien a la primera, que solo recomiendan lo que el auto necesita y que dan un presupuesto claro antes de empezar. No publica condiciones de garantía: eso se lo confirma el taller.", "Their site says it's a family-owned shop with experienced mechanics who fix it right the first time, only recommend what your vehicle needs and give you a clear estimate before any work begins. It doesn't publish warranty terms: the shop can confirm that."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nolist", k: ["grua", "remolque", "carroceria", "hojalateria", "pintura", "choque", "abolladura", "vidrios", "parabrisas", "lavado", "detallado", "tow", "towing", "body work", "bodywork", "paint", "collision", "dent", "windshield", "glass", "detailing", "car wash"], a: noListA, c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "services", "what do you fix", "what do you do", "repairs"], a: serviciosA, c: [CITA_CHIP, INSP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "tarifa", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "cheaper"],
      a: function () { return L("Los precios se los da el taller: su web no publica precios. Sí dice que le dan un presupuesto claro antes de empezar, sin cargos ocultos, y sus botones dicen «Call for a Free Estimate» (presupuesto gratis). Lo que hago yo: le dejo pedido el presupuesto con su auto y lo que le pasa, y el taller le contacta.", "Pricing comes from the shop: their site doesn't publish prices. It does say you get a clear estimate before any work begins, with no hidden fees, and their buttons say \"Call for a Free Estimate\". What I can do: request the estimate with your car and what's going on, and the shop gets back to you."); }, c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "walkin", k: ["walk in", "walk-in", "sin cita", "necesito cita", "hace falta cita", "appointment needed", "need an appointment", "no appointment"],
      a: function () { return L("No hace falta cita: su web dice que los walk-ins siempre son bienvenidos. Si quiere, le dejo anotado el día y lo que le pasa al auto para que el taller lo tenga en cuenta, o llame al " + C.tel + " para preguntar cuánto hay que esperar.", "No appointment needed: their site says walk-ins are always welcome. If you like, I can note your day and what's going on with the car so the shop knows, or call " + C.tel + " to check the wait time."); }, c: [CITA_CHIP, TEL, HOR] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue", "bilingual"],
      a: function () { return L("Sí: su web dice «Se habla español» y que su equipo es bilingüe (inglés y español). Aquí le atiendo en español o en inglés (botón EN arriba).", "Yes: their site says \"Se habla español\" and that their team is bilingual (English and Spanish). I can help you in English or Spanish (ES button at the top)."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "lunes", "hoy", "tarde", "hours", "open", "close", "closing", "saturday", "sunday", "weekend", "today", "late"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, TEL] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "irving", "grand prairie", "las colinas", "euless", "carrollton", "rock island", "address", "location", "where", "directions", "located"],
      a: function () { return dirA() + "\n" + horarioTxt().split("\n").slice(0, 4).join("\n"); }, c: [MAPS, CITA_CHIP, LLAMADA_CHIP] },
    { id: "contacto", k: ["telefono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "facebook", "phone", "number", "call", "text", "contact"],
      a: function () { return L("Canales que publica el taller:\n📞 Teléfono (llamada o mensaje de texto): " + C.tel + "\nTambién tienen Facebook y su ficha de Google. No publican WhatsApp ni email, y su web no tiene formulario. O deje aquí su teléfono y le llaman o le escriben ellos.", "Channels the shop publishes:\n📞 Phone (call or text): " + C.tel + "\nThey're also on Facebook and Google. They don't list WhatsApp or email, and their site has no contact form. Or leave your number here and they'll call or text you."); }, c: [TEL, SMS, LLAMADA_CHIP] },
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
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|precio|horario|donde|necesito|quiero|mi carro|mi auto|gracias|cual|frenos|llantas|mofle)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/\(214\) 245-9086/g, '<a href="tel:+12142459086">(214) 245-9086</a>'); }
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
  function menuChips() { return [CITA_CHIP, INSP, SVC, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Irving, TX";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk"));
    banner.textContent = L("Demo privada preparada para Poblano's", "Private demo prepared for Poblano's");
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
    addBot(L("¡Hola! 👋 Soy la recepción virtual de Poblano's Tire Mechanic & Muffler Shop (Irving, TX). Le ayudo a pedir un presupuesto o una cita, le tomo los datos para que el taller lo llame o le escriba, o le cuento servicios y horario, a cualquier hora y sin esperar a que contesten el teléfono.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the virtual front desk for Poblano's Tire Mechanic & Muffler Shop (Irving, TX). I can set up an estimate or an appointment, take your details so the shop calls or texts you back, or answer questions about services and hours — any time, no waiting on the phone.\nHow can I help?"), menuChips());
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
  function SINT() { return lang === "en" ? ["Loud muffler / exhaust", "Flat tire / tires", "Brakes (noise / vibration)", "A/C not cooling", "Suspension (bumps / clunks)", "Check engine light / diagnostics", "Oil change / maintenance", "Other"]
    : ["Mofle / escape ruidoso", "Llanta ponchada / llantas", "Frenos (ruido / vibración)", "El A/C no enfría", "Suspensión (golpes / ruidos)", "Luz del motor / diagnóstico", "Cambio de aceite / mantenimiento", "Otro"]; }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function MEDIO() { return opts([L("📞 Llamada", "📞 Phone call"), L("💬 Mensaje de texto", "💬 Text message")]); }
  function franjas(dow) {
    if (dow === 6) return opts([L("Mañana (8:30 am – 12:00 pm)", "Morning (8:30 am – 12:00 pm)"), L("Tarde (12:00 – 6:00 pm)", "Afternoon (12:00 – 6:00 pm)"), L("Me da igual", "Either is fine")]);
    return opts([L("Mañana (8:30 am – 12:00 pm)", "Morning (8:30 am – 12:00 pm)"), L("Tarde (12:00 – 5:00 pm)", "Afternoon (12:00 – 5:00 pm)"), L("Después del trabajo (5:00 – 8:00 pm)", "After work (5:00 – 8:00 pm)"), L("Me da igual", "Any time")]);
  }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Presupuesto", "Estimate"), L("Cita para llevar el auto", "Appointment to bring the car")]));
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
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del vehículo? (por ejemplo: 2015 Ford F-150)", "Year, make and model? (e.g. 2015 Ford F-150)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesita?", "What's going on, or what service do you need?"), opts(SINT()));
    else if (step === "foto") addBot(L("¿Tiene una foto (de la llanta, del escape, de la luz del tablero o de la pieza)? Es opcional y ayuda al taller a preparar el presupuesto.", "Do you have a photo (the tire, the exhaust, the dashboard light or the part)? It's optional and helps the shop prepare the estimate."), FOTO());
    else if (step === "dia") {
      var days = nextWorkdays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia y el taller se lo confirma (igual aceptan walk-ins). Abren de lunes a viernes de 8:30 am a 8:00 pm y el sábado de 8:30 am a 6:00 pm.", "Which day works best? I'll note it as a preference and the shop confirms (walk-ins are welcome too). They're open Monday–Friday 8:30 am–8:00 pm and Saturday 8:30 am–6:00 pm."),
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
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop|exit|quit)$/.test(n)) { flow = null; addBot(L("Sin problema, cancelé la solicitud. ¿Le ayudo con otra cosa?", "No problem, I've cancelled the request. Anything else?"), [CITA_CHIP, INSP, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "tipo":
        d.servicio = t.slice(0, 40);
        addBot(/cita|appointment/.test(n) ? L("Bien. Le anoto el día que prefiere y el taller se lo confirma.", "Got it. I'll note your preferred day and the shop confirms.")
          : L("Bien. Su web no publica precios: el taller revisa su caso y le da el presupuesto (sus botones dicen «Free Estimate»).", "Got it. Their site doesn't publish prices: the shop reviews your case and gives you the estimate (their buttons say \"Free Estimate\")."));
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
