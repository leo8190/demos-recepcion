/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Matsco Transmissions (transmisiones en Albuquerque, NM; familiar desde 1978) — DEMO privada, bilingüe ES/EN.
   Sale de plantilla-widget/recepcion.base.js (reglas del brief 18/10 + R24-HUMANO), en la variante de talleres ES/EN en «usted», con la lógica
   SIN HORAS de Martinez (#24): su página de inicio no publica a qué hora atienden y la recepción no lo inventa.
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica la página de inicio de matscotransmissions.com (revisada el 20/10/2026):
   - 9517 Central Ave NE., Albuquerque, NM 87123 · «Shop: (505) 298-8999» · correo matscoone@aol.com («Click here to email our shop») ·
     formulario de síntomas («Fill out this form and we'll call you to schedule your appointment»: nombre, teléfono, correo, mensaje y casillas
     Won't drive / Won't go in reverse / Just not running like it use to / Check engine light is on / No heat / Leaking fluid / Other) ·
     «Si Habla Espanol» · «Jerry Miller – Owner» · logo «Family Owned and Operated Since 1978» · «more than 50 years».
   - Horario: «WEEKDAY HOURS BY APPOINTMENT ONLY» y «Saturday & Sunday – Closed». NO publica horas: la demo no dice «abierto/cerrado» ni
     inventa horas; los días que ofrece son de lunes a viernes como PREFERENCIA y el taller confirma. Hora de referencia: Albuquerque
     (America/Denver, Mountain Time).
   - Servicios: reparación experta de transmisiones de vehículos antiguos, clásicos y clásicos modernos de los 60 a los 90; especialistas en
     transmisiones de camionetas y SUV (Ford, Dodge y GM, 2x4 y 4x4, gasolina y diésel): diagnóstico, reparación y reconstrucción;
     transmisiones automáticas de autos, camionetas y vans extranjeros y nacionales; transmisiones manuales y ejes («si le cuesta cambiar o
     tiene que pisar el embrague hasta el fondo…»). Técnicos certificados ASE «who can handle your factory warranty repairs».
   - Formas de pago: efectivo, cheque de caja y tarjetas (su imagen: Visa, MasterCard, Discover).
   Sin precios ni cifras, sin WhatsApp; no promete grúa (su web no la ofrece; solo se anota si anda), ni tiempos, garantía propia, financiamiento,
   frenos, aceite, A/C, motor, eléctrico ni nada que su web no diga → «su web no lo dice». Nombra al dueño solo como lo dice su web. */
(function () {
  "use strict";
  var C = {
    nombre: "Matsco Transmissions", corto: "Matsco Transmissions",
    dir: "9517 Central Ave NE, Albuquerque, NM 87123", maps: "https://www.google.com/maps/dir/?api=1&destination=Matsco+Transmissions+9517+Central+Ave+NE+Albuquerque+NM+87123",
    tel: "(505) 298-8999", telh: "+15052988999", email: "matscoone@aol.com"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  // Horario: su web dice «Weekday hours by appointment only» y «Saturday & Sunday – Closed». No publica horas: no se inventan.
  function horarioTxt() {
    return L("Lo que dice su web: entre semana atienden solo con cita («Weekday hours by appointment only») y el sábado y el domingo está cerrado. No publica a qué hora abren ni cierran, así que no se lo voy a inventar: el taller se lo confirma al " + C.tel + ".\nYo le tomo el pedido de cita a cualquier hora, también de noche o el fin de semana, y el taller lo recibe al instante. Si prefiere, déjeme su nombre y teléfono y le llaman.",
      "What their site says: weekdays by appointment only (\"Weekday hours by appointment only\"), closed Saturday and Sunday. It doesn't publish opening or closing times, so I won't make them up: the shop will confirm at " + C.tel + ".\nI can take your appointment request any time, even at night or on the weekend, and the shop gets it instantly. Or leave your name and number and they'll call you.");
  }
  function nowTx() {
    var q = (location.search.match(/[?&]r24now=([^&]+)/) || [])[1];
    if (q) { var p = decodeURIComponent(q).match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
      if (p) return { y: +p[1], m: +p[2] - 1, d: +p[3], dow: new Date(+p[1], +p[2] - 1, +p[3]).getDay(), min: +p[4] * 60 + +p[5] }; }
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Denver", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
    var o = {}; f.formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    var y = +o.year, m = +o.month - 1, d = +o.day;
    return { y: y, m: m, d: d, dow: new Date(y, m, d).getDay(), min: (+o.hour % 24) * 60 + +o.minute };
  }
  function dayLabel(dt) { var dn = DIAS[lang][dt.getDay()]; return lang === "en" ? dn + ", " + MESES.en[dt.getMonth()] + " " + dt.getDate() : dn.charAt(0).toUpperCase() + dn.slice(1) + " " + dt.getDate() + " " + MESES.es[dt.getMonth()]; }
  // Días como PREFERENCIA (desde mañana, hora de Albuquerque), solo de lunes a viernes (su web: sábado y domingo cerrado); el taller confirma.
  function nextDays(n, k) { var out = []; for (var i = 1; out.length < k && i < 14; i++) { var dt = new Date(n.y, n.m, n.d + i), w = dt.getDay(); if (w === 0 || w === 6) continue; out.push({ dow: w, label: dayLabel(dt) }); } return out; }

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

  var CITA_CHIP = { a: "cita", get t() { return L("🔧 Pedir cita o presupuesto", "🔧 Appointment or estimate"); } };
  var LLAMADA_CHIP = { a: "llamada", get t() { return L("📲 Que me llamen o escriban", "📲 Call or text me back"); } };
  function aviso() { return L("🔔 El taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL1() { return { t: L("Llamar al " + C.tel, "Call " + C.tel), tel: C.telh }; }
  function MAPS1() { return { t: L("📍 Cómo llegar", "📍 Get directions"), url: C.maps }; }
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & address", "horario y direccion", "hours and address");
  var FALLA = Q("⚙️ Mi transmisión falla", "⚙️ My transmission is acting up", "mi transmision falla", "my transmission is acting up");
  var CLAS = Q("🚙 Clásicos, 4x4 y diésel", "🚙 Classics, 4x4 & diesel", "clasicos 4x4 y diesel", "classics 4x4 and diesel");
  function dirA() { return L("Están en " + C.dir + " (la dirección de su web).\n📞 " + C.tel, "They're at " + C.dir + " (the address on their website).\n📞 " + C.tel); }
  function horarioA() { return horarioTxt(); }
  function serviciosA() {
    return L("Lo que publica el taller (más de 50 años en transmisiones, en Albuquerque):\n• Transmisiones automáticas de autos, camionetas y vans, de marcas extranjeras y nacionales\n• Transmisiones manuales, embrague y ejes\n• Camionetas y SUV Ford, Dodge y GM, 2x4 y 4x4, a gasolina y diésel: diagnóstico, reparación y reconstrucción\n• Transmisiones de clásicos y clásicos modernos, de los años 60 a los 90\n• Técnicos certificados ASE, que pueden hacer reparaciones de garantía de fábrica\n¿Qué le pasa a su vehículo?",
      "What the shop lists (50+ years in transmissions, in Albuquerque):\n• Automatic transmissions in foreign and domestic cars, trucks and vans\n• Manual drivetrains, clutches and axles\n• Ford, Dodge and GM trucks and SUVs, 2WD and 4WD, gas and diesel: diagnostics, repair and rebuilding\n• Vintage, classic and modern classic transmissions, from the 60s through the 90s\n• ASE certified technicians who can handle factory warranty repairs\nWhat's going on with your vehicle?");
  }
  function noListA() {
    return L("Eso su web no lo nombra (es un taller de transmisiones: automáticas, manuales, ejes, camionetas 4x4 y clásicos), así que no se lo voy a asegurar: se lo confirma el taller. Llame al " + C.tel + ", o déjeme su nombre y teléfono y le llaman ellos.",
      "Their site doesn't list that (it's a transmission shop: automatics, manuals, axles, 4x4 trucks and classics), so I won't promise it: the shop will confirm. Call " + C.tel + ", or leave your name and number and they'll call you.");
  }
  function noPubA() {
    return L("Eso su web no lo dice, así que no se lo voy a inventar: se lo confirma el taller. Llame al " + C.tel + ", o déjeme su nombre y teléfono y le llaman ellos.",
      "Their site doesn't say, so I won't make it up: the shop will confirm. Call " + C.tel + ", or leave your name and number and they'll call you.");
  }
  function S(es, en) { return function () { return L(es, en); }; }
  var KB = [
    { id: "falla", k: ["transmision falla", "falla la transmision", "patina", "patinando", "no cambia", "cambia mal", "cambios duros", "da tirones", "jalonea", "se queda en neutral", "no entra", "no entra la reversa", "reversa", "no anda como antes", "ruido", "zumba", "pierde liquido", "fuga", "gotea", "liquido rojo", "luz check engine", "check engine", "luz del motor", "slipping", "slip", "won t shift", "hard shift", "shifts hard", "jerks", "won t go in reverse", "reverse", "not running like it used to", "noise", "whining", "leaking fluid", "leak", "check engine light", "transmission acting up", "transmission problem"],
      a: S("Eso es justo lo suyo: reparan, diagnostican y reconstruyen transmisiones. Su formulario incluye estos síntomas: no anda, no entra la reversa, no anda como antes, luz de «Check Engine», pierde líquido. Qué tiene exactamente lo ve el taller al revisarlo (aquí no doy diagnósticos ni precios). ¿Le dejo pedida la cita?",
        "That's exactly what they do: transmission diagnostics, repair and rebuilding. Their form lists these symptoms: won't drive, won't go in reverse, not running like it used to, check engine light, leaking fluid. What it is exactly, the shop finds out when they check it (I don't diagnose or quote here). Want me to request an appointment?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "automatica", k: ["automatica", "transmision automatica", "caja automatica", "vans", "importado", "extranjero", "toyota", "honda", "nissan", "automatic", "automatic transmission", "foreign", "domestic", "import"],
      a: S("Sí: su web dice que son expertos en reparar todo tipo de transmisiones automáticas en autos, camionetas y vans de marcas extranjeras y nacionales. Si es su modelo exacto lo confirma el taller. ¿Le dejo pedida la cita o el presupuesto?",
        "Yes: their site says they're experts at repairing all automatic transmissions in foreign and domestic cars, trucks and vans. Your exact model, the shop confirms. Want me to request an appointment or estimate?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "manual", k: ["manual", "estandar", "transmision manual", "embrague", "clutch", "cloch", "pisar el embrague", "pedal", "cuesta cambiar", "ejes", "eje", "diferencial", "flecha", "cardan", "drivetrain", "drivetrains", "axle", "axles", "differential", "driveshaft", "stick shift", "trouble shifting", "clutch pedal"],
      a: S("Sí: «Transmisiones manuales y ejes» es uno de sus 3 servicios. Su web dice: si a su vehículo le cuesta cambiar de marcha o tiene que pisar el embrague hasta el fondo para cambiar, conviene que lo revisen cuanto antes. ¿Le dejo pedida la revisión?",
        "Yes: \"Manual drivetrains & axles\" is one of their 3 services. Their site says: if your car is having trouble shifting or you have to push the clutch pedal to the floor to shift, you need to have it looked at right away. Want me to request an inspection?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "camionetas", k: ["camioneta", "troca", "pickup", "suv", "4x4", "4x2", "2x4", "doble traccion", "traccion", "diesel", "gasolina", "ford", "f150", "f250", "f350", "super duty", "powerstroke", "dodge", "ram", "cummins", "gm", "chevy", "chevrolet", "silverado", "gmc", "sierra", "duramax", "allison", "truck", "trucks", "4wd", "2wd", "four wheel drive", "gas", "transfer case", "caja de transferencia"],
      a: S("Sí: su web dice que se especializan en camionetas y SUV Ford, Dodge y GM, de tracción en 2 y en 4 ruedas, a gasolina y diésel: diagnóstico, reparación y reconstrucción de la transmisión. Otras marcas o la caja de transferencia en particular no las detalla: se lo confirma el taller. ¿Le dejo pedida la cita?",
        "Yes: their site says they specialize in 2WD and 4WD Ford, Dodge and GM gas and diesel trucks and SUVs: transmission diagnostics, repair and rebuilding. Other makes or the transfer case specifically aren't detailed: the shop will confirm. Want me to request an appointment?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "clasicos", k: ["clasico", "clasicos", "antiguo", "antiguos", "viejo", "vintage", "classic", "classics", "old car", "muscle car", "mustang", "camaro", "corvette", "chevelle", "60s", "70s", "80s", "90s", "anos 60", "anos 70", "anos 80", "anos 90", "1960", "1970", "1980", "1990", "restauracion", "restoration"],
      a: S("Sí: su web dice que hacen reparación experta de transmisiones de vehículos antiguos, clásicos y clásicos modernos de los años 60 a los 90, sistemas que muchos talleres ya no atienden. Si consiguen piezas para su modelo lo confirma el taller. ¿Le dejo pedida la cita? Anote el año, la marca y el modelo.",
        "Yes: their site says they do expert transmission repair for vintage, classic and modern classic vehicles from the 60s through the 90s, systems many shops no longer service. Whether parts are available for your model, the shop confirms. Want me to request an appointment? Include the year, make and model."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nomaneja", k: ["no arranca", "no prende", "no anda", "no camina", "no avanza", "varado", "varada", "me quede", "emergencia", "urgente", "grua", "remolque", "remolcar", "a domicilio", "won t start", "wont start", "won t drive", "wont drive", "won t move", "stranded", "broke down", "emergency", "urgent", "tow", "towing", "tow truck", "roadside", "mobile"],
      a: S("Lo siento. Su web no publica grúa ni servicio a domicilio, así que no se lo voy a prometer. Lo que sí hago: le dejo el pedido marcado como urgente y el taller le llama o le escribe y le dice cómo llevar el vehículo. También puede llamar al " + C.tel + ".",
        "Sorry to hear that. Their site doesn't list towing or mobile service, so I won't promise it. What I can do: log your request as urgent and the shop calls or texts you back and tells you how to get the vehicle there. You can also call " + C.tel + "."), c: [LLAMADA_CHIP, TEL1, CITA_CHIP] },
    { id: "calefaccion", k: ["calefaccion", "no calienta", "no heat", "heater", "heat"],
      a: S("Su formulario tiene la casilla «No heat» (no calienta), pero su web no nombra la reparación de calefacción entre sus servicios, así que no se lo voy a asegurar: se lo confirma el taller. Si quiere, le dejo anotado el síntoma y le llaman.",
        "Their form has a \"No heat\" checkbox, but their site doesn't list heater repair among its services, so I won't promise it: the shop will confirm. I can note the symptom and they'll call you."), c: [LLAMADA_CHIP, CITA_CHIP] },
    { id: "garantia", k: ["garantia", "garantia de fabrica", "garantia del carro", "ase", "certificado", "certificados", "warranty", "factory warranty", "certified", "guarantee"],
      a: S("Su web dice que trabajan con técnicos certificados ASE que pueden hacer sus reparaciones de garantía de fábrica. Qué garantía dan ellos sobre su trabajo (plazos, millas) no lo publica: se lo confirma el taller.",
        "Their site says they employ ASE certified technicians who can handle your factory warranty repairs. What warranty they give on their own work (time, miles) isn't published: the shop will confirm."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nolist", k: ["frenos", "balatas", "pastillas", "aceite", "cambio de aceite", "afinacion", "aire acondicionado", "a c", "ac", "motor", "electrico", "alternador", "bateria", "carroceria", "pintura", "llantas", "alineacion", "suspension", "amortiguadores", "escape", "mofle", "brakes", "pads", "oil", "oil change", "tune up", "air conditioning", "engine", "electrical", "alternator", "battery", "body work", "paint", "tires", "alignment", "suspension", "shocks", "exhaust", "muffler"], a: noListA, c: [TEL1, LLAMADA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "transmision", "transmisiones", "reconstruir", "reconstruccion", "rebuild", "mecanica", "mecanico", "taller", "services", "what do you fix", "what do you do", "transmission", "transmissions", "rebuilding", "mechanic"], a: serviciosA, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "oferta", "especial", "cupon", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "deal", "special", "coupon"],
      a: S("Los precios se los da el taller: esta recepción no da precios ni los inventa, y su web no publica ninguno. Lo que puedo hacer: dejarle pedido el presupuesto con su vehículo y lo que le pasa, y le llaman.",
        "Pricing comes from the shop: this front desk doesn't quote or make up prices, and their site doesn't publish any. What I can do: request an estimate with your vehicle and what's going on, and they'll call you."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "pago", k: ["formas de pago", "como pago", "tarjeta", "efectivo", "cheque", "cheque de caja", "debito", "credito", "visa", "mastercard", "discover", "amex", "american express", "payment", "pay", "card", "cash", "check", "cashier", "debit", "credit card"],
      a: S("Según su web aceptan efectivo, cheque de caja y tarjetas de crédito (su imagen muestra Visa, MasterCard y Discover). Otras formas (American Express, financiamiento, etc.) no las publica: se las confirma el taller.",
        "Per their site they take cash, cashier's check and credit cards (their image shows Visa, MasterCard and Discover). Other options (American Express, financing, etc.) aren't published: the shop will confirm."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nopub", k: ["financiamiento", "a plazos", "zelle", "cuanto tarda", "cuanto tiempo", "mismo dia", "auto de cortesia", "carro de reemplazo", "rentado", "flotilla", "trailer", "comercial", "motorhome", "usadas", "financing", "how long", "same day", "loaner", "rental", "fleet", "semi", "commercial", "motor home", "rv", "used transmission"], a: noPubA, c: [TEL1, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llegar", "llegar sin avisar", "necesito cita", "dejar el carro", "dejar el auto", "voy ahora", "without appointment", "drop by", "stop by", "come in now", "need an appointment"],
      a: S("Su web dice que entre semana atienden solo con cita («Weekday hours by appointment only») y que el sábado y el domingo está cerrado. Para no ir en balde: le dejo pedida la cita y el taller le llama para confirmar el día y la hora, o llame al " + C.tel + ".",
        "Their site says weekdays are by appointment only (\"Weekday hours by appointment only\") and they're closed Saturday and Sunday. To be safe: I'll request the appointment and the shop calls you to confirm the day and time, or call " + C.tel + "."), c: [CITA_CHIP, LLAMADA_CHIP, TEL1] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue", "bilingual", "se habla", "si habla"],
      a: S("Sí: su web dice «Si Habla Espanol» (se habla español). Aquí también le atiendo en los dos idiomas (botón EN arriba) y anoto en qué idioma prefiere que le llamen.", "Yes: their site says \"Si Habla Espanol\" (Spanish spoken). I can help you in English or Spanish too (ES button at the top) and note which language you'd like them to use."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "historia", k: ["dueno", "quien", "quienes son", "jerry", "miller", "experiencia", "historia", "confianza", "desde cuando", "anos", "familiar", "owner", "who", "experience", "trust", "since when", "years", "family"],
      a: S("Matsco Transmissions es un taller de transmisiones de Albuquerque: su logo dice «Family Owned and Operated Since 1978» (familiar desde 1978) y su portada habla de más de 50 años de experiencia. En su web, el dueño es Jerry Miller («Jerry Miller – Owner»).",
        "Matsco Transmissions is an Albuquerque transmission shop: their logo says \"Family Owned and Operated Since 1978\" and their home page talks about more than 50 years of experience. Their site names the owner as Jerry Miller (\"Jerry Miller – Owner\")."), c: [CITA_CHIP, SVC] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "abiertos", "cierran", "a que hora", "sabado", "domingo", "fin de semana", "lunes", "hoy abren", "estan abiertos", "hours", "open", "close", "closing", "saturday", "sunday", "weekend", "open today", "open now"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP, TEL1] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "central", "central ave", "address", "location", "where", "directions", "located"],
      a: function () { return dirA() + L("\nEntre semana atienden solo con cita: si quiere, se la dejo pedida y el taller le confirma el día y la hora.", "\nWeekdays are by appointment only: I can request one and the shop confirms the day and time."); }, c: [MAPS1, CITA_CHIP, LLAMADA_CHIP] },
    { id: "contacto", k: ["telefono", "telefonos", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "formulario", "phone", "number", "call", "text", "contact", "form"],
      a: S("Canales que publica el taller:\n📞 (505) 298-8999\n✉️ Correo: matscoone@aol.com\n📝 Su formulario de síntomas (dice «llene este formulario y le llamamos para darle su cita», sin decir cuándo)\nSu web no publica WhatsApp. O deje aquí su nombre y teléfono y le llaman ellos.",
        "Channels the shop publishes:\n📞 (505) 298-8999\n✉️ Email: matscoone@aol.com\n📝 Their symptoms form (it says \"fill out this form and we'll call you to schedule your appointment\", without saying when)\nTheir site doesn't list WhatsApp. Or leave your name and number here and they'll call you."), c: [TEL1, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: S("¡Con gusto! Si necesita algo más, aquí estoy. 🔧", "You're welcome! I'm here if you need anything else. 🔧"), c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "agendar", "reservar", "turno", "programar", "revision", "revisar", "llevar el carro", "llevar mi carro", "llevar mi auto", "llevar mi troca", "appointment", "estimate", "quote", "book", "schedule", "bring my car", "bring my truck"];
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
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "truck", "are", "your", "can", "open", "hours", "much", "transmission", "need", "want", "when", "where", "does", "have", "i", "not", "won", "start", "shift", "fix"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|auto|camioneta|troca)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|camioneta|troca|precio|horario|donde|necesito|quiero|mi carro|mi auto|gracias|cual|transmision|embrague|reversa|espanol)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/\(?505\)?[- ]298-8999/g, function (m) { return '<a href="tel:+15052988999">' + m + '</a>'; }).replace(/matscoone@aol\.com/gi, function (m) { return '<a href="mailto:matscoone@aol.com">' + m + '</a>'; }); }
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
    status.textContent = L("🕐 Entre semana solo con cita · sáb. y dom. cerrado · " + C.tel, "🕐 Weekdays by appointment only · closed Sat & Sun · " + C.tel);
  }
  function menuChips() { return [CITA_CHIP, FALLA, CLAS, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Albuquerque, NM";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk"));
    banner.textContent = L("Demo privada preparada para Matsco Transmissions", "Private demo prepared for Matsco Transmissions");
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
    addBot(L("Claro. Llame al " + C.tel + " y le atiende una persona del taller (su web dice que entre semana atienden con cita y que el sábado y el domingo está cerrado; no publica horas). Si prefiere, le contactan ellos: déjeme su nombre y teléfono y el pedido les llega al instante.",
      "Sure. Call " + C.tel + " and a person at the shop will help you (their site says weekdays are by appointment and they're closed Saturday and Sunday; it doesn't publish times). Or they can reach out to you: leave your name and number and they get the request instantly."), [TEL1(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy el asistente virtual con IA de Matsco Transmissions (transmisiones en Albuquerque, negocio familiar desde 1978). Le ayudo a pedir su cita o presupuesto (transmisión automática o manual, ejes, camionetas 4x4 y diésel, clásicos de los 60 a los 90), le tomo los datos para que el taller le llame, o le cuento servicios y dirección, a cualquier hora: también de noche y el fin de semana, o cuando nadie puede atender el teléfono.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the AI virtual assistant for Matsco Transmissions (transmissions in Albuquerque, family owned since 1978). I can request your appointment or estimate (automatic or manual transmission, axles, 4x4 and diesel trucks, classics from the 60s to the 90s), take your details so the shop calls you back, or answer questions about services and location — any time, including nights and weekends, or when nobody can pick up the phone.\nHow can I help?"), menuChips());
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
  // Qué le pasa, con los síntomas de su formulario y sus servicios
  function SINT() { return lang === "en" ? ["Won't drive", "Won't go in reverse", "Slipping or shifting badly", "Clutch: have to push it to the floor", "Leaking fluid", "Check engine light", "Not running like it used to", "Other / not sure"]
    : ["No anda", "No entra la reversa", "Patina o cambia mal", "Embrague: hay que pisarlo hasta el fondo", "Pierde líquido", "Luz de «Check Engine»", "No anda como antes", "Otra cosa / no sé"]; }
  function IDIOMAS() { return opts([L("🇲🇽 En español", "🇲🇽 In Spanish"), L("🇺🇸 En inglés", "🇺🇸 In English"), L("Me da igual", "Either is fine")]); }
  function ESTADO() { return opts([L("✅ Anda, puedo llevarlo", "✅ It runs, I can drive it in"), L("⚠️ Anda, pero con falla", "⚠️ It runs, but it's acting up"), L("⛔ No anda / necesitaría grúa", "⛔ It won't drive / would need a tow")]); }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function MEDIO() { return opts([L("📞 Llamada", "📞 Phone call"), L("💬 Mensaje de texto", "💬 Text message")]); }
  function franjas() {
    return opts([L("Por la mañana", "Morning"), L("Por la tarde", "Afternoon"), L("Me da igual", "Either is fine")]);
  }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Cita para revisar la transmisión", "Appointment to check the transmission"), L("Presupuesto (reparación o reconstrucción)", "Estimate (repair or rebuild)")]));
  }
  function startLlamada() {
    flow = { step: "nombre", d: { tipo: "llamada", consulta: (lastQ || L("Consulta general", "General question")).slice(0, 120) } };
    addBot(L("¡Claro! Le contacta una persona del taller, por llamada o por mensaje de texto. Solo necesito unos datos.\n¿Cuál es su nombre? (Escriba «cancelar» si quiere salir.)", "Sure! Someone from the shop will reach out by phone call or text. I just need a few details.\nWhat's your name? (Type \"cancel\" to exit.)"));
  }
  function normTel(t) { var ph = String(t || "").replace(/[\s().+-]/g, ""); if (/^1\d{10}$/.test(ph)) ph = ph.slice(1); return /^[2-9]\d{9}$/.test(ph) ? ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6) : ""; }
  function cap(s) { return String(s || "").trim().split(/\s+/).filter(Boolean).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ").slice(0, 60); }
  // Su formulario de síntomas le entrega el pedido a la recepción, que confirma al instante y pide lo que falta
  // (en su web: «we'll call you to schedule your appointment», sin decir cuándo)
  function fromForm(f) {
    f = f || {};
    var nm = cap(f.name), sint = (f.sintomas || []).join(", ");
    var det = [sint, f.otro, f.msg].map(function (x) { return String(x || "").trim(); }).filter(Boolean).join(" · ").slice(0, 160);
    var d = { tipo: "cita", form: true, servicio: L("Cita (formulario de síntomas)", "Appointment (symptoms form)"),
      nombre: nm.length >= 2 ? nm : "", telefono: normTel(f.tel), email: String(f.email || "").trim().slice(0, 60), vehiculo: "", sintoma: det };
    open("form");
    flow = { step: "vehiculo", d: d };
    addUser(L("📝 Formulario de síntomas", "📝 Symptoms form") + "\n" + [nm, f.tel, d.email, det].filter(Boolean).join(" · "));
    addBot(L("¡Recibido" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Su formulario ya le llegó al taller: no se queda esperando sin saber cuándo le llaman. " + aviso() + "\nPara dejar su cita lista, unas preguntas rápidas.",
      "Got it" + (nm ? ", " + nm.split(" ")[0] : "") + "! ✅ Your form already reached the shop: no waiting without knowing when they'll call. " + aviso() + "\nA few quick questions to get your appointment ready."));
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
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del vehículo? Si lo sabe, también si es automática o manual, 2x4 o 4x4, y gasolina o diésel (por ejemplo: 1999 Ford F-250 4x4 diésel, automática).", "Year, make and model? If you know it, also automatic or manual, 2WD or 4WD, and gas or diesel (e.g. 1999 Ford F-250 4x4 diesel, automatic)."));
    else if (step === "sintoma") addBot(L("¿Qué le pasa?", "What's going on?"), opts(SINT()));
    else if (step === "idioma") addBot(L("¿En qué idioma prefiere que le atiendan? (Su web dice «Si Habla Espanol».)", "Which language would you like them to use? (Their site says \"Si Habla Espanol\".)"), IDIOMAS());
    else if (step === "estado") addBot(L("¿El vehículo anda? (Solo lo anoto para el taller; su web no publica grúa ni servicio a domicilio.)", "Does the vehicle run? (I just note it for the shop; their site doesn't list towing or mobile service.)"), ESTADO());
    else if (step === "foto") { if (d.foto) { ask("dia"); return; } addBot(L("¿Tiene una foto (de una fuga, del tablero con la luz encendida, de la palanca o de la etiqueta de la transmisión)? Es opcional y ayuda al taller a prepararse.", "Do you have a photo (a leak, the dash with the light on, the shifter or the transmission tag)? It's optional and helps the shop get ready."), FOTO()); }
    else if (step === "dia") {
      var days = nextDays(n, 5); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia: su web dice que entre semana atienden con cita (sábado y domingo cerrado) y no publica horas, así que el taller le confirma el día y la hora.", "Which day works best? I'll note it as a preference: their site says weekdays are by appointment (closed Saturday and Sunday) and doesn't publish times, so the shop confirms the day and time."),
        opts(days.map(function (x) { return x.label; })).concat(opts([L("Lo antes posible", "As soon as possible")])));
    }
    else if (step === "franja") addBot(L("¿En qué momento del día prefiere? (También es preferencia: el taller le confirma.)", "What time of day do you prefer? (Also a preference: the shop confirms.)"), franjas());
    else if (step === "nombre") addBot(L("¿Cuál es su nombre?", "What's your name?"));
    else if (step === "medio") addBot(L("Gracias, " + d.nombre + ". ¿Prefiere que le llamen o que le manden un mensaje de texto?", "Thanks, " + d.nombre + ". Would you rather get a call or a text?"), MEDIO());
    else if (step === "telefono") addBot(d.tipo === "llamada" ? L("Perfecto. ¿A qué teléfono le " + (/texto/i.test(medioTxt(d)) ? "escriben" : "llaman") + "?", "Great. What number should they " + (/text/i.test(medioTxt(d)) ? "text" : "call") + "?") : L("Último paso: ¿a qué teléfono le contactan para confirmar?", "Last step: what number should they use to confirm?"));
    else if (step === "resumen") {
      var B = [{ t: L("✅ Confirmar", "✅ Confirm"), v: "__ok", flow: true }, { t: L("✏️ Corregir", "✏️ Edit"), v: "__fix", flow: true }, { t: L("Cancelar", "Cancel"), v: "cancelar", flow: true }];
      var q = L("\n\n¿Lo confirmo?", "\n\nShall I confirm?"), foto = d.foto ? d.foto : L("sin foto", "no photo");
      if (d.tipo === "llamada") { addBot(L("Revise su solicitud de contacto:\n👤 Nombre: ", "Please review your contact request:\n👤 Name: ") + d.nombre + L("\n💬 Consulta: ", "\n💬 Question: ") + d.consulta + L("\n🗣️ Idioma: ", "\n🗣️ Language: ") + d.idioma + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + "\n\n" + aviso() + q, B, "r24-sum"); return; }
      addBot(L("Revise su solicitud:\n🧾 Tipo: ", "Please review your request:\n🧾 Type: ") + d.servicio + L("\n🚗 Vehículo: ", "\n🚗 Vehicle: ") + d.vehiculo + L("\n⚙️ Qué le pasa: ", "\n⚙️ Problem: ") + d.sintoma + L("\n🗣️ Idioma: ", "\n🗣️ Language: ") + d.idioma + L("\n🚦 Estado: ", "\n🚦 Status: ") + d.estado + L("\n📷 Foto: ", "\n📷 Photo: ") + foto + L("\n📅 Día: ", "\n📅 Day: ") + d.dia + L("\n🕐 Franja: ", "\n🕐 Window: ") + d.franja + L("\n👤 Nombre: ", "\n👤 Name: ") + d.nombre + L("\n📲 Cómo: ", "\n📲 How: ") + medioTxt(d) + L("\n📱 Teléfono: ", "\n📱 Phone: ") + d.telefono + (d.email ? L("\n✉️ Correo: ", "\n✉️ Email: ") + d.email : "") + "\n\n" + aviso() + q, B, "r24-sum");
    }
  }
  function idiomaDe(t) { return /ingl|english/i.test(t) ? L("Inglés", "English") : (/espa|spanish/i.test(t) ? L("Español", "Spanish") : L("Me da igual", "Either")); }
  function flowInput(t, chip) {
    var n = norm(t), d = flow.d;
    if (/^(cancelar|cancela|salir|dejalo|olvidalo|cancel|stop|exit|quit)$/.test(n)) { flow = null; addBot(L("Sin problema, cancelé la solicitud. ¿Le ayudo con otra cosa?", "No problem, I've cancelled the request. Anything else?"), [CITA_CHIP, HOR, LLAMADA_CHIP]); return; }
    if (/\?/.test(t) && flow.step !== "resumen") {
      var bi = bestIntent(t);
      if (bi && bi.s >= 1) { reply(bi.e); setTimeout(function () { ask(flow.step); }, 700); return; }
    }
    switch (flow.step) {
      case "tipo":
        d.servicio = t.slice(0, 50);
        addBot(/cita|appointment/i.test(n) ? L("Bien. Le anoto el día que prefiere y el taller se lo confirma.", "Got it. I'll note your preferred day and the shop confirms.")
          : L("Bien. Aquí no doy precios: el presupuesto se lo da el taller después de revisar el vehículo.", "Got it. I don't quote prices here: the estimate comes from the shop after checking the vehicle."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60);
        ask(d.form && d.sintoma ? "idioma" : "sintoma"); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask("idioma"); return;
      case "idioma":
        d.idioma = idiomaDe(t);
        if (d.tipo === "llamada") { ask("medio"); return; }
        ask("estado"); return;
      case "estado":
        d.estado = t.slice(0, 50);
        if (/no anda|necesitaria grua|won t drive|would need a tow/i.test(n)) addBot(L("Anotado: el taller ve en el pedido que el vehículo no anda y le dice cómo llevarlo. No le prometo grúa ni servicio a domicilio porque su web no los ofrece.", "Noted: the shop will see the vehicle won't drive and tell you how to get it there. I won't promise a tow or mobile service since their site doesn't offer them."));
        setTimeout(function () { ask("foto"); }, /no anda|grua|won t drive|tow/i.test(n) ? 700 : 0); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60); d.dow = flow.days && flow.days[t] != null ? flow.days[t] : -1;
        if (/sabado|domingo|fin de semana|saturday|sunday|weekend/i.test(n)) { addBot(L("Según su web, el sábado y el domingo el taller está cerrado. ¿Otro día, de lunes a viernes?", "Per their site, the shop is closed Saturday and Sunday. Another day, Monday to Friday?")); setTimeout(function () { ask("dia"); }, 500); return; }
        if (/^(lo antes posible|as soon as possible)$/i.test(t)) { d.franja = L("La primera disponible", "First available"); ask(d.nombre ? "medio" : "nombre"); return; }
        ask("franja"); return;
      case "franja": d.franja = t.slice(0, 60); ask(d.nombre ? "medio" : "nombre"); return;
      case "nombre":
        var nm = t.replace(/^(me llamo|soy|mi nombre es|my name is|i am|i'm|im)\s+/i, "").trim();
        if (nm.length < 2 || nm.length > 60 || /\d/.test(nm)) { addBot(L("¿Me dice su nombre, por favor? (solo el nombre, sin números)", "What's your name, please? (just your name, no numbers)")); return; }
        d.nombre = nm.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        if (d.tipo === "llamada" && !d.idioma) { ask("idioma"); return; }
        ask("medio"); return;
      case "medio":
        d.medio = /texto|text|sms|mensaje/i.test(t) ? L("Mensaje de texto", "Text message") : L("Llamada", "Phone call");
        if (d.telefono) ask("resumen"); else ask("telefono"); return;
      case "telefono":
        var ph = t.replace(/[\s().+-]/g, "");
        if (/^1\d{10}$/.test(ph)) ph = ph.slice(1);
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (con código de área), por ejemplo 505-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 505-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)"), tx = /texto|text/i.test(medioTxt(d));
          var en1 = /Ingl|English/.test(d.idioma || ""), es1 = /Espa|Spanish/.test(d.idioma || ""), idm = en1 ? L(" en inglés", " in English") : (es1 ? L(" en español", " in Spanish") : "");
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le " + (tx ? "escribe" : "llama") + idm + " al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will " + (tx ? "text" : "call") + " you" + idm + " at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su solicitud quedó registrada en Matsco Transmissions.\nEl taller le " + (tx ? "escribe" : "llama") + idm + " al " + d.telefono + " para confirmar el día y la hora de su cita; el presupuesto se lo dan ellos.", "All set, " + nm2 + "! ✅ Your request is in at Matsco Transmissions.\nThe shop will " + (tx ? "text" : "call") + " you" + idm + " at " + d.telefono + " to confirm your appointment day and time; the estimate comes from them.") + DEMO, [MAPS1(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
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
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|hi|hello)\b/.test(n) && n.split(" ").length <= 3) { addBot(L("¡Hola! ¿En qué le puedo ayudar? Le dejo pedida su cita o presupuesto, le tomo los datos para que le llamen y le cuento servicios y dirección.", "Hi! How can I help? I can request your appointment or estimate, take your details for a call back, and tell you about services and location."), menuChips()); return; }
    if (/^(horario y direccion|hours and address)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [CITA_CHIP, MAPS1, LLAMADA_CHIP]); return; }
    if (/^(mi transmision falla|my transmission is acting up)$/.test(n)) { reply(byId("falla")); return; }
    if (/^(clasicos 4x4 y diesel|classics 4x4 and diesel)$/.test(n)) { addBot(byId("clasicos").a() + "\n\n" + byId("camionetas").a(), [CITA_CHIP, LLAMADA_CHIP]); return; }
    if (/\b(que me llamen|llamenme|que me escriban|escribanme|call me back|text me|callback|call back)\b/.test(n)) { startLlamada(); return; }
    if (/\b(persona|humano|alguien real|asesor|person|human|someone real|real person)\b/.test(n)) { humano(); return; }
    if (isWalkinQ(n)) { reply(byId("walkin")); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && !(bi && bi.e && bi.e.id === "precio" && /\?|es gratis|is it free|sin compromiso|no obligation/.test(t)) && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|quote|schedule|book/.test(n))) { startCita(); return; }
    if (price && !(bi && bi.e.id === "nolist")) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, fromForm: function (f) { if (panel) fromForm(f); }, setLang: function (l) { if (panel) setLang(l === "en" ? "en" : "es", opened); }, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
