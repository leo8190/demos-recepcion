/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Reinaldo Paint & Body Shop (taller familiar de chapa, pintura y colisión desde 1977; 7700 NW 72nd Ave, Medley, FL 33166) — DEMO privada, bilingüe ES/EN.
   Sale de plantilla-widget/recepcion.base.js (reglas del brief 18/10 + R24-HUMANO), en la variante de talleres ES/EN (All About Diesel / Cardenas), con trato de
   «tú» en español, como su web («Llámanos y remolcaremos tu carro», «Trae tu vehículo»…).
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica reinaldobodyshop.com (revisada el 19/10/2026): Inicio (ES) y Home english (EN), una sola página por idioma.
   - Teléfono (305) 885-4080 (el único; en su web el único enlace tel: está mal armado y los otros 3 botones «Estimados gratis - llámanos ahora» no llaman).
     Formulario «Selecciona tu servicio» (Colisión / Reclamo de seguro, Pintura, Personalización; nombre, tel., email obligatorio, mensaje, reCAPTCHA).
     No publican WhatsApp ni email. Redes: Instagram, Facebook, YouTube, LinkedIn.
   - Horario: su web NO publica horario ni días. La demo no inventa «abierto/cerrado» ni horas: lo dice así y el taller confirma por teléfono.
   - Servicios: reparación de colisiones, chasis y estructura, vidrios y parabrisas (también a domicilio: «vamos hasta usted»), reparación o renovación de
     pintura (capa base, capa transparente, reacabado en 3 etapas; uretano, esmalte, laca y uretano acrílicos; sólida, metalizada, perlada y mate), daños por
     granizo, eliminación de abolladuras y reparación sin pintura, escaneo de diagnóstico, guardabarros, parachoques, carrocería de aluminio y personalización
     (body kits, lip kits, faldones, alerones, kits de parachoques, wide-body, full body; fibra de vidrio, poliuretano y fibra de carbono). Todo tipo de vehículos.
   - Lo que dice «¿Por qué Reinaldo?»: su personal se encarga de todos los reclamos de seguros y la facturación; «Llámanos y remolcaremos tu carro»; coordinan
     el alquiler de tu carro con la compañía de seguros y, si el seguro no lo cubre, te ayudan con un descuento especial en el alquiler; te entregan el carro
     cuando está listo, con lavado exterior, limpieza interior y de neumáticos. Estimados gratis. Gold Class I-CAR, ASE y Geico Express; todas las principales
     aseguradoras. Empresa familiar fundada en 1977. Google 4.3 ★ (49 reseñas, widget de su web).
   Sin precios ni cifras (su web no publica ninguno), sin WhatsApp; no promete costo del remolque, financiamiento, formas de pago, tiempos, garantía con plazos,
   mecánica (motor, frenos, aceite, A/C), llantas ni nada que su web no liste. */
(function () {
  "use strict";
  var C = {
    nombre: "Reinaldo Paint & Body Shop", corto: "Reinaldo Paint & Body Shop",
    tel: "(305) 885-4080", telh: "+13058854080",
    dir: "7700 NW 72nd Ave, Medley, FL 33166", maps: "https://www.google.com/maps/dir/?api=1&destination=Reinaldo+Paint+%26+Body+Shop+7700+NW+72nd+Ave+Medley+FL+33166"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  // Horario: su web no lo publica (ni días ni horas). No se inventa: el taller confirma por teléfono.
  function horarioTxt() {
    return L("Su web no publica horario de atención (ni días ni horas), así que no te lo voy a inventar: el taller te lo confirma al " + C.tel + ".\nYo te tomo el pedido a cualquier hora, también de noche o el fin de semana, y el taller lo recibe al instante.",
      "Their website doesn't publish business hours (no days or times), so I won't make them up: the shop will confirm at " + C.tel + ".\nI can take your request any time, even at night or on the weekend, and the shop gets it instantly.");
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
  function dayLabel(dt) { var dn = DIAS[lang][dt.getDay()]; return lang === "en" ? dn + ", " + MESES.en[dt.getMonth()] + " " + dt.getDate() : dn.charAt(0).toUpperCase() + dn.slice(1) + " " + dt.getDate() + " " + MESES.es[dt.getMonth()]; }
  // próximos días como preferencia (no se sabe qué días abren: el taller confirma)
  function nextDays(n, k) {
    var out = [];
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

  var CITA_CHIP = { a: "cita", get t() { return L("🧾 Estimado gratis o cita", "🧾 Free estimate or appointment"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen o escriban", "📲 Call or text me back"); } };
  function aviso() { return L("🔔 El taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL() { return { t: L("Llamar al ", "Call ") + C.tel, tel: C.telh }; }
  function T911() { return { t: L("Llamar al 911", "Call 911"), tel: "911", cls: "r24-911" }; }
  function MAPS() { return { t: L("Cómo llegar (Google Maps)", "Directions (Google Maps)"), url: C.maps }; }
  function PAGE(es, en, anchor) { return function () { return { t: L(es, en), url: (lang === "es" ? "es-index.html" : "index.html") + anchor, self: true }; }; }
  var REVP = PAGE("Ver reseñas", "See reviews", "#reviews");
  var CERTP = PAGE("Ver certificaciones", "See certifications", "#certifications");
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & address", "horario y direccion", "hours and address");
  var CHOQUE = Q("🚗 Tuve un choque", "🚗 I had a crash", "tuve un choque", "i had a crash");
  var SEGURO = Q("🛡️ Seguro, remolque y alquiler", "🛡️ Insurance, towing & rental", "seguro remolque alquiler", "insurance towing rental");
  function dirA() { return L("📍 " + C.dir + " («centralmente localizados»)\n📞 " + C.tel, "📍 " + C.dir + " (\"centrally located\")\n📞 " + C.tel); }
  function horarioA() { return horarioTxt(); }
  function serviciosA() {
    return L("Lo que publica el taller (chapa, pintura y colisión desde 1977; todo tipo de vehículos):\n• Reparación de colisiones · chasis y estructura\n• Parachoques · guardabarros · carrocería de aluminio\n• Eliminación de abolladuras · reparación sin pintura · daños por granizo\n• Reparación o renovación de pintura (capa base, capa transparente, reacabado en 3 etapas)\n• Parabrisas y vidrios, también a domicilio («vamos hasta usted»)\n• Escaneo de diagnóstico\n• Personalización: body kits, lip kits, faldones, alerones, kits de parachoques, wide-body\nY se encargan de los reclamos al seguro. ¿Qué le pasó a tu carro?",
      "What the shop lists (auto body, paint and collision since 1977; all types of vehicles):\n• Collision repair · frame and structural repairs\n• Bumper · fender · aluminum body repair\n• Dent removal · paintless dent repair · hail damage repair\n• Paint repair or refinish (base coat, clear coat, 3-stage refinishing)\n• Windshield and auto glass, mobile too (\"we come to you\")\n• Diagnostic scanning\n• Customization: body kits, lip kits, side skirts, spoilers, bumper kits, wide-body\nAnd they handle insurance claims. What happened to your car?");
  }
  function noListA() {
    return L("Eso no aparece entre los servicios de su web (es un taller de chapa, pintura y colisión), así que no te lo voy a asegurar. Llama al " + C.tel + " o déjame tu teléfono y te contactan ellos.",
      "That isn't among the services on their website (it's an auto body, paint and collision shop), so I won't promise it. Call " + C.tel + " or leave your number and they'll get back to you.");
  }
  function noPubA() {
    return L("Eso su web no lo dice, así que no te lo voy a inventar: te lo confirma el taller. Llama al " + C.tel + " o déjame tu teléfono y te contactan ellos.",
      "Their site doesn't say, so I won't make it up: the shop will confirm. Call " + C.tel + " or leave your number and they'll get back to you.");
  }
  function S(es, en) { return function () { return L(es, en); }; }
  var KB = [
    { id: "choque", k: ["choque", "chocaron", "me chocaron", "tuve un choque", "accidente", "colision", "colisión", "me pegaron", "golpe", "siniestro", "crash", "had a crash", "accident", "collision", "got hit", "wreck", "fender bender"],
      a: S("Lo siento. Primero lo importante: si hay heridos o peligro en la vía, llama al 911. Para el carro, su web dice que reparan colisiones (desde golpes chicos hasta daños estructurales grandes), que su personal se encarga de todos los reclamos de seguros y la facturación, y «Llámanos y remolcaremos tu carro». Te dejo pedido el estimado gratis ahora; una foto del daño ayuda mucho.",
        "Sorry to hear that. First things first: if anyone is hurt or there's danger on the road, call 911. For the car, their site says they repair collisions (from minor dents to large structural damage), their staff handles all insurance claims and billing, and \"Call us and we'll tow your car\". I can request your free estimate now; a photo of the damage helps a lot."), c: [CITA_CHIP, TEL, T911] },
    { id: "seguro", k: ["seguro", "aseguradora", "reclamo", "reclamo al seguro", "claim", "insurance", "geico", "progressive", "state farm", "allstate", "deducible", "deductible", "ajustador", "adjuster", "facturacion", "billing"],
      a: S("Su web dice que su personal «se encargará de todos los reclamos de seguros y facturación» y responde tus preguntas; trabajan para todas las principales compañías de seguros y son taller Geico Express, Gold Class I-CAR y ASE. Lo de tu póliza (cobertura, deducible) no lo publican: te lo ven ellos con tu caso.",
        "Their site says their staff \"will handle all insurance claims and billing\" and answers your questions; they work with all major insurance companies and are a Geico Express, I-CAR Gold Class and ASE shop. Your policy details (coverage, deductible) aren't published: they'll look at your case."), c: [CITA_CHIP, LLAMADA_CHIP, TEL] },
    { id: "remolque", k: ["remolque", "remolcar", "remolcan", "grua", "grúa", "no anda", "no prende", "no arranca", "no camina", "tow", "towing", "tow truck", "won t start", "not drivable", "undrivable"],
      a: S("Su web dice: «Llámanos y remolcaremos tu carro» (hasta el taller). Lo que no publica es el costo ni los horarios del remolque, así que eso te lo confirma el taller al " + C.tel + ". Si quieres, te dejo el pedido con el carro marcado como «necesita remolque» y te contactan.",
        "Their site says: \"Call us and we'll tow your car\" (to the shop). It doesn't publish the cost or hours for towing, so the shop will confirm that at " + C.tel + ". If you like, I'll log your request with the car marked \"needs a tow\" and they'll get back to you."), c: [TEL, CITA_CHIP, LLAMADA_CHIP] },
    { id: "alquiler", k: ["alquiler", "carro de alquiler", "rentar", "renta", "auto de reemplazo", "carro prestado", "rental", "rental car", "rent a car", "loaner"],
      a: S("Su web dice que, mientras reparan tu carro, coordinan el alquiler con la compañía de seguros, y que si tu seguro no te cubre el alquiler, como cortesía te ayudan con un descuento especial. El monto del descuento no lo publican: te lo dice el taller.",
        "Their site says that while your car is being repaired they coordinate your rental with the insurance company, and if your insurance doesn't cover a rental, as a courtesy they help you with a special discount. The discount amount isn't published: the shop will tell you."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "pintura", k: ["pintura", "pintar", "repintar", "despintado", "rayon", "rayones", "rayado", "color", "capa", "barniz", "clear coat", "metalizada", "perlada", "mate", "paint", "repaint", "scratch", "scratches", "refinish", "matte", "pearl", "metallic"],
      a: S("Sí: pintura. Su web dice «Trae tu vehículo a nuestras instalaciones de pintura… y restauraremos esa apariencia de pintura nueva»: reparación o renovación de pintura con capa base, capa transparente y reacabado en 3 etapas; tipos uretano, esmalte acrílico, laca acrílica y uretano acrílico; acabados sólido, metalizado, perlado y mate. Una foto ayuda para el estimado.",
        "Yes: paint. Their site says \"Bring your vehicle to our auto paint facility… and we'll restore that new car paint look\": paint repair or refinish with base coat, clear coat and 3-stage refinishing; urethane, acrylic enamel, acrylic lacquer and acrylic urethane; solid, metallic, pearlescent and matte finishes. A photo helps with the estimate."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "abolladura", k: ["abolladura", "abolladuras", "hundido", "hundida", "granizo", "sin pintura", "pdr", "dent", "dents", "dented", "hail", "paintless"],
      a: S("Sí: su web lista eliminación de abolladuras, reparación de abolladuras sin pintura y reparación de daños por granizo. Si me mandas una foto, el taller te prepara mejor el estimado gratis.",
        "Yes: their site lists dent removal, paintless dent repair and hail damage repair. If you send a photo, the shop can prepare your free estimate better."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "parachoques", k: ["parachoques", "bumper", "defensa", "guardabarros", "guardafango", "salpicadera", "fender", "chasis", "estructura", "estructural", "frame", "structural", "aluminio", "aluminum"],
      a: S("Sí: su web lista reparación de parachoques, de guardabarros, reparaciones de chasis y estructuras y de carrocería de aluminio. «Desde pequeñas abolladuras y rayones hasta grandes daños estructurales».",
        "Yes: their site lists bumper repair, fender repair, frame and structural repairs and aluminum body repair. \"From minor dents and scratches to large structural damage.\""), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "vidrio", k: ["vidrio", "vidrios", "parabrisas", "cristal", "ventana", "a domicilio", "vienen", "windshield", "glass", "window", "mobile glass", "come to me"],
      a: S("Sí: su web lista reparación de parabrisas y de vidrios de automóviles, también a domicilio («vamos hasta usted»). La zona que cubren a domicilio no la publican: te la confirma el taller.",
        "Yes: their site lists windshield and auto glass repair, including mobile auto glass repair (\"we come to you\"). The area they cover isn't published: the shop will confirm."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "personalizacion", k: ["personalizacion", "personalizar", "body kit", "bodykit", "kit", "kits", "alerón", "aleron", "spoiler", "faldones", "lip kit", "wide body", "widebody", "fibra de carbono", "fibra de vidrio", "custom", "customization", "upgrade", "side skirts", "carbon fiber", "fiberglass"],
      a: S("Sí: «¿Fanático de los carros? ¡Personaliza al máximo el look de tu carro!». Su web lista body kits, lip kits, faldones laterales, kits de alerones, kits de parachoques, wide-body y carrocería completa, en fibra de vidrio, poliuretano o fibra de carbono. Cuéntame qué tienes en mente y te lo dejo pedido.",
        "Yes: \"Car enthusiast? Customize the look of your car to the max!\" Their site lists body kits, lip kits, side skirts, spoiler kits, bumper kits, wide-body and full body kits, in fiberglass, polyurethane or carbon fiber. Tell me what you have in mind and I'll request it."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "diagnostico", k: ["escaneo", "escaner", "diagnostico", "sensores", "luces del tablero", "scan", "scanning", "diagnostic", "sensors"],
      a: S("Su web lista «escaneo de diagnóstico» dentro de las reparaciones de colisión. Para otra cosa (mecánica general) no lo publican: te lo confirma el taller.",
        "Their site lists \"diagnostic scanning\" as part of collision repairs. For anything else (general mechanical work) it isn't published: the shop will confirm."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "entrega", k: ["entregan", "entrega", "lavado", "limpieza", "lavan", "detallado", "deliver", "delivery", "wash", "cleaning", "detailing"],
      a: S("Su web dice: «Te entregaremos tu carro cuando esté listo», y que antes de entregarlo le hacen lavado exterior, limpieza interior y limpieza de neumáticos. Un detallado aparte no lo publican como servicio: te lo confirma el taller.",
        "Their site says: \"We'll deliver your car when ready\", and that before delivering it they do an exterior wash, interior cleaning and tire cleaning. Standalone detailing isn't listed as a service: the shop will confirm."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nolist", k: ["motor", "frenos", "freno", "aceite", "cambio de aceite", "transmision", "caja", "aire acondicionado", "a c", "llanta", "llantas", "neumatico", "alineacion", "balanceo", "afinacion", "bateria", "mecanica", "mecanico", "engine", "brakes", "oil change", "transmission", "air conditioning", "tire", "tires", "alignment", "tune up", "battery", "mechanic", "moto", "motorcycle"], a: noListA, c: [TEL, LLAMADA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "chapa", "chapisteria", "hojalateria", "carroceria", "carrocería", "body shop", "body work", "services", "what do you fix", "what do you do", "repairs"], a: serviciosA, c: [CITA_CHIP, SEGURO, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "estimado gratis", "presupuesto gratis", "es gratis", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "free estimate"],
      a: S("Los precios te los da el taller, y su web no publica ninguno. Lo que sí dice: «ESTIMADOS GRATIS». Te dejo pedido el tuyo con tu carro, lo que le pasó y una foto si quieres, y te contactan.",
        "Pricing comes from the shop, and their site doesn't publish any. What it does say: \"FREE ESTIMATES\". I can request yours with your car, what happened and a photo if you like, and they'll get back to you."), c: [CITA_CHIP, TEL, LLAMADA_CHIP] },
    { id: "garantia", k: ["garantia", "garantía", "garantizan", "warranty", "guarantee"],
      a: S("Su web dice «Garantizamos la satisfacción de nuestros clientes a través de un trabajo de calidad». Los términos de una garantía (qué cubre, plazos) no los publica: te los confirma el taller.",
        "Their site says \"We guarantee our customers' satisfaction through quality work\". Warranty terms (coverage, duration) aren't published: the shop will confirm."), c: [TEL, LLAMADA_CHIP, CITA_CHIP] },
    { id: "nopub", k: ["financiamiento", "financiar", "a plazos", "plan de pagos", "credito", "zelle", "efectivo", "tarjeta", "formas de pago", "como pago", "cuanto tarda", "cuanto tiempo", "cuantos dias", "mismo dia", "financing", "payment plan", "credit", "cash", "card", "payment", "how long", "same day", "turnaround"], a: noPubA, c: [TEL, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llegar", "llegar sin avisar", "necesito cita", "dejar el carro", "without appointment", "drop by", "stop by", "drop off", "need an appointment"],
      a: S("Su web no dice si atienden sin cita y no publica horario. Para no ir en balde, te dejo aquí pedido el estimado o la cita y el taller te confirma día y hora, o llama al " + C.tel + ".",
        "Their site doesn't say whether they take walk-ins and doesn't publish hours. To be safe, I can request the estimate or appointment here and the shop confirms the day and time, or call " + C.tel + "."), c: [CITA_CHIP, TEL] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue", "bilingual"],
      a: S("Su web está en español y en inglés. Aquí te atiendo en los dos idiomas (botón EN arriba).", "Their website is in English and Spanish. I can help you in either one (ES button at the top)."), c: [CITA_CHIP] },
    { id: "historia", k: ["dueno", "quien", "quienes son", "familia", "familiar", "1977", "certificado", "certificados", "certificacion", "i car", "icar", "ase", "experiencia", "historia", "resenas", "opiniones", "confianza", "owner", "who", "family", "certified", "certification", "experience", "reviews", "trust"],
      a: S("Reinaldo Paint & Body Shop es una empresa familiar fundada en 1977, especializada en reparaciones de carrocería. Su web dice que están certificados Gold Class I-CAR, ASE y Geico Express, para todas las principales aseguradoras y todo tipo de vehículos. En Google tienen 4.3 estrellas con 49 reseñas (widget de su web). Su lema: «¡Nada supera la experiencia!».",
        "Reinaldo Paint & Body Shop is a family-owned business established in 1977, specializing in auto body repairs. Their site says they're I-CAR Gold Class, ASE and Geico Express certified, for all major insurance companies and all types of vehicles. On Google they have 4.3 stars from 49 reviews (widget on their site). Their line: \"Since 1977, no one beats experience!\""), c: [CITA_CHIP, REVP, CERTP] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "abiertos", "cierran", "a que hora", "sabado", "domingo", "fin de semana", "lunes", "hoy abren", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, TEL] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "medley", "72nd", "doral", "hialeah", "address", "location", "where", "directions", "located"],
      a: function () { return dirA() + L("\nSi quieres, te dejo pedido el estimado o la cita desde aquí y el taller te confirma.", "\nI can request the estimate or appointment from here and the shop confirms."); }, c: [MAPS, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "formulario", "instagram", "facebook", "phone", "number", "call", "text", "contact", "form"],
      a: S("Canales que publica el taller:\n📞 Teléfono: " + C.tel + "\n📝 El formulario «Selecciona tu servicio», al final de la página\nTambién tienen Instagram, Facebook, YouTube y LinkedIn. No publican WhatsApp ni email. O deja aquí tu teléfono y te contactan ellos, por llamada o por texto.",
        "Channels the shop publishes:\n📞 Phone: " + C.tel + "\n📝 The \"Select your service need\" form at the bottom of the page\nThey're also on Instagram, Facebook, YouTube and LinkedIn. They don't list WhatsApp or email. Or leave your number here and they'll reach out, by call or text."), c: [TEL, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: S("¡Con gusto! Si necesitas algo más, aquí estoy. 🚗", "You're welcome! I'm here if you need anything else. 🚗"), c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "agendar", "reservar", "turno", "llevar el carro", "llevar mi carro", "llevar el auto", "appointment", "estimate", "quote", "book", "schedule", "bring my car"];
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
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i", "not", "got", "hit"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|auto)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|precio|horario|donde|necesito|quiero|mi carro|gracias|cual|choque|chocaron|pintura|seguro|abolladura)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/\(305\) 885-4080/g, '<a href="tel:+13058854080">(305) 885-4080</a>').replace(/\b911\b/g, '<a href="tel:911">911</a>'); }
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
    status.textContent = L("🕐 Su web no publica horario · el taller te confirma por teléfono · " + C.tel, "🕐 No business hours on their site · the shop confirms by phone · " + C.tel);
  }
  function menuChips() { return [CITA_CHIP, CHOQUE, SVC, SEGURO, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Medley, FL";
    panel.querySelector(".r24-in").placeholder = L("Escribe tu pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · tus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk"));
    banner.textContent = L("Demo privada preparada para Reinaldo Paint & Body Shop", "Private demo prepared for Reinaldo Paint & Body Shop");
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
    if (announce) addBot(L("Perfecto, seguimos en español. ¿En qué te ayudo?", "Sure, let's continue in English. How can I help?"), flow ? [] : menuChips());
    if (flow && announce) setTimeout(function () { ask(flow.step); }, 600);
  }
  // R24-HUMANO-1018: siempre a la vista; nunca deja al cliente atrapado con el asistente
  function humano() {
    flow = null; addUser(L("👤 Hablar con una persona", "👤 Talk to a person"));
    addBot(L("Claro. Llama al " + C.tel + " y te atiende una persona del taller (su web no publica el horario de atención). Si prefieres, te contactan ellos: déjame tu nombre y teléfono y el pedido les llega al instante.",
      "Sure. Call " + C.tel + " and a person from the shop will help you (their site doesn't publish business hours). Or they can reach out to you: leave your name and number and they get the request instantly."), [TEL(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy el asistente virtual con IA de Reinaldo Paint & Body Shop (chapa, pintura y colisión desde 1977, en Medley). Te ayudo a pedir tu estimado gratis o una cita, te tomo los datos si tuviste un choque, o te cuento servicios, seguro, remolque y alquiler, a cualquier hora: también de noche y el fin de semana, o cuando no pueden atender el teléfono.\n¿En qué te ayudo?",
      "Hi! 👋 I'm the AI virtual assistant for Reinaldo Paint & Body Shop (auto body, paint and collision since 1977, in Medley). I can set up your free estimate or an appointment, take your details if you had a crash, or answer questions about services, insurance, towing and rentals — any time, including nights and weekends, or when nobody can pick up the phone.\nHow can I help?"), menuChips());
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
  // Lo que le pasó, con los servicios que publica su web
  function SINT() { return lang === "en" ? ["Collision / crash damage", "Paint / scratches", "Dents / hail", "Bumper / fender", "Windshield / glass", "Frame / structural", "Customization (body kit, spoiler…)", "Other / not sure"]
    : ["Choque / colisión", "Pintura / rayones", "Abolladuras / granizo", "Parachoques / guardabarros", "Parabrisas / vidrios", "Chasis / estructura", "Personalización (body kit, alerón…)", "Otra cosa / no sé"]; }
  function SEG() { return opts([L("🛡️ Sí, va por el seguro", "🛡️ Yes, through insurance"), L("💵 No, lo pago yo", "💵 No, I'm paying"), L("🤔 Todavía no sé", "🤔 Not sure yet")]); }
  function ESTADO() { return opts([L("✅ Anda, puedo llevarlo", "✅ It runs, I can drive it in"), L("🚛 No anda / necesita remolque", "🚛 Not drivable / needs a tow")]); }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function MEDIO() { return opts([L("📞 Llamada", "📞 Phone call"), L("💬 Mensaje de texto", "💬 Text message")]); }
  function franjas() { return opts([L("Por la mañana", "Morning"), L("Por la tarde", "Afternoon"), L("Me da igual", "Either is fine")]); }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos te dejo el pedido listo para el taller. (Escribe «cancelar» si quieres salir.)\n¿Qué necesitas?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Estimado gratis", "Free estimate"), L("Choque / reclamo al seguro", "Collision / insurance claim"), L("Cita para llevar el carro", "Appointment to bring the car in")]));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || L("Consulta general", "General question")).slice(0, 120) } };
    addBot(L("¡Claro! Te contacta una persona del taller, por llamada o por mensaje de texto. Solo necesito unos datos.\n¿Cuál es tu nombre? (Escribe «cancelar» si quieres salir.)", "Sure! Someone from the shop will reach out by phone call or text. I just need a few details.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function normTel(t) { var ph = String(t || "").replace(/[\s().+-]/g, ""); if (/^1\d{10}$/.test(ph)) ph = ph.slice(1); return /^[2-9]\d{9}$/.test(ph) ? ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6) : ""; }
  function cap(s) { return String(s || "").trim().split(/\s+/).filter(Boolean).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ").slice(0, 60); }
  // Su formulario «Selecciona tu servicio / Select your service need» le entrega el pedido a la recepción, que confirma al instante y pide lo que falta
  function fromForm(f) {
    f = f || {};
    var nm = cap(f.name), sv = (f.servicios || []).join(", "), d = { tipo: "cita", form: true, servicio: L("Estimado gratis (formulario)", "Free estimate (form)"), nombre: nm.length >= 2 ? nm : "", telefono: normTel(f.tel),
      email: String(f.email || "").trim().slice(0, 60), sintoma: [sv, String(f.msg || "").trim()].filter(Boolean).join(" · ").slice(0, 140) };
    if (/seguro|insurance/i.test(sv)) d.seguro = L("Sí, va por el seguro (marcado en el formulario)", "Yes, through insurance (checked on the form)");
    open("form");
    flow = { step: "vehiculo", d: d };
    addUser(L("📝 Formulario «Selecciona tu servicio»", "📝 \"Select your service need\" form") + "\n" + [nm, f.tel, d.email, d.sintoma].filter(Boolean).join(" · "));
    addBot(L("¡Recibido" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Tu pedido ya le llegó al taller, sin email obligatorio ni «No soy un robot». " + aviso() + "\nPara dejarlo completo, unas preguntas rápidas.",
      "Got it" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Your request already reached the shop, no required email or \"I'm not a robot\". " + aviso() + "\nA few quick questions to complete it."));
    setTimeout(function () { ask(flow.step); }, 700);
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
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del carro? (por ejemplo: 2019 Toyota Camry)", "Year, make and model? (e.g. 2019 Toyota Camry)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasó o qué necesitas?", "What happened, or what do you need?"), opts(SINT()));
    else if (step === "seguro") addBot(L("¿Va por el seguro? (Su web dice que se encargan de todos los reclamos de seguros y la facturación.)", "Is it going through insurance? (Their site says they handle all insurance claims and billing.)"), SEG());
    else if (step === "estado") addBot(L("¿El carro anda o necesita remolque? (Su web dice «Llámanos y remolcaremos tu carro»; el taller te confirma cómo.)", "Does the car run, or does it need a tow? (Their site says \"Call us and we'll tow your car\"; the shop confirms how.)"), ESTADO());
    else if (step === "foto") addBot(L("¿Tienes una foto del daño? Es opcional y ayuda mucho al taller para el estimado.", "Do you have a photo of the damage? It's optional and really helps the shop with the estimate."), FOTO());
    else if (step === "dia") {
      var days = nextDays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día te queda mejor? Lo anoto como preferencia: como su web no publica horario, el taller te confirma el día y la hora por teléfono.", "Which day works best? I'll note it as a preference: since their site doesn't publish hours, the shop confirms the day and time by phone."),
        opts([L("Lo antes posible", "As soon as possible")]).concat(opts(days.map(function (x) { return x.label; }))));
    }
    else if (step === "franja") addBot(L("¿Mejor por la mañana o por la tarde?", "Morning or afternoon?"), franjas());
    else if (step === "nombre") addBot(L("¿Cuál es tu nombre?", "What's your name?"));
    else if (step === "medio") addBot(L("Gracias, " + d.nombre + ". ¿Prefieres que te llamen o que te manden un mensaje de texto?", "Thanks, " + d.nombre + ". Would you rather get a call or a text?"), MEDIO());
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto. ¿A qué teléfono te " + (/texto/i.test(medioTxt(d)) ? "escriben" : "llaman") + "?", "Great. What number should they " + (/text/i.test(medioTxt(d)) ? "text" : "call") + "?") : L("Último paso: ¿a qué teléfono te contactan para confirmar?", "Last step: what number should they use to confirm?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revisa tu solicitud de contacto:\n👤 Nombre: ", "Please review your contact request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revisa tu solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Carro: ", "\n🚗 Car: ") + d.vehiculo + L("\n🔧 Qué le pasó: ", "\n🔧 What happened: ") + d.sintoma + L("\n🛡️ Seguro: ", "\n🛡️ Insurance: ") + d.seguro + L("\n🚦 Estado: ", "\n🚦 Status: ") + d.estado + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + (d.email ? "\n✉️ Email: " + d.email : "") + "\n\n" + aviso() + q, B, "r24-sum");
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
        if (/seguro|insurance/.test(n)) d.seguro = L("Sí, va por el seguro", "Yes, through insurance");
        addBot(/cita|appointment/.test(n) ? L("Bien. Te anoto el día que prefieres y el taller te lo confirma.", "Got it. I'll note your preferred day and the shop confirms.")
          : /seguro|insurance/.test(n) ? L("Bien. Su web dice que su personal se encarga de todos los reclamos de seguros y la facturación.", "Got it. Their site says their staff handles all insurance claims and billing.")
          : L("Bien. Su web dice «ESTIMADOS GRATIS»; el estimado te lo da el taller.", "Got it. Their site says \"FREE ESTIMATES\"; the estimate comes from the shop."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60); if (d.form && d.sintoma) ask(d.seguro ? "estado" : "seguro"); else ask("sintoma"); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask(d.seguro ? "estado" : "seguro"); return;
      case "seguro": d.seguro = t.slice(0, 60); ask("estado"); return;
      case "estado":
        d.estado = t.slice(0, 50);
        if (/remolque|tow|no anda|not drivable/i.test(n)) addBot(L("Anotado: el taller ve en el pedido que el carro necesita remolque y te confirma cómo y cuándo lo buscan. El costo no lo publican: te lo dicen ellos.", "Noted: the shop will see the car needs a tow and confirm how and when they pick it up. The cost isn't published: they'll tell you."));
        setTimeout(function () { ask("foto"); }, /remolque|tow|anda|drivable/i.test(n) ? 700 : 0); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60);
        if (/^(lo antes posible|as soon as possible)$/i.test(t)) { d.franja = L("La primera disponible", "First available"); ask(d.nombre ? "medio" : "nombre"); return; }
        ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask(d.nombre ? "medio" : "nombre"); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dices tu nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        ask("medio"); return;
      case "medio":
        d.medio = /texto|text|sms|mensaje/i.test(t) ? L("Mensaje de texto", "Text message") : L("Llamada", "Phone call");
        if (d.telefono) ask("resumen"); else ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbelo con 10 cifras (con código de área), por ejemplo 305-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 305-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)"), tx = /texto|text/i.test(medioTxt(d));
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe tu pedido al instante y te " + (tx ? "escribe" : "llama") + " al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will " + (tx ? "text" : "call") + " you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Tu solicitud quedó registrada.\nEl taller te " + (tx ? "escribe" : "llama") + " al " + d.telefono + " para confirmar el día y la hora; el estimado te lo dan ellos.", "All set, " + nm2 + "! ✅ Your request is in.\nThe shop will " + (tx ? "text" : "call") + " you at " + d.telefono + " to confirm the day and time; the estimate comes from them.") + DEMO, [MAPS(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
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
    addBot(L("Eso te lo confirma mejor el taller, así tienes el dato exacto. 😊\nLlama al " + C.tel + " o déjame tu teléfono y te contactan ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall " + C.tel + " or leave your number and they'll get back to you."), [TEL, LLAMADA_CHIP, CITA_CHIP]);
  }
  function handle(t, chip, shown) {
    if (t === "__menu") { addBot(L("Claro, ¿qué más quieres saber?", "Sure, what else would you like to know?"), menuChips()); return; }
    addUser(chip ? (shown || chip.t) : t);
    var n = norm(t);
    if (!chip) { if (lang === "es" && looksEnglish(n)) setLang("en", false); else if (lang === "en" && looksSpanish(n)) setLang("es", false); }
    if (flow) { flowInput(chip && chip.v ? chip.v : t, chip); return; }
    if (chip && chip.a === "cita") { startCita(); return; }
    if (chip && chip.a === "llamada") { startLlamada(); return; }
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué te puedo ayudar? Te pido el estimado gratis o una cita, te tomo los datos para que te llamen o escriban y te cuento servicios, seguro y dirección.", "Hi! How can I help? I can request a free estimate or an appointment, take your details for a call or text back, and tell you about services, insurance and location."), menuChips()); return; }
    if (/^(horario y direccion|hours and address)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [CITA_CHIP, MAPS, LLAMADA_CHIP]); return; }
    if (/^(seguro remolque alquiler|insurance towing rental)$/.test(n)) { addBot(byId("seguro").a() + "\n\n" + byId("remolque").a().split(" Si quieres")[0].split(" If you like")[0] + "\n\n" + byId("alquiler").a(), [CITA_CHIP, LLAMADA_CHIP, TEL]); return; }
    if (/\b(que me llamen|llamenme|que me escriban|escribanme|call me back|text me|callback|call back)\b/.test(n)) { startLlamada(); return; }
    if (/\b(persona|humano|alguien real|asesor|person|human|someone real|real person)\b/.test(n)) { humano(); return; }
    if (isWalkinQ(n)) { reply(byId("walkin")); return; }
    if (/\b(desde cuando|cuantos anos (tienen|llevan)|hace cuanto (estan|existen|abrieron)|since when|how long have you been|how many years)\b/.test(n)) { reply(byId("historia")); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (bi && bi.e.id === "choque" && bi.s >= 1 && !price && !wantsCita(n)) { reply(bi.e); return; }
    if (wantsCita(n) && !price && !(bi && bi.e && bi.e.id === "precio" && /\?|es gratis|is it free/.test(t)) && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|estimado|appointment|estimate|quote|schedule|book/.test(n))) { startCita(); return; }
    if (price && !(bi && (bi.e.id === "nolist" || bi.e.id === "alquiler"))) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, fromForm: function (f) { if (panel) fromForm(f); }, setLang: function (l) { if (panel) setLang(l === "en" ? "en" : "es", opened); }, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
