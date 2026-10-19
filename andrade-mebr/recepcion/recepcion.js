/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Andrade Car Service Miami (taller de autos, Hialeah Gardens FL 33018) — DEMO privada, bilingüe EN/ES.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica andradecarservice.com (oct. 2026): Home, About Us, Contact y las 9 páginas de servicio.
   - Dirección: arriba y en About/Contact «11750 NW 87 CT BAY 4, Hialeah Garden FL. 33018»; en el pie de la home «11750 NW 87th Pl STE 4 | Hialeah, FL 33018».
     La demo usa la de arriba y menciona la del pie.
   - Teléfono +1 786-917-9032 (los botones «Contact Whatsapp» van a wa.me/17869179032: es su WhatsApp). Email info@andradecarservice.com.
     No publican SMS. El icono de WhatsApp del encabezado de su web va a wa.me/5491131715636 (Argentina): en la demo abre esta recepción con una nota.
   - Horario: arriba de las 11 páginas internas «Monday to Friday 7 a.m. 6 p.m.»; en el panel «Contact Info» de la home (sin botón que lo abra)
     «Monday to Saturday : 6.00 am - 10.00 pm» (es el mismo horario de ejemplo de la plantilla: «Mon - Tues : 6.00 am - 10.00 pm»).
     La demo usa L–V 7:00–6:00 pm, avisa la diferencia y deja sábado y domingo como «a confirmar con el taller».
   - Desde 1968, empresa familiar, «50 years serving automobiles», Gustavo Andrade (CEO), «quality, not quantity», «Hablamos español».
   - Servicios: diagnóstico electrónico, servicio y chequeos (plan del fabricante), fallas eléctricas y electrónicas (módulos, fusiblera, ECU, BSI/BSM/BCM,
     inmovilizador, arranque), transmisiones automáticas/robotizadas/electrónicas, cadena y correa de distribución, híbridos y eléctricos (técnicos certificados,
     «Expert for 10 years»), frenos, ABS, limpieza de inyectores por ultrasonido; «Experts in High-End Engines».
   Sin precios (su web no publica ninguno: presupuesto personalizado que se acuerda con el cliente), sin grúa, sin A/C, sin chapa/pintura, sin llantas.
   Español en «usted» (Florida). */
(function () {
  "use strict";
  var C = {
    nombre: "Andrade Car Service Miami", corto: "Andrade Car Service",
    tel: "786-917-9032", telh: "+17869179032", wa: "https://wa.me/17869179032", mail: "info@andradecarservice.com",
    dir: "11750 NW 87 Ct, Bay 4, Hialeah Garden, FL 33018", dir2: "11750 NW 87th Pl STE 4, Hialeah, FL 33018",
    maps: "https://maps.google.com/?q=Andrade+Car+Service+Miami+LLC,+11750+NW+87th+Pl,+Hialeah,+FL+33018"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  // Horario (minutos desde las 0:00, hora de Miami). 0 = domingo. Sábado y domingo no figuran en el horario de arriba de su web.
  var LV = [[420, 1080]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 6: [], 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller (arriba en todas sus páginas internas):\n• Lunes a viernes: 7:00 am – 6:00 pm\n• Sábado y domingo: no figuran en ese horario\nOjo: un panel de su página principal dice «lunes a sábado de 6:00 am a 10:00 pm», así que si piensa ir un sábado o después de las 6 conviene confirmarlo antes con el taller al " + C.tel + ".",
      "Shop hours (shown at the top of all their inner pages):\n• Monday–Friday: 7:00 am – 6:00 pm\n• Saturday and Sunday: not listed in those hours\nNote: a panel on their homepage says \"Monday to Saturday 6:00 am – 10:00 pm\", so if you're planning a Saturday or after-6 visit, check with the shop first at " + C.tel + ".");
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
  var HIB_CHIP = { a: "hibrido", get t() { return L("🔋 Híbrido o eléctrico", "🔋 Hybrid or electric"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen", "📲 Call me back"); } };
  function aviso() { return L("🔔 El equipo del taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop team gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL() { return { t: L("Llamar al ", "Call ") + C.tel, tel: C.telh }; }
  function WA() { return { t: "WhatsApp " + C.tel, url: C.wa, wa: true }; }
  function MAIL() { return { t: "✉️ " + C.mail, url: "mailto:" + C.mail, self: true }; }
  function MAPS() { return { t: L("Cómo llegar (Google Maps)", "Directions (Google Maps)"), url: C.maps }; }
  function PAGE(es, en, url) { return function () { return { t: L(es, en), url: url, self: true }; }; }
  var HIBP = PAGE("Ver la página de híbridos", "See the hybrid & electric page", "motores-hibridos-y-electricos.html");
  var SERVP = PAGE("Ver «Service and checks»", "See \"Service and checks\"", "servicioychequeo.html");
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & address", "horario y direccion", "hours and address");
  function estadoLinea(n) {
    return isOpen(n)
      ? L("🟢 Ahora mismo está abierto (hasta las " + hm(closeAt(n)) + "): puede llamar al " + C.tel + " o escribirles por WhatsApp a ese mismo número.", "🟢 Open right now (until " + hm(closeAt(n)) + "): call " + C.tel + " or message them on WhatsApp at that same number.")
      : L("🌙 Ahora mismo está fuera del horario publicado (abre " + nextOpening(n) + "). Igual le atiendo: deje aquí su pedido de presupuesto, su cita o su «que me llamen» y el taller lo recibe al instante.",
        "🌙 Outside their posted hours right now (opens " + nextOpening(n) + "). I can still help: leave your estimate, appointment or call-back request here and the shop gets it instantly.");
  }
  function horarioA() { return horarioTxt() + "\n\n" + estadoLinea(nowTx()); }
  function dirA() {
    return L("📍 " + C.dir + " (así figura arriba en su web; en el pie de la página principal aparece como «" + C.dir2 + "»).", "📍 " + C.dir + " (as shown at the top of their site; the homepage footer lists it as \"" + C.dir2 + "\").");
  }
  function serviciosA() {
    return L("Lo que publica el taller:\n• Diagnóstico electrónico (escaneo y revisión de inyección, ABS, airbags, control de estabilidad y computadora de a bordo)\n• Servicio y chequeos según el plan del fabricante\n• Fallas eléctricas y electrónicas: módulos, fusiblera, ECU, BSI/BSM/BCM, inmovilizador, fallas de arranque\n• Transmisiones automáticas, robotizadas y de control electrónico\n• Cadena y correa de distribución\n• 🔋 Híbridos y eléctricos (técnicos certificados)\n• Frenos y sistema ABS\n• Limpieza de inyectores con equipo de ultrasonido\nAdemás dicen ser «expertos en motores de alta gama». ¿Qué le pasa a su auto?",
      "What the shop lists:\n• Electronic diagnosis (scan and check of fuel injection, ABS, airbags, stability control and on-board computer)\n• Service and checks following the manufacturer's schedule\n• Electrical and electronic failures: modules, fuse box, ECU, BSI/BSM/BCM, immobilizer, no-start\n• Automatic, robotic and electronically controlled transmissions\n• Timing chain and belt\n• 🔋 Hybrids and electrics (certified technicians)\n• Brakes and ABS\n• Gasoline injector cleaning with ultrasound equipment\nThey also say they're \"Experts in High-End Engines\". What's going on with your car?");
  }
  function noListA() {
    return L("Eso no aparece entre los servicios de su web, así que no se lo voy a asegurar. Llame al " + C.tel + " (o escríbales por WhatsApp a ese número) o déjeme su teléfono y le llaman ellos.",
      "That isn't among the services on their website, so I won't promise it. Call " + C.tel + " (or WhatsApp that number) or leave your number and they'll call you.");
  }
  var KB = [
    { id: "hibrido", k: ["hibrido", "híbrido", "hibridos", "electrico", "auto electrico", "carro electrico", "vehiculo electrico", "bateria hibrida", "bateria del hibrido", "alto voltaje", "carga", "cargador", "autonomia", "hybrid", "hybrids", "electric", "electric car", "ev", "hybrid battery", "high voltage", "charging", "range", "plug in"],
      a: function () { return L("Sí, es una de sus especialidades: su web dice «We are specialists in Hybrid and Electric Cars», con técnicos certificados para el diagnóstico, la reparación y el servicio de autos híbridos y eléctricos, el equipo y la experiencia necesarios («Expert for 10 years», personal especializado en híbridos). ¿Le dejo pedido el presupuesto o la cita?", "Yes, it's one of their specialties: their site says \"We are specialists in Hybrid and Electric Cars\", with certified technicians for diagnosis, repair and service of hybrid and electric vehicles, plus the equipment and experience needed (\"Expert for 10 years\", personnel specialized in hybrid cars). Want me to request an estimate or appointment?"); }, c: [HIB_CHIP, HIBP, LLAMADA_CHIP] },
    { id: "diagnostico", k: ["diagnostico", "diagnóstico", "escaner", "escaneo", "scanner", "check engine", "luz del motor", "luz de motor", "luz en el tablero", "testigo", "codigo", "codigos", "computadora", "airbag", "bolsa de aire", "control de estabilidad", "inyeccion electronica", "diagnosis", "diagnostic", "scan", "code", "codes", "warning light", "dash light", "dashboard light", "stability control", "on board computer"],
      a: function () { return L("Sí: diagnóstico electrónico con equipos y herramientas modernos, «para no dejar nada librado al azar». Como parte del servicio estándar revisan los sistemas eléctricos y electrónicos: inyección electrónica, frenos ABS, airbags, control de estabilidad y computadora de a bordo. Su proceso: 1) anotan lo que usted necesita, 2) diagnóstico computarizado y visual, 3) presupuesto y trabajo, 4) entrega.", "Yes: electronic diagnosis with modern equipment and tools, \"leaving nothing to chance\". As part of the standard service they verify the electrical and electronic systems: electronic fuel injection, ABS brakes, airbags, stability control and the on-board computer. Their process: 1) they note your requirement, 2) computerized and visual diagnosis, 3) budget and work, 4) delivery."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "electrico", k: ["falla electrica", "fallas electricas", "electrico del auto", "corto", "fusible", "fusibles", "fusiblera", "modulo", "módulo", "ecu", "bsi", "bsm", "bcm", "inmovilizador", "no arranca", "no prende", "no enciende", "arranque", "electrical", "electrical failure", "fuse", "fuse box", "module", "immobilizer", "won t start", "wont start", "no start", "starting problem"],
      a: function () { return L("Sí: son especialistas en fallas eléctricas y electrónicas. Usan tecnología y equipos especializados para diagnosticar y reparar todos los componentes eléctricos y electrónicos: módulos de programa, fusiblera, ECU, BSI/BSM/BCM, inmovilizador y fallas de arranque, entre otros.", "Yes: they specialize in electrical and electronic failures, with specialized technology and equipment to diagnose and repair all electrical and electronic components: program modules, fuse box, ECU, BSI/BSM/BCM, immobilizer and starting problems, among others."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "transmision", k: ["transmision", "transmisión", "caja automatica", "caja de cambios", "cambios", "patina", "no cambia", "robotizada", "transmission", "gearbox", "shifting", "slipping", "won t shift", "robotic"],
      a: function () { return L("Sí: se especializan en el mantenimiento y la reparación de transmisiones automáticas, robotizadas y de control electrónico. Su web recalca que el diagnóstico preventivo y el mantenimiento son clave para que la transmisión funcione bien y el auto no pierda valor.", "Yes: they specialize in maintenance and repair of automatic, robotic and electronically controlled transmissions. Their site stresses that preventive diagnosis and maintenance keep the transmission working well and protect the vehicle's value."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "distribucion", k: ["correa de distribucion", "cadena de distribucion", "distribucion", "correa", "cadena", "timing belt", "timing chain", "timing"],
      a: function () { return L("Sí: hacen el reemplazo completo de la distribución (cadena y correa), para proteger lo más valioso del vehículo: el motor.", "Yes: they do complete timing replacement (chain and belt) to protect the most valuable part of your vehicle: the engine."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "frenos", k: ["freno", "frenos", "pastillas", "balatas", "discos", "abs", "luz del abs", "rechinan", "chillan", "brake", "brakes", "pads", "rotors", "abs light", "squeak", "grinding"],
      a: function () { return L("Sí: mantenimiento y reparación de frenos por desgaste o mantenimiento, y reparación de todos los componentes del sistema de frenos ABS. Su web dice que el sistema de frenos es clave para la seguridad y que todos sus componentes necesitan revisión periódica.", "Yes: brake maintenance and repair (wear or routine service), and repair of every component of the ABS brake system. Their site says the brake system is key to safety and all its components need regular checkups."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "inyectores", k: ["inyector", "inyectores", "limpieza de inyectores", "ultrasonido", "consumo", "gasta mucha gasolina", "rendimiento", "injector", "injectors", "injector cleaning", "ultrasound", "fuel consumption", "gas mileage"],
      a: function () { return L("Sí: limpieza de inyectores de gasolina con equipo de ultrasonido para controlar y limpiar cada inyector. Su web dice que los inyectores limpios son clave para el consumo de combustible y el rendimiento del motor.", "Yes: gasoline injector cleaning with ultrasound equipment to test and clean each injector. Their site says clean injectors are key for fuel consumption and engine performance."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "servicio", k: ["servicio", "chequeo", "chequeos", "revision", "revisión", "mantenimiento", "service", "checkup", "check up", "inspection", "maintenance", "scheduled maintenance", "aceite", "cambio de aceite", "oil", "oil change", "filtro", "filter"],
      a: function () { return L("Sí: servicio y chequeos periódicos siguiendo el plan de mantenimiento del fabricante, para que el auto se mantenga en óptimas condiciones y conserve su valor. Después de una revisión completa le arman un presupuesto personalizado que se conversa y acuerda con usted. Su web no detalla cada tarea (por ejemplo el cambio de aceite): eso se lo confirma el taller.", "Yes: periodic service and checks following the manufacturer's maintenance schedule, to keep the car in top condition and preserve its value. After a complete checkup they prepare a personalized budget that's discussed and agreed with you. Their site doesn't list each task (an oil change, for example), so the shop confirms that."); }, c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "altagama", k: ["alta gama", "lujo", "motor de alta gama", "importado", "europeo", "high end", "high-end", "luxury", "premium", "european"],
      a: function () { return L("Su web dice «Experts in High-End Engines» y «apostamos a la calidad, no a la cantidad». No publica una lista de marcas, así que para un modelo puntual conviene confirmarlo con el taller.", "Their site says \"Experts in High-End Engines\" and \"we bet on quality, not quantity\". It doesn't list specific makes, so for a particular model it's best to confirm with the shop."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nolist", k: ["grua", "grúa", "remolque", "remolcar", "auxilio", "a domicilio", "pintura", "carroceria", "chapa", "hojalateria", "choque", "llanta", "llantas", "gomas", "neumaticos", "ponchada", "alineacion", "alineación", "aire acondicionado", "a c", "ac", "vidrio", "parabrisas", "inspeccion", "tow", "towing", "mobile", "paint", "body work", "collision", "tire", "tires", "flat tire", "alignment", "air conditioning", "a/c", "windshield"], a: noListA, c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "services", "what do you fix", "what do you do", "repairs"], a: serviciosA, c: [HIB_CHIP, CITA_CHIP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "gratis", "tarifa", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "free", "quote"],
      a: function () { return L("Su web no publica precios: después de la revisión le arman un presupuesto personalizado que se conversa y acuerda con usted antes del trabajo (su proceso: diagnóstico → presupuesto y trabajo). Lo que sí hago: le dejo pedido el presupuesto con su auto y la falla.", "Their site doesn't publish prices: after the checkup they prepare a personalized budget that's discussed and agreed with you before any work (their process: diagnosis → budget and work). What I can do: request an estimate with your car and the problem."); }, c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "experiencia", k: ["experiencia", "anos", "años", "desde cuando", "familia", "familiar", "confiable", "quienes son", "dueño", "gustavo andrade", "experience", "family", "since", "trust", "who are you", "owner"],
      a: function () { return L("Andrade Car Service es una empresa familiar que repara autos desde 1968 («50 años al servicio de los automóviles»), dirigida por Gustavo Andrade (CEO). Su lema: calidad, no cantidad; le dedican tiempo a cada servicio.", "Andrade Car Service is a family-owned company repairing cars since 1968 (\"50 years serving automobiles\"), led by Gustavo Andrade (CEO). Their motto: quality, not quantity; they take time with every service."); }, c: [CITA_CHIP, SVC] },
    { id: "tiempo", k: ["cuanto tarda", "cuanto tiempo", "cuantas horas", "cuantos dias", "rapido", "mismo dia", "how long", "how fast", "turnaround", "same day"],
      a: function () { return L("Su web no publica tiempos de trabajo: se los dicen después del diagnóstico, junto con el presupuesto. Si quiere, le dejo pedida la cita y el taller le confirma.", "Their site doesn't publish turnaround times: they give you one after the diagnosis, together with the budget. I can request the appointment and the shop confirms."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llevarlo", "llegar sin cita", "without appointment", "drop by", "stop by"],
      a: function () { return L("Su web no aclara si reciben sin cita. Para ir seguro, le dejo pedida la cita aquí o llame al " + C.tel + ".", "Their site doesn't say whether they take walk-ins. To be safe, I can request an appointment here, or call " + C.tel + ".") + "\n" + estadoLinea(nowTx()); }, c: [CITA_CHIP, TEL, MAPS] },
    { id: "idioma", k: ["espanol", "español", "hablan espanol", "ingles", "inglés", "spanish", "english", "speak spanish", "bilingue"],
      a: function () { return L("Sí: «Hablamos español», dice su web («We wait for your call - Hablamos Español»). Aquí le atiendo en español o en inglés (botón EN arriba).", "Yes: \"Hablamos español\" — they speak Spanish and English. I can help you in English or Spanish (ES button at the top)."); }, c: [CITA_CHIP, HIB_CHIP] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "lunes", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, MAPS] },
    { id: "direccion", k: ["donde", "dirección", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "hialeah", "miami", "address", "location", "where", "directions", "located"],
      a: function () { return dirA() + L("\nSi quiere, le dejo pedida la cita desde aquí y el taller le confirma.", "\nI can request the appointment from here and the shop confirms."); }, c: [MAPS, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "teléfono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "phone", "number", "call", "text", "contact"],
      a: function () { return L("Canales que publica el taller:\n📞 Teléfono: " + C.tel + "\n💬 WhatsApp: el mismo número (sus botones «Contact Whatsapp»)\n✉️ Email: " + C.mail + "\nNo publican mensajes de texto (SMS). O deje aquí su teléfono y le llaman ellos.", "Channels the shop publishes:\n📞 Phone: " + C.tel + "\n💬 WhatsApp: same number (their \"Contact Whatsapp\" buttons)\n✉️ Email: " + C.mail + "\nThey don't list text messages (SMS). Or leave your number here and they'll call you."); }, c: [TEL, WA, MAIL, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: function () { return L("¡Con gusto! Si necesita algo más, aquí estoy. 🚗", "You're welcome! I'm here if you need anything else. 🚗"); }, c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "agendar", "reservar", "turno", "revisar mi auto", "revisar mi carro", "revisen", "llevar el auto", "llevar el carro", "appointment", "estimate", "book", "schedule", "bring my car"];
  function bestIntent(text) {
    var ut = toks(text), best = null, bs = 0;
    if (!ut.length) return null;
    KB.forEach(function (e) {
      var s = 0; e.k.forEach(function (ph) { s = Math.max(s, phraseScore(ph, ut)); });
      if (s > bs) { bs = s; best = e; }
    });
    return bs > 0 ? { e: best, s: bs } : null;
  }
  function isPriceQ(n) { return /\b(precio|precios|cuesta|cuestan|cuanto sale|cuanto cobran|costo|caro|barato|tarifa|price|prices|how much|cost|cheap|rates|\$)\b/.test(n); }
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { return phraseScore(ph, ut) > 0; }); }
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i", "not"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|auto)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|precio|horario|donde|necesito|quiero|mi carro|mi auto|gracias|cual|frenos|hibrido)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/786-917-9032/g, '<a href="tel:+17869179032">786-917-9032</a>').replace(/info@andradecarservice\.com/g, '<a href="mailto:info@andradecarservice.com">info@andradecarservice.com</a>'); }
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
          else if (c.url) { b = el("a", "r24-chip" + (c.wa ? " r24-wa" : ""), esc(c.t)); b.href = c.url; if (!c.self) { b.target = "_blank"; b.rel = "noopener"; } }
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
  function menuChips() { return [CITA_CHIP, HIB_CHIP, SVC, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Hialeah Gardens, FL";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    banner.textContent = L("Demo privada preparada para Andrade Car Service", "Private demo prepared for Andrade Car Service");
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
    addBot(isOpen(n) ? L("Claro. El taller está abierto ahora: llame al " + C.tel + " (o escríbales por WhatsApp a ese mismo número) y le atiende una persona del equipo (hablan español). Si prefiere, le llaman ellos: déjeme su nombre y teléfono.", "Sure. The shop is open now: call " + C.tel + " (or WhatsApp that same number) and a person on the team will help you (they speak English and Spanish). Or they can call you: just leave your name and number.")
      : L("Claro. Ahora está fuera del horario publicado (abre " + nextOpening(n) + "). Déjeme su nombre y teléfono y una persona del taller le llama; el pedido le llega al instante. También puede escribirles por WhatsApp al " + C.tel + ".", "Sure. It's outside their posted hours right now (opens " + nextOpening(n) + "). Leave your name and number and someone from the shop will call you; they get the request instantly. You can also WhatsApp them at " + C.tel + "."), [TEL(), WA(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy la recepción virtual de Andrade Car Service Miami (Hialeah Gardens). Le ayudo a pedir un presupuesto o una cita, con su híbrido o eléctrico, o con dudas de servicios y horario, a cualquier hora y sin esperar a que contesten el teléfono.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the virtual front desk for Andrade Car Service Miami (Hialeah Gardens). I can set up an estimate or appointment, help with your hybrid or electric car, or answer questions about services and hours — any time, no waiting on the phone.\nHow can I help?"), menuChips());
  }
  // Notas de la demo para los botones de su web que llevan a canales rotos o a WhatsApp
  function nota(kind) {
    if (kind === "wa-ar") return L("ℹ️ Nota de la demo: en su web, este botón de WhatsApp abre un chat con un número de Argentina (+54 9 11 3171-5636), no con el taller. Aquí abre esta recepción. El WhatsApp del taller que figura en sus otros botones es el " + C.tel + ".",
      "ℹ️ Demo note: on their website, this WhatsApp button opens a chat with an Argentina number (+54 9 11 3171-5636), not the shop. Here it opens this front desk. The shop's WhatsApp on their other buttons is " + C.tel + ".");
    if (kind === "dots") return L("ℹ️ Nota de la demo: en el panel «Contact Info» de su página principal, la dirección figura como «........». La que sí figura arriba es " + C.dir + ".",
      "ℹ️ Demo note: in the \"Contact Info\" panel of their homepage, the address shows as \"........\". The one at the top of the site is " + C.dir + ".");
    if (kind === "cita-wa") return L("ℹ️ Nota de la demo: en su web, «Request Appointment» abre WhatsApp y el cliente espera a que alguien conteste. Aquí la recepción toma el pedido al instante, también de noche y el fin de semana.",
      "ℹ️ Demo note: on their website, \"Request Appointment\" opens WhatsApp and the customer waits for someone to reply. Here the front desk takes the request instantly, even at night and on weekends.");
    return "";
  }
  function open(mode) {
    if (mode === "es") { if (lang !== "es") { lang = "es"; headTexts(); } mode = null; }
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; greet(); }
    var nt = nota(mode);
    if (nt && !flow) setTimeout(function () { addBot(nt, mode === "cita-wa" ? [] : [CITA_CHIP, WA(), LLAMADA_CHIP], "r24-note"); if (mode === "cita-wa") setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 700); }, 450);
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "hibrido" && !flow) setTimeout(function () { addUser(HIB_CHIP.t); startHib(); }, 450);
    if (mode === "cita" && !flow) setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }
  function opts(a) { return a.map(function (t) { return { t: t, v: t, flow: true }; }); }
  function SINT() { return lang === "en" ? ["Warning light / diagnosis", "Service & checkup", "Electrical / won't start", "Automatic transmission", "Timing chain / belt", "Hybrid / electric", "Brakes / ABS", "Injector cleaning", "Other"]
    : ["Luz en el tablero / diagnóstico", "Servicio y chequeo", "Falla eléctrica / no arranca", "Transmisión automática", "Correa / cadena de distribución", "Híbrido / eléctrico", "Frenos / ABS", "Limpieza de inyectores", "Otro"]; }
  function HSINT() { return lang === "en" ? ["Hybrid system warning light", "Battery / range", "Won't start / won't charge", "Service or checkup", "Other / not sure"]
    : ["Luz de aviso del sistema híbrido", "Batería / autonomía", "No arranca / no carga", "Servicio o chequeo", "Otro / no sé"]; }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function franjas() {
    return opts([L("Mañana (7:00 am – 12:00 pm)", "Morning (7:00 am – 12:00 pm)"), L("Tarde (12:00 – 6:00 pm)", "Afternoon (12:00 – 6:00 pm)"), L("Me da igual", "Either is fine")]);
  }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Presupuesto (diagnóstico primero)", "Estimate (diagnosis first)"), L("Cita para llevar el auto", "Appointment to bring the car")]));
  }
  function startHib() {
    flow = { step: "hsint", d: { tipo: "cita", servicio: L("Híbrido / eléctrico", "Hybrid / electric"), hib: true } };
    addBot(L("Vamos con su híbrido o eléctrico, que es una de sus especialidades (técnicos certificados). (Escriba «cancelar» si quiere salir.)\n¿Qué nota?", "Let's look at your hybrid or electric car — it's one of their specialties (certified technicians). (Type \"cancel\" to exit.)\nWhat are you noticing?"), opts(HSINT()));
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
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del auto? (por ejemplo: 2016 Toyota Prius)", "Year, make and model? (e.g. 2016 Toyota Prius)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesita?", "What's going on, or what service do you need?"), opts(SINT()));
    else if (step === "hsint") addBot(L("¿Qué nota en su híbrido o eléctrico?", "What are you noticing with your hybrid or electric car?"), opts(HSINT()));
    else if (step === "foto") addBot(L("¿Tiene una foto (del tablero, de la luz de aviso o de la pieza)? Es opcional y ayuda al taller a preparar el presupuesto.", "Do you have a photo (dashboard, warning light or the part)? It's optional and helps the shop prepare the estimate."), FOTO());
    else if (step === "dia") {
      var days = nextWorkdays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia y el taller le confirma la hora. Abren de lunes a viernes de 7:00 am a 6:00 pm.", "Which day works best? I'll note it as a preference and the shop confirms the time. They're open Monday–Friday 7:00 am–6:00 pm."),
        opts(days.map(function (x) { return x.label; })).concat(opts([L("Lo antes posible", "As soon as possible")])));
    }
    else if (step === "franja") addBot(L("¿En qué franja?", "What time window?"), franjas());
    else if (step === "nombre") addBot(L("¿Cuál es su nombre?", "What's your name?"));
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto, " + d.nombre + ". ¿A qué teléfono le llaman?", "Great, " + d.nombre + ". What number should they call?") : L("Último paso: ¿a qué teléfono le llaman para confirmar?", "Last step: what number should they call to confirm?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revise su solicitud de llamada:\n👤 Nombre: ", "Please review your call-back request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Auto: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n🔧 Qué le pasa: ", "\n🔧 Problem: ") + d.sintoma + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
  function dowFromText(n) {
    var es = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"], en = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    for (var i = 0; i < 7; i++) if (new RegExp("\\b(" + es[i] + "|" + en[i] + ")\\b").test(n)) return i;
    return null;
  }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop|exit|quit)$/.test(n)) { flow = null; addBot(L("Sin problema, cancelé la solicitud. ¿Le ayudo con otra cosa?", "No problem, I've cancelled the request. Anything else?"), [CITA_CHIP, HIB_CHIP, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "tipo":
        d.servicio = t.slice(0, 40);
        addBot(L("Bien. Dato de su web: primero anotan lo que necesita, después hacen un diagnóstico computarizado y visual, y recién ahí le pasan el presupuesto.", "Got it. From their site: they first note what you need, then do a computerized and visual diagnosis, and only then give you the budget."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "hsint": d.sintoma = L("Híbrido/eléctrico: ", "Hybrid/electric: ") + t.slice(0, 80); ask("vehiculo"); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60);
        if (d.hib) { ask("foto"); return; }
        ask("sintoma"); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask("foto"); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60);
        d.dow = flow.days && flow.days[t] != null ? flow.days[t] : dowFromText(n);
        if (d.dow === 0 || d.dow === 6) {
          addBot(L("Lo anoto, pero ojo: el horario de arriba de su web es de lunes a viernes, así que el taller le confirma si atiende ese día o le propone el día hábil más cercano.", "Noted — but the hours at the top of their site are Monday–Friday, so the shop will confirm whether that day works or offer the closest weekday."));
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
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (con código de área), por ejemplo 786-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 786-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)");
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le llama al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will call you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su solicitud quedó registrada.\nEl taller le llama al " + d.telefono + " para confirmar el día y la hora; el presupuesto se lo arman después del diagnóstico y se acuerda con usted antes de empezar.", "All set, " + nm2 + "! ✅ Your request is in.\nThe shop will call you at " + d.telefono + " to confirm the day and time; the budget comes after the diagnosis and is agreed with you before any work starts.") + DEMO, [MAPS(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|editar|edit|change|^no\b/.test(n)) {
          var keep = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : { tipo: d.tipo, servicio: d.servicio, hib: d.hib };
          flow.d = keep; addBot(L("De acuerdo, empezamos de nuevo.", "OK, let's start over."));
          setTimeout(function () { if (keep.tipo === "llamada") ask("nombre"); else if (keep.hib) ask("hsint"); else ask("vehiculo"); }, 500); return;
        }
        ask("resumen"); return;
    }
  }
  function reply(e) {
    var t = typeof e.a === "function" ? e.a() : e.a;
    addBot(t, (e.c || []).map(function (c) { if (typeof c === "function") c = c(); return c.q ? { t: c.t, v: c.q } : c; }));
  }
  function fallback() {
    addBot(L("Eso se lo confirma mejor el taller, así tiene el dato exacto. 😊\nLlame al " + C.tel + " (también por WhatsApp) o déjeme su teléfono y le llaman ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall " + C.tel + " (WhatsApp works too) or leave your number and they'll call you."), [TEL, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot(L("Claro, ¿qué más quiere saber?", "Sure, what else would you like to know?"), menuChips()); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "hibrido") { startHib(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué le puedo ayudar? Le pido citas o presupuestos, le ayudo con su híbrido o eléctrico y le cuento servicios y horario.", "Hi! How can I help? I can request appointments or estimates, help with your hybrid or electric car, and tell you about services and hours."), menuChips()); return; }
    if (/^(horario y direccion|hours and address)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [MAPS, CITA_CHIP, LLAMADA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (/\bsin cita\b|walk ?in|without (an )?appointment|no appointment/.test(n)) { reply(byId("walkin")); return; }
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|schedule|book/.test(n))) { if (bi && bi.e.id === "hibrido") startHib(); else startCita(); return; }
    if (price && !(bi && bi.e.id === "nolist")) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, isOpen: isOpen, nowTx: nowTx, lang: function () { return lang; } } };
})();
