/* R24-HUMANO-1018 */
/* R24-BRIEF-1018: avatar humano, botones rápidos, "que me llamen", aviso al equipo, sin "no tengo ese dato" */
/* Recepción 24 h · Noels Express Services & Auto Body (taller de Phoenix, AZ, especialista en Mercedes-Benz y vehículos europeos, con carrocería)
   — DEMO privada, bilingüe ES/EN. Sale de plantilla-widget/recepcion.base.js (reglas del brief 18/10 + R24-HUMANO), en la variante de talleres ES/EN
   en «usted» (Medina's #18, misma plataforma Duda, y Forrest #22, una sola sede).
   100% del lado del cliente: sin APIs, sin claves, sin envío de datos (la foto se muestra solo en este navegador).
   Respuestas sacadas solo de lo que publica noelexpressservices.com (Home, Services, About Us, Contact Us en inglés y /es-mx; revisada el 20/10/2026):
   - Dirección de su versión en inglés: 1522 W. Yuma St., Phoenix, AZ 85007 (su versión en español y su mapa todavía dicen 1615 E Elwood St 85040;
     la recepción da la de la versión en inglés). Teléfono 602-621-2260 (una sola línea). Correos: support@noelexpressservices.com (el que se ve en
     cada página) y service@noelexpressservices.com (el del ícono de correo). Formulario «Contact Us» (nombre, correo, teléfono, mensaje; responde
     «lo antes posible»). Facebook. Sin WhatsApp.
   - Horario (todas sus páginas): lunes a viernes 8:00 am – 5:00 pm; sábado 8:00 am – 2:00 pm; domingo cerrado (hora de Arizona, America/Phoenix,
     sin horario de verano).
   - Servicios: reparación de vehículos (menores y mayores, diagnóstico y reparación, cambio de piezas, afinación), mantenimiento preventivo (cambios
     de aceite, de líquido de transmisión, de bujías), inspección previa a la compra (Mercedes-Benz: revisan los componentes principales bajo el cofre),
     taller de carrocería. Atienden todos los vehículos europeos y se especializan en Mercedes-Benz (técnicos con «más de 28 años» como especialistas
     certificados en Inicio; «más de 38» en About Us). Garantías en el trabajo y en las piezas (sin condiciones publicadas). Presupuesto gratis, el costo
     solo después de revisar el vehículo. Financiamiento: botón de Snap Finance en la portada (sin condiciones publicadas).
   Sin precios (la recepción no da ninguno, ni el especial que cita su página de contacto), sin WhatsApp; no promete grúa (no la publica: solo anota si el
   vehículo anda, está parado o necesita grúa); otras marcas, frenos, A/C, eléctrico, llantas, etc. → «su web no lo nombra»; plazos, pagos, atención
   sin cita, idioma del personal → «su web no lo dice». No nombra a nadie. */
(function () {
  "use strict";
  var C = {
    nombre: "Noels Express Services & Auto Body", corto: "Noels Express",
    dir: "1522 W. Yuma St., Phoenix, AZ 85007", maps: "https://www.google.com/maps/dir/?api=1&destination=Noels+Express+Services+%26+Auto+Body+1522+W+Yuma+St+Phoenix+AZ+85007",
    tel: "602-621-2260", telh: "+16026212260",
    email: "support@noelexpressservices.com", email2: "service@noelexpressservices.com"
  };
  var qlang = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  var lang = qlang || ((window.R24_LANG === "auto" ? ((navigator.language || "en").slice(0, 2) === "es" ? "es" : "en") : (window.R24_LANG || "es")).slice(0, 2) === "en" ? "en" : "es");
  function L(es, en) { return lang === "en" ? en : es; }
  // Horario publicado (minutos desde las 0:00, hora de Arizona). 0 = domingo: cerrado. Sábado: 8:00 a 2:00.
  var LV = [[480, 1020]], SA = [[480, 840]];
  var H = { 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 6: SA, 0: [] };
  var DIAS = { es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var MESES = { es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
  function horarioTxt() {
    return L("Horario que publica el taller (hora de Arizona):\n• Lunes a viernes: 8:00 a.m. – 5:00 p.m.\n• Sábado: 8:00 a.m. – 2:00 p.m.\n• Domingo: cerrado",
      "Shop hours (Arizona time):\n• Monday–Friday: 8:00 AM – 5:00 PM\n• Saturday: 8:00 AM – 2:00 PM\n• Sunday: closed");
  }
  var HCORTO = { es: "lunes a viernes de 8 a 5 y sábado de 8 a 2", en: "Mon–Fri 8–5, Sat 8–2" };
  function hc() { return HCORTO[lang]; }
  function nowTx() {
    var q = (location.search.match(/[?&]r24now=([^&]+)/) || [])[1];
    if (q) { var p = decodeURIComponent(q).match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
      if (p) return { y: +p[1], m: +p[2] - 1, d: +p[3], dow: new Date(+p[1], +p[2] - 1, +p[3]).getDay(), min: +p[4] * 60 + +p[5] }; }
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Phoenix", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
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
    if ((H[n.dow] || []).some(function (r) { return n.min < r[0] || (n.min >= r[0] && r[1] - n.min >= 90); })) out.push({ dow: n.dow, label: L("Hoy", "Today") });
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
  function aviso() { return L("🔔 El taller recibe este pedido al instante (en esta demo no se envía nada).", "🔔 The shop gets this request instantly (nothing is sent in this demo)."); }
  var lastQ = "";
  function TEL1() { return { t: L("Llamar al " + C.tel, "Call " + C.tel), tel: C.telh }; }
  function MAPS1() { return { t: L("📍 Cómo llegar", "📍 Get directions"), url: C.maps }; }
  function PAGE(es, en, f) { return function () { return { t: L(es, en), url: (lang === "es" ? "es-" : "") + f, self: true }; }; }
  var SERVP = PAGE("Ver la página de servicios", "See the services page", "services.html");
  function Q(es, en, qes, qen) { return { get t() { return L(es, en); }, get q() { return L(qes || es, qen || en); } }; }
  var SVC = Q("🛠️ Servicios", "🛠️ Services", "servicios", "services");
  var HOR = Q("🕐 Horario y dirección", "🕐 Hours & location", "horario y direccion", "hours and location");
  var PARADO = Q("🚗 Mi auto no arranca", "🚗 My car won't start", "mi auto no arranca", "my car won't start");
  var MB = Q("🚘 Mercedes-Benz y europeos", "🚘 Mercedes-Benz & European", "mercedes benz y europeos", "mercedes benz and european");
  var INSP = Q("🔍 Inspección antes de comprar", "🔍 Pre-purchase inspection", "inspeccion antes de comprar", "pre purchase inspection");
  function dirA() { return L("Están en " + C.dir + " (la dirección de su web).\n📞 " + C.tel, "They're at " + C.dir + " (the address on their website).\n📞 " + C.tel); }
  function horarioA() {
    var n = nowTx(), s = isOpen(n) ? L("🟢 Ahora están abiertos, hasta las " + hm(closeAt(n)) + ".", "🟢 They're open now, until " + hm(closeAt(n)) + ".")
      : L("🌙 Ahora está cerrado" + (n.dow === 0 ? " (domingo)" : "") + "; abre " + nextOpening(n) + ". Igual le tomo el pedido ahora y el taller lo recibe al instante.", "🌙 It's closed right now" + (n.dow === 0 ? " (Sunday)" : "") + "; opens " + nextOpening(n) + ". I can still take your request now and the shop gets it instantly.");
    return horarioTxt() + "\n" + s;
  }
  function serviciosA() {
    return L("Lo que publica el taller (especialistas en Mercedes-Benz; atienden todos los vehículos europeos):\n• Reparación de vehículos: averías menores y mayores, con diagnóstico y reparación (cambio de piezas, afinación)\n• Mantenimiento preventivo: cambios de aceite, de líquido de transmisión, de bujías y otros\n• Inspección antes de comprar (por ejemplo, un Mercedes-Benz usado): revisan los componentes principales bajo el cofre y le cuentan lo que encuentran\n• Taller de carrocería\nDice además que el presupuesto es gratis y que respaldan su trabajo con garantías, también en las piezas. ¿Qué le pasa a su vehículo?",
      "What the shop lists (Mercedes-Benz specialists; they service all European vehicles):\n• Vehicle repairs: minor and major problems, with proper diagnosis and repair (part replacement, tune-ups)\n• Preventative maintenance: oil changes, transmission fluid changes, spark plug changes and more\n• Pre-purchase inspection (e.g. a used Mercedes-Benz): they inspect the major components under the hood and tell you what they find\n• Auto body shop\nTheir site also says estimates are free and that they stand behind their work with guarantees and parts warranties. What's going on with your vehicle?");
  }
  function noListA() {
    return L("Eso su web no lo nombra en particular. Sí dice que hacen reparaciones menores y mayores «sin importar cuál sea el problema», en vehículos europeos y sobre todo Mercedes-Benz, así que no se lo voy a asegurar: se lo confirma el taller. Llame al " + C.tel + " (" + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "Their site doesn't name that specifically. It does say they handle minor and major repairs \"no matter what the trouble\", on European vehicles and especially Mercedes-Benz, so I won't promise it: the shop will confirm. Call " + C.tel + " (" + hc() + "), or leave your number and they'll get back to you.");
  }
  function noPubA() {
    return L("Eso su web no lo dice, así que no se lo voy a inventar: se lo confirma el taller. Llame al " + C.tel + " (" + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "Their site doesn't say, so I won't make it up: the shop will confirm. Call " + C.tel + " (" + hc() + "), or leave your number and they'll get back to you.");
  }
  function S(es, en) { return function () { return L(es, en); }; }
  var EURO = /\b(mercedes|benz|mb|amg|sprinter|maybach|bmw|mini|audi|volkswagen|vw|porsche|volvo|jaguar|land ?rover|range ?rover|fiat|alfa|saab|smart|peugeot|renault|citroen|seat|skoda)\b/;
  var KB = [
    { id: "mercedes", k: ["mercedes", "mercedes benz", "benz", "amg", "sprinter", "europeo", "europeos", "europea", "bmw", "audi", "volkswagen", "vw", "porsche", "volvo", "mini cooper", "jaguar", "land rover", "especialistas", "especialidad", "marcas", "que marcas", "european", "specialist", "specialize", "brands", "what makes"],
      a: S("Sí: es su especialidad. Su web dice que atienden todos los vehículos europeos y se especializan en Mercedes-Benz, con técnicos que llevan décadas como especialistas certificados en Mercedes-Benz (en Inicio dice «más de 28 años» y en Nosotros «más de 38»), sin importar el modelo ni el año. ¿Le dejo pedido el presupuesto o la cita?",
        "Yes, that's their specialty. Their site says they service all European vehicles and specialize in Mercedes-Benz, with technicians who have spent decades as certified Mercedes-Benz specialists (Home says \"more than 28 years\", About Us \"more than 38\"), no matter the model or year. Want me to request an estimate or an appointment?"), c: [CITA_CHIP, INSP, LLAMADA_CHIP] },
    { id: "otramarca", k: ["toyota", "honda", "nissan", "ford", "chevy", "chevrolet", "dodge", "ram", "jeep", "gmc", "kia", "hyundai", "mazda", "subaru", "tesla", "lexus", "acura", "infiniti", "mitsubishi", "chrysler", "buick", "cadillac", "otras marcas", "americano", "japones", "other brands", "american car", "japanese car"],
      a: S("Su web dice que atienden todos los vehículos europeos y se especializan en Mercedes-Benz; otras marcas no las menciona, así que no se lo voy a asegurar: se lo confirma el taller. Si quiere, le dejo el pedido con su vehículo y le contactan.",
        "Their site says they service all European vehicles and specialize in Mercedes-Benz; it doesn't mention other makes, so I won't promise it: the shop will confirm. I can log your request with your vehicle and they'll get back to you."), c: [LLAMADA_CHIP, CITA_CHIP, TEL1] },
    { id: "inspeccion", k: ["inspeccion", "inspeccion previa", "antes de comprar", "comprar un auto", "comprar un carro", "comprar un mercedes", "auto usado", "carro usado", "revisar antes de comprar", "pre purchase", "pre-purchase", "prepurchase", "inspection", "before buying", "buying a used", "used car", "used mercedes"],
      a: S("Sí: inspección antes de comprar. Su web dice que es para quien quiere saber la verdad antes de invertir en un auto de lujo (por ejemplo, un Mercedes-Benz): revisan todos los componentes principales bajo el cofre y le cuentan lo que encuentran. ¿Le dejo pedida la inspección? Anoto el vehículo y el día que prefiere.",
        "Yes: pre-purchase inspection. Their site says it's for drivers who want the truth before investing in a luxury car (e.g. a Mercedes-Benz): they inspect all the major components under the hood and alert you to their findings. Want me to request the inspection? I'll note the vehicle and your preferred day."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "mantenimiento", k: ["mantenimiento", "preventivo", "aceite", "cambio de aceite", "bujias", "liquido de transmision", "servicio de rutina", "afinacion", "maintenance", "preventative", "preventive", "oil", "oil change", "spark plugs", "transmission fluid", "tune up", "tune-up", "service interval"],
      a: S("Sí: mantenimiento preventivo. Su web nombra cambios de aceite, de líquido de transmisión y de bujías, «y muchos otros», y recomienda seguir el manual del propietario para saber cada cuánto toca cada servicio. Le dejo pedido el día que prefiera; abren de lunes a viernes de 8 a 5 y el sábado de 8 a 2.",
        "Yes: preventative maintenance. Their site names oil changes, transmission fluid changes and spark plug changes \"and many other\" services, and recommends following your owner's manual for how often each is due. I can request the day you prefer; they're open Mon–Fri 8–5 and Saturday 8–2."), c: [CITA_CHIP, HOR] },
    { id: "reparacion", k: ["reparacion", "reparar", "arreglar", "falla", "fallas", "averia", "se descompuso", "ruido", "luz del motor", "check engine", "luz del tablero", "testigo", "diagnostico", "motor", "transmision", "tironea", "repair", "repairs", "fix", "broke", "breakdown", "problem", "noise", "warning light", "dashboard light", "diagnosis", "diagnostic", "engine", "transmission"],
      a: S("Sí: reparación de vehículos. Su web dice que atienden problemas menores y mayores: empiezan con una inspección para diagnosticar bien la falla y, una vez encontrada la causa, se ponen a reparar para que el vehículo no pase fuera de circulación más de lo necesario (muchas veces es solo una pieza o una afinación). ¿Le dejo pedida la revisión?",
        "Yes: vehicle repairs. Their site says they handle minor and major problems: they start with an inspection to properly diagnose the trouble and, once they find the culprit, get to work so your vehicle isn't off the road longer than necessary (often it's just a minor part or a tune-up). Want me to request a check?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "carroceria", k: ["carroceria", "hojalateria", "chapa", "pintura", "choque", "golpe", "abolladura", "defensa", "rayon", "auto body", "body shop", "body work", "collision", "dent", "paint", "bumper", "scratch"],
      a: S("Sí: tienen taller de carrocería («el mejor servicio de carrocería de la ciudad», dice su web), con equipos nuevos para vehículos europeos. Qué trabajos de carrocería hacen en detalle no lo publica: con una foto del daño el taller le dice qué hace falta. ¿Le dejo pedido el presupuesto?",
        "Yes: they have an auto body shop (\"Best Auto Body Service in Town\", their site says), with the latest equipment for European vehicles. The site doesn't detail which body jobs they do: with a photo of the damage, the shop tells you what's needed. Want me to request the estimate?"), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "nomaneja", k: ["no arranca", "no prende", "no enciende", "no anda", "varado", "varada", "me quede", "bateria descargada", "emergencia", "urgente", "grua", "remolque", "remolcar", "won t start", "wont start", "no start", "not running", "stranded", "broke down", "dead battery", "emergency", "urgent", "tow", "towing", "tow truck"],
      a: function () { var n = nowTx(); return L("Lo siento. Su web no publica servicio de grúa, así que no se lo voy a prometer. Lo que sí hago: le dejo el pedido con el vehículo marcado como parado (o que necesita grúa) y el taller le llama o le escribe y le dice cómo llevarlo." + (isOpen(n) ? " Ahora están abiertos: también puede llamar al " + C.tel + "." : " Ahora está cerrado (abre " + nextOpening(n) + "); su pedido le llega igual al instante."),
        "Sorry to hear that. Their site doesn't list towing, so I won't promise it. What I can do: log your request with the vehicle marked as down (or needing a tow) and the shop calls or texts you back and tells you how to get it there." + (isOpen(n) ? " They're open now: you can also call " + C.tel + "." : " It's closed now (opens " + nextOpening(n) + "); your request still reaches them instantly.")); }, c: [CITA_CHIP, LLAMADA_CHIP, TEL1] },
    { id: "nolist", k: ["frenos", "balatas", "pastillas", "aire acondicionado", "aire", "a c", "ac", "no enfria", "electrico", "alternador", "bateria", "llantas", "neumaticos", "alineacion", "balanceo", "suspension", "amortiguadores", "smog", "emisiones", "vidrios", "parabrisas", "brakes", "pads", "air conditioning", "not cooling", "electrical", "alternator", "battery", "tires", "alignment", "suspension", "shocks", "emissions", "windshield"], a: noListA, c: [TEL1, LLAMADA_CHIP, CITA_CHIP] },
    { id: "servicios", k: ["servicios", "que hacen", "que reparan", "que arreglan", "trabajos", "mecanica", "mecanico", "taller", "services", "what do you fix", "what do you do", "mechanic"], a: serviciosA, c: [CITA_CHIP, SERVP, LLAMADA_CHIP] },
    { id: "precio", k: ["precio", "precios", "cuanto cuesta", "cuanto sale", "cuanto cobran", "costo", "caro", "barato", "descuento", "especial", "presupuesto gratis", "es gratis", "price", "prices", "how much", "cost", "cheap", "rates", "discount", "special", "free estimate"],
      a: S("Los precios se los da el taller: esta recepción no da precios ni los inventa. Su web dice que el presupuesto es gratis y que el costo solo lo pueden decir después de revisar el vehículo y encontrar el problema. Lo que puedo hacer: dejarle pedido el presupuesto con su vehículo, lo que le pasa y una foto, y le contactan.",
        "Pricing comes from the shop: this front desk doesn't quote or make up prices. Their site says estimates are free and that they can only give the cost after assessing the vehicle and finding the trouble. What I can do: request the estimate with your vehicle, what's going on and a photo, and they'll get back to you."), c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "garantia", k: ["garantia", "garantias", "garantizado", "warranty", "warranties", "guarantee", "guarantees"],
      a: S("Su web dice que respaldan su trabajo con garantías, también en las piezas. Qué cubren y por cuánto tiempo no lo publica, así que no se lo voy a inventar: se lo confirma el taller.",
        "Their site says they stand behind their work with guarantees and parts warranties. What they cover and for how long isn't published, so I won't make it up: the shop will confirm."), c: [LLAMADA_CHIP, CITA_CHIP] },
    { id: "financiamiento", k: ["financiamiento", "financiar", "financiacion", "snap", "snap finance", "a plazos", "plan de pagos", "cuotas", "credito", "financing", "finance", "payment plan", "credit"],
      a: S("Su web tiene en la portada un botón de Snap Finance para solicitar financiamiento. Las condiciones no las publica, así que no se las voy a inventar: se las confirma el taller.",
        "Their home page has a Snap Finance button to apply for financing. The terms aren't published, so I won't make them up: the shop will confirm."), c: [LLAMADA_CHIP, CITA_CHIP] },
    { id: "nopub", k: ["zelle", "efectivo", "tarjeta", "formas de pago", "como pago", "cuanto tarda", "cuanto tiempo", "mismo dia", "carro de cortesia", "auto de cortesia", "cash", "card", "payment", "how long", "same day", "loaner"], a: noPubA, c: [TEL1, LLAMADA_CHIP] },
    { id: "walkin", k: ["sin cita", "walk in", "walk-in", "puedo ir", "puedo llegar", "llegar sin avisar", "necesito cita", "dejar el carro", "dejar el auto", "without appointment", "drop by", "stop by", "drop off", "need an appointment"],
      a: S("Su web no dice si atienden sin cita; lo que publica es el teléfono 602-621-2260, el formulario de contacto y el horario (lunes a viernes de 8 a 5, sábado de 8 a 2, domingo cerrado). Para no ir en balde, le dejo aquí pedida la cita y el taller le confirma, o llame al 602-621-2260.",
        "Their site doesn't say whether they take walk-ins; it lists the phone 602-621-2260, the contact form and hours (Mon–Fri 8–5, Sat 8–2, closed Sunday). To be safe, I can request the appointment here and the shop confirms, or call 602-621-2260."), c: [CITA_CHIP, TEL1] },
    { id: "idioma", k: ["espanol", "hablan espanol", "ingles", "spanish", "english", "speak spanish", "bilingue", "bilingual", "se habla"],
      a: S("Su web tiene versión en español; si en el taller le atienden en español no lo dice, así que se lo confirman ellos. Aquí le atiendo en los dos idiomas (botón EN arriba) y anoto en qué idioma prefiere que le contacten.", "Their site has a Spanish version; it doesn't say whether staff speak Spanish, so the shop will confirm. I can help you in English or Spanish (ES button at the top)."), c: [CITA_CHIP] },
    { id: "historia", k: ["dueno", "quien", "quienes son", "experiencia", "certificado", "certificados", "historia", "confianza", "desde cuando", "anos", "owner", "who", "experience", "certified", "trust", "since when", "years"],
      a: S("Noels Express Services & Auto Body es un taller de Phoenix especializado en Mercedes-Benz y vehículos europeos, con taller de carrocería. Su web dice que sus técnicos llevan décadas como especialistas certificados en Mercedes-Benz («más de 28 años» en Inicio, «más de 38» en Nosotros), que tratan su auto como si fuera propio y que prefieren hacer las cosas bien a tomar atajos.",
        "Noels Express Services & Auto Body is a Phoenix shop specializing in Mercedes-Benz and European vehicles, with an auto body shop. Their site says their technicians have spent decades as certified Mercedes-Benz specialists (\"more than 28 years\" on Home, \"more than 38\" on About Us), that they treat your car like their own and would rather do it right than cut corners."), c: [CITA_CHIP, PAGE("Ver «Nosotros»", "See \"About Us\"", "about-us.html")] },
    { id: "horario", k: ["horario", "horas", "abren", "abierto", "cierran", "a que hora", "sabado", "domingo", "fin de semana", "lunes", "hoy abren", "hours", "open", "close", "closing", "saturday", "sunday", "weekend"], a: horarioA, c: [CITA_CHIP, LLAMADA_CHIP] },
    { id: "direccion", k: ["donde", "direccion", "ubicacion", "ubicados", "como llego", "llegar", "yuma", "elwood", "address", "location", "where", "directions", "located"],
      a: function () { return dirA() + L("\nSi quiere, le dejo pedido el presupuesto o la cita y el taller le confirma.", "\nI can request the estimate or appointment and the shop confirms."); }, c: [MAPS1, CITA_CHIP] },
    { id: "contacto", k: ["telefono", "telefonos", "numero", "llamar", "contacto", "correo", "email", "mail", "whatsapp", "wasap", "watsap", "texto", "mensaje de texto", "sms", "formulario", "facebook", "phone", "number", "call", "text", "contact", "form"],
      a: S("Canales que publica el taller:\n📞 602-621-2260 (lunes a viernes de 8:00 a.m. a 5:00 p.m., sábado de 8:00 a.m. a 2:00 p.m.)\n✉️ Correo: support@noelexpressservices.com (y service@noelexpressservices.com en el ícono de correo)\n📝 El formulario de «Contacto» (dice que le responden «lo antes posible»)\nSu web no publica WhatsApp. O deje aquí su teléfono y le contactan ellos, por llamada o por texto.",
        "Channels the shop publishes:\n📞 602-621-2260 (Mon–Fri 8:00 AM – 5:00 PM, Sat 8:00 AM – 2:00 PM)\n✉️ Email: support@noelexpressservices.com (and service@noelexpressservices.com on the email icon)\n📝 The \"Contact Us\" form (it says they'll reply \"as soon as possible\")\nTheir site doesn't list WhatsApp. Or leave your number here and they'll reach out, by call or text."), c: [TEL1, LLAMADA_CHIP] },
    { id: "gracias", k: ["gracias", "muchas gracias", "perfecto", "adios", "thanks", "thank you", "bye", "great"], a: S("¡Con gusto! Si necesita algo más, aquí estoy. 🔧", "You're welcome! I'm here if you need anything else. 🔧"), c: [CITA_CHIP] }
  ];
  var CITA_K = ["cita", "presupuesto", "cotizacion", "cotizar", "estimado", "estimacion", "agendar", "reservar", "turno", "programar", "llevar el carro", "llevar mi carro", "llevar mi auto", "appointment", "estimate", "quote", "book", "schedule", "bring my car"];
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
  function looksEnglish(n) { var w = n.split(" "), en = ["the", "my", "is", "do", "you", "what", "how", "car", "truck", "are", "your", "can", "open", "hours", "much", "need", "want", "when", "where", "does", "have", "i", "not", "won", "start"]; var c = w.filter(function (x) { return en.indexOf(x) >= 0; }).length; return c >= 2 && !/[ñ]|\b(el|la|los|mi|que|como|cuanto|tienen|hacen|carro|auto|camioneta)\b/.test(n); }
  function looksSpanish(n) { return /\b(hola|cuanto|tienen|hacen|ustedes|carro|camioneta|troca|precio|horario|donde|necesito|quiero|mi carro|mi auto|gracias|cual|frenos|aceite|arranca|grua|espanol)\b/.test(n); }
  function byId(id) { return KB.filter(function (e) { return e.id === id; })[0]; }

  var body, input, status, panel, launch, fileIn, opened = false;
  var flow = null;
  function el(tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function linkify(s) { return esc(s).replace(/\(?602\)?[- ]621-2260/g, function (m) { return '<a href="tel:+16026212260">' + m + '</a>'; }).replace(/(support|service)@noelexpressservices\.com/g, function (m) { return '<a href="mailto:' + m + '">' + m + '</a>'; }); }
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
  }  function statusText() {
    var n = nowTx();
    if (isOpen(n)) { status.className = "r24-status"; status.textContent = L("🟢 Abierto ahora · hasta las " + hm(closeAt(n)) + " · " + C.tel, "🟢 Open now · until " + hm(closeAt(n)) + " · " + C.tel); }
    else { status.className = "r24-status r24-closed"; status.textContent = L("🌙 Fuera de horario (abre " + nextOpening(n) + ") · le atiendo igual y el taller recibe su pedido", "🌙 After hours (opens " + nextOpening(n) + ") · I'll still take your request"); }
  }
  function menuChips() { return [CITA_CHIP, PARADO, MB, SVC, HOR, LLAMADA_CHIP]; }
  var banner;
  function headTexts() {
    panel.querySelector(".r24-ht b").innerHTML = L("Recepción 24 h", "24/7 Front Desk") + ' <span class="r24-online">● ' + L("en línea", "online") + "</span>";
    panel.querySelector(".r24-ht small").textContent = C.corto + " · Phoenix, AZ";
    panel.querySelector(".r24-in").placeholder = L("Escriba su pregunta…", "Type your question…");
    panel.querySelector(".r24-send").textContent = L("Enviar", "Send");
    panel.querySelector(".r24-lang").textContent = lang === "en" ? "ES" : "EN";
    panel.querySelector(".r24-lang").setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    panel.querySelector(".r24-legal").textContent = L("Asistente automático de demostración · sus datos no se envían a ningún sitio", "Automated demo assistant · your data isn't sent anywhere");
    launch.querySelector(".r24-lt").textContent = L("Recepción 24 h", "24/7 Front Desk");
    launch.setAttribute("aria-label", L("Abrir la recepción 24 h", "Open the 24/7 front desk"));
    banner.textContent = L("Demo privada preparada para Noels Express Services & Auto Body", "Private demo prepared for Noels Express Services & Auto Body");
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
    addBot(L((ab ? "Claro. Ahora están abiertos: llame al " + C.tel + " y le atiende una persona del taller." : "Claro. Ahora el taller está cerrado" + (n.dow === 0 ? " (el domingo no abren)" : "") + "; abre " + nextOpening(n) + ". En horario puede llamar al " + C.tel + ".") + " Si prefiere, le contactan ellos: déjeme su nombre y teléfono y el pedido les llega al instante.",
      (ab ? "Sure. They're open now: call " + C.tel + " and a person at the shop will help you." : "Sure. The shop is closed right now" + (n.dow === 0 ? " (closed on Sunday)" : "") + "; it opens " + nextOpening(n) + ". During business hours you can call " + C.tel + ".") + " Or they can reach out to you: leave your name and number and they get the request instantly."), [TEL1(), LLAMADA_CHIP, CITA_CHIP]);
  }
  function greet() {
    addBot(L("¡Hola! 👋 Soy el asistente virtual con IA de Noels Express Services & Auto Body (taller de Phoenix especializado en Mercedes-Benz y vehículos europeos, con carrocería). Le ayudo a pedir un presupuesto o una cita, le tomo los datos para que el taller lo llame o le escriba, o le cuento servicios, horario y dirección, a cualquier hora: también de noche y el domingo, o cuando nadie puede atender el teléfono.\n¿En qué le ayudo?",
      "Hi! 👋 I'm the AI virtual assistant for Noels Express Services & Auto Body (a Phoenix shop specializing in Mercedes-Benz and European vehicles, with an auto body shop). I can set up an estimate or an appointment, take your details so the shop calls or texts you back, or answer questions about services, hours and location — any time, including nights and Sundays, or when nobody can pick up the phone.\nHow can I help?"), menuChips());
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
  function SINT() { return lang === "en" ? ["Repair (breakdown, noise, warning light)", "Won't start", "Maintenance (oil, transmission fluid, spark plugs)", "Pre-purchase inspection", "Body work (dent, collision, paint)", "Other / not sure"]
    : ["Reparación (falla, ruido, luz del tablero)", "No arranca", "Mantenimiento (aceite, líquido de transmisión, bujías)", "Inspección antes de comprar", "Carrocería (golpe, abolladura, pintura)", "Otra cosa / no sé"]; }
  function ESTADO() { return opts([L("✅ Anda, puedo llevarlo", "✅ It runs, I can drive it in"), L("⚠️ Anda, pero con falla", "⚠️ It runs, but barely"), L("⛔ No arranca / está parado", "⛔ Won't start / it's down"), L("🚛 Necesita grúa", "🚛 Needs a tow")]); }
  function FOTO() { return [{ t: L("📷 Subir foto", "📷 Upload photo"), foto: true }, { t: L("Sin foto", "No photo"), v: "__nofoto", flow: true }]; }
  function MEDIO() { return opts([L("📞 Llamada", "📞 Phone call"), L("💬 Mensaje de texto", "💬 Text message")]); }
  function franjas(dow) {
    if (dow === 6) return opts([L("Sábado 8:00 a.m. – 2:00 p.m.", "Saturday 8:00 AM – 2:00 PM")]);
    return opts([L("Mañana (8:00 a.m. – 12:00 p.m.)", "Morning (8:00 AM – 12:00 PM)"), L("Tarde (12:00 – 5:00 p.m.)", "Afternoon (12:00 – 5:00 PM)"), L("Me da igual", "Either is fine")]);
  }
  function startCita() {
    flow = { step: "tipo", d: { tipo: "cita" } };
    addBot(L("¡Con gusto! En unos pasos le dejo el pedido listo para el taller. (Escriba «cancelar» si quiere salir.)\n¿Qué necesita?", "Happy to help! A few quick steps and your request is ready for the shop. (Type \"cancel\" to exit.)\nWhat do you need?"),
      opts([L("Presupuesto / diagnóstico", "Estimate / diagnosis"), L("Cita para llevar el vehículo", "Appointment to bring the vehicle in")]));
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
    if (step === "vehiculo") addBot(L("¿Año, marca y modelo del vehículo? (por ejemplo: 2015 Mercedes-Benz C300)", "Year, make and model? (e.g. 2015 Mercedes-Benz C300)"));
    else if (step === "sintoma") addBot(L("¿Qué le pasa o qué servicio necesita?", "What's going on, or what service do you need?"), opts(SINT()));
    else if (step === "estado") addBot(L("¿El vehículo anda o está parado? (Solo lo anoto para el taller; su web no publica servicio de grúa.)", "Does the vehicle run, or is it down? (I just note it for the shop; their site doesn't list towing.)"), ESTADO());
    else if (step === "foto") { if (d.foto) { ask("dia"); return; } addBot(L("¿Tiene una foto (de la luz del tablero, la fuga, el golpe o la pieza)? Es opcional y ayuda al taller a preparar el presupuesto.", "Do you have a photo (the dashboard light, the leak, the dent or the part)? It's optional and helps the shop prepare the estimate."), FOTO()); }
    else if (step === "dia") {
      var days = nextWorkdays(n, 6); flow.days = {}; days.forEach(function (x) { flow.days[x.label] = x.dow; });
      addBot(L("¿Qué día le queda mejor? Lo anoto como preferencia y el taller se lo confirma. Abren de lunes a viernes de 8:00 a.m. a 5:00 p.m. y el sábado de 8:00 a.m. a 2:00 p.m.; el domingo, cerrado.", "Which day works best? I'll note it as a preference and the shop confirms. They're open Monday–Friday 8:00 AM – 5:00 PM and Saturday 8:00 AM – 2:00 PM; closed Sunday."),
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
          : L("Bien. Aquí no doy precios: el presupuesto (gratis, según su web) se lo da el taller después de ver los datos o el vehículo.", "Got it. I don't quote prices here: the estimate (free, per their site) comes from the shop after reviewing the details or the vehicle."));
        setTimeout(function () { ask("vehiculo"); }, 600); return;
      case "vehiculo":
        if (t.length < 2) { ask("vehiculo"); return; }
        d.vehiculo = t.slice(0, 60);
        var nx = d.form && d.sintoma ? "estado" : "sintoma";
        if (!EURO.test(n)) { addBot(L("Anotado. Su web dice que atienden todos los vehículos europeos y se especializan en Mercedes-Benz; si trabajan con su marca se lo confirma el taller en el pedido.", "Noted. Their site says they service all European vehicles and specialize in Mercedes-Benz; whether they work on your make, the shop confirms with your request.")); setTimeout(function () { ask(nx); }, 600); return; }
        ask(nx); return;
      case "sintoma": d.sintoma = t.slice(0, 100); ask("estado"); return;
      case "estado":
        d.estado = t.slice(0, 50);
        if (/parad|no arranca|grua|down|won.t start|tow/i.test(n)) addBot(L("Anotado: el taller ve en el pedido que el vehículo " + (/grua|tow/i.test(n) ? "necesita grúa" : "no arranca o está parado") + " y le dice cómo llevarlo. No le prometo grúa porque su web no la ofrece.", "Noted: the shop will see the vehicle " + (/grua|tow/i.test(n) ? "needs a tow" : "won't start or is down") + " and tell you how to get it there. I won't promise a tow since their site doesn't offer one."));
        setTimeout(function () { ask("foto"); }, /parad|grua|down|tow|arranca|start/i.test(n) ? 700 : 0); return;
      case "foto":
        if (t !== "__nofoto") d.foto = L("la describe: ", "described: ") + t.slice(0, 60);
        ask("dia"); return;
      case "dia":
        d.dia = t.slice(0, 60); d.dow = flow.days && flow.days[t] != null ? flow.days[t] : -1;
        if (/^(lo antes posible|as soon as possible)$/i.test(t)) { d.franja = L("La primera disponible", "First available"); ask(d.nombre ? "medio" : "nombre"); return; }
        if (/domingo|sunday/i.test(t)) { addBot(L("El domingo el taller está cerrado. ¿Otro día?", "The shop is closed on Sunday. Another day?")); setTimeout(function () { ask("dia"); }, 500); return; }
        if (d.dow === 6) { d.franja = L("Sábado 8:00 a.m. – 2:00 p.m.", "Saturday 8:00 AM – 2:00 PM"); addBot(L("El sábado abren solo de 8:00 a.m. a 2:00 p.m.; lo anoto en esa franja.", "On Saturday they're open only 8:00 AM – 2:00 PM; I'll note that window.")); setTimeout(function () { ask(d.nombre ? "medio" : "nombre"); }, 500); return; }
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
        if (!/^[2-9]\d{9}$/.test(ph)) { addBot(L("Ese número no me cuadra. Escríbalo con 10 cifras (con código de área), por ejemplo 602-555-0123.", "That number doesn't look right. Please use 10 digits with area code, e.g. 602-555-0123.")); return; }
        d.telefono = ph.slice(0, 3) + "-" + ph.slice(3, 6) + "-" + ph.slice(6);
        ask("resumen"); return;
      case "resumen":
        if (t === "__ok" || /^(si|sí|ok|confirmo|confirmar|correcto|dale|yes|confirm|sure|yep)/.test(n)) {
          var nm2 = d.nombre.split(" ")[0], DEMO = L("\n\n(Versión de demostración: esta solicitud no se envió al taller.)", "\n\n(Demo version: this request was not sent to the shop.)"), tx = /texto|text/i.test(medioTxt(d));
          if (d.tipo === "llamada") { addBot(L("¡Listo, " + nm2 + "! ✅ El taller recibe su pedido al instante y le " + (tx ? "escribe" : "llama") + " al " + d.telefono + ".", "All set, " + nm2 + "! ✅ The shop gets your request instantly and will " + (tx ? "text" : "call") + " you at " + d.telefono + ".") + DEMO, [CITA_CHIP, Q("Otra pregunta", "Another question", "__menu", "__menu")]); flow = null; return; }
          addBot(L("¡Listo, " + nm2 + "! ✅ Su solicitud quedó registrada en Noels Express.\nEl taller le " + (tx ? "escribe" : "llama") + " al " + d.telefono + " para confirmar el día y la hora; el presupuesto se lo dan ellos.", "All set, " + nm2 + "! ✅ Your request is in at Noels Express.\nThe shop will " + (tx ? "text" : "call") + " you at " + d.telefono + " to confirm the day and time; the estimate comes from them.") + DEMO, [MAPS1(), Q("Otra pregunta", "Another question", "__menu", "__menu")]);
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
    addBot(L("Eso se lo confirma mejor el taller, así tiene el dato exacto. 😊\nLlame al " + C.tel + " (" + hc() + "), o déjeme su teléfono y le contactan ellos.",
      "The shop can confirm that for you so you get the exact answer. 😊\nCall " + C.tel + " (" + hc() + "), or leave your number and they'll get back to you."), [TEL1, LLAMADA_CHIP, CITA_CHIP]);
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
    if (/^(horario y direccion|hours and location)$/.test(n)) { addBot(horarioA() + "\n\n" + dirA(), [CITA_CHIP, MAPS1, LLAMADA_CHIP]); return; }
    if (/^(mercedes benz y europeos|mercedes benz and european)$/.test(n)) { reply(byId("mercedes")); return; }
    if (/^(inspeccion antes de comprar|pre purchase inspection)$/.test(n)) { reply(byId("inspeccion")); return; }
    if (/\b(que me llamen|llamenme|que me escriban|escribanme|textean|call me back|text me|callback|call back)\b/.test(n)) { startLlamada(); return; }
    if (/\b(persona|humano|alguien real|asesor|person|human|someone real|real person)\b/.test(n)) { humano(); return; }
    if (isWalkinQ(n)) { reply(byId("walkin")); return; }
    var bi = bestIntent(t);
    var price = isPriceQ(n);
    if (wantsCita(n) && !price && !(bi && bi.e && bi.e.id === "precio" && /\?|es gratis|is it free|sin compromiso|no obligation/.test(t)) && (!bi || bi.s < 2 || /cita|presupuesto|cotiz|appointment|estimate|quote|schedule|book/.test(n))) { startCita(); return; }
    if (price && !(bi && (bi.e.id === "nolist" || bi.e.id === "otramarca"))) { reply(byId("precio")); return; }
    if (bi) { reply(bi.e); return; }
    lastQ = t; fallback();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
  window.R24 = { open: open, fromForm: function (f) { if (panel) fromForm(f); }, setLang: function (l) { if (panel) setLang(l === "en" ? "en" : "es", opened); }, _test: { bestIntent: bestIntent, norm: norm, nowTx: nowTx, lang: function () { return lang; } } };
})();
