/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Martinez Tire & Auto Center (llantas y rines en San Antonio, TX, desde 1987) — DEMO privada, bilingüe ES/EN.
   Sale de plantilla-widget/recepcion.base.js (reglas del brief 18/10 + R24-HUMANO), en la variante de talleres ES/EN en «usted» (Noels #23 y Medina's #18,
   misma plataforma Duda), con la lógica SIN HORARIO de Reinaldo Paint & Body Shop: su web no publica horario y la recepción no lo inventa.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica martineztiresanantoniotx.com (Home, Why Choose Us, Services, Tire Tips, Tires, Wheels, Contact Us; revisada el 20/10/2026):
   - 12040 O'Connor Rd., San Antonio, TX 78233 · (210) 646-8911 · LMTZ91@ATT.NET · formulario «Contact Us» (nombre, teléfono, correo, mensaje; responde «lo antes
     posible») · Facebook · reseñas en YP · sello BBB Accredited Business · «In business since 1987» · acceso para sillas de ruedas · «Hablamos Espanol y Ingles».
   - Horario: su web NO publica horario (ni días ni horas) en ninguna página, aunque dice «Call us today and set an appointment or just walk in». La demo no
     inventa «abierto/cerrado» ni horas: lo dice así, ofrece «📲 Que me llamen» y el teléfono real. Hora de referencia: Texas (America/Chicago).
   - Servicios (autos, SUV y camionetas ligeras): alineación computarizada, balanceo computarizado de llantas y rines, reparación de ponchaduras, instalación de
     birlos/tuercas, inspecciones de seguridad, amortiguadores y struts, montaje de llantas, revisión de presión, rotación de llantas, válvulas. Venta de llantas
     («premium tire products») y rines: marcas de su portada (BFG, General, Bridgestone, Hankook, Continental, Kumho, Cooper, Michelin, Dean, Nitto, Dunlop, Pirelli,
     Firestone, Summit, Fusion, Uniroyal) y logos de Tires/Wheels (Toyo, Goodyear, Yokohama, Nexen, Falken, Mickey Thompson…; Fuel, Vossen, Lexani, American Force…).
   - Formas de pago (sus íconos): Visa, MasterCard, American Express, Discover, débito y efectivo. «Precios justos y razonables» (sin cifras).
   Sin precios ni cifras, sin WhatsApp; no promete stock ni medidas, grúa, frenos, aceite, A/C, motor, transmisión, escapes/mofles (el título de su web dice
   «Tire and Muffler Shop» pero su lista de servicios no los incluye), llantas usadas, garantías, financiamiento ni tiempos. No nombra a nadie. */
(function () {
  "use strict";
  var C = {
    nombre: "Martinez Tire & Auto Center", corto: "Martinez Tire & Auto Center",
    dir: "12040 O'Connor Rd., San Antonio, TX 78233", maps: "https://www.google.com/maps/dir/?api=1&destination=Martinez+Tire+%26+Auto+Center+12040+O%27Connor+Rd+San+Antonio+TX+78233",
    tel: "(210) 646-8911", telh: "+12106468911", email: "LMTZ91@ATT.NET"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  // Horario: su web no lo publica (ni días ni horas). No se inventa: el taller confirma por teléfono.
  function horarioTxt() {
    return L("Su web no publica horario de atención (ni días ni horas), así que no se lo voy a inventar: el taller se lo confirma al " + C.tel + ".\nYo le tomo el pedido a cualquier hora, también de noche o el fin de semana, y el taller lo recibe al instante. Si prefiere, déjeme su nombre y teléfono y le llaman.",
      "Their website doesn't publish business hours (no days or times), so I won't make them up: the shop will confirm at " + C.tel + ".\nI can take your request any time, even at night or on the weekend, and the shop gets it instantly. Or leave your name and number and they'll call you.");
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
  // Días como PREFERENCIA (desde mañana, hora de Texas): sin «Hoy» y sin dar por hecho qué días abren; el taller confirma.
  function nextDays(n, k) { var out = []; for (var i = 1; i <= k; i++) { var dt = new Date(n.y, n.m, n.d + i); out.push({ dow: dt.getDay(), label: dayLabel(dt) }); } return out; }

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

  var CITA_CHIP = { a: "cita", get t() { return L("🛞 Pedir llantas o servicio", "🛞 Request tires or service"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen", "📲 Call me back"); } };
  function aviso() { return L("🔔 El equipo recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The team gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL1() { return { t: L("Llamar al " + C.tel, "Call " + C.tel), tel: C.telh }; }
  function MAPS1() { return { t: L("📍 Cómo llegar", "📍 Get directions"), url: C.maps }; }
  function PAGE(es, en, f) { return function () { return { t: L(es, en), url: (lang === "es" ? "es-" : "") + f, self: true }; }; }
  var SERVP = PAGE("Ver la página de servicios", "See the services page", "services.html");
  var TIRESP = PAGE("Ver las marcas de llantas", "See the tire brands", "tires.html");
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & address", "horario y direccion", "hours and address");
  var NUEVAS = Q("🛞 Llantas nuevas", "🛞 New tires", "llantas nuevas", "new tires");
  var PONCH = Q("🔧 Tengo una ponchadura", "🔧 I have a flat", "tengo una ponchadura", "i have a flat tire");
  var ALIN = Q("📐 Alineación y balanceo", "📐 Alignment & balancing", "alineacion y balanceo", "alignment and balancing");
  function dirA() { return L("Están en " + C.dir + " (la dirección de su web).\n📞 " + C.tel, "They're at " + C.dir + " (the address on their website).\n📞 " + C.tel); }
  function horarioA() { return horarioTxt(); }
  function serviciosA() {
    return L("Lo que publica el taller (para autos, camionetas SUV y camionetas ligeras):\n• Llantas nuevas y rines (montaje de llantas)\n• Alineación computarizada\n• Balanceo computarizado de llantas y rines\n• Reparación de ponchaduras\n• Rotación de llantas y revisión de la presión\n• Amortiguadores y struts\n• Inspecciones de seguridad\n• Instalación de birlos y tuercas, válvulas\n¿Qué necesita para su vehículo?",
      "What the shop lists (for cars, SUVs and light trucks):\n• New tires and wheels (tire mounting)\n• Computerized alignment\n• Computerized tire and wheel spin balancing\n• Flat repair\n• Tire rotation and tire pressure checks\n• Shocks and struts\n• Safety inspections\n• Lug nut installation, valve stems\nWhat does your vehicle need?");
  }
  function noListA() {
    return L("Eso su web no lo nombra en su lista de servicios (es un taller de llantas y rines: alineación, balanceo, ponchaduras, amortiguadores, inspecciones…), así que no se lo voy a asegurar: se lo confirma el taller. Llame al " + C.tel + ", o déjeme su nombre y teléfono y le llaman ellos.",
      "Their site doesn't list that among its services (it's a tire & wheel shop: alignment, balancing, flats, shocks, inspections…), so I won't promise it: the shop will confirm. Call " + C.tel + ", or leave your name and number and they'll call you.");
  }
  function noPubA() {
    return L("Eso su web no lo dice, así que no se lo voy a inventar: se lo confirma el taller. Llame al " + C.tel + ", o déjeme su nombre y teléfono y le llaman ellos.",
      "Their site doesn't say, so I won't make it up: the shop will confirm. Call " + C.tel + ", or leave your name and number and they'll call you.");
  }
  function S(es, en) { return function () { return L(es, en); }; }
  var KB = [
    { id: "llantas", k: ["llantas", "llanta", "llantas nuevas", "neumaticos", "neumatico", "gomas", "cambiar llantas", "juego de llantas", "medida", "rin 17", "marcas", "que marcas", "michelin", "bridgestone", "goodyear", "bfg", "bf goodrich", "firestone", "cooper", "hankook", "continental", "kumho", "nitto", "toyo", "yokohama", "pirelli", "general", "falken", "nexen", "uniroyal", "dunlop", "tires", "tire", "new tires", "set of tires", "tire size", "brands", "what brands"],
      a: S("Sí: venden llantas nuevas («premium tire products», dice su web) y las montan ahí mismo. En su portada nombran BFG, General, Bridgestone, Hankook, Continental, Kumho, Cooper, Michelin, Dean, Nitto, Dunlop, Pirelli, Firestone, Summit, Fusion y Uniroyal, y en «Llantas» tienen logos de Toyo, Goodyear, Yokohama, Nexen, Falken y Mickey Thompson, entre otras. Si tienen su medida en existencia no lo publica: deje aquí la medida (la dice el costado de la llanta, por ejemplo 225/65R17) y el taller le confirma.",
        "Yes: they sell new tires (\"premium tire products\", their site says) and mount them on site. Their home page names BFG, General, Bridgestone, Hankook, Continental, Kumho, Cooper, Michelin, Dean, Nitto, Dunlop, Pirelli, Firestone, Summit, Fusion and Uniroyal, and the Tires page shows Toyo, Goodyear, Yokohama, Nexen, Falken and Mickey Thompson logos, among others. Whether your size is in stock isn't published: leave the size here (it's on the tire sidewall, e.g. 225/65R17) and the shop confirms."), c: [CITA_CHIP, TIRESP, LLAMADA_CHIP] },
    { id: "rines", k: ["rines", "rin", "aros", "wheels", "rims", "fuel", "vossen", "lexani", "american force", "american racing", "off road", "4x4", "levantada", "lifted"],
      a: S("Sí: su web tiene una página de «Rines» con logos de marcas como Fuel Off-Road, Vossen, Lexani, American Force, American Racing, Foose, US Mags, Asanti y HRE, entre otras, y hacen el montaje y el balanceo. Qué modelos o medidas tienen en existencia no lo publica: deje aquí lo que busca y el taller le confirma.",
        "Yes: their site has a Wheels page with brand logos like Fuel Off-Road, Vossen, Lexani, American Force, American Racing, Foose, US Mags, Asanti and HRE, among others, and they do mounting and balancing. Which models or sizes are in stock isn't published: leave what you're looking for and the shop confirms."), c: [CITA_CHIP, PAGE("Ver la página de rines", "See the wheels page", "wheels.html"), LLAMADA_CHIP] },
    { id: "ponchadura", k: ["llanta clavo", "llanta ponchada", "poncho llanta", "llanta baja aire", "tire nail", "ponchadura", "ponchada", "ponchado", "pinchadura", "pinchada", "llanta baja", "se me bajo", "clavo", "tornillo", "reparar llanta", "parche", "valvula", "flat", "flat tire", "flat repair", "puncture", "nail", "screw", "leak", "valve stem", "losing air"],
      a: S("Sí: reparan ponchaduras y cambian válvulas (está en su lista de servicios). Si la llanta se puede reparar o hay que cambiarla lo ve el taller al revisarla. Su web dice «llame hoy y saque una cita o venga directamente», pero no publica horario: déjeme su nombre y teléfono y le llaman para confirmar, o llame al " + C.tel + ".",
        "Yes: they repair flats and replace valve stems (it's on their service list). Whether the tire can be repaired or needs replacing, the shop decides when they check it. Their site says \"call us today and set an appointment or just walk in\", but it doesn't publish hours: leave your name and number and they'll call you to confirm, or call " + C.tel + "."), c: [LLAMADA_CHIP, TEL1, CITA_CHIP] },
    { id: "alineacion", k: ["presion de las llantas", "presion", "tire pressure", "alineacion", "alinear", "balanceo", "balancear", "vibra", "vibracion", "se va de lado", "jala", "volante chueco", "rotacion", "rotar", "alignment", "align", "balance", "balancing", "vibration", "shaking", "pulls", "rotation", "rotate"],
      a: S("Sí: su web lista alineación computarizada, balanceo computarizado de llantas y rines, y rotación de llantas. Si el auto vibra o se va de lado, el taller lo revisa y le dice qué hace falta («arreglamos solo lo que hace falta arreglar», dice su web). ¿Le dejo pedido el servicio?",
        "Yes: their site lists computerized alignment, computerized tire and wheel spin balancing, and tire rotation. If the car shakes or pulls, the shop checks it and tells you what's needed (\"we'll fix only what needs to be fixed\", their site says). Want me to request the service?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "amortiguadores", k: ["amortiguadores", "amortiguador", "struts", "suspension", "rebota", "golpetea", "shocks", "shock", "bouncing", "suspension"],
      a: S("Sí: amortiguadores y struts están en su lista de servicios. Qué marca o costo no lo publica: el taller revisa el vehículo y le confirma. ¿Le dejo el pedido?",
        "Yes: shocks and struts are on their service list. Brands and cost aren't published: the shop checks the vehicle and confirms. Want me to log the request?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "inspeccion", k: ["inspeccion", "inspeccion de seguridad", "inspeccion estatal", "revision", "revisar", "safety inspection", "inspection", "state inspection", "check my car", "sticker"],
      a: S("Su web lista «inspecciones de seguridad». Qué incluyen exactamente (por ejemplo, si es la inspección estatal de Texas) no lo detalla, así que se lo confirma el taller al " + C.tel + ", o déjeme su nombre y teléfono y le llaman.",
        "Their site lists \"safety inspections\". It doesn't detail what's included (e.g. whether it's the Texas state inspection), so the shop will confirm at " + C.tel + ", or leave your name and number and they'll call you."), c: [LLAMADA_CHIP, TEL1, CITA_CHIP] },
    { id: "mofle", k: ["mofle", "mofles", "escape", "silenciador", "catalizador", "muffler", "exhaust", "catalytic"],
      a: S("El título de su web dice «Tire and Muffler Shop», pero su lista de servicios no incluye escapes ni mofles, así que no se lo voy a asegurar: se lo confirma el taller al " + C.tel + ", o déjeme su nombre y teléfono y le llaman.",
        "Their site title says \"Tire and Muffler Shop\", but the service list doesn't include exhaust or mufflers, so I won't promise it: the shop will confirm at " + C.tel + ", or leave your name and number and they'll call you."), c: [LLAMADA_CHIP, TEL1] },
    { id: "nomaneja", k: ["no arranca", "no prende", "no enciende", "varado", "varada", "me quede", "emergencia", "urgente", "grua", "remolque", "remolcar", "a domicilio", "won t start", "wont start", "stranded", "broke down", "emergency", "urgent", "tow", "towing", "tow truck", "roadside", "mobile"],
      a: S("Lo siento. Su web no publica grúa ni servicio a domicilio, así que no se lo voy a prometer. Lo que sí hago: le dejo el pedido marcado como urgente y el taller le llama o le escribe y le dice cómo llevar el vehículo. También puede llamar al " + C.tel + ".",
        "Sorry to hear that. Their site doesn't list towing or mobile service, so I won't promise it. What I can do: log your request as urgent and the shop calls or texts you back and tells you how to get the vehicle there. You can also call " + C.tel + "."), c: [LLAMADA_CHIP, TEL1, CITA_CHIP] },
    { id: "nolist", k: ["frenos", "balatas", "pastillas", "aceite", "cambio de aceite", "afinacion", "aire acondicionado", "aire", "a c", "ac", "motor", "transmision", "electrico", "alternador", "bateria", "check engine", "luz del motor", "carroceria", "pintura", "vidrios", "parabrisas", "brakes", "pads", "oil", "oil change", "tune up", "air conditioning", "engine", "transmission", "electrical", "alternator", "battery", "body work", "paint", "windshield"], a: noListA, c: [TEL1, LLAMADA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "mecanica", "mecanico", "taller", "services", "what do you fix", "what do you do", "mechanic"], a: serviciosA, c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "oferta", "especial", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "deal", "special"],
      a: S("Los precios se los da el taller: esta recepción no da precios ni los inventa. Su web dice que trabajan «a precios justos y razonables» y que arreglan solo lo que hace falta. Lo que puedo hacer: dejarle pedida la cotización con su vehículo, la medida de llanta o el servicio, y le contactan.",
        "Pricing comes from the shop: this front desk doesn't quote or make up prices. Their site says they work \"at prices that are fair and reasonable\" and fix only what needs fixing. What I can do: request a quote with your vehicle, tire size or service, and they'll get back to you."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "pago", k: ["formas de pago", "como pago", "tarjeta", "efectivo", "debito", "credito", "visa", "mastercard", "amex", "american express", "discover", "payment", "pay", "card", "cash", "debit", "credit card"],
      a: S("Según los íconos de «Formas de pago» de su web aceptan Visa, MasterCard, American Express, Discover, tarjeta de débito y efectivo. Otras formas (financiamiento, Zelle, etc.) no las publica: se las confirma el taller.",
        "Per the \"Payment options\" icons on their site they take Visa, MasterCard, American Express, Discover, debit and cash. Other options (financing, Zelle, etc.) aren't published: the shop will confirm."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nopub", k: ["garantia", "garantias", "usadas", "llantas usadas", "seminuevas", "financiamiento", "a plazos", "zelle", "cuanto tarda", "cuanto tiempo", "mismo dia", "flotilla", "camion", "trailer", "comercial", "warranty", "used tires", "used", "financing", "how long", "same day", "fleet", "semi", "commercial"], a: noPubA, c: [TEL1, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llegar", "llegar sin avisar", "necesito cita", "dejar el carro", "dejar el auto", "voy ahora", "without appointment", "drop by", "stop by", "come in now", "need an appointment"],
      a: S("Su web dice: «llame hoy y saque una cita, o venga directamente» (just walk in). Lo que no publica es el horario, así que no le puedo decir si ahora están atendiendo. Para no ir en balde: déjeme su nombre y teléfono y le llaman para confirmar, o llame al " + C.tel + ".",
        "Their site says: \"Call us today and set an appointment or just walk in.\" What it doesn't publish is business hours, so I can't tell you whether they're open right now. To be safe: leave your name and number and they'll call you to confirm, or call " + C.tel + "."), c: [LLAMADA_CHIP, TEL1, CITA_CHIP] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue", "bilingual", "se habla"],
      a: S("Sí: su web dice «Hablamos español e inglés». Aquí también le atiendo en los dos idiomas (botón EN arriba) y anoto en qué idioma prefiere que le contacten.", "Yes: their site says \"Hablamos Español y Inglés\" (they speak Spanish and English). I can help you in English or Spanish too (ES button at the top)."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "historia", k: ["dueno", "quien", "quienes son", "experiencia", "historia", "confianza", "desde cuando", "anos", "bbb", "resenas", "opiniones", "silla de ruedas", "accesible", "owner", "who", "experience", "trust", "since when", "years", "reviews", "wheelchair", "accessible"],
      a: S("Martinez Tire & Auto Center es un taller de llantas y rines de San Antonio que atiende desde 1987. Su web dice que tratan a sus clientes con respeto, que dan un diagnóstico honesto y arreglan solo lo que hace falta, a precios justos y razonables. Muestra el sello BBB Accredited Business, reseñas en Google, Facebook y YP, y su local tiene acceso para sillas de ruedas.",
        "Martinez Tire & Auto Center is a San Antonio tire & wheel shop in business since 1987. Their site says they treat customers with respect, give an honest diagnosis and fix only what needs to be fixed, at fair and reasonable prices. It shows the BBB Accredited Business seal, reviews on Google, Facebook and YP, and the shop is wheelchair accessible."), c: [CITA_CHIP, PAGE("Ver «Por qué elegirnos»", "See \"Why Choose Us\"", "why-choose-us.html")] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "abiertos", "cierran", "a que hora", "sabado", "domingo", "fin de semana", "lunes", "hoy abren", "estan abiertos", "hours", "open", "close", "closing", "saturday", "sunday", "weekend", "open today", "open now"], a: horarioA, c: [LLAMADA_CHIP, TEL1, CITA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "o connor", "oconnor", "address", "location", "where", "directions", "located"],
      a: function () { return dirA() + L("\nSu web no publica horario: si quiere, le dejo pedido el servicio y el taller le confirma día y hora.", "\nTheir site doesn't publish hours: I can request the service and the shop confirms the day and time."); }, c: [MAPS1, CITA_CHIP, LLAMADA_CHIP] },
    { id: "contacto", k: ["telefono", "telefonos", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "formulario", "facebook", "phone", "number", "call", "text", "contact", "form"],
      a: S("Canales que publica el taller:\n📞 (210) 646-8911\n✉️ Correo: LMTZ91@ATT.NET\n📝 El formulario de «Contacto» (dice que le responden «lo antes posible»)\nSu web no publica WhatsApp ni horario de atención. O deje aquí su nombre y teléfono y le llaman ellos.",
        "Channels the shop publishes:\n📞 (210) 646-8911\n✉️ Email: LMTZ91@ATT.NET\n📝 The \"Contact Us\" form (it says they'll reply \"as soon as possible\")\nTheir site doesn't list WhatsApp or business hours. Or leave your name and number here and they'll call you."), c: [TEL1, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: S("¡Con gusto! Si necesita algo más, aquí estoy. 🛞", "You're welcome! I'm here if you need anything else. 🛞"), c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "estimacion", "agendar", "reservar", "turno", "programar", "llevar el carro", "llevar mi carro", "llevar mi auto", "llevar mi troca", "appointment", "estimate", "quote", "book", "schedule", "bring my car"];
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
  function wantsCita(n) { var ut = toks(n); return CITA_K.some(function (ph) { var pt = toks(ph); return pt.length && pt.every(function (k) { return ut.indexOf(k) >= 0 || (k.length >= 5 && ut.some(function (u) { return u.length >= 5 && u.slice(0, 5) === k.slice(0, 5); })); }); }); }
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "truck", "are", "your", "can", "open", "hours", "much", "tire", "tires", "flat", "need", "want", "when", "where", "does", "have", "i", "not", "won", "start"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|auto|camioneta)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|camioneta|troca|precio|horario|donde|necesito|quiero|mi carro|mi auto|gracias|cual|llanta|llantas|rines|ponchadura|alineacion|balanceo|espanol)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/\(?210\)?[- ]646-8911/g, function (m) { return '<a href="tel:+12106468911">' + m + '</a>'; }).replace(/LMTZ91@ATT\.NET/gi, function (m) { return '<a href="mailto:LMTZ91@ATT.NET">' + m + '</a>'; }); }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var m = el("div", "r24-msg r24-user"); m.textContent = t; body.appendChild(m); scroll(); }
  function addBot(t, chips, cls) {
    t = String(t).replace(/([ap]\. ?m\.)\.(?=\s|$|\))/g, "$1");   // «8:00 a.m..» -> «8:00 a.m.»
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
    status.textContent = L("🕐 Su web no publica horario · el taller le confirma por teléfono · " + C.tel, "🕐 No business hours on their site · the shop confirms by phone · " + C.tel);
  }
  function menuChips() { return [CITA_CHIP, NUEVAS, PONCH, ALIN, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · San Antonio, TX";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk"));
    banner.textContent = L("Demo privada preparada para Martinez Tire & Auto Center", "Private demo prepared for Martinez Tire & Auto Center");
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
    addBot(L("Claro. Llame al " + C.tel + " y le atiende una persona del taller (su web no publica el horario de atención). Si prefiere, le contactan ellos: déjeme su nombre y teléfono y el pedido les llega al instante.",
      "Sure. Call " + C.tel + " and a person at the shop will help you (their site doesn't publish business hours). Or they can reach out to you: leave your name and number and they get the request instantly."), [TEL1(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy el asistente virtual con IA de Martinez Tire & Auto Center (llantas y rines en San Antonio desde 1987). Le ayudo a pedir llantas o un servicio (alineación, balanceo, ponchaduras, amortiguadores…), le tomo los datos para que el taller le llame, o le cuento servicios y dirección, a cualquier hora: también de noche y el fin de semana, o cuando nadie puede atender el teléfono.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the AI virtual assistant for Martinez Tire & Auto Center (tires and wheels in San Antonio since 1987). I can request tires or a service (alignment, balancing, flats, shocks…), take your details so the shop calls you back, or answer questions about services and location — any time, including nights and weekends, or when nobody can pick up the phone.\nHow can I help?"), menuChips());
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
  // Qué le pasa, con los servicios que publica su web
  function SINT() { return lang === "en" ? ["New tires", "Flat repair", "Alignment / balancing", "Shocks and struts", "Safety inspection", "Wheels", "Other / not sure"]
    : ["Llantas nuevas", "Reparar una ponchadura", "Alineación / balanceo", "Amortiguadores y struts", "Inspección de seguridad", "Rines", "Otra cosa / no sé"]; }
  function ESTADO() { return opts([L("✅ Anda, puedo llevarlo", "✅ It runs, I can drive it in"), L("⚠️ Anda, pero con la llanta baja o con falla", "⚠️ It runs, but with a low tire or a problem"), L("⛔ No puedo moverlo", "⛔ I can't move it")]); }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function MEDIO() { return opts([L("📞 Llamada", "📞 Phone call"), L("💬 Mensaje de texto", "💬 Text message")]); }
  function franjas() {
    return opts([L("Por la mañana", "Morning"), L("Por la tarde", "Afternoon"), L("Me da igual", "Either is fine")]);
  }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Cotización de llantas o servicio", "Quote for tires or service"), L("Cita para llevar el vehículo", "Appointment to bring the vehicle in")]));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || L("Consulta general", "General question")).slice(0, 120) } };
    addBot(L("¡Claro! Le contacta una persona del taller, por llamada o por mensaje de texto. Solo necesito unos datos.\n¿Cuál es su nombre? (Escriba «cancelar» si quiere salir.)", "Sure! Someone from the shop will reach out by phone call or text. I just need a few details.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function normTel(t) { var ph = String(t || "").replace(/[\s().+-]/g, ""); if (/^1\d{10}$/.test(ph)) ph = ph.slice(1); return /^[2-9]\d{9}$/.test(ph) ? ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6) : ""; }
  function cap(s) { return String(s || "").trim().split(/\s+/).filter(Boolean).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ").slice(0, 60); }
  // Su formulario «Contact Us» le entrega el pedido a la recepción, que confirma al instante y pide lo que falta
  function fromForm(f) {
    f = f || {};
    var nm = cap(f.name);
    var d = { tipo: "cita", form: true, servicio: L("Consulta (formulario «Contacto»)", "Question (\"Contact Us\" form)"),
      nombre: nm.length >= 2 ? nm : "", telefono: normTel(f.tel), email: String(f.email || "").trim().slice(0, 60), vehiculo: "", sintoma: String(f.msg || "").trim().slice(0, 120) };
    open("form");
    flow = { step: "vehiculo", d: d };
    addUser(L("📝 Formulario «Contacto»", "📝 \"Contact Us\" form") + "\n" + [nm, f.tel, d.email, d.sintoma].filter(Boolean).join(" · "));
    addBot(L("¡Recibido" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Su mensaje ya le llegó al taller: no se queda esperando a que le respondan «lo antes posible». " + aviso() + "\nPara dejarlo completo, unas preguntas rápidas.",
      "Got it" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Your message already reached the shop: no waiting for them to reply \"as soon as possible\". " + aviso() + "\nA few quick questions to complete it."));
    setTimeout(function () { ask(flow.step); }, 700);
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
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del vehículo? Si la sabe, también la medida de la llanta (por ejemplo: 2018 Chevrolet Silverado, 265/70R17).", "Year, make and model? If you know it, the tire size too (e.g. 2018 Chevrolet Silverado, 265/70R17)."));
    else if (step === "sintoma") addBot(L("¿Qué necesita?", "What do you need?"), opts(SINT()));
    else if (step === "estado") addBot(L("¿El vehículo anda? (Solo lo anoto para el taller; su web no publica grúa ni servicio a domicilio.)", "Does the vehicle run? (I just note it for the shop; their site doesn't list towing or mobile service.)"), ESTADO());
    else if (step === "foto") { if (d.foto) { ask("dia"); return; } addBot(L("¿Tiene una foto (del costado de la llanta con la medida, de la ponchadura o del desgaste)? Es opcional y ayuda al taller a prepararle la cotización.", "Do you have a photo (the tire sidewall with the size, the flat or the wear)? It's optional and helps the shop prepare your quote."), FOTO()); }
    else if (step === "dia") {
      var days = nextDays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia: como su web no publica horario, el taller le confirma el día y la hora por teléfono.", "Which day works best? I'll note it as a preference: since their site doesn't publish hours, the shop confirms the day and time by phone."),
        opts(days.map(function (x) { return x.label; })).concat(opts([L("Lo antes posible", "As soon as possible")])));
    }
    else if (step === "franja") addBot(L("¿En qué momento del día prefiere? (También es preferencia: el taller le confirma.)", "What time of day do you prefer? (Also a preference: the shop confirms.)"), franjas());
    else if (step === "nombre") addBot(L("¿Cuál es su nombre?", "What's your name?"));
    else if (step === "medio") addBot(L("Gracias, " + d.nombre + ". ¿Prefiere que le llamen o que le manden un mensaje de texto?", "Thanks, " + d.nombre + ". Would you rather get a call or a text?"), MEDIO());
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto. ¿A qué teléfono le " + (/texto/i.test(medioTxt(d)) ? "escriben" : "llaman") + "?", "Great. What number should they " + (/text/i.test(medioTxt(d)) ? "text" : "call") + "?") : L("Último paso: ¿a qué teléfono le contactan para confirmar?", "Last step: what number should they use to confirm?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revise su solicitud de contacto:\n👤 Nombre: ", "Please review your contact request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Vehículo: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n🔧 Qué le pasa: ", "\n🔧 Problem: ") + d.sintoma + L("\n🚦 Estado: ", "\n🚦 Status: ") + d.estado + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + (d.email ? L("\n✉️ Correo: ", "\n✉️ Email: ") + d.email : "") + "\n\n" + aviso() + q, B, "r24-sum");
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
          : L("Bien. Aquí no doy precios: la cotización se la da el taller después de ver los datos o el vehículo.", "Got it. I don't quote prices here: the quote comes from the shop after reviewing the details or the vehicle."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60);
        var nx = d.form && d.sintoma ? "estado" : "sintoma";
        ask(nx); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask("estado"); return;
      case "estado":
        d.estado = t.slice(0, 50);
        if (/no puedo moverlo|can.t move/i.test(n)) addBot(L("Anotado: el taller ve en el pedido que no puede mover el vehículo y le dice qué hacer. No le prometo grúa ni servicio a domicilio porque su web no los ofrece.", "Noted: the shop will see you can't move the vehicle and tell you what to do. I won't promise a tow or mobile service since their site doesn't offer them."));
        setTimeout(function () { ask("foto"); }, /moverlo|move/i.test(n) ? 700 : 0); return;
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
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (con código de área), por ejemplo 210-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 210-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)"), tx = /texto|text/i.test(medioTxt(d));
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le " + (tx ? "escribe" : "llama") + " al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will " + (tx ? "text" : "call") + " you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su solicitud quedó registrada en Martinez Tire & Auto Center.\nEl taller le " + (tx ? "escribe" : "llama") + " al " + d.telefono + " para confirmar el día y la hora; la cotización se la dan ellos.", "All set, " + nm2 + "! ✅ Your request is in at Martinez Tire & Auto Center.\nThe shop will " + (tx ? "text" : "call") + " you at " + d.telefono + " to confirm the day and time; the quote comes from them.") + DEMO, [MAPS1(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
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
    addBot(L("Eso se lo confirma mejor el taller, así tiene el dato exacto. 😊\nLlame al " + C.tel + ", o déjeme su nombre y teléfono y le llaman ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall " + C.tel + ", or leave your name and number and they'll call you."), [TEL1, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot(L("Claro, ¿qué más quiere saber?", "Sure, what else would you like to know?"), menuChips()); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué le puedo ayudar? Le pido llantas o un servicio, le tomo los datos para que le llamen y le cuento servicios y dirección.", "Hi! How can I help? I can request tires or a service, take your details for a call back, and tell you about services and location."), menuChips()); return; }
    if (/^(horario y direccion|hours and address)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [LLAMADA_CHIP, MAPS1, CITA_CHIP]); return; }
    if (/^(llantas nuevas|new tires)$/.test(n)) { reply(byId("llantas")); return; }
    if (/^(tengo una ponchadura|i have a flat tire)$/.test(n)) { reply(byId("ponchadura")); return; }
    if (/^(alineacion y balanceo|alignment and balancing)$/.test(n)) { reply(byId("alineacion")); return; }
    if (/\b(que me llamen|llamenme|que me escriban|escribanme|textean|call me back|text me|callback|call back)\b/.test(n)) { startLlamada(); return; }
    if (/\b(persona|humano|alguien real|asesor|person|human|someone real|real person)\b/.test(n)) { humano(); return; }
    if (isWalkinQ(n)) { reply(byId("walkin")); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && !(bi && bi.e && bi.e.id === "precio" && /\?|es gratis|is it free|sin compromiso|no obligation/.test(t)) && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|quote|schedule|book/.test(n))) { startCita(); return; }
    if (price && !(bi && (bi.e.id === "nolist" || bi.e.id === "mofle"))) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, fromForm: function (f) { if (panel) fromForm(f); }, setLang: function (l) { if (panel) setLang(l === "en" ? "en" : "es", opened); }, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
