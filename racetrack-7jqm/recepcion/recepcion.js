/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Race Track Auto Center (taller, 9840 Westpark Dr, Houston TX 77063) — DEMO privada, bilingüe ES/EN.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica racetrackautocenter.com (EN y /es/, oct. 2026): home, servicios, las 4 categorías, FAQ, contacto,
   reservar cita, get a quote y asistencia en carretera.
   - Teléfono (713) 575-7387 (en el pie figura «713 (575)-7387» con un enlace tel: mal armado; en la demo está arreglado). Email Service@racetrackautocenter.com.
     No publican WhatsApp ni SMS para escribirles (su FAQ dice que en trabajos largos avisan «por teléfono o mensaje de texto»).
   - Horario: su web NO publica horario de atención ni días. Lo único: el formulario de cita ofrece horas de 9:00 am a 4:00 pm, «citas el mismo día
     disponibles», y la página de asistencia en carretera dice «24/7». La demo no inventa «abierto/cerrado»: lo dice así y el taller confirma.
   - Servicios: carrocería y colisiones, detallado y apariencia, mecánica y rendimiento, servicios especializados (mecánico/taller móvil, asistencia y
     mecánico en carretera, autos nuevos, de lujo, inspección de usados). Garantía 12 meses o 12,000 millas, técnicos certificados ASE, todas las marcas,
     partes OEM o de repuesto de calidad, área de espera con café y Wi-Fi, la mayoría de los servicios de rutina en 1–2 horas, mismo día en la mayoría.
   Sin precios (la página de asistencia en carretera muestra planes con precio: la demo no los repite), sin WhatsApp. Español en «usted», como su home. */
(function () {
  "use strict";
  var C = {
    nombre: "Race Track Auto Center", corto: "Race Track Auto Center",
    tel: "(713) 575-7387", telh: "+17135757387", mail: "Service@racetrackautocenter.com",
    dir: "9840 Westpark Dr, Houston, TX 77063", maps: "https://maps.google.com/?q=9840+Westpark+Dr+Houston+TX+77063"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  // Horas de cita que ofrece su formulario («Hora / Time»): 9:00 am a 4:00 pm. Días: su web no los publica.
  var SLOT0 = 540, SLOT1 = 960;
  function horarioTxt() {
    return L("Su web no publica un horario de atención del taller (ni días ni horas). Lo que sí figura:\n• Citas: su formulario ofrece horarios de 9:00 am a 4:00 pm, y dicen «citas el mismo día disponibles».\n• 🚨 Asistencia en carretera: su página la anuncia «24/7» al " + C.tel + ".\nPara ir sin cita o un día puntual, conviene confirmarlo con el taller al " + C.tel + ". Yo le tomo el pedido a cualquier hora y el taller lo recibe al instante.",
      "Their website doesn't publish shop hours (no days or times). What it does show:\n• Appointments: their booking form offers times from 9:00 am to 4:00 pm, and they say \"same-day appointments available\".\n• 🚨 Roadside assistance: their page advertises it \"24/7\" at " + C.tel + ".\nTo walk in or pick a specific day, it's best to confirm with the shop at " + C.tel + ". I can take your request any time and the shop gets it instantly.");
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
  function dayLabel(dt) { var dn = DIAS[lang][dt.getDay()]; return lang === "en" ? dn + ", " + MESES.en[dt.getMonth()] + " " + dt.getDate() : dn.charAt(0).toUpperCase() + dn.slice(1) + " " + dt.getDate() + " " + MESES.es[dt.getMonth()]; }
  function nextDays(n, k) {
    var out = [];
    if (n.min <= SLOT1 - 60) out.push({ dow: n.dow, label: L("Hoy (mismo día)", "Today (same day)") });
    for (var i = 1; out.length < k && i < 14; i++) { var dt = new Date(n.y, n.m, n.d + i); out.push({ dow: dt.getDay(), label: dayLabel(dt) }); }
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
  var URG_CHIP = { a: "urgencia", get t() { return L("🚨 Me quedé tirado", "🚨 Stuck on the road"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen", "📲 Call me back"); } };
  function aviso() { return L("🔔 El equipo del taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop team gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL() { return { t: L("Llamar al ", "Call ") + C.tel, tel: C.telh }; }
  function T911() { return { t: L("Llamar al 911", "Call 911"), tel: "911", cls: "r24-911" }; }
  function MAIL() { return { t: "✉️ " + C.mail, url: "mailto:" + C.mail, self: true }; }
  function MAPS() { return { t: L("Cómo llegar (Google Maps)", "Directions (Google Maps)"), url: C.maps }; }
  function PAGE(es, en, ues, uen) { return function () { return { t: L(es, en), url: lang === "en" ? uen : ues, self: true }; }; }
  var ROADP = PAGE("Ver asistencia en carretera", "See roadside assistance", "es-asistencia-carretera.html", "roadside-assistance.html");
  var FAQP = PAGE("Ver preguntas frecuentes", "See the FAQ", "es-preguntas-frecuentes.html", "faq.html");
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & address", "horario y direccion", "hours and address");
  var GAR = Q("🛡️ Garantía", "🛡️ Warranty", "garantia", "warranty");
  function dirA() { return L("📍 " + C.dir + ". Su web dice: «ubicación conveniente con estacionamiento».", "📍 " + C.dir + ". Their site says: \"convenient location with parking\"."); }
  function horarioA() { return horarioTxt(); }
  function serviciosA() {
    return L("Lo que publica el taller:\n• Carrocería y colisiones: defensas (reparación y reemplazo), abolladuras, guardafangos y parte frontal, colisiones, recubrimiento anti-piedras, vidrios\n• Detallado y apariencia: interior y exterior, cera, pulido de faros, limpieza de cuero, polarizado y calibración ADAS\n• Mecánica y rendimiento: cambio de aceite, afinación, motor, transmisión, A/C y enfriamiento, llantas y ruedas\n• Especializados: mecánico y taller móvil, 🚨 asistencia y mecánico en carretera, autos nuevos, autos de lujo, inspección de autos usados\n¿Qué le pasa a su auto?",
      "What the shop lists:\n• Body & collision: bumpers (repair and replacement), dents, fenders and front end, collision repair, anti-stone coating, auto glass\n• Detailing & appearance: interior and exterior, wax coating, headlight polish, leather cleaning, window tinting and ADAS calibration\n• Mechanical & performance: oil change, tune-up, engine, transmission, A/C and cooling, tires and wheels\n• Specialty: mobile mechanic and mobile garage, 🚨 roadside assistance and roadside mechanic, new cars, luxury cars, used-car inspection\nWhat's going on with your car?");
  }
  function noListA() {
    return L("Eso no aparece entre los servicios de su web, así que no se lo voy a asegurar. Llame al " + C.tel + " o déjeme su teléfono y le llaman ellos.",
      "That isn't among the services on their website, so I won't promise it. Call " + C.tel + " or leave your number and they'll call you.");
  }
  var KB = [
    { id: "urgencia", k: ["me quede tirado", "quede tirado", "varado", "varada", "me quede", "emergencia", "auxilio", "grua", "grúa", "remolque", "no arranca", "no prende", "bateria descargada", "pasar corriente", "llanta ponchada", "ponchada", "pinchada", "llaves adentro", "deje las llaves", "sin gasolina", "sin combustible", "atascado", "atorado", "accidente", "choque en la carretera",
        "stuck", "stranded", "broke down", "breakdown", "emergency", "tow", "towing", "tow truck", "won t start", "wont start", "dead battery", "jump start", "jump", "flat tire", "flat", "locked out", "lockout", "keys inside", "out of gas", "out of fuel", "roadside", "road side"],
      a: function () { return L("Para eso su web anuncia asistencia en carretera «24/7» en el área de Houston: arranque y cambio de batería, llanta ponchada, auto cerrado con las llaves adentro, entrega de combustible y grúa. Si hay peligro o heridos, llame primero al 911. Para que lo ayuden ya, llame al " + C.tel + "; si no puede hablar, le tomo aquí los datos y el taller los recibe al instante.",
        "For that their site advertises \"24/7\" roadside assistance in the Houston area: jump start and battery replacement, flat tire, lockout, fuel delivery and towing. If anyone is hurt or in danger, call 911 first. To get help right away, call " + C.tel + "; if you can't talk, I'll take the details here and the shop gets them instantly."); }, c: [URG_CHIP, TEL, T911] },
    { id: "colision", k: ["choque", "chocaron", "colision", "colisión", "carroceria", "carrocería", "defensa", "parachoques", "bumper", "abolladura", "golpe", "guardafango", "guardabarros", "parte frontal", "anti piedra", "pintura", "collision", "body work", "body shop", "dent", "dents", "fender", "front end", "scratch", "paint"],
      a: function () { return L("Sí: carrocería y colisiones es una de sus 4 áreas. Su web lista reparación y reemplazo de defensas, eliminación y extracción de abolladuras, guardafangos y parte frontal, reparación de colisiones y recubrimiento anti-piedras. Una foto del daño ayuda mucho para el presupuesto.", "Yes: body & collision is one of their 4 areas. Their site lists bumper repair and replacement, dent removal and dent pulling, fender and front-end repair, collision repair and anti-stone coating. A photo of the damage really helps with the estimate."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "vidrio", k: ["vidrio", "parabrisas", "cristal", "ventana", "polarizado", "polarizar", "adas", "calibracion", "glass", "windshield", "window", "tint", "tinting", "calibration"],
      a: function () { return L("Sí: su web lista servicio de vidrios automotrices y polarizado de vidrios con calibración ADAS (los sistemas de asistencia al conductor).", "Yes: their site lists auto glass service and window tinting with ADAS calibration (driver-assistance systems)."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "detallado", k: ["detallado", "detailing", "lavado", "limpieza", "encerado", "cera", "pulido", "faros", "cuero", "piel", "interior", "exterior", "wash", "wax", "headlight", "leather", "polish", "clean"],
      a: function () { return L("Sí: detallado y apariencia. Su web lista detallado interior y exterior, detallado premium, revestimiento de cera, pulido de faros, limpieza y protección de cuero y productos de lavado.", "Yes: detailing & appearance. Their site lists interior and exterior detailing, premium detailing, wax coating, headlight polish, leather cleaning and protection, and car wash products."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "aceite", k: ["aceite", "cambio de aceite", "afinacion", "afinación", "bujias", "filtro", "mantenimiento", "servicio de rutina", "oil", "oil change", "tune up", "tune-up", "spark plug", "filter", "maintenance"],
      a: function () { return L("Sí: cambio de aceite y afinación están en «Mecánica y rendimiento». Su FAQ dice que la mayoría de los servicios de rutina se completan en 1–2 horas y que tienen área de espera con café gratis y Wi-Fi.", "Yes: oil change and tune-up are under \"Mechanical & performance\". Their FAQ says most routine services are done in 1–2 hours, and they have a waiting area with free coffee and Wi-Fi."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "motor", k: ["motor", "engine", "check engine", "luz del motor", "falla", "ruido", "humo", "sobrecalienta", "calienta", "transmision", "transmisión", "caja", "cambios", "patina", "diagnostico", "diagnóstico", "transmission", "overheat", "overheating", "noise", "smoke", "shifting", "diagnosis", "diagnostic"],
      a: function () { return L("Sí: reparación de motor y servicio de transmisión están en «Mecánica y rendimiento». Su FAQ dice que las reparaciones complejas varían y que le dan un estimado preciso después del diagnóstico. Atienden todas las marcas y modelos, nacionales e importados.", "Yes: engine repair and transmission service are under \"Mechanical & performance\". Their FAQ says complex repairs vary and they give you an accurate estimate after diagnosis. They work on all makes and models, domestic and foreign."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "ac", k: ["aire acondicionado", "aire", "a c", "ac", "clima", "no enfria", "no enfría", "enfriamiento", "radiador", "air conditioning", "cooling", "not cold", "radiator", "coolant"],
      a: function () { return L("Sí: servicio de A/C y sistemas de enfriamiento (en «Mecánica y rendimiento»): recarga de A/C, reparación de fugas y servicio del sistema de enfriamiento, según su web.", "Yes: A/C and cooling-system service (under \"Mechanical & performance\"): A/C recharge, leak repair and cooling-system service, per their site."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "llantas", k: ["llanta", "llantas", "neumatico", "neumático", "gomas", "rueda", "ruedas", "alineacion", "alineación", "balanceo", "rotacion", "tire", "tires", "wheel", "wheels", "alignment", "balance", "rotation"],
      a: function () { return L("Sí: llantas y ruedas (en «Mecánica y rendimiento»): servicio de neumáticos, balanceo, reemplazo y alineación. Si se le ponchó en la calle, eso es asistencia en carretera.", "Yes: tires and wheels (under \"Mechanical & performance\"): tire service, balancing, replacement and alignment. If you got a flat on the road, that's roadside assistance."); }, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "movil", k: ["mecanico movil", "mecánico móvil", "a domicilio", "taller movil", "vienen", "a mi casa", "al trabajo", "mobile mechanic", "mobile garage", "come to me", "at home", "at work", "on site"],
      a: function () { return L("Sí: su web ofrece mecánico móvil («nuestros mecánicos van a su ubicación para reparaciones y mantenimiento») y taller móvil (servicio completo en su casa o trabajo) en el área de Houston.", "Yes: their site offers a mobile mechanic (\"our mechanics come to your location for repairs and maintenance\") and a mobile garage (full service at home or work) in the Houston area."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "inspeccion", k: ["inspeccion", "inspección", "usado", "comprar un auto", "antes de comprar", "auto nuevo", "lujo", "inspection", "used car", "pre purchase", "pre-purchase", "new car", "luxury"],
      a: function () { return L("Sí: inspección completa antes de comprar un auto usado, inspección previa a la entrega de autos nuevos y servicio especializado para autos de lujo, según su página de servicios especializados.", "Yes: full pre-purchase inspection for used cars, pre-delivery inspection for new cars and specialized service for luxury vehicles, per their specialty-services page."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "garantia", k: ["garantia", "garantía", "garantizado", "warranty", "guarantee", "guaranteed"],
      a: function () { return L("Su web dice: «Todos los servicios incluyen una garantía de 12 meses o 12,000 millas», y en el FAQ: «si tiene alguna inquietud después del servicio, traiga su vehículo de vuelta y lo solucionaremos».", "Their site says: \"All services include a 12-month or 12,000-mile warranty\", and in the FAQ: \"if you have any concerns after service, bring your vehicle back and we'll make it right\"."); }, c: [CITA_CHIP, FAQP] },
    { id: "marcas", k: ["marca", "marcas", "importado", "toyota", "honda", "ford", "chevrolet", "nissan", "bmw", "mercedes", "audi", "jeep", "kia", "hyundai", "lexus", "make", "makes", "model", "foreign", "domestic"],
      a: function () { return L("Su FAQ dice que atienden todas las marcas y modelos, nacionales e importados, con técnicos certificados ASE. Ofrecen partes OEM y también partes de repuesto de calidad, y le ayudan a elegir según su presupuesto.", "Their FAQ says they service all makes and models, domestic and foreign, with ASE-certified technicians. They offer OEM and quality aftermarket parts and help you choose for your budget."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nolist", k: ["moto", "motos", "motocicleta", "camion", "camión", "trailer", "tráiler", "diesel pesado", "barco", "lancha", "motorcycle", "semi", "boat", "rv"], a: noListA, c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "services", "what do you fix", "what do you do", "repairs"], a: serviciosA, c: [CITA_CHIP, URG_CHIP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "tarifa", "plan", "planes", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "plans"],
      a: function () { return L("Los precios se los da el taller: su web habla de estimados honestos «sin compromiso y sin presión» (en su página «Get a Quote» lo llaman «free estimate») y, en reparaciones complejas, de un estimado preciso después del diagnóstico. Lo que sí hago: le dejo pedido el presupuesto con su auto, lo que necesita y una foto si quiere.", "Pricing comes from the shop: their site talks about honest estimates with \"no obligation, no pressure\" (their \"Get a Quote\" page calls it a free estimate), and for complex repairs an accurate estimate after diagnosis. What I can do: request the estimate with your car, what you need and a photo if you like."); }, c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "tiempo", k: ["cuanto tarda", "cuanto tiempo", "cuantas horas", "cuantos dias", "rapido", "mismo dia", "hoy mismo", "esperar", "how long", "how fast", "turnaround", "same day", "today", "wait"],
      a: function () { return L("Según su web: la mayoría de los servicios de rutina se completan en 1–2 horas, ofrecen servicio el mismo día para la mayoría de las reparaciones y «citas el mismo día disponibles». Puede esperar en su área de espera (café gratis y Wi-Fi); en trabajos largos le avisan por teléfono o mensaje de texto.", "Per their site: most routine services are done in 1–2 hours, they offer same-day service for most repairs and \"same-day appointments available\". You can wait in their waiting area (free coffee and Wi-Fi); for longer jobs they update you by phone or text."); }, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llevarlo", "llegar sin cita", "without appointment", "drop by", "stop by"],
      a: function () { return L("Su web no aclara si reciben sin cita ni publica el horario del taller. Para ir seguro, le dejo pedida la cita aquí (dicen que hay citas el mismo día) o llame al " + C.tel + ".", "Their site doesn't say whether they take walk-ins, and it doesn't publish shop hours. To be safe, I can request an appointment here (they say same-day appointments are available), or call " + C.tel + "."); }, c: [CITA_CHIP, TEL, MAPS] },
    { id: "idioma", k: ["espanol", "español", "hablan espanol", "ingles", "inglés", "spanish", "english", "speak spanish", "bilingue"],
      a: function () { return L("Su web tiene versión en español e inglés. Aquí le atiendo en los dos (botón EN arriba).", "Their website is in English and Spanish. I can help you in either one (ES button at the top)."); }, c: [CITA_CHIP, URG_CHIP] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "lunes", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, URG_CHIP] },
    { id: "direccion", k: ["donde", "dirección", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "westpark", "estacionamiento", "address", "location", "where", "directions", "located", "parking"],
      a: function () { return dirA() + L("\nSi quiere, le dejo pedida la cita desde aquí y el taller le confirma.", "\nI can request the appointment from here and the shop confirms."); }, c: [MAPS, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "teléfono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "phone", "number", "call", "text", "contact"],
      a: function () { return L("Canales que publica el taller:\n📞 Teléfono: " + C.tel + "\n✉️ Email: " + C.mail + "\nNo publican WhatsApp. O deje aquí su teléfono y le llaman ellos.", "Channels the shop publishes:\n📞 Phone: " + C.tel + "\n✉️ Email: " + C.mail + "\nThey don't list WhatsApp. Or leave your number here and they'll call you."); }, c: [TEL, MAIL, LLAMADA_CHIP] },
    { id: "espera", k: ["sala de espera", "area de espera", "cafe", "café", "wifi", "wi fi", "waiting area", "coffee"],
      a: function () { return L("Sí: su FAQ dice que tienen una cómoda área de espera con café gratis y Wi-Fi.", "Yes: their FAQ says they have a comfortable waiting area with free coffee and Wi-Fi."); }, c: [CITA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: function () { return L("¡Con gusto! Si necesita algo más, aquí estoy. 🏁", "You're welcome! I'm here if you need anything else. 🏁"); }, c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "agendar", "reservar", "turno", "revisar mi auto", "revisar mi carro", "revisen", "llevar el auto", "llevar el carro", "appointment", "estimate", "quote", "book", "schedule", "bring my car"];
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
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|precio|horario|donde|necesito|quiero|mi carro|mi auto|gracias|cual|frenos|llanta)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/\(713\) 575-7387/g, '<a href="tel:+17135757387">(713) 575-7387</a>').replace(/Service@racetrackautocenter\.com/g, '<a href="mailto:Service@racetrackautocenter.com">Service@racetrackautocenter.com</a>').replace(/\b911\b/g, '<a href="tel:911">911</a>'); }
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
    status.className = "r24-status r24-nohours";
    status.textContent = L("🕐 Su web no publica horario · citas de 9:00 am a 4:00 pm · 🚨 carretera 24/7 · " + C.tel, "🕐 No shop hours on their site · appointments 9:00 am–4:00 pm · 🚨 roadside 24/7 · " + C.tel);
  }
  function menuChips() { return [CITA_CHIP, URG_CHIP, SVC, HOR, LLAMADA_CHIP]; }
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
    banner.textContent = L("Demo privada preparada para Race Track Auto Center", "Private demo prepared for Race Track Auto Center");
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
    addBot(L("Claro. Llame al " + C.tel + " y le atiende una persona del taller (su web no publica el horario de atención; la asistencia en carretera la anuncian 24/7). Si prefiere, le llaman ellos: déjeme su nombre y teléfono y el pedido les llega al instante. También puede escribir a " + C.mail + ".",
      "Sure. Call " + C.tel + " and a person from the shop will help you (their site doesn't publish shop hours; roadside assistance is advertised 24/7). Or they can call you: leave your name and number and they get the request instantly. You can also email " + C.mail + "."), [TEL(), LLAMADA_CHIP, CITA_CHIP, MAIL()]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy la recepción virtual de Race Track Auto Center (Westpark Dr, Houston). Le ayudo a pedir un presupuesto o una cita, le tomo los datos si se quedó tirado, o le cuento servicios y garantía, a cualquier hora y sin esperar a que contesten el teléfono.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the virtual front desk for Race Track Auto Center (Westpark Dr, Houston). I can set up an estimate or appointment, take your details if you're stuck on the road, or answer questions about services and warranty — any time, no waiting on the phone.\nHow can I help?"), menuChips());
  }
  function open(mode) {
    if (mode === "es" || mode === "en") { if (lang !== mode) { lang = mode; headTexts(); } mode = null; }
    panel.classList.add("r24-open"); launch.classList.add("r24-hide"); document.documentElement.classList.add("r24-panel-open"); statusText();
    if (!opened) { opened = true; greet(); }
    if (mode === "llamada" && !flow) setTimeout(function () { addUser(LLAMADA_CHIP.t); startLlamada(); }, 450);
    if (mode === "urgencia" && !flow) setTimeout(function () { addUser(URG_CHIP.t); startUrg(); }, 450);
    if (mode === "cita" && !flow) setTimeout(function () { addUser(CITA_CHIP.t); startCita(); }, 450);
    setTimeout(function () { input.focus(); }, 50);
  }
  function opts(a) { return a.map(function (t) { return { t: t, v: t, flow: true }; }); }
  function SINT() { return lang === "en" ? ["Body / collision", "Detailing", "Oil change / tune-up", "Engine / transmission", "A/C / cooling", "Tires / wheels", "Glass / tint / ADAS", "Inspection (used / new car)", "Other"]
    : ["Carrocería / choque", "Detallado", "Aceite / afinación", "Motor / transmisión", "A/C / enfriamiento", "Llantas / ruedas", "Vidrios / polarizado / ADAS", "Inspección (usado / nuevo)", "Otro"]; }
  function USINT() { return lang === "en" ? ["Dead battery / won't start", "Flat tire", "Locked out (keys inside)", "Out of fuel", "Need a tow", "Stuck / other"]
    : ["Batería descargada / no arranca", "Llanta ponchada", "Llaves adentro", "Sin combustible", "Necesito grúa", "Atascado / otro"]; }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function franjas() {
    return opts([L("Mañana (9:00 am – 12:00 pm)", "Morning (9:00 am – 12:00 pm)"), L("Tarde (12:00 – 4:00 pm)", "Afternoon (12:00 – 4:00 pm)"), L("Me da igual", "Either is fine")]);
  }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Presupuesto", "Estimate"), L("Cita para llevar el auto", "Appointment to bring the car"), L("Mecánico móvil (vienen a usted)", "Mobile mechanic (they come to you)")]));
  }
  function startUrg() {
    flow = { step: "uok", d: { tipo: "urgencia", servicio: L("🚨 Asistencia en carretera", "🚨 Roadside assistance") } };
    addBot(L("Vamos rápido. Primero lo importante: ¿está en un lugar seguro? Si hay heridos, humo o peligro en la vía, llame al 911 ahora. Para que lo ayuden ya, lo más rápido es llamar al " + C.tel + " (su web anuncia asistencia en carretera 24/7). Si no puede hablar, sigamos aquí. (Escriba «cancelar» si quiere salir.)",
      "Let's be quick. First things first: are you somewhere safe? If anyone is hurt, there's smoke or danger on the road, call 911 now. For help right away, the fastest is to call " + C.tel + " (their site advertises 24/7 roadside assistance). If you can't talk, let's keep going here. (Type \"cancel\" to exit.)"),
      [T911(), TEL()].concat(opts([L("Estoy a salvo, sigamos aquí", "I'm safe, let's continue here")])));
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
    setTimeout(function () { ask(d.tipo === "urgencia" ? "nombre" : "dia"); }, 600);
  }
  function ask(step) {
    flow.step = step;
    var d = flow.d, n = nowTx();
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del auto? (por ejemplo: 2019 Honda Civic)", "Year, make and model? (e.g. 2019 Honda Civic)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesita?", "What's going on, or what service do you need?"), opts(SINT()));
    else if (step === "uok") startUrg();
    else if (step === "usint") addBot(L("¿Qué le pasó?", "What happened?"), opts(USINT()));
    else if (step === "ubic") addBot(L("¿Dónde está exactamente? (calle y cruce, salida de la autopista o una referencia)", "Where exactly are you? (street and cross street, highway exit or a landmark)"));
    else if (step === "foto") addBot(d.tipo === "urgencia" ? L("¿Puede mandar una foto (del auto, la llanta o el tablero)? Es opcional.", "Can you send a photo (of the car, the tire or the dashboard)? It's optional.")
      : L("¿Tiene una foto (del daño, del tablero o de la pieza)? Es opcional y ayuda al taller a preparar el presupuesto.", "Do you have a photo (of the damage, the dashboard or the part)? It's optional and helps the shop prepare the estimate."), FOTO());
    else if (step === "dia") {
      var days = nextDays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia y el taller le confirma. Su web no publica qué días abren; su formulario de cita ofrece horas de 9:00 am a 4:00 pm.", "Which day works best? I'll note it as a preference and the shop confirms. Their site doesn't say which days they're open; their booking form offers times from 9:00 am to 4:00 pm."),
        opts(days.map(function (x) { return x.label; })).concat(opts([L("Lo antes posible", "As soon as possible")])));
    }
    else if (step === "franja") addBot(L("¿En qué franja?", "What time window?"), franjas());
    else if (step === "nombre") addBot(L("¿Cuál es su nombre?", "What's your name?"));
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto, " + d.nombre + ". ¿A qué teléfono le llaman?", "Great, " + d.nombre + ". What number should they call?")
      : d.tipo === "urgencia" ? L("¿A qué teléfono le llaman ya mismo?", "What number should they call right away?") : L("Último paso: ¿a qué teléfono le llaman para confirmar?", "Last step: what number should they call to confirm?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revise su solicitud de llamada:\n👤 Nombre: ", "Please review your call-back request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      if (d.tipo === "urgencia") { addBot(L("🚨 URGENTE · asistencia en carretera\n🔧 Qué pasó: ", "🚨 URGENT · roadside assistance\n🔧 What happened: ") + d.sintoma + L("\n📍 Dónde: ", "\n📍 Where: ") + d.ubic + L("\n🚗 Auto: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + L("\nSi no le llaman enseguida, llame usted al " + C.tel + ".", "\nIf they don't call you right away, call " + C.tel + ".") + q, B, "r24-urgsum"); return; }
      addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Auto: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n🔧 Qué necesita: ", "\n🔧 What you need: ") + d.sintoma + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop|exit|quit)$/.test(n)) { flow = null; addBot(L("Sin problema, cancelé la solicitud. ¿Le ayudo con otra cosa?", "No problem, I've cancelled the request. Anything else?"), [CITA_CHIP, URG_CHIP, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen" && d.tipo !== "urgencia") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "uok": ask("usint"); return;
      case "usint": d.sintoma = t.slice(0, 60); ask("ubic"); return;
      case "ubic": if (t.length < 3) { ask("ubic"); return; } d.ubic = t.slice(0, 100); ask("vehiculo"); return;
      case "tipo":
        d.servicio = t.slice(0, 40);
        if (/movil|mobile/.test(n)) d.movil = true;
        addBot(d.movil ? L("Bien. Su web dice que sus mecánicos van a su ubicación para reparaciones y mantenimiento, en el área de Houston.", "Got it. Their site says their mechanics come to your location for repairs and maintenance in the Houston area.")
          : L("Bien. Dato de su web: la mayoría de los servicios de rutina toman 1–2 horas, y en reparaciones complejas le dan un estimado preciso después del diagnóstico.", "Got it. From their site: most routine services take 1–2 hours, and for complex repairs they give you an accurate estimate after diagnosis."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60);
        if (d.tipo === "urgencia") { ask("foto"); return; }
        ask("sintoma"); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask("foto"); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask(d.tipo === "urgencia" ? "nombre" : "dia"); return;
      case "dia": d.dia = t.slice(0, 60); ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask("nombre"); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dice su nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (con código de área), por ejemplo 713-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 713-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)");
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le llama al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will call you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          if (d.tipo === "urgencia") { addBot(L("¡Listo, " + nm2 + "! 🚨 El taller recibe su pedido URGENTE al instante y le llama al " + d.telefono + ". Quédese en un lugar seguro, con las luces de emergencia encendidas. Si la situación empeora, llame al 911.", "All set, " + nm2 + "! 🚨 The shop gets your URGENT request instantly and will call you at " + d.telefono + ". Stay somewhere safe with your hazard lights on. If things get worse, call 911.") + DEMO, [TEL(), T911()]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su solicitud quedó registrada.\nEl taller le llama al " + d.telefono + " para confirmar el día y la hora; el presupuesto se lo dan ellos (en reparaciones complejas, después del diagnóstico).", "All set, " + nm2 + "! ✅ Your request is in.\nThe shop will call you at " + d.telefono + " to confirm the day and time; the estimate comes from them (for complex repairs, after diagnosis).") + DEMO, [MAPS(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
          flow = null; return;
        }
        if (t === "__fix" || /corregir|cambiar|editar|edit|change|^no\b/.test(n)) {
          var keep = d.tipo === "llamada" ? { tipo: "llamada", consulta: d.consulta } : d.tipo === "urgencia" ? { tipo: "urgencia", servicio: d.servicio } : { tipo: d.tipo, servicio: d.servicio, movil: d.movil };
          flow.d = keep; addBot(L("De acuerdo, empezamos de nuevo.", "OK, let's start over."));
          setTimeout(function () { if (keep.tipo === "llamada") ask("nombre"); else if (keep.tipo === "urgencia") ask("usint"); else ask("vehiculo"); }, 500); return;
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
    if (t === "__menu") { addBot(L("Claro, ¿qué más quiere saber?", "Sure, what else would you like to know?"), menuChips()); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "urgencia") { startUrg(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué le puedo ayudar? Le pido citas o presupuestos, le tomo los datos si se quedó tirado y le cuento servicios, garantía y dirección.", "Hi! How can I help? I can request appointments or estimates, take your details if you're stuck on the road, and tell you about services, warranty and location."), menuChips()); return; }
    if (/^(horario y direccion|hours and address)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [MAPS, CITA_CHIP, LLAMADA_CHIP]); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (/\bsin cita\b|walk ?in|without (an )?appointment|no appointment/.test(n)) { reply(byId("walkin")); return; }
    if (bi && bi.e.id === "urgencia" && bi.s >= 1 && !price) { reply(bi.e); return; }
    if (wantsCita(n) && !price && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|quote|schedule|book/.test(n))) { startCita(); return; }
    if (price && !(bi && bi.e.id === "nolist")) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
