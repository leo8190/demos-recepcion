/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · MCM Truck Service (taller diésel de camiones y tráileres, Houston TX 77028) — DEMO privada, bilingüe ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica mcmtruckservice.com (oct. 2026): Home, Services y las 9 páginas de servicio, Truck Parking, About, Contact, Status.
   - Dirección: 8638 Green River Dr, Houston, TX 77028.
   - Horario (Contact, pie de página y datos estructurados): lunes a sábado 9:00 am – 6:00 pm; domingo cerrado.
   - Teléfono (346) 256-1148: «Call» y «Text» (Contact). Email: contact@mcmtruckservice.com. No publican WhatsApp: la demo no lo ofrece.
   - Solo camiones y tráileres («no cars, no light duty»), todas las marcas Clase 8 (Freightliner, Kenworth, Peterbilt, Volvo, Mack, International,
     Western Star y más). Negocio familiar, 15+ años, 10,000+ camiones reparados, bilingüe, presupuestos gratis, diagnóstico gratis por teléfono.
   - Servicios: reconstrucción de motores, cambios de aceite (paquetes por motor: Detroit DD15, Cummins ISX/ISX15, Detroit Serie 60), frenos de aire,
     tráiler, transmisión, eléctrico, AC y enfriamiento, suspensión y dirección, estacionamiento de camiones (vigilado 24/7, corto y largo plazo, portón remoto).
   - Portal «Track My Truck» (Status): estado de la reparación con el teléfono que dejaste.
   No se dan precios (los paquetes de aceite con precio están en su página de Oil Changes; aquí se remite a esa página y a confirmar por teléfono),
   ni grúa ni servicio en ruta (no los publican), ni WhatsApp. Trato de «tú» en español, como su web en español. */
(function () {
  "use strict";
  var C = {
    nombre: "MCM Truck Service",
    tel: "(346) 256-1148", telh: "+13462561148",
    email: "contact@mcmtruckservice.com",
    dir: "8638 Green River Dr, Houston, TX 77028",
    maps: "https://www.google.com/maps/search/?api=1&query=8638+Green+River+Dr%2C+Houston%2C+TX+77028"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  function pg(es, en) { return lang === "en" ? en : "es-" + es; }
  // Horario (minutos desde las 0:00, hora de Houston). 0 = domingo.
  var LS = [[540, 1080]];
  var H = { 1: LS, 2: LS, 3: LS, 4: LS, 5: LS, 6: LS, 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller:\n• Lunes a sábado: 9:00 am – 6:00 pm\n• Domingo: cerrado",
      "Shop hours (as published):\n• Monday–Saturday: 9:00 am – 6:00 pm\n• Sunday: closed");
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
  function nextWorkdays(n, k) {
    var out = [];
    for (var i = 1; out.length < k && i < 14; i++) {
      var dt = new Date(n.y, n.m, n.d + i), dow = dt.getDay();
      if ((H[dow] || []).length) {
        var dn = DIAS[lang][dow];
        out.push({ dow: dow, label: lang === "en" ? dn + ", " + MESES.en[dt.getMonth()] + " " + dt.getDate() : dn.charAt(0).toUpperCase() + dn.slice(1) + " " + dt.getDate() + " " + MESES.es[dt.getMonth()] });
      }
    }
    return out;
  }

  var STOP = ("a al algo algun alguna como con cual de del el en es esta este esto estoy hay la las lo los me mi mis o para pero por que quiero se si sin su sus te tu un una uno unos y ya yo usted ustedes tienen tiene puedo podria saber gustaria hola buenas buenos dias tardes noches favor " +
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
  var URG_CHIP = { a: "varado", get t() { return L("🚨 Truck down / Estoy varado", "🚨 Truck down / I'm stranded"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen", "📲 Call me back"); } };
  var PARK_CHIP = { a: "parking", get t() { return L("🅿️ Estacionamiento", "🅿️ Truck parking"); } };
  function aviso() { return L("🔔 El equipo del taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop team gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL() { return { t: L("Llamar ", "Call ") + C.tel, tel: C.telh }; }
  function SMS() { return { t: L("💬 Mandar un texto", "💬 Send a text"), url: "sms:" + C.telh, self: true }; }
  function MAIL() { return { t: L("✉️ Escribir un email", "✉️ Send an email"), url: "mailto:" + C.email, self: true }; }
  function MAPS() { return { t: L("Cómo llegar (Google Maps)", "Directions (Google Maps)"), url: C.maps }; }
  function STATUSP() { return { t: L("🔎 Track My Truck (estado)", "🔎 Track My Truck (status)"), url: pg("status.html", "status.html"), self: true }; }
  function OILP() { return { t: L("Ver paquetes de aceite", "See oil change packages"), url: pg("service-oil-changes.html", "service-oil-changes.html"), self: true }; }
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  function horarioA() {
    var n = nowTx();
    return horarioTxt() + "\n\n" + (isOpen(n)
      ? L("🟢 Ahora mismo está abierto (hasta las " + hm(closeAt(n)) + "): llama o manda un texto al " + C.tel + ".", "🟢 Open right now (until " + hm(closeAt(n)) + "): call or text " + C.tel + ".")
      : L("🌙 Ahora mismo está cerrado (abre " + nextOpening(n) + "). Yo te atiendo igual: deja tu presupuesto, tu cita, tu aviso de camión varado o tu «que me llamen» y el taller lo recibe al instante.",
        "🌙 Closed right now (opens " + nextOpening(n) + "). I can still help: leave your estimate, appointment, truck-down alert or call-back request and the shop gets it instantly."));
  }
  function serviciosA() {
    return L("Lo que publica el taller (solo camiones y tráileres, todas las marcas):\n• Reconstrucción de motores (in-frame y out-of-frame)\n• Cambios de aceite con paquetes según el motor\n• Frenos de aire: zapatas, tambores, ajustadores, S-cams, cámaras, fugas de aire y ABS\n• Reparación de tráiler: refrigerado, seco, plataforma y tanque\n• Transmisión y clutch: Eaton Fuller, Allison, Volvo I-Shift, Mack mDRIVE\n• Eléctrico y cableado, diagnóstico de ECM y sensores\n• AC de cabina y sistema de enfriamiento (radiador, bomba de agua, EGR)\n• Suspensión y dirección (bolsas de aire, kingpins, alineación)\n• Estacionamiento de camiones vigilado 24/7\nPresupuestos siempre gratis. ¿Qué le pasa a tu camión?",
      "What the shop lists (semi trucks and trailers only, all makes):\n• Engine overhauls (in-frame and out-of-frame)\n• Oil changes with engine-specific packages\n• Air brakes: shoes, drums, slack adjusters, S-cams, chambers, air leaks and ABS\n• Trailer repair: reefer, dry van, flatbed and tanker\n• Transmission and clutch: Eaton Fuller, Allison, Volvo I-Shift, Mack mDRIVE\n• Electrical & wiring, ECM and sensor diagnostics\n• Cab AC and cooling system (radiator, water pump, EGR)\n• Suspension & steering (air bags, kingpins, alignment)\n• Secure truck parking, monitored 24/7\nEstimates are always free. What's going on with your truck?");
  }
  function noListA() {
    return L("Ese servicio no aparece en su web, así que no te lo voy a asegurar. Para confirmarlo, llama o manda un texto al " + C.tel + ", o deja tu teléfono y te llaman.",
      "That service isn't listed on their website, so I won't promise it. To confirm, call or text " + C.tel + ", or leave your number and they'll call you.");
  }
  var SVC = Q("Servicios", "Services", "servicios", "services");
  var KB = [
    { id: "motor", k: ["motor", "reconstruccion", "overhaul", "rebuild", "in frame", "out of frame", "humo", "pierde fuerza", "pierde potencia", "golpeteo", "cascabeleo", "compresion", "inyector", "inyectores", "turbo", "consume aceite", "engine", "smoke", "loss of power", "knocking", "injector", "low compression", "blow by"],
      a: function () { return L("Sí: hacen reconstrucciones completas in-frame y out-of-frame para los principales motores diésel (pistones, anillos y camisas, cojinetes, juntas, culata, inyectores y turbo, bombas de aceite y agua, pruebas de compresión y dinamómetro). Señales que menciona su web: humo excesivo, pérdida de potencia con carga, golpeteo, consumo o fuga de aceite y arranque difícil. El presupuesto es gratis: ¿te lo dejo pedido?", "Yes: complete in-frame and out-of-frame rebuilds for all major diesel engines (pistons, rings and liners, bearings, gaskets, cylinder head, injectors and turbo, oil and water pumps, compression and dyno testing). Signs their site lists: excessive smoke, loss of power under load, knocking, burning or leaking oil and hard starts. Estimates are free: want me to request one?"); }, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "aceite", k: ["aceite", "cambio de aceite", "filtro", "filtros", "dd15", "isx", "isx15", "serie 60", "series 60", "mantenimiento", "oil", "oil change", "filter", "filters", "maintenance", "pm service"],
      a: function () { return L("Sí: cambio de aceite y filtros para servicio pesado con paquetes según el motor (Detroit DD15, Cummins ISX / ISX15 y Detroit Serie 60 12.7L) e inspección visual de cortesía. Los paquetes están publicados en su página de cambios de aceite; antes de reservar el taller confirma si el paquete aplica a tu camión y el total, y cualquier reparación extra necesita tu aprobación. ¿Otro motor? Llama al " + C.tel + ".", "Yes: heavy-duty oil and filter service with engine-specific packages (Detroit DD15, Cummins ISX / ISX15 and Detroit Series 60 12.7L) plus a complimentary visual inspection. The packages are listed on their Oil Changes page; before booking, the shop confirms the package fits your truck and your total, and any extra repair needs your approval. Other engine? Call " + C.tel + "."); }, c: [OILP, CITA_CHIP, TEL] },
    { id: "frenos", k: ["freno", "frenos", "frenos de aire", "zapatas", "tambor", "tambores", "balatas", "slack", "s cam", "camara de freno", "fuga de aire", "pierde aire", "presion de aire", "abs", "brake", "brakes", "air brake", "air brakes", "drum", "shoes", "chamber", "air leak", "air pressure"],
      a: function () { return L("Sí: frenos de aire completos para tractor y tráiler (zapatas y tambores, ajustadores de holgura, S-cams y bujes, cámaras de freno, diagnóstico de fugas de aire y ABS), con reparación el mismo día cuando es posible. Su web recuerda que las fallas de frenos son la infracción n.º 1 de fuera de servicio. ¿Te dejo pedido el presupuesto?", "Yes: complete air brake systems for tractors and trailers (shoes and drums, slack adjusters, S-cams and bushings, brake chambers, air leak diagnostics and ABS), repaired same-day when possible. Their site notes brake failure is the #1 out-of-service violation. Want me to request an estimate?"); }, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "trailer", k: ["trailer", "tráiler", "traila", "caja", "remolque", "reefer", "refrigerado", "dry van", "plataforma", "flatbed", "tanque", "patines", "landing gear", "luces", "7 way", "siete vias", "soldadura", "chasis", "puerta", "techo", "tanker", "lights", "welding", "frame", "door", "roof"],
      a: function () { return L("Sí: reparación completa de tráiler (seco, refrigerado, plataforma y tanque): soldadura de chasis y travesaños, luces y cableado 7 vías, patines (landing gear), suspensión y bolsas de aire, diagnóstico ABS, puertas y techo. Su web dice que, cuando es posible, lo cargas de nuevo el mismo día.", "Yes: full trailer repair (dry van, reefer, flatbed and tanker): frame and cross-member welding, lighting and 7-way wiring, landing gear, suspension and air bags, ABS diagnostics, doors and roof. Their site says you're loaded again the same day when possible."); }, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "transmision", k: ["transmision", "transmisión", "caja de cambios", "clutch", "embrague", "cloche", "eaton", "fuller", "allison", "i shift", "mdrive", "diferencial", "cardan", "cruceta", "no entra la velocidad", "se sale el cambio", "transmission", "gearbox", "differential", "driveline", "u joint", "hard shifting", "slipping"],
      a: function () { return L("Sí: reparación y reconstrucción de transmisiones manuales y automatizadas (Eaton Fuller, Allison, Volvo I-Shift, Mack mDRIVE y más): clutch, sincronizadores y engranes, diagnóstico del sistema de cambios, fluidos y filtro, diferencial, cardán y crucetas. ¿Te dejo pedido el presupuesto?", "Yes: repair and rebuilds for manual and automated transmissions (Eaton Fuller, Allison, Volvo I-Shift, Mack mDRIVE and more): clutch jobs, synchronizers and gears, shift-system diagnostics, fluid and filter, differential, driveline and U-joints. Want me to request an estimate?"); }, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "electrico", k: ["electrico", "eléctrico", "cableado", "bateria", "baterias", "alternador", "marcha", "arrancador", "no arranca", "no prende", "ecm", "sensor", "sensores", "codigo", "codigos", "check engine", "luces del tablero", "electrical", "wiring", "battery", "alternator", "starter", "won t start", "wont start", "no start", "fault code", "codes", "dash lights"],
      a: function () { return L("Sí: eléctrico y cableado para camiones Clase 8 modernos: prueba y cambio de baterías, alternador y marcha, reparación de arneses, diagnóstico de ECM y sensores, luces y 7 vías, sistema de carga y borrado de códigos. Su web dice que tienen equipo de diagnóstico que la mayoría de los servicios en ruta no tiene. Si el camión no arranca y estás varado, usa «🚨 Truck down».", "Yes: electrical and wiring for modern Class 8 trucks: battery testing and replacement, alternator and starter, wiring harness repair, ECM and sensor diagnostics, lighting and 7-way, charging system and fault code clearing. Their site says they have diagnostic equipment most roadside guys don't. If the truck won't start and you're stuck, tap \"🚨 Truck down\"."); }, c: [URG_CHIP, CITA_CHIP, LLAMADA_CHIP] },
    { id: "ac", k: ["aire acondicionado", "ac", "a c", "clima", "calor", "radiador", "bomba de agua", "anticongelante", "refrigerante", "se calienta", "temperatura", "egr", "fan clutch", "ventilador", "air conditioning", "radiator", "water pump", "coolant", "overheating", "overheat", "hot"],
      a: function () { return L("Sí: AC de cabina y sistema de enfriamiento en la misma visita: recarga y fugas de AC, compresor y condensador, radiador, bomba de agua, fan clutch, enfriador EGR y de aire de carga, y lavado de refrigerante. Señales que menciona su web: AC que tira aire tibio, temperatura que sube en subidas, refrigerante en el piso o vapor del motor.", "Yes: cab AC and cooling system in the same visit: AC recharge and leak repair, compressor and condenser, radiator, water pump, fan clutch, EGR and charge air cooler, and coolant flush. Signs their site lists: AC blowing warm, temp climbing on grades, coolant on the ground or steam from the engine."); }, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "suspension", k: ["suspension", "suspensión", "direccion", "dirección", "bolsas de aire", "bolsa de aire", "kingpin", "kingpins", "terminales", "barra de direccion", "amortiguadores", "muelles", "alineacion", "alineación", "se jala", "desgaste de llantas", "suspension", "steering", "air bag", "air bags", "tie rod", "drag link", "shocks", "springs", "alignment", "pulling", "tire wear"],
      a: function () { return L("Sí: suspensión y dirección de tractor y tráiler: bolsas de aire, kingpins y bujes, terminales y barra de dirección, amortiguadores y muelles, alineación delantera, caja de dirección y altura de manejo. Señales que menciona su web: el camión se va de lado, desgaste rápido o disparejo de llantas, golpes en los baches o juego en el volante.", "Yes: suspension and steering for tractor and trailer: air bags, kingpins and bushings, tie rods and drag links, shocks and springs, front-end alignment, steering box and ride height. Signs their site lists: wandering or pulling, fast or uneven tire wear, clunking over bumps or play in the steering wheel."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "parking", k: ["estacionamiento", "estacionar", "parking", "parquear", "parqueo", "dejar el camion", "dormir", "patio", "yarda", "spot", "spots", "lugar para", "park", "truck parking", "overnight", "yard", "layover"],
      a: function () { return L("Sí: estacionamiento de camiones en Houston TX 77028, vigilado y con monitoreo 24/7, acceso seguro con portón remoto y lugar para tractor + tráiler. Hay estadías cortas (escalas) y contratos largos para operadores y flotas. Disponibilidad y tarifas: su web pide consultarlas con el taller. ¿Te dejo pedida la consulta?", "Yes: truck parking in Houston TX 77028, secured and monitored 24/7, with secure remote gate access and room for tractor + trailer. Short stays for layovers and long-term contracts for owner-operators and fleets. Availability and rates: their site asks you to contact the shop. Want me to send the request?"); }, c: [PARK_CHIP, TEL, LLAMADA_CHIP] },
    { id: "status", k: ["estado", "como va", "como va mi camion", "ya esta listo", "esta listo", "mi camion", "seguimiento", "track", "track my truck", "status", "is my truck ready", "update", "repair status"],
      a: function () { return L("Su web tiene un portal «Track My Truck»: pones el mismo teléfono que dejaste al entregar el camión y ves el estado de la reparación. También puedes llamar o mandar un texto al " + C.tel + ".", "Their site has a \"Track My Truck\" portal: enter the same phone number you gave when you dropped off the truck and you'll see the repair status. You can also call or text " + C.tel + "."); }, c: [STATUSP, TEL, LLAMADA_CHIP] },
    { id: "auto", k: ["auto", "carro", "coche", "camioneta", "pickup", "pick up", "sedan", "suv", "car", "cars", "light duty", "f 150", "f150"],
      a: function () { return L("MCM trabaja solo en camiones de carga y tráileres: su web dice «sin autos, sin servicio liviano». Si tu unidad es un camión o tráiler, te dejo pedido el presupuesto.", "MCM works only on semi trucks and trailers: their site says \"no cars, no light duty\". If yours is a truck or trailer, I can request an estimate."); }, c: [CITA_CHIP, SVC] },
    { id: "nolist", k: ["grua", "grúa", "remolcar", "servicio en carretera", "auxilio", "mecanico a domicilio", "road service", "roadside", "mobile", "tow", "towing", "wrecker", "llanta", "llantas", "ponchadura", "tire", "tires", "flat tire", "dot", "inspeccion anual", "annual inspection", "pintura", "carroceria", "paint", "body work", "lavado", "wash"], a: function () { return noListA() + L("\nSi estás varado, igual te ayudo: usa «🚨 Truck down» y el taller recibe tu ubicación marcada urgente.", "\nIf you're stuck, I can still help: tap \"🚨 Truck down\" and the shop gets your location flagged urgent."); }, c: [URG_CHIP, TEL, LLAMADA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "services", "what do you fix", "what do you do", "repairs"], a: serviciosA, c: [CITA_CHIP, URG_CHIP, PARK_CHIP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "presupuesto gratis", "diagnostico gratis", "tarifa", "tarifas", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "free estimate", "free diagnosis"],
      a: function () { return L("Su web dice que los presupuestos son siempre gratis («sabes el precio antes de que toquemos nada») y que, si no sabes qué tiene el camión, llames para un diagnóstico gratis. Los precios dependen del trabajo; solo los paquetes de cambio de aceite están publicados en su página, y el taller confirma el total antes del servicio. Lo que sí hago: te dejo pedido el presupuesto con tu camión y la falla.", "Their site says estimates are always free (\"know the price before we touch anything\") and that if you're not sure what your truck needs, you can call for a free diagnosis. Prices depend on the job; only the oil change packages are listed on their page, and the shop confirms your total before service. What I can do: request an estimate with your truck and the problem."); }, c: [CITA_CHIP, OILP, LLAMADA_CHIP] },
    { id: "marcas", k: ["marca", "marcas", "freightliner", "cascadia", "kenworth", "peterbilt", "volvo", "mack", "international", "western star", "cummins", "detroit", "paccar", "make", "makes", "model", "models", "brand", "brands"],
      a: function () { return L("Trabajan en todas las marcas y modelos de camiones Clase 8: Freightliner, Kenworth, Peterbilt, Volvo, Mack, International, Western Star y más (en su web también aparecen Cummins, Detroit y PACCAR).", "They work on every major Class 8 make and model: Freightliner, Kenworth, Peterbilt, Volvo, Mack, International, Western Star and more (their site also shows Cummins, Detroit and PACCAR)."); }, c: [CITA_CHIP, SVC] },
    { id: "tiempo", k: ["cuanto tarda", "cuanto tiempo", "cuantos dias", "mismo dia", "hoy mismo", "rapido", "urge", "how long", "same day", "how fast", "quick", "turnaround"],
      a: function () { return L("Su web habla de entrega rápida («sabemos que el tiempo parado te cuesta dinero») y de reparar frenos y tráileres el mismo día cuando es posible. El plazo exacto te lo confirma el taller con el presupuesto.", "Their site talks about fast turnaround (\"we know downtime costs you money\") and same-day brake and trailer repairs when possible. The shop confirms the exact timing with your estimate."); }, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "idioma", k: ["espanol", "español", "hablan espanol", "ingles", "inglés", "spanish", "english", "speak spanish", "bilingue"],
      a: function () { return L("Sí, el equipo es bilingüe: «Se habla español». Aquí te atiendo en español o en inglés, como prefieras (botón EN arriba).", "Yes, the team is bilingual: English and Spanish (\"Se habla español\"). I can help you in English or Spanish (ES button at the top)."); }, c: [CITA_CHIP, URG_CHIP] },
    { id: "experiencia", k: ["experiencia", "anos", "años", "familia", "familiar", "confiable", "quienes son", "resenas", "reseñas", "flota", "flotas", "owner operator", "experience", "family", "since", "trust", "reviews", "fleet", "fleets", "who are you"],
      a: function () { return L("MCM Truck Service es un taller diésel familiar de Houston: más de 15 años en el negocio y más de 10,000 camiones reparados, según su web. Atienden operadores independientes y flotas de todo Estados Unidos (en sus reseñas un chofer cuenta que viene desde Nueva York).", "MCM Truck Service is a family-owned diesel shop in Houston: 15+ years in business and 10,000+ trucks repaired, per their site. They serve owner-operators and fleets from across the US (one review is from a driver who comes all the way from New York)."); }, c: [CITA_CHIP, SVC] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "lunes", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "direccion", k: ["donde", "dirección", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "green river", "houston", "address", "location", "where", "directions", "located"],
      a: function () { return L("📍 " + C.dir + ".\nSi quieres, te dejo pedida la cita desde aquí y el taller te confirma.", "📍 " + C.dir + ".\nI can request the appointment from here and the shop confirms."); }, c: [MAPS, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "teléfono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "hablar con alguien", "persona", "phone", "number", "call", "text", "contact", "talk to someone", "human"],
      a: function () { return L("Canales que publica el taller:\n• Teléfono (llamada o texto): " + C.tel + "\n• Email: " + C.email + "\nWhatsApp no figura en su web. O deja aquí tu teléfono y te llaman ellos.", "How to reach the shop (as published):\n• Phone (call or text): " + C.tel + "\n• Email: " + C.email + "\nWhatsApp isn't listed on their site. Or leave your number here and they'll call you."); }, c: [TEL, SMS, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: function () { return L("¡De nada! Si necesitas algo más, aquí estoy. 🚛", "You're welcome! I'm here if you need anything else. 🚛"); }, c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "agendar", "reservar", "revisar mi camion", "revisen", "llevar el camion", "appointment", "estimate", "quote", "book", "schedule", "bring my truck"];
  function bestIntent(text) {
    var ut = toks(text), best = null, bs = 0;
    if (!ut.length) return null;
    KB.forEach(function (e) {
      var s = 0; e.k.forEach(function (ph) { s = Math.max(s, phraseScore(ph, ut)); });
      if (s > bs) { bs = s; best = e; }
    });
    return bs > 0 ? { e: best, s: bs } : null;
  }
  function isPriceQ(n) { return /\b(precio|precios|cuesta|cuestan|cuanto sale|cuanto cobran|costo|caro|barato|tarifa|tarifas|price|prices|how much|cost|cheap|rates|\$)\b/.test(n); }
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { return phraseScore(ph, ut) > 0; }); }
  function isVarado(n) { return /varado|me quede tirado|quede tirado|me quede parado|se me descompuso|se descompuso|no arranca y|emergencia|urgente|truck down|broke down|broken down|stranded|stuck on|emergency|urgent/.test(n); }
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "truck", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|camion|trailer y)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|camion|precio|horario|donde|necesito|quiero|mi camion|gracias|cual)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) {
    return esc(s).replace(/\(346\) 256-1148/g, '<a href="tel:+13462561148">(346) 256-1148</a>')
      .replace(/contact@mcmtruckservice\.com/g, '<a href="mailto:contact@mcmtruckservice.com">contact@mcmtruckservice.com</a>');
  }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  function addNote(html) { var m = el("div", "r24-note", html); body.appendChild(m); scroll(); }
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
    else { status.className = "r24-status r24-closed"; status.textContent = L("🌙 Cerrado ahora (abre " + nextOpening(n) + ") · te atiendo igual y el taller recibe tu pedido", "🌙 Closed now (opens " + nextOpening(n) + ") · I'll still take your request"); }
  }
  function menuChips() { return [URG_CHIP, CITA_CHIP, SVC, Q("Horario y dirección", "Hours & address", "horario y direccion", "hours and address"), PARK_CHIP, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.nombre + " · Houston, TX";
    panel.querySelector(".r24-in").placeholder = L("Escribe tu pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · tus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    banner.textContent = L("Demo privada preparada para MCM Truck Service", "Private demo prepared for MCM Truck Service");
    panel.querySelector(".r24-human").textContent = L("👤 Hablar con una persona", "👤 Talk to a person");
  }
  function build() {
    var base = window.R24_BASE || "recepcion/";
    var css = document.createElement("link"); css.rel = "stylesheet"; css.href = base + "recepcion.css"; document.head.appendChild(css);
    banner = el("div", "r24-demo-banner"); banner.setAttribute("role", "note"); document.body.appendChild(banner);
    launch = el("button", "r24-launch", '<img class="r24-face" src="' + base + 'avatar.svg" alt="Recepcionista"><span class="r24-lt"></span><span class="r24-dot"></span>');
    launch.type = "button"; launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk")); document.body.appendChild(launch);
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
    if (announce) addBot(L("Perfecto, seguimos en español. ¿En qué te ayudo?", "Sure, let's continue in English. How can I help?"), flow ? [] : menuChips());
    if (flow && announce) setTimeout(function () { ask(flow.step); }, 600);
  }
  // R24-HUMANO-1018: siempre a la vista; nunca deja al cliente atrapado con el asistente
  function humano() {
    flow = null; addUser(L("👤 Hablar con una persona", "👤 Talk to a person"));
    var n = nowTx();
    addBot(isOpen(n) ? L("Claro. El taller está abierto ahora: llama o manda un texto al " + C.tel + " y te atiende una persona del equipo (hablan español e inglés). Si prefieres, te llaman ellos: me dejas tu nombre y teléfono.", "Sure. The shop is open now: call or text " + C.tel + " and a person on the team will help you (English and Spanish). Or they can call you: just leave your name and number.")
      : L("Claro. El taller está cerrado ahora (abre " + nextOpening(n) + "). Déjame tu nombre y teléfono y una persona del taller te llama; el pedido le llega al instante. Si tu camión está varado, toca «🚨 Truck down» y lo marco urgente.", "Sure. The shop is closed right now (opens " + nextOpening(n) + "). Leave your name and number and someone from the shop will call you; they get the request instantly. If your truck is down, tap \"🚨 Truck down\" and I'll flag it urgent."), [TEL(), SMS(), LLAMADA_CHIP, URG_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy la recepción virtual de MCM Truck Service (Houston, TX). Te ayudo si tu camión está varado, a pedir un presupuesto gratis o una cita, con el estacionamiento o con dudas de servicios y horario, a cualquier hora y sin esperar a que contesten el teléfono.\n¿En qué te ayudo?",
      "Hi! 👋 I'm the virtual front desk for MCM Truck Service (Houston, TX). I can help if your truck is down, set up a free estimate or appointment, handle truck parking, or answer questions about services and hours — any time, no waiting on the phone.\nHow can I help?"), menuChips());
  }
  function open(mode) {
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "varado" && !flow) setTimeout(function () { addUser(URG_CHIP.t); startVarado(); }, 450);
    if (mode === "cita" && !flow) setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }
  function opts(a) { return a.map(function (t) { return { t: t, v: t, flow: true }; }); }
  function UNIDAD() { return lang === "en" ? ["Tractor (semi truck)", "Trailer", "Tractor + trailer"] : ["Tractor (camión)", "Tráiler", "Tractor + tráiler"]; }
  function SINT() { return lang === "en" ? ["Engine / smoke / power loss", "Air brakes / air leak", "Won't start / electrical", "Trailer (lights, brakes, landing gear)", "Transmission / clutch", "AC / overheating", "Oil change", "Other"]
    : ["Motor / humo / pierde fuerza", "Frenos de aire / fuga de aire", "No arranca / eléctrico", "Tráiler (luces, frenos, patines)", "Transmisión / clutch", "AC / se calienta", "Cambio de aceite", "Otro"]; }
  function VAR() { return lang === "en" ? ["Won't start", "Air brakes / losing air", "Engine / overheating", "Trailer problem", "Other"]
    : ["No arranca", "Frenos de aire / pierde aire", "Motor / se calienta", "Problema del tráiler", "Otro"]; }
  function DONDE() { return lang === "en" ? ["I can drive it to the shop", "It's already at the shop / yard"] : ["Puedo llevarlo al taller", "Ya está en el taller / patio"]; }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function franjas() { var a = L("Mañana (9:00 am – 12:00 pm)", "Morning (9:00 am – 12:00 pm)"), b = L("Tarde (12:00 – 6:00 pm)", "Afternoon (12:00 – 6:00 pm)"), c = L("Me da igual", "Either is fine"); return opts([a, b, c]); }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos te dejo el pedido listo para el taller. (Escribe «cancelar» si quieres salir.)\n¿Qué necesitas?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Presupuesto gratis", "Free estimate"), L("Cita para traer el camión", "Appointment to bring the truck")]));
  }
  function startParking() {
    flow = { step: "plazo", d: { tipo: "parking" } };
    addBot(L("Perfecto: consulta de estacionamiento (vigilado 24/7, portón remoto, lugar para tractor + tráiler). Disponibilidad y tarifa te las confirma el taller.\n¿Por cuánto tiempo?", "Great: truck parking request (monitored 24/7, remote gate access, room for tractor + trailer). The shop confirms availability and rates.\nFor how long?"),
      opts([L("Corto plazo / escala", "Short stay / layover"), L("Largo plazo (mensual)", "Long-term (monthly)"), L("Flota (varias unidades)", "Fleet (several units)")]));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || L("Consulta general", "General question")).slice(0, 120) } };
    addBot(L("¡Claro! Te llama una persona del taller. Solo necesito dos datos.\n¿Cuál es tu nombre? (Escribe «cancelar» si quieres salir.)", "Sure! Someone from the shop will call you. I just need two things.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function alarma() { return L("⚠️ Primero tu seguridad: si estás en el acotamiento o en un carril, prende las intermitentes, pon los triángulos y mantente fuera del tráfico. Si hay heridos o peligro, llama al 911.", "⚠️ Safety first: if you're on the shoulder or in a lane, turn on your hazards, set out your triangles and stay clear of traffic. If anyone is hurt or you're in danger, call 911."); }
  function startVarado() {
    flow = { step: "urg", d: { tipo: "varado" } };
    var n = nowTx(), op = isOpen(n);
    addBot((op ? L("Vamos rápido. El taller está abierto ahora: lo más rápido es llamar al " + C.tel + ". Si no puedes llamar, te dejo aquí el aviso marcado URGENTE.",
      "Let's be quick. The shop is open now: the fastest is to call " + C.tel + ". If you can't call, I'll leave an URGENT alert here.")
      : L("Vamos rápido. El taller está cerrado ahora (abre " + nextOpening(n) + "), pero el taller recibe este aviso al instante, marcado URGENTE. También puedes intentar al " + C.tel + ".", "Let's be quick. The shop is closed now (opens " + nextOpening(n) + "), but the shop gets this alert instantly, flagged URGENT. You can also try " + C.tel + "."))
      + L("\n¿Qué le pasa al camión?", "\nWhat's wrong with the truck?"),
      opts(VAR()).concat([TEL()]));
  }
  function fotoRecibida(f) {
    var d = flow.d; d.foto = f.name.slice(0, 40);
    var m = el("div", "r24-msg r24-user r24-photo"); var im = new Image(); im.alt = "foto"; im.style.cssText = "max-width:160px;max-height:120px;display:block;border-radius:8px;margin-bottom:4px";
    try { im.src = URL.createObjectURL(f); } catch (e) {}
    m.appendChild(im); m.appendChild(document.createTextNode("📷 " + d.foto)); body.appendChild(m); scroll();
    var w = body.querySelectorAll(".r24-chips"); if (w.length) w[w.length - 1].remove();
    addBot(L("📷 Foto recibida (en esta demo no sale de tu teléfono).", "📷 Photo received (in this demo it never leaves your phone)."));
    setTimeout(function () { ask(d.tipo === "varado" ? "nombre" : "dia"); }, 600);
  }
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "unidad") addBot(L("¿Qué unidad es?", "Which unit is it?"), opts(UNIDAD()));
    else if (step === "vehiculo") addBot(L("¿Marca, modelo y motor si lo sabes? (por ejemplo: Freightliner Cascadia DD15, Utility reefer)", "Make, model and engine if you know it? (e.g. Freightliner Cascadia DD15, Utility reefer)"));
    else if (step === "sintoma") addBot(L("¿Qué falla tiene o qué trabajo necesitas?", "What's the problem, or what work do you need?"), opts(SINT()));
    else if (step === "lugar") addBot(d.tipo === "varado" ? L("📍 ¿Dónde estás exactamente? Autopista o calle, dirección, salida o milla, y ciudad (por ejemplo: I-610 salida 22, Houston).", "📍 Where are you exactly? Highway or street, direction, exit or mile marker, and city (e.g. I-610 exit 22, Houston).")
      : L("¿Dónde está el camión ahora? (ciudad o dirección; o elige una opción)", "Where's the truck now? (city or address; or pick an option)"), d.tipo === "varado" ? [] : opts(DONDE()));
    else if (step === "foto") addBot(L("¿Tienes una foto de la falla, del tablero o de la pieza? Ayuda al taller a preparar el presupuesto.", "Do you have a photo of the problem, the dash or the part? It helps the shop prepare the estimate."), FOTO());
    else if (step === "dia") addBot(L("¿Qué día te queda mejor? Lo anoto como preferencia y el taller te confirma la hora. Abren de lunes a sábado de 9:00 am a 6:00 pm.", "Which day works best? I'll note it as a preference and the shop confirms the time. They're open Monday–Saturday 9:00 am–6:00 pm."),
      opts(nextWorkdays(n, 5).map(function (x) { return x.label; })).concat(opts([L("Lo antes posible", "As soon as possible")])));
    else if (step === "franja") addBot(L("¿En qué franja?", "What time window?"), franjas());
    else if (step === "nombre") addBot(L("¿Cuál es tu nombre?", "What's your name?"));
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto, " + d.nombre + ". ¿A qué teléfono te llaman?", "Great, " + d.nombre + ". What number should they call?")
      : (d.tipo === "varado" ? L("¿A qué teléfono te llaman?", "What number should they call?") : L("Último paso: ¿a qué teléfono te llaman para confirmar?", "Last step: what number should they call to confirm?")));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revisa tu solicitud de llamada:\n👤 Nombre: ", "Please review your call-back request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      if (d.tipo === "varado") { addBot(L("Revisa tu aviso:\n🚨 Prioridad: URGENTE · camión varado", "Please review your alert:\n🚨 Priority: URGENT · truck down") + L("\n🔧 Falla: ", "\n🔧 Problem: ") + d.motivo + L("\n📍 Ubicación: ", "\n📍 Location: ") + d.lugar + L("\n🚛 Unidad: ", "\n🚛 Unit: ") + d.vehiculo + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + (isOpen(n) ? L("\n🟢 Taller abierto ahora", "\n🟢 Shop open now") : L("\n🌙 Taller cerrado (abre " + nextOpening(n) + "): lo recibe igual al instante", "\n🌙 Shop closed (opens " + nextOpening(n) + "): they still get it instantly")) + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      if (d.tipo === "parking") { addBot(L("Revisa tu consulta de estacionamiento:\n🅿️ Plazo: ", "Please review your parking request:\n🅿️ Term: ") + d.plazo + L("\n🚛 Unidad: ", "\n🚛 Unit: ") + d.unidad + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revisa tu solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚛 Unidad: ", "\n🚛 Unit: ") + d.unidad + " · " + d.vehiculo + L("\n🔧 Falla / trabajo: ", "\n🔧 Problem / job: ") + d.sintoma + L("\n📍 Dónde está: ", "\n📍 Where it is: ") + d.lugar + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
  function dowFromText(n) {
    var es = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"], en = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    for (var i = 0; i < 7; i++) if (new RegExp("\\b(" + es[i] + "|" + en[i] + ")\\b").test(n)) return i;
    return null;
  }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop|exit|quit)$/.test(n)) { flow = null; addBot(L("Sin problema, cancelé la solicitud. ¿Te ayudo con otra cosa?", "No problem, I've cancelled the request. Anything else?"), [URG_CHIP, CITA_CHIP, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "tipo": d.servicio = t.slice(0, 40); ask("unidad"); return;
      case "plazo": d.plazo = t.slice(0, 40); ask("unidad"); return;
      case "unidad": d.unidad = t.slice(0, 40); if (d.tipo === "parking") ask("nombre"); else ask("vehiculo"); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60); ask(d.tipo === "varado" ? "foto" : "sintoma"); return;
      case "sintoma":
        d.sintoma = t.slice(0, 100);
        if (isVarado(n)) addBot(L("Si el camión está varado ahora, también puedo dejar un aviso URGENTE («🚨 Truck down»). Sigo con el presupuesto.", "If the truck is down right now, I can also leave an URGENT alert (\"🚨 Truck down\"). Continuing with the estimate."));
        setTimeout(function () { ask("lugar"); }, isVarado(n) ? 700 : 0); return;
      case "lugar":
        if (t.length < 3) { ask("lugar"); return; }
        d.lugar = t.slice(0, 100); ask(d.tipo === "varado" ? "vehiculo" : "foto"); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask(d.tipo === "varado" ? "nombre" : "dia"); return;
      case "dia":
        d.dia = t.slice(0, 60);
        if (dowFromText(n) === 0 || /domingo|sunday/.test(n)) {
          addBot(L("Lo anoto, pero ojo: los domingos el taller está cerrado, así que te proponen el día hábil más cercano.", "Noted — but the shop is closed on Sundays, so they'll offer the closest open day."));
          setTimeout(function () { ask("franja"); }, 700); return;
        }
        ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask("nombre"); return;
      case "urg":
        d.motivo = t.slice(0, 80);
        addBot(alarma());
        setTimeout(function () { ask("lugar"); }, 900); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dices tu nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbelo con 10 cifras (con código de área), por ejemplo 713-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 713-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)"), now = nowTx();
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe tu pedido al instante y te llama al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will call you at " + d.telefono + ".") + DEMO, [URG_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          if (d.tipo === "varado") { addBot(L("¡Listo, " + nm2 + "! ✅ Tu aviso URGENTE ya está en el taller, con tu ubicación. Te llaman al " + d.telefono + (isOpen(now) ? "; si puedes, adelántate llamando al " + C.tel + "." : ". El taller está cerrado ahora (abre " + nextOpening(now) + "), pero lo recibe al instante.") + "\nSi hay heridos o peligro, no esperes: 911.",
            "All set, " + nm2 + "! ✅ Your URGENT alert is with the shop, including your location. They'll call you at " + d.telefono + (isOpen(now) ? "; if you can, call " + C.tel + " right away." : ". The shop is closed now (opens " + nextOpening(now) + "), but they get it instantly.") + "\nIf anyone is hurt or you're in danger, don't wait: call 911.") + DEMO, [TEL(), SMS()]); flow = null; return; }
          if (d.tipo === "parking") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe tu consulta de estacionamiento al instante y te llama al " + d.telefono + " con disponibilidad y tarifa.", "All set, " + nm2 + "! ✅ The shop gets your parking request instantly and will call you at " + d.telefono + " with availability and rates.") + DEMO, [MAPS(), Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Tu solicitud quedó registrada.\nEl taller te llama al " + d.telefono + " para confirmar el día y la hora (y el presupuesto gratis, si lo pediste). Más fotos: " + C.email + ".",
            "All set, " + nm2 + "! ✅ Your request is in.\nThe shop will call you at " + d.telefono + " to confirm the day and time (and your free estimate, if you asked for one). More photos: " + C.email + ".") + DEMO, [MAPS(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|editar|edit|change|^no\b/.test(n)) {
          var keep = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : { tipo: d.tipo };
          flow.d = keep; addBot(L("De acuerdo, empezamos de nuevo.", "OK, let's start over."));
          setTimeout(function () { if (keep.tipo === "llamada") ask("nombre"); else if (keep.tipo === "varado") { flow.step = "urg"; addBot(L("¿Qué le pasa al camión?", "What's wrong with the truck?"), opts(VAR())); } else if (keep.tipo === "parking") { flow.step = "plazo"; startParking(); } else { flow.d.servicio = d.servicio; ask("unidad"); } }, 500); return;
        }
        ask("resumen"); return;
    }
  }
  function reply(e) {
    var t = typeof e.a === "function" ? e.a() : e.a;
    addBot(t, (e.c || []).map(function (c) { if (typeof c === "function") c = c(); return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot(L("Eso te lo confirma mejor el taller, así tienes el dato exacto. 😊\nLlama o manda un texto al " + C.tel + ", escribe a " + C.email + ", o deja tu teléfono y te llaman ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall or text " + C.tel + ", email " + C.email + ", or leave your number and they'll call you."), [TEL, SMS, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot(L("Claro, ¿qué más quieres saber?", "Sure, what else would you like to know?"), [URG_CHIP, CITA_CHIP, SVC, Q("Cómo llegar", "Directions", "direccion", "address"), LLAMADA_CHIP]); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (chip && chip.a === "varado") { startVarado(); return; }
    if (chip && chip.a === "parking") { startParking(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué te puedo ayudar? Si tu camión está varado, toca «🚨 Truck down». También pido presupuestos gratis o citas, estacionamiento, y te cuento servicios y horario.", "Hi! How can I help? If your truck is down, tap \"🚨 Truck down\". I can also request free estimates or appointments, truck parking, and tell you about services and hours."), [URG_CHIP, CITA_CHIP, SVC, LLAMADA_CHIP]); return; }
    if (/^(horario y direccion|hours and address)$/.test(n)) { addBot(horarioA() + "\n\n📍 " + C.dir + ".", [MAPS, CITA_CHIP, LLAMADA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (isVarado(n) && !/\?/.test(t)) { startVarado(); return; }
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|quote|schedule/.test(n))) { startCita(); return; }
    if (price && !(bi && (bi.e.id === "nolist" || bi.e.id === "parking" || bi.e.id === "aceite"))) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, isOpen: isOpen, nowTx: nowTx, lang: function () { return lang; } } };
})();
