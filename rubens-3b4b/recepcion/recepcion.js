/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Ruben's Auto Repair & A/C Service (taller de autos, Aldine / North Houston TX 77032) — DEMO privada, bilingüe ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica rubensautorepairhouston.com (oct. 2026): Home, Services, las 6 páginas de servicio (con sus FAQ), About, Contact.
   - Dirección: 906 Aldine Bender Rd, Houston, TX 77032. Teléfono (832) 607-0968 (solo llamada: no publican texto/SMS, email ni WhatsApp).
   - Horario: la barra de arriba de todas las páginas dice «Mon-Fri: 8am - 6pm | Sat: 8am - 3pm»; Contact dice «MON – SAT: 8:00 AM – 6:00 PM · Sunday: Closed»;
     el pie dice «Call for today's hours». La demo usa el de la barra de arriba (L–V 8–6, S 8–3, domingo cerrado) y avisa la diferencia del sábado.
   - Desde 1993, familiar, 30+ años, «Hablamos Español», 4.1 en Google (63 reseñas, como muestra su web). Walk-ins: sin cita para diagnóstico.
   - La mayoría de marcas y modelos (nacionales e importados); se especializan en autos 2015 y anteriores (7–10+ años). A/C R-134a y 1234yf.
   - Zona: Aldine, North Houston, Humble, Spring, Greenspoint.
   Sin precios (su web no publica ninguno: diagnóstico primero, presupuesto exacto antes de trabajar, «Call for current pricing»), sin grúa, sin WhatsApp.
   Español en «usted», como los bloques en español de su web («llámenos—con gusto le atendemos»). */
(function () {
  "use strict";
  var C = {
    nombre: "Ruben's Auto Repair & A/C Service", corto: "Ruben's Auto Repair",
    tel: "(832) 607-0968", telh: "+18326070968",
    dir: "906 Aldine Bender Rd, Houston, TX 77032",
    maps: "https://maps.google.com/?q=906+Aldine+Bender+Rd,+Houston,+TX+77032"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  // Horario (minutos desde las 0:00, hora de Houston). 0 = domingo.
  var LV = [[480, 1080]], SA = [[480, 900]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 6: SA, 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller:\n• Lunes a viernes: 8:00 am – 6:00 pm\n• Sábado: 8:00 am – 3:00 pm\n• Domingo: cerrado\nOjo: en su página de Contacto el sábado figura hasta las 6:00 pm, así que si piensa ir un sábado por la tarde conviene llamar antes al " + C.tel + ".",
      "Shop hours (as published):\n• Monday–Friday: 8:00 am – 6:00 pm\n• Saturday: 8:00 am – 3:00 pm\n• Sunday: closed\nNote: their Contact page lists Saturday until 6:00 pm, so if you're planning a Saturday afternoon visit, call " + C.tel + " first.");
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

  var CITA_CHIP = { a: "cita", get t() { return L("📅 Presupuesto o cita", "📅 Estimate or appointment"); } };
  var AC_CHIP = { a: "ac", get t() { return L("❄️ El A/C no enfría", "❄️ A/C not cooling"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen", "📲 Call me back"); } };
  function aviso() { return L("🔔 El equipo del taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop team gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL() { return { t: L("Llamar al ", "Call ") + C.tel, tel: C.telh }; }
  function MAPS() { return { t: L("Cómo llegar (Google Maps)", "Directions (Google Maps)"), url: C.maps }; }
  function PAGE(es, en, url) { return function () { return { t: L(es, en), url: url, self: true }; }; }
  var ACP = PAGE("Ver la página de A/C", "See the A/C page", "service-air-conditioning.html");
  var COOLP = PAGE("Ver la página de enfriamiento", "See the Cooling System page", "service-cooling-system.html");
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("Servicios", "Services", "servicios", "services");
  var HOR = Q("Horario y dirección", "Hours & address", "horario y direccion", "hours and address");
  function horarioA() {
    var n = nowTx();
    return horarioTxt() + "\n\n" + (isOpen(n)
      ? L("🟢 Ahora mismo está abierto (hasta las " + hm(closeAt(n)) + "): puede llamar al " + C.tel + " o pasar sin cita para el diagnóstico.", "🟢 Open right now (until " + hm(closeAt(n)) + "): call " + C.tel + " or walk in for a diagnosis, no appointment needed.")
      : L("🌙 Ahora mismo está cerrado (abre " + nextOpening(n) + "). Igual le atiendo: deje aquí su pedido de presupuesto, su cita o su «que me llamen» y el taller lo recibe al instante.",
        "🌙 Closed right now (opens " + nextOpening(n) + "). I can still help: leave your estimate, appointment or call-back request here and the shop gets it instantly."));
  }
  function serviciosA() {
    return L("Lo que publica el taller (autos de uso diario, la mayoría de marcas nacionales e importadas):\n• ❄️ A/C y climatización (su especialidad): diagnóstico, recarga R-134a y 1234yf, fugas, compresor, condensador/evaporador, blower, calefacción\n• Enfriamiento / sobrecalentamiento: radiador, termostato, bomba de agua, ventiladores, lavado de refrigerante\n• Frenos: inspección, pastillas y discos, calipers y mangueras, líquido, luz de ABS\n• Check engine y manejo: escaneo OBD2, fallas de encendido, ralentí irregular, no arranca, combustible, eléctrico\n• Mantenimiento: aceite, filtros, correas y mangueras, batería/alternador/marcha, afinación\n• Suspensión y dirección: amortiguadores, rótulas, terminales, rodamientos, ejes CV, dirección hidráulica\n¿Qué le pasa a su carro?",
      "What the shop lists (everyday vehicles, most domestic and import makes):\n• ❄️ A/C & climate control (their specialty): diagnostics, R-134a and 1234yf recharge, leaks, compressor, condenser/evaporator, blower motor, heater\n• Cooling system / overheating: radiator, thermostat, water pump, cooling fans, coolant flush\n• Brakes: inspection, pads & rotors, calipers & hoses, fluid flush, ABS light\n• Check engine & drivability: OBD2 scanning, misfires, rough idle, no-start, fuel system, electrical\n• Maintenance: oil changes, filters, belts & hoses, battery/alternator/starter, tune-ups\n• Suspension & steering: shocks/struts, ball joints, tie rods, wheel bearings, CV axles, power steering\nWhat's going on with your vehicle?");
  }
  function noListA() {
    return L("Eso no aparece en la lista de su web, así que no se lo voy a asegurar. Su web dice: «¿No ve su problema en la lista? Probablemente lo hacemos: llámenos y cuéntenos». Llame al " + C.tel + " o déjeme su teléfono y le llaman ellos.",
      "That isn't on their website's list, so I won't promise it. Their site says: \"Not seeing your issue listed? We likely handle it. Give us a call.\" Call " + C.tel + " or leave your number and they'll call you.");
  }
  var KB = [
    { id: "refrigerante", k: ["r134a", "r 134a", "134a", "1234yf", "1234", "gas del aire", "freon", "freón", "refrigerante del aire", "refrigerant", "tipo de gas", "recarga", "recargar", "recharge", "carga de gas"],
      a: function () { return L("Trabajan los dos sistemas: R-134a (la mayoría de los autos anteriores a 2015–2017) y el 1234yf de los modelos más nuevos; no son intercambiables. Antes de cargar verifican el tipo correcto y la cantidad exacta para su vehículo. Una recarga simple lleva más o menos una hora. El precio depende del tipo de refrigerante y se lo dan exacto después del diagnóstico. Su web no recomienda los kits de recarga caseros.", "They service both: R-134a (most vehicles before 2015–2017) and the newer 1234yf; they aren't interchangeable. They verify the correct type and exact charge for your vehicle. A simple recharge takes about an hour. Price depends on the refrigerant type and you get an exact price after diagnosis. Their site doesn't recommend DIY recharge kits."); }, c: [AC_CHIP, CITA_CHIP, LLAMADA_CHIP] },
    { id: "ac", k: ["aire acondicionado", "aire", "a c", "ac", "clima", "climatizacion", "no enfria", "no enfría", "aire caliente", "tira aire caliente", "calor", "compresor", "condensador", "evaporador", "blower", "ventilacion", "mal olor", "olor", "agua en el piso", "calefaccion", "calefacción", "heater", "air conditioning", "a/c", "not cooling", "blowing hot", "warm air", "hot air", "compressor", "condenser", "evaporator", "musty smell", "smell", "weak airflow", "climate control"],
      a: function () { return L("Sí, es su especialidad: A/C completo para R-134a y 1234yf. Diagnóstico con prueba de presión y detección de fugas (tinte UV y electrónica), recarga, compresor, condensador y evaporador, blower y resistencia, calefacción y control de clima. Señales que menciona su web: aire tibio, ruidos al prender el A/C, olor a humedad, agua en el piso del pasajero, el compresor no engancha o sale poco aire. En la mayoría de los casos lo arreglan el mismo día (una recarga ~1 hora; un compresor, 3 a 5 horas). ¿Le dejo pedida la cita?", "Yes, it's their specialty: complete A/C for R-134a and 1234yf systems. Diagnostics with pressure testing and leak detection (UV dye and electronic), recharge, compressor, condenser and evaporator, blower motor and resistor, heater core and climate control. Signs their site lists: warm air, noises when the A/C kicks on, musty smell, water on the passenger floor, compressor clutch won't engage, weak airflow. Most of the time it's same-day (a recharge ~1 hour; a compressor 3–5 hours). Want me to set up the appointment?"); }, c: [AC_CHIP, ACP, LLAMADA_CHIP] },
    { id: "enfriamiento", k: ["se calienta", "calentando", "sobrecalent", "se calento", "temperatura", "radiador", "termostato", "bomba de agua", "anticongelante", "refrigerante", "coolant", "vapor", "humo blanco", "ventilador", "fan clutch", "overheat", "overheating", "running hot", "radiator", "thermostat", "water pump", "steam", "cooling fan", "temperature gauge"],
      a: function () { return L("Sí: enfriamiento y sobrecalentamiento (radiador, termostato, bomba de agua, ventiladores y fan clutch, lavado de refrigerante, fugas y calefacción que tira frío), con prueba de presión en cada trabajo y servicio el mismo día disponible.\n⚠️ Si ahora mismo la aguja está en rojo o sale vapor: oríllese en un lugar seguro y apague el motor; su web dice «oríllese con seguridad y llámenos» (" + C.tel + "). Calentarlo aunque sea una vez puede dañar el motor.", "Yes: cooling system and overheating (radiator, thermostat, water pump, cooling fans and fan clutch, coolant flush, leaks, heater blowing cold), with pressure testing on every job and same-day service available.\n⚠️ If the gauge is in the red or there's steam right now: pull over somewhere safe and shut the engine off; their site says \"pull over safely and call us\" (" + C.tel + "). Overheating even once can damage the engine."); }, c: [TEL, CITA_CHIP, COOLP] },
    { id: "frenos", k: ["freno", "frenos", "balatas", "pastillas", "discos", "rotores", "caliper", "chillan", "rechinan", "suena al frenar", "pedal suave", "abs", "luz de frenos", "brake", "brakes", "pads", "rotors", "calipers", "squeak", "squealing", "grinding", "soft pedal", "brake light"],
      a: function () { return L("Sí: inspección de frenos, pastillas y discos, calipers y mangueras, cambio de líquido y diagnóstico de la luz de ABS o de frenos, también en camionetas y SUV. Pastillas y discos llevan de 1,5 a 3 horas según el vehículo. Su web avisa: si rechina, conviene agendar pronto; si raspa (metal con metal), deje de manejarlo y hágalo revisar ya.", "Yes: brake inspection, pads and rotors, calipers and hoses, fluid flush and ABS / brake warning light diagnosis, on trucks and SUVs too. A pad-and-rotor job takes 1.5–3 hours depending on the vehicle. Their site warns: squeaking means schedule soon; grinding (metal on metal) means stop driving and get it inspected right away."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "checkengine", k: ["check engine", "luz del motor", "luz de motor", "luz check", "codigo", "codigos", "escaner", "escaneo", "obd2", "obd", "falla de encendido", "tironea", "se apaga", "ralenti", "tiembla", "no arranca", "no prende", "bateria se descarga", "electrico", "eléctrico", "inyectores", "bomba de gasolina", "sensor de oxigeno", "catalizador", "code", "codes", "scan", "misfire", "rough idle", "stalling", "won t start", "wont start", "no start", "electrical", "fuel pump", "injectors", "o2 sensor", "catalytic"],
      a: function () { return L("Sí: diagnóstico de la luz de check engine con escáner OBD2 profesional y datos en vivo, fallas de encendido, ralentí irregular o se apaga, no arranca, sistema de combustible, eléctrico (incluso batería que se descarga), encendido, sensores de oxígeno y catalizador. Buscan la causa real, no solo leen el código. Cobran un cargo de diagnóstico que normalmente se descuenta de la reparación si la hace con ellos (el monto actual se lo dan por teléfono). Si la luz parpadea: baje la velocidad y vaya al taller cuanto antes.", "Yes: check engine light diagnostics with pro OBD2 scanning and live data, misfires, rough idle or stalling, no-start, fuel system, electrical (including battery drains), ignition, O2 sensors and catalytic converter. They find the root cause, not just read the code. There's a diagnostic fee that's typically applied toward the repair if you have the work done there (they'll give you current pricing by phone). If the light is flashing: slow down and get to a shop as soon as possible."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "mantenimiento", k: ["aceite", "cambio de aceite", "sintetico", "filtro", "filtros", "afinacion", "afinación", "tune up", "bujias", "correa", "banda", "mangueras", "bateria", "batería", "alternador", "marcha", "plumillas", "luces", "mantenimiento", "oil", "oil change", "synthetic", "filter", "tune-up", "spark plugs", "belt", "serpentine", "hoses", "battery", "alternator", "starter", "wipers", "maintenance"],
      a: function () { return L("Sí: cambio de aceite convencional o sintético (con filtro y revisión de varios puntos), filtros de aire, aceite y cabina, correas y mangueras, prueba y cambio de batería, alternador y marcha, bujías y afinación, niveles de líquidos, plumillas y luces. Su web dice que para cambios de aceite y servicios rápidos puede llegar sin cita. Precios: no los publican; se los confirma el taller.", "Yes: conventional or synthetic oil changes (with filter and multi-point check), air, oil and cabin filters, belts and hoses, battery testing and replacement, alternator and starter, spark plugs and tune-ups, fluid top-offs, wipers and bulbs. Their site says walk-ins are welcome for oil changes and quick services. Prices aren't published; the shop confirms them."); }, c: [CITA_CHIP, HOR, LLAMADA_CHIP] },
    { id: "suspension", k: ["suspension", "suspensión", "direccion", "dirección", "amortiguadores", "rotulas", "rótulas", "terminales", "bujes", "rodamientos", "baleros", "flecha", "eje cv", "golpeteo", "suena en los baches", "se jala", "se va de lado", "desgaste de llantas", "direccion hidraulica", "shocks", "struts", "ball joint", "ball joints", "tie rod", "control arm", "wheel bearing", "cv axle", "clunk", "clunking", "pulls", "pulling", "uneven tire wear", "power steering", "steering"],
      a: function () { return L("Sí: revisión completa del tren delantero, amortiguadores y struts, rótulas, terminales, brazos de control y bujes, rodamientos de rueda, ejes y juntas CV, y fugas o bomba de dirección hidráulica. Señales que menciona su web: golpes en los baches, dirección floja, el carro se va de lado, desgaste disparejo de llantas o ruido al girar. Después de cambiar piezas de suspensión su web recomienda una alineación.", "Yes: complete front-end inspection, shocks and struts, ball joints, tie rods, control arms and bushings, wheel bearings, CV axles and joints, and power steering leaks or pumps. Signs their site lists: clunking over bumps, loose steering, pulling to one side, uneven tire wear or noise when turning. After suspension parts are replaced, their site recommends an alignment."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nolist", k: ["grua", "grúa", "remolque", "remolcar", "auxilio", "a domicilio", "mecanico a domicilio", "pintura", "carroceria", "hojalateria", "choque", "llantas nuevas", "llanta", "ponchada", "vidrios", "parabrisas", "transmision", "transmisión", "caja automatica", "motor completo", "inspeccion estatal", "tow", "towing", "mobile", "paint", "body work", "collision", "tires", "flat tire", "windshield", "transmission", "state inspection", "alignment", "alineacion", "alineación"], a: noListA, c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "services", "what do you fix", "what do you do", "repairs"], a: serviciosA, c: [AC_CHIP, CITA_CHIP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "presupuesto gratis", "diagnostico gratis", "tarifa", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "free estimate", "free diagnosis", "quote"],
      a: function () { return L("Su web no publica precios: primero diagnostican, le explican la reparación y el costo, y usted aprueba antes de que empiecen («sin sorpresas al recoger el vehículo»). Para la luz de check engine cobran un cargo de diagnóstico que normalmente se descuenta de la reparación. Para un precio actual le piden llamar al " + C.tel + ". Lo que sí hago: le dejo pedido el presupuesto con su vehículo y la falla.", "Their site doesn't publish prices: they diagnose first, explain the repair and the cost, and you approve before any work starts (\"no surprises when it's time to pick up your vehicle\"). For check engine lights there's a diagnostic fee that's typically applied toward the repair. For current pricing they ask you to call " + C.tel + ". What I can do: request an estimate with your vehicle and the problem."); }, c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "vehiculos", k: ["carro viejo", "carros viejos", "auto viejo", "autos viejos", "carro de modelo viejo", "old car", "older cars", "marca", "marcas", "modelo", "toyota", "honda", "nissan", "ford", "chevrolet", "chevy", "dodge", "hyundai", "kia", "importado", "americano", "camioneta", "troca", "pickup", "suv", "viejo", "modelo viejo", "año", "make", "makes", "model", "import", "domestic", "truck", "older car", "old car", "year"],
      a: function () { return L("Trabajan la mayoría de marcas y modelos, nacionales e importados, incluidas camionetas y SUV, y se especializan en mantener confiables los autos 2015 y anteriores (de 7 a 10+ años). En A/C atienden tanto los sistemas R-134a como los 1234yf de los modelos nuevos.", "They work on most makes and models, domestic and import, including trucks and SUVs, and they specialize in keeping 2015-and-older vehicles (7–10+ years) reliable. For A/C they handle both R-134a and the newer 1234yf systems."); }, c: [CITA_CHIP, AC_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llevarlo", "llegar sin cita", "hoy mismo", "mismo dia", "mismo día", "same day", "today", "now", "ahora", "without appointment", "drop by", "stop by"],
      a: function () { var n = nowTx(); return L("Su web dice que reciben sin cita para el diagnóstico (walk-ins) y que, si necesita un presupuesto de reparación para el mismo día, conviene llamar antes. En A/C, la mayoría de las reparaciones simples y recargas salen el mismo día.", "Their site says walk-ins are welcome, no appointment needed for diagnostics, and to call ahead if you need a same-day repair estimate. For A/C, most simple repairs and recharges are done the same day.") + "\n" + (isOpen(n) ? L("🟢 Ahora está abierto hasta las " + hm(closeAt(n)) + ".", "🟢 Open now until " + hm(closeAt(n)) + ".") : L("🌙 Ahora está cerrado (abre " + nextOpening(n) + ").", "🌙 Closed now (opens " + nextOpening(n) + ").")); }, c: [TEL, CITA_CHIP, MAPS] },
    { id: "tiempo", k: ["cuanto tarda", "cuanto tiempo", "cuantas horas", "cuantos dias", "rapido", "how long", "how fast", "turnaround", "quick"],
      a: function () { return L("Según las preguntas frecuentes de su web: recarga de A/C ~1 hora; compresor 3 a 5 horas; pastillas y discos 1,5 a 3 horas; un diagnóstico de check engine sencillo, menos de una hora. El tiempo exacto se lo dan después del diagnóstico.", "From their site's FAQs: A/C recharge ~1 hour; compressor 3–5 hours; pads and rotors 1.5–3 hours; a straightforward check engine diagnosis, under an hour. You get an exact time estimate after diagnosis."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "idioma", k: ["espanol", "español", "hablan espanol", "ingles", "inglés", "spanish", "english", "speak spanish", "bilingue"],
      a: function () { return L("Sí: «Hablamos Español». Su web dice: «Si necesita ayuda con su carro, llámenos—con gusto le atendemos en español». Aquí le atiendo en español o en inglés (botón EN arriba).", "Yes: \"Hablamos Español\" — they speak Spanish and English. I can help you in English or Spanish (ES button at the top)."); }, c: [CITA_CHIP, AC_CHIP] },
    { id: "experiencia", k: ["experiencia", "anos", "años", "desde cuando", "familia", "familiar", "confiable", "quienes son", "ruben", "rubén", "resenas", "reseñas", "calificacion", "google", "experience", "family", "since", "trust", "reviews", "rating", "who are you", "owner"],
      a: function () { return L("Ruben's Auto Repair & A/C Service es un taller familiar de Aldine desde 1993: más de 30 años en el negocio, con diagnóstico honesto, precios justos y presupuesto claro antes de empezar, según su web. Su web muestra 4.1 en Google (63 reseñas); varias cuentan arreglos de A/C a buen precio.", "Ruben's Auto Repair & A/C Service is a family-owned shop serving Aldine since 1993: 30+ years in business, honest diagnostics, fair pricing and a clear estimate before work starts, per their site. Their site shows a 4.1 Google rating (63 reviews); several mention A/C fixes at a fair price."); }, c: [CITA_CHIP, SVC] },
    { id: "zona", k: ["zona", "area", "aldine", "north houston", "humble", "spring", "greenspoint", "cerca", "queda lejos", "service area", "near", "nearby", "close to"],
      a: function () { return L("Están en " + C.dir + " y su web dice que atienden Aldine, North Houston, Humble, Spring, Greenspoint y alrededores.", "They're at " + C.dir + " and their site says they serve Aldine, North Houston, Humble, Spring, Greenspoint and surrounding communities."); }, c: [MAPS, CITA_CHIP] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "lunes", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, MAPS] },
    { id: "direccion", k: ["donde", "dirección", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "aldine bender", "address", "location", "where", "directions", "located"],
      a: function () { return L("📍 " + C.dir + " (Aldine / North Houston).\nSi quiere, le dejo pedida la cita desde aquí y el taller le confirma.", "📍 " + C.dir + " (Aldine / North Houston).\nI can request the appointment from here and the shop confirms."); }, c: [MAPS, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "teléfono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "phone", "number", "call", "text", "contact"],
      a: function () { return L("El canal que publica el taller es el teléfono: " + C.tel + ". En su web no figuran email, mensajes de texto ni WhatsApp (en Contacto hay un formulario «Send a Message»). O deje aquí su teléfono y le llaman ellos.", "The channel the shop publishes is the phone: " + C.tel + ". Their site doesn't list email, text or WhatsApp (the Contact page has a \"Send a Message\" form). Or leave your number here and they'll call you."); }, c: [TEL, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: function () { return L("¡Con gusto! Si necesita algo más, aquí estoy. 🚗", "You're welcome! I'm here if you need anything else. 🚗"); }, c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "agendar", "reservar", "turno", "revisar mi carro", "revisen", "llevar el carro", "appointment", "estimate", "book", "schedule", "bring my car"];
  function bestIntent(text) {
    var ut = toks(text), best = null, bs = 0;
    if (!ut.length) return null;
    KB.forEach(function (e) {
      var s = 0; e.k.forEach(function (ph) { s = Math.max(s, phraseScore(ph, ut)); });
      if (s > bs) { bs = s; best = e; }
    });
    return bs > 0 ? { e: best, s: bs } : null;
  }
  function scoreOf(ids, text) { var ut = toks(text), best = null, bs = 0; ids.forEach(function (id) { var e = byId(id), sc = 0; e.k.forEach(function (ph) { sc = Math.max(sc, phraseScore(ph, ut)); }); if (sc > bs) { bs = sc; best = e; } }); return bs >= 1 ? best : null; }
  function isPriceQ(n) { return /\b(precio|precios|cuesta|cuestan|cuanto sale|cuanto cobran|costo|caro|barato|tarifa|price|prices|how much|cost|cheap|rates|\$)\b/.test(n); }
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { return phraseScore(ph, ut) > 0; }); }
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i", "not"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|no enfria)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|precio|horario|donde|necesito|quiero|mi carro|gracias|cual|enfria|frenos)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/\(832\) 607-0968/g, '<a href="tel:+18326070968">(832) 607-0968</a>'); }
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
    else { status.className = "r24-status r24-closed"; status.textContent = L("🌙 Cerrado ahora (abre " + nextOpening(n) + ") · le atiendo igual y el taller recibe su pedido", "🌙 Closed now (opens " + nextOpening(n) + ") · I'll still take your request"); }
  }
  function menuChips() { return [AC_CHIP, CITA_CHIP, SVC, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Houston, TX";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    banner.textContent = L("Demo privada preparada para Ruben's Auto Repair", "Private demo prepared for Ruben's Auto Repair");
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
    if (announce) addBot(L("Perfecto, seguimos en español. ¿En qué le ayudo?", "Sure, let's continue in English. How can I help?"), flow ? [] : menuChips());
    if (flow && announce) setTimeout(function () { ask(flow.step); }, 600);
  }
  // R24-HUMANO-1018: siempre a la vista; nunca deja al cliente atrapado con el asistente
  function humano() {
    flow = null; addUser(L("👤 Hablar con una persona", "👤 Talk to a person"));
    var n = nowTx();
    addBot(isOpen(n) ? L("Claro. El taller está abierto ahora: llame al " + C.tel + " y le atiende una persona del equipo (hablan español). Si prefiere, le llaman ellos: déjeme su nombre y teléfono.", "Sure. The shop is open now: call " + C.tel + " and a person on the team will help you (they speak English and Spanish). Or they can call you: just leave your name and number.")
      : L("Claro. El taller está cerrado ahora (abre " + nextOpening(n) + "). Déjeme su nombre y teléfono y una persona del taller le llama; el pedido le llega al instante.", "Sure. The shop is closed right now (opens " + nextOpening(n) + "). Leave your name and number and someone from the shop will call you; they get the request instantly."), [TEL(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy la recepción virtual de Ruben's Auto Repair & A/C Service (Aldine, Houston). Le ayudo a pedir una cita o un presupuesto, con el A/C que no enfría o con dudas de servicios y horario, a cualquier hora y sin esperar a que contesten el teléfono.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the virtual front desk for Ruben's Auto Repair & A/C Service (Aldine, Houston). I can set up an appointment or estimate, help with an A/C that isn't cooling, or answer questions about services and hours — any time, no waiting on the phone.\nHow can I help?"), menuChips());
  }
  function open(mode) {
    if (mode === "es") { if (lang !== "es") { lang = "es"; headTexts(); } mode = null; }
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "ac" && !flow) setTimeout(function () { addUser(AC_CHIP.t); startAC(); }, 450);
    if (mode === "cita" && !flow) setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }
  function opts(a) { return a.map(function (t) { return { t: t, v: t, flow: true }; }); }
  function SINT() { return lang === "en" ? ["A/C / heat", "Overheating / coolant", "Brakes", "Check engine / won't start", "Oil change / maintenance", "Suspension / steering", "Other"]
    : ["A/C / calefacción", "Se calienta / refrigerante", "Frenos", "Check engine / no arranca", "Aceite / mantenimiento", "Suspensión / dirección", "Otro"]; }
  function ACSINT() { return lang === "en" ? ["Blowing warm air", "Noise when the A/C runs", "Musty smell", "Water on passenger floor", "Weak airflow", "Compressor won't engage", "Other / not sure"]
    : ["Tira aire tibio o caliente", "Hace ruido con el A/C", "Huele a humedad", "Agua en el piso del pasajero", "Sale poco aire", "El compresor no engancha", "Otro / no sé"]; }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function franjas(dow) {
    var sat = dow === 6, a = L("Mañana (8:00 am – 12:00 pm)", "Morning (8:00 am – 12:00 pm)"),
      b = sat ? L("Mediodía (12:00 – 3:00 pm)", "Midday (12:00 – 3:00 pm)") : L("Tarde (12:00 – 6:00 pm)", "Afternoon (12:00 – 6:00 pm)"), c = L("Me da igual", "Either is fine");
    return opts([a, b, c]);
  }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Presupuesto (diagnóstico primero)", "Estimate (diagnosis first)"), L("Cita para llevar el carro", "Appointment to bring the car")]));
  }
  function startAC() {
    flow = { step: "acsint", d: { tipo: "cita", servicio: L("A/C y climatización", "A/C & climate control"), ac: true } };
    addBot(L("Vamos con el A/C, que es su especialidad (R-134a y 1234yf). En la mayoría de los casos lo arreglan el mismo día. (Escriba «cancelar» si quiere salir.)\n¿Qué nota?", "Let's look at your A/C — it's their specialty (R-134a and 1234yf). Most of the time it's fixed the same day. (Type \"cancel\" to exit.)\nWhat are you noticing?"), opts(ACSINT()));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || L("Consulta general", "General question")).slice(0, 120) } };
    addBot(L("¡Claro! Le llama una persona del taller. Solo necesito dos datos.\n¿Cuál es su nombre? (Escriba «cancelar» si quiere salir.)", "Sure! Someone from the shop will call you. I just need two things.\nWhat's your name? (Type \"cancel\" to exit.)"));
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
  function refriNote(v) {
    var y = (v.match(/\b(19[89]\d|20[0-3]\d)\b/) || [])[1]; if (!y) return "";
    y = +y; if (y <= 2014) return L("Por el año, lo más probable es que use R-134a; igual el taller verifica el tipo antes de cargar.", "Given the year, it most likely uses R-134a; the shop verifies the type before charging.");
    if (y >= 2018) return L("Por el año, probablemente use el refrigerante 1234yf; lo trabajan también.", "Given the year, it probably uses 1234yf refrigerant; they handle that too.");
    return L("Los modelos 2015–2017 pueden traer R-134a o 1234yf; el taller verifica cuál y trabaja los dos.", "2015–2017 models can have R-134a or 1234yf; the shop checks which one and services both.");
  }
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del vehículo? (por ejemplo: 2012 Honda Accord)", "Year, make and model? (e.g. 2012 Honda Accord)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesita?", "What's going on, or what service do you need?"), opts(SINT()));
    else if (step === "acsint") addBot(L("¿Qué nota en el A/C?", "What are you noticing with the A/C?"), opts(ACSINT()));
    else if (step === "foto") addBot(L("¿Tiene una foto (del tablero, de una fuga o de la pieza)? Es opcional y ayuda al taller a preparar el presupuesto.", "Do you have a photo (dash lights, a leak or the part)? It's optional and helps the shop prepare the estimate."), FOTO());
    else if (step === "dia") {
      var days = nextWorkdays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia y el taller le confirma la hora. Abren de lunes a viernes de 8:00 am a 6:00 pm y el sábado de 8:00 am a 3:00 pm.", "Which day works best? I'll note it as a preference and the shop confirms the time. They're open Monday–Friday 8:00 am–6:00 pm and Saturday 8:00 am–3:00 pm."),
        opts(days.map(function (x) { return x.label; })).concat(opts([L("Lo antes posible", "As soon as possible")])));
    }
    else if (step === "franja") addBot(d.dow === 6 ? L("¿En qué franja? (el sábado cierran a las 3:00 pm)", "What time window? (Saturday they close at 3:00 pm)") : L("¿En qué franja?", "What time window?"), franjas(d.dow));
    else if (step === "nombre") addBot(L("¿Cuál es su nombre?", "What's your name?"));
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto, " + d.nombre + ". ¿A qué teléfono le llaman?", "Great, " + d.nombre + ". What number should they call?") : L("Último paso: ¿a qué teléfono le llaman para confirmar?", "Last step: what number should they call to confirm?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revise su solicitud de llamada:\n👤 Nombre: ", "Please review your call-back request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Vehículo: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n🔧 Qué le pasa: ", "\n🔧 Problem: ") + d.sintoma + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
  function dowFromText(n) {
    var es = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"], en = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    for (var i = 0; i < 7; i++) if (new RegExp("\\b(" + es[i] + "|" + en[i] + ")\\b").test(n)) return i;
    return null;
  }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop|exit|quit)$/.test(n)) { flow = null; addBot(L("Sin problema, cancelé la solicitud. ¿Le ayudo con otra cosa?", "No problem, I've cancelled the request. Anything else?"), [CITA_CHIP, AC_CHIP, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "tipo":
        d.servicio = t.slice(0, 40);
        addBot(L("Bien. Dato de su web: para el diagnóstico también puede llegar sin cita (walk-ins).", "Got it. From their site: walk-ins are also welcome for diagnostics, no appointment needed."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "acsint": d.sintoma = "A/C: " + t.slice(0, 80); ask("vehiculo"); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60);
        if (d.ac) { var rn = refriNote(t); if (rn) { addBot("❄️ " + rn); setTimeout(function () { ask("foto"); }, 700); return; } ask("foto"); return; }
        ask("sintoma"); return;
      case "sintoma":
        d.sintoma = t.slice(0, 100);
        if (/calienta|overheat|refrigerante|coolant/.test(n)) { addBot(L("⚠️ Si se está calentando ahora mismo, no siga manejando: oríllese y apague el motor; si puede, llame al " + C.tel + ". Sigo con su pedido.", "⚠️ If it's overheating right now, don't keep driving: pull over and shut the engine off; if you can, call " + C.tel + ". Continuing with your request.")); setTimeout(function () { ask("foto"); }, 800); return; }
        ask("foto"); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60);
        d.dow = flow.days && flow.days[t] != null ? flow.days[t] : dowFromText(n);
        if (d.dow === 0) {
          addBot(L("Lo anoto, pero ojo: los domingos el taller está cerrado, así que le proponen el día hábil más cercano.", "Noted — but the shop is closed on Sundays, so they'll offer the closest open day."));
          setTimeout(function () { ask("franja"); }, 700); return;
        }
        ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask("nombre"); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dice su nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (con código de área), por ejemplo 832-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 832-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)");
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le llama al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will call you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su solicitud quedó registrada.\nEl taller le llama al " + d.telefono + " para confirmar el día y la hora; el precio se lo dan después del diagnóstico, antes de empezar cualquier trabajo.", "All set, " + nm2 + "! ✅ Your request is in.\nThe shop will call you at " + d.telefono + " to confirm the day and time; you get the price after diagnosis, before any work starts.") + DEMO, [MAPS(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|editar|edit|change|^no\b/.test(n)) {
          var keep = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : { tipo: d.tipo, servicio: d.servicio, ac: d.ac };
          flow.d = keep; addBot(L("De acuerdo, empezamos de nuevo.", "OK, let's start over."));
          setTimeout(function () { if (keep.tipo === "llamada") ask("nombre"); else if (keep.ac) ask("acsint"); else ask("vehiculo"); }, 500); return;
        }
        ask("resumen"); return;
    }
  }
  function reply(e) {
    var t = typeof e.a === "function" ? e.a() : e.a;
    addBot(t, (e.c || []).map(function (c) { if (typeof c === "function") c = c(); return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot(L("Eso se lo confirma mejor el taller, así tiene el dato exacto. 😊\nLlame al " + C.tel + " o déjeme su teléfono y le llaman ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall " + C.tel + " or leave your number and they'll call you."), [TEL, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot(L("Claro, ¿qué más quiere saber?", "Sure, what else would you like to know?"), [AC_CHIP, CITA_CHIP, SVC, HOR, LLAMADA_CHIP]); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "ac") { startAC(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué le puedo ayudar? Le pido citas o presupuestos, le ayudo con el A/C y le cuento servicios y horario.", "Hi! How can I help? I can request appointments or estimates, help with your A/C, and tell you about services and hours."), [AC_CHIP, CITA_CHIP, SVC, LLAMADA_CHIP]); return; }
    if (/^(horario y direccion|hours and address)$/.test(n)) { addBot(horarioA() + "\n\n📍 " + C.dir + ".", [MAPS, CITA_CHIP, LLAMADA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (/\bsin cita\b|walk ?in|without (an )?appointment|no appointment/.test(n)) { reply(byId("walkin")); return; }
    if (price) { var sp = scoreOf(["refrigerante", "checkengine", "nolist"], t); if (sp) { reply(sp); return; } }
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|schedule|book/.test(n))) { if (bi && (bi.e.id === "ac" || bi.e.id === "refrigerante")) startAC(); else startCita(); return; }
    if (price && !(bi && (bi.e.id === "nolist" || bi.e.id === "refrigerante" || bi.e.id === "checkengine"))) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, isOpen: isOpen, nowTx: nowTx, lang: function () { return lang; } } };
})();
